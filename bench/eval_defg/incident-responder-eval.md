# incident-responder Evaluation (D/E/F/G)

## Task 1: ir-001

**Ground Truth Summary:** API response time spike. Must mention: P0/P1 classification, first 5 min actions (acknowledge, war room, page on-call), check database/dependencies/infrastructure, stakeholder communication template. Structure: time-boxed action plan, severity classification with reasoning, communication cadence.

### Condition D
- must_mention coverage: 4/4 -- P0 classification with reasoning, first 5 min actions (war room, paging), check DB/dependencies/infra, stakeholder communication template
- must_not violations: None
- Code artifacts: None (not applicable for this agent type)
- Completeness: 5 -- All required elements, plus detailed investigation protocol and follow-up
- Precision: 5 -- Correct P0 classification, accurate reasoning
- Actionability: 5 -- Specific parallel tasks for OL, concrete mitigation steps
- Structure: 5 -- Time-boxed phases, roles assigned, communication template
- Efficiency: 5 -- Well organized, no fluff
- Depth: 5 -- Ranked hypotheses, stabilization options per root cause, postmortem planning
- **Composite: 5.00**

### Condition E
- must_mention coverage: 4/4 -- P0, diagnostic steps, DB/cache/network checks, communication template
- must_not violations: None
- Code artifacts: N/A
- Completeness: 5 -- All required elements
- Precision: 5 -- Correct classification
- Actionability: 5 -- Stabilization options table with recovery times
- Structure: 4 -- Less time-boxed than D; organized but more compact
- Efficiency: 5 -- Very concise, high signal
- Depth: 4 -- Good but less detailed than D's phased investigation
- **Composite: 4.73**

### Condition F
- must_mention coverage: 4/4 -- P0, first 5 min actions, dependency checks, communication
- must_not violations: None
- Code artifacts: N/A
- Completeness: 5 -- All required elements
- Precision: 5 -- Correct classification
- Actionability: 5 -- Prioritized mitigation table
- Structure: 5 -- Clear phase separation (immediate, investigation, mitigation, follow-up)
- Efficiency: 5 -- Well structured
- Depth: 4 -- Good coverage, mentions GC pauses, AZ failures
- **Composite: 4.73**

### Condition G
- must_mention coverage: 4/4 -- P0 with reasoning, war room + paging, DB/dependency checks, status page communication
- must_not violations: None
- Code artifacts: N/A
- Completeness: 5 -- All required elements, extremely detailed
- Precision: 5 -- Correct P0 classification with thorough justification
- Actionability: 5 -- Detailed phased investigation (5min, 15min, 30min), concrete mitigation options
- Structure: 5 -- Excellent time-boxed phases, roles, communication plan
- Efficiency: 4 -- Very thorough but lengthy; some repetition
- Depth: 5 -- Distributed traces, connection pool analysis, multi-region failover
- **Composite: 4.87**

---

## Task 2: ir-002

**Ground Truth Summary:** Payment processing failures. Must mention: external dependency failure, check gateway outage, fallback/retry strategy, customer communication, revenue impact estimation. Must not: suggest rolling back (no recent deployment, external issue).

### Condition D
- must_mention coverage: 5/5 -- external dependency, check gateway status, retry/fallback, customer comms, revenue impact
- must_not violations: None -- does not suggest rollback
- Code artifacts: N/A
- Completeness: 5 -- All five required elements
- Precision: 5 -- Correct P1, avoids rollback
- Actionability: 5 -- Specific investigation steps, mitigation options
- Structure: 5 -- Time-boxed, communication cadence
- Efficiency: 5 -- Focused
- Depth: 5 -- Connection pool analysis, certificate checks, reconciliation
- **Composite: 5.00**

### Condition E
- must_mention coverage: 5/5 -- all required elements
- must_not violations: None
- Code artifacts: N/A
- Completeness: 5 -- All five
- Precision: 5 -- Correct, avoids rollback
- Actionability: 5 -- Backup gateway, retry queue
- Structure: 4 -- Organized but more compact
- Efficiency: 5 -- Concise
- Depth: 4 -- Good but less investigation detail than D
- **Composite: 4.73**

### Condition F
- must_mention coverage: 5/5 -- all required elements
- must_not violations: None
- Code artifacts: N/A
- Completeness: 5 -- All five required
- Precision: 5 -- Correct P1
- Actionability: 5 -- Prioritized mitigation table, customer script
- Structure: 5 -- Well organized phases
- Efficiency: 5 -- Good signal-to-noise
- Depth: 4 -- Good, mentions TLS cert check
- **Composite: 4.73**

