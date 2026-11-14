# CyberGuard — Product Specification

**Status:** Initial specification (Phase 0)  
**Version:** 0.1  
**Project type:** Open-source, defensive security operations and incident management platform

## 1. Product vision

CyberGuard is a multi-user platform for exploring **synthetic** security telemetry, creating and testing defensive detection rules, triaging alerts, investigating incidents, and understanding the security posture of simulated infrastructure. It is designed as an educational and personal-lab product, not as a production security monitoring service.

The initial release operates as **one shared environment** with multiple user accounts. A later roadmap phase will introduce independently managed organizations and tenant isolation.

## 2. Objectives

- Provide a coherent end-to-end workflow from synthetic event generation through detection, alert triage, incident investigation, and reporting.
- Support meaningful collaboration between administrators and security analysts.
- Make detection logic explainable, testable, and auditable.
- Provide reproducible local development and demonstrations without using real third-party security logs or personal information.
- Evolve incrementally from a modular monolith toward more capable processing and search infrastructure only where justified.

## 3. Intended users and roles

### Administrator

Manages user accounts, role assignments, platform configuration, detection-rule governance, and operational settings. Administrative actions are recorded in an audit trail.

### Security Analyst

Explores events, reviews alerts, investigates incidents, maintains evidence and annotations, and produces reports within assigned permissions.

### Possible future Viewer

A read-only role may be introduced after core authorization has been implemented and tested.

**Authorization principle:** the backend enforces permissions for every protected operation. Frontend navigation and controls reflect permissions but are not security boundaries.

## 4. Scope and boundaries

### In scope

- Synthetic authentication, host, network, and firewall event datasets.
- Event import, normalization, validation, indexing, search, and timelines.
- User-authored defensive detection rules and rule simulation.
- Alerts, triage, deduplication, escalation, and status tracking.
- Incident cases, evidence references, notes, assignments, and audit history.
- Simulated asset inventory and posture summaries.
- Dashboards, analytics, and downloadable reports.
- User accounts, role-based access, system observability, testing, and deployment.

### Out of scope for the initial product

- Offensive exploitation, credential harvesting, intrusive scanning, or attack automation.
- Live collection from external networks or third-party organizations.
- Processing real personal, customer, employee, or regulated data.
- AI model training, hosting, or serving.
- Production-grade security assurances without a dedicated security review.
- Multi-organization tenancy during initial development.

## 5. Primary user journeys

1. **Generate and ingest:** An administrator or analyst loads a reproducible synthetic dataset, reviews import status, and inspects validation errors.
2. **Explore and investigate:** An analyst filters events by time, source, severity, and simulated asset, then saves a query and builds an investigation timeline.
3. **Detect and test:** An authorized user defines a defensive rule, tests it against synthetic historical events, and reviews matches and false-positive indicators.
4. **Triage alerts:** An analyst reviews grouped alerts, changes status, adds context, and escalates relevant findings into an incident.
5. **Manage an incident:** Analysts assign an incident, collect evidence references, document actions, and close it with a resolution summary.
6. **Review posture:** Users inspect asset-centric activity, dashboard trends, and reports for simulated infrastructure.
7. **Administer the platform:** An administrator manages accounts, permissions, operational configuration, and audit records.

## 6. Functional requirements

### FR-01 Identity and access

- Support individual accounts and authenticated sessions.
- Distinguish Administrator and Security Analyst roles.
- Deny unauthorized API operations server-side.
- Provide controlled account lifecycle, password handling, and security audit records.

### FR-02 Event ingestion

- Define a versioned canonical event schema with timestamps, event type, source, simulated asset, severity, and structured attributes.
- Accept supported synthetic JSON/CSV and selected structured-text inputs.
- Validate, normalize, reject malformed entries, and prevent accidental duplicates according to documented rules.
- Track asynchronous import jobs, progress, errors, retries, and recoverability.

### FR-03 Event exploration

