<p align="center">
  <img src="frontend/public/logo.svg" alt="SaaSFlow Logo" width="64" height="64" />
</p>

<h1 align="center">SaaSFlow</h1>

<p align="center">
  <strong>Multi-Tenant SaaS Platform — Powered Entirely by PostgreSQL</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Backend-NestJS-e0234e?style=flat-square&logo=nestjs" alt="NestJS" />
  <img src="https://img.shields.io/badge/Frontend-Next.js_15-000?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL_15-336791?style=flat-square&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/ORM-Prisma-2D3748?style=flat-square&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Container-Docker-2496ED?style=flat-square&logo=docker" alt="Docker" />
</p>

---

## 🎯 What Is This?

SaaSFlow is a **production-ready, interview-showcase quality** full-stack SaaS application that demonstrates how PostgreSQL can replace four commonly used infrastructure services:

| Replaced Service | PostgreSQL Feature Used | Location |
|---|---|---|
| **Redis / BullMQ** | `FOR UPDATE SKIP LOCKED` polling worker | `backend/src/jobs/jobs.worker.ts` |
| **MongoDB** | JSONB columns + GIN index + `@>` containment | `backend/src/tasks/tasks.repository.ts` |
| **Elasticsearch** | `tsvector` + `plainto_tsquery` + GIN index | `backend/prisma/migrations/manual/fts_setup.sql` |
| **Kafka** | `LISTEN / NOTIFY` + WebSocket gateway | `backend/src/notifications/pg-listener.service.ts` |

Every architectural decision is explainable and backed by proper query patterns.

---

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | NestJS (Node.js) |
| **Database** | PostgreSQL 15+ |
| **ORM** | Prisma |
| **Auth** | JWT (access + refresh tokens with rotation) |
| **Real-Time** | WebSockets (Socket.io) + PG LISTEN/NOTIFY |
| **Frontend** | Next.js 15 (App Router, React 19) |
| **Styling** | Tailwind CSS 3 |
| **Data Fetching** | TanStack React Query + Axios |
| **Charts** | Recharts |
| **Container** | Docker + Docker Compose |
| **Language** | TypeScript (strict mode) |

---

## ✨ Features

### Backend
- 🔐 **JWT Authentication** — Register, login, refresh token rotation, logout
- 🏢 **Multi-Tenancy** — Organization-based isolation with Row-Level Security (RLS)
- 👥 **RBAC** — Admin / Manager / Member roles with guard-based enforcement
- 📋 **Task Management** — Full CRUD with cursor-based pagination
- 🔍 **Full-Text Search** — PostgreSQL `tsvector` with ranked results (replaces Elasticsearch)
- 📦 **JSONB Metadata** — Schema-less document queries with GIN indexes (replaces MongoDB)
- ⚡ **Background Jobs** — Polling worker with `FOR UPDATE SKIP LOCKED` (replaces Redis)
- 📡 **Real-Time Events** — PG `LISTEN/NOTIFY` → WebSocket broadcast (replaces Kafka)
- 📊 **Analytics** — Raw SQL with CTEs, `RANK()` window functions, `DATE_TRUNC`
- 🛡️ **Global Error Handling** — Structured error responses with logging
- 📐 **Response Normalization** — All responses wrapped in `{success, data, meta}`

### Frontend
- 🎨 **Premium UI** — Custom design system with gradient buttons, glassmorphism, animations
- 🌙 **Dark Sidebar** — Role-aware navigation with active state indicators
- 🔄 **Organization Switcher** — Multi-org support with persisted selection
- 📊 **Analytics Dashboard** — Interactive charts, top performers table, completion stats
- 🔎 **Debounced Search** — Full-text search with real-time results
- ♾️ **Infinite Scroll** — Cursor-based pagination with "Load More"
- 🔔 **Live Notifications** — WebSocket-powered toast alerts on task changes
- 📱 **Responsive** — Optimized for desktop and tablet viewports

---

## 📁 Project Structure

