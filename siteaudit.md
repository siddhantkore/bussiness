# Site Audit

Date: 2026-04-15

## Project Intention

The active product direction is an **Eternal Exchange** prototype: issuer verification, KYC, marketplace browsing, primary order creation, payment settlement, and portfolio viewing. This is documented in [README.md](/home/siddhant/Travelling/Webathon/bussiness/README.md:1) and implemented across the prototype pages under `app/verification`, `app/review`, `app/marketplace`, `app/orders`, `app/payments`, `app/portfolio`, and `app/kyc`.

At the same time, the repository still ships a second, unrelated **Land Ownership Information System** scaffold with editable property, ownership, encumbrance, income, and document routes. That older surface is still routable in production builds and still defines the app metadata, so the repo currently has two conflicting product identities.

## Architecture Snapshot

- Framework: Next.js 16 App Router with React 19 and Tailwind 4. See [package.json](/home/siddhant/Travelling/Webathon/bussiness/package.json:1).
- Backend: App Router route handlers only. No database ORM, no storage SDK, no auth library. See [package.json](/home/siddhant/Travelling/Webathon/bussiness/package.json:11).
- State: Shared in-memory global state via `globalThis.__prototypeState`. See [lib/prototypeStore.ts](/home/siddhant/Travelling/Webathon/bussiness/lib/prototypeStore.ts:159).
- Persistence: Explicitly none. See [README.md](/home/siddhant/Travelling/Webathon/bussiness/README.md:42).

## Validation Performed

- Read the installed Next 16 App Router docs for route handlers and project structure from `node_modules/next/dist/docs/`.
- Reviewed the prototype routes, shared store, and representative legacy pages/components.
- Ran `npm run build`: passes.
- Ran `npm run lint`: fails.

## Findings

### 1. Critical: Full internal state and PII are exposed to any browser client

`GET /api/prototype/bootstrap` returns the entire shared state object, including treasury balance, all KYC requests, all assets, and all orders. See [app/api/prototype/bootstrap/route.ts](/home/siddhant/Travelling/Webathon/bussiness/app/api/prototype/bootstrap/route.ts:1) and [lib/prototypeStore.ts](/home/siddhant/Travelling/Webathon/bussiness/lib/prototypeStore.ts:56). The KYC records contain personal fields such as email, PAN, Aadhaar suffix, occupation, and wallet address. See [lib/prototypeStore.ts](/home/siddhant/Travelling/Webathon/bussiness/lib/prototypeStore.ts:7).

The exposure is not theoretical: the KYC and admin review pages fetch that bootstrap payload directly in the client. See [app/kyc/page.tsx](/home/siddhant/Travelling/Webathon/bussiness/app/kyc/page.tsx:14) and [app/review/page.tsx](/home/siddhant/Travelling/Webathon/bussiness/app/review/page.tsx:98).

Impact: any visitor can read investor KYC data, treasury totals, and order history.

Recommendation: remove `bootstrap` from public use, split APIs by role, return only scoped data for the logged-in principal, and move admin-only data behind authenticated server-side checks.

### 2. Critical: No authentication or authorization exists on any sensitive workflow

All sensitive actions are public route handlers with no identity check, no session check, and no role enforcement:

- Approve/reject assets: [app/api/prototype/assets/[id]/route.ts](/home/siddhant/Travelling/Webathon/bussiness/app/api/prototype/assets/%5Bid%5D/route.ts:32)
- Approve/reject KYC: [app/api/prototype/kyc/[id]/route.ts](/home/siddhant/Travelling/Webathon/bussiness/app/api/prototype/kyc/%5Bid%5D/route.ts:78)
- Bind wallet by email: [app/api/prototype/wallet/route.ts](/home/siddhant/Travelling/Webathon/bussiness/app/api/prototype/wallet/route.ts:129)
- Create orders: [app/api/prototype/orders/route.ts](/home/siddhant/Travelling/Webathon/bussiness/app/api/prototype/orders/route.ts:98)
- Settle payments: [app/api/prototype/orders/[id]/settle/route.ts](/home/siddhant/Travelling/Webathon/bussiness/app/api/prototype/orders/%5Bid%5D/settle/route.ts:118)

The UI also exposes admin actions as ordinary client buttons. See [app/review/page.tsx](/home/siddhant/Travelling/Webathon/bussiness/app/review/page.tsx:127).

Impact: any caller can approve compliance, publish assets, bind someone else’s wallet, or mark orders as paid.

Recommendation: add authentication first, then explicit role checks for issuer, investor, and admin flows.

### 3. High: Order and settlement logic can be abused and is not idempotent

`settleOrder` blindly sets status to `PAID` and always increments treasury, even if the order was already settled. See [lib/prototypeStore.ts](/home/siddhant/Travelling/Webathon/bussiness/lib/prototypeStore.ts:276). Repeating the same settlement request will inflate treasury.

`createBuyOrder` only checks that the asset exists and is approved. It does not enforce:

