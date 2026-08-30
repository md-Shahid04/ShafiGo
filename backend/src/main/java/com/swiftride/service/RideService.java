package com.swiftride.service;

import com.swiftride.dto.request.RideBookingRequest;
import com.swiftride.dto.request.RideCancelRequest;
import com.swiftride.dto.response.RideDto;
import com.swiftride.dto.response.RideEstimateResponse;
import com.swiftride.entity.*;
import com.swiftride.exception.BadRequestException;
import com.swiftride.exception.ConflictException;
import com.swiftride.exception.ResourceNotFoundException;
import com.swiftride.repository.DriverRepository;
import com.swiftride.repository.RideRepository;
import com.swiftride.repository.UserRepository;
import com.swiftride.util.EntityMapper;
import com.swiftride.util.GeoUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RideService {

    private static final Logger log = LoggerFactory.getLogger(RideService.class);

    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final PricingService pricingService;
    private final MatchingService matchingService;
    private final WebSocketEventPublisher eventPublisher;
    private final DriverEarningService driverEarningService;

    public RideService(
            RideRepository rideRepository,
            UserRepository userRepository,
            DriverRepository driverRepository,
            PricingService pricingService,
            MatchingService matchingService,
            WebSocketEventPublisher eventPublisher,
            DriverEarningService driverEarningService
    ) {
        this.rideRepository = rideRepository;
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.pricingService = pricingService;
        this.matchingService = matchingService;
        this.eventPublisher = eventPublisher;
        this.driverEarningService = driverEarningService;
    }

    @Transactional
    public RideDto requestRide(Long riderUserId, RideBookingRequest request) {
        User rider = userRepository.findById(riderUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Rider not found"));

        // Check if rider already has an active pending/in-progress ride
        boolean hasActiveRide = rideRepository.findFirstByRiderIdAndStatusInOrderByCreatedAtDesc(riderUserId, List.of(
                RideStatus.REQUESTED, RideStatus.SEARCHING_DRIVER,
                RideStatus.DRIVER_ACCEPTED, RideStatus.DRIVER_ARRIVING,
                RideStatus.DRIVER_ARRIVED, RideStatus.RIDE_STARTED
        )).isPresent();

        if (hasActiveRide) {
            throw new BadRequestException("You already have an active or pending ride in progress");
        }

        // Calculate distance and duration
        double distanceKm = GeoUtils.calculateDistanceKm(
                request.getPickupLatitude(), request.getPickupLongitude(),
                request.getDestinationLatitude(), request.getDestinationLongitude()
        );
        int durationMinutes = GeoUtils.estimateDurationMinutes(distanceKm);

        RideEstimateResponse estimates = pricingService.calculateEstimate(
                request.getPickupLatitude(), request.getPickupLongitude(),
                request.getDestinationLatitude(), request.getDestinationLongitude()
        );

        Double estimatedFare = estimates.getEstimatedFares().get(request.getVehicleType());
        if (estimatedFare == null) {
            estimatedFare = pricingService.calculateFare(distanceKm, durationMinutes, request.getVehicleType());
        }

        Ride ride = Ride.builder()
                .rider(rider)
                .pickupLatitude(request.getPickupLatitude())
                .pickupLongitude(request.getPickupLongitude())
                .pickupAddress(request.getPickupAddress())
                .destinationLatitude(request.getDestinationLatitude())
                .destinationLongitude(request.getDestinationLongitude())
                .destinationAddress(request.getDestinationAddress())
                .vehicleType(request.getVehicleType())
                .status(RideStatus.SEARCHING_DRIVER)
                .distanceKm(distanceKm)
                .estimatedDurationMinutes(durationMinutes)
                .estimatedFare(estimatedFare)
                .requestedAt(LocalDateTime.now())
                .build();

        Ride savedRide = rideRepository.save(ride);
        log.info("[RIDE] Ride created with ID: {} by Rider: {}", savedRide.getId(), rider.getEmail());

        // Dispatch notification to nearby available drivers
        matchingService.dispatchRideToNearbyDrivers(savedRide);

        // Notify Admin Feed
        eventPublisher.publishRideRequestedToAdmin(savedRide);

        return EntityMapper.toRideDto(savedRide);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public RideDto acceptRide(Long driverUserId, Long rideId) {
        User currentUser = userRepository.findById(driverUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Driver driver = driverRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));

        if (driver.getVerificationStatus() != DriverVerificationStatus.APPROVED) {
            throw new BadRequestException("Driver is not approved to accept rides");
        }

        Vehicle activeVehicle = driver.getVehicles().stream()
                .filter(Vehicle::getActive)
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Driver has no active vehicle selected"));

        Ride ride = rideRepository.findByIdForUpdate(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + rideId));

        if (ride.getStatus() != RideStatus.SEARCHING_DRIVER && ride.getStatus() != RideStatus.REQUESTED) {
            throw new ConflictException("Ride has already been accepted or is no longer available (Status: " + ride.getStatus() + ")");
        }

        ride.setDriver(driver);
        ride.setVehicle(activeVehicle);
        ride.setStatus(RideStatus.DRIVER_ACCEPTED);
        ride.setAcceptedAt(LocalDateTime.now());

        driver.setOnlineStatus(DriverOnlineStatus.BUSY);
        driverRepository.save(driver);

        Ride updatedRide = rideRepository.save(ride);
        matchingService.cleanupRideOffers(rideId);

        log.info("[RIDE] Driver ID #{} successfully accepted Ride #{}", driver.getId(), rideId);
        eventPublisher.publishRideAccepted(updatedRide);

        return EntityMapper.toRideDto(updatedRide);
    }

    @Transactional
    public RideDto declineRide(Long driverUserId, Long rideId) {
        Driver driver = driverRepository.findByUserId(driverUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + rideId));

        matchingService.handleDriverDecline(rideId, driver.getId(), ride);
        return EntityMapper.toRideDto(ride);
    }

    @Transactional
    public RideDto markDriverArriving(Long driverUserId, Long rideId) {
        Ride ride = getRideForDriver(driverUserId, rideId);
        if (ride.getStatus() != RideStatus.DRIVER_ACCEPTED) {
            throw new BadRequestException("Ride cannot transition to DRIVER_ARRIVING from " + ride.getStatus());
        }

        ride.setStatus(RideStatus.DRIVER_ARRIVING);
        Ride updated = rideRepository.save(ride);
        eventPublisher.publishDriverArriving(updated);
        return EntityMapper.toRideDto(updated);
    }

    @Transactional
    public RideDto markDriverArrived(Long driverUserId, Long rideId) {
        Ride ride = getRideForDriver(driverUserId, rideId);
        if (ride.getStatus() != RideStatus.DRIVER_ACCEPTED && ride.getStatus() != RideStatus.DRIVER_ARRIVING) {
            throw new BadRequestException("Ride cannot transition to DRIVER_ARRIVED from " + ride.getStatus());
        }

        ride.setStatus(RideStatus.DRIVER_ARRIVED);
        ride.setArrivedAt(LocalDateTime.now());
        Ride updated = rideRepository.save(ride);
        eventPublisher.publishDriverArrived(updated);
        return EntityMapper.toRideDto(updated);
    }

    @Transactional
    public RideDto startRide(Long driverUserId, Long rideId) {
        Ride ride = getRideForDriver(driverUserId, rideId);
        if (ride.getStatus() != RideStatus.DRIVER_ARRIVED && ride.getStatus() != RideStatus.DRIVER_ACCEPTED && ride.getStatus() != RideStatus.DRIVER_ARRIVING) {
            throw new BadRequestException("Ride cannot be started from state: " + ride.getStatus());
        }

        ride.setStatus(RideStatus.RIDE_STARTED);
        ride.setStartedAt(LocalDateTime.now());
        Ride updated = rideRepository.save(ride);
        eventPublisher.publishRideStarted(updated);
        return EntityMapper.toRideDto(updated);
    }

    @Transactional
    public RideDto completeRide(Long driverUserId, Long rideId) {
        Ride ride = getRideForDriver(driverUserId, rideId);
        if (ride.getStatus() != RideStatus.RIDE_STARTED) {
            throw new BadRequestException("Cannot complete ride that is not in progress (Current state: " + ride.getStatus() + ")");
        }

        ride.setStatus(RideStatus.RIDE_COMPLETED);
        ride.setCompletedAt(LocalDateTime.now());
        ride.setFinalFare(ride.getEstimatedFare());

        Driver driver = ride.getDriver();
        driver.setOnlineStatus(DriverOnlineStatus.ONLINE);
        driver.setTotalRides(driver.getTotalRides() + 1);
        driverRepository.save(driver);

        Ride updated = rideRepository.save(ride);
        matchingService.cleanupRideOffers(rideId);

        // Record driver earning in database
        driverEarningService.recordRideEarning(updated);

        eventPublisher.publishRideCompleted(updated);
        return EntityMapper.toRideDto(updated);
    }

    @Transactional
    public RideDto cancelRide(Long userId, Long rideId, RideCancelRequest request) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found: " + rideId));

        boolean isRider = ride.getRider().getId().equals(userId);
        boolean isDriver = ride.getDriver() != null && ride.getDriver().getUser().getId().equals(userId);

        if (!isRider && !isDriver) {
            throw new BadRequestException("You are not authorized to cancel this ride");
        }

        if (ride.getStatus() == RideStatus.RIDE_COMPLETED || ride.getStatus() == RideStatus.CANCELLED) {
            throw new BadRequestException("Cannot cancel ride with status: " + ride.getStatus());
        }

        ride.setStatus(RideStatus.CANCELLED);
        ride.setCancellationReason(request != null ? request.getReason() : "Cancelled by user");
        ride.setCancelledAt(LocalDateTime.now());

        if (ride.getDriver() != null) {
            Driver driver = ride.getDriver();
            driver.setOnlineStatus(DriverOnlineStatus.ONLINE);
            driverRepository.save(driver);
        }

        Ride updated = rideRepository.save(ride);
        matchingService.cleanupRideOffers(rideId);
        eventPublisher.publishRideCancelled(updated);
        return EntityMapper.toRideDto(updated);
    }

    @Transactional(readOnly = true)
    public RideDto getActiveRideForRider(Long riderUserId) {
        Ride ride = rideRepository.findFirstByRiderIdAndStatusInOrderByCreatedAtDesc(riderUserId, List.of(
                RideStatus.REQUESTED, RideStatus.SEARCHING_DRIVER,
                RideStatus.DRIVER_ACCEPTED, RideStatus.DRIVER_ARRIVING,
                RideStatus.DRIVER_ARRIVED, RideStatus.RIDE_STARTED
        )).orElse(null);

        return ride != null ? EntityMapper.toRideDto(ride) : null;
    }

    @Transactional(readOnly = true)
    public RideDto getActiveRideForDriver(Long driverUserId) {
        Driver driver = driverRepository.findByUserId(driverUserId).orElse(null);
        if (driver == null) return null;

        Ride ride = rideRepository.findFirstByDriverIdAndStatusInOrderByCreatedAtDesc(driver.getId(), List.of(
                RideStatus.DRIVER_ACCEPTED, RideStatus.DRIVER_ARRIVING,
                RideStatus.DRIVER_ARRIVED, RideStatus.RIDE_STARTED
        )).orElse(null);

        return ride != null ? EntityMapper.toRideDto(ride) : null;
    }

    @Transactional(readOnly = true)
    public Page<RideDto> getRiderRideHistory(Long riderUserId, Pageable pageable) {
        return rideRepository.findByRiderIdOrderByCreatedAtDesc(riderUserId, pageable)
                .map(EntityMapper::toRideDto);
    }

    @Transactional(readOnly = true)
    public Page<RideDto> getDriverRideHistory(Long driverUserId, Pageable pageable) {
        Driver driver = driverRepository.findByUserId(driverUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));
        return rideRepository.findByDriverIdOrderByCreatedAtDesc(driver.getId(), pageable)
                .map(EntityMapper::toRideDto);
    }

    @Transactional(readOnly = true)
    public RideDto getRideById(Long rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found: " + rideId));
        return EntityMapper.toRideDto(ride);
    }

    private Ride getRideForDriver(Long driverUserId, Long rideId) {
        Driver driver = driverRepository.findByUserId(driverUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + rideId));

        if (ride.getDriver() == null || !ride.getDriver().getId().equals(driver.getId())) {
            throw new BadRequestException("Driver is not assigned to this ride");
        }

        return ride;
    }
}
