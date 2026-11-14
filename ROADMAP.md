# CyberGuard — Development Roadmap

**Status:** Planned · **Scope:** Open-source defensive security operations platform for synthetic data  
**Architecture:** Next.js / TypeScript, FastAPI / Python, PostgreSQL, Redis / Celery, Docker Compose  
**Product specification:** [`docs/cyberguard-spec.md`](docs/cyberguard-spec.md)

CyberGuard is an educational, multi-user security operations and incident management platform. Its first product version uses **one shared environment** with Administrator and Security Analyst roles. Multi-organization support is a later, explicitly scoped expansion. All telemetry and infrastructure represented by the platform must be synthetic; live third-party collection, offensive capabilities, and processing of real personal or regulated security data are outside project scope.

This roadmap describes **planned capabilities, not features already implemented**. Goal identifiers are stable references for design discussions, issues, pull requests, and release notes. Sequence and scope may change based on implementation findings; a goal is complete only when its documented acceptance criteria are verified.

## Phase 0 — Project foundation

**Purpose:** Establish a reproducible development environment and maintainable project structure before implementing product features.

**Deliverables:** Product specification, this roadmap, public repository and MIT license, README and contributor setup instructions, minimal FastAPI health endpoint, minimal Next.js application shell and API connectivity, PostgreSQL and Redis services, Alembic baseline, Docker Compose, environment-variable templates, starter automated tests, and CI.

**Exit criteria:** A contributor can clone and start the stack; frontend and API respond; database migrations apply on a clean instance; basic checks pass; repository history and configuration contain no committed secrets or real-world security datasets. **Authentication, full RBAC, ingestion, detections, alerts, incidents, and tenant isolation are not part of Phase 0.**

---

## Phase 1 — Identity, access, and application foundations

### CG-001 — Secure account lifecycle and authentication
**Scope:** Build administrator-controlled account provisioning, login/logout, session management, password reset, account disabling, and secure credential storage. Include browser integration and predictable authentication error handling.  
**Acceptance:** Protected API endpoints reject unauthenticated requests; sessions expire and revoke correctly; account lifecycle flows work end-to-end; tests cover invalid credentials, disabled users, and session misuse.

### CG-002 — Role-aware application experience and authorization
**Scope:** Implement Administrator and Security Analyst permissions across API services, navigation, route guards, and shared UI components. Establish reusable permission checks and authorization test fixtures.  
**Acceptance:** Unauthorized operations fail at the API even when called directly; role-appropriate views are available; role changes take effect predictably; an authorization test matrix passes.

### CG-003 — User administration and security controls
**Scope:** Add user search, invitation/provisioning workflows, account state management, role assignment, session visibility, and administrative audit events. Provide operationally useful validation and safeguards.  
**Acceptance:** Administrators manage users through the UI; analysts cannot change user privileges; critical account changes are auditable; lifecycle and concurrency edge cases are tested.

### CG-004 — Shared application conventions and operational hardening
**Scope:** Establish versioned API contracts, consistent pagination/filtering/errors, request correlation, structured logs, shared UI patterns, dependency health reporting, and contract/integration tests across modules. Extend the Phase 0 baseline rather than recreating it.  
**Acceptance:** Representative frontend/backend workflows use the conventions; failures have traceable request IDs; automated checks catch contract drift and common configuration errors.

## Phase 2 — Synthetic security telemetry and ingestion

### CG-005 — Canonical event model and synthetic dataset engine
**Scope:** Design a versioned event schema for authentication, host, network, and firewall events; implement validation and migrations; build deterministic synthetic dataset generation with configurable scenarios, timestamps, and volumes.  
**Acceptance:** Generated datasets are reproducible, schema-valid, diverse, and documented; malformed records are rejected; compatibility and generation tests pass.

### CG-006 — Multi-format ingestion and normalization pipeline
**Scope:** Import synthetic JSON, CSV, and selected structured-text formats; map source fields into the canonical schema; validate timestamps/severity/asset references; report per-record errors; implement documented deduplication rules.  
**Acceptance:** Valid mixed-format fixtures ingest correctly; invalid rows are reported without silent loss; repeated imports follow defined duplicate behavior; import UI and API agree on results.

### CG-007 — Asynchronous import orchestration and recovery
**Scope:** Process large synthetic imports through Celery; implement job states, progress, retry/backoff, cancellation boundaries, idempotency, partial-failure recovery, and job-history UI.  
**Acceptance:** Imports survive worker restarts under documented recovery rules; duplicate task execution does not silently duplicate data; progress and failure details are accurate; integration tests exercise recovery.

