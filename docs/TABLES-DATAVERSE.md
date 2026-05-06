# Dataverse Table Specifications

This document maps each of the 12 entities from `models.js` to Dataverse tables. Use these specifications when creating tables in Power Apps.

---

## 1. pm_resource (Resource)

| Display Name | Schema Name | Type | Required | Choices / Notes |
|---|---|---|---|---|
| Resource ID | pm_resourceid | Primary Key (GUID) | Auto | |
| Name | pm_name | Single Line of Text (150) | Yes | |
| Email | pm_email | Email (100) | No | |
| Role | pm_role | Choice | Yes | Developer, Architect, PM, QA, Designer, DevOps, Other |
| Manager | pm_manager | Lookup → pm_resource | No | Self-referencing lookup |
| Avatar Initials | pm_avatarinitials | Single Line of Text (10) | No | |

---

## 2. pm_capability (Capability)

| Display Name | Schema Name | Type | Required | Choices / Notes |
|---|---|---|---|---|
| Capability ID | pm_capabilityid | Primary Key (GUID) | Auto | |
| Name | pm_name | Single Line of Text (200) | Yes | |
| Description | pm_description | Multiple Lines of Text (2000) | No | |
| Owner | pm_owner | Lookup → pm_resource | Yes | |

---

## 3. pm_product (Product)

| Display Name | Schema Name | Type | Required | Choices / Notes |
|---|---|---|---|---|
| Product ID | pm_productid | Primary Key (GUID) | Auto | |
| Name | pm_name | Single Line of Text (200) | Yes | |
| Description | pm_description | Multiple Lines of Text (2000) | No | |
| Status | pm_status | Choice | Yes | Active, In Development, Retired, Planning |

---

## 4. pm_capabilityproduct (Capability-Product Link — N:N)

| Display Name | Schema Name | Type | Required | Choices / Notes |
|---|---|---|---|---|
| Capability Product ID | pm_capabilityproductid | Primary Key (GUID) | Auto | |
| Capability | pm_capability | Lookup → pm_capability | Yes | |
| Product | pm_product | Lookup → pm_product | Yes | |

> **Note:** This is a manual N:N link table. In Dataverse, you could also use a native N:N relationship, but a manual table gives more control.

---

## 5. pm_requirement (Requirement)

| Display Name | Schema Name | Type | Required | Choices / Notes |
|---|---|---|---|---|
| Requirement ID | pm_requirementid | Primary Key (GUID) | Auto | |
| Title | pm_title | Single Line of Text (300) | Yes | |
| Description | pm_description | Multiple Lines of Text (4000) | No | |
| Capability | pm_capability | Lookup → pm_capability | Yes | |
| Product | pm_product | Lookup → pm_product | No | Filtered by capability |
| Priority | pm_priority | Choice | Yes | Must Have, Should Have, Could Have, Won't Have |
| Status | pm_status | Choice | Yes | Draft, Submitted, Approved, Rejected, In Progress, Done |
| PSC Approver | pm_pscapprover | Lookup → pm_resource | No | |
| PSC Approval Date | pm_pscapprovaldate | Date Only | No | |
| PSC Status | pm_pscstatus | Choice | No | Pending, Approved, Rejected |
| PSC Comments | pm_psccomments | Multiple Lines of Text (2000) | No | |
| Project | pm_project | Lookup → pm_project | No | |

---

## 6. pm_project (Project)

| Display Name | Schema Name | Type | Required | Choices / Notes |
|---|---|---|---|---|
| Project ID | pm_projectid | Primary Key (GUID) | Auto | |
| Name | pm_name | Single Line of Text (200) | Yes | |
| Description | pm_description | Multiple Lines of Text (4000) | No | |
| Start Date | pm_startdate | Date Only | No | |
| End Date | pm_enddate | Date Only | No | |
| Status | pm_status | Choice | Yes | Not Started, In Progress, On Hold, Completed, Cancelled |
| Project Manager | pm_projectmanager | Lookup → pm_resource | Yes | |
| Lead Developer | pm_leaddeveloper | Lookup → pm_resource | No | |

---

## 7. pm_control (Control / Governance)

| Display Name | Schema Name | Type | Required | Choices / Notes |
|---|---|---|---|---|
| Control ID | pm_controlid | Primary Key (GUID) | Auto | |
| Name | pm_name | Single Line of Text (200) | Yes | |
| Description | pm_description | Multiple Lines of Text (2000) | No | |
| Type | pm_type | Choice | Yes | Gate, Review, Audit, Checklist, Sign-off |
| Status | pm_status | Choice | Yes | Planned, In Progress, Passed, Failed, Waived |
| Project | pm_project | Lookup → pm_project | Yes | |
| Responsible | pm_responsible | Lookup → pm_resource | Yes | |

