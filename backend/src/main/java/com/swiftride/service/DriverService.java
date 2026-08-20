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

        if (driver.getVerificationStatus() != DriverVerificationStatus.APPROVED) {
            throw new BadRequestException("Cannot go online. Your driver account verification is currently: "
                    + driver.getVerificationStatus());
        }

        boolean hasActiveVehicle = driver.getVehicles().stream().anyMatch(Vehicle::getActive);
        if (!hasActiveVehicle && dto.getOnlineStatus() == DriverOnlineStatus.ONLINE) {
            throw new BadRequestException("Cannot go online. You must register and activate at least one vehicle.");
        }

        driver.setOnlineStatus(dto.getOnlineStatus());
        Driver updated = driverRepository.save(driver);
        return EntityMapper.toDriverDto(updated);
    }

    @Transactional
    public DriverDto updateLocation(Long userId, DriverLocationUpdateDto dto) {
        Driver driver = driverRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found for user: " + userId));

        driver.setCurrentLatitude(dto.getLatitude());
        driver.setCurrentLongitude(dto.getLongitude());
        Driver updated = driverRepository.save(driver);

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

                eventPublisher.publishDriverLocation(ride.getId(), driver.getId(), dto.getLatitude(), dto.getLongitude());
            }
        }

        return EntityMapper.toDriverDto(updated);
    }
}
