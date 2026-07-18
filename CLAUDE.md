# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

RTO Agent — a vehicle compliance tracker for a transport business ("Prakash Transport"). Tracks vehicles and the expiry dates of their FC (fitness certificate), NP (national permit), permit, and insurance, and surfaces which are due for renewal.

The repo root only contains one subfolder, `RTO Agent/`, which holds the actual project. Inside it are two independent apps: `RTO Agent/backend/` (FastAPI + MSSQL) and `RTO Agent/frontend/` (React + Vite + MUI), talking over plain REST/JSON with no shared code between them.

## Commands

### Backend (`RTO Agent/backend/`)
```bash
# activate the venv first (Windows)
venv\Scripts\activate

pip install -r requirements.txt

# one-time on a fresh machine: creates the DB (if missing), USERS/VEHICLES
# tables, and a default admin/admin123 login — requires backend/.env filled in first
python setup_db.py

# run the dev server (from backend/, with venv active)
uvicorn app.main:app --reload

# production launcher (no --reload, binds 0.0.0.0 so LAN machines can reach it)
run_prod.bat
```
There is no formal test suite — `hash_test.py` is a scratch script (run with `python hash_test.py`) for generating a bcrypt hash to insert into the `USERS` table manually, not an automated test.

### Frontend (`RTO Agent/frontend/`)
```bash
npm install
npm run dev       # Vite dev server, http://localhost:5173 (proxies /auth, /vehicles, /dashboard to :8000)
npm run build      # outputs to frontend/dist, which backend/app/main.py serves in production
npm run lint
npm run preview
```

## Architecture

### Backend: FastAPI, layered by concern, not by feature
`backend/app/` is split into `routes/`, `models/`, `schemas/`, `utils/`, `config/`, `database/` — i.e. all route handlers live in `routes/`, all SQLAlchemy models in `models/`, etc., rather than one folder per feature. When adding a new resource, add to each of these directories rather than creating a new top-level folder.

- `app/main.py` — creates the `FastAPI()` app, registers CORS (currently hardcoded to allow only `http://localhost:5173`), includes the three routers (`vehicle`, `auth`, `dashboard`), and then defines a catch-all `GET /{full_path:path}` route that serves `frontend/dist` as a static SPA (falling back to `index.html` for client-side routes) — this is how the built frontend is served in production from the same FastAPI process/port. Because this catch-all is registered last, API routers still take precedence for their own paths.
- `app/database/db.py` — builds the SQLAlchemy engine from env-based settings using `pyodbc` (MSSQL), exposes `Base`, `SessionLocal`, and the `get_db()` FastAPI dependency used by every route for a DB session.
- `app/config/settings.py` — loads all config from `backend/.env` via `python-dotenv` (DB connection, `JWT_SECRET_KEY`, `JWT_ALGORITHM`, `JWT_EXPIRE_MINUTES`). `backend/.env` is gitignored (see `backend/.gitignore`) and was recently removed from tracking — see Known issues below re: prior exposure.
- `backend/setup_db.py` — one-time bootstrap script for a fresh machine: creates the database if missing, creates the `USERS`/`VEHICLES` tables from the models, and seeds a default `admin`/`admin123` login if no admin exists yet.
- Auth: `utils/security.py` hashes/verifies passwords with `passlib`/bcrypt; `utils/jwt_handler.py` issues JWTs; `utils/auth.py` exposes `get_current_user`, a FastAPI dependency (via `HTTPBearer`) that every protected route depends on to decode the bearer token and pull the username from `sub`. There is no user registration endpoint — users are inserted directly into the `USERS` table (see `hash_test.py`/`setup_db.py` for producing a password hash). `POST /auth/change-password` (protected) lets a logged-in user rotate their own password given the current one.
- Models mirror the MSSQL schema directly with SCREAMING_SNAKE_CASE column names matching the DB tables (`USERS`, `VEHICLES`) — this naming is intentional and should be preserved for consistency with the existing database, not renamed to Python convention.
- Dashboard route (`routes/dashboard.py`) has hardcoded "due soon" logic: any date field within `today` to `today + 15 days` counts as due. This 15-day window is duplicated across `/stats`, `/fc-due`, `/permit-due`, `/insurance-due`, `/np-due` — if the window changes, update all five.
- Route handlers generally return plain dicts/ORM objects directly (no explicit `response_model`), and error handling returns `{"message": "..."}` with a 200 status rather than raising `HTTPException` (except in `get_current_user`, which does raise 401). Keep new endpoints consistent with whichever pattern the surrounding file already uses rather than mixing both.

### Frontend: React + Vite + MUI
- Routing is centralized in `src/routes/AppRoutes.jsx`; every route except `/` (Login) is wrapped in `ProtectedRoute` (`src/components/ProtectedRoute.jsx`), which redirects to `/` if `AuthContext.isAuthenticated` is false.
- `src/context/AuthContext.jsx` is the sole auth state: stores the JWT in `localStorage` under `"token"` and exposes `login`/`logout`/`isAuthenticated`.
- `src/api/api.js` is a single shared Axios instance with `baseURL: ""` (relative) — in production the built frontend is served by FastAPI itself (see `main.py` above), so API calls are same-origin; in dev, `vite.config.js` proxies `/auth`, `/vehicles`, and `/dashboard` to `http://127.0.0.1:8000`. A request interceptor attaches `Authorization: Bearer <token>` from `localStorage` automatically. All backend calls should go through this instance.
- API calls are grouped into per-resource service modules under `src/services/` (`authService.js`, `vehicleService.js`, `dashboardService.js`) that wrap `api.js` calls — pages call these services rather than using `api.js`/axios directly.
- `src/components/Layout.jsx` renders the permanent sidebar (nav links to Dashboard, Vehicle Entry, Vehicle List, Expiry Alerts, Change Password) and wraps page content; pages under `src/pages/` render inside it.
- `src/theme.js` defines a single shared MUI theme (purple primary `#7C3AED`, 20px border radius, Inter font) applied globally — match existing styling conventions (rounded corners, gradient purple accents for selected/active states) rather than introducing new ad hoc styles.
- Vehicle create/edit uses one shared route+component: `/vehicle-entry` (create) and `/vehicle-entry/:id` (edit) both render `VehicleForm.jsx`.

## Known issues to be aware of

- `backend/.env` (containing DB credentials and the JWT secret) was committed to git in past history and has only recently been untracked and gitignored — the previously-committed secrets should still be treated as exposed (rotate them) unless the user confirms otherwise.
