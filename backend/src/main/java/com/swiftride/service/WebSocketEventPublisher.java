package com.swiftride.service;

import com.swiftride.dto.response.NotificationDto;
import com.swiftride.entity.Ride;
import com.swiftride.util.EntityMapper;
import com.swiftride.util.WebSocketConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class WebSocketEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(WebSocketEventPublisher.class);

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketEventPublisher(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void publishRideRequestedToDriver(Long driverId, Ride ride) {
        String destination = WebSocketConstants.TOPIC_DRIVER_DISPATCH.replace("{driverId}", String.valueOf(driverId));
        Map<String, Object> payload = createPayload(WebSocketConstants.EVENT_RIDE_REQUESTED, ride);
        log.info("Broadcasting RIDE_REQUESTED to driver destination: {}", destination);
        messagingTemplate.convertAndSend(destination, payload);
    }

    public void publishRideAccepted(Ride ride) {
        broadcastRideEvent(WebSocketConstants.EVENT_RIDE_ACCEPTED, ride);
    }

    public void publishDriverArriving(Ride ride) {
        broadcastRideEvent(WebSocketConstants.EVENT_DRIVER_ARRIVING, ride);
    }

    public void publishDriverArrived(Ride ride) {
        broadcastRideEvent(WebSocketConstants.EVENT_DRIVER_ARRIVED, ride);
    }

    public void publishRideStarted(Ride ride) {
        broadcastRideEvent(WebSocketConstants.EVENT_RIDE_STARTED, ride);
    }

    public void publishRideCompleted(Ride ride) {
        broadcastRideEvent(WebSocketConstants.EVENT_RIDE_COMPLETED, ride);
    }

    public void publishRideCancelled(Ride ride) {
        broadcastRideEvent(WebSocketConstants.EVENT_RIDE_CANCELLED, ride);
    }

    public void publishDriverLocation(Long rideId, Long driverId, double latitude, double longitude) {
        String destination = WebSocketConstants.TOPIC_RIDE_TRACKING.replace("{rideId}", String.valueOf(rideId));
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventType", WebSocketConstants.EVENT_DRIVER_LOCATION_UPDATED);
        payload.put("rideId", rideId);
        payload.put("driverId", driverId);
        payload.put("latitude", latitude);
        payload.put("longitude", longitude);
        payload.put("timestamp", System.currentTimeMillis());

        messagingTemplate.convertAndSend(destination, payload);
    }

    public void publishNotification(Long userId, NotificationDto notification) {
        String destination = WebSocketConstants.TOPIC_USER_NOTIFICATIONS.replace("{userId}", String.valueOf(userId));
        messagingTemplate.convertAndSend(destination, notification);
    }

    private void broadcastRideEvent(String eventType, Ride ride) {
        Map<String, Object> payload = createPayload(eventType, ride);

        String rideTopic = WebSocketConstants.TOPIC_RIDE_TRACKING.replace("{rideId}", String.valueOf(ride.getId()));
        messagingTemplate.convertAndSend(rideTopic, payload);

        if (ride.getRider() != null) {
            String riderTopic = WebSocketConstants.TOPIC_RIDER_UPDATES.replace("{riderId}", String.valueOf(ride.getRider().getId()));
            messagingTemplate.convertAndSend(riderTopic, payload);
        }

        if (ride.getDriver() != null) {
            String driverTopic = WebSocketConstants.TOPIC_DRIVER_DISPATCH.replace("{driverId}", String.valueOf(ride.getDriver().getId()));
            messagingTemplate.convertAndSend(driverTopic, payload);
        }

        messagingTemplate.convertAndSend(WebSocketConstants.TOPIC_ADMIN_FEED, payload);
    }

    private Map<String, Object> createPayload(String eventType, Ride ride) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventType", eventType);
        payload.put("ride", EntityMapper.toRideDto(ride));
        payload.put("timestamp", System.currentTimeMillis());
        return payload;
    }
}
