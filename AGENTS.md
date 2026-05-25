## Cursor Cloud specific instructions

**Product:** 360CampusFrance — a Next.js 16 app (French) guiding students through the Campus France process. User checklist progress is synced to Supabase (authentication required).

**Single service:** Next.js dev server on port 3000.

### Commands

| Task    | Command          |
|---------|------------------|
| Install | `npm install`    |
| Dev     | `npm run dev`    |
| Build   | `npm run build`  |
| Lint    | `npm run lint`   |

No test framework is configured — there are no automated tests.

### Supabase (optional)

Authentication (Google OAuth + magic link) and cloud progress sync require Supabase. Set these env vars in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Without them, the app runs fully in local-only mode (no auth button, localStorage only). The SQL migration is in `supabase/migrations/20260503_create_user_progress.sql`.

### Notes

- `npm run lint` exits with 9 pre-existing errors (not regressions): a `react-hooks/set-state-in-effect` violation in `components/auth-button.tsx` and `react/no-unescaped-entities` violations in `app/page.tsx` and `app/parcours/page.tsx` (French apostrophes).
- Node.js >= 18 is required (22.x recommended). The repo uses `package-lock.json` → use `npm`.
- Next.js 16 warns about `middleware.ts` being deprecated in favor of `proxy.ts`. The middleware still works; this is cosmetic.
- Backend API docs (Stoplight) are at `https://360campusfrance.mega-devs.com/docs/api` (base URL: `https://360campusfrance.mega-devs.com/api`). These can be fetched directly via `WebFetch` — no MCP installation needed.
