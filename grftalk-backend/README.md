# GRF Talk Backend

Backend service for the GRF Talk project, built with Django, Django REST Framework, MySQL, and JWT authentication.

## Overview

This service currently provides:

- User registration and sign-in
- JWT-based authentication
- Authenticated user profile retrieval and update
- Media storage for user avatars
- Database models for chats and attachments
- Django admin registration for the main domain models

The repository already contains `accounts`, `attachments`, and `chats` apps. At the moment, the HTTP API exposed through `core/urls.py` is focused on the `accounts` app. The `attachments` and `chats` apps are present as data models and admin resources, but do not yet expose public API routes in the current codebase.

## Tech Stack

- Python 3.14 in the local development environment
- Django 5.2
- Django REST Framework
- Simple JWT
- MySQL
- `django-cors-headers`
- `python-dotenv`
- Socket.IO server scaffold via `python-socketio`

## Project Structure

```text
grftalk-backend/
|-- accounts/        # custom user model, auth flow, profile endpoints
|-- attachments/     # attachment models and admin registration
|-- chats/           # chat and message models and admin registration
|-- core/            # Django settings, URL routing, ASGI/WSGI bootstrap, shared exceptions
|-- manage.py
`-- venv/            # local virtual environment used in this workspace
```

## Current API

Base path: `/api/v1/accounts/`

### Public endpoints

- `POST /api/v1/accounts/signup`
- `POST /api/v1/accounts/signin`

### Authenticated endpoints

- `GET /api/v1/accounts/me`
- `PUT /api/v1/accounts/me`

Authentication uses Bearer tokens generated with Simple JWT. The backend is configured with `JWTAuthentication` as the default authentication class and `IsAuthenticated` as the default permission class, while sign-in and sign-up explicitly allow anonymous access.

## Data Model Summary

### `accounts.User`

Custom authentication model based on `AbstractBaseUser`.

Main fields:

- `name`
- `email`
- `avatar`
- `last_access`
- `is_Superuser`

### `chats.Chat`

Represents a conversation between two users.

### `chats.ChatMessage`

Represents a message inside a chat, including optional attachment metadata.

### `attachments.FileAttachments`

Stores uploaded file metadata such as name, extension, size, source path, and content type.

### `attachments.AudioAttachments`

Stores the source path for uploaded audio attachments.

## Environment Variables

The backend currently reads:

- `DB_PASSWORD`: password for the local MySQL database user

The current local setup also assumes:

- database name: `grftalk`
- database user: `root`
- database host: `localhost`
- database port: `3306`
- frontend origin for CORS: `http://localhost:3000`
- backend base URL used in serialized avatar URLs: `http://127.0.0.1:8000`

## Local Development

### 1. Create and activate a virtual environment

On Windows PowerShell:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 2. Install dependencies

This repository does not currently include a committed `requirements.txt`, so install the packages used by the project manually:

```powershell
pip install Django djangorestframework djangorestframework_simplejwt django-cors-headers python-dotenv mysqlclient python-socketio eventlet django-filter Markdown
```

### 3. Configure environment variables

Create a `.env` file in the backend root:

```env
DB_PASSWORD=your_mysql_password
```

### 4. Apply migrations

```powershell
.\venv\Scripts\python.exe manage.py migrate
```

### 5. Run the server

```powershell
.\venv\Scripts\python.exe manage.py runserver
```

### 6. Optional admin user

```powershell
.\venv\Scripts\python.exe manage.py createsuperuser
```

## Media Files

- Uploaded avatars are stored under `media/avatars/`
- `MEDIA_URL` is configured as `/media/`
- In development, Django serves media files through `static()` in `core/urls.py`

## Notes About the Current Implementation

- The backend is using a custom user model declared as `AUTH_USER_MODEL = "accounts.User"`.
- JWT access tokens currently have a lifetime of 7 days.
- A Socket.IO server instance exists in `core/socket.py`, but it is not yet wired into the ASGI application.
- Chat and attachment features are partially scaffolded at the model/admin level and appear ready for API expansion.
- There is no generated API documentation, OpenAPI schema setup, or committed test suite coverage yet beyond the default app test modules.

## Useful Commands

```powershell
.\venv\Scripts\python.exe manage.py check
.\venv\Scripts\python.exe manage.py makemigrations
.\venv\Scripts\python.exe manage.py migrate
.\venv\Scripts\python.exe manage.py runserver
```

## Suggested Next Improvements

- Add a committed `requirements.txt` or `pyproject.toml`
- Add `.env.example`
- Expose chat and attachment APIs
- Wire Socket.IO into the ASGI entrypoint
- Add automated tests for authentication and profile flows
- Add API documentation for frontend integration
