# Developer Execution Phase Plan

Purpose: Provide AI + human developers a deterministic guide for implementing the platform in staged, low-risk increments. Each phase includes Why, What, How, Expected Outcomes, Risks/Mitigations, Metrics, and Unlocks for the next phase.

## Phase 0 – Environment & Guardrails

**Why**: Establish reliability, consistency, and safe iteration before building advanced workflows.

**What**:

- Supabase project verified (auth, tables stubbed)
- RLS policies drafted for core tables (properties, cleaning_sessions, cleaning_updates)
- Base services layer + supabase client reference
- TypeScript strict mode confirmed (no implicit any)
- Lint + format (eslint + prettier or config already present)
- Add error/reporting placeholder (future Sentry hook)

**How**:

1. Document current schema snapshot (`supabase/migrations` folder)  
2. Add `docs/security/RLS_POLICIES.md` with role matrix  
3. Generate DB types (later) – placeholder note  
4. Verify Auth flow via `AuthContext`  
5. Ensure no direct Supabase calls inside components (audit pass)  

**Expected**: Stable base; new code naturally funnels through service functions.  
**Risks**: Hidden direct queries; inconsistent error messaging.  
**Mitigation**: Search for `supabase.from(` in components.  
**Metrics**: 0 direct component queries; <5 console errors during end-to-end manual run.  
**Unlocks**: Enables safe layering of real-time + lifecycle logic.

## Phase 1 – Core Cleaner Dashboard MVP

**Why**: Deliver immediate daily operational value for cleaners (see sessions, start, track time, finish with mock proof).

**What**:

- getTodaySessions service method
- Real-time subscription (sessions + updates)
- Dashboard skeleton + top bar
- Lifecycle service methods (start/pause/resume/complete) – persisted to cleaning_updates
- Status banner state machine (Relax / Scheduled / Ready / Active / Break / AwaitingPhotos / DayWrap)
- Next Job + Active Session cards
- Photo gate placeholder (mock photosComplete flag)
- Basic alerts (late risk, missing photos)
- In-memory property cache for offline fallback

**How**:

1. Implement types + service (fetch sessions)  
2. Add realtime subscription channel  
3. Build UI placeholders then wire state  
4. Add state machine util + mapping  
5. Implement lifecycle methods (optimistic update)  
6. Add mock photo gating & alert derivation  
7. Validate transitions (manual test matrix)  

**Expected**: Cleaner can run an entire (mock) day flow start→complete.  
**Risks**: Race conditions with rapid state changes.  
**Mitigation**: Debounce UI triggers; idempotent service methods.  
**Metrics**: Start → Active UI update < 1s; 100% gated completion; zero crashes through full lifecycle.  
**Unlocks**: Real checklist + real media storage integration.

## Phase 2 – Operational Depth (Real Data & Proof)

**Why**: Move from mock experience to production-capable operational record.

**What**:

- Real checklist implementation (room tasks)
- Supabase storage for photo sets (before/after) + metadata table
- Linen requirements logic + shortage reporting
- Issue reporting (maintenance_tickets)
- Lost & found table + logging
- Supply (consumables) low-stock flagging (reuse maintenance or new table)
- KPI mini-metrics (jobs today, on-time %, photo compliance)
- AsyncStorage offline cache for property instructions + codes

**How**:

1. Define checklist data model (static config or table)  
2. Implement media upload (storage bucket + signed URL usage)  
3. Add linen calculation util + integrate in session card  
4. Build Issue modal (category/priority)  
5. Create lost_found table migration (id, session_id, description, photo_url, status)  
6. Add KPIs derived from local + fetched data  
7. Introduce offline persistence (hydrate on app load)  

**Expected**: Credible audit trail (time + tasks + photos) and operational insight.  
**Risks**: Storage latency; large photo payloads; offline divergence.  
**Mitigation**: Image compression; optimistic UI; retry queue.  
**Metrics**: Photo upload success rate ≥ 95%; checklist persistence 100%; KPI recalculation < 300ms.  
**Unlocks**: Advanced analytics, predictive risk, billing automation.

## Phase 3 – Reliability & Intelligence Foundations

**Why**: Strengthen trust, reduce manual oversight, prepare for automation.

**What**:

- Edge Functions (invoice generation, consolidated metrics)
- Generated Supabase types integrated in services
- Retry & backoff strategy for realtime dropouts
- Performance instrumentation (simple timing logs)
- Basic Sentry integration (errors + user role tag)
- Risk scoring: late-start predictor stub (e.g., simple heuristic)

**How**:

1. Add edge function: calculate-session-invoice  
2. Add edge function: aggregate-cleaner-metrics  
3. Integrate generated types (replace manual interfaces where possible)  
4. Add connection health checker for realtime; re-subscribe logic  
5. Wire Sentry captureException wrapper  
6. Introduce risk heuristic (time to window start vs location example placeholder)  

