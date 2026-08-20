package com.swiftride.dto.response;

import java.time.LocalDateTime;

public class RideLocationDto {

    private Long id;
    private Long rideId;
    private Double driverLatitude;
    private Double driverLongitude;
    private LocalDateTime timestamp;

    public RideLocationDto() {}

    public RideLocationDto(Long id, Long rideId, Double driverLatitude, Double driverLongitude, LocalDateTime timestamp) {
        this.id = id;
        this.rideId = rideId;
        this.driverLatitude = driverLatitude;
        this.driverLongitude = driverLongitude;
        this.timestamp = timestamp;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long rideId;
        private Double driverLatitude;
        private Double driverLongitude;
        private LocalDateTime timestamp;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder rideId(Long rideId) { this.rideId = rideId; return this; }
        public Builder driverLatitude(Double lat) { this.driverLatitude = lat; return this; }
        public Builder driverLongitude(Double lng) { this.driverLongitude = lng; return this; }
        public Builder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

        public RideLocationDto build() {
            return new RideLocationDto(id, rideId, driverLatitude, driverLongitude, timestamp);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRideId() { return rideId; }
    public void setRideId(Long rideId) { this.rideId = rideId; }

    public Double getDriverLatitude() { return driverLatitude; }
    public void setDriverLatitude(Double driverLatitude) { this.driverLatitude = driverLatitude; }

    public Double getDriverLongitude() { return driverLongitude; }
    public void setDriverLongitude(Double driverLongitude) { this.driverLongitude = driverLongitude; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
