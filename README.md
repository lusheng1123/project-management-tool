# Project Management Tool

A standalone, single-page project management application built with vanilla HTML, CSS, and JavaScript. Designed to run locally with zero dependencies (using `localStorage`) or inside **Microsoft Power Apps** backed by **Dataverse**.

---

## Quick Start (DEV Mode)

1. Clone or download this repository
2. Open `index.html` in any modern browser
3. The app auto-seeds with sample data on first load
4. Start managing resources, capabilities, products, requirements, projects, epics, risks, and dependencies

**No server, no npm, no build step required.**

---

## Features

| Module | Description |
|---|---|
| **Resources** | Team member directory with roles, departments, teams, and managers |
| **Capabilities** | Business/technical capabilities with product linking (N:N) |
| **Products** | Products and platform components |
| **Requirements** | Demand intake with PSC approval workflow, capability-product filtering |
| **Projects** | Project portfolio with 5-stage pipeline (Onboarding → Dev Phase 1 → Dev Phase 2 → Review → Live) |
| **Controls** | Governance gates, reviews, and audits per project |
| **Epics** | Work breakdown with RAG status, user stories, and multi-select team assignments |
| **User Stories** | Story management with acceptance criteria and epic linking |
| **Risks** | RAID log with probability, impact, and mitigation tracking |
| **Dependencies** | Risk-to-risk dependency mapping |
| **Roadmap** | Calendar view (Month/Week/Day) showing products & projects on timeline |

### Cross-Cutting Features

- Full CRUD on all 12 entities
- Dynamic modals generated from field definitions
- Filtered dropdowns (e.g., products filtered by selected capability)
- Many-to-many linking (capabilities ↔ products)
- Multi-select developers from Resources list in Epic forms
- RAG status visualization
- 5-stage project pipeline with kanban board per product (📊 Pipeline button)
- Roadmap calendar with Month/Week/Day views and color-coded bars
- Projects linked inline on Product dashboard
- 🔄 Reset button in header to clear data and re-seed
- Stats dashboard per module
- Toast notifications
- Responsive design

---

## Architecture

```
project-management-tool/
├── index.html              # SPA shell
├── styles.css              # Complete styling (CSS custom properties)
├── models.js               # 12 entity schemas + relationships
├── seed-data.js            # DEV-only sample data seeder
├── data.js                 # Data service (DEV: localStorage, PROD: Xrm.WebApi)
├── components.js           # Reusable UI components (modals, tables, stats, filters)
├── views.js                # 10 dashboard views (Resources → Stories) with full CRUD logic
├── app.js                  # App init, navigation, event delegation
├── docs/
│   ├── REQUIREMENTS.md     # Full requirements specification
│   ├── TABLES-DATAVERSE.md # Dataverse table specs (12 tables)
│   ├── SEED-DATA.md        # Sample data reference
│   └── DEPLOY-GUIDE.md     # Step-by-step Power Apps migration
└── .gitignore
```

---

## Modes

### DEV Mode (Default)

- Data stored in browser `localStorage`
- Auto-seeded with 30 resources, 12 projects, and 100+ records on first load
- **🔄 Reset** button in header clears all data and re-seeds
- Works offline, no backend
- Perfect for demos and prototyping

### PROD Mode

- Data stored in Microsoft Dataverse
- Uses `Xrm.WebApi` for all CRUD operations
- Works inside Power Apps Web Resources
- To activate: change `MODE` in `data.js` from `'DEV'` to `'PROD'`

---

## Migrating to Power Apps

See **[docs/DEPLOY-GUIDE.md](docs/DEPLOY-GUIDE.md)** for detailed instructions.

High-level steps:
1. Push to GitHub
2. Clone on company laptop
3. Create 12 Dataverse tables (see `docs/TABLES-DATAVERSE.md`)
4. Upload all files as Power Apps Web Resources
5. Switch to `MODE: 'PROD'` and re-upload `data.js`
6. Add to Model-Driven App

---

## Technology

- **HTML5** — Semantic, accessible markup
- **CSS3** — Custom properties, grid, flexbox, responsive
- **Vanilla JavaScript (ES6+)** — Classes, arrow functions, template literals
- **localStorage** — DEV data persistence
- **Xrm.WebApi** — PROD data persistence (Power Apps Dataverse)
- **Zero dependencies** — No frameworks, no npm packages, no CDN imports

---

## Browser Support

All modern browsers: Chrome 80+, Edge 80+, Firefox 75+, Safari 13+

---

## License

MIT — Free for personal and commercial use.
