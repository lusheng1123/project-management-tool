# Packaging the Code App

This document explains how to build and prepare the `codeapp` React scaffold for deployment as a static web resource (for manual testing) or to be included in a Power Apps Code App / web resource package.

Quick build and package

1. Build the production bundle

```bash
cd codeapp
npm install       # first time only
npm run build
```

2. Verify `dist/` was created and contains `index.html` and `assets/`.

3. Create a zip suitable for uploading to Dataverse or other hosting:

```bash
cd codeapp/dist
zip -r ../codeapp-dist.zip .
```

The `codeapp-dist.zip` file will be placed in the `codeapp` folder and contains the static app.

Dataverse / Power Apps notes

- This scaffold currently runs in `DEV` mode using `localStorage`. Before switching to `PROD` you must implement the `PROD` methods in `src/services/DataAdapter.ts` using `Xrm.WebApi` (see `docs/TABLES-DATAVERSE.md` in the repository for your Dataverse table mappings).
- Implement `create`, `getAll`, `getById`, `update`, `delete`, and `query` using `Xrm.WebApi.retrieveMultipleRecords`, `createRecord`, `updateRecord`, and `deleteRecord` semantics. Preserve the same method signatures so the UI code does not need changes.
- Packaging as a Code App:
	- You can upload the static `dist/` contents as a web resource or reference them from a secure CDN and point your Code App to the hosted URL.
	- When running inside the Power Platform, `Xrm` is available globally; use feature detection (e.g. `if(window.Xrm && window.Xrm.WebApi)`) to switch adapter behavior.

Security and CSP

- Power Platform enforces CSP for embedded web resources. Avoid loading remote scripts from untrusted origins; prefer bundling required dependencies into `dist/` or hosting them on a trusted CDN.
- If you use external services, ensure they support HTTPS and have appropriate CORS headers.

Testing and verification

- After uploading the `dist/` bundle to your environment, open the Code App or web resource and verify CRUD flows against Dataverse.
- Use browser developer tools to inspect network calls to `Xrm.WebApi` and confirm the table names and field mappings match `docs/TABLES-DATAVERSE.md`.

Next steps

- Implement `PROD` adapter methods in `src/services/DataAdapter.ts` and test in a sandbox Dataverse environment.
- Add E2E tests or a small Playwright script to exercise critical flows (create/update/delete, pipeline drag/drop, calendar reschedule).

