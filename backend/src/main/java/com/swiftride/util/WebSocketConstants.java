package com.swiftride.util;

public final class WebSocketConstants {

    private WebSocketConstants() {}

    // Destinations
    public static final String WS_ENDPOINT = "/ws";
    public static final String APP_PREFIX = "/app";
    public static final String TOPIC_PREFIX = "/topic";

    // Topics
    public static final String TOPIC_DRIVER_DISPATCH = "/topic/driver/{driverId}";
    public static final String TOPIC_RIDER_UPDATES = "/topic/rider/{riderId}";
    public static final String TOPIC_RIDE_TRACKING = "/topic/ride/{rideId}";
    public static final String TOPIC_USER_NOTIFICATIONS = "/topic/user/{userId}/notifications";
    public static final String TOPIC_ADMIN_FEED = "/topic/admin";

    // Event Types
    public static final String EVENT_RIDE_REQUESTED = "RIDE_REQUESTED";
    public static final String EVENT_RIDE_ACCEPTED = "RIDE_ACCEPTED";
    public static final String EVENT_DRIVER_ARRIVING = "DRIVER_ARRIVING";
    public static final String EVENT_DRIVER_ARRIVED = "DRIVER_ARRIVED";
    public static final String EVENT_RIDE_STARTED = "RIDE_STARTED";
    public static final String EVENT_RIDE_COMPLETED = "RIDE_COMPLETED";
    public static final String EVENT_RIDE_CANCELLED = "RIDE_CANCELLED";
    public static final String EVENT_DRIVER_LOCATION_UPDATED = "DRIVER_LOCATION_UPDATED";
}
