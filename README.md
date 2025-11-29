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
| POST | `/auth/register` | Public | Create user account |
| POST | `/auth/login` | Public | Login user account |
| POST | `/auth/register/theater` | Public | Register theater admin |
| POST | `/auth/login/theater` | Public | Login theater admin |
| GET | `/users/` | Public | List users |
| GET | `/users/profile` | User | Fetch current user profile |

### 🎭 Theaters
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/theaters` | Public | List theaters |
| GET | `/theaters/:id` | Public | Theater detail |
| PATCH | `/theaters/:id` | Theater | Update profile |
| DELETE | `/theaters/:id` | Theater | Delete theater |

### 🖥️ Screens (per theater)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/theaters/:theaterId/screens` | Theater | Create screen |
| GET | `/theaters/:theaterId/screens` | Public | List screens |
| GET | `/theaters/:theaterId/screens/:screenId` | Public | Screen detail |
| PATCH | `/theaters/:theaterId/screens/:screenId` | Theater | Update screen |
| DELETE | `/theaters/:theaterId/screens/:screenId` | Theater | Remove screen |

### 🎬 Movies
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/movies` | Theater | Create movie |
| GET | `/movies` | Public | Browse movies |
| GET | `/movies/:id` | Public | Movie detail |
| PATCH | `/movies/:id` | Theater | Update movie |
| DELETE | `/movies/:id` | Theater | Remove movie |

### 🕒 Slots (showtimes)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/slots` | Theater | Schedule slot |
| GET | `/slots` | Public | List slots (`screen_id` query required) |
| GET | `/slots/:slotId` | Public | Slot detail (`screen_id` query required) |
| PATCH | `/slots/:slotId` | Theater | Update slot (`screen_id` query required) |
| DELETE | `/slots/:slotId` | Theater | Cancel slot (`screen_id` query required) |

### 💺 Seats (layouts)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/theaters/:theaterId/screens/:screenId/seats` | Theater | Bulk create layout |
| GET | `/theaters/:theaterId/screens/:screenId/seats` | Public | Fetch layout |
| GET | `/theaters/:theaterId/screens/:screenId/seats/:seatId` | Public | Seat detail |
| PATCH | `/theaters/:theaterId/screens/:screenId/seats/:seatId` | Theater | Update seat |
| DELETE | `/theaters/:theaterId/screens/:screenId/seats/:seatId` | Theater | Remove seat |

### 🧾 Reservations (users)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/reservations` | User | Book seats (transactional) |
| GET | `/reservations/me` | User | My reservations |
| GET | `/reservations/:id` | User | Reservation detail |
| DELETE | `/reservations/:id` | User | Cancel before show starts |

### 📊 Availability & Discovery
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/slots/:slotId/available-seats` | Public | Split lists available vs reserved seats |
| GET | `/movies/:movieId/showtimes` | Public | Theaters & slots playing movie |
| GET | `/theaters/:theaterId/movies` | Public | Movies and slots in theater |

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
