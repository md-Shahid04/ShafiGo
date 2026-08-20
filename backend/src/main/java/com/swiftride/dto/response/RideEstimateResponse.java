package com.swiftride.dto.response;

import com.swiftride.entity.VehicleType;
import java.util.Map;

public class RideEstimateResponse {

    private Double distanceKm;
    private Integer estimatedDurationMinutes;
    private Map<VehicleType, Double> estimatedFares;

    public RideEstimateResponse() {}

    public RideEstimateResponse(Double distanceKm, Integer estimatedDurationMinutes, Map<VehicleType, Double> estimatedFares) {
        this.distanceKm = distanceKm;
        this.estimatedDurationMinutes = estimatedDurationMinutes;
        this.estimatedFares = estimatedFares;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Double distanceKm;
        private Integer estimatedDurationMinutes;
        private Map<VehicleType, Double> estimatedFares;

        public Builder distanceKm(Double distanceKm) { this.distanceKm = distanceKm; return this; }
        public Builder estimatedDurationMinutes(Integer minutes) { this.estimatedDurationMinutes = minutes; return this; }
        public Builder estimatedFares(Map<VehicleType, Double> fares) { this.estimatedFares = fares; return this; }

        public RideEstimateResponse build() {
            return new RideEstimateResponse(distanceKm, estimatedDurationMinutes, estimatedFares);
        }
    }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public Integer getEstimatedDurationMinutes() { return estimatedDurationMinutes; }
    public void setEstimatedDurationMinutes(Integer estimatedDurationMinutes) { this.estimatedDurationMinutes = estimatedDurationMinutes; }

    public Map<VehicleType, Double> getEstimatedFares() { return estimatedFares; }
    public void setEstimatedFares(Map<VehicleType, Double> estimatedFares) { this.estimatedFares = estimatedFares; }
}
