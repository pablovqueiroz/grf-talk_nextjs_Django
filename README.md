# GRF Talk Monorepo

Monorepo for the GRF Talk application stack.

## Overview

This repository is organized as a monorepo and currently contains the Django backend for the project. The repository name suggests a Next.js + Django architecture, but in the current snapshot only the backend service is present as a working application.

At the moment, the backend provides:

- Account registration and sign-in
- JWT-based authentication
- Authenticated profile retrieval and update
- Data models for chats and attachments
- Django admin integration for the main models

## Repository Layout

```text
grf-talk_nextjs_Django/
|-- grftalk-backend/   # Django backend application
`-- README.md
```

## Workspace Status

### Available today

- Backend codebase under `grftalk-backend/`
- Custom user model with email-based authentication
- REST API endpoints for account flows
- MySQL-backed persistence

### Present but not fully exposed yet

- Chat domain models
- Attachment domain models
- Socket.IO server scaffold

### Not present in this repository snapshot

- Next.js frontend application
- Shared package workspace tooling
- CI/CD workflow files
- Infrastructure or deployment manifests

## Backend Quick Start

From the repository root:

```powershell
cd .\grftalk-backend\
.\venv\Scripts\python.exe manage.py migrate
.\venv\Scripts\python.exe manage.py runserver
```

The backend expects a local `.env` file inside `grftalk-backend/` with at least:

```env
DB_PASSWORD=your_mysql_password
```

Detailed backend documentation is available in [grftalk-backend/README.md](./grftalk-backend/README.md).

## Backend API Surface

Current HTTP routes are centered on account management:

- `POST /api/v1/accounts/signup`
- `POST /api/v1/accounts/signin`
- `GET /api/v1/accounts/me`
- `PUT /api/v1/accounts/me`

## Tech Stack

- Django
- Django REST Framework
- Simple JWT
- MySQL
- Python Socket.IO

## Recommended Next Steps for the Monorepo

- Add the frontend app if the goal is a full Next.js + Django workspace
- Commit dependency manifests for reproducible setup
- Add shared development scripts at the repository root
- Introduce environment templates and onboarding docs for both apps
- Add test and deployment workflows
