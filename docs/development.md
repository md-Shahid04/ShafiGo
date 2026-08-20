# SwiftRide Local Development Guide

## 1. Prerequisites

- **Java Development Kit (JDK)**: Version 17+
- **Apache Maven**: Version 3.8+
- **Node.js**: Version 18+ (Node 20 recommended)
- **npm**: Version 9+
- **MySQL Server** (Optional for local standalone profile; included in Docker Compose)
- **Docker & Docker Compose** (Optional for containerized run)

---

## 2. Running Locally (Step-by-Step)

### 2.1 Backend Setup

Navigate to the `backend/` folder:
```bash
cd backend
```

#### Option A: Run with embedded H2 profile (Zero external database required)
The backend defaults to the `dev` profile using in-memory H2 with MySQL mode.
```bash
mvn clean spring-boot:run
```
The server will start on `http://localhost:8080`.
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:swiftridedb`, User: `sa`, Password: empty)

#### Option B: Run with MySQL
1. Ensure your local MySQL instance is running and create the database:
   ```sql
   CREATE DATABASE swiftride_db CHARACTER SET utf8mb4;
   ```
2. Start the backend with the `mysql` profile:
   ```bash
   mvn clean spring-boot:run -Dspring-boot.run.profiles=mysql
   ```

---

### 2.2 Frontend Setup

Navigate to the `frontend/` folder:
```bash
cd frontend
```

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```
The frontend will start on `http://localhost:5173`.

---

## 3. Running via Docker Compose

To start the full stack (MySQL + Spring Boot + React + NGINX) in isolated containers:
```bash
docker-compose up --build
```
- Frontend UI: `http://localhost:5173`
- Backend API: `http://localhost:8080`
- MySQL Port: `3306`

---

## 4. Default Demo Accounts

| Role | Email | Password | Name | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin@swiftride.com` | `Admin@12345` | SwiftRide Admin | Full access to dashboard, users, approvals |
| **Rider** | `rider1@swiftride.com` | `Rider@12345` | Alex Johnson | Active rider account with past trips |
| **Rider** | `rider2@swiftride.com` | `Rider@12345` | Sarah Williams | Active rider account |
| **Driver** | `driver1@swiftride.com` | `Driver@12345` | Michael Rodriguez | Approved Sedan (Toyota Camry), Online |
| **Driver** | `driver2@swiftride.com` | `Driver@12345` | Emily Chen | Approved SUV (Honda CR-V), Online |
| **Driver** | `driver3@swiftride.com` | `Driver@12345` | James Wilson | Approved Bike (Yamaha MT-07), Online |
| **Driver** | `driver4@swiftride.com` | `Driver@12345` | Carlos Gomez | Pending Verification Application |

---

## 5. Running Automated Backend Tests

```bash
cd backend
mvn test
```
Tests will execute unit and integration test suites covering:
- Authentication & JWT token issuance
- Ride creation & fare estimation
- Nearby driver matching algorithm
- Concurrency race-condition prevention during ride acceptance
- Ride state progression lifecycle