- Provide paginated, filterable event views and event-detail inspection.
- Support time-range queries, saved searches, and correlation timelines.
- Allow annotations, bookmarks, and investigation collections.

### FR-04 Detection

- Support configurable, versioned defensive detection rules.
- Evaluate rules against ingested synthetic events.
- Support appropriate threshold and time-window conditions.
- Provide historical replay and simulation before activation.
- Record rule evaluations and explain why events matched.

### FR-05 Alert operations

- Generate alerts from detection matches.
- Support deduplication/grouping, status transitions, assignment, and analyst notes.
- Provide triage views, bulk actions, notifications, and escalation paths.

### FR-06 Incident management

- Create incidents manually or from alerts.
- Track severity, priority, ownership, status, evidence references, and activity history.
- Provide investigation timelines, collaborative notes, and closure reviews.
- Preserve traceability between source events, detection results, alerts, and incidents.

### FR-07 Asset inventory

- Manage simulated assets and relationships.
- Reconcile imported inventory data and preserve lifecycle history.
- Show asset-related events, alerts, incidents, and explainable posture indicators.

### FR-08 Analytics and reporting

- Provide operational dashboard metrics and drill-downs.
- Support configurable dashboard layouts and historical trend analysis.
- Export selected datasets and generate scheduled reports where enabled.

### FR-09 Administration and operations

- Expose health/readiness checks and structured application logs.
- Provide audit trails for security-sensitive actions.
- Support configuration, backup/restore, monitoring, and release management as the project matures.

## 7. Proposed architecture

**Architectural style:** modular monolith with explicit module boundaries and independently testable services.

| Layer | Proposed technology | Responsibility |
|---|---|---|
| Web application | Next.js, React, TypeScript, Tailwind CSS | User interface and client-side interactions |
| API | Python, FastAPI | HTTP APIs, authorization, business logic |
| Primary database | PostgreSQL | Users, events, rules, alerts, incidents, assets, audit records |
| Migrations | Alembic | Versioned schema changes |
| Background jobs | Celery with Redis | Event processing, detection jobs, report generation |
| Development runtime | Docker Compose | Reproducible local services |
| Automated testing | pytest, Playwright | API, integration, and browser-level coverage |
| CI | GitHub Actions | Linting, tests, and build verification |
| Future search option | OpenSearch, only if needed | Large-scale search and analytics |

### Logical modules

- `identity`: users, sessions, roles, authorization
- `events`: event schema, generation, ingestion, search
- `detections`: rules, evaluations, replay
- `alerts`: alert lifecycle and triage
- `incidents`: cases, evidence, collaboration
- `assets`: simulated inventory and relationships
- `analytics`: dashboards and reporting
- `audit`: sensitive action history
- `platform`: configuration, health, background processing

Module names are conceptual and may change during implementation.

## 8. Conceptual data model

Core entities are expected to include:

- **User**, **Role**, and **Session**
- **SyntheticAsset** and **AssetRelationship**
- **SecurityEvent** and **IngestionJob**
- **DetectionRule**, **RuleVersion**, and **RuleEvaluation**
- **Alert**, **AlertEventLink**, and **AlertActivity**
- **Incident**, **IncidentEvidence**, **IncidentNote**, and **IncidentActivity**
- **SavedSearch**, **Dashboard**, and **ReportJob**
- **AuditEntry**

Relationships should preserve a traceable path from event to rule evaluation, alert, and incident. The exact schema will be refined in dedicated development milestones rather than fully implemented during Phase 0.

## 9. Security and privacy requirements

