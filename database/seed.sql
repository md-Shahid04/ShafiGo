-- ==============================================================================
-- SwiftRide Seed Data for MySQL
-- Note: Passwords below are BCrypt hashes for 'Admin@12345', 'Rider@12345', 'Driver@12345'
-- ==============================================================================

USE swiftride_db;

-- Clear existing data (optional for clean seed)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE notifications;
TRUNCATE TABLE ratings;
TRUNCATE TABLE ride_locations;
TRUNCATE TABLE rides;
TRUNCATE TABLE vehicles;
TRUNCATE TABLE drivers;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users
-- Admin (Admin@12345)
INSERT INTO users (id, first_name, last_name, email, phone, password, profile_image, role, active, created_at, updated_at)
VALUES (1, 'SwiftRide', 'Admin', 'admin@swiftride.com', '+1-800-555-0100', '$2a$10$wT8KzNf1K/81B4W1M9.tCOK57GZ2B17U2k3u0c6VzWbHkU5WwH3vW', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'ROLE_ADMIN', TRUE, NOW(), NOW());

-- Riders (Rider@12345)
INSERT INTO users (id, first_name, last_name, email, phone, password, profile_image, role, active, created_at, updated_at)
VALUES
(2, 'Alex', 'Johnson', 'rider1@swiftride.com', '+1-555-0191', '$2a$10$wT8KzNf1K/81B4W1M9.tCOK57GZ2B17U2k3u0c6VzWbHkU5WwH3vW', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', 'ROLE_RIDER', TRUE, NOW(), NOW()),
(3, 'Sarah', 'Williams', 'rider2@swiftride.com', '+1-555-0192', '$2a$10$wT8KzNf1K/81B4W1M9.tCOK57GZ2B17U2k3u0c6VzWbHkU5WwH3vW', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'ROLE_RIDER', TRUE, NOW(), NOW()),
(4, 'David', 'Miller', 'rider3@swiftride.com', '+1-555-0193', '$2a$10$wT8KzNf1K/81B4W1M9.tCOK57GZ2B17U2k3u0c6VzWbHkU5WwH3vW', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150', 'ROLE_RIDER', TRUE, NOW(), NOW());

-- Drivers (Driver@12345)
INSERT INTO users (id, first_name, last_name, email, phone, password, profile_image, role, active, created_at, updated_at)
VALUES
(5, 'Michael', 'Rodriguez', 'driver1@swiftride.com', '+1-555-0201', '$2a$10$wT8KzNf1K/81B4W1M9.tCOK57GZ2B17U2k3u0c6VzWbHkU5WwH3vW', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'ROLE_DRIVER', TRUE, NOW(), NOW()),
(6, 'Emily', 'Chen', 'driver2@swiftride.com', '+1-555-0202', '$2a$10$wT8KzNf1K/81B4W1M9.tCOK57GZ2B17U2k3u0c6VzWbHkU5WwH3vW', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'ROLE_DRIVER', TRUE, NOW(), NOW()),
(7, 'James', 'Wilson', 'driver3@swiftride.com', '+1-555-0203', '$2a$10$wT8KzNf1K/81B4W1M9.tCOK57GZ2B17U2k3u0c6VzWbHkU5WwH3vW', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'ROLE_DRIVER', TRUE, NOW(), NOW()),
(8, 'Carlos', 'Gomez', 'driver4@swiftride.com', '+1-555-0204', '$2a$10$wT8KzNf1K/81B4W1M9.tCOK57GZ2B17U2k3u0c6VzWbHkU5WwH3vW', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', 'ROLE_DRIVER', TRUE, NOW(), NOW());

-- 2. Drivers Profiles
INSERT INTO drivers (id, user_id, license_number, verification_status, online_status, current_latitude, current_longitude, rating, total_rides, created_at, updated_at)
VALUES
(1, 5, 'DL-NY-987412', 'APPROVED', 'ONLINE', 40.7128, -74.0060, 4.9, 48, NOW(), NOW()),
(2, 6, 'DL-NY-556123', 'APPROVED', 'ONLINE', 40.7155, -74.0080, 5.0, 32, NOW(), NOW()),
(3, 7, 'DL-NY-332901', 'APPROVED', 'ONLINE', 40.7095, -74.0020, 4.8, 19, NOW(), NOW()),
(4, 8, 'DL-NY-771449', 'PENDING', 'OFFLINE', NULL, NULL, 5.0, 0, NOW(), NOW());

-- 3. Vehicles
INSERT INTO vehicles (id, driver_id, vehicle_type, brand, model, color, registration_number, year, active, created_at, updated_at)
VALUES
(1, 1, 'SEDAN', 'Toyota', 'Camry Hybrid', 'Midnight Silver', 'NY-882-XYZ', 2023, TRUE, NOW(), NOW()),
(2, 2, 'SUV', 'Honda', 'CR-V Touring', 'Crystal Black', 'NY-419-ABC', 2024, TRUE, NOW(), NOW()),
(3, 3, 'BIKE', 'Yamaha', 'MT-07', 'Icon Blue', 'NY-902-MTR', 2022, TRUE, NOW(), NOW()),
(4, 4, 'SEDAN', 'Hyundai', 'Elantra', 'Polar White', 'NY-301-HYU', 2021, TRUE, NOW(), NOW());

-- 4. Sample Completed Rides
INSERT INTO rides (id, rider_id, driver_id, vehicle_id, vehicle_type, pickup_address, pickup_latitude, pickup_longitude, destination_address, destination_latitude, destination_longitude, distance_km, estimated_duration_minutes, estimated_fare, final_fare, status, requested_at, accepted_at, arrived_at, started_at, completed_at, created_at, updated_at)
VALUES
(1, 2, 1, 1, 'SEDAN', 'World Trade Center, New York, NY', 40.7127, -74.0134, 'Empire State Building, 350 5th Ave, NY', 40.7484, -73.9857, 4.8, 16, 17.00, 17.00, 'RIDE_COMPLETED', DATE_SUB(NOW(), INTERVAL 4 HOUR), DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 4 HOUR), NOW()),
(2, 3, 2, 2, 'SUV', 'Brooklyn Bridge Park, NY', 40.7028, -73.9964, 'Times Square, Manhattan, NY', 40.7580, -73.9855, 7.2, 22, 33.74, 33.74, 'RIDE_COMPLETED', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), NOW());

-- 5. Ratings
INSERT INTO ratings (id, ride_id, rider_id, driver_id, rating, comment, created_at)
VALUES
(1, 1, 2, 1, 5, 'Excellent driver! Smooth ride and very clean vehicle.', NOW()),
(2, 2, 3, 2, 5, 'Spacious SUV, courteous driver, on time!', NOW());

-- 6. Notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read, created_at)
VALUES
(1, 2, 'Welcome to SwiftRide!', 'Your account is active. Book your first ride anytime.', 'SYSTEM', FALSE, NOW()),
(2, 5, 'Driver Profile Approved', 'Welcome aboard Michael! You are verified and ready to accept rides.', 'DRIVER_APPROVAL', TRUE, NOW());
