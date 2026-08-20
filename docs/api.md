# SwiftRide REST API Reference

All requests accept and return `application/json`. Authenticated endpoints require the `Authorization: Bearer <JWT_TOKEN>` header.

Interactive Swagger/OpenAPI documentation is available at `http://localhost:8080/swagger-ui.html`.

---

## 1. Authentication Endpoints

### `POST /api/auth/register`
Register a new rider.
```json
{
  "firstName": "Alex",
  "lastName": "Johnson",
  "email": "alex@example.com",
  "phone": "+1-555-0191",
  "password": "Password@123"
}
```

### `POST /api/auth/driver-register`
Register a new driver with initial vehicle details.
```json
{
  "firstName": "Michael",
  "lastName": "Rodriguez",
  "email": "michael@example.com",
  "phone": "+1-555-0201",
  "password": "Password@123",
  "licenseNumber": "DL-NY-987412",
  "vehicleType": "SEDAN",
  "brand": "Toyota",
  "model": "Camry",
  "color": "Silver",
  "registrationNumber": "NY-882-XYZ",
  "year": 2023
}
```

### `POST /api/auth/login`
Log in with credentials to receive a JWT access token.
```json
{
  "email": "rider1@swiftride.com",
  "password": "Rider@12345"
}
```

### `GET /api/auth/me`
Retrieve currently authenticated user session.

---

## 2. Ride Management Endpoints

### `POST /api/rides/estimate`
Calculates distance, duration, and pricing breakdown across all vehicle tiers.
```json
{
  "pickupLatitude": 40.7128,
  "pickupLongitude": -74.0060,
  "destinationLatitude": 40.7580,
  "destinationLongitude": -73.9855
}
```

### `POST /api/rides`
Request a new trip.
```json
{
  "pickupAddress": "World Trade Center, NY",
  "pickupLatitude": 40.7128,
  "pickupLongitude": -74.0060,
  "destinationAddress": "Times Square, NY",
  "destinationLatitude": 40.7580,
  "destinationLongitude": -73.9855,
  "vehicleType": "SEDAN"
}
```

### `GET /api/rides/active/rider`
Get current active trip for the logged-in rider.

### `GET /api/rides/active/driver`
Get current active trip for the logged-in driver.

### `POST /api/rides/{id}/accept`
Driver accepts ride request (Atomic pessimistic lock).

### `POST /api/rides/{id}/arriving`
Driver marks heading toward pickup.

### `POST /api/rides/{id}/arrive`
Driver marks arrival at pickup.

### `POST /api/rides/{id}/start`
Driver starts trip.

### `POST /api/rides/{id}/complete`
Driver completes trip.

### `POST /api/rides/{id}/cancel`
Cancel ride request with optional reason.
```json
{
  "reason": "Changed my travel plans"
}
```

---

## 3. Driver & Fleet Endpoints

### `PUT /api/drivers/status`
Toggle driver availability: `ONLINE` or `OFFLINE`.
```json
{
  "onlineStatus": "ONLINE"
}
```

### `PUT /api/drivers/location`
Push live driver GPS telemetry.
```json
{
  "latitude": 40.7135,
  "longitude": -74.0055,
  "rideId": 12
}
```

### `POST /api/vehicles`
Add a new vehicle to driver profile.

### `PUT /api/vehicles/{id}/active`
Switch active vehicle for current shift.

---

## 4. Rating & Notification Endpoints

### `POST /api/ratings`
Submit 1–5 star rating and comment for a completed trip.
```json
{
  "rideId": 12,
  "rating": 5,
  "comment": "Smooth driving and great route!"
}
```

### `GET /api/notifications`
Get user in-app notifications.

### `PUT /api/notifications/{id}/read`
Mark single notification as read.

### `PUT /api/notifications/read-all`
Mark all notifications as read.

---

## 5. Admin Endpoints

### `GET /api/admin/dashboard`
Platform-wide KPI metrics and statistics.

### `GET /api/admin/users?role=ROLE_RIDER&page=0&size=10`
Paginated user directory.

### `PUT /api/admin/users/{id}/toggle-status`
Toggle active/deactivated status for user.

### `GET /api/admin/drivers?status=PENDING&page=0&size=10`
Driver verification queue.

### `PUT /api/admin/drivers/{id}/verify?status=APPROVED`
Approve or reject a driver application.

### `GET /api/admin/rides`
All platform rides audit list.

### `GET /api/admin/rides/active`
Live on-road ongoing rides.