- Use synthetic demonstration telemetry only; never commit real logs, credentials, tokens, or personal records.
- Keep secrets in untracked environment files or an appropriate secret-management system; provide `.env.example` with placeholders.
- Hash passwords with an established, maintained password-hashing library; never store plaintext passwords.
- Apply least-privilege authorization and validate untrusted input on the backend.
- Avoid leaking sensitive internal details through API errors or logs.
- Maintain auditability of authentication, role changes, rule changes, and incident actions.
- Protect against common web vulnerabilities, including injection, CSRF where applicable, broken access control, and unsafe file uploads.
- Keep dependencies current and run automated checks in CI.
- Document that the software is not security-certified or production-hardened by default.

## 10. Non-functional requirements

- **Reproducibility:** contributors can start the development stack using documented commands.
- **Maintainability:** modules have clear boundaries, typed interfaces where practical, migrations, and automated tests.
- **Usability:** core analyst workflows are navigable and provide actionable validation feedback.
- **Accessibility:** aim for keyboard-friendly navigation, semantic markup, and accessible status communication.
- **Reliability:** background jobs expose status and recover from expected failures without silent data loss.
- **Observability:** structured logs and health endpoints support troubleshooting.
- **Performance:** establish realistic benchmarks using synthetic datasets; optimize only against measured bottlenecks.
- **Portability:** prioritize local Docker-based development, with deployment options introduced later.

Quantitative service-level and performance targets will be defined after baseline implementation and measurement.

## 11. Future multi-organization support

Multi-organization support is explicitly deferred to **Phase 11** of the development roadmap:

- **CG-041:** organization lifecycle, memberships, and invitations.
- **CG-042:** tenant-aware data model, migration, and verified data isolation.
- **CG-043:** organization-scoped roles, permissions, settings, and administration.
- **CG-044:** tenant-aware analytics, jobs, audit trails, and isolation testing.

For now, CyberGuard has a single shared environment. The design should avoid needless assumptions that prevent future tenancy, but should **not** add nonfunctional tenant fields or imply isolation already exists. Future migration must include a formal data-access review and cross-tenant authorization tests.

## 12. Phase 0 deliverables

Phase 0 establishes the foundation, not the complete product:

1. Product specification and public-facing development roadmap.
2. Public, personally owned Git repository with an accepted open-source license.
3. README explaining purpose, audience, stack, and local startup.
4. Minimal FastAPI application with health endpoint and configuration structure.
5. Minimal Next.js/TypeScript application with a basic shell and API connectivity check.
6. PostgreSQL, Redis, and Docker Compose development configuration.
7. Basic migration setup, automated tests, and CI.
8. `.env.example`, appropriate ignore rules, and secret-free repository verification.

**Explicitly deferred:** registration/login flows, full RBAC, event ingestion, detections, alerting, incidents, dashboards, and organization tenancy.

## 13. Phase 0 acceptance criteria

- A new contributor can clone the repository and start the documented local stack.
- Frontend and backend load successfully; the backend health endpoint responds.
- PostgreSQL and Redis services are available to the application where configured.
- A baseline migration can be applied to a clean development database.
- Initial backend and frontend checks pass in CI.
- Documentation clearly distinguishes planned capabilities from implemented features.
- The repository contains an open-source license and no committed secrets or real security/personal datasets.
- Substantial product functionality remains for the numbered roadmap milestones.

## 14. Development roadmap relationship

The planned development roadmap covers identity, events, exploration, detection, alerts, incidents, assets, analytics, governance, deployment maturity, and finally multi-organization tenancy. Goals **CG-001 through CG-044** are planned work, not claims of completed functionality. Early roadmap goals will be revised to avoid duplicating Phase 0 infrastructure.

## 15. Open design questions

These decisions should be resolved in the relevant development milestones:

- Session and token strategy for browser/API authentication.
- Whether to permit self-registration or require administrator invitations.
- Detailed event-schema field definitions and retention defaults.
- Rule language and safe evaluation approach.
- Background job idempotency and retry semantics.
- Report formats and scheduling policies.
- Migration strategy from shared environment to multi-organization tenancy.

---

*This specification is a living design document. Implementation details may evolve through reviewed changes and documented architectural decisions.*
