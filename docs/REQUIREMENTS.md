# Project Management Tool — Requirements Specification

**Version:** 1.0  
**Status:** Final  
**Last Updated:** 2025-05-06

---

## 1. System Overview

The **Project Management Tool** is a standalone single-page application (SPA) built in vanilla HTML/CSS/JavaScript. It supports two operating modes:

| Mode | Storage | Target |
|------|---------|--------|
| **DEV** | browser localStorage | local development, demos, prototyping |
| **PROD** | Microsoft Dataverse via Xrm.WebApi | Power Apps Model-Driven App (production) |

The application requires **zero dependencies**, **no npm**, **no build step**, and **no external CDN imports**. It runs by opening index.html in any modern browser.

---

## 2. Functional Requirements

### 2.1 Modules

The tool supports 8 modules (dashboards):

| # | Module | Entity | Description |
|---|--------|--------|-------------|
| F1 | Resources | pm_resource | Team member directory with roles, departments, cost, and status |
| F2 | Capabilities | pm_capability | Business/technical capabilities with N:N product linking |
| F3 | Products | pm_product | Products and platform components with governance status |
| F4 | Requirements | pm_requirement | Demand intake with PSC approval workflow and capability-product filtering |
| F5 | Projects | pm_project | Project portfolio with resource assignments (PO, DL, IT Lead, BA) |
| F6 | Epics | pm_epic | Work breakdown with RAG status, user stories, team assignments, Jira links |
| F7 | Risks | pm_risk | RAID log with project linkage and dependency mapping |
| F8 | Dependencies | pm_dependency | Risk-to-risk dependency tracking |

### 2.2 CRUD Operations

All 12 entities support full Create, Read, Update, Delete:

- Create: Modal forms generated dynamically from field defs in models.js
- Read: Tabular dashboards with column rendering, badges, stats cards
- Update: Same modal system with pre-filled record data
- Delete: Confirmation prompt before removal

### 2.3 Cross-Cutting Features

| Feature | Description |
|---------|-------------|
| Dynamic Modals | Generated from field defs; supports text, number, date, email, choice, multiline, lookup |
| Filtered Dropdowns | Products filtered by selected capability; resources filtered by department |
| Many-to-Many Linking | Capabilities <-> Products via pm_capabilityproduct link table with checkbox UI |
| RAG Visualization | Green/Amber/Red badges on epics based on pm_ragstatus |
| Stats Dashboard | Summary cards per module (total, active, breakdowns) |
| Toast Notifications | Auto-dismiss success/error messages after CRUD operations |
| Responsive Design | CSS grid + flexbox; desktop and tablet |

### 2.4 PSC Approval Workflow (Requirements)

- Requirements can be flagged for PSC approval (pm_pscapprovalrequired: Yes/No)
- PSC status: Pending / Approved / Rejected / N/A
- Dedicated PSC stats on the Requirements dashboard

---

## 3. Data Model

### 3.1 Entity List

| # | Table Name | Display Name | Seed Count | Key Relationships |
|---|-----------|--------------|------------|-------------------|
| 1 | pm_resource | Resource | 30 | has many assignments, referenced by projects/epics/requirements |
| 2 | pm_capability | Capability | 8 | has many cap-product links, has many requirements |
| 3 | pm_product | Product | 10 | has many cap-product links, requirements, projects |
| 4 | pm_capabilityproduct | Capability-Product Link | 14 | belongs to capability, belongs to product |
| 5 | pm_requirement | Requirement | 20 | belongs to capability, product, project |
| 6 | pm_project | Project | 6 | belongs to product, has many controls/epics/risks/requirements |
| 7 | pm_control | Control | 8 | belongs to project |
| 8 | pm_epic | Epic | 10 | belongs to project, has many user stories and assignments |
| 9 | pm_userstory | User Story | 15 | belongs to epic |
| 10 | pm_assignment | Assignment | 20 | belongs to epic and resource |
| 11 | pm_risk | Risk | 8 | belongs to project, has many dependencies |
| 12 | pm_dependency | Dependency | 10 | belongs to risk |

### 3.2 Field Schema

All fields use pm_ prefix convention. See models.js for the complete JavaScript schema, or docs/TABLES-DATAVERSE.md for Dataverse-ready column specifications.

Field Types:

