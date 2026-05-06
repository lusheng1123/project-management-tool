# Seed Data Reference — DEV Mode Only

> **This file documents the mock data used during local development.**
> **This data is NEVER included in PROD migrations to Dataverse.**
> **The file `seed-data.js` is excluded from Power Apps web resource uploads.**

---

## Purpose

The file seed-data.js populates localStorage with realistic banking portfolio data for development and testing. It only runs when the flag pm_seeded is absent. Once seeded, it skips on subsequent page loads.

---

## Summary

| Table | Records | Description |
|-------|---------|-------------|
| pm_resource | 30 | 30 team members across IT and Business departments |
| pm_capability | 8 | 8 banking business capabilities |
| pm_product | 10 | 10 banking products with governance statuses |
| pm_capabilityproduct | 14 | 14 many-to-many capability-product links |
| pm_requirement | 20 | 20 business requirements with PSC approval tracking |
| pm_project | 12 | 12 projects across 5-stage pipeline (Onboarding → Live) |
| pm_control | 8 | 8 regulatory and compliance controls |
| pm_epic | 10 | 10 epics with RAG status and Jira links |
| pm_userstory | 15 | 15 user stories with acceptance criteria |
| pm_assignment | 20 | 20 resource-to-epic assignments |
| pm_risk | 8 | 8 project risks with impact descriptions |
| pm_dependency | 10 | 10 external dependencies linked to risks |

---

## Resources (30)

| Name | Role | Department | Team | Cost/Day | Status |
|------|------|-----------|------|----------|--------|
| Alice Tan | Product Owner | Business | Business | $5,500 | Active |
| Bob Lim | Senior Developer | IT | Delta | $4,800 | Active |
| Carol Ng | Business Analyst | Business | Business | $4,200 | Active |
| David Chen | IT BA | IT | Gamma | $4,000 | On Leave |
| Eve Wong | Delivery Lead | IT | Delta | $5,200 | Active |
| Frank Liu | Developer | IT | Alpha | $3,800 | Active |
| Grace Ho | Connecto PO | Business | Business | $5,000 | Active |
| Henry Tay | IT Lead | IT | Delta | $6,000 | Active |
| Irene Lee | QA Lead | IT | Gamma | $4,400 | Active |
| Jack Tan | Developer | IT | Alpha | $3,700 | Active |
| Karen Lim | Architect | IT | Delta | $6,500 | Active |
| Leo Wong | Developer | IT | Alpha | $3,500 | Active |
| Maya Singh | Business Analyst | Business | Business | $4,100 | Active |
| Nick Goh | DevOps | IT | Platform | $4,600 | Active |
| Olivia Chan | Product Owner | Business | Business | $5,300 | Active |
| Pete Ng | Developer | IT | Alpha | $3,400 | Active |
| Queenie Teo | UX Designer | IT | Beta | $4,300 | Active |
| Raj Kumar | Senior Developer | IT | Beta | $5,000 | Active |
| Sara Liew | Scrum Master | IT | Gamma | $4,700 | Active |
| Tom Phua | Developer | IT | Beta | $3,600 | Active |
| Uma Devi | QA Engineer | IT | Gamma | $3,900 | Active |
| Victor Ang | Security Lead | IT | Delta | $6,200 | Active |
| Wendy Koh | Compliance Officer | Business | Business | $4,500 | Active |
| Xander Chua | Developer | IT | Beta | $3,300 | Active |
| Yuki Tanaka | Data Analyst | IT | Platform | $4,200 | Active |
| Zack Hamzah | Developer | IT | Beta | $3,200 | Active |
| Amy Yeo | Business Analyst | Business | Business | $4,000 | Active |
| Ben Kwan | DevOps | IT | Platform | $4,500 | On Leave |
| Cindy Fang | QA Engineer | IT | Gamma | $3,800 | Active |
| Danial Rauf | Architect | IT | Delta | $6,700 | Active |

## Capabilities (8)

| Capability | Description |
|-----------|-------------|
| Trade Finance | Trade finance processing, LC documentation, and document management. |
| Payments & Transfers | Cross-border payments, SWIFT messaging, and real-time payment processing. |
| Customer Onboarding | Digital onboarding, KYC/AML checks, and account opening workflows. |
| Regulatory Reporting | MAS, HKMA regulatory reporting with automated submission. |
| Fraud Detection | Real-time fraud monitoring and transaction risk scoring engine. |
| Wealth Management | Portfolio management and robo-advisor platform capabilities. |
| Lending & Credit | Loan origination, credit assessment, and disbursement workflows. |
| Customer Service | Omni-channel support, chatbot, and case management. |

## Products (10)