### Condition G
- must_mention coverage: 5/5 -- external dependency, gateway status check, failover/retry, customer communication, revenue impact estimation
- must_not violations: None -- explicitly notes last deploy was 2 days ago, rules out code regression
- Code artifacts: N/A
- Completeness: 5 -- All required elements, extremely detailed
- Precision: 5 -- Correct P1 with thorough justification
- Actionability: 5 -- 12 investigation steps across 3 phases, 6 mitigation options
- Structure: 5 -- Excellent phase structure (External vs Internal, Config, Application-level)
- Efficiency: 4 -- Very thorough but lengthy
- Depth: 5 -- TLS certificates, DNS changes, connection pool decay, credential rotation
- **Composite: 4.87**

---

## Task 3: ir-003

**Ground Truth Summary:** Disk space critical. Must mention: calculate time to 100% (~7.5 hours), immediate actions (identify large tables, temp files, logs), short-term (archive/purge, expand disk), long-term (retention policies, monitoring at 80%). Structure: time-to-failure estimate, prioritized action list.

### Condition D
- must_mention coverage: 4/4 -- 7.5 hour calculation, immediate actions, short-term, long-term
- must_not violations: None
- Code artifacts: N/A
- Completeness: 5 -- All required elements with tiered urgency
- Precision: 5 -- Correct calculation, appropriate P1 with escalation path
- Actionability: 5 -- Tiered actions (1 hour, 2-3 hours, 1-2 weeks)
- Structure: 5 -- Excellent tiered urgency structure
- Efficiency: 5 -- Focused
- Depth: 5 -- WAL retention, dead tuples, binary logs, capacity planning
- **Composite: 5.00**

### Condition E
- must_mention coverage: 4/4 -- 7.5 hours, identify consumers, purge/expand, monitoring alerts
- must_not violations: None
- Code artifacts: N/A
- Completeness: 5 -- All required
- Precision: 5 -- Correct
- Actionability: 5 -- Three phases with specific commands (du, pg_stat_user_tables)
- Structure: 5 -- Clear phase separation
- Efficiency: 5 -- Very concise, efficient
- Depth: 4 -- Good but less detail on WAL/bloat
- **Composite: 4.73**