**Expected**: System resilient to transient failures; early analytics building blocks.  
**Risks**: Type drift if generation not automated.  
**Mitigation**: Add npm script + precommit hook for generation.  
**Metrics**: Realtime reconnect success >90%; error logging coverage >80%.  
**Unlocks**: Predictive scheduling & cost optimization.

## Phase 4 – Optimization & Predictive Enhancements

**Why**: Improve efficiency and reduce waste/time friction.

**What**:

- Route/sequence suggestion (multi-property day ordering)
- Checklist adaptive ordering (high-impact tasks first)
- Smart alert escalation (late risk notifications to owners)
- Supply consumption trend analysis
- Partial offline action queue (enqueue updates + replay)

**How**:

1. Add route suggestion service (external API stub acceptable)  
2. Add adaptive reorder: weighting rules + override option  
3. Escalation: detection window + notificationService priority integration  
4. Track supply request frequencies -> simple rolling average  
5. Offline queue module (serialize actions, replay on reconnect)  

**Expected**: Measurable reduction in late starts and travel idle time.  
**Risks**: Over-complex UX; mispredicted order frustration.  
**Mitigation**: Provide manual override + transparency (“Reordered for speed”).  
**Metrics**: Late-start rate ↓; average travel idle ↓; supply stockout reports ↓.  
**Unlocks**: Gamification & advanced pricing models.

## Phase 5 – Engagement, Gamification & Monetization

**Why**: Drive retention, quality improvement, and platform differentiation.

**What**:

- Streaks & achievement badges
- Performance dashboard for cleaners (historical trends)
- Owner-facing cost efficiency insights (Edge Function)
- Notification preferences & digest scheduling
- Billing / payout preview (if financial layer added)

**How**:

1. Track consecutive on-time days (counter reset logic)  
2. Badge rules config file + evaluation job  
3. Historical metrics aggregation function + caching  
4. Notification preference table (role-based)  
5. Simple payout preview (time * rate) – masked for cleaners unless allowed  

**Expected**: Higher cleaner retention and improved adherence to standards.  
**Risks**: Incentive misalignment (gaming the system).  
**Mitigation**: Use blended metrics (on-time + photo compliance + low rework).  
**Metrics**: Retention ↑; on-time ↑; rework ↓.  
**Unlocks**: Tiered pricing, marketplace expansion.

---

## Cross-Phase Supporting Tracks

| Track | Description | Start Phase |
|-------|-------------|-------------|
| Testing | Unit (Phase 1), Integration (2), E2E (3) | 1 |
| Security | RLS + least privilege | 0 |
| Observability | Logging → Sentry → Metrics | 1–3 |
| Performance | Lazy load, caching, batching | 2–4 |
| Data Quality | Event audit trail validation | 1–3 |
| Documentation | Keep CHANGELOG + architecture docs updated | Continuous |

---

## Phase Acceptance Checklist Template

Use this for closing any phase:

```markdown
Phase: X
- [ ] All epic tasks closed
- [ ] CHANGELOG updated with business impact
- [ ] RLS/policies reviewed (if schema touched)
- [ ] Generated types refreshed
- [ ] Manual test matrix executed
- [ ] Metrics baseline captured
```

## AI Implementation Guidance Notes

- ALWAYS create types first, then service, then UI.
- NEVER call Supabase directly in components.
- When unsure of schema field → reference generated types or add TODO with ISSUE ref.
- Prefer small vertical slices (service + UI + doc) over horizontal waves.

## Suggested Naming Conventions

| Artifact | Pattern | Example |
|----------|---------|---------|
| Edge Function | verb-domain-action | calculate-session-invoice |
| Service Method | actionNoun | startSession |
| Component | RoleFeatureCard | CleanerSessionCard |
| Hook | useDomainThing | useTodaySessions |
| Utility | verbNoun or nounUtil | formatTimeWindow |

## Metrics Glossary

| Metric | Definition | Source |
|--------|------------|--------|
| On-Time % | Sessions started before midpoint of window | cleaning_updates events |
| Photo Compliance % | Completed sessions with required photo sets | media table |
| Late Start Rate | Sessions started after window midpoint | derived events |
| Rework Rate | Sessions reopened or flagged (future) | future table |
| Issue Rate | Issues per 100 sessions | maintenance_tickets |

---

## Quick Start (If New Developer Arrives)

1. Read Phase 1 in this doc + `plan.md` dashboard diagrams.
2. Run app and confirm mock flow works.
3. Pick earliest open Phase 1 issue not blocked.
4. Follow pattern: Types → Service → UI → Wire → Test → Update CHANGELOG.

---

## Future Considerations Parking Lot

| Idea | Rationale | Phase Fit |
|------|-----------|-----------|
| Multi-cleaner session handoff | Team workflows | 3/4 |
| Geo fencing on arrival | Accurate arrival time | 3 |
| Automated invoice batching | Owner transparency | 3+ |
| Advanced anomaly detection | Fraud / misuse prevention | 4/5 |
| White-label partner mode | Scalability & expansion | 5 |

---

End of document.
