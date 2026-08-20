package com.swiftride.dto.response;

import java.time.LocalDateTime;

public class RatingDto {

    private Long id;
    private Long rideId;
    private Long riderId;
    private String riderName;
    private Long driverId;
    private String driverName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    public RatingDto() {}

    public RatingDto(Long id, Long rideId, Long riderId, String riderName, Long driverId, String driverName, Integer rating, String comment, LocalDateTime createdAt) {
        this.id = id;
        this.rideId = rideId;
        this.riderId = riderId;
        this.riderName = riderName;
        this.driverId = driverId;
        this.driverName = driverName;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long rideId;
        private Long riderId;
        private String riderName;
        private Long driverId;
        private String driverName;
        private Integer rating;
        private String comment;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder rideId(Long rideId) { this.rideId = rideId; return this; }
        public Builder riderId(Long riderId) { this.riderId = riderId; return this; }
        public Builder riderName(String riderName) { this.riderName = riderName; return this; }
        public Builder driverId(Long driverId) { this.driverId = driverId; return this; }
        public Builder driverName(String driverName) { this.driverName = driverName; return this; }
        public Builder rating(Integer rating) { this.rating = rating; return this; }
        public Builder comment(String comment) { this.comment = comment; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public RatingDto build() {
            return new RatingDto(id, rideId, riderId, riderName, driverId, driverName, rating, comment, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRideId() { return rideId; }
    public void setRideId(Long rideId) { this.rideId = rideId; }

    public Long getRiderId() { return riderId; }
    public void setRiderId(Long riderId) { this.riderId = riderId; }

    public String getRiderName() { return riderName; }
    public void setRiderName(String riderName) { this.riderName = riderName; }

    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
