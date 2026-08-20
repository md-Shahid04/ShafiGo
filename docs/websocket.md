# SwiftRide WebSocket & STOMP Protocol Guide

## 1. Connection Details

- **STOMP Endpoint**: `/ws` (supports native WebSocket and SockJS fallback)
- **Application Destination Prefix**: `/app`
- **Broker Destination Prefix**: `/topic`

---

## 2. Topic Subscriptions Catalog

| Topic Destination | Subscriber Role | Purpose |
| :--- | :--- | :--- |
| `/topic/rider/{riderId}` | Rider | Receives ride status progression, driver matches, and completion events. |
| `/topic/driver/{driverId}` | Driver | Receives incoming trip dispatches (`RIDE_REQUESTED`) and cancellations. |
| `/topic/ride/{rideId}` | Rider & Driver | Real-time live GPS telemetry (`DRIVER_LOCATION_UPDATED`) and ride events. |
| `/topic/user/{userId}/notifications` | Any User | Instant in-app push notifications. |
| `/topic/admin` | Admin | Real-time platform activity and dispatch monitor. |

---

## 3. Event Types & Sample Payloads

### 3.1 `RIDE_REQUESTED` (Sent to nearby drivers)
```json
{
  "eventType": "RIDE_REQUESTED",
  "ride": {
    "id": 42,
    "rider": {
      "fullName": "Alex Johnson",
      "phone": "+1-555-0191"
    },
    "pickupAddress": "World Trade Center, NY",
    "pickupLatitude": 40.7128,
    "pickupLongitude": -74.0060,
    "destinationAddress": "Times Square, NY",
    "destinationLatitude": 40.7580,
    "destinationLongitude": -73.9855,
    "distanceKm": 4.8,
    "estimatedDurationMinutes": 16,
    "estimatedFare": 17.00,
    "vehicleType": "SEDAN"
  },
  "timestamp": 1718890200000
}
```

### 3.2 `DRIVER_LOCATION_UPDATED` (Broadcast every 3–5 seconds)
```json
{
  "eventType": "DRIVER_LOCATION_UPDATED",
  "rideId": 42,
  "driverId": 5,
  "latitude": 40.7142,
  "longitude": -74.0049,
  "timestamp": 1718890205000
}
```

### 3.3 State Progression Events
- `RIDE_ACCEPTED`: Driver claims ride.
- `DRIVER_ARRIVING`: Driver begins travel to pickup.
- `DRIVER_ARRIVED`: Driver reaches pickup spot.
- `RIDE_STARTED`: Rider is in vehicle; trip is in progress.
- `RIDE_COMPLETED`: Destination reached; final fare locked.
- `RIDE_CANCELLED`: Ride terminated early.
