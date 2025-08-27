# CoWorkSpace Backend (Auth)

Simple Express + Postgres backend that exposes:
- `POST /api/register` — create a user with `role` = `client` | `host`
- `POST /api/login` — returns `{ token, user }`
- `GET  /health` — health check

## 1) Install
```bash
npm i
copy .env.example .env   # then edit credentials
```

## 2) Init database (creates `users` table)
```bash
npm run db:init
# optional demo user
npm run db:seed
```

## 3) Run
```bash
npm start
# or hot reload
npm run dev
```

## ENV
- `DB_*` — Postgres connection
- `PORT` — default `3000`
- `CORS_ORIGINS` — comma-separated list of allowed origins for CORS
- `JWT_SECRET`, `JWT_EXPIRES_IN` — token config

## Notes
- Passwords are hashed with `bcryptjs` (pure JS, works on Windows).
- `role` is validated against `client|host` (defaults to `client` on register).
