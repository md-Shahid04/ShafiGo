package com.swiftride.service;

import com.swiftride.config.PricingProperties;
import com.swiftride.dto.response.RideEstimateResponse;
import com.swiftride.entity.VehicleType;
import com.swiftride.util.GeoUtils;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.EnumMap;
import java.util.Map;

@Service
public class PricingService {

    private final PricingProperties pricingProperties;

    public PricingService(PricingProperties pricingProperties) {
        this.pricingProperties = pricingProperties;
    }

    public RideEstimateResponse calculateEstimate(
            double pickupLat, double pickupLng,
            double destLat, double destLng
    ) {
        double distanceKm = GeoUtils.calculateDistanceKm(pickupLat, pickupLng, destLat, destLng);
        int durationMinutes = GeoUtils.estimateDurationMinutes(distanceKm);

        Map<VehicleType, Double> fares = new EnumMap<>(VehicleType.class);

        for (VehicleType type : VehicleType.values()) {
            double fare = calculateFare(distanceKm, durationMinutes, type);
            fares.put(type, fare);
        }

        return RideEstimateResponse.builder()
                .distanceKm(BigDecimal.valueOf(distanceKm).setScale(2, RoundingMode.HALF_UP).doubleValue())
                .estimatedDurationMinutes(durationMinutes)
                .estimatedFares(fares)
                .build();
    }

    public double calculateFare(double distanceKm, int durationMinutes, VehicleType vehicleType) {
        PricingProperties.Rate rate = pricingProperties.getRateFor(vehicleType);
        double calculated = rate.getBaseFare()
                + (distanceKm * rate.getPricePerKm())
                + (durationMinutes * rate.getPricePerMinute());

        double finalFare = Math.max(calculated, rate.getMinimumFare());
        return BigDecimal.valueOf(finalFare).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}
