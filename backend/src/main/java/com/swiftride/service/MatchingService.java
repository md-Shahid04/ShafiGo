package com.swiftride.service;

import com.swiftride.entity.*;
import com.swiftride.repository.DriverRepository;
import com.swiftride.util.GeoUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    private static final Logger log = LoggerFactory.getLogger(MatchingService.class);

    private final DriverRepository driverRepository;
    private final WebSocketEventPublisher eventPublisher;

    @Value("${swiftride.matching.search-radius-km:5.0}")
    private double searchRadiusKm;

    public MatchingService(DriverRepository driverRepository, WebSocketEventPublisher eventPublisher) {
        this.driverRepository = driverRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional(readOnly = true)
    public List<Driver> findNearbyDrivers(double pickupLat, double pickupLng, VehicleType vehicleType) {
        List<Driver> onlineDrivers = driverRepository.findByVerificationStatusAndOnlineStatus(
                DriverVerificationStatus.APPROVED,
                DriverOnlineStatus.ONLINE
        );

        return onlineDrivers.stream()
                .filter(driver -> driver.getCurrentLatitude() != null && driver.getCurrentLongitude() != null)
                .filter(driver -> driver.getVehicles().stream()
                        .anyMatch(v -> v.getActive() && (vehicleType == null || v.getVehicleType() == vehicleType)))
                .filter(driver -> {
                    double dist = GeoUtils.calculateDistanceKm(
                            pickupLat, pickupLng,
                            driver.getCurrentLatitude(), driver.getCurrentLongitude()
                    );
                    return dist <= searchRadiusKm;
                })
                .sorted(Comparator.comparingDouble(d -> GeoUtils.calculateDistanceKm(
                        pickupLat, pickupLng,
                        d.getCurrentLatitude(), d.getCurrentLongitude()
                )))
                .collect(Collectors.toList());
    }

    public void dispatchRideToNearbyDrivers(Ride ride) {
        List<Driver> nearbyDrivers = findNearbyDrivers(
                ride.getPickupLatitude(),
                ride.getPickupLongitude(),
                ride.getVehicleType()
        );

        log.info("Found {} nearby drivers for ride #{}", nearbyDrivers.size(), ride.getId());

        for (Driver driver : nearbyDrivers) {
            eventPublisher.publishRideRequestedToDriver(driver.getId(), ride);
        }
    }
}
