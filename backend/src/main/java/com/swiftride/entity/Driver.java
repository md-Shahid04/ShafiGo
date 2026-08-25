package com.swiftride.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "drivers", indexes = {
    @Index(name = "idx_drivers_user_id", columnList = "user_id", unique = true),
    @Index(name = "idx_drivers_online_status", columnList = "onlineStatus"),
    @Index(name = "idx_drivers_verification_status", columnList = "verificationStatus")
})
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 50)
    private String licenseNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DriverVerificationStatus verificationStatus = DriverVerificationStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DriverOnlineStatus onlineStatus = DriverOnlineStatus.OFFLINE;

    @Column
    private Double currentLatitude;

    @Column
    private Double currentLongitude;

    @Column
    private LocalDateTime lastLocationUpdate;

    @Column(nullable = false)
    private Double rating = 5.0;

    @Column(nullable = false)
    private Integer totalRides = 0;

    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Vehicle> vehicles = new ArrayList<>();

    @Version
    private Long version;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Driver() {}

    public Driver(Long id, User user, String licenseNumber, DriverVerificationStatus verificationStatus, DriverOnlineStatus onlineStatus, Double currentLatitude, Double currentLongitude, LocalDateTime lastLocationUpdate, Double rating, Integer totalRides, List<Vehicle> vehicles, Long version, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.user = user;
        this.licenseNumber = licenseNumber;
        this.verificationStatus = verificationStatus != null ? verificationStatus : DriverVerificationStatus.PENDING;
        this.onlineStatus = onlineStatus != null ? onlineStatus : DriverOnlineStatus.OFFLINE;
        this.currentLatitude = currentLatitude;
        this.currentLongitude = currentLongitude;
        this.lastLocationUpdate = lastLocationUpdate;
        this.rating = rating != null ? rating : 5.0;
        this.totalRides = totalRides != null ? totalRides : 0;
        this.vehicles = vehicles != null ? vehicles : new ArrayList<>();
        this.version = version;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private User user;
        private String licenseNumber;
        private DriverVerificationStatus verificationStatus = DriverVerificationStatus.PENDING;
        private DriverOnlineStatus onlineStatus = DriverOnlineStatus.OFFLINE;
        private Double currentLatitude;
        private Double currentLongitude;
        private LocalDateTime lastLocationUpdate;
        private Double rating = 5.0;
        private Integer totalRides = 0;
        private List<Vehicle> vehicles = new ArrayList<>();
        private Long version;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder licenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; return this; }
        public Builder verificationStatus(DriverVerificationStatus status) { this.verificationStatus = status; return this; }
        public Builder onlineStatus(DriverOnlineStatus status) { this.onlineStatus = status; return this; }
        public Builder currentLatitude(Double lat) { this.currentLatitude = lat; return this; }
        public Builder currentLongitude(Double lng) { this.currentLongitude = lng; return this; }
        public Builder lastLocationUpdate(LocalDateTime lastUpdate) { this.lastLocationUpdate = lastUpdate; return this; }
        public Builder rating(Double rating) { this.rating = rating; return this; }
        public Builder totalRides(Integer totalRides) { this.totalRides = totalRides; return this; }
        public Builder vehicles(List<Vehicle> vehicles) { this.vehicles = vehicles; return this; }
        public Builder version(Long version) { this.version = version; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Driver build() {
            return new Driver(id, user, licenseNumber, verificationStatus, onlineStatus, currentLatitude, currentLongitude, lastLocationUpdate, rating, totalRides, vehicles, version, createdAt, updatedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public DriverVerificationStatus getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(DriverVerificationStatus verificationStatus) { this.verificationStatus = verificationStatus; }

    public DriverOnlineStatus getOnlineStatus() { return onlineStatus; }
    public void setOnlineStatus(DriverOnlineStatus onlineStatus) { this.onlineStatus = onlineStatus; }

    public Double getCurrentLatitude() { return currentLatitude; }
    public void setCurrentLatitude(Double currentLatitude) { this.currentLatitude = currentLatitude; }

    public Double getCurrentLongitude() { return currentLongitude; }
    public void setCurrentLongitude(Double currentLongitude) { this.currentLongitude = currentLongitude; }

    public LocalDateTime getLastLocationUpdate() { return lastLocationUpdate; }
    public void setLastLocationUpdate(LocalDateTime lastLocationUpdate) { this.lastLocationUpdate = lastLocationUpdate; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getTotalRides() { return totalRides; }
    public void setTotalRides(Integer totalRides) { this.totalRides = totalRides; }

    public List<Vehicle> getVehicles() {
        if (vehicles == null) vehicles = new ArrayList<>();
        return vehicles;
    }
    public void setVehicles(List<Vehicle> vehicles) { this.vehicles = vehicles; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