| Product | Journey | Short | Governance | Contact | Start | Target |
|---------|---------|-------|-----------|---------|-------|--------|
| TradeFlow Pro | Trade Finance | TFP | Approved | Alice Tan | 2024-06-01 | 2025-06-30 |
| PayGate | Payments | PG | Approved | Grace Ho | 2024-09-01 | 2025-08-15 |
| Onboard360 | Onboarding | OB360 | Pending | Carol Ng | 2025-03-01 | 2025-09-30 |
| RegReport | Regulatory | RR | Approved | Wendy Koh | 2024-01-01 | 2025-05-30 |
| SwiftConnect | Payments | SC | Approved | Grace Ho | 2024-07-01 | 2025-07-31 |
| FraudShield | Fraud Detection | FS | Approved | Victor Ang | 2025-04-01 | 2025-10-31 |
| WealthWise | Wealth | WW | Pending | Olivia Chan | 2025-05-01 | 2025-12-15 |
| CreditEase | Lending | CE | Approved | Alice Tan | 2024-10-01 | 2025-11-30 |
| SupportHub | Customer Service | SH | Approved | Maya Singh | 2024-03-01 | 2025-04-30 |
| RegInsight | Regulatory | RI | N/A | Wendy Koh | 2025-01-01 | 2025-09-30 |

## Projects (12)

| Project | Product | Status | Effort | Complete | Priority | Quarter |
|---------|---------|--------|--------|----------|----------|--------|
| TradeFlow v2.0 Redesign | TradeFlow Pro | Live | 180d | 100% | High | 2024/Q3 |
| Payment Gateway Upgrade | PayGate | Review | 120d | 85% | Medium | 2025/Q2 |
| Onboarding Digitalization | Onboard360 | Dev Phase 2 | 220d | 60% | Critical | 2025/Q3 |
| Fraud Detection Engine v1 | FraudShield | Dev Phase 1 | 250d | 35% | Critical | 2025/Q4 |
| WealthWise Mobile App | WealthWise | Dev Phase 1 | 300d | 20% | High | 2026/Q1 |
| MAS 610 Regulatory Reporting | RegReport | Live | 90d | 100% | High | 2024/Q4 |
| TradeFlow Mobile App | TradeFlow Pro | Onboarding | 160d | 15% | High | 2026/Q2 |
| Real-time Payment Engine | PayGate | Review | 140d | 88% | Critical | 2026/Q1 |
| Credit Scoring AI | CreditEase | Dev Phase 1 | 200d | 28% | High | 2026/Q2 |
| AI Chatbot v2 | SupportHub | Dev Phase 2 | 170d | 72% | Medium | 2026/Q1 |
| Blockchain Settlement Network | SwiftConnect | Onboarding | 280d | 5% | Critical | 2026/Q2 |
| Automated Compliance Engine | RegInsight | Dev Phase 1 | 190d | 22% | High | 2026/Q2 |

## Requirements (20) — with PSC approval tracking

| ID | Detail (summary) | Capability | Product | Project | Status | PSC Req | PSC |
|----|-----------------|-----------|---------|---------|--------|---------|-----|
| req_1 | LC document OCR with 95%+ accuracy | Trade Finance | TradeFlow Pro | TradeFlow v2.0 | Linked | Yes | Approved |
| req_2 | ISO 20022 SWIFT MX with MT backward compat | Payments | PayGate | Payment Gateway | Linked | Yes | Pending |
| req_3 | KYC provider integration (Refinitiv) | Onboarding | Onboard360 | Onboarding Digital. | Prioritized | Yes | Pending |
| req_4 | Real-time trade ops dashboard | Trade Finance | TradeFlow Pro | TradeFlow v2.0 | Linked | No | N/A |
| req_5 | Multi-currency FX aggregation | Payments | SwiftConnect | Payment Gateway | Linked | Yes | Approved |
| req_6 | MAS 610 report automation | Regulatory | RegReport | MAS 610 | Linked | Yes | Approved |
| req_7 | ML-based fraud scoring engine | Fraud Detection | FraudShield | Fraud Detection | Prioritized | Yes | Pending |
| req_8 | Facial recognition liveness detection | Onboarding | Onboard360 | Onboarding Digital. | Prioritized | Yes | Pending |
| req_9 | Portfolio dashboard with analytics | Wealth | WealthWise | WealthWise Mobile | New | No | N/A |
| req_10 | API gateway OAuth 2.0 rate limiting | Trade Finance | TradeFlow Pro | TradeFlow v2.0 | Linked | Yes | Approved |
| req_11 | Credit assessment with bureau integration | Lending | CreditEase | — | New | Yes | Pending |
| req_12 | Omni-channel chatbot NLP | Customer Service | SupportHub | — | New | No | N/A |
| req_13 | Anomaly detection with auto case creation | Fraud Detection | FraudShield | Fraud Detection | Prioritized | Yes | Pending |
| req_14 | Robo-advisory goal-based recommendations | Wealth | WealthWise | WealthWise Mobile | New | Yes | Pending |
| req_15 | Dual-approval high-value transactions | Payments | PayGate | Payment Gateway | Linked | No | N/A |
| req_16 | Loan origination workflow | Lending | CreditEase | — | New | No | N/A |
| req_17 | Case management SLA tracking | Customer Service | SupportHub | — | New | No | N/A |
| req_18 | Regulatory change impact analysis | Regulatory | RegInsight | — | New | Yes | Pending |
| req_19 | Sanction screening OFAC/UN/lists | Payments | FraudShield | Fraud Detection | Prioritized | Yes | Pending |
| req_20 | Document management version control | Trade Finance | TradeFlow Pro | TradeFlow v2.0 | Linked | No | N/A |