### CG-008 — Event storage lifecycle and ingestion observability
**Scope:** Implement event partition/index strategy appropriate to measured loads, import metrics, retention configuration, cleanup jobs, and operational diagnostics for synthetic datasets.  
**Acceptance:** Retention and cleanup preserve referential integrity; ingestion metrics reconcile with stored counts; performance baselines and operational procedures are documented.

## Phase 3 — Event exploration and investigations

### CG-009 — Event explorer and detail inspection
**Scope:** Build an analyst event explorer with server-side pagination, sorting, filters, detail panels, schema-aware fields, and links to simulated assets.  
**Acceptance:** Filters return correct records across large synthetic fixtures; UI handles empty/error/loading states; navigation and API tests cover key analyst flows.

### CG-010 — Advanced query builder and saved searches
**Scope:** Add compound query conditions, time-range presets, safe query validation, saved searches, ownership/sharing rules, and query execution diagnostics.  
**Acceptance:** Complex queries have predictable semantics; malformed or expensive requests are bounded; saved queries restore faithfully; permissions and performance tests pass.

### CG-011 — Event correlation and investigation timelines
**Scope:** Correlate related events by simulated asset, source, session, and temporal proximity; display navigable timelines with explainable correlation criteria.  
**Acceptance:** Known synthetic scenarios produce expected groupings; analysts can inspect why events are linked; ordering and time-zone edge cases are tested.

### CG-012 — Investigation collections and evidence export
**Scope:** Support bookmarks, annotations, curated event collections, references, and controlled CSV/JSON export with provenance metadata.  
**Acceptance:** Analysts can save and reopen a collection; references survive normal event navigation; exports match access permissions and preserve traceability.

## Phase 4 — Defensive detection engineering

### CG-013 — Configurable detection rule engine
**Scope:** Design a safe, bounded rule representation and evaluation pipeline for synthetic events; support field predicates, severity mapping, activation states, and explainable matches.  
**Acceptance:** Rules cannot execute arbitrary code; known positive/negative fixtures produce expected results; evaluations are persisted and traceable to rule versions.

### CG-014 — Stateful and time-window detections
**Scope:** Add threshold, aggregation, sequence, and rolling-window detections for simulated activity, with documented event-time semantics and late-arrival handling.  
**Acceptance:** Windowed scenarios match expected outcomes; duplicate/late events behave consistently; memory and runtime limits are tested on synthetic loads.

### CG-015 — Rule authoring, versioning, and governance
**Scope:** Build rule creation/editing UI, validation previews, version history, change comparison, approval/activation controls, and audit records.  
**Acceptance:** Rule changes are attributable and reversible; invalid rules cannot activate; permissions are enforced; active evaluations reference immutable rule versions.

### CG-016 — Detection simulation and historical replay
**Scope:** Allow analysts to test draft rules against selected historical synthetic datasets, compare versions, inspect match explanations, and view runtime/resource metrics.  
**Acceptance:** Replay is isolated from production alert creation by default; results are reproducible; cancellations and resource limits work; scenario-based tests pass.

## Phase 5 — Alert operations

### CG-017 — Alert generation, grouping, and lifecycle
**Scope:** Convert detection results into alerts with deterministic grouping, deduplication, severity, status transitions, ownership, and event/rule provenance.  
**Acceptance:** Repeated evaluations do not create unintended duplicate alerts; state transitions are validated; each alert links back to contributing synthetic events and rule versions.

### CG-018 — Analyst triage workspace
**Scope:** Deliver alert queues, saved views, detail panels, assignment, comments, bulk operations, and keyboard-accessible workflows.  
**Acceptance:** Analysts can complete common triage paths end-to-end; bulk operations report partial failures; concurrent updates do not silently overwrite work.

### CG-019 — Notifications and escalation policies
**Scope:** Implement in-app notifications, configurable escalation rules, delivery state, read/unread tracking, and background retries without requiring real external contact data.  
**Acceptance:** Relevant state changes trigger the expected notifications; retries avoid duplicate user-visible messages; escalation paths and permissions are tested.

### CG-020 — Alert context and disposition feedback
**Scope:** Enrich alerts with simulated asset context, related detections, timelines, and structured false-positive/disposition feedback.  
**Acceptance:** Context is explainable and sourced from synthetic records; feedback is attributable; alert history remains intact after changes.

## Phase 6 — Incident response and collaboration

### CG-021 — Incident case lifecycle
**Scope:** Support incident creation from alerts or manually, ownership, severity/priority, statuses, linked alerts, due dates, and resolution validation.  
**Acceptance:** Incidents follow explicit transition rules; alert-to-incident provenance is preserved; UI/API flows and authorization tests pass.

