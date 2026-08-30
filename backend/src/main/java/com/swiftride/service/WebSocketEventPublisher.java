package com.swiftride.service;

import com.swiftride.dto.response.NotificationDto;
import com.swiftride.entity.Driver;
import com.swiftride.entity.DriverEarning;
import com.swiftride.entity.Ride;
import com.swiftride.entity.User;
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

    public void publishRideRequestedToDriver(Long driverId, Long userId, String userEmail, Ride ride) {
        String driverTopic = WebSocketConstants.TOPIC_DRIVER_DISPATCH.replace("{driverId}", String.valueOf(driverId));
        Map<String, Object> payload = createPayload(WebSocketConstants.EVENT_RIDE_REQUESTED, ride);
        payload.put("event", WebSocketConstants.EVENT_RIDE_REQUESTED);

        log.info("[WS] Broadcasting RIDE_REQUESTED to driver topic: {}", driverTopic);
        messagingTemplate.convertAndSend(driverTopic, payload);

        // Targeted user notification channel
        if (userId != null) {
            String userTopic = WebSocketConstants.TOPIC_USER_NOTIFICATIONS.replace("{userId}", String.valueOf(userId));
            Map<String, Object> notif = new HashMap<>();
            notif.put("title", "🔔 New Ride Request");
            notif.put("message", "Pickup: " + ride.getPickupAddress() + " | Fare: ₹" + (ride.getEstimatedFare() != null ? String.format("%.2f", ride.getEstimatedFare()) : "0.00"));
            notif.put("type", "RIDE_REQUEST");
            notif.put("eventType", "RIDE_REQUESTED");
            notif.put("ride", EntityMapper.toRideDto(ride));
            notif.put("timestamp", System.currentTimeMillis());
            messagingTemplate.convertAndSend(userTopic, notif);
        }

        // Targeted Spring user destination queue
        if (userEmail != null) {
            try {
                messagingTemplate.convertAndSendToUser(userEmail, "/queue/ride-requests", payload);
            } catch (Exception e) {
                log.debug("User destination queue delivery skipped: {}", e.getMessage());
            }
        }
    }

    public void publishRideRequestedToDriver(Long driverId, Long userId, Ride ride) {
        publishRideRequestedToDriver(driverId, userId, null, ride);
    }

    public void publishRideRequestedToDriver(Long driverId, Ride ride) {
        publishRideRequestedToDriver(driverId, null, null, ride);
    }

    public void publishRideRequestedToAdmin(Ride ride) {
        Map<String, Object> payload = createPayload(WebSocketConstants.EVENT_RIDE_REQUESTED, ride);
        messagingTemplate.convertAndSend(WebSocketConstants.TOPIC_ADMIN_FEED, payload);
    }

    public void publishNoDriverFound(Ride ride) {
        Map<String, Object> payload = createPayload("NO_DRIVER_FOUND", ride);
        payload.put("message", "No driver available in your area right now. Please try again.");

        if (ride.getRider() != null) {
            String riderTopic = WebSocketConstants.TOPIC_RIDER_UPDATES.replace("{riderId}", String.valueOf(ride.getRider().getId()));
            messagingTemplate.convertAndSend(riderTopic, payload);
        }
        String rideTopic = WebSocketConstants.TOPIC_RIDE_TRACKING.replace("{rideId}", String.valueOf(ride.getId()));
        messagingTemplate.convertAndSend(rideTopic, payload);
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

    public void publishDriverLocation(Long rideId, Long driverId, double latitude, double longitude, Double heading, Double speed, Double accuracy, Long timestamp) {
        String destination = WebSocketConstants.TOPIC_RIDE_TRACKING.replace("{rideId}", String.valueOf(rideId));
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventType", WebSocketConstants.EVENT_DRIVER_LOCATION_UPDATED);
        payload.put("rideId", rideId);
        payload.put("driverId", driverId);
        payload.put("latitude", latitude);
        payload.put("longitude", longitude);
        payload.put("heading", heading != null ? heading : 0.0);
        payload.put("speed", speed != null ? speed : 0.0);
        payload.put("accuracy", accuracy != null ? accuracy : 10.0);
        payload.put("timestamp", timestamp != null ? timestamp : System.currentTimeMillis());

        messagingTemplate.convertAndSend(destination, payload);
    }

    public void publishDriverLocationToAdmin(Driver driver, double latitude, double longitude, Double heading, Double speed, Double accuracy, Long timestamp) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventType", WebSocketConstants.EVENT_DRIVER_LOCATION_UPDATED);
        payload.put("driverId", driver.getId());
        payload.put("driverName", driver.getUser() != null ? driver.getUser().getFirstName() + " " + driver.getUser().getLastName() : "Driver");
        payload.put("latitude", latitude);
        payload.put("longitude", longitude);
        payload.put("heading", heading != null ? heading : 0.0);
        payload.put("speed", speed != null ? speed : 0.0);
        payload.put("accuracy", accuracy != null ? accuracy : 10.0);
        payload.put("onlineStatus", driver.getOnlineStatus().name());
        payload.put("verificationStatus", driver.getVerificationStatus().name());
        payload.put("timestamp", timestamp != null ? timestamp : System.currentTimeMillis());

        messagingTemplate.convertAndSend(WebSocketConstants.TOPIC_ADMIN_FEED, payload);
    }

    public void publishDriverVerificationUpdated(Driver driver) {
        String destination = WebSocketConstants.TOPIC_DRIVER_DISPATCH.replace("{driverId}", String.valueOf(driver.getId()));
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventType", "DRIVER_VERIFICATION_UPDATED");
        payload.put("driver", EntityMapper.toDriverDto(driver));
        payload.put("driverId", driver.getId());
        payload.put("approvalStatus", driver.getVerificationStatus().name());
        payload.put("status", driver.getVerificationStatus().name());
        payload.put("availabilityStatus", driver.getOnlineStatus().name());
        payload.put("timestamp", System.currentTimeMillis());

        log.info("Broadcasting DRIVER_VERIFICATION_UPDATED to {}: {}", destination, driver.getVerificationStatus());
        messagingTemplate.convertAndSend(destination, payload);

        // Also broadcast specific DRIVER_APPROVED or DRIVER_REJECTED event
        Map<String, Object> specificPayload = new HashMap<>(payload);
        if (driver.getVerificationStatus() == com.swiftride.entity.DriverVerificationStatus.APPROVED) {
            specificPayload.put("eventType", "DRIVER_APPROVED");
        } else if (driver.getVerificationStatus() == com.swiftride.entity.DriverVerificationStatus.REJECTED) {
            specificPayload.put("eventType", "DRIVER_REJECTED");
        } else if (driver.getVerificationStatus() == com.swiftride.entity.DriverVerificationStatus.SUSPENDED) {
            specificPayload.put("eventType", "DRIVER_SUSPENDED");
        }
        messagingTemplate.convertAndSend(destination, specificPayload);

        // Also broadcast to Admin feed
        messagingTemplate.convertAndSend(WebSocketConstants.TOPIC_ADMIN_FEED, payload);

        if (driver.getUser() != null) {
            String userTopic = WebSocketConstants.TOPIC_USER_NOTIFICATIONS.replace("{userId}", String.valueOf(driver.getUser().getId()));
            Map<String, Object> notif = new HashMap<>();
            notif.put("title", "Driver Verification " + driver.getVerificationStatus());
            notif.put("message", "Your driver application is now " + driver.getVerificationStatus());
            notif.put("type", "DRIVER_APPROVAL");
            notif.put("eventType", "DRIVER_VERIFICATION_UPDATED");
            notif.put("driver", EntityMapper.toDriverDto(driver));
            notif.put("status", driver.getVerificationStatus().name());
            messagingTemplate.convertAndSend(userTopic, notif);
        }
    }

    public void publishDriverStatusChanged(Driver driver) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventType", "DRIVER_STATUS_UPDATED");
        payload.put("driverId", driver.getId());
        payload.put("driverName", driver.getUser() != null ? driver.getUser().getFirstName() + " " + driver.getUser().getLastName() : "Driver");
        payload.put("onlineStatus", driver.getOnlineStatus().name());
        payload.put("verificationStatus", driver.getVerificationStatus().name());
        payload.put("timestamp", System.currentTimeMillis());

        messagingTemplate.convertAndSend(WebSocketConstants.TOPIC_ADMIN_FEED, payload);
    }

    public void publishUserRegistered(User user) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventType", "USER_REGISTERED");
        payload.put("user", EntityMapper.toUserDto(user));
        payload.put("timestamp", System.currentTimeMillis());

        messagingTemplate.convertAndSend(WebSocketConstants.TOPIC_ADMIN_FEED, payload);
    }

    public void publishDriverRegistered(Driver driver) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventType", "DRIVER_REGISTERED");
        payload.put("driver", EntityMapper.toDriverDto(driver));
        payload.put("timestamp", System.currentTimeMillis());

        messagingTemplate.convertAndSend(WebSocketConstants.TOPIC_ADMIN_FEED, payload);
    }

    public void publishDriverEarningsUpdated(Long driverId, DriverEarning earning, Double todayTotal) {
        String destination = WebSocketConstants.TOPIC_DRIVER_DISPATCH.replace("{driverId}", String.valueOf(driverId));
        Map<String, Object> payload = new HashMap<>();
        payload.put("eventType", "EARNINGS_UPDATED");
        payload.put("earningAmount", earning != null ? earning.getDriverEarning() : 0.0);
        payload.put("grossFare", earning != null ? earning.getGrossFare() : 0.0);
        payload.put("platformFee", earning != null ? earning.getPlatformFee() : 0.0);
        payload.put("todayTotal", todayTotal != null ? todayTotal : 0.0);
        payload.put("timestamp", System.currentTimeMillis());

        messagingTemplate.convertAndSend(destination, payload);

        // Also broadcast to Admin topic
        Map<String, Object> adminPayload = new HashMap<>();
        adminPayload.put("eventType", "REVENUE_UPDATED");
        adminPayload.put("grossFare", earning != null ? earning.getGrossFare() : 0.0);
        adminPayload.put("driverEarning", earning != null ? earning.getDriverEarning() : 0.0);
        adminPayload.put("platformCommission", earning != null ? earning.getPlatformFee() : 0.0);
        adminPayload.put("timestamp", System.currentTimeMillis());
        messagingTemplate.convertAndSend(WebSocketConstants.TOPIC_ADMIN_FEED, adminPayload);
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
        payload.put("event", eventType);
        payload.put("ride", EntityMapper.toRideDto(ride));
        payload.put("timestamp", System.currentTimeMillis());
        return payload;
    }
}
