# SwiftRide Architecture & System Design

## 1. System Overview

SwiftRide is a high-performance, real-time ride-hailing web platform MVP built with a modern decoupled full-stack architecture:

- **Frontend**: Single Page Application built with React 18, Vite, Tailwind CSS, Redux Toolkit, and STOMP WebSocket client.
- **Backend**: Spring Boot 3 layered REST API with Spring Security (Stateless JWT), Spring Data JPA, Hibernate, and embedded STOMP WebSocket Broker.
- **Data Store**: MySQL 8.0 relational database with transactional pessimistic/optimistic locking and index optimizations.

```
+-------------------------------------------------------------------------+
|                              CLIENT TIER                                |
|  [Rider Portal]         [Driver Console]           [Admin Dashboard]    |
|  React 18 + Redux Toolkit + Tailwind CSS + Leaflet / OSM Maps Engine    |
+--------------------+--------------------------------+-------------------+
                     | HTTP REST (JWT)                | WS / STOMP
                     v                                v
+-------------------------------------------------------------------------+
|                              BACKEND TIER                               |
|                     Spring Boot 3.2 (Java 17)                          |
|                                                                         |
|  [Security & Auth]  --> JWT Auth Filter & BCrypt Password Hashing      |
|  [Controllers]      --> RESTful APIs with Swagger 3 Documentation       |
|  [Services]         --> Ride Lifecycle, Pricing, Driver Matching        |
|  [WebSocket Broker] --> STOMP In-Memory Message Broker (/topic, /app)   |
|  [Data Layer]       --> Spring Data JPA & Hibernate ORM                |
+------------------------------------+------------------------------------+
                                     | JDBC
                                     v
+-------------------------------------------------------------------------+
|                              DATABASE TIER                              |
|                   MySQL 8.0 (Relational Schema)                         |
|  Tables: users, drivers, vehicles, rides, ride_locations, ratings, notifs|
+-------------------------------------------------------------------------+
```

---

## 2. Key Architectural Subsystems

### 2.1 Real-Time Telemetry & Dispatch Subsystem
1. **Ride Dispatch**: When a rider books a trip, the `MatchingService` queries approved online drivers within the configurable `searchRadiusKm` (default: 5 km) using the Haversine distance formula.
2. **WebSocket Broadcasting**: Dispatches `RIDE_REQUESTED` STOMP messages directly to `/topic/driver/{driverId}`.
3. **Concurrency Protection**: The first driver to click "Accept" triggers `acceptRide()` inside a `@Transactional(isolation = Isolation.READ_COMMITTED)` block that acquires a `PESSIMISTIC_WRITE` lock on the ride entity row. If another driver tries to accept concurrently, they receive a `ConflictException (409)`.
4. **Live GPS Breadcrumbs**: Drivers periodically transmit GPS telemetry every 3–5 seconds to `/api/drivers/location`, broadcasting updates to `/topic/ride/{rideId}` and persisting points in `ride_locations`.

### 2.2 Dynamic Pricing Subsystem
Fares are calculated dynamically based on distance, duration, and vehicle tier:
$$\text{Fare} = \text{BaseFare} + (\text{DistanceKm} \times \text{PricePerKm}) + (\text{DurationMinutes} \times \text{PricePerMinute})$$

Tiers:
- **SwiftBike**: Base $2.50, $0.80/km, $0.15/min
- **SwiftSedan**: Base $5.00, $1.50/km, $0.30/min
- **SwiftSUV**: Base $8.00, $2.20/km, $0.45/min

### 2.3 Ride State Transition Engine
Rides advance strictly through validated state milestones:
```
REQUESTED / SEARCHING_DRIVER
           ↓
     DRIVER_ACCEPTED
           ↓
     DRIVER_ARRIVING
           ↓
     DRIVER_ARRIVED
           ↓
      RIDE_STARTED
           ↓
     RIDE_COMPLETED
```
*At any point before `RIDE_STARTED`, either party may cancel, transitioning the ride to `CANCELLED` and releasing the driver back to `ONLINE`.*