### CG-022 — Investigation workspace and evidence timeline
**Scope:** Build a case workspace combining events, alerts, evidence references, analyst notes, timeline entries, and activity history.  
**Acceptance:** A synthetic scenario can be investigated from initial alert through documented findings; evidence provenance and chronological history remain inspectable.

### CG-023 — Collaborative casework and auditability
**Scope:** Add assignments, watchers, comments, handoffs, conflict-aware edits, and role-scoped access to case actions.  
**Acceptance:** Multiple analysts can work without silent data loss; changes are attributable; authorization and concurrent-edit tests pass.

### CG-024 — Response playbooks and case closure reviews
**Scope:** Introduce defensive checklist-style playbooks, task tracking, resolution templates, lessons learned, and case completeness checks. Do not execute actions against external systems.  
**Acceptance:** A case can follow a repeatable playbook; closure requirements are enforced; final reviews retain links to evidence and actions.

## Phase 7 — Simulated asset inventory and posture

### CG-025 — Synthetic asset registry and relationships
**Scope:** Model simulated hosts, services, network segments, ownership labels, criticality, and asset relationships with browse/edit UI and validation.  
**Acceptance:** Assets and relationships can be managed without invalid references; generated datasets resolve to simulated assets; graph and API tests pass.

### CG-026 — Inventory imports and reconciliation
**Scope:** Import synthetic inventory snapshots, reconcile identifiers, detect changes/conflicts, and preserve asset lifecycle history.  
**Acceptance:** Repeated imports are predictable; merges are reviewable; removed or renamed assets do not silently break historical links.

### CG-027 — Asset-centric security investigation
**Scope:** Aggregate each simulated asset's event, detection, alert, and incident history with timelines, related assets, and investigation drilldowns.  
**Acceptance:** Cross-module counts and links reconcile; filtering and access checks hold; representative scenarios can be investigated from the asset view.

### CG-028 — Explainable posture scoring and trends
**Scope:** Define transparent, configurable posture indicators derived from synthetic activity and asset metadata, with historical comparisons and rationale.  
**Acceptance:** Scores are reproducible and explainable; missing data is handled explicitly; tests verify calculation and trend consistency.

## Phase 8 — Analytics and reporting

### CG-029 — Security operations dashboard
**Scope:** Build dashboards for event volume, detection outcomes, alert workload, incident status, and simulated asset posture, with drilldowns.  
**Acceptance:** Dashboard figures reconcile with source records; filters apply consistently; loading, empty, and failure states are tested.

### CG-030 — Configurable dashboards and visualization framework
**Scope:** Add reusable widgets, personal layouts, configurable time ranges, saved views, and cross-widget navigation.  
**Acceptance:** Layouts persist reliably; widget permissions are respected; visualizations handle large/empty datasets and remain accessible.

### CG-031 — Historical analytics and query performance
**Scope:** Implement time-bucketed analytics, retention-aware trends, aggregation strategies, query profiling, and performance improvements justified by benchmarks.  
**Acceptance:** Aggregates match source fixtures; measured benchmarks and optimization tradeoffs are documented; retention does not create misleading metrics.

### CG-032 — Exportable and scheduled reports
**Scope:** Build report definitions, background generation, CSV/PDF output, scheduled execution, history, and controlled download access.  
**Acceptance:** Reports reproduce selected filters and date ranges; failed jobs can be diagnosed/retried; generated artifacts obey permissions and retention rules.

## Phase 9 — Governance, reliability, and security hardening

### CG-033 — Fine-grained authorization and policy review
**Scope:** Extend basic roles into resource/action permissions, centralized policy enforcement, policy inspection, and comprehensive negative authorization tests.  
**Acceptance:** Privilege boundaries are consistent across API, jobs, and exports; policy changes are auditable; regression tests cover bypass attempts.

### CG-034 — Audit trail, retention, and governance controls
**Scope:** Add tamper-evident design considerations, audit search/export, configurable retention, deletion safeguards, and administrative governance workflows.  
**Acceptance:** Sensitive actions generate consistent audit entries; retention jobs honor dependencies; policy changes and cleanup outcomes are verifiable.

### CG-035 — Backup, restore, and failure recovery
**Scope:** Implement documented backup/restore workflows, database and artifact consistency checks, job recovery procedures, and failure-injection exercises for local/staging environments.  
**Acceptance:** A tested restore reconstructs a synthetic environment; recovery procedures specify data-loss limits; failure tests demonstrate expected behavior.

