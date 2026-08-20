# SwiftRide Database Schema & Data Dictionary

## 1. Relational Entity-Relationship Overview

```
+---------------+         1:1         +---------------+
|     users     | ------------------- |    drivers    |
+---------------+                     +---------------+
  |           |                         |           |
  | 1:N       | 1:N                     | 1:N       | 1:N
  v           v                         v           v
+-------+   +---------------+         +----------+ +-----------+
|notifs |   |     rides     | <-------+ vehicles | |  ratings  |
+-------+   +---------------+   1:N   +----------+ +-----------+
              |           |
              | 1:N       | 1:1
              v           v
       +-------------+  +-----------+
       |ride_locations| |  ratings  |
       +-------------+  +-----------+
```

---

## 2. Table Specifications

### 2.1 `users`
Stores all platform user credentials and basic account information.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | Unique user identifier |
| `first_name` | VARCHAR(60) | NOT NULL | User first name |
| `last_name` | VARCHAR(60) | NOT NULL | User last name |
| `email` | VARCHAR(120) | NOT NULL, UNIQUE, INDEX | Login email address |
| `phone` | VARCHAR(25) | NULL | Contact phone number |
| `password` | VARCHAR(255) | NOT NULL | BCrypt hashed password |
| `profile_image` | VARCHAR(500) | NULL | URL to avatar image |
| `role` | VARCHAR(20) | NOT NULL, INDEX | `ROLE_RIDER`, `ROLE_DRIVER`, `ROLE_ADMIN` |
| `active` | BOOLEAN | NOT NULL, DEFAULT TRUE | Account active flag |
| `created_at` | DATETIME | NOT NULL | Timestamp created |
| `updated_at` | DATETIME | NOT NULL | Timestamp updated |

### 2.2 `drivers`
Stores professional driver attributes, online availability, and verification state.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | Unique driver identifier |
| `user_id` | BIGINT | NOT NULL, UNIQUE, FK -> `users.id` | Associated user account |
| `license_number` | VARCHAR(50) | NOT NULL, UNIQUE | Official driver license number |
| `verification_status` | VARCHAR(20) | NOT NULL, DEFAULT 'PENDING' | `PENDING`, `APPROVED`, `REJECTED` |
| `online_status` | VARCHAR(20) | NOT NULL, DEFAULT 'OFFLINE' | `ONLINE`, `OFFLINE`, `BUSY` |
| `current_latitude` | DOUBLE | NULL | Last reported GPS latitude |
| `current_longitude`| DOUBLE | NULL | Last reported GPS longitude |
| `rating` | DOUBLE | NOT NULL, DEFAULT 5.0 | Aggregate driver rating score (1.0–5.0) |
| `total_rides` | INT | NOT NULL, DEFAULT 0 | Count of completed trips |
| `version` | BIGINT | DEFAULT 0 | Optimistic concurrency control lock |

### 2.3 `vehicles`
Stores vehicles attached to driver accounts.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | Unique vehicle ID |
| `driver_id` | BIGINT | NOT NULL, FK -> `drivers.id` | Owning driver |
| `vehicle_type` | VARCHAR(20) | NOT NULL | `BIKE`, `SEDAN`, `SUV` |
| `brand` | VARCHAR(50) | NOT NULL | Make / Manufacturer (e.g. Toyota) |
| `model` | VARCHAR(50) | NOT NULL | Model name (e.g. Camry) |
| `color` | VARCHAR(30) | NOT NULL | Vehicle exterior color |
| `registration_number` | VARCHAR(30) | NOT NULL, UNIQUE | License plate number |
| `year` | INT | NOT NULL | Model year (>= 2000) |
| `active` | BOOLEAN | NOT NULL, DEFAULT TRUE | Active flag for current shift |

### 2.4 `rides`
The central transaction table tracking every trip request, status milestone, and fare.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | Unique ride identifier |
| `rider_id` | BIGINT | NOT NULL, FK -> `users.id` | Rider who booked the trip |
| `driver_id` | BIGINT | NULL, FK -> `drivers.id` | Driver assigned to trip |
| `vehicle_id` | BIGINT | NULL, FK -> `vehicles.id` | Vehicle used for trip |
| `vehicle_type` | VARCHAR(20) | NOT NULL | Requested vehicle tier |
| `pickup_address` | VARCHAR(255) | NOT NULL | Human-readable pickup location |
| `pickup_latitude` | DOUBLE | NOT NULL | Pickup latitude |
| `pickup_longitude` | DOUBLE | NOT NULL | Pickup longitude |
| `destination_address` | VARCHAR(255) | NOT NULL | Destination address |
| `destination_latitude` | DOUBLE | NOT NULL | Destination latitude |
| `destination_longitude`| DOUBLE | NOT NULL | Destination longitude |
| `distance_km` | DOUBLE | NOT NULL | Calculated distance in kilometers |
| `estimated_duration_minutes` | INT | NOT NULL | Estimated trip duration in minutes |
| `estimated_fare` | DOUBLE | NOT NULL | Calculated trip fare |
| `final_fare` | DOUBLE | NULL | Final charged fare upon completion |
| `status` | VARCHAR(30) | NOT NULL, INDEX | State enum |
| `cancellation_reason` | VARCHAR(255) | NULL | Reason text if cancelled |
| `requested_at` | DATETIME | NULL | Timestamp ride requested |
| `accepted_at` | DATETIME | NULL | Timestamp driver accepted |
| `arrived_at` | DATETIME | NULL | Timestamp driver reached pickup |
| `started_at` | DATETIME | NULL | Timestamp trip began |
| `completed_at` | DATETIME | NULL | Timestamp destination reached |
| `cancelled_at` | DATETIME | NULL | Timestamp trip was cancelled |
| `version` | BIGINT | DEFAULT 0 | Locking version |

### 2.5 `ride_locations`
Breadcrumb telemetry points recorded during active trips.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | Identifier |
| `ride_id` | BIGINT | NOT NULL, FK -> `rides.id` | Associated ride |
| `driver_latitude` | DOUBLE | NOT NULL | GPS Latitude |
| `driver_longitude` | DOUBLE | NOT NULL | GPS Longitude |
| `timestamp` | DATETIME | NOT NULL | Telemetry recording timestamp |

### 2.6 `ratings`
Rider reviews and ratings for completed trips.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | Rating ID |
| `ride_id` | BIGINT | NOT NULL, UNIQUE, FK -> `rides.id` | Rated ride |
| `rider_id` | BIGINT | NOT NULL, FK -> `users.id` | Rating author |
| `driver_id` | BIGINT | NOT NULL, FK -> `drivers.id` | Rated driver |
| `rating` | INT | NOT NULL (1 to 5) | Star rating score |
| `comment` | VARCHAR(500) | NULL | Optional text feedback |

### 2.7 `notifications`
In-app push notifications.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | Notification ID |
| `user_id` | BIGINT | NOT NULL, FK -> `users.id` | Recipient user |
| `title` | VARCHAR(120) | NOT NULL | Header title |
| `message` | VARCHAR(500) | NOT NULL | Message body |
| `type` | VARCHAR(50) | NOT NULL | Event classification |
| `is_read` | BOOLEAN | NOT NULL, DEFAULT FALSE | Read indicator |
