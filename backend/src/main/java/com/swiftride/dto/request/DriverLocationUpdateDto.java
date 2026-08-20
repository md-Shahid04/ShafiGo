package com.swiftride.dto.request;

import jakarta.validation.constraints.NotNull;

public class DriverLocationUpdateDto {

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private Long rideId;

    public DriverLocationUpdateDto() {}

    public DriverLocationUpdateDto(Double latitude, Double longitude, Long rideId) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.rideId = rideId;
    }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Long getRideId() { return rideId; }
    public void setRideId(Long rideId) { this.rideId = rideId; }
}
