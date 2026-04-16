# GRF Talk Backend

Backend API for the GRF Talk learning project, built with Django and Django REST Framework.

## Disclaimer

This backend was developed as part of a learning exercise focused on authentication, chat flows, uploads, and realtime foundations.

It did not move to production. The project stayed in a prototype state because the expected hosting, database, file storage, and maintenance costs were not justified for the original goal.

## Stack

- Django 5
- Django REST Framework
- Simple JWT
- MySQL
- `django-cors-headers`
- `python-dotenv`
- `python-socketio`

## Project Structure

```text
grftalk-backend/
|-- accounts/      # custom user model, auth, and profile
|-- attachments/   # file and audio attachment models
|-- chats/         # chats, messages, serializers, and views
|-- core/          # settings, urls, ASGI/WSGI, and socket setup
|-- media/         # local development uploads
|-- manage.py
`-- README.md
```

## Local Setup

### 1. Create a virtual environment

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 2. Install dependencies

This snapshot does not include `requirements.txt` or `pyproject.toml`. Based on the current codebase, the main packages are:

```powershell
pip install Django djangorestframework djangorestframework_simplejwt django-cors-headers python-dotenv mysqlclient python-socketio eventlet
```

### 3. Configure environment variables

Create `grftalk-backend/.env` with at least:

```env
DB_PASSWORD=your_mysql_password
```

## Database Assumptions

The default settings in `core/settings.py` assume:

- engine: MySQL
- database: `grftalk`
- user: `root`
- host: `localhost`
- port: `3306`

The codebase also includes local-development assumptions such as:

- `CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]`
- `CURRENT_URL = "http://127.0.0.1:8000"`

## Running Locally

```powershell
.\venv\Scripts\python.exe manage.py migrate
.\venv\Scripts\python.exe manage.py runserver
```

Default local URL: `http://127.0.0.1:8000`

### Admin

```powershell
.\venv\Scripts\python.exe manage.py createsuperuser
```

Admin URL: `http://127.0.0.1:8000/admin/`

## Authentication

- `JWTAuthentication` is the default authentication class
- `IsAuthenticated` is the default permission class
- Public endpoints explicitly use `AllowAny`
- Access tokens are valid for 7 days

Both `signin` and `signup` return:

- `user`
- `access_token`

## Current API

Base local URL: `http://127.0.0.1:8000`

### Accounts

#### `POST /api/v1/accounts/signup`

Creates a user with:

- `name`
- `email`
- `password`

#### `POST /api/v1/accounts/signin`

Authenticates a user with:

- `email`
- `password`

#### `GET /api/v1/accounts/me`

Returns the authenticated user and updates `last_access`.

#### `PUT /api/v1/accounts/me`

Updates:

- `name`
- `email`
- `password`
- `avatar` through `multipart/form-data`

Avatar upload accepts only `image/png` and `image/jpeg`.

### Chats

#### `GET /api/v1/chats/`

Lists the chats available to the authenticated user.

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
- Audio is stored as `.mp3`
- Attachments are registered through the `attachments` app

#### `DELETE /api/v1/chats/{chat_id}/messages/{message_id}`

Soft deletes a message created by the current user.

## Main Models

### `accounts.User`

- Custom user model with `email` as `USERNAME_FIELD`
- Main fields include `name`, `email`, `avatar`, `last_access`, and `is_Superuser`

### `chats.Chat`

- Stores the relationship between `from_user` and `to_user`
- Tracks `viewed_at`, `deleted_at`, and `created_at`

### `chats.ChatMessage`

- Supports text, file, and audio messages
- References attachments through `attachment_code` and `attachment_id`

### `attachments.FileAttachments`

- `name`, `extension`, `size`, `src`, and `content_type`

### `attachments.AudioAttachments`

- `src`

## Local Media

Files stored during development:

- avatars in `media/avatars/`
- files in `media/files/`
- audios in `media/audios/`

`MEDIA_URL` is configured as `/media/` and served by Django in development.

## Realtime Status

There is a Socket.IO server in `core/socket.py` used by the views to emit events such as:

- `update_chat`
- `update_chat_message`
- `mark_messages_as_seen`
- `mark_message_as_seen`

Current limitation:

- The socket server exists in the codebase, but it is not mounted in `asgi.py`
- Realtime is therefore only partially implemented

## Known Limitations

- No versioned dependency file is included
- Settings are still oriented toward local development
- `ALLOWED_HOSTS` is empty
- There is no dedicated attachment API outside the message flow
- Tests are not documented as a stable, complete suite

## Useful Commands

```powershell
.\venv\Scripts\python.exe manage.py check
.\venv\Scripts\python.exe manage.py makemigrations
.\venv\Scripts\python.exe manage.py migrate
.\venv\Scripts\python.exe manage.py createsuperuser
.\venv\Scripts\python.exe manage.py runserver
```
