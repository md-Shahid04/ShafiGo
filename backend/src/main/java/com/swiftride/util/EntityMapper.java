package com.swiftride.util;

import com.swiftride.dto.response.*;
import com.swiftride.entity.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public final class EntityMapper {

    private EntityMapper() {}

    public static UserDto toUserDto(User user) {
        if (user == null) return null;
        return UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .profileImage(user.getProfileImage())
                .role(user.getRole())
                .active(user.getActive())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public static VehicleDto toVehicleDto(Vehicle vehicle) {
        if (vehicle == null) return null;
        return VehicleDto.builder()
                .id(vehicle.getId())
                .driverId(vehicle.getDriver() != null ? vehicle.getDriver().getId() : null)
                .vehicleType(vehicle.getVehicleType())
                .brand(vehicle.getBrand())
                .model(vehicle.getModel())
                .color(vehicle.getColor())
                .registrationNumber(vehicle.getRegistrationNumber())
                .year(vehicle.getYear())
                .active(vehicle.getActive())
                .build();
    }

    public static DriverDto toDriverDto(Driver driver) {
        if (driver == null) return null;

        List<VehicleDto> vehicles = Collections.emptyList();
        VehicleDto activeVehicle = null;

        if (driver.getVehicles() != null) {
            vehicles = driver.getVehicles().stream()
                    .map(EntityMapper::toVehicleDto)
                    .collect(Collectors.toList());

            activeVehicle = driver.getVehicles().stream()
                    .filter(Vehicle::getActive)
                    .findFirst()
                    .map(EntityMapper::toVehicleDto)
                    .orElse(null);
        }

        return DriverDto.builder()
                .id(driver.getId())
                .user(toUserDto(driver.getUser()))
                .licenseNumber(driver.getLicenseNumber())
                .verificationStatus(driver.getVerificationStatus())
                .onlineStatus(driver.getOnlineStatus())
                .currentLatitude(driver.getCurrentLatitude())
                .currentLongitude(driver.getCurrentLongitude())
                .rating(driver.getRating())
                .totalRides(driver.getTotalRides())
                .vehicles(vehicles)
                .activeVehicle(activeVehicle)
                .build();
    }

    public static RideDto toRideDto(Ride ride) {
        if (ride == null) return null;
        return RideDto.builder()
                .id(ride.getId())
                .rider(toUserDto(ride.getRider()))
                .driver(toDriverDto(ride.getDriver()))
                .vehicle(toVehicleDto(ride.getVehicle()))
                .vehicleType(ride.getVehicleType())
                .pickupAddress(ride.getPickupAddress())
                .pickupLatitude(ride.getPickupLatitude())
                .pickupLongitude(ride.getPickupLongitude())
                .destinationAddress(ride.getDestinationAddress())
                .destinationLatitude(ride.getDestinationLatitude())
                .destinationLongitude(ride.getDestinationLongitude())
                .distanceKm(ride.getDistanceKm())
                .estimatedDurationMinutes(ride.getEstimatedDurationMinutes())
                .estimatedFare(ride.getEstimatedFare())
                .finalFare(ride.getFinalFare())
                .status(ride.getStatus())
                .cancellationReason(ride.getCancellationReason())
                .requestedAt(ride.getRequestedAt())
                .acceptedAt(ride.getAcceptedAt())
                .arrivedAt(ride.getArrivedAt())
                .startedAt(ride.getStartedAt())
                .completedAt(ride.getCompletedAt())
                .cancelledAt(ride.getCancelledAt())
                .rating(toRatingDto(ride.getRating()))
                .createdAt(ride.getCreatedAt())
                .build();
    }

    public static RideLocationDto toRideLocationDto(RideLocation location) {
        if (location == null) return null;
        return RideLocationDto.builder()
                .id(location.getId())
                .rideId(location.getRide() != null ? location.getRide().getId() : null)
                .driverLatitude(location.getDriverLatitude())
                .driverLongitude(location.getDriverLongitude())
                .timestamp(location.getTimestamp())
                .build();
    }

    public static RatingDto toRatingDto(Rating rating) {
        if (rating == null) return null;
        return RatingDto.builder()
                .id(rating.getId())
                .rideId(rating.getRide() != null ? rating.getRide().getId() : null)
                .riderId(rating.getRider() != null ? rating.getRider().getId() : null)
                .riderName(rating.getRider() != null ? rating.getRider().getFullName() : null)
                .driverId(rating.getDriver() != null ? rating.getDriver().getId() : null)
                .driverName(rating.getDriver() != null && rating.getDriver().getUser() != null
                        ? rating.getDriver().getUser().getFullName() : null)
                .rating(rating.getRating())
                .comment(rating.getComment())
                .createdAt(rating.getCreatedAt())
                .build();
    }

    public static NotificationDto toNotificationDto(Notification notification) {
        if (notification == null) return null;
        return NotificationDto.builder()
                .id(notification.getId())
                .userId(notification.getUser() != null ? notification.getUser().getId() : null)
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
