## Cursor Cloud specific instructions

**Product:** CampusBeninTrack — a Next.js 16 app (French) guiding Beninese students through the Campus France process. User checklist progress is persisted in browser `localStorage` and optionally synced to Supabase when authenticated.

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

- `npm run lint` has a pre-existing `react-hooks/set-state-in-effect` lint error in `hooks/use-tracker.ts`. This is a known violation in the repo, not a regression.
- Node.js >= 18 is required (22.x recommended). The repo uses `package-lock.json` → use `npm`.
- Next.js 16 warns about `middleware.ts` being deprecated in favor of `proxy.ts`. The middleware still works; this is cosmetic.
