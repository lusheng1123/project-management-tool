# Deployment Guide — Project Management Tool

This guide covers migrating from local DEV (localStorage) to PROD (Dataverse + Power Apps Web Resource).

---

## Prerequisites

| Item | Personal Laptop | Company Laptop |
|---|---|---|
| Git | ✅ Required | ✅ Required |
| GitHub account | ✅ Required | ✅ Required |
| Power Apps license | ❌ | ✅ Required |
| Dataverse environment | ❌ | ✅ Required |
| Browser | ✅ Chrome/Edge/Firefox | ✅ Chrome/Edge |

---

## Step 1: Push to GitHub (Personal Laptop)

```bash
cd ~/project-management-tool
git init
git add .
git commit -m "Initial commit: Project Management Tool v1.0"
git remote add origin https://github.com/YOUR_USERNAME/project-management-tool.git
git branch -M main
git push -u origin main
```

---

## Step 2: Clone on Company Laptop

```bash
cd ~/Downloads
git clone https://github.com/YOUR_USERNAME/project-management-tool.git
cd project-management-tool
```

---

## Step 3: Create Dataverse Tables

Open [Power Apps Maker Portal](https://make.powerapps.com/) and create **12 tables** following the specifications in `docs/TABLES-DATAVERSE.md`.

### Quick Table Creation Order

1. **pm_resource** — (has self-referencing manager lookup)
2. **pm_capability** — (lookup to resource)
3. **pm_product** — (standalone)
4. **pm_capabilityproduct** — (lookups to capability + product)
5. **pm_project** — (lookups to resource)
6. **pm_requirement** — (lookups to capability, product, project, resource)
7. **pm_control** — (lookups to project, resource)
8. **pm_epic** — (lookup to project)
9. **pm_userstory** — (lookup to epic)
10. **pm_assignment** — (lookups to resource, epic)
11. **pm_risk** — (lookups to project, resource)
12. **pm_dependency** — (lookups to risk x2)

### For Choice Columns

For every `Choice` field, create a **local choice** (not global) in each table:

| Table | Choice Field | Options |
|---|---|---|
| pm_resource | pm_role | Developer, Architect, PM, QA, Designer, DevOps, Other |
| pm_product | pm_status | Active, In Development, Retired, Planning |
| pm_requirement | pm_priority | Must Have, Should Have, Could Have, Won't Have |
| pm_requirement | pm_status | Draft, Submitted, Approved, Rejected, In Progress, Done |
| pm_requirement | pm_pscstatus | Pending, Approved, Rejected |
| pm_project | pm_status | Not Started, In Progress, On Hold, Completed, Cancelled |
| pm_control | pm_type | Gate, Review, Audit, Checklist, Sign-off |
| pm_control | pm_status | Planned, In Progress, Passed, Failed, Waived |
| pm_epic | pm_status | Not Started, In Progress, Done, Blocked |
| pm_epic | pm_ragstatus | Green, Amber, Red |
| pm_userstory | pm_status | To Do, In Progress, Review, Done |
| pm_risk | pm_probability | Low, Medium, High, Critical |
| pm_risk | pm_impact | Low, Medium, High, Critical |
| pm_risk | pm_status | Identified, Mitigating, Realized, Closed |
| pm_dependency | pm_type | Blocks, Depends On, Related To |
| pm_dependency | pm_status | Active, Resolved, Mitigated |

---

## Step 4: Upload Web Resources

> **DO NOT upload seed-data.js.** This file is DEV-only. It populates localStorage with mock data. In PROD mode, all data comes from Dataverse. See docs/SEED-DATA.md for the mock data reference.

In Power Apps Maker Portal, go to **Solutions** → Create or open a solution → **New** → **Web Resource**.

Upload these **7 files** as Web Resources:

| File | Type | Name |
|---|---|---|
| `models.js` | JavaScript | `pm_/models.js` |
| `data.js` | JavaScript | `pm_/data.js` |
| `components.js` | JavaScript | `pm_/components.js` |
| `views.js` | JavaScript | `pm_/views.js` |
| `app.js` | JavaScript | `pm_/app.js` |
| `styles.css` | CSS | `pm_/styles.css` |
| `index.html` | HTML | `pm_/index.html` |

> Use a consistent prefix like `pm_/` to organize all web resources.

---

## Step 5: Switch to PROD Mode

Edit `data.js` and change:

```javascript
const APP_CONFIG = {
    MODE: 'PROD',  // << Change from 'DEV' to 'PROD'
    // ...
};
```

Re-upload `data.js` as a web resource with the updated content.

---

## Step 6: Add to Model-Driven App

1. Open your Model-Driven App in Power Apps
2. Add a **Site Map** entry pointing to `pm_/index.html` as a custom page / web resource
3. Publish the app

---

## Step 7: Test

1. Open the Model-Driven App
2. Navigate to the Project Management Tool
3. You should see the mode badge show **PROD**
4. Create, read, update, and delete records — all operations should hit Dataverse via `Xrm.WebApi`

---

## Troubleshooting

| Issue | Solution |
|---|---|
| "Xrm is not defined" | Ensure the web resource is loaded inside a Power Apps form/page context |
| "404 on WebApi calls" | Verify Dataverse table schema names match exactly (`pm_resource`, etc.) |
| Choice values don't work | Dataverse choice values must match the integer value, not the label. Update `data.js` PROD methods to use integer values if needed |
| Web resource not loading | Check the web resource URL and ensure it's in the same solution as the app |

---

## Optional: Remove Seed Data

In PROD mode, the app won't seed data (seed only runs in DEV). If you want initial data in Dataverse, import it manually or use Dataflows.

---

## Notes

- All `Xrm.WebApi` CRUD methods are already implemented in `data.js`
- The app is fully functional in DEV mode — test everything locally before migration
- The migration path is designed for zero-code changes beyond flipping `MODE`
