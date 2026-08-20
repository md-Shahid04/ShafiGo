package com.swiftride.entity;

public enum RideStatus {
    REQUESTED,
    SEARCHING_DRIVER,
    DRIVER_ACCEPTED,
    DRIVER_ARRIVING,
    DRIVER_ARRIVED,
    RIDE_STARTED,
    RIDE_COMPLETED,
    CANCELLED,
    NO_DRIVER_FOUND
}
