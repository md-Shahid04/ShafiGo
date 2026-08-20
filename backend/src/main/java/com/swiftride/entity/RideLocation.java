package com.swiftride.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ride_locations", indexes = {
    @Index(name = "idx_ride_locations_ride_id", columnList = "ride_id"),
    @Index(name = "idx_ride_locations_timestamp", columnList = "timestamp")
})
public class RideLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ride_id", nullable = false)
    private Ride ride;

    @Column(nullable = false)
    private Double driverLatitude;

    @Column(nullable = false)
    private Double driverLongitude;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;

    public RideLocation() {}

    public RideLocation(Long id, Ride ride, Double driverLatitude, Double driverLongitude, LocalDateTime timestamp) {
        this.id = id;
        this.ride = ride;
        this.driverLatitude = driverLatitude;
        this.driverLongitude = driverLongitude;
        this.timestamp = timestamp;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Ride ride;
        private Double driverLatitude;
        private Double driverLongitude;
        private LocalDateTime timestamp;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder ride(Ride ride) { this.ride = ride; return this; }
        public Builder driverLatitude(Double lat) { this.driverLatitude = lat; return this; }
        public Builder driverLongitude(Double lng) { this.driverLongitude = lng; return this; }
        public Builder timestamp(LocalDateTime ts) { this.timestamp = ts; return this; }

        public RideLocation build() {
            return new RideLocation(id, ride, driverLatitude, driverLongitude, timestamp);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Ride getRide() { return ride; }
    public void setRide(Ride ride) { this.ride = ride; }

    public Double getDriverLatitude() { return driverLatitude; }
    public void setDriverLatitude(Double driverLatitude) { this.driverLatitude = driverLatitude; }

    public Double getDriverLongitude() { return driverLongitude; }
    public void setDriverLongitude(Double driverLongitude) { this.driverLongitude = driverLongitude; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