| Type | Input | Description |
|------|-------|-------------|
| text | text input | Single-line text |
| multiline | textarea | Multi-line text |
| choice | select dropdown | Predefined fixed options |
| lookup | text input | Foreign key reference stored as text ID |
| number | number input | Numeric with optional min/max/step |
| date | date picker | Calendar date |
| email | email input | Email format |

### 3.3 Relationship Diagram

```
Resource --------
  |              |
  +-- Assignment <-- Epic <-- Project <-- Product
  |       |           |        |          |
  |       +-- UserStory        +-- Risk -- Dependency
  |                           |
  +-- Requirement ------------|
  |       |                   |
  |       +-- Capability <--> CapabilityProduct <--> Product
  |
  +-- (lookup fields on Project: PO, DL, IT Lead, BA)
```

### 3.4 ID Generation

- DEV mode: Client-side pattern {table}_{timestamp}_{random5}
- PROD mode: Dataverse auto-generates GUIDs

---

## 4. Architecture

### 4.1 File Structure

```
project-management-tool/
  index.html              SPA shell
  styles.css              CSS custom properties, grid, flexbox
  models.js               Entity schemas + relationships
  seed-data.js            DEV ONLY - populates localStorage
  data.js                 DataService abstraction layer
  components.js           UI components (modal, table, stats, toast)
  views.js                8 dashboard views + CRUD handlers
  app.js                  Init, navigation, event delegation
  docs/
    TABLES-DATAVERSE.md   Dataverse table specs
    DEPLOY-GUIDE.md       Power Apps migration guide
    SEED-DATA.md          Seed data reference
    REQUIREMENTS.md       This document
  .gitignore
```

### 4.2 Script Load Order

models.js -> seed-data.js -> data.js -> components.js -> views.js -> app.js

### 4.3 DataService Abstraction

APP_CONFIG.MODE switches between DEV (localStorage) and PROD (Xrm.WebApi/Dataverse).

All consumer code calls abstract methods:
- ds.create(), ds.getAll(), ds.getById(), ds.update(), ds.delete(), ds.query()

Underlying storage mechanism is transparent to UI logic.

### 4.4 Special Query Methods

| Method | Description |
|--------|-------------|
| getProductsByCapability(capId) | Products linked via pm_capabilityproduct |
| getCapabilitiesByProduct(prodId) | Capabilities linked via pm_capabilityproduct |
| getRequirementsByCapability(capId) | Filter requirements by capability |
| getRequirementsByProject(projId) | Filter requirements by project |
| getEpicsByProject(projId) | Epics for a project |
| getUserStoriesByEpic(epicId) | Stories for an epic |
| getAssignmentsByEpic(epicId) | Assignments for an epic |
| getRisksByProject(projId) | Risks for a project |
| getDependenciesByRisk(riskId) | Dependencies for a risk |
| getResourceWorkload(resId) | All assignments for a resource |
| getLookupName(table, id) | Resolve lookup ID to display name |

---

## 5. UI Requirements

### 5.1 Navigation
- Tab-based navigation across 8 modules
- Active tab visually highlighted
- Tab switching triggers async view rendering via switchTab()

### 5.2 Dashboard Layout
Each dashboard follows the same template:
1. Header: Module title + New record button
2. Stats Row: 3-4 summary cards (total, active, breakdowns)
3. Filter Area: placeholder for future extensions
4. Data Table: columns with action buttons (Edit, Delete, View)

### 5.3 Modal System
- Single shared modal component (Components.modal)
- Opens for create, edit, and view-detail actions
- Supports dynamic form fields, extraContent, save/cancel/delete
- Delete requires browser confirm() before executing

### 5.4 Badge System
| Status Values | Badge Color |
|---------------|-------------|
| Active, Approved, Completed, Linked, New, Green (G) | Green |
| In Progress, Prioritized, Pending, On Leave, Amber (A) | Amber |
| Inactive, Rejected, On Hold, Critical, Red (R), Not Started | Red |
| Medium, N/A | Gray |
| Other values | Blue (default) |

### 5.5 Toast Notifications
- Auto-dismiss after 3 seconds
- Used for success after create/update/delete

### 5.6 Responsive Design
- CSS grid for stats row, flexbox for nav/modal
- Horizontal scroll on tables for small screens
- CSS custom properties for consistent theming

---

## 6. Non-Functional Requirements

