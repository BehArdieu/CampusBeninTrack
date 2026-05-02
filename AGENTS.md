## Cursor Cloud specific instructions

**Product:** CampusBeninTrack — a static, frontend-only Next.js 16 app (French) guiding Beninese students through the Campus France process. No backend, no database, no API routes. All user state is persisted in browser `localStorage`.

**Single service:** Next.js dev server on port 3000.

### Commands

| Task    | Command          |
|---------|------------------|
| Install | `npm install`    |
| Dev     | `npm run dev`    |
| Build   | `npm run build`  |
| Lint    | `npm run lint`   |

No test framework is configured — there are no automated tests.

### Notes

- `npm run lint` has a pre-existing `react-hooks/set-state-in-effect` error in `hooks/use-tracker.ts` (calling `setChecked` inside `useEffect`). This is a known lint violation in the repo, not a regression.
- No environment variables are required. `NEXT_PUBLIC_SITE_URL` is optional (metadata only).
- Node.js ≥ 18 is required (22.x recommended). The repo uses `package-lock.json` → use `npm`.
