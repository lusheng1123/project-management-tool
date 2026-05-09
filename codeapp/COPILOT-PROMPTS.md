# 🤖 Copilot Prompts — Migrate to Power Apps Code App

Copy each prompt into GitHub Copilot Chat (`Cmd+Shift+I`). Run them **in order** — each builds on the previous one. Review changes before moving to the next prompt.

> **Prerequisites**: Power Apps Premium license, Power Platform environment with Dataverse, PAC CLI installed & authenticated.

---

## Prompt 1: Scaffold Official Code App Template

```
I'm migrating my existing project management SPA to a Power Apps Code App using the official Microsoft starter template.

Please scaffold the project:

1. Run: npx degit microsoft/PowerAppsCodeApps/templates/starter#main codeapp-official
2. cd codeapp-official && npm install
3. Install these additional dependencies:
   npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
4. Run npm run dev and confirm the starter page loads at localhost

Tell me the URL when ready.
```

**Expected**: Vite dev server running, "Power + Code" starter page visible.

---

## Prompt 2: Initialize Power Platform & Add 12 Dataverse Tables

```
Now connect this code app to my Power Platform environment. My environment ID is <REPLACE_WITH_YOUR_ENV_ID>. My app display name is "Project Management Tool".

Steps:
1. pac code init --environment <ENVIRONMENT-ID> --displayName "Project Management Tool"
2. Add all 12 Dataverse tables as data sources:

pac code add-data-source -a dataverse -t pm_resource
pac code add-data-source -a dataverse -t pm_capability
pac code add-data-source -a dataverse -t pm_product
pac code add-data-source -a dataverse -t pm_capabilityproduct
pac code add-data-source -a dataverse -t pm_requirement
pac code add-data-source -a dataverse -t pm_project
pac code add-data-source -a dataverse -t pm_control
pac code add-data-source -a dataverse -t pm_epic
pac code add-data-source -a dataverse -t pm_userstory
pac code add-data-source -a dataverse -t pm_assignment
pac code add-data-source -a dataverse -t pm_risk
pac code add-data-source -a dataverse -t pm_dependency

After running these, show me the files generated in /generated/models/ and /generated/services/.
```

**Expected**: `power.config.json` created, 12 model files + 12 service files in `/generated/`.

---

## Prompt 3: Port UI Components (Calendar, Pipeline, Search)

```
I have existing UI components I need to port into this project. Please read these files from my old scaffold:

- /Users/fufuheyhey/project-management-tool/codeapp/src/components/Calendar.tsx
- /Users/fufuheyhey/project-management-tool/codeapp/src/components/Pipeline.tsx
- /Users/fufuheyhey/project-management-tool/codeapp/src/contexts/SearchContext.tsx
- /Users/fufuheyhey/project-management-tool/codeapp/src/index.css (for calendar legend styles)

Port them into the new project:

1. Calendar.tsx → src/components/Calendar.tsx
   - Keep FullCalendar logic (plugins, eventDrop, renderEventContent)
   - Replace `ds.getAll('pm_project')` with `PmProjectsService.getAll({ select: [...] })`
   - Replace `ds.update('pm_project', ...)` with `PmProjectsService.update(id, changes)`
   - Import useSearch from SearchContext for filtering
   - Adapt the legend bar to use Tailwind classes (flex, gap, bg-white, rounded, border)

2. Pipeline.tsx → src/components/Pipeline.tsx
   - Replace `ds.getAll('pm_project')` → `PmProjectsService.getAll()`
   - Replace `ds.update('pm_project', ...)` → `PmProjectsService.update(id, { pm_status: targetStage })`

3. SearchContext.tsx → src/contexts/SearchContext.tsx
   - Copy as-is (it's framework-agnostic)

4. Port the .calendar-legend CSS class from the old index.css into Tailwind utility classes.

Show me each file when done.
```

**Expected**: Calendar, Pipeline, and SearchContext working in the new project.

---

## Prompt 4: Port Resources Page (Template for All 10 Pages)

