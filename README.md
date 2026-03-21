# Zyra Accounting

Zyra Accounting is a full-stack accounting app with:
- A TypeScript/Express backend and PostgreSQL database
- A React + TypeScript frontend (Vite)
- JWT-based authentication
- Core modules for invoices, inventory (products), and parties (customers/suppliers)

## App Modules

- Authentication (`/auth/login`)
- Users (`/users`, admin-only)
- Parties (`/parties`)
- Products (`/products`)
- Invoices (`/invoices`)
- Dashboard metrics and quick navigation
- Arabic/English UI localization support

## Project Structure

```text
.
├── backend/   # Express API + PostgreSQL schema
└── frontend/  # React (Vite) client
```

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL 16+ (or Docker for containerized DB)

## 1) Start the Database

You can run PostgreSQL with Docker Compose:

```bash
cd backend
docker compose up -d db
```

The schema is auto-loaded from `backend/db/schema.sql` on first startup.

## 2) Configure Backend Environment

Create or update `backend/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=accounting_db
JWT_SECRET=replace_with_secure_secret
JWT_expiresIn=1d
```

If you use `backend/docker-compose.yml` as-is, use:
- `DB_PORT=5433`
- `DB_USER=postgres`
- `DB_PASSWORD=postgres`

## 3) Run Backend API

```bash
cd backend
npm install
npx ts-node app.ts
```

API runs on `http://localhost:5000`.

## 4) Configure Frontend Environment

Create `frontend/.env` (or copy from `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:5000
```

## 5) Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on the local Vite URL (usually `http://localhost:5173`).

## Notes

- The backend expects users to exist in the `users` table for login.
- Existing backend `package.json` scripts reference `index.js`, while the current entry file is `app.ts`. Use `npx ts-node app.ts` unless scripts are updated.
