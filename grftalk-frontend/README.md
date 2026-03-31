# GRF Talk Frontend

GRF Talk web frontend built with Next.js.

In this snapshot, the technical foundation of the app is already in place, but the main product experience has not been implemented yet: the `/` route still renders the default `create-next-app` template.

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
```

## Setup Local

```powershell
npm install
npm run dev
```

Default local server: `http://localhost:3000`

## Environment Variables

The project uses `NEXT_PUBLIC_API_BASE_URL`, currently consumed by the Socket.IO provider:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

## Structure

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

- App Router configured
- Global styling with Tailwind CSS v4
- Light/dark theme support through `next-themes`
- Toast notifications with `sonner`
- Progress bar with `next-nprogress-bar`
- `socket.io-client` initialization
- Zod schemas for sign in and sign up
- Shared domain types for the app's core entities

## What Is Not Wired Yet

Some pieces already exist in the codebase, but they are not connected to the main application flow yet:

- `src/components/Layouts/Providers.tsx` creates the global providers
- The current `layout.tsx` does not wrap the app with `Providers`
- `src/app/page.tsx` is still the default Next.js starter page
- There are no HTTP calls implemented for the backend endpoints
- There are no authentication, chat list, or message screens yet

## Expected Backend Integration

The current backend exposes:

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

At the moment, this integration still needs to be implemented in the frontend.

## Important Files

- `src/app/layout.tsx`: metadata and root structure
- `src/app/page.tsx`: current home page
- `src/app/globals.css`: global theme and CSS tokens
- `src/components/Layouts/Providers.tsx`: theme, toast, progress, and socket setup
- `src/lib/schemas/authSchemas.ts`: auth validation with Zod

## Snapshot Notes

- Metadata is still set to `Create Next App`
- The initial UI still uses the default Next.js and Vercel logos and links
- `package-lock.json` is present, so `npm` is the natural package manager here
- `socket.io-client` is installed, but the backend does not yet complete the realtime flow through ASGI

## Natural Next Steps

- Connect `Providers` to the root `layout`
- Replace the temporary home page with a real GRF Talk interface
- Create an API layer for auth, chats, and messages
- Implement JWT-based session state
- Integrate uploads and request feedback in the UI