```
saasflow/
├── docker-compose.yml              # Full stack orchestration
├── docker-compose.dev.yml          # Dev overrides (hot reload)
├── .env.example                    # All environment variables
│
├── backend/                        # NestJS application
│   ├── prisma/
│   │   ├── schema.prisma           # 5 models with relations & indexes
│   │   ├── seed.ts                 # 2 orgs, 5 users, 50 tasks, 10 jobs
│   │   ├── init.sql                # Docker entrypoint (extensions)
│   │   └── migrations/manual/      # RLS policies + FTS setup + triggers
│   └── src/
│       ├── auth/                   # JWT register/login/refresh/logout
│       ├── organizations/          # CRUD + member management
│       ├── users/                  # Profile endpoints
│       ├── tasks/                  # CRUD + FTS + JSONB filter + pagination
│       ├── jobs/                   # Queue + worker + handlers
│       ├── notifications/          # PG LISTEN + WebSocket gateway
│       ├── analytics/              # Raw SQL analytics endpoints
│       ├── common/                 # Guards, decorators, filters, pipes
│       ├── config/                 # App, JWT, database config
│       └── prisma/                 # PrismaService with tenant helpers
│
└── frontend/                       # Next.js 15 application
    └── src/
        ├── app/
        │   ├── (auth)/             # Login + Register (no sidebar)
        │   └── (dashboard)/        # Dashboard, Tasks, Settings (with sidebar)
        ├── components/
        │   ├── ui/                 # Button, Input, Card, Badge, Modal, Table, Spinner, Toast
        │   ├── layout/             # Sidebar, Topbar, OrgSwitcher
        │   ├── tasks/              # TaskCard, TaskForm, TaskList, TaskSearch
        │   ├── analytics/          # Charts + Tables
        │   └── notifications/      # NotificationBell
        ├── hooks/                  # useAuth, useTasks, useSearch, useWebSocket, useOrganization
        ├── providers/              # AuthProvider, QueryProvider, OrgProvider
        ├── lib/                    # api.ts (Axios), auth.ts, utils.ts
        └── types/                  # TypeScript interfaces
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 20+
- **Docker** and **Docker Compose**
- **PostgreSQL** 15+ (or use Docker)

### 1. Clone & Configure

```bash
cd saasflow
cp .env.example .env
```

### 2. Start PostgreSQL

```bash
docker-compose up postgres -d
```

### 3. Set Up Backend

```bash
cd backend
npm install
npx prisma migrate dev --name init
```

Apply raw SQL migrations (run these against the database):

```bash
psql $DATABASE_URL -f prisma/migrations/manual/fts_setup.sql
psql $DATABASE_URL -f prisma/migrations/manual/rls_policies.sql
```

Seed the database:

```bash
npx ts-node prisma/seed.ts
```

Start the backend:

```bash
npm run start:dev
```

### 4. Set Up Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

### 5. Open the App

| Service | URL |
|---|---|
| **Frontend** | http://localhost:3000 |
| **Backend API** | http://localhost:3001/api |
| **Prisma Studio** | `npx prisma studio` → http://localhost:5555 |

### Demo Credentials

| Email | Password | Role |
|---|---|---|
| `admin@acme.com` | `password123` | Admin |
| `manager1@acme.com` | `password123` | Manager |
| `member1@acme.com` | `password123` | Member |

### Alternative: Docker Compose (everything)

```bash
docker-compose up --build
```

---

## 🗺 API Reference

All endpoints are prefixed with `/api`. Protected routes require:
```
Authorization: Bearer <access_token>
x-organization-id: <org_uuid>
```

### Auth

| Method | Path | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Create user + default org | No |
| `POST` | `/auth/login` | Returns access + refresh tokens | No |
| `POST` | `/auth/refresh` | Rotate refresh token | Refresh Token |
| `POST` | `/auth/logout` | Invalidate refresh token | Yes |

### Organizations

| Method | Path | Description | Role |
|---|---|---|---|
| `POST` | `/organizations` | Create organization | Any |
| `GET` | `/organizations/:id` | Get org details + members | Member |
| `POST` | `/organizations/:id/members` | Invite user by email | Admin |
| `PATCH` | `/organizations/:id/members/:userId` | Change member role | Admin |
| `DELETE` | `/organizations/:id/members/:userId` | Remove member | Admin |

### Tasks

| Method | Path | Description | Role |
|---|---|---|---|
| `GET` | `/tasks?cursor=&limit=20` | List tasks (cursor paginated) | Member |
| `POST` | `/tasks` | Create task | Member |
| `GET` | `/tasks/:id` | Get single task | Member |
| `PATCH` | `/tasks/:id` | Update task | Member |
| `DELETE` | `/tasks/:id` | Delete task | Admin |
| `GET` | `/tasks/search?q=keyword` | Full-text search | Member |
| `GET` | `/tasks/filter?metadata={"priority":"high"}` | JSONB filter | Member |

### Analytics

| Method | Path | Description |
|---|---|---|
| `GET` | `/analytics/tasks-per-week` | Tasks completed per week (12 weeks) |
| `GET` | `/analytics/top-users` | Top 10 users by completed tasks |
| `GET` | `/analytics/avg-completion` | Avg/min/max completion time (hours) |

### Jobs

| Method | Path | Description | Role |
|---|---|---|---|
| `GET` | `/jobs` | List all jobs | Admin |
| `POST` | `/jobs` | Trigger a job manually | Admin |

---

## 🗄 Database Schema

```
┌──────────────────┐     ┌──────────────────────┐     ┌──────────────┐
│  organizations   │     │ organization_members  │     │    users     │
│──────────────────│     │──────────────────────│     │──────────────│
│ id (uuid, PK)    │◄────│ organization_id (FK)  │────►│ id (uuid, PK)│
│ name             │     │ user_id (FK)          │     │ email (uniq) │
│ slug (unique)    │     │ role (enum)           │     │ password_hash│
│ created_at       │     │ joined_at             │     │ name         │
│ updated_at       │     └──────────────────────┘     │ refresh_token│
└──────────────────┘                                   └──────────────┘
         │                                                    │
         │                                                    │
    ┌────▼────────────────────────────────────────────────────▼──┐
    │                        tasks                               │
    │────────────────────────────────────────────────────────────│
    │ id (uuid, PK)          │ metadata (JSONB + GIN)            │
    │ organization_id (FK)   │ search_vector (tsvector + GIN)    │
    │ title                  │ completed_at                      │
    │ description            │ status (enum)                     │
    │ assignee_id (FK)       │ created_at                        │
    │ creator_id (FK)        │ updated_at                        │
    └───────────────────────────────────────────────────────────┘

    ┌────────────────────────────────────────────┐
    │                   jobs                      │
    │────────────────────────────────────────────│
    │ id (uuid, PK)       │ payload (JSONB)       │
    │ organization_id     │ attempts / max_attempts│
    │ type                │ scheduled_at           │
    │ status (enum)       │ error                  │
    └────────────────────────────────────────────┘
