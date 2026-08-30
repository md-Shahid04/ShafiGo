package com.swiftride.service;

import com.swiftride.entity.*;
import com.swiftride.repository.DriverRepository;
import com.swiftride.util.GeoUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    private static final Logger log = LoggerFactory.getLogger(MatchingService.class);

    private final DriverRepository driverRepository;
    private final WebSocketEventPublisher eventPublisher;

    @Value("${swiftride.matching.search-radius-km:8.0}")
    private double searchRadiusKm;

    @Value("${swiftride.matching.max-search-radius-km:25.0}")
    private double maxSearchRadiusKm;

    // Track driver declines per ride
    private final Map<Long, Set<Long>> declinedDriversByRide = new ConcurrentHashMap<>();

    public MatchingService(DriverRepository driverRepository, WebSocketEventPublisher eventPublisher) {
        this.driverRepository = driverRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional(readOnly = true)
    public List<Driver> findNearbyDrivers(double pickupLat, double pickupLng, VehicleType vehicleType) {
        return findNearbyDrivers(pickupLat, pickupLng, vehicleType, Collections.emptySet());
    }

    @Transactional(readOnly = true)
    public List<Driver> findNearbyDrivers(double pickupLat, double pickupLng, VehicleType vehicleType, Set<Long> excludedDriverIds) {
        List<Driver> onlineDrivers = driverRepository.findAvailableDriversForDispatch();
        log.info("[MATCHING] Found {} total APPROVED + ONLINE drivers with GPS in database", onlineDrivers.size());

        List<Driver> candidates = onlineDrivers.stream()
                .filter(driver -> excludedDriverIds == null || !excludedDriverIds.contains(driver.getId()))
                .filter(driver -> {
                    if (driver.getCurrentLatitude() == null || driver.getCurrentLongitude() == null) {
                        return false;
                    }
                    return true;
                })
                .filter(driver -> {
                    boolean hasMatchingVehicle = driver.getVehicles().stream()
                            .anyMatch(v -> Boolean.TRUE.equals(v.getActive()) && (vehicleType == null || v.getVehicleType() == vehicleType));
                    if (!hasMatchingVehicle) {
                        log.info("[MATCHING] Driver ID #{} excluded - No active vehicle matching type {}", driver.getId(), vehicleType);
                    }
                    return hasMatchingVehicle;
                })
                .sorted(Comparator.comparingDouble(d -> GeoUtils.calculateDistanceKm(
                        pickupLat, pickupLng,
                        d.getCurrentLatitude(), d.getCurrentLongitude()
                )))
                .collect(Collectors.toList());

        // First attempt: match within searchRadiusKm
        List<Driver> inRadius = candidates.stream()
                .filter(d -> GeoUtils.calculateDistanceKm(pickupLat, pickupLng, d.getCurrentLatitude(), d.getCurrentLongitude()) <= searchRadiusKm)
                .collect(Collectors.toList());

        if (!inRadius.isEmpty()) {
            log.info("[MATCHING] Found {} eligible drivers within primary radius ({} km)", inRadius.size(), searchRadiusKm);
            return inRadius;
        }

        // Expanded attempt: match within maxSearchRadiusKm
        List<Driver> expanded = candidates.stream()
                .filter(d -> GeoUtils.calculateDistanceKm(pickupLat, pickupLng, d.getCurrentLatitude(), d.getCurrentLongitude()) <= maxSearchRadiusKm)
                .collect(Collectors.toList());

        log.info("[MATCHING] Expanded search ({} km): Found {} eligible drivers", maxSearchRadiusKm, expanded.size());
        return expanded;
    }

    @Transactional(readOnly = true)
    public void dispatchRideToNearbyDrivers(Ride ride) {
        log.info("==================================================");
        log.info("[RIDE DISPATCH] Starting dispatch for Ride #{} | Vehicle: {} | Pickup: ({}, {})",
                ride.getId(), ride.getVehicleType(), ride.getPickupLatitude(), ride.getPickupLongitude());

        Set<Long> excluded = declinedDriversByRide.getOrDefault(ride.getId(), Collections.emptySet());
        List<Driver> nearbyDrivers = findNearbyDrivers(
                ride.getPickupLatitude(),
                ride.getPickupLongitude(),
                ride.getVehicleType(),
                excluded
        );

        if (nearbyDrivers.isEmpty()) {
            log.warn("[RIDE DISPATCH] No eligible online drivers found for Ride #{}", ride.getId());
            // Broadcast NO_DRIVER_FOUND event to rider
            eventPublisher.publishNoDriverFound(ride);
            return;
        }

        log.info("[RIDE DISPATCH] Dispatching Ride #{} to {} eligible drivers", ride.getId(), nearbyDrivers.size());

        for (Driver driver : nearbyDrivers) {
            Long driverUserId = driver.getUser() != null ? driver.getUser().getId() : null;
            String driverEmail = driver.getUser() != null ? driver.getUser().getEmail() : null;
            log.info("[WS] Sending ride request #{} to Driver ID: {} (User ID: {}, Email: {})",
                    ride.getId(), driver.getId(), driverUserId, driverEmail);
            eventPublisher.publishRideRequestedToDriver(driver.getId(), driverUserId, driverEmail, ride);
        }
        log.info("==================================================");
    }

    public void handleDriverDecline(Long rideId, Long driverId, Ride ride) {
        log.info("[RIDE DISPATCH] Driver ID #{} declined Ride #{}", driverId, rideId);
        declinedDriversByRide.computeIfAbsent(rideId, k -> ConcurrentHashMap.newKeySet()).add(driverId);

        // Re-dispatch to remaining available drivers if ride is still searching
        if (ride != null && (ride.getStatus() == RideStatus.SEARCHING_DRIVER || ride.getStatus() == RideStatus.REQUESTED)) {
            dispatchRideToNearbyDrivers(ride);
        }
    }

    public void cleanupRideOffers(Long rideId) {
        declinedDriversByRide.remove(rideId);
    }
}
