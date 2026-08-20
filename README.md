# ⚡ SwiftRide — Uber-Style Ride-Hailing Web Application MVP

[![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React 18](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-cyan.svg)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-lightgrey.svg)](LICENSE)

**SwiftRide** is a full-stack, production-quality Uber-style ride-hailing web platform MVP built from scratch with an original brand identity, modern glassmorphism dark-mode UI, Spring Boot 3 layered backend, MySQL database schema, STOMP WebSocket real-time dispatch, and dedicated portals for **Riders**, **Drivers**, and **Admins**.

---

## 🚀 Key Features

### 👤 Rider Experience
- **Interactive Route Booking**: Select pickup & dropoff coordinates with instant distance calculation and Google Maps / Leaflet OpenStreetMap integration.
- **Dynamic Fare Estimator**: Transparent tiered pricing across **SwiftBike**, **SwiftSedan**, and **SwiftSUV**.
- **Real-Time Dispatch**: Live driver matching with interactive radar search modal.
- **Live Vehicle Telemetry**: Real-time driver vehicle movement and arrival countdown.
- **Reviews & Ratings**: Post-trip 1–5 star driver feedback and comment submission.
- **Trip History**: Detailed trip receipts, timestamps, and route summaries.

### 🚘 Driver Console
- **Driver Onboarding**: Driver license registration and vehicle fleet management.
- **Availability Toggle**: Instant `ONLINE` / `OFFLINE` status controls.
- **Dispatch Popups**: Real-time incoming trip requests with automated acceptance timeout.
- **Lifecycle Progression**: `Heading to Pickup` ➔ `Arrived` ➔ `Start Trip` ➔ `Complete Trip`.
- **Trip Analytics**: Shift performance metrics, completed rides, and customer rating score.

### ⚡ Admin Command Center
- **Analytics KPI Dashboard**: Live monitoring of platform users, online drivers, active trips, and calculated revenue.
- **Driver Verification Queue**: Review and approve/reject driver applications and vehicle licenses.
- **User Directory**: Search and manage rider/driver accounts with status activation controls.
- **Live Ride Telemetry**: Audit trail of every trip requested across the city.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Redux Toolkit, React Router v6, Axios, Lucide React, Leaflet / OpenStreetMap |
| **Backend** | Java 17, Spring Boot 3.2, Spring Security, JWT (JJWT 0.12.5), Spring Data JPA, Hibernate, WebSocket + STOMP, Lombok |
| **Database** | MySQL 8.0 (Primary) / Embedded H2 with MySQL compatibility mode (Instant Dev Profile) |
| **Real-time** | Spring STOMP over SockJS (`/ws`, `/topic/ride/{id}`, `/topic/driver/{id}`, `/topic/rider/{id}`) |
| **Documentation**| OpenAPI 3 / Swagger (`/swagger-ui.html`), Markdown Guides (`/docs`) |

---

## 📁 Repository Structure

```
.
├── backend/                  # Spring Boot 3 Java Maven Application
│   ├── src/main/java/com/swiftride/
│   │   ├── config/           # Security, JWT, WebSocket, Swagger, Pricing, Seed Data
│   │   ├── controller/       # Auth, Users, Drivers, Vehicles, Rides, Ratings, Admin
│   │   ├── dto/              # Request & Response Data Transfer Objects
│   │   ├── entity/           # User, Driver, Vehicle, Ride, RideLocation, Rating, Notification
│   │   ├── exception/        # Global Exception Handler & Custom Status Exceptions
│   │   ├── repository/       # Spring Data JPA Repositories (Pessimistic Locks)
│   │   ├── service/          # Core Business Logic, Dispatch, Pricing, Matching
│   │   └── util/             # Haversine GeoUtils, WebSocket Constants, EntityMapper
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/                 # React 18 + Vite SPA
│   ├── src/
│   │   ├── api/              # Axios Client & API Endpoints
│   │   ├── components/       # Common, Map, Rider, Driver, and Admin components
│   │   ├── hooks/            # useAuth, useWebSocket, useGeolocation
│   │   ├── pages/            # Rider, Driver, Admin, and Auth Pages
│   │   ├── routes/           # Protected Routes & RBAC Navigation
│   │   └── store/            # Redux Toolkit Slices (auth, ride, driver, location, notifs)
│   ├── index.html
│   ├── package.json
│   └── Dockerfile
│
├── database/
│   ├── schema.sql            # MySQL 8.0+ Table Creation & Foreign Keys
│   └── seed.sql              # Initial Development Seed Data
│
├── docs/
│   ├── architecture.md       # System Architecture & Subsystems
│   ├── database.md           # Entity Relationship & Table Specifications
│   ├── api.md                # REST API Documentation
│   ├── websocket.md          # STOMP WebSocket Protocol & Event Schema
│   └── development.md        # Step-by-Step Local Setup Guide
│
├── docker-compose.yml        # Multi-Container Compose Configuration
└── README.md
```

---

## ⚡ Quick Start

### 1. Run with Docker Compose (Recommended)
```bash
docker-compose up --build
```
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8080](http://localhost:8080)
- **Swagger Docs**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

### 2. Run Locally (Without Docker)

#### Backend:
```bash
cd backend
mvn clean spring-boot:run
```
*Note: The backend runs out-of-the-box using the embedded dev profile (H2 in MySQL mode). To connect to a local MySQL instance, use `-Dspring-boot.run.profiles=mysql`.*

#### Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Test Accounts (Seeded)

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@swiftride.com` | `Admin@12345` | Platform Administrator |
| **Rider** | `rider1@swiftride.com` | `Rider@12345` | Alex Johnson (Downtown NY) |
| **Rider** | `rider2@swiftride.com` | `Rider@12345` | Sarah Williams (Brooklyn) |
| **Driver** | `driver1@swiftride.com` | `Driver@12345` | Michael Rodriguez (Approved, Online Sedan) |
| **Driver** | `driver2@swiftride.com` | `Driver@12345` | Emily Chen (Approved, Online SUV) |
| **Driver** | `driver3@swiftride.com` | `Driver@12345` | James Wilson (Approved, Online Bike) |
| **Driver** | `driver4@swiftride.com` | `Driver@12345` | Carlos Gomez (Pending Approval) |

---

## 🔒 Security & Concurrency Design

1. **Transactional Locking**: Double-booking is strictly prevented by applying a `@Transactional` block with `PESSIMISTIC_WRITE` locking when a driver accepts a trip.
2. **Stateless JWT Security**: Passwords hashed with BCrypt; role-based route protection on both frontend React Router and Spring Security filters.
3. **Graceful Mapping Fallback**: Built-in OpenStreetMap / Leaflet rendering ensures full zero-configuration local usability without third-party API key requirements, while Google Maps Platform is supported when `VITE_MAP_API_KEY` is provided.

---

## 📄 License
This project is licensed under the Apache 2.0 License.
