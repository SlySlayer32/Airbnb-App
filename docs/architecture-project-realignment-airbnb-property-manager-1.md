---
goal: Airbnb Property Manager structural realignment
version: 1.0
date_created: 2025-10-25
last_updated: 2025-10-25
owner: Project Realigner
status: 'In progress'
tags: [architecture, refactor, structure]
---

# Introduction

![Status: In progress](https://img.shields.io/badge/status-In%20progress-yellow)

This plan realigns the Airbnb Property Manager project structure according to Expo React Native +
TypeScript best practices with domain separation for business (modules), front (app/ui), and
services (lib).

## 1. Requirements & Constraints

- REQ-STRUCT-001: No code edits; only file/folder moves, creates, and renames
- REQ-SAFETY-001: All removals/replacements moved to /tempbin/{timestamp}
- REQ-IDEMPOTENT-001: Re-runs must be safe and skip already moved items
- REQ-PLAN-001: Write pre/post snapshots and detailed op results to plan/realign-log.json
- CON-PATH-001: Import paths will be updated in a follow-up code-mod task (out of scope here)
- GUD-001: Keep Expo Router pages in app/ only; move non-routing code to src/

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Prepare folders, snapshot pre-state, and verify prerequisites

| Task     | Description                                                                                                                        | Completed | Date |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-001 | Ensure directories: app/, src/, src/modules, src/ui, src/lib, src/config, src/utils, src/types, src/data, tests/, plan/, tempbin/  |           |      |
| TASK-002 | Create domain folders: src/modules/properties, src/modules/cleaning, src/modules/maintenance, src/modules/team, src/modules/shared |           |      |
| TASK-003 | Snapshot pre-state tree to plan/realign-log.json                                                                                   |           |      |

### Implementation Phase 2

- GOAL-002: Move and create resources deterministically

| Id     | Action | From         | To                            | Notes                                                 |
| ------ | ------ | ------------ | ----------------------------- | ----------------------------------------------------- |
| OP-001 | ensure | ./app        | ./app                         | Expo Router routes remain here                        |
| OP-002 | ensure | ./assets     | ./assets                      | Ensure exists                                         |
| OP-003 | create | (n/a)        | ./src                         | Create if missing                                     |
| OP-004 | create | (n/a)        | ./src/ui/components           | Create if missing                                     |
| OP-005 | move   | ./components | ./src/ui/components           | Shared UI primitives                                  |
| OP-006 | create | (n/a)        | ./src/modules/shared/contexts | Create if missing                                     |
| OP-007 | move   | ./contexts   | ./src/modules/shared/contexts | Contexts shared across domains                        |
| OP-008 | create | (n/a)        | ./src/lib                     | Create if missing                                     |
| OP-009 | move   | ./services   | ./src/lib                     | Initial consolidation; further split per-domain later |
| OP-010 | create | (n/a)        | ./src/types                   | Create if missing                                     |
| OP-011 | move   | ./types      | ./src/types                   | Central TS types                                      |
| OP-012 | create | (n/a)        | ./src/utils                   | Create if missing                                     |
| OP-013 | move   | ./utils      | ./src/utils                   | Utilities                                             |
| OP-014 | create | (n/a)        | ./src/data                    | Create if missing                                     |
| OP-015 | move   | ./data       | ./src/data                    | Mock data/constants                                   |
| OP-016 | create | (n/a)        | ./src/config                  | Create config folder                                  |
| OP-017 | create | (n/a)        | ./src/modules/properties      | Domain module                                         |
| OP-018 | create | (n/a)        | ./src/modules/cleaning        | Domain module                                         |
| OP-019 | create | (n/a)        | ./src/modules/maintenance     | Domain module                                         |
| OP-020 | create | (n/a)        | ./src/modules/team            | Domain module                                         |
| OP-021 | create | (n/a)        | ./tests/unit                  | Unit tests root                                       |
| OP-022 | create | (n/a)        | ./tests/e2e                   | E2E tests root                                        |

### Implementation Phase 3

- GOAL-003: Verify, snapshot post-state, and summarize

| Task     | Description                                            | Completed | Date |
| -------- | ------------------------------------------------------ | --------- | ---- |
| TASK-101 | Snapshot post-state tree to plan/realign-log.json      |           |      |
| TASK-102 | Emit summary: created, moved, skipped, tempbin entries |           |      |

## 3. Alternatives

- ALT-001: Keep all code under app/ (rejected: mixes routing and business layers)
- ALT-002: Flat src/ without modules (rejected: scales poorly for multiple domains)

## 4. Dependencies

- DEP-001: None (no package updates in this plan)

## 5. Files

- FILE-001: plan/realign-log.json — pre/post tree and operation results
- FILE-002: tempbin/{timestamp}/... — original assets for any replaced paths

## 6. Testing

- TEST-001: Dry-run mode produces this plan without modifying the FS
- TEST-002: Execute mode creates all listed directories and moves sources if they exist

## 7. Risks & Assumptions

- RISK-001: Import paths may break until follow-up code-mod PR adjusts them
- RISK-002: Non-standard custom tooling may expect old paths; mitigation: tempbin backups
- ASSUMPTION-001: Expo Router is in use and should remain under app/

## 8. Related Specifications / Further Reading

- Expo Router directory conventions
- RN + TS best practices for modular architecture