- KYC approval
- wallet binding
- minimum ticket
- available inventory
- per-user ownership
- duplicate submission protection
- reservation or locking

See [lib/prototypeStore.ts](/home/siddhant/Travelling/Webathon/bussiness/lib/prototypeStore.ts:254) and the public order endpoint at [app/api/prototype/orders/route.ts](/home/siddhant/Travelling/Webathon/bussiness/app/api/prototype/orders/route.ts:98).

Impact: overselling, double settlement, fake holdings, and inconsistent treasury reporting.

Recommendation: model orders and settlements transactionally in a real database, enforce state transitions, make settlement idempotent, and tie orders to authenticated users.

### 4. High: The app uses a shared mutable global store instead of a database

The core state is stored in a single process-global object: [lib/prototypeStore.ts](/home/siddhant/Travelling/Webathon/bussiness/lib/prototypeStore.ts:159). The README also states that all state is in memory and resets on restart. See [README.md](/home/siddhant/Travelling/Webathon/bussiness/README.md:42).

Impact:

- all users share one state bag
- state disappears on restart or redeploy
- multi-instance deployments will diverge
- no audit log or history
- no optimistic locking or consistency guarantees

Recommendation: move to a database before treating this as more than a click-through demo. At minimum you need users, KYC requests, wallets, issuers, assets, asset documents, orders, settlements, and audit events.

### 5. High: Real-looking personal and financial data are hardcoded in the repo

Examples in the exchange prototype:

- hardcoded investor email in [app/kyc/page.tsx](/home/siddhant/Travelling/Webathon/bussiness/app/kyc/page.tsx:8)
- seeded KYC entry in [lib/prototypeStore.ts](/home/siddhant/Travelling/Webathon/bussiness/lib/prototypeStore.ts:65)

Examples in the legacy land-record scaffold:

- names and locations in [lib/mockData.ts](/home/siddhant/Travelling/Webathon/bussiness/lib/mockData.ts:78)
- ownership addresses and document numbers in [lib/mockData.ts](/home/siddhant/Travelling/Webathon/bussiness/lib/mockData.ts:171)
- bank names and loan account numbers in [lib/mockData.ts](/home/siddhant/Travelling/Webathon/bussiness/lib/mockData.ts:247)

Impact: privacy/compliance risk, accidental disclosure, and confusion over whether the dataset is synthetic or real.

Recommendation: replace all personally identifying seeds with clearly synthetic fixtures, and keep demo identities in seed files that are excluded from production builds where possible.

### 6. High: Wallet and KYC records are keyed by email, not by authenticated identity

The KYC page hardcodes a single email and binds wallet actions to that email string. See [app/kyc/page.tsx](/home/siddhant/Travelling/Webathon/bussiness/app/kyc/page.tsx:8) and [app/kyc/page.tsx](/home/siddhant/Travelling/Webathon/bussiness/app/kyc/page.tsx:40). The backend also looks up wallet bindings by email only. See [lib/prototypeStore.ts](/home/siddhant/Travelling/Webathon/bussiness/lib/prototypeStore.ts:194).

Impact: identity can be overwritten by guessing or reusing an email value; there is no concept of user ownership.

Recommendation: tie KYC and wallets to authenticated user IDs, not client-supplied email strings.

### 7. Medium: Document handling has no actual storage strategy or upload security

The issuer verification flow only accepts a comma-separated text list of document names, not files. See [app/verification/page.tsx](/home/siddhant/Travelling/Webathon/bussiness/app/verification/page.tsx:177). The store persists those names as plain metadata strings. See [lib/prototypeStore.ts](/home/siddhant/Travelling/Webathon/bussiness/lib/prototypeStore.ts:231).

The legacy documents module is also only a mock UI over local arrays and fake download alerts. See [app/documents/page.tsx](/home/siddhant/Travelling/Webathon/bussiness/app/documents/page.tsx:120).

Missing pieces:

- file upload pipeline
- MIME and size validation
- malware scanning
- encrypted object storage
- document access control
- signed URLs
- retention/deletion policy
- versioning and audit trail

Recommendation: define a storage layer explicitly before claiming document workflows.

### 8. Medium: No database or storage dependencies are present despite multi-step transactional flows

The dependency list contains only Next, React, Tailwind, ESLint, and TypeScript. There is no Prisma, Drizzle, Postgres client, object-storage SDK, or auth provider. See [package.json](/home/siddhant/Travelling/Webathon/bussiness/package.json:11).

Impact: the current implementation cannot enforce persistence, relationships, auditability, or secure document handling.

Recommendation: choose a concrete stack now. For this product, a relational database plus object storage is the minimum credible baseline.

### 9. Medium: Product identity is internally inconsistent

The README and prototype shell describe an exchange product, but the app metadata still brands the site as a land-record system. See [README.md](/home/siddhant/Travelling/Webathon/bussiness/README.md:1) and [app/layout.tsx](/home/siddhant/Travelling/Webathon/bussiness/app/layout.tsx:107). The build output also includes both product surfaces as publicly routable pages.

