package com.swiftride.dto.response;

import java.time.LocalDateTime;

public class DriverEarningDto {

    private Long id;
    private Long rideId;
    private Double grossFare;
    private Double platformFee;
    private Double driverEarning;
    private Double distanceKm;
    private Integer durationMinutes;
    private String pickupAddress;
    private String destinationAddress;
    private LocalDateTime createdAt;

    public DriverEarningDto() {}

    public DriverEarningDto(Long id, Long rideId, Double grossFare, Double platformFee, Double driverEarning, Double distanceKm, Integer durationMinutes, String pickupAddress, String destinationAddress, LocalDateTime createdAt) {
        this.id = id;
        this.rideId = rideId;
        this.grossFare = grossFare;
        this.platformFee = platformFee;
        this.driverEarning = driverEarning;
        this.distanceKm = distanceKm;
        this.durationMinutes = durationMinutes;
        this.pickupAddress = pickupAddress;
        this.destinationAddress = destinationAddress;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long rideId;
        private Double grossFare;
        private Double platformFee;
        private Double driverEarning;
        private Double distanceKm;
        private Integer durationMinutes;
        private String pickupAddress;
        private String destinationAddress;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder rideId(Long rideId) { this.rideId = rideId; return this; }
        public Builder grossFare(Double grossFare) { this.grossFare = grossFare; return this; }
        public Builder platformFee(Double platformFee) { this.platformFee = platformFee; return this; }
        public Builder driverEarning(Double driverEarning) { this.driverEarning = driverEarning; return this; }
        public Builder distanceKm(Double distanceKm) { this.distanceKm = distanceKm; return this; }
        public Builder durationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; return this; }
        public Builder pickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; return this; }
        public Builder destinationAddress(String destinationAddress) { this.destinationAddress = destinationAddress; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public DriverEarningDto build() {
            return new DriverEarningDto(id, rideId, grossFare, platformFee, driverEarning, distanceKm, durationMinutes, pickupAddress, destinationAddress, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRideId() { return rideId; }
    public void setRideId(Long rideId) { this.rideId = rideId; }

    public Double getGrossFare() { return grossFare; }
    public void setGrossFare(Double grossFare) { this.grossFare = grossFare; }

    public Double getPlatformFee() { return platformFee; }
    public void setPlatformFee(Double platformFee) { this.platformFee = platformFee; }

    public Double getDriverEarning() { return driverEarning; }
    public void setDriverEarning(Double driverEarning) { this.driverEarning = driverEarning; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }

    public String getDestinationAddress() { return destinationAddress; }
    public void setDestinationAddress(String destinationAddress) { this.destinationAddress = destinationAddress; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
