# GRF Talk Monorepo

Repository containing the two GRF Talk apps:

- `grftalk-backend/`: Django + Django REST Framework API
- `grftalk-frontend/`: Next.js web app

Today, the backend already exposes authentication, profile, chats, and messages. The frontend is still at an early stage: the project foundation, domain types, schemas, and providers are already in place, but the main screen is still the default Next.js starter template.

## Structure

```text
grf-talk_nextjs_Django/
|-- grftalk-backend/
|-- grftalk-frontend/
`-- README.md
```

## Current Status

### Backend

- Custom user model with email-based login
- JWT authentication with `Simple JWT`
- Signup, signin, profile, chat, and message endpoints
- Avatar, file, and audio uploads
- Django admin enabled
- Socket.IO base created, but not yet connected to the ASGI entrypoint

### Frontend

- Next.js 16 with the App Router
- React 19, TypeScript, and Tailwind CSS v4
- `next-themes`, `sonner`, `next-nprogress-bar`, `zod`, and `socket.io-client`
- Domain types for auth, user, chat, message, and attachment
- Providers ready for theme, toast, progress, and socket
- Main application UI not implemented yet

## Running Locally

Open two terminals at the repository root.

### 1. Backend

```powershell
cd .\grftalk-backend\
.\venv\Scripts\python.exe manage.py migrate
.\venv\Scripts\python.exe manage.py runserver
```

The backend runs by default at `http://127.0.0.1:8000`.

Minimum expected variable in `grftalk-backend/.env`:

```env
DB_PASSWORD=your_mysql_password
```

### 2. Frontend

```powershell
cd .\grftalk-frontend\
npm install
npm run dev
```

The frontend runs by default at `http://localhost:3000`.

Frontend variable:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

## App Integration

- The backend allows CORS for `http://localhost:3000`
- The frontend already has a Socket.IO client configured from `NEXT_PUBLIC_API_BASE_URL`
- Even so, the global provider is not yet wired into the `layout`, and the backend still does not mount the Socket.IO server in ASGI, so the realtime integration is not complete

## HTTP Routes Available Today

### Accounts

- `POST /api/v1/accounts/signup`
- `POST /api/v1/accounts/signin`
- `GET /api/v1/accounts/me`
- `PUT /api/v1/accounts/me`

### Chats

- `GET /api/v1/chats/`
- `POST /api/v1/chats/`
- `GET /api/v1/chats/{chat_id}`
- `DELETE /api/v1/chats/{chat_id}`
- `GET /api/v1/chats/{chat_id}/messages`
- `POST /api/v1/chats/{chat_id}/messages`
- `DELETE /api/v1/chats/{chat_id}/messages/{message_id}`

## Notes

- There is no shared root-level tooling to start frontend and backend together
- The backend depends on a local MySQL instance with database `grftalk` and user `root`
- There is no versioned `requirements.txt`, `pyproject.toml`, or `.env.example` in the backend in this snapshot
- The frontend currently behaves more like a project foundation than a fully integrated product

## App-Specific Documentation

- [Backend README](./grftalk-backend/README.md)
- [Frontend README](./grftalk-frontend/README.md)
