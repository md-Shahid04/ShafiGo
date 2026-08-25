package com.swiftride.service;

import com.swiftride.entity.*;
import com.swiftride.repository.DriverRepository;
import com.swiftride.util.GeoUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    private static final Logger log = LoggerFactory.getLogger(MatchingService.class);

    private final DriverRepository driverRepository;
    private final WebSocketEventPublisher eventPublisher;

    @Value("${swiftride.matching.search-radius-km:6.0}")
    private double searchRadiusKm;

    @Value("${swiftride.matching.location-freshness-seconds:300}")
    private long locationFreshnessSeconds;

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

        log.info("MatchingService: Found {} total APPROVED + ONLINE drivers in database", onlineDrivers.size());
        LocalDateTime now = LocalDateTime.now();

        return onlineDrivers.stream()
                .filter(driver -> {
                    if (driver.getCurrentLatitude() == null || driver.getCurrentLongitude() == null) {
                        log.warn("MatchingService: Driver ID #{} excluded - No current GPS coordinates recorded", driver.getId());
                        return false;
                    }
                    return true;
                })
                .filter(driver -> {
                    if (driver.getLastLocationUpdate() == null) return true; // allow initial seed
                    long secondsSinceUpdate = ChronoUnit.SECONDS.between(driver.getLastLocationUpdate(), now);
                    boolean isFresh = secondsSinceUpdate <= locationFreshnessSeconds;
                    if (!isFresh) {
                        log.warn("MatchingService: Driver ID #{} excluded - Stale GPS coordinates ({}s ago > {}s threshold)",
                                driver.getId(), secondsSinceUpdate, locationFreshnessSeconds);
                    }
                    return isFresh;
                })
                .filter(driver -> {
                    boolean hasMatchingVehicle = driver.getVehicles().stream()
                            .anyMatch(v -> Boolean.TRUE.equals(v.getActive()) && (vehicleType == null || v.getVehicleType() == vehicleType));
                    if (!hasMatchingVehicle) {
                        log.info("MatchingService: Driver ID #{} excluded - No active vehicle matching type {}", driver.getId(), vehicleType);
                    }
                    return hasMatchingVehicle;
                })
                .filter(driver -> {
                    double dist = GeoUtils.calculateDistanceKm(
                            pickupLat, pickupLng,
                            driver.getCurrentLatitude(), driver.getCurrentLongitude()
                    );
                    boolean inRadius = dist <= searchRadiusKm;
                    if (inRadius) {
                        log.info("MatchingService: Driver ID #{} MATCHED - Distance: {} km (<= {} km radius)",
                                driver.getId(), String.format("%.2f", dist), searchRadiusKm);
                    } else {
                        log.info("MatchingService: Driver ID #{} excluded - Outside radius ({} km > {} km)",
                                driver.getId(), String.format("%.2f", dist), searchRadiusKm);
                    }
                    return inRadius;
                })
                .sorted(Comparator.comparingDouble(d -> GeoUtils.calculateDistanceKm(
                        pickupLat, pickupLng,
                        d.getCurrentLatitude(), d.getCurrentLongitude()
                )))
                .collect(Collectors.toList());
    }

    public void dispatchRideToNearbyDrivers(Ride ride) {
        log.info("==================================================");
        log.info("NEW RIDE DISPATCH: Ride #{} | Type: {} | Pickup: ({}, {})",
                ride.getId(), ride.getVehicleType(), ride.getPickupLatitude(), ride.getPickupLongitude());

        List<Driver> nearbyDrivers = findNearbyDrivers(
                ride.getPickupLatitude(),
                ride.getPickupLongitude(),
                ride.getVehicleType()
        );

        log.info("Found {} matching online drivers for ride #{}", nearbyDrivers.size(), ride.getId());

        for (Driver driver : nearbyDrivers) {
            log.info("-> Broadcasting RIDE_REQUESTED to Driver ID: {} at topic /topic/driver/{}",
                    driver.getId(), driver.getId());
            Long driverUserId = driver.getUser() != null ? driver.getUser().getId() : null;
            eventPublisher.publishRideRequestedToDriver(driver.getId(), driverUserId, ride);
        }
        log.info("==================================================");
    }
}
