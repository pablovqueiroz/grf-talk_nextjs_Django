# GRF Talk Frontend

Frontend application for the GRF Talk learning project, built with Next.js.

## Disclaimer

This frontend was created as part of a learning project to study modern React, Next.js, form handling, validation, UI composition, and the first steps of a chat interface.

It never reached production. The project remained a prototype because the expected deployment, backend, storage, and maintenance costs were higher than the value of pushing it live.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- `next-themes`
- `next-nprogress-bar`
- `sonner`
- `socket.io-client`
- `zod`
- `lucide-react`

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test:e2e
npm run test:e2e:headed
npm run test:e2e:ui
```

## Local Setup

```powershell
npm install
npm run dev
```

Default local URL: `http://localhost:3000`

## Environment Variable

The frontend expects:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

This value is currently used by the Socket.IO-related setup and is the expected base URL for API integration.

## Project Structure

```text
grftalk-frontend/
|-- public/
|-- src/
|   |-- app/                  # App Router, root layout, and home page
|   |-- components/
|   |   `-- ui/               # base UI components
|   |-- lib/
|   |   |-- schemas/          # Zod schemas
|   |   `-- utils.ts
|   `-- types/                # auth, chat, message, user, and attachment types
|-- package.json
`-- README.md
```

## What Already Exists

- App Router is configured
- Global styling is set up with Tailwind CSS v4
- Theme handling is prepared with `next-themes`
- Toast notifications are available through `sonner`
- A top progress bar is prepared with `next-nprogress-bar`
- Socket.IO client initialization has started
- Zod schemas exist for authentication flows
- Shared domain types already describe the main entities

## What Is Still Missing

Some pieces exist in the repository but are not fully connected to the main app flow yet:

- `src/components/Layouts/Providers.tsx` creates the global providers
- The current `layout.tsx` does not wrap the app with `Providers`
- `src/app/page.tsx` still renders the default Next.js starter page
- API calls for the backend are not implemented yet
- There are no finished authentication, chat list, or message screens

## Expected Backend Endpoints

The backend currently exposes:

- `POST /api/v1/accounts/signup`
- `POST /api/v1/accounts/signin`
- `GET /api/v1/accounts/me`
- `PUT /api/v1/accounts/me`
- `GET /api/v1/chats/`
- `POST /api/v1/chats/`
- `GET /api/v1/chats/{chat_id}`
- `DELETE /api/v1/chats/{chat_id}`
- `GET /api/v1/chats/{chat_id}/messages`
- `POST /api/v1/chats/{chat_id}/messages`
- `DELETE /api/v1/chats/{chat_id}/messages/{message_id}`

Frontend integration with these routes is still pending.

## Important Files

- `src/app/layout.tsx`: root metadata and app shell
- `src/app/page.tsx`: current home page
- `src/app/globals.css`: global styles and design tokens
- `src/components/Layouts/Providers.tsx`: theme, toast, progress, and socket setup
- `src/lib/schemas/authSchemas.ts`: validation schemas for auth

## Snapshot Notes

- Metadata still references the default Create Next App template
- The initial UI still includes the default Next.js starter content
- `package-lock.json` is present, so `npm` is the expected package manager
- `socket.io-client` is installed, but the backend realtime pipeline is not complete yet

## Natural Next Steps

- Connect `Providers` to the root `layout`
- Replace the temporary home page with a real GRF Talk interface
- Build an API layer for authentication, chats, and messages
- Add JWT-based session handling on the client
- Integrate uploads and user feedback states in the UI
