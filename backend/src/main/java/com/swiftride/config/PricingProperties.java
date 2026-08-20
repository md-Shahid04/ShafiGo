package com.swiftride.config;

import com.swiftride.entity.VehicleType;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.EnumMap;
import java.util.Map;

@Configuration
@ConfigurationProperties(prefix = "swiftride.pricing")
public class PricingProperties {

    private Map<VehicleType, Rate> rates = new EnumMap<>(VehicleType.class);

    public PricingProperties() {
        // Default initializations
        rates.put(VehicleType.BIKE, new Rate(2.5, 0.8, 0.15, 3.0));
        rates.put(VehicleType.SEDAN, new Rate(5.0, 1.5, 0.30, 6.0));
        rates.put(VehicleType.SUV, new Rate(8.0, 2.2, 0.45, 10.0));
    }

    public Rate getRateFor(VehicleType vehicleType) {
        Rate rate = rates.get(vehicleType);
        if (rate == null) {
            return rates.get(VehicleType.SEDAN);
        }
        return rate;
    }

    public Map<VehicleType, Rate> getRates() {
        return rates;
    }

    public void setRates(Map<VehicleType, Rate> rates) {
        this.rates = rates;
    }

    public static class Rate {
        private double baseFare;
        private double pricePerKm;
        private double pricePerMinute;
        private double minimumFare;

        public Rate() {}

        public Rate(double baseFare, double pricePerKm, double pricePerMinute, double minimumFare) {
            this.baseFare = baseFare;
            this.pricePerKm = pricePerKm;
            this.pricePerMinute = pricePerMinute;
            this.minimumFare = minimumFare;
        }

        public double getBaseFare() { return baseFare; }
        public void setBaseFare(double baseFare) { this.baseFare = baseFare; }

        public double getPricePerKm() { return pricePerKm; }
        public void setPricePerKm(double pricePerKm) { this.pricePerKm = pricePerKm; }

        public double getPricePerMinute() { return pricePerMinute; }
        public void setPricePerMinute(double pricePerMinute) { this.pricePerMinute = pricePerMinute; }

        public double getMinimumFare() { return minimumFare; }
        public void setMinimumFare(double minimumFare) { this.minimumFare = minimumFare; }
    }
}