```

### Indexes
- `idx_tasks_fts` — GIN on `search_vector` (full-text search)
- `idx_tasks_metadata` — GIN on `metadata` (JSONB queries)
- Composite `(organization_id, created_at DESC)` — cursor pagination
- `(organization_id, status)` — status filtering
- `(status, scheduled_at)` — job worker polling

---

## 🔒 Security

- **Row-Level Security (RLS)** — Database-enforced tenant isolation
- **JWT with Rotation** — Short-lived access tokens (15m) + refresh tokens (7d)
- **Bcrypt** — Password hashing with salt rounds = 12
- **Zod Validation** — Request body validation on all endpoints
- **RBAC Guards** — Role-based access control at the NestJS level
- **CORS** — Configured for frontend origin only

---

## 📖 Key Technical Decisions

| Decision | Rationale |
|---|---|
| `FOR UPDATE SKIP LOCKED` in job worker | Prevents race conditions with multiple workers — same pattern used by Sidekiq |
| Raw `pg` client for `LISTEN` | Prisma connection pooling reuses connections; LISTEN needs a dedicated persistent connection |
| `tsvector` + trigger (not computed column) | Works on all PG versions; auto-updates on every write |
| Cursor pagination over offset | Offset degrades at high row counts; cursor is O(log n) with proper index |
| RLS at database level | Even direct DB connections respect tenant isolation — defense in depth |
| JSONB for task metadata | Schema-less flexibility without requiring a separate MongoDB instance |
| Zod over class-validator | Better TypeScript inference, composable schemas, smaller bundle |

---

## 📋 Seed Data

| Entity | Count | Details |
|---|---|---|
| Organizations | 2 | Acme Corp, Beta Inc |
| Users | 5 | 1 admin, 2 managers, 2 members |
| Tasks | 50 | Mixed statuses, varied metadata (priority, labels, custom fields) |
| Jobs | 10 | 5 pending, 3 completed, 2 failed |

---

## 🛠 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://saasflow:saasflow@localhost:5432/saasflow` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | — | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | — | Secret for signing refresh tokens |
| `JWT_ACCESS_EXPIRY` | `15m` | Access token lifetime |
| `JWT_REFRESH_EXPIRY` | `7d` | Refresh token lifetime |
| `PORT` | `3001` | Backend port |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | Frontend API base URL |
| `NEXT_PUBLIC_WS_URL` | `http://localhost:3001` | Frontend WebSocket URL |

---

## 📜 License

This project is built for educational and demonstration purposes.

---

<p align="center">
  <strong>Built with PostgreSQL 🐘 — proving you don't always need a dozen services.</strong>
</p>
