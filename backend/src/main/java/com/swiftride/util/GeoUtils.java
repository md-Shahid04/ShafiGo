package com.swiftride.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class GeoUtils {

    private static final int EARTH_RADIUS_KM = 6371;

    /**
     * Calculate Haversine distance in kilometers between two GPS coordinates.
     */
    public static double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = EARTH_RADIUS_KM * c;

        // Round to 2 decimal places
        return round(distance, 2);
    }

    /**
     * Estimate trip duration in minutes assuming average city speed of ~30 km/h plus base dispatch buffer.
     */
    public static int estimateDurationMinutes(double distanceKm) {
        if (distanceKm <= 0) return 1;
        // Average speed: 30 km/h -> 0.5 km/min, plus 2 min traffic buffer
        int minutes = (int) Math.ceil((distanceKm / 30.0) * 60) + 2;
        return Math.max(minutes, 3);
    }

    public static double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();
        BigDecimal bd = BigDecimal.valueOf(value);
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }
}
