package com.swiftride.dto.response;

import com.swiftride.entity.DriverOnlineStatus;
import com.swiftride.entity.DriverVerificationStatus;
import java.util.List;

public class DriverDto {

    private Long id;
    private UserDto user;
    private String licenseNumber;
    private DriverVerificationStatus verificationStatus;
    private DriverOnlineStatus onlineStatus;
    private Double currentLatitude;
    private Double currentLongitude;
    private Double rating;
    private Integer totalRides;
    private List<VehicleDto> vehicles;
    private VehicleDto activeVehicle;

    public DriverDto() {}

    public DriverDto(Long id, UserDto user, String licenseNumber, DriverVerificationStatus verificationStatus, DriverOnlineStatus onlineStatus, Double currentLatitude, Double currentLongitude, Double rating, Integer totalRides, List<VehicleDto> vehicles, VehicleDto activeVehicle) {
        this.id = id;
        this.user = user;
        this.licenseNumber = licenseNumber;
        this.verificationStatus = verificationStatus;
        this.onlineStatus = onlineStatus;
        this.currentLatitude = currentLatitude;
        this.currentLongitude = currentLongitude;
        this.rating = rating;
        this.totalRides = totalRides;
        this.vehicles = vehicles;
        this.activeVehicle = activeVehicle;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private UserDto user;
        private String licenseNumber;
        private DriverVerificationStatus verificationStatus;
        private DriverOnlineStatus onlineStatus;
        private Double currentLatitude;
        private Double currentLongitude;
        private Double rating;
        private Integer totalRides;
        private List<VehicleDto> vehicles;
        private VehicleDto activeVehicle;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder user(UserDto user) { this.user = user; return this; }
        public Builder licenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; return this; }
        public Builder verificationStatus(DriverVerificationStatus verificationStatus) { this.verificationStatus = verificationStatus; return this; }
        public Builder onlineStatus(DriverOnlineStatus onlineStatus) { this.onlineStatus = onlineStatus; return this; }
        public Builder currentLatitude(Double currentLatitude) { this.currentLatitude = currentLatitude; return this; }
        public Builder currentLongitude(Double currentLongitude) { this.currentLongitude = currentLongitude; return this; }
        public Builder rating(Double rating) { this.rating = rating; return this; }
        public Builder totalRides(Integer totalRides) { this.totalRides = totalRides; return this; }
        public Builder vehicles(List<VehicleDto> vehicles) { this.vehicles = vehicles; return this; }
        public Builder activeVehicle(VehicleDto activeVehicle) { this.activeVehicle = activeVehicle; return this; }

        public DriverDto build() {
            return new DriverDto(id, user, licenseNumber, verificationStatus, onlineStatus, currentLatitude, currentLongitude, rating, totalRides, vehicles, activeVehicle);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }

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

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getTotalRides() { return totalRides; }
    public void setTotalRides(Integer totalRides) { this.totalRides = totalRides; }

    public List<VehicleDto> getVehicles() { return vehicles; }
    public void setVehicles(List<VehicleDto> vehicles) { this.vehicles = vehicles; }

    public VehicleDto getActiveVehicle() { return activeVehicle; }
    public void setActiveVehicle(VehicleDto activeVehicle) { this.activeVehicle = activeVehicle; }
}
