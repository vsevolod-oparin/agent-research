# incident-responder Evaluation (D/E/F)

## Task 1: ir-001

**Ground Truth Summary:** Must mention: P0/P1 classification, first 5 min actions (acknowledge, war room, page on-call), check database/external deps/infrastructure, stakeholder communication template. Structure: time-boxed action plan, severity classification with reasoning, communication cadence.

### Condition D
- must_mention coverage: 4/4 -- P0 classification with reasoning, first 5 min actions (channel, war room, paging), check DB/network/infra/external deps, stakeholder communication template
- must_not violations: None
- Completeness: 5 -- All items covered comprehensively with ranked hypotheses
- Precision: 5 -- All claims and reasoning are sound
- Actionability: 5 -- Specific mitigation actions (kill queries, scale up, circuit breakers)
- Structure: 5 -- Time-boxed sections, tables, incident ID, roles defined
- Efficiency: 4 -- Very thorough but could be slightly more concise
- Depth: 5 -- Ranked root cause hypotheses, postmortem questions
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- P0, diagnostic steps (DB, cache, network, cloud), stabilization options, communication template
- must_not violations: None
- Completeness: 4 -- All items covered but war room/paging less explicit
- Precision: 5 -- All claims accurate
- Actionability: 5 -- Stabilization table with recovery times is excellent
- Structure: 4 -- Good structure but less formal incident framework (no incident ID, no roles)
- Efficiency: 5 -- Very compact, high signal density
- Depth: 4 -- Recovery time estimates are a nice touch; less depth on team coordination
- **Composite: 4.53**

### Condition F
- must_mention coverage: 4/4 -- P0, immediate actions (declare, confirm scope, check deps), investigation steps, mitigation table
- must_not violations: None
- Completeness: 5 -- All items plus follow-up actions
- Precision: 5 -- All claims accurate
- Actionability: 5 -- Priority-ordered mitigation table
- Structure: 5 -- Time-boxed sections (first 5 min, investigation, mitigation, follow-up)
- Efficiency: 5 -- Dense, well-organized
- Depth: 4 -- Good breadth of investigation; less unique insight than D's ranked hypotheses
- **Composite: 4.73**

---

## Task 2: ir-002

**Ground Truth Summary:** Must mention: external dependency failure, check gateway outage, fallback/retry strategy, customer communication, revenue impact estimation. Must not: suggest rolling back (no recent deployment, external issue).

### Condition D
- must_mention coverage: 5/5 -- external dependency (explicitly classified), check gateway status, retry/failover, customer communication with talking points, revenue impact mentioned
- must_not violations: None -- no rollback suggestion
- Completeness: 5 -- All items covered with investigation protocol
- Precision: 5 -- Correctly identifies external dependency nature
- Actionability: 5 -- Specific actions: contact gateway, connectivity tests, reconciliation
- Structure: 5 -- Time-boxed, severity reasoning, communication cadence
- Efficiency: 4 -- Comprehensive but slightly verbose
- Depth: 5 -- Transaction reconciliation, connection pool investigation, TLS/cert checks
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/5 -- external dependency, check gateway status, retry/failover, customer communication. Revenue impact not explicitly estimated.
- must_not violations: None
- Completeness: 4 -- Missing explicit revenue impact estimation
- Precision: 5 -- All claims accurate
- Actionability: 5 -- Contact gateway NOW emphasized, good stabilization table
- Structure: 4 -- Clean but less formal than D
- Efficiency: 5 -- Very compact
- Depth: 4 -- Good diagnostic steps but less depth on reconciliation
- **Composite: 4.40**

### Condition F
- must_mention coverage: 5/5 -- external dependency, check gateway status, failover/retry, customer communication, revenue impact (quantify impact step)
- must_not violations: None
- Completeness: 5 -- All items covered
- Precision: 5 -- All claims accurate
- Actionability: 5 -- Priority-ordered mitigation, reconciliation steps
- Structure: 5 -- Clean time-boxed sections
- Efficiency: 5 -- Dense, well-organized
- Depth: 4 -- Good but less detail on cert/TLS investigation than D
- **Composite: 4.73**

---

## Task 3: ir-003

**Ground Truth Summary:** Must mention: calculate time to 100% (~7.5 hours), immediate actions (large tables, temp files, logs), short-term (archive/purge, expand disk), long-term (retention policies, monitoring at 80%). Structure: time-to-failure estimate, prioritized action list.

### Condition D
- must_mention coverage: 4/4 -- 7.5 hours calculation, immediate actions (logs, temp files, binary logs), short-term (expand disk, archive), long-term (retention, monitoring at 70/80/90%)
- must_not violations: None
- Completeness: 5 -- All items covered with tiered approach (1h, 2-3h, 1-2 weeks)
- Precision: 5 -- Time calculation correct, all actions sound
- Actionability: 5 -- Tiered actions with time windows
- Structure: 5 -- Time-to-failure prominent, prioritized tiers, communication template
- Efficiency: 4 -- Very thorough but lengthy
- Depth: 5 -- WAL/binary log specifics, vacuum, partitioning suggestions
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- 7.5 hours, identify space consumers (du commands), quick wins (purge logs), expand disk, monitoring at 70/80/90%
- must_not violations: None
- Completeness: 5 -- All items covered in phased approach
- Precision: 5 -- Correct calculations and actions
- Actionability: 5 -- Specific commands (du -sh), phase timings (30 min, 2h, 24h)
- Structure: 5 -- Three clear phases, escalation trigger
- Efficiency: 5 -- Most compact of the three; very high signal density
- Depth: 4 -- Practical commands but less detail on specific cleanup mechanisms
- **Composite: 4.73**