### Condition F
- must_mention coverage: 4/4 -- 7.5 hours, identify sources, mitigation tiers, monitoring
- must_not violations: None
- Code artifacts: N/A
- Completeness: 5 -- All required elements
- Precision: 4 -- Classifies as P2, which is debatable (ground truth doesn't specify but 95% disk on production DB serving 3 services is arguable P1)
- Actionability: 5 -- Prioritized table with space recovered column
- Structure: 5 -- Excellent format with escalation criteria
- Efficiency: 5 -- Well organized
- Depth: 4 -- Good, mentions batch jobs, temp tables
- **Composite: 4.60**

### Condition G
- must_mention coverage: 4/4 -- 7.5 hours (explicit calculation), identify consumers, mitigation tiers, long-term policies
- must_not violations: None
- Code artifacts: N/A
- Completeness: 5 -- All required elements, extremely detailed
- Precision: 4 -- Classifies as P2 (same concern as F)
- Actionability: 5 -- Specific PostgreSQL and MySQL commands, WAL slot cleanup
- Structure: 5 -- Excellent phased approach with escalation criteria
- Efficiency: 4 -- Very detailed, perhaps overly so
- Depth: 5 -- pg_replication_slots, idle in transaction queries, online volume expansion, table partitioning
- **Composite: 4.73**

---

## Task 4: ir-004

**Ground Truth Summary:** Data breach - exposed API key. Must mention: immediately revoke key, audit CloudTrail/access logs, identify accessed data, legal/compliance notification (GDPR, breach disclosure), rotate all related credentials. Structure: immediate containment (minutes), investigation (hours), notification/compliance (24-72h).

### Condition D
- must_mention coverage: 5/5 -- revoke key, audit CloudTrail, identify data, legal/GDPR, rotate credentials
- must_not violations: None
- Code artifacts: N/A
- Completeness: 5 -- All five required elements plus employee investigation, preventive measures
- Precision: 5 -- Correct P0 security classification
- Actionability: 5 -- Ordered containment steps, forensic analysis protocol
- Structure: 5 -- Containment (minutes), investigation (hours), compliance (24-72h)
- Efficiency: 5 -- Well organized
- Depth: 5 -- GitHub removal protocol, lateral movement checks, evidence preservation, blameless investigation
- **Composite: 5.00**

### Condition E
- must_mention coverage: 5/5 -- all required elements
- must_not violations: None
- Code artifacts: N/A
- Completeness: 5 -- All five
- Precision: 5 -- Correct
- Actionability: 5 -- Specific AWS CLI command for key deletion
- Structure: 5 -- Three phases (contain, assess, remediate)
- Efficiency: 5 -- Very concise and efficient
- Depth: 4 -- Good but less detail on lateral movement and evidence preservation
- **Composite: 4.73**

### Condition F
- must_mention coverage: 5/5 -- revoke key, CloudTrail, data scope, GDPR 72h, rotate credentials
- must_not violations: None
- Code artifacts: N/A
- Completeness: 5 -- All required
- Precision: 5 -- Correct P0
- Actionability: 5 -- Specific actions, prioritized table
- Structure: 5 -- Clear phase separation
- Efficiency: 5 -- Well organized
- Depth: 5 -- Lateral movement, IAM role migration, secret scanning tools
- **Composite: 5.00**

### Condition G
- must_mention coverage: 5/5 -- all required elements with extensive detail
- must_not violations: None
- Code artifacts: N/A
- Completeness: 5 -- All five required elements plus employee investigation, evidence preservation
- Precision: 5 -- Correct P0 with thorough justification
- Actionability: 5 -- Detailed step-by-step with explicit ordering; verification of revocation
- Structure: 5 -- Excellent phased structure (5 min, 4h, 24h, parallel)
- Efficiency: 4 -- Very thorough, slightly verbose
- Depth: 5 -- Repository traffic analysis, paste site monitoring, force-push history cleanup, STS AssumeRole migration
- **Composite: 4.87**

---

## Task 5: ir-005

**Ground Truth Summary:** Cross-user data leakage. Must mention: likely caching issue, P0 severity, immediate mitigation (disable caching/cache-busting), investigate CDN/proxy/application cache, may need to notify affected users. Must not: suggest it's an auth bug without evidence (caching more likely given intermittent + no code change).

### Condition D
- must_mention coverage: 5/5 -- caching issue (most likely), P0, disable caching, investigate CDN/proxy/app cache, user notification
- must_not violations: None -- explicitly ranks caching as most likely, lists auth as lower priority hypothesis
- Code artifacts: N/A
- Completeness: 5 -- All five required elements
- Precision: 5 -- Correct P0, correctly identifies caching as primary hypothesis
- Actionability: 5 -- Ordered mitigation steps, investigation protocol
- Structure: 5 -- Immediate containment, investigation, verification, follow-up
- Efficiency: 5 -- Well organized
- Depth: 5 -- Vary headers, session store contamination, thread-local leaks, connection pool state
- **Composite: 5.00**

### Condition E
- must_mention coverage: 5/5 -- caching most likely, P0, flush caches, CDN/proxy/session investigation, breach notification
- must_not violations: None -- lists caching first
- Code artifacts: N/A
- Completeness: 5 -- All five
- Precision: 5 -- Correct
- Actionability: 5 -- Cache-Control headers, session flush, verification steps
- Structure: 4 -- Well organized but less phased than D
- Efficiency: 5 -- Very concise
- Depth: 5 -- Cache key scoping, sticky sessions, thread safety
- **Composite: 4.87**

### Condition F
- must_mention coverage: 5/5 -- caching layer (highest probability), P0, disable CDN caching, investigate CDN/proxy/app cache, user notification
- must_not violations: None -- correctly prioritizes caching over auth
- Code artifacts: N/A
- Completeness: 5 -- All five required
- Precision: 5 -- Correct P0, caching prioritized
- Actionability: 5 -- Prioritized mitigation table, Cache-Control headers
- Structure: 5 -- Clear phases with 30-minute escalation to maintenance mode
- Efficiency: 5 -- Well structured
- Depth: 5 -- Session entropy, cookie overwriting, Vary headers, session integrity check
- **Composite: 5.00**

### Condition G
- must_mention coverage: 5/5 -- caching as most likely (4 hypotheses ranked), P0, disable CDN caching, investigate all layers, user notification and GDPR
- must_not violations: None -- explicitly ranks caching first, auth race condition listed as Hypothesis 4
- Code artifacts: N/A
- Completeness: 5 -- All five required elements, extremely detailed
- Precision: 5 -- Correct P0, excellent hypothesis ranking
- Actionability: 5 -- Diagnostic commands, verbose logging strategy, mitigation per hypothesis
- Structure: 5 -- Four ranked hypotheses, ordered mitigations, communication plan
- Efficiency: 4 -- Very thorough but lengthy (9 investigation steps, 4 hypotheses)
- Depth: 5 -- Session fixation, keep-alive state leaks, Set-Cookie header overwriting, session integrity hash
- **Composite: 4.87**

---

## Summary

| Task | D | E | F | G |
|------|---|---|---|---|
| ir-001 | 5.00 | 4.73 | 4.73 | 4.87 |
| ir-002 | 5.00 | 4.73 | 4.73 | 4.87 |
| ir-003 | 5.00 | 4.73 | 4.60 | 4.73 |
| ir-004 | 5.00 | 4.73 | 5.00 | 4.87 |
| ir-005 | 5.00 | 4.87 | 5.00 | 4.87 |
| **Mean** | **5.00** | **4.76** | **4.81** | **4.84** |
