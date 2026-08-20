package com.swiftride.dto.response;

import com.swiftride.entity.VehicleType;

public class VehicleDto {

    private Long id;
    private Long driverId;
    private VehicleType vehicleType;
    private String brand;
    private String model;
    private String color;
    private String registrationNumber;
    private Integer year;
    private Boolean active;

    public VehicleDto() {}

    public VehicleDto(Long id, Long driverId, VehicleType vehicleType, String brand, String model, String color, String registrationNumber, Integer year, Boolean active) {
        this.id = id;
        this.driverId = driverId;
        this.vehicleType = vehicleType;
        this.brand = brand;
        this.model = model;
        this.color = color;
        this.registrationNumber = registrationNumber;
        this.year = year;
        this.active = active;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long driverId;
        private VehicleType vehicleType;
        private String brand;
        private String model;
        private String color;
        private String registrationNumber;
        private Integer year;
        private Boolean active;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder driverId(Long driverId) { this.driverId = driverId; return this; }
        public Builder vehicleType(VehicleType vehicleType) { this.vehicleType = vehicleType; return this; }
        public Builder brand(String brand) { this.brand = brand; return this; }
        public Builder model(String model) { this.model = model; return this; }
        public Builder color(String color) { this.color = color; return this; }
        public Builder registrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; return this; }
        public Builder year(Integer year) { this.year = year; return this; }
        public Builder active(Boolean active) { this.active = active; return this; }

        public VehicleDto build() {
            return new VehicleDto(id, driverId, vehicleType, brand, model, color, registrationNumber, year, active);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }

    public VehicleType getVehicleType() { return vehicleType; }
    public void setVehicleType(VehicleType vehicleType) { this.vehicleType = vehicleType; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