### Condition F
- must_mention coverage: 4/4 -- 7.5 hours, immediate actions (identify growth source, purge), expand disk, monitoring at 70/80/90%
- must_not violations: None
- Completeness: 5 -- All items covered
- Precision: 5 -- Correct calculations
- Actionability: 5 -- Priority-ordered mitigation table with "Space Recovered" column
- Structure: 5 -- Time-boxed, prioritized
- Efficiency: 5 -- Clean and compact
- Depth: 4 -- Good but less specific than D on cleanup mechanisms
- **Composite: 4.73**

---

## Task 4: ir-004

**Ground Truth Summary:** Must mention: immediately revoke key, audit CloudTrail/access logs, identify what data accessed, legal/compliance notifications (GDPR, breach disclosure), rotate all related credentials. Structure: immediate containment (minutes), investigation (hours), notification/compliance (24-72h).

### Condition D
- must_mention coverage: 5/5 -- revoke key (Step 1), CloudTrail audit (Step 3), data scope assessment (Step 3), legal/compliance/GDPR 72h (Section 5), rotate credentials (Step 4)
- must_not violations: None
- Completeness: 5 -- All items plus GitHub removal, employee interview, preventive measures
- Precision: 5 -- All claims accurate and well-structured
- Actionability: 5 -- Step-by-step containment, investigation, and compliance
- Structure: 5 -- Minutes/hours/24-72h structure exactly as required
- Efficiency: 4 -- Very comprehensive but could be trimmed slightly
- Depth: 5 -- Lateral movement check, forensic analysis, secret scanning recommendations
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- revoke key (Phase 1), CloudTrail audit (Phase 2), data scope (Phase 2), GDPR 72h (Phase 3), rotate credentials (Phase 1)
- must_not violations: None
- Completeness: 5 -- All items plus IAM command, GuardDuty
- Precision: 5 -- All claims accurate; includes actual AWS CLI command
- Actionability: 5 -- Phased approach with specific commands
- Structure: 5 -- Three phases (15 min, 2h, 24h) matching requirements
- Efficiency: 5 -- Very compact, high signal density
- Depth: 4 -- Good but less detail on forensics than D
- **Composite: 4.73**

### Condition F
- must_mention coverage: 5/5 -- revoke key, CloudTrail audit, data scope assessment, GDPR/legal, rotate credentials
- must_not violations: None
- Completeness: 5 -- All items plus forensics firm recommendation
- Precision: 5 -- All claims accurate
- Actionability: 5 -- Priority-ordered mitigation table
- Structure: 5 -- Minutes/investigation/follow-up structure
- Efficiency: 5 -- Clean and well-organized
- Depth: 5 -- Lateral movement, explicit S3 bucket policy deny, forensics firm
- **Composite: 5.00**

---

## Task 5: ir-005

**Ground Truth Summary:** Must mention: likely caching issue, P0 severity (data privacy violation), immediate mitigation (disable caching/cache-busting), investigate CDN/reverse proxy/app-level caching, may need to notify affected users. Must not: suggest it's an auth bug without evidence (caching more likely given intermittent + no code change).

### Condition D
- must_mention coverage: 5/5 -- caching issue (most likely cause), P0 severity, immediate mitigation (disable caching, flush sessions, restart instances), investigate CDN/proxy/app cache/session store, notify affected users + DPO
- must_not violations: None -- caching is primary hypothesis, auth mentioned only as secondary
- Completeness: 5 -- All items plus reproduction steps, verification protocol
- Precision: 5 -- Correctly identifies caching as most likely; session/thread-local as alternatives
- Actionability: 5 -- Ordered mitigation steps, maintenance mode fallback
- Structure: 5 -- Time-boxed, investigation protocol, verification section
- Efficiency: 4 -- Very comprehensive but lengthy
- Depth: 5 -- Cache-Control headers, Vary headers, sticky sessions, thread-local variables
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- caching (most likely), P0, disable caching/flush cache, CDN/proxy/session investigation, legal notification
- must_not violations: None -- correctly prioritizes caching over auth
- Completeness: 5 -- All items covered
- Precision: 5 -- Correct reasoning
- Actionability: 5 -- Verification steps (log user_id vs response_id)
- Structure: 4 -- Good but less formal than D
- Efficiency: 5 -- Very compact, high signal
- Depth: 4 -- Good diagnosis but less detail on investigation steps
- **Composite: 4.60**

### Condition F
- must_mention coverage: 5/5 -- caching (highest probability), P0, disable caching (CDN purge, Cache-Control), investigate CDN/proxy/session/thread safety, notify affected users
- must_not violations: None -- caching explicitly stated as highest probability
- Completeness: 5 -- All items plus maintenance mode consideration
- Precision: 5 -- Correct reasoning throughout
- Actionability: 5 -- Priority-ordered mitigation, 30-minute escalation rule
- Structure: 5 -- Clean time-boxed sections
- Efficiency: 5 -- Dense, well-organized
- Depth: 5 -- Cache-Control: no-store specific recommendation, session integrity monitoring
- **Composite: 5.00**

---

## Summary

| Task | D | E | F |
|------|---|---|---|
| ir-001 | 4.87 | 4.53 | 4.73 |
| ir-002 | 4.87 | 4.40 | 4.73 |
| ir-003 | 4.87 | 4.73 | 4.73 |
| ir-004 | 4.87 | 4.73 | 5.00 |
| ir-005 | 4.87 | 4.60 | 5.00 |
| **Mean** | **4.87** | **4.60** | **4.84** |
| E LIFT (vs D) | -- | -0.27 | -- |
| F LIFT (vs D) | -- | -- | -0.03 |
| F vs E | -- | -- | +0.24 |