### 6.1 Performance
- No server roundtrips in DEV mode (pure localStorage)
- Client-side rendering only - no SSR
- Async/await for all data operations (ready for PROD API calls)

### 6.2 Security
- DEV mode: data stored in browser only; no network calls
- PROD mode: authentication via Power Apps platform (Dataverse security roles)

### 6.3 Compatibility
- Browsers: Chrome 80+, Edge 80+, Firefox 75+, Safari 13+
- Platform: Windows, macOS, Linux

### 6.4 Maintainability
- Clear separation: models, data, components, views, app init
- models.js is single source of truth for field definitions
- UI components in components.js with static methods
- Tab views as methods on the Views class

### 6.5 Extensibility
New entities added by:
1. Adding schema to MODELS in models.js
2. Adding a dashboard view method in views.js
3. Adding a tab in app.js
4. Optionally adding seed data in seed-data.js

---

## 7. DEV to PROD Migration Requirements

### 7.1 Prerequisites
1. GitHub repository with all source files
2. Access to company laptop with Power Apps environment
3. Power Apps maker permissions (create tables + web resources)

### 7.2 Dataverse Tables
Create 12 tables matching docs/TABLES-DATAVERSE.md:
- All columns use pm_ prefix
- Lookup columns reference corresponding parent table
- Choice columns have exact option sets as defined

### 7.3 Web Resources to Upload

| # | File | Type | Notes |
|---|------|------|-------|
| 1 | index.html | HTML Web Resource | Entry point |
| 2 | styles.css | CSS Web Resource | All styling |
| 3 | models.js | JavaScript Web Resource | Entity schemas |
| 4 | data.js | JavaScript Web Resource | After setting MODE to PROD |
| 5 | components.js | JavaScript Web Resource | UI components |
| 6 | views.js | JavaScript Web Resource | Dashboard views |
| 7 | app.js | JavaScript Web Resource | App init |

Excluded: seed-data.js is DEV-only and MUST NOT be uploaded.

### 7.4 Mode Switch
In data.js, change MODE from DEV to PROD. Re-upload after change.

### 7.5 Data Migration (Initial Seeding)
seed-data.js does NOT work in PROD mode. Use one of:
- Dataflows (Power Query) to import CSV data
- Excel Online import via Power Apps
- Manual entry for small datasets
- Custom Power Automate flow for bulk insert

Reference docs/SEED-DATA.md for the mock data structure.

---

## 8. Testing Requirements

### 8.1 DEV Mode Testing
- Open index.html in browser
- Verify all 8 tabs render with seed data
- Test CRUD on each entity: create new, edit, delete
- Test capability-product linking (checkboxes in modal)
- Test requirement capability-product filtered dropdown
- Test epic detail view (user stories + assignments)
- Test toast notifications appear and auto-dismiss
- Clear localStorage and reload to verify re-seeding

### 8.2 PROD Mode Testing
- Upload all 7 web resources to Power Apps
- Verify data.js is set to MODE: PROD
- Add to Model-Driven App sitemap
- Test CRUD operations against Dataverse tables
- Verify lookup fields resolve correctly
- Verify choice fields display correct options

---

## 9. Glossary

| Term | Definition |
|------|------------|
| PSC | Project Steering Committee - governance body that approves requirements |
| RAG | Red / Amber / Green - visual status indicator for epics |
| RAID | Risks, Assumptions, Issues, Dependencies - risk management framework |
| N:N | Many-to-Many relationship (e.g., Capabilities <-> Products) |
| BA | Business Analyst |
| PO | Product Owner |
| DL | Delivery Lead |
| BAU | Business As Usual |
| IIFE | Immediately Invoked Function Expression - JS pattern used in seed-data.js |
| SPA | Single Page Application |
| CRUD | Create, Read, Update, Delete |

---

## 10. References

- [README.md](../README.md) — Quick start and overview
- [TABLES-DATAVERSE.md](TABLES-DATAVERSE.md) — Dataverse table creation specifications
- [DEPLOY-GUIDE.md](DEPLOY-GUIDE.md) — Step-by-step Power Apps migration instructions
- [SEED-DATA.md](SEED-DATA.md) — Human-readable seed data reference (DEV only)
- [models.js](../models.js) — Complete entity schemas with field definitions
- [data.js](../data.js) — DataService implementation
