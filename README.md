# Joyride Booking System

A full-stack booking system for the Microlight Flying Club, built with React (frontend) and Spring Boot (backend).

## Features
- User registration and login
- Role-based access (Admin, User)
- Book appointments for joyride
- View and manage bookings
- Admin dashboard for managing availability and appointments
- Responsive, modern UI with dark mode support

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons
- **Backend:** Spring Boot, Java, REST API
- **Auth:** JWT-based authentication

## Getting Started

### Prerequisites
- Node.js & npm
- Java 17+
- Maven

### Setup

#### 1. Backend
```bash
cd backend
mvnw spring-boot:run
```
- The backend runs on `http://localhost:8080` by default.

#### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
- The frontend runs on `http://localhost:5173` by default.

### Environment Variables
- Backend: Configure `src/main/resources/application.properties` for DB and JWT settings.
- Frontend: API endpoints are set in `src/services/api.js`.

## Folder Structure
```
backend/    # Spring Boot backend
frontend/   # React frontend
```

## Customization
- Update colors and branding in frontend CSS and Navbar.
- Add new roles or booking types in backend models.

---
For questions or contributions, open an issue or pull request!