```
I need to port the Resources dashboard from my old scaffold. This will serve as the template pattern for all 10 dashboards.

First, read the old file:
/Users/fufuheyhey/project-management-tool/codeapp/src/views/Resources.tsx

Then create src/pages/ResourcesPage.tsx in this new project.

Key changes from the old code:
1. Replace the import of DataAdapter/ds with the generated service:
   import { PmResourcesService } from '@/generated/services/PmResourcesService'
   import type { PmResource } from '@/generated/models/PmResource'

2. Replace ALL ds.* calls:
   - ds.create('pm_resource', vals) → PmResourcesService.create(vals)
   - ds.getAll('pm_resource') → PmResourcesService.getAll({ select: ['pm_name','pm_role','pm_department','pm_team','pm_status'] })
   - ds.getById('pm_resource', id) → PmResourcesService.get(id)
   - ds.update('pm_resource', id, vals) → PmResourcesService.update(id, vals)
   - ds.delete('pm_resource', id) → PmResourcesService.delete(id)

3. Use Tanstack Query pattern instead of manual useState+useEffect:
   ```
   const { data, isLoading, error, refetch } = useQuery({
     queryKey: ['resources'],
     queryFn: () => PmResourcesService.getAll({ select: FIELDS })
   })
   const createMutation = useMutation({
     mutationFn: (vals) => PmResourcesService.create(vals),
     onSuccess: () => { toast('Created!'); refetch() }
   })
   ```

4. Keep the Table component (with auto-badge, sort, search from SearchContext)
5. Keep the Modal component for create/edit forms (use getFields metadata if needed)
6. Keep useToast for notifications
7. Add proper loading spinner and error state (error?.message)

Show me the complete ResourcesPage.tsx.
```

**Expected**: Full CRUD Resources page using generated services and Tanstack Query.

---

## Prompt 5: Port Remaining 9 Pages

```
Now port the remaining 9 dashboards using the EXACT same pattern as ResourcesPage.tsx.

For each, read from the old scaffold and create the new page:

| Old File | New File | Generated Service |
|---|---|---|
| /Users/.../codeapp/src/views/Products.tsx | src/pages/ProductsPage.tsx | PmProductsService |
| /Users/.../codeapp/src/views/Projects.tsx | src/pages/ProjectsPage.tsx | PmProjectsService |
| /Users/.../codeapp/src/views/Capabilities.tsx | src/pages/CapabilitiesPage.tsx | PmCapabilitiesService |
| /Users/.../codeapp/src/views/Requirements.tsx | src/pages/RequirementsPage.tsx | PmRequirementsService |
| /Users/.../codeapp/src/views/Epics.tsx | src/pages/EpicsPage.tsx | PmEpicsService |
| /Users/.../codeapp/src/views/UserStories.tsx | src/pages/UserStoriesPage.tsx | PmUserstoriesService |
| /Users/.../codeapp/src/views/Risks.tsx | src/pages/RisksPage.tsx | PmRisksService |
| /Users/.../codeapp/src/views/Dependencies.tsx | src/pages/DependenciesPage.tsx | PmDependenciesService |
| /Users/.../codeapp/src/views/Roadmap.tsx | src/pages/RoadmapPage.tsx | PmProjectsService |

For every page:
- Replace ALL ds.* calls with the generated *Service.* calls
- Use Tanstack Query (useQuery + useMutation) pattern
- Keep existing UI: Table (with badges, sort, search), Modal (create/edit), Toast
- Keep search/filter from SearchContext
- For RoadmapPage: import CalendarView from components, no additional service calls

Port all 9 and show me the updated router file with all routes configured.
```

**Expected**: All 10 pages ported, router configured.

---

## Prompt 6: Wire App.tsx with Router, Navigation, and Filter Bar

