# Punlara

A Philippine fruit tree adoption platform — users adopt a real named tree on a Mindanao farm, receive monthly updates, and get their harvest delivered to their door.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (auto-provisioned)
- Optional env: `PAYMONGO_SECRET_KEY` — PayMongo secret key for real GCash/Maya/card checkout

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (artifacts/punlara, port 23937)
- API: Express 5 (artifacts/api-server, port 8080)
- DB: PostgreSQL + Drizzle ORM
- Auth: Replit Auth (OIDC/PKCE) via cookie sessions
- Payments: PayMongo (GCash, Maya, card) — REST API, no SDK
- Validation: Zod (zod/v4), drizzle-zod
- API codegen: Orval (from OpenAPI spec in lib/api-spec/openapi.yaml)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/db/src/schema/` — Drizzle DB schema (auth.ts, trees.ts, adoptions.ts)
- `artifacts/api-server/src/routes/` — Express routes (auth, trees, adoptions)
- `artifacts/punlara/src/pages/` — React pages (Home, Trees, Adopt, MyTree, Gift, TreeProfile)
- `artifacts/punlara/src/hooks/use-auth.ts` — local useAuth hook (NOT @workspace/replit-auth-web — see Gotchas)

## Architecture decisions

- Auth uses Replit OIDC (no custom login forms). Sessions stored in PostgreSQL sessions table.
- Payments: PayMongo REST API called directly from the API server. If PAYMONGO_SECRET_KEY is missing, returns a demo checkout URL for testing.
- useAuth hook is inlined in the Punlara app (artifacts/punlara/src/hooks/use-auth.ts) rather than imported from @workspace/replit-auth-web — this avoids a Vite React deduplication issue caused by the lib having its own node_modules.
- Trees are seeded manually via SQL — no admin UI yet.

## Product

- Browse 8+ real Mindanao fruit tree varieties (Mango, Durian, Mangosteen, Rambutan, Lanzones, Pomelo, Calamansi, Narra)
- 3-step adoption wizard: tree selection → steward details + gifting → checkout (PayMongo GCash/Maya/card)
- Digital Certificate of Stewardship generated after payment
- My Tree dashboard with growth timeline, farm journal, delivery tracking
- Corporate Gifting page (/gift) for B2B and OFW market
- QR tree profile pages (/tree/:id) for each tree — scannable from the farm

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- DO NOT import from @workspace/replit-auth-web in the Punlara frontend — use @/hooks/use-auth instead (multiple React copies issue with Vite + workspace libs that have their own node_modules).
- Always run codegen after changing lib/api-spec/openapi.yaml: `pnpm --filter @workspace/api-spec run codegen`
- Always run `pnpm --filter @workspace/db run push` after changing the DB schema.
- PayMongo secret key goes in PAYMONGO_SECRET_KEY env var — without it, the checkout returns a demo URL (safe for testing, not for production).

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
