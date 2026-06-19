---
name: Clerk Auth Migration
description: Punlara switched from Replit OIDC session-based auth to external Clerk (user's own Clerk account).
---

## Auth setup

- **Frontend**: `@clerk/react` with `<ClerkProvider>` in `main.tsx`. Publishable key in `VITE_CLERK_PUBLISHABLE_KEY` env var (shared).
- **Token injection**: `setAuthTokenGetter(() => getToken())` called in `ClerkTokenSync` component inside App.tsx. All API calls from `@workspace/api-client-react` automatically include `Authorization: Bearer <clerk_token>`.
- **User sync**: `UserSync` component in App.tsx POSTs profile data to `/api/auth/sync` on sign-in, upserting into `usersTable` using Clerk user ID (`user_xxx`) as the primary key.
- **Backend JWT verification**: `jose` package, JWKS URL derived from `VITE_CLERK_PUBLISHABLE_KEY` env var (base64 decode the part after `pk_test_` / `pk_live_`). Implemented in `authMiddleware.ts`.
- **Backend routes**: `auth.ts` simplified — only `/api/auth/user` (GET) and `/api/auth/sync` (POST). OIDC routes (`/login`, `/callback`, `/logout`) removed.
- **`lib/auth.ts`** still exists (not deleted) but is unused by the new middleware.

**Why:** Replit Auth requires users to have a Replit account — not viable for PH consumers. Clerk provides Google + email login.

**How to apply:** Any new protected backend route uses `req.isAuthenticated()` and `req.user.id` as before. Frontend uses `useAuth()` from `src/hooks/use-auth.ts` (now wraps Clerk hooks).