### CG-036 — Observability and performance engineering
**Scope:** Add application/job metrics, traces or correlated diagnostics, operational dashboards, synthetic load tests, and capacity analysis.  
**Acceptance:** Major workflows are measurable end-to-end; bottlenecks are evidenced by repeatable tests; operational alerts and troubleshooting guides are validated.

## Phase 10 — Deployment, quality, and project maturity

### CG-037 — Staging deployment and release operations
**Scope:** Build a reproducible staging deployment with secure configuration, TLS termination, migrations, release packaging, rollback procedures, and operational documentation.  
**Acceptance:** Staging can be provisioned and upgraded from documented steps; rollback is tested; no secrets are embedded in images or repository history.

### CG-038 — End-to-end quality and accessibility program
**Scope:** Expand browser/API/integration regression coverage around full synthetic analyst journeys; add accessibility checks, failure-state tests, and release quality gates.  
**Acceptance:** Critical journeys pass in CI; accessibility issues are tracked and remediated; regressions block releases according to documented criteria.

### CG-039 — Onboarding, usability, and contributor experience
**Scope:** Build guided first-run setup, safe demo-data initialization, in-product help, contributor documentation, and improved error/empty states based on usability findings.  
**Acceptance:** A new user can complete a sample investigation without undocumented steps; a contributor can reproduce development and testing workflows.

### CG-040 — Versioned releases and reference demonstrations
**Scope:** Establish changelogs, migration notes, compatibility policy, versioned demo datasets, example investigations, and release verification procedures.  
**Acceptance:** A tagged release has reproducible artifacts, tested upgrade instructions, complete release notes, and a working synthetic demonstration scenario.

## Phase 11 — Multi-organization and tenant management

*This phase begins only after the shared-environment product is stable. Tenant isolation is a security boundary and requires dedicated design review and testing.*

### CG-041 — Organization lifecycle and membership
**Scope:** Introduce organization creation, administration, invitations, membership changes, and organization switching with a migration path for existing shared-environment accounts.  
**Acceptance:** Membership workflows are auditable; users see only authorized organizations; legacy accounts migrate predictably.

### CG-042 — Tenant-aware data migration and isolation
**Scope:** Introduce organization ownership for relevant entities, tenant-scoped queries, background job context, database constraints, and safe migration of existing records.  
**Acceptance:** Cross-tenant API, query, export, and job access tests fail closed; migration preserves historical relationships; isolation is reviewed before rollout.

### CG-043 — Organization-scoped administration and roles
**Scope:** Separate platform-level administration from organization-level roles, settings, memberships, and policy management.  
**Acceptance:** Organization administrators cannot affect other tenants or platform-only controls; permission inheritance and revocation are tested.

### CG-044 — Tenant-aware analytics, jobs, audit, and verification
**Scope:** Extend dashboards, reporting, notifications, imports, audits, retention, and operational monitoring to tenant boundaries; perform isolation and performance regression exercises.  
**Acceptance:** No tenant data leaks through derived views, scheduled jobs, downloads, or logs; representative multi-tenant workflows pass end-to-end.

---

## Delivery principles

- **Incremental, verifiable progress:** Each goal should deliver a coherent, testable capability with documentation and migrations where applicable.
- **Security by design:** Enforce authorization on the backend, validate inputs, preserve auditability, and avoid secrets in source control.
- **Synthetic data only:** Use reproducible fictional identities, assets, and telemetry; never use real customer, employee, or third-party logs.
- **Defensive purpose:** No exploitation, intrusive scanning, credential harvesting, or automated action against external systems.
- **Measured complexity:** Introduce additional infrastructure, including OpenSearch, only after benchmarks or requirements justify it.
- **Honest project status:** Track planned, in-progress, and completed goals through issues, pull requests, and release notes rather than treating this roadmap as proof of implementation.

## Milestone checkpoints

| Checkpoint | Expected integrated capability |
|---|---|
| Phase 0 | Reproducible local foundation and CI |
| Phases 1–2 | Authorized users can generate and import synthetic telemetry |
| Phases 3–4 | Analysts can explore events and test defensive detections |
| Phases 5–6 | Detection results become triageable alerts and traceable incidents |
| Phases 7–8 | Asset context, dashboards, and reporting support investigations |
| Phases 9–10 | Hardened, tested, documented staging and release workflow |
| Phase 11 | Verified multi-organization isolation and administration |

*Roadmap scope is intentionally ambitious and may be revised through documented design decisions. Completion requires working software and verified acceptance criteria, not merely a checked box.*