---

## 8. pm_epic (Epic)

| Display Name | Schema Name | Type | Required | Choices / Notes |
|---|---|---|---|---|
| Epic ID | pm_epicid | Primary Key (GUID) | Auto | |
| Name | pm_name | Single Line of Text (300) | Yes | |
| Description | pm_description | Multiple Lines of Text (4000) | No | |
| Project | pm_project | Lookup → pm_project | Yes | |
| Status | pm_status | Choice | Yes | Not Started, In Progress, Done, Blocked |
| RAG Status | pm_ragstatus | Choice | Yes | Green, Amber, Red |
| Target Date | pm_targetdate | Date Only | No | |

---

## 9. pm_userstory (User Story)

| Display Name | Schema Name | Type | Required | Choices / Notes |
|---|---|---|---|---|
| User Story ID | pm_userstoryid | Primary Key (GUID) | Auto | |
| Title | pm_title | Single Line of Text (300) | Yes | |
| Description | pm_description | Multiple Lines of Text (4000) | No | |
| Epic | pm_epic | Lookup → pm_epic | Yes | |
| Status | pm_status | Choice | Yes | To Do, In Progress, Review, Done |
| Story Points | pm_storypoints | Whole Number | No | |
| Acceptance Criteria | pm_acceptancecriteria | Multiple Lines of Text (4000) | No | |

---

## 10. pm_assignment (Assignment)

| Display Name | Schema Name | Type | Required | Choices / Notes |
|---|---|---|---|---|
| Assignment ID | pm_assignmentid | Primary Key (GUID) | Auto | |
| Resource | pm_resource | Lookup → pm_resource | Yes | |
| Epic | pm_epic | Lookup → pm_epic | Yes | |
| Role | pm_role | Single Line of Text (100) | No | |
| Allocation % | pm_allocationpct | Whole Number (0-100) | No | |

---

## 11. pm_risk (Risk)

| Display Name | Schema Name | Type | Required | Choices / Notes |
|---|---|---|---|---|
| Risk ID | pm_riskid | Primary Key (GUID) | Auto | |
| Title | pm_title | Single Line of Text (300) | Yes | |
| Description | pm_description | Multiple Lines of Text (4000) | No | |
| Project | pm_project | Lookup → pm_project | Yes | |
| Probability | pm_probability | Choice | Yes | Low, Medium, High, Critical |
| Impact | pm_impact | Choice | Yes | Low, Medium, High, Critical |
| Status | pm_status | Choice | Yes | Identified, Mitigating, Realized, Closed |
| Mitigation | pm_mitigation | Multiple Lines of Text (4000) | No | |
| Owner | pm_owner | Lookup → pm_resource | Yes | |

---

## 12. pm_dependency (Dependency)

| Display Name | Schema Name | Type | Required | Choices / Notes |
|---|---|---|---|---|
| Dependency ID | pm_dependencyid | Primary Key (GUID) | Auto | |
| Name | pm_name | Single Line of Text (200) | Yes | |
| Description | pm_description | Multiple Lines of Text (2000) | No | |
| From Risk | pm_fromrisk | Lookup → pm_risk | Yes | |
| To Risk | pm_torisk | Lookup → pm_risk | No | |
| Type | pm_type | Choice | Yes | Blocks, Depends On, Related To |
| Status | pm_status | Choice | Yes | Active, Resolved, Mitigated |

---

## Relationships Summary

| Parent | Child | Via |
|---|---|---|
| pm_resource | pm_assignment | pm_epic |
| pm_resource | pm_capability | Owner field |
| pm_resource | pm_project | PM / Lead Dev fields |
| pm_resource | pm_risk | Owner field |
| pm_resource | pm_requirement | PSC Approver field |
| pm_capability | pm_capabilityproduct | Capability lookup |
| pm_product | pm_capabilityproduct | Product lookup |
| pm_capability | pm_requirement | Capability lookup |
| pm_project | pm_requirement | Project lookup |
| pm_project | pm_control | Project lookup |
| pm_project | pm_epic | Project lookup |
| pm_project | pm_risk | Project lookup |
| pm_epic | pm_userstory | Epic lookup |
| pm_epic | pm_assignment | Epic lookup |
| pm_risk | pm_dependency | From/To Risk lookups |

---

> These specs are ready for Power Apps Dataverse table creation. Create each table with these exact schema names and column names.
