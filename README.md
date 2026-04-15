# Eternal Exchange UI Prototype

This repository contains a working prototype that recreates the recently added UI screenshots from `public/` and wires them with a simple backend.

## Tech

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- In-memory API backend through App Router route handlers

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Prototype Routes

- `/` : entry page with links to all prototype flows
- `/verification` : issuer submits an asset + docs for review
- `/review` : admin review queue (KYC + asset approval/rejection)
- `/marketplace` : browse approved assets
- `/marketplace/[id]` : asset room and create primary order
- `/orders` : view order history
- `/payments` : settle pending orders
- `/portfolio` : see holdings/listings mock flow
- `/kyc` : investor KYC + wallet binding

## End-to-End Demo Flow

1. Submit a new asset on `/verification`
2. Approve it from `/review`
3. Open it in `/marketplace`
4. Place order in `/marketplace/[id]`
5. Settle in `/payments`
6. See paid holding in `/portfolio`

## Backend API (Simple Prototype)

All state is kept in memory (`lib/prototypeStore.ts`). It resets when the server restarts.

- `GET /api/prototype/bootstrap`
- `GET,POST /api/prototype/kyc`
- `PATCH /api/prototype/kyc/:id`
- `POST /api/prototype/wallet`
- `GET,POST /api/prototype/assets`
- `PATCH /api/prototype/assets/:id`
- `GET,POST /api/prototype/orders`
- `POST /api/prototype/orders/:id/settle`

## Notes

- `npm run build` passes successfully.
- Existing unrelated legacy routes/components remain in the repository and can be removed/refactored separately if you want only the new prototype surface.
