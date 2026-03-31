# GRF Talk Backend

GRF Talk API built with Django and Django REST Framework.

In its current state, the project covers authentication, user profile management, chats, messages, and related uploads. There is also a base for realtime events with Socket.IO, but it has not yet been connected to the ASGI app.

## Stack

- Django 5
- Django REST Framework
- Simple JWT
- MySQL
- `django-cors-headers`
- `python-dotenv`
- `python-socketio`

## Structure

```text
grftalk-backend/
|-- accounts/      # custom user model, auth, and profile
|-- attachments/   # file and audio attachment models
|-- chats/         # chats, messages, serializers, and views
|-- core/          # settings, urls, ASGI/WSGI, and socket
|-- media/         # locally saved files in development
|-- manage.py
`-- README.md
```

## Setup Local

### 1. Virtual environment

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 2. Dependencies

This snapshot does not include `requirements.txt` or `pyproject.toml`. The libraries used by the code include:

```powershell
pip install Django djangorestframework djangorestframework_simplejwt django-cors-headers python-dotenv mysqlclient python-socketio eventlet
```

### 3. Environment variables

Create `grftalk-backend/.env` with at least:

```env
DB_PASSWORD=your_mysql_password
```

## Database

The current settings in `core/settings.py` assume:

- engine: MySQL
- database: `grftalk`
- user: `root`
- host: `localhost`
- port: `3306`

These values are also hardcoded in the codebase:

- `CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]`
- `CURRENT_URL = "http://127.0.0.1:8000"`

## Running the Project

```powershell
.\venv\Scripts\python.exe manage.py migrate
.\venv\Scripts\python.exe manage.py runserver
```

Default local server: `http://127.0.0.1:8000`

### Admin

```powershell
.\venv\Scripts\python.exe manage.py createsuperuser
```

Panel: `http://127.0.0.1:8000/admin/`

## Authentication

- `JWTAuthentication` is the default authentication class
- `IsAuthenticated` is the default permission class
- Public endpoints explicitly allow `AllowAny`
- Access tokens are valid for 7 days

`signin` and `signup` responses return:

- `user`
- `access_token`

## Current API

Base URL local: `http://127.0.0.1:8000`

### Accounts

#### `POST /api/v1/accounts/signup`

Creates a user with:

- `name`
- `email`
- `password`

#### `POST /api/v1/accounts/signin`

Authenticates with:

- `email`
- `password`

#### `GET /api/v1/accounts/me`

Returns the authenticated user and updates `last_access`.

#### `PUT /api/v1/accounts/me`

Updates:

- `name`
- `email`
- `password`
- `avatar` via multipart form-data

Avatar upload accepts only `image/png` and `image/jpeg`.

### Chats

#### `GET /api/v1/chats/`

Lists chats for the authenticated user.

#### `POST /api/v1/chats/`

Creates or reuses a chat using the other user's `email`.

#### `GET /api/v1/chats/{chat_id}`

Returns a specific chat if it belongs to the authenticated user.

#### `DELETE /api/v1/chats/{chat_id}`

Soft deletes the chat by setting `deleted_at`.

### Messages

#### `GET /api/v1/chats/{chat_id}/messages`

- Lists chat messages
- Marks received messages as seen

#### `POST /api/v1/chats/{chat_id}/messages`

Accepts:

- `body`
- `file`
- `audio`

Current rules:

- At least one of the three fields must be sent
- File uploads are limited to 100 MB
- Audio is saved as `.mp3`
- Attachments are registered in `attachments`

#### `DELETE /api/v1/chats/{chat_id}/messages/{message_id}`

Soft deletes a message created by the current user.

## Main Models

### `accounts.User`

- Custom user model with `email` as `USERNAME_FIELD`
- Main fields: `name`, `email`, `avatar`, `last_access`, `is_Superuser`

### `chats.Chat`

- Relationship between `from_user` and `to_user`
- Uses `viewed_at`, `deleted_at`, and `created_at`

### `chats.ChatMessage`

- Supports text, file, or audio
- Identifies attachments through `attachment_code` and `attachment_id`

### `attachments.FileAttachments`

- `name`, `extension`, `size`, `src`, `content_type`

### `attachments.AudioAttachments`

- `src`

## Local Media

Files saved in development:

- avatars in `media/avatars/`
- files in `media/files/`
- audios in `media/audios/`

`MEDIA_URL` is configured as `/media/` and served by Django itself in development.

## Realtime

There is a Socket.IO server in `core/socket.py` used by the views to emit events such as:

- `update_chat`
- `update_chat_message`
- `mark_messages_as_seen`
- `mark_message_as_seen`

Important current limitation:

- The socket exists in the codebase, but it is not mounted in `asgi.py`
- In practice, the realtime foundation is not fully wired end to end yet

## Real Limitations and Pending Work

- There is no versioned dependency file
- Settings are still focused on local development
- `ALLOWED_HOSTS` is empty
- There is no dedicated API for attachments outside the message flow
- App test files exist, but there is no documented or organized test suite coverage

## Useful Commands

```powershell
.\venv\Scripts\python.exe manage.py check
.\venv\Scripts\python.exe manage.py makemigrations
.\venv\Scripts\python.exe manage.py migrate
.\venv\Scripts\python.exe manage.py createsuperuser
.\venv\Scripts\python.exe manage.py runserver
```
