package com.swiftride.dto.response;

import com.swiftride.entity.RideStatus;
import com.swiftride.entity.VehicleType;
import java.time.LocalDateTime;

public class RideDto {

    private Long id;
    private UserDto rider;
    private DriverDto driver;
    private VehicleDto vehicle;
    private VehicleType vehicleType;
    private String pickupAddress;
    private Double pickupLatitude;
    private Double pickupLongitude;
    private String destinationAddress;
    private Double destinationLatitude;
    private Double destinationLongitude;
    private Double distanceKm;
    private Integer estimatedDurationMinutes;
    private Double estimatedFare;
    private Double finalFare;
    private RideStatus status;
    private String cancellationReason;
    private LocalDateTime requestedAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime arrivedAt;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private LocalDateTime cancelledAt;
    private RatingDto rating;
    private LocalDateTime createdAt;

    public RideDto() {}

    public RideDto(Long id, UserDto rider, DriverDto driver, VehicleDto vehicle, VehicleType vehicleType, String pickupAddress, Double pickupLatitude, Double pickupLongitude, String destinationAddress, Double destinationLatitude, Double destinationLongitude, Double distanceKm, Integer estimatedDurationMinutes, Double estimatedFare, Double finalFare, RideStatus status, String cancellationReason, LocalDateTime requestedAt, LocalDateTime acceptedAt, LocalDateTime arrivedAt, LocalDateTime startedAt, LocalDateTime completedAt, LocalDateTime cancelledAt, RatingDto rating, LocalDateTime createdAt) {
        this.id = id;
        this.rider = rider;
        this.driver = driver;
        this.vehicle = vehicle;
        this.vehicleType = vehicleType;
        this.pickupAddress = pickupAddress;
        this.pickupLatitude = pickupLatitude;
        this.pickupLongitude = pickupLongitude;
        this.destinationAddress = destinationAddress;
        this.destinationLatitude = destinationLatitude;
        this.destinationLongitude = destinationLongitude;
        this.distanceKm = distanceKm;
        this.estimatedDurationMinutes = estimatedDurationMinutes;
        this.estimatedFare = estimatedFare;
        this.finalFare = finalFare;
        this.status = status;
        this.cancellationReason = cancellationReason;
        this.requestedAt = requestedAt;
        this.acceptedAt = acceptedAt;
        this.arrivedAt = arrivedAt;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
        this.cancelledAt = cancelledAt;
        this.rating = rating;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private UserDto rider;
        private DriverDto driver;
        private VehicleDto vehicle;
        private VehicleType vehicleType;
        private String pickupAddress;
        private Double pickupLatitude;
        private Double pickupLongitude;
        private String destinationAddress;
        private Double destinationLatitude;
        private Double destinationLongitude;
        private Double distanceKm;
        private Integer estimatedDurationMinutes;
        private Double estimatedFare;
        private Double finalFare;
        private RideStatus status;
        private String cancellationReason;
        private LocalDateTime requestedAt;
        private LocalDateTime acceptedAt;
        private LocalDateTime arrivedAt;
        private LocalDateTime startedAt;
        private LocalDateTime completedAt;
        private LocalDateTime cancelledAt;
        private RatingDto rating;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder rider(UserDto rider) { this.rider = rider; return this; }
        public Builder driver(DriverDto driver) { this.driver = driver; return this; }
        public Builder vehicle(VehicleDto vehicle) { this.vehicle = vehicle; return this; }
        public Builder vehicleType(VehicleType vehicleType) { this.vehicleType = vehicleType; return this; }
        public Builder pickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; return this; }
        public Builder pickupLatitude(Double pickupLatitude) { this.pickupLatitude = pickupLatitude; return this; }
        public Builder pickupLongitude(Double pickupLongitude) { this.pickupLongitude = pickupLongitude; return this; }
        public Builder destinationAddress(String destinationAddress) { this.destinationAddress = destinationAddress; return this; }
        public Builder destinationLatitude(Double destinationLatitude) { this.destinationLatitude = destinationLatitude; return this; }
        public Builder destinationLongitude(Double destinationLongitude) { this.destinationLongitude = destinationLongitude; return this; }
        public Builder distanceKm(Double distanceKm) { this.distanceKm = distanceKm; return this; }
        public Builder estimatedDurationMinutes(Integer estimatedDurationMinutes) { this.estimatedDurationMinutes = estimatedDurationMinutes; return this; }
        public Builder estimatedFare(Double estimatedFare) { this.estimatedFare = estimatedFare; return this; }
        public Builder finalFare(Double finalFare) { this.finalFare = finalFare; return this; }
        public Builder status(RideStatus status) { this.status = status; return this; }
        public Builder cancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; return this; }
        public Builder requestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; return this; }
        public Builder acceptedAt(LocalDateTime acceptedAt) { this.acceptedAt = acceptedAt; return this; }
        public Builder arrivedAt(LocalDateTime arrivedAt) { this.arrivedAt = arrivedAt; return this; }
        public Builder startedAt(LocalDateTime startedAt) { this.startedAt = startedAt; return this; }
        public Builder completedAt(LocalDateTime completedAt) { this.completedAt = completedAt; return this; }
        public Builder cancelledAt(LocalDateTime cancelledAt) { this.cancelledAt = cancelledAt; return this; }
        public Builder rating(RatingDto rating) { this.rating = rating; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public RideDto build() {
            return new RideDto(id, rider, driver, vehicle, vehicleType, pickupAddress, pickupLatitude, pickupLongitude, destinationAddress, destinationLatitude, destinationLongitude, distanceKm, estimatedDurationMinutes, estimatedFare, finalFare, status, cancellationReason, requestedAt, acceptedAt, arrivedAt, startedAt, completedAt, cancelledAt, rating, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserDto getRider() { return rider; }
    public void setRider(UserDto rider) { this.rider = rider; }

    public DriverDto getDriver() { return driver; }
    public void setDriver(DriverDto driver) { this.driver = driver; }

    public VehicleDto getVehicle() { return vehicle; }
    public void setVehicle(VehicleDto vehicle) { this.vehicle = vehicle; }

    public VehicleType getVehicleType() { return vehicleType; }
    public void setVehicleType(VehicleType vehicleType) { this.vehicleType = vehicleType; }

    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }

    public Double getPickupLatitude() { return pickupLatitude; }
    public void setPickupLatitude(Double pickupLatitude) { this.pickupLatitude = pickupLatitude; }

    public Double getPickupLongitude() { return pickupLongitude; }
    public void setPickupLongitude(Double pickupLongitude) { this.pickupLongitude = pickupLongitude; }

    public String getDestinationAddress() { return destinationAddress; }
    public void setDestinationAddress(String destinationAddress) { this.destinationAddress = destinationAddress; }

    public Double getDestinationLatitude() { return destinationLatitude; }
    public void setDestinationLatitude(Double destinationLatitude) { this.destinationLatitude = destinationLatitude; }

    public Double getDestinationLongitude() { return destinationLongitude; }
    public void setDestinationLongitude(Double destinationLongitude) { this.destinationLongitude = destinationLongitude; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public Integer getEstimatedDurationMinutes() { return estimatedDurationMinutes; }
    public void setEstimatedDurationMinutes(Integer estimatedDurationMinutes) { this.estimatedDurationMinutes = estimatedDurationMinutes; }

    public Double getEstimatedFare() { return estimatedFare; }
    public void setEstimatedFare(Double estimatedFare) { this.estimatedFare = estimatedFare; }

    public Double getFinalFare() { return finalFare; }
    public void setFinalFare(Double finalFare) { this.finalFare = finalFare; }

    public RideStatus getStatus() { return status; }
    public void setStatus(RideStatus status) { this.status = status; }

    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }

    public LocalDateTime getRequestedAt() { return requestedAt; }
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }

    public LocalDateTime getAcceptedAt() { return acceptedAt; }
    public void setAcceptedAt(LocalDateTime acceptedAt) { this.acceptedAt = acceptedAt; }

    public LocalDateTime getArrivedAt() { return arrivedAt; }
    public void setArrivedAt(LocalDateTime arrivedAt) { this.arrivedAt = arrivedAt; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public LocalDateTime getCancelledAt() { return cancelledAt; }
    public void setCancelledAt(LocalDateTime cancelledAt) { this.cancelledAt = cancelledAt; }

    public RatingDto getRating() { return rating; }
    public void setRating(RatingDto rating) { this.rating = rating; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
