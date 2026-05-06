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

The application requires **zero dependencies**, **no npm**, **no build step**, and **no external CDN imports**. It runs by opening `index.html` in any modern browser.

---

## 2. Functional Requirements

### 2.1 Modules

The tool supports **8 modules** (dashboards):

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

All 12 entities support full Create, Read, Update, Delete operations:

- **Create:** Modal forms generated dynamically from field definitions in `models.js`
- **Read:** Tabular dashboards with column rendering, badges, and stats cards
- **Update:** Inline editing via the same modal system with pre-filled data
- **Delete:** Confirmation prompt before removal

### 2.3 Cross-Cutting Features

| Feature | Description |
|---------|-------------|
| Dynamic Modals | Generated from field definitions; supports text, number, date, email, choice, multiline, lookup field types |
| Filtered Dropdowns | Products filtered by selected capability; resources filtered by department |
| Many-to-Many Linking | Capabilities <-> Products via pm_capabilityproduct link table with checkbox UI |
| RAG Status Visualization | Green/Amber/Red badges on epics based on pm_ragstatus field |
| Stats Dashboard | Summary cards per module (total count, status breakdowns) |
| Toast Notifications | Success/error messages after create/update/delete |
| Responsive Design | CSS grid/flexbox layout; works on desktop and tablet |

### 2.4 PSC Approval Workflow (Requirements)

- Requirements can be flagged for PSC approval (pm_pscapprovalrequired: Yes/No)
- PSC approval status tracked: Pending, Approved, Rejected, N/A
- Dedicated stats on the Requirements dashboard for PSC-related counts

---

## 3. Data Model

### 3.1 Entity List

| # | Table Name | Display Name | Seed Count | Key Relationships |
|---|-----------|--------------|------------|-------------------|
| 1 | pm_resource | Resource | 30 | has many assignments, referenced by projects/epics/requirements |
| 2 | pm_capability | Capability | 8 | has many capability-product links, has many requirements |
| 3 | pm_product | Product | 10 | has many capability-product links, requirements, projects |
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

All fields use `pm_` prefix convention. See `models.js` for the complete JavaScript schema, or `docs/TABLES-DATAVERSE.md` for Dataverse-ready column specifications.

**Field Types:**

| Type | Input | Description |
|------|-------|-------------|
| text | text input | Single-line text |
| multiline | textarea | Multi-line text |
| choice | select dropdown | Predefined options |
| lookup | text input | Foreign key reference stored as text ID |
| number | number input | Numeric with optional min/max/step |
| date | date picker | Date value |
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

- **DEV mode:** Client-side pattern `{table}_{timestamp}_{random5}`
- **PROD mode:** Dataverse auto-generates GUIDs
