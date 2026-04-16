# GRF Talk Monorepo

GRF Talk is a study project split into two applications:

- `grftalk-backend/`: Django + Django REST Framework API
- `grftalk-frontend/`: Next.js web application

## Disclaimer

This repository was created for learning purposes while exploring a full-stack chat application architecture with Django and Next.js.

It was never promoted to production. The project remained a learning prototype because the expected infrastructure, media storage, and ongoing maintenance costs were too high for its intended scope.

## Repository Structure

```text
grf-talk_nextjs_Django/
|-- grftalk-backend/
|-- grftalk-frontend/
`-- README.md
```

## Current Status

### Backend

- Custom user model with email-based authentication
- JWT-based sign up, sign in, and profile endpoints
- Chat and message endpoints already implemented
- Avatar, file, and audio uploads available in development
- Django admin enabled
- Socket.IO foundation exists, but realtime is not fully wired into ASGI

### Frontend

- Next.js 16 with App Router
- React 19, TypeScript, and Tailwind CSS v4
- Base providers and domain types already created
- Socket.IO client setup started
- Main product interface is still incomplete

## Local Development

Run backend and frontend in separate terminals.

### Backend

```powershell
cd .\grftalk-backend\
.\venv\Scripts\python.exe manage.py migrate
.\venv\Scripts\python.exe manage.py runserver
```

Default local URL: `http://127.0.0.1:8000`

Minimum expected environment variable in `grftalk-backend/.env`:

```env
DB_PASSWORD=your_mysql_password
```

### Frontend

```powershell
cd .\grftalk-frontend\
npm install
npm run dev
```

Default local URL: `http://localhost:3000`

Expected frontend environment variable:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

## Integration Notes

- The backend allows CORS for `http://localhost:3000`
- The frontend already reads `NEXT_PUBLIC_API_BASE_URL`
- Realtime support is still incomplete because the frontend provider is not fully connected and the backend Socket.IO server is not mounted end to end

## Available API Routes

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

- There is no shared root command to start both apps together
- The backend is still configured around a local MySQL setup
- The backend snapshot does not include a dependency lock file or `.env.example`
- The frontend is closer to a starter foundation than a finished product

## Project Documentation

- [Backend README](./grftalk-backend/README.md)
- [Frontend README](./grftalk-frontend/README.md)
