# OpenPlan Admin

The admin panel for [OpenPlan](https://github.com/bulaya-ute/openplan-api) — a self-hostable, open-source task manager. Deployed on a separate subdomain from the main web app.

**License:** MIT

---

## Features

- User management — grant/revoke admin privileges
- Access control — whitelist or blacklist users by email, username, or user ID
- Version management — view current API version, browse GitHub releases, trigger upgrades/downgrades
- Database backups — create snapshots, restore with schema compatibility checks

Only admin users can access this panel. Non-admin login attempts are rejected at the UI level.

## Tech Stack

Same as the main web app: React 19 + TypeScript, Vite 8, Tailwind CSS v4, Zustand, Axios, React Router v7.

## Quick Start

### Prerequisites

- Node.js 20+
- A running [OpenPlan API](https://github.com/bulaya-ute/openplan-api) with the admin endpoints available

### Run

```bash
npm install
npm run dev      # http://localhost:5042
```

Create `.env` to point at your API:

```env
VITE_API_URL=http://localhost:5040/api/v1
```

## Commands

```bash
npm run dev      # Vite dev server (port 5042)
npm run build    # tsc -b && vite build → dist/
npm run lint     # ESLint
npm run preview  # Preview production build
```

## First Admin

The first user to register on the OpenPlan API is automatically granted admin privileges. Use those credentials to sign in here.

## Documentation

| Document | Description |
|---|---|
| [Architecture](docs/architecture.md) | App structure, auth flow, page overview |
| [Setup](docs/setup.md) | Local dev and production deployment |