```
I need to wire up the main app shell with React Router, a navigation bar, and the global filter bar.

The old app (at /Users/fufuheyhey/project-management-tool/codeapp/src/App.tsx) had:
- A dark header with title and Reset button
- 10 tab buttons: Resources, Products, Projects, Capabilities, Requirements, Epics, User Stories, Risks, Dependencies, Roadmap
- A FilterBar component below the tabs with search input, clear button, and "Filtering by..." hint
- SearchContext provider wrapping everything

Please create/update these files:

### src/router.tsx
- Routes for all 10 pages: / → ResourcesPage, /products → ProductsPage, etc.
- Use HashRouter for Power Apps compatibility
- Keep the basename logic from the starter template:
  ```
  const BASENAME = new URL(".", location.href).pathname
  if (location.pathname.endsWith("/index.html")) {
    history.replaceState(null, "", BASENAME + location.search + location.hash);
  }
  ```

### src/components/Navigation.tsx
- Top nav bar with 10 links using NavLink (active state highlighted)
- Style it dark (#0f172a background) matching the old app header

### src/components/FilterBar.tsx
- Search input with "🔍 Filter current view..." placeholder
- Clear ✕ button (only visible when text is present)
- "Filtering by X" hint text
- Uses SearchContext (useSearch hook)

### src/App.tsx
- Wrap everything: SearchProvider → Router
- Import Navigation and FilterBar
- Layout: Header (title only) → Navigation → FilterBar → <Outlet />
- NO Reset button, NO seed logic, NO localStorage references
- Use Tailwind for styling

Show me all 4 files.
```

**Expected**: Full app shell with navigation, filter bar, and routing.

---

## Prompt 7: Add Power Apps Vite Plugin & Finalize Config

```
Add the official Power Apps Vite plugin and finalize the build configuration.

1. Install: npm install @microsoft/power-apps-vite

2. Update vite.config.ts:
   - Add import: import { powerApps } from '@microsoft/power-apps-vite'
   - Add to plugins array: [react(), tailwindcss(), powerApps()]
   - Ensure base is './'

3. Check that @/ alias resolves to src/ (already in starter template)

4. Run: npm run build

5. Verify:
   - Build succeeds with zero errors
   - dist/ contains index.html and assets/
   - No console warnings about missing plugins

Show me the updated vite.config.ts and the build output.
```

**Expected**: Clean build with powerApps() plugin.

---

## Prompt 8: Final Production Readiness Review

```
Do a comprehensive final review before publishing to Power Platform.

### Checklist — verify each one:

1. 🔍 Search for any remaining old code:
   - grep for "localStorage" → should find ZERO results outside of a theme preference
   - grep for "DataAdapter" or "ds.create\|ds.getAll\|ds.update\|ds.delete" → ZERO
   - grep for "seed" or "seedAllIfNeeded" → ZERO
   - grep for "Reset Data" → ZERO

2. 📁 Verify generated services are used:
   - All 10 page files import from @/generated/services/*Service
   - No file manually constructs fetch/XHR calls to Dataverse

3. ⚙️ Check configuration:
   - power.config.json exists and has correct environmentId
   - vite.config.ts includes powerApps() plugin
   - Router uses HashRouter or correct basename

4. 🏗️ Verify build:
   - npm run build succeeds with zero errors
   - dist/ contains index.html with correct <script> tags

5. 🚀 Publish command:
   npm run build && pac code push

After review, list any issues found and their fixes. If clean, output the exact commands to publish.
```

**Expected**: Clean bill of health or a short list of fixes needed. Ready for `pac code push`.

---

## After Migration — Publish & Test

```bash
# Build
npm run build

# Push to Power Platform
pac code push

# Open in Power Apps
# Go to https://make.powerapps.com → Apps → "Project Management Tool" → Play

# Verify in browser console:
# - No CSP errors
# - Entra ID auth working
# - All 12 tables accessible via Dataverse
```

---

## Tips for Using These Prompts

| Tip | Detail |
|---|---|
| **One at a time** | Run each prompt, review the changes, then move to the next |
| **Read files first** | If Copilot seems lost, ask it to read the old file first: "Please read /Users/.../Resources.tsx before making changes" |
| **Commit after each** | `git add -A && git commit -m "Prompt 3: Port UI components"` |
| **Test between** | After prompts 3, 5, and 7: run `npm run dev` and check localhost |
| **Replace env ID** | In Prompt 2, replace `<REPLACE_WITH_YOUR_ENV_ID>` with your actual environment ID |
| **Table names** | If your Dataverse table names differ from pm_resource, pm_project etc., update Prompt 2 and Prompt 4-5 accordingly |

---

> Generated May 9, 2026 — Part of the Project Management Tool → Code App migration
