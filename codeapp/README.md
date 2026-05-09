# CodeApp — Project Management Tool (DEV scaffold)

This is a local scaffold of your Project Management Tool converted to a React Code App style for local development (DEV only, localStorage-backed).

Run locally:

```bash
cd codeapp
npm install
npm run dev
```

Open the URL shown by Vite (default http://localhost:5173) and verify the `Resources` dashboard.

Notes:
- This scaffold is DEV-only. `DataAdapter` is backed by `localStorage`.
- `seed` is applied automatically once (3 sample resources).
- When ready to port more views, I will add `Products`, `Projects`, etc., preserving original behavior.
 
Recent additions:
- Interactive calendar on the `Roadmap` tab (FullCalendar) — drag events to reschedule. Dev server URL (today): http://localhost:5174/
- Product pipeline modal supports drag & drop between stages and persists status changes to localStorage.

Build:

```bash
cd codeapp
npm run build
```

Built files are in `codeapp/dist/`. See `DEPLOY-CODEAPP.md` for packaging and Dataverse migration notes.
