package com.swiftride.service;

import com.swiftride.dto.request.DriverLocationUpdateDto;
import com.swiftride.dto.request.DriverStatusUpdateDto;
import com.swiftride.dto.response.DriverDto;
import com.swiftride.entity.*;
import com.swiftride.exception.BadRequestException;
import com.swiftride.exception.ResourceNotFoundException;
import com.swiftride.repository.DriverRepository;
import com.swiftride.repository.RideLocationRepository;
import com.swiftride.repository.RideRepository;
import com.swiftride.repository.UserRepository;
import com.swiftride.util.EntityMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DriverService {

    private final DriverRepository driverRepository;
    private final UserRepository userRepository;
    private final RideRepository rideRepository;
    private final RideLocationRepository rideLocationRepository;
    private final WebSocketEventPublisher eventPublisher;

    public DriverService(
            DriverRepository driverRepository,
            UserRepository userRepository,
            RideRepository rideRepository,
            RideLocationRepository rideLocationRepository,
            WebSocketEventPublisher eventPublisher
    ) {
        this.driverRepository = driverRepository;
        this.userRepository = userRepository;
        this.rideRepository = rideRepository;
        this.rideLocationRepository = rideLocationRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional(readOnly = true)
    public DriverDto getDriverByUserId(Long userId) {
        Driver driver = driverRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found for user: " + userId));
        return EntityMapper.toDriverDto(driver);
    }

    @Transactional
    public DriverDto updateOnlineStatus(Long userId, DriverStatusUpdateDto dto) {
        Driver driver = driverRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found for user: " + userId));

        if (driver.getVerificationStatus() == DriverVerificationStatus.PENDING) {
            throw new BadRequestException("Driver account is awaiting admin approval.");
        }
        if (driver.getVerificationStatus() == DriverVerificationStatus.REJECTED) {
            throw new BadRequestException("Driver account has been rejected. Please contact support.");
        }
        if (driver.getVerificationStatus() == DriverVerificationStatus.SUSPENDED) {
            throw new BadRequestException("Driver account is currently suspended.");
        }

        boolean hasActiveVehicle = driver.getVehicles().stream().anyMatch(Vehicle::getActive);
        if (!hasActiveVehicle && dto.getOnlineStatus() == DriverOnlineStatus.ONLINE) {
            throw new BadRequestException("Cannot go online. You must register and activate at least one vehicle.");
        }

        driver.setOnlineStatus(dto.getOnlineStatus());
        Driver updated = driverRepository.save(driver);

        // Publish live status change to Admin dashboard
        eventPublisher.publishDriverStatusChanged(updated);

        return EntityMapper.toDriverDto(updated);
    }

    @Transactional
    public DriverDto updateLocation(Long userId, DriverLocationUpdateDto dto) {
        Driver driver = driverRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found for user: " + userId));

        driver.setCurrentLatitude(dto.getLatitude());
        driver.setCurrentLongitude(dto.getLongitude());
        driver.setLastLocationUpdate(java.time.LocalDateTime.now());
        Driver updated = driverRepository.save(driver);

        // Broadcast to Admin live map
        eventPublisher.publishDriverLocationToAdmin(
                updated,
                dto.getLatitude(),
                dto.getLongitude(),
                dto.getHeading(),
                dto.getSpeed(),
                dto.getAccuracy(),
                dto.getTimestamp()
        );

        if (dto.getRideId() != null) {
            Ride ride = rideRepository.findById(dto.getRideId()).orElse(null);
            if (ride != null && (ride.getStatus() == RideStatus.DRIVER_ACCEPTED
                    || ride.getStatus() == RideStatus.DRIVER_ARRIVING
                    || ride.getStatus() == RideStatus.DRIVER_ARRIVED
                    || ride.getStatus() == RideStatus.RIDE_STARTED)) {

                RideLocation location = RideLocation.builder()
                        .ride(ride)
                        .driverLatitude(dto.getLatitude())
                        .driverLongitude(dto.getLongitude())
                        .build();
                rideLocationRepository.save(location);

                eventPublisher.publishDriverLocation(
                        ride.getId(),
                        driver.getId(),
                        dto.getLatitude(),
                        dto.getLongitude(),
                        dto.getHeading(),
                        dto.getSpeed(),
                        dto.getAccuracy(),
                        dto.getTimestamp()
                );
            }
        }

        return EntityMapper.toDriverDto(updated);
    }
}
