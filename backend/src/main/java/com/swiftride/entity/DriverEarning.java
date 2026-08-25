package com.swiftride.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "driver_earnings", indexes = {
    @Index(name = "idx_driver_earnings_driver_id", columnList = "driver_id"),
    @Index(name = "idx_driver_earnings_created_at", columnList = "createdAt")
})
public class DriverEarning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ride_id", nullable = false, unique = true)
    private Ride ride;

    @Column(nullable = false)
    private Double grossFare;

    @Column(nullable = false)
    private Double platformFee;

    @Column(nullable = false)
    private Double driverEarning;

    @Column
    private Double distanceKm;

    @Column
    private Integer durationMinutes;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public DriverEarning() {}

    public DriverEarning(Long id, Driver driver, Ride ride, Double grossFare, Double platformFee, Double driverEarning, Double distanceKm, Integer durationMinutes, LocalDateTime createdAt) {
        this.id = id;
        this.driver = driver;
        this.ride = ride;
        this.grossFare = grossFare;
        this.platformFee = platformFee;
        this.driverEarning = driverEarning;
        this.distanceKm = distanceKm;
        this.durationMinutes = durationMinutes;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Driver driver;
        private Ride ride;
        private Double grossFare;
        private Double platformFee;
        private Double driverEarning;
        private Double distanceKm;
        private Integer durationMinutes;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder driver(Driver driver) { this.driver = driver; return this; }
        public Builder ride(Ride ride) { this.ride = ride; return this; }
        public Builder grossFare(Double grossFare) { this.grossFare = grossFare; return this; }
        public Builder platformFee(Double platformFee) { this.platformFee = platformFee; return this; }
        public Builder driverEarning(Double driverEarning) { this.driverEarning = driverEarning; return this; }
        public Builder distanceKm(Double distanceKm) { this.distanceKm = distanceKm; return this; }
        public Builder durationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public DriverEarning build() {
            return new DriverEarning(id, driver, ride, grossFare, platformFee, driverEarning, distanceKm, durationMinutes, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Driver getDriver() { return driver; }
    public void setDriver(Driver driver) { this.driver = driver; }

    public Ride getRide() { return ride; }
    public void setRide(Ride ride) { this.ride = ride; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