Impact: confusing navigation, wrong SEO metadata, and low trust for end users or judges reviewing the project.

Recommendation: either remove the legacy scaffold from the deployed app or isolate it behind a route group and separate branding.

### 10. Medium: Prototype forms have accessibility and UX efficiency problems

The prototype forms rely heavily on placeholders rather than visible labels. See [app/verification/page.tsx](/home/siddhant/Travelling/Webathon/bussiness/app/verification/page.tsx:205) and [app/kyc/page.tsx](/home/siddhant/Travelling/Webathon/bussiness/app/kyc/page.tsx:60). They also have almost no inline validation, no loading states, and no submit disabling. The admin review buttons and payment settlement button can be clicked repeatedly without protection. See [app/review/page.tsx](/home/siddhant/Travelling/Webathon/bussiness/app/review/page.tsx:128) and [app/payments/page.tsx](/home/siddhant/Travelling/Webathon/bussiness/app/payments/page.tsx:52).

Impact: duplicate submissions, poor keyboard/screen-reader usability, and unclear failure handling.

Recommendation: add visible labels, validation errors, pending states, disabled submit buttons, and proper success/error toasts.

### 11. Medium: Error handling is too thin for API and UI flows

Most client calls assume success and do not catch failures. Examples:

- [app/verification/page.tsx](/home/siddhant/Travelling/Webathon/bussiness/app/verification/page.tsx:174)
- [app/marketplace/[id]/page.tsx](/home/siddhant/Travelling/Webathon/bussiness/app/marketplace/%5Bid%5D/page.tsx:252)
- [app/payments/page.tsx](/home/siddhant/Travelling/Webathon/bussiness/app/payments/page.tsx:22)
- [app/review/page.tsx](/home/siddhant/Travelling/Webathon/bussiness/app/review/page.tsx:128)

The route handlers also call `await request.json()` with no guarding, so malformed bodies will become 500s instead of clear client errors. See [app/api/prototype/assets/route.ts](/home/siddhant/Travelling/Webathon/bussiness/app/api/prototype/assets/route.ts:8) and the sibling handlers in `app/api/prototype/*`.

Recommendation: add request validation and structured error responses on the server, plus `try/catch` and user-visible failure states in the client.

### 12. Medium: The codebase is not lint-clean

`npm run lint` fails with real issues:

- `SidebarContent` is declared inside render, which triggers `react-hooks/static-components`. See [components/layout/Sidebar.tsx](/home/siddhant/Travelling/Webathon/bussiness/components/layout/Sidebar.tsx:210).
- unescaped quotes in the ownership page
- a few unused imports/variables

Impact: lower maintainability and signal that the scaffolded legacy surface is not production-ready.

Recommendation: make lint green before continuing feature work.

### 13. Low: No explicit app hardening is configured in `next.config.ts`

`next.config.ts` is effectively empty. See [next.config.ts](/home/siddhant/Travelling/Webathon/bussiness/next.config.ts:1).

Missing items to consider:

- security headers
- CSP
- stricter image/remote asset policy
- route-level hardening decisions

This is not the biggest current problem because the larger issue is missing auth and missing backend architecture, but it should still be addressed once the fundamentals are in place.

## UI Efficiency Notes

- The exchange prototype is visually more focused than the legacy scaffold, but still very form-heavy and action-dense.
- Important user actions are fragmented across pages without shared status context. Example: KYC approval is not surfaced in the marketplace before order creation.
- The prototype exposes multiple “success” messages, but no persistent timeline, audit log, or transaction detail states.
- The legacy land-record UI uses `alert()` and `confirm()` in multiple places, which is fast for scaffolding but weak UX. See [app/documents/page.tsx](/home/siddhant/Travelling/Webathon/bussiness/app/documents/page.tsx:123) and [app/properties/page.tsx](/home/siddhant/Travelling/Webathon/bussiness/app/properties/page.tsx:141).

## Database and Storage Gaps

If the exchange flow is the intended product, the missing baseline data model is:

- users
- roles
- KYC applications
- wallet bindings
- issuers
- assets
- asset documents
- orders
- settlements
- holdings
- payouts
- audit events

If the land-record flow is still intended, it also needs:

- property master records
- ownership chain history
- encumbrances
- income records
- document binaries and metadata
- access policies by user role

## Recommended Priority Order

1. Remove public access to bootstrap/admin actions and add authentication plus role checks.
2. Replace the global in-memory state with a real database and an audit log.
3. Make order/settlement flows transactional and idempotent.
4. Remove or quarantine the legacy land-record scaffold from the deployed surface.
5. Replace hardcoded identities and financial records with clearly synthetic fixtures.
6. Design a real document storage pipeline.
7. Fix lint errors and improve form accessibility/loading/error states.

## Verification Summary

- `npm run build`: passed
- `npm run lint`: failed

No network-based dependency vulnerability scan was performed in this audit, so this file covers **application-level issues present in the codebase**, not external CVE status.
