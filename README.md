# 🎬 Movie Reservation System (NestJS)

Modern NestJS API for managing theaters, screens, seats, showtimes, and real-time reservations. Built for clarity, scalability, and secure multi-role access (users vs theaters).

---

## 🧭 Overview

- **Framework**: NestJS + Sequelize (PostgreSQL/MySQL friendly)
- **Purpose**: End-to-end movie ticket booking backend
- **Highlights**: JWT auth, role-based access, transactional seat booking, availability queries

---

## 🚀 Quick Start

```bash
# install dependencies
npm install

# run locally
npm run start:dev

# production build
npm run start:prod
```

Environment configuration lives in `.env` (see `SequelizeConfigService` for required variables).

---

## 🧱 Domain Features & APIs

Each response is wrapped by `GenericResponseDto`, returning `{ message, data, meta? }`.

### 👥 Auth & Users
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Public | Create user account |
| POST | `/api/v1/auth/login` | Public | Login user account |
| POST | `/api/v1/auth/register/theater` | Public | Register theater admin |
| POST | `/api/v1/auth/login/theater` | Public | Login theater admin |
| GET | `/api/v1/users` | Public | List users |
| GET | `/api/v1/users/profile` | User | Fetch current user profile |

### 🎭 Theaters
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/v1/theaters` | Public | List theaters |
| GET | `/api/v1/theaters/:id` | Public | Theater detail |
| PATCH | `/api/v1/theaters/:id` | Theater | Update profile |
| DELETE | `/api/v1/theaters/:id` | Theater | Delete theater |

### 🖥️ Screens (per theater)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/v1/screens` | Theater | Create screen |
| GET | `/api/v1/screens` | Public | List screens (`theater_id` query required) |
| GET | `/api/v1/screens/:screenId` | Public | Screen detail (`theater_id` query required) |
| PATCH | `/api/v1/screens/:screenId` | Theater | Update screen |
| DELETE | `/api/v1/screens/:screenId` | Theater | Remove screen |

### 🎬 Movies
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/v1/movies` | Theater | Create movie |
| GET | `/api/v1/movies` | Public | Browse movies |
| GET | `/api/v1/movies/:id` | Public | Movie detail |
| PATCH | `/api/v1/movies/:id` | Theater | Update movie |
| DELETE | `/api/v1/movies/:id` | Theater | Remove movie |

### 🕒 Slots (showtimes)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/v1/slots` | Theater | Schedule slot |
| GET | `/api/v1/slots` | Public | List slots (`screen_id` query required) |
| GET | `/api/v1/slots/:slotId` | Public | Slot detail (`screen_id` query required) |
| PATCH | `/api/v1/slots/:slotId` | Theater | Update slot (`screen_id` query required) |
| DELETE | `/api/v1/slots/:slotId` | Theater | Cancel slot (`screen_id` query required) |

### 💺 Seats (layouts)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/v1/seats` | Theater | Bulk create layout (`screen_id` in body) |
| GET | `/api/v1/seats` | Public | Fetch layout (`screen_id` query required) |
| GET | `/api/v1/seats/:seatId` | Public | Seat detail (`screen_id` query required) |
| PATCH | `/api/v1/seats/:seatId` | Theater | Update seat (`screen_id` query required) |
| DELETE | `/api/v1/seats/:seatId` | Theater | Remove seat (`screen_id` query required) |

### 🧾 Reservations (users)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/v1/reservations` | User | Book seats (transactional) |
| GET | `/api/v1/reservations/me` | User | My reservations |
| GET | `/api/v1/reservations/:id` | User | Reservation detail |
| DELETE | `/api/v1/reservations/:id` | User | Cancel before show starts |

### 📊 Availability & Discovery
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/v1/slots/:slotId/available-seats` | Public | Split lists available vs reserved seats |
| GET | `/api/v1/movies/:movieId/showtimes` | Public | Theaters & slots playing movie |
| GET | `/api/v1/theaters/:theaterId/movies` | Public | Movies and slots in theater |

---

## 🏗️ Architecture Snapshot

- **Layers**: Controller → BLL (services) → DAL (Sequelize data services)
- **Auth**: JWT + role guard (`user`, `theater`), `@Public()` decorator bypasses guards
- **Responses**: Centralized `ResponseHandlerService` for consistent envelopes
- **Mapping**: Lightweight mapper transforms entities → DTOs (sanitizes sensitive fields)
- **Transactions**: Reservation bookings wrap seat writes in DB transactions to avoid double booking

---

## ✅ Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# coverage report
npm run test:cov
```

---

## 🤝 Contributing

1. Fork and branch from `main`
2. Keep modules cohesive (Controller ↔ Service ↔ DataService)
3. Run tests before opening a PR

Feel free to open issues for ideas, bugs, or feature proposals.

---

## 📄 License

MIT © Movie Reservation System contributors