## Epics (10)

| Epic | Project | Effort | RAG | Developers |
|------|---------|--------|-----|-----------|
| LC Document OCR Processing | TradeFlow v2.0 | 40d | Green | Bob Lim, Frank Liu |
| SWIFT ISO 20022 Migration | Payment Gateway | 55d | Amber | Bob Lim, Raj Kumar |
| e-KYC Integration Module | Onboarding Digital. | 60d | Green | Frank Liu, Jack Tan |
| Trade Dashboard Analytics | TradeFlow v2.0 | 30d | Green | Frank Liu, Leo Wong |
| ML Fraud Scoring Engine | Fraud Detection | 80d | Green | Raj Kumar, Pete Ng |
| MAS 610 Report Automation | MAS 610 | 35d | Amber | Tom Phua, Xander Chua |
| Multi-Currency Payment Engine | Payment Gateway | 45d | Green | Bob Lim, Jack Tan |
| Biometric Verification | Onboarding Digital. | 50d | Red | Frank Liu, Pete Ng |
| Portfolio Management Dashboard | WealthWise Mobile | 70d | Green | Leo Wong, Xander Chua |
| API Gateway Security | TradeFlow v2.0 | 25d | Green | Bob Lim |

## Risks (8)

| Risk | Project |
|------|---------|
| OCR accuracy below 95% for handwritten LCs | TradeFlow v2.0 |
| SWIFT ISO 20022 migration delayed by regulations | Payment Gateway |
| KYC provider API downtime during peak hours | Onboarding Digital. |
| ML fraud model false positive rate too high | Fraud Detection |
| Biometric vendor fails liveness certification | Onboarding Digital. |
| MAS 610 reporting schema changes mid-project | MAS 610 |
| WealthWise pen test reveals critical vulnerabilities | WealthWise Mobile |
| Bob Lim single point of failure for multiple epics | Payment Gateway |

## Dependencies (10)

| Dependency | Linked Risk |
|-----------|-------------|
| OCR engine v4.2 upgrade from Abbyy | OCR accuracy below 95% |
| SWIFT CBPR+ standards finalization | SWIFT migration delayed |
| KYC provider SLA upgrade to 99.9% | KYC provider downtime |
| Training dataset from Fraud Ops (50k records) | ML false positive rate |
| ISO 30107 certification from Jumio | Biometric vendor certification |
| MAS 610 schema consultation outcome | MAS 610 schema changes |
| Penetration testing report (TrustWave) | WealthWise pen test |
| Cross-training for SWIFT dev skills | Bob Lim single point of failure |
| Abbyy OCR training data from Ops (10k samples) | OCR accuracy below 95% |
| MAS 610 validation rules from Compliance | MAS 610 schema changes |

---

## How Seeding Works

1. seed-data.js loads before data.js, views.js, and app.js
2. It checks localStorage for pm_seeded flag — if set, exits immediately
3. If not seeded, writes all 12 tables to localStorage and sets the flag
4. In PROD mode, seed-data.js is NOT uploaded; DataService uses Xrm.WebApi

## Migration Exclusion

When migrating to Power Apps:

- DO NOT upload seed-data.js as a web resource
- DO NOT include seed-data.js in the PROD index.html
- Only 7 core files are needed: models.js, data.js, components.js, views.js, app.js, styles.css, index.html
- Use Dataflows or CSV import for initial Dataverse data

## localStorage Keys Created

| Key | Records |
|-----|--------|
| pm_resource | 30 |
| pm_capability | 8 |
| pm_product | 10 |
| pm_capabilityproduct | 14 |
| pm_requirement | 20 |
| pm_project | 6 |
| pm_control | 8 |
| pm_epic | 10 |
| pm_userstory | 15 |
| pm_assignment | 20 |
| pm_risk | 8 |
| pm_dependency | 10 |
| pm_seeded | (flag) |

---

## Notes

- Realistic banking PM portfolio with cross-linked entities
- Readable IDs: r1, cap_1, prod_1, proj_1, epic_1, req_1, risk_1, dep_1, ctrl_1, story_1, asgn_1, cp_1
- Dates in YYYY-MM-DD format
- PSC approval on requirements where pm_pscapprovalrequired = Yes

---

Generated by seed-data.js — DEV mode only

Last updated: 2025-04-09