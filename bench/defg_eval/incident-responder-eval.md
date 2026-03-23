# incident-responder Evaluation (D/E/F/G/H/I)

## Task 1: ir-001

**Ground Truth Summary:** P0/P1 classification, first 5 min actions (acknowledge, war room, page on-call), check database/external dependencies/infrastructure, stakeholder communication template. Structure: time-boxed action plan, severity classification with reasoning, communication cadence.

### Condition D
- must_mention: 4/4 -- P0 classification, first 5 min actions, check DB/dependencies/infra, stakeholder communication
- must_not violations: None
- Completeness: 5 -- All items plus detailed investigation protocol, follow-up
- Precision: 5 -- P0 with clear reasoning
- Actionability: 5 -- Specific actions with role assignments
- Structure: 5 -- Time-boxed, severity table, communication template
- Efficiency: 4 -- Thorough
- Depth: 5 -- Ranked hypotheses, tiered mitigations
- **Composite: 4.87**

### Condition E
- must_mention: 4/4 -- All found
- must_not violations: None
- Completeness: 5 -- All items with stabilization options table
- Precision: 5 -- P0, correct reasoning
- Actionability: 5 -- Specific diagnostics with commands
- Structure: 4 -- Time-boxed but less formal than D
- Efficiency: 5 -- More concise, action-oriented
- Depth: 4 -- Good but less exhaustive investigation
- **Composite: 4.60**

### Condition F
- must_mention: 4/4 -- All found
- must_not violations: None
- Completeness: 5 -- All items
- Precision: 5 -- P0, correct reasoning
- Actionability: 5 -- Specific actions with priority table
- Structure: 5 -- Time-boxed with clear phases
- Efficiency: 4 -- Good
- Depth: 4 -- Good
- **Composite: 4.73**

### Condition G
- must_mention: 4/4 -- All found
- must_not violations: None
- Completeness: 5 -- All items with phased investigation (0-5, 5-15, 15-30 min)
- Precision: 5 -- P0 with detailed justification
- Actionability: 5 -- Specific diagnostics per phase, mitigation table
- Structure: 5 -- Excellent time-boxed structure with phases
- Efficiency: 4 -- Thorough
- Depth: 5 -- Distributed traces, connection pool leak, error type analysis
- **Composite: 4.87**

### Condition H
- must_mention: 4/4 -- All found
- must_not violations: None
- Completeness: 5 -- All items with resolution criteria
- Precision: 5 -- P0, detailed justification
- Actionability: 5 -- Specific actions with risk assessment per mitigation
- Structure: 5 -- Phased investigation, mitigation table with risk column
- Efficiency: 4 -- Thorough
- Depth: 5 -- Resolution criteria (p50 <500ms, error <1%), preserve-state step
- **Composite: 4.87**

### Condition I
- must_mention: 4/4 -- Same as H
- must_not violations: None
- Completeness: 5
- Precision: 5
- Actionability: 5
- Structure: 5
- Efficiency: 4
- Depth: 5
- **Composite: 4.87**

---

## Task 2: ir-002

**Ground Truth Summary:** External dependency failure, check gateway outage, fallback/retry strategy, customer communication, revenue impact estimation. Must not: suggest rolling back (no recent deployment, external issue).

### Condition D
- must_mention: 5/5 -- External dependency, gateway outage check, fallback/retry, customer communication, revenue impact (reconciliation mentioned)
- must_not violations: None -- does not suggest rollback
- Completeness: 5 -- All five items
- Precision: 5 -- P1 correct, notes 2-day deployment unlikely cause
- Actionability: 5 -- Specific investigation and mitigation steps
- Structure: 5 -- Time-boxed, communication template
- Efficiency: 4 -- Thorough
- Depth: 5 -- Connection pool, TLS, DNS, firewall all considered
- **Composite: 4.87**

### Condition E
- must_mention: 5/5 -- All found
- must_not violations: None
- Completeness: 5 -- All items
- Precision: 5 -- P1 correct
- Actionability: 5 -- Good options table
- Structure: 4 -- Good but less formal
- Efficiency: 5 -- Concise
- Depth: 4 -- Good
- **Composite: 4.60**

### Condition F
- must_mention: 5/5 -- All found
- must_not violations: None
- Completeness: 5 -- All items with reconciliation
- Precision: 5 -- P1, correct external dependency classification
- Actionability: 5 -- Priority table with mitigation options
- Structure: 5 -- Time-boxed, communication plan
- Efficiency: 4 -- Good
- Depth: 4 -- Good
- **Composite: 4.73**

### Condition G
- must_mention: 5/5 -- All found with revenue impact tracking
- must_not violations: None -- considers 2-day deploy but notes unlikely
- Completeness: 5 -- All items with detailed partial failure analysis
- Precision: 5 -- P1, excellent partial failure reasoning (10% not 100%)
- Actionability: 5 -- Detailed mitigation table
- Structure: 5 -- Phased investigation, communication cadence
- Efficiency: 4 -- Thorough
- Depth: 5 -- TCP vs HTTP error distinction, stale DNS analysis
- **Composite: 4.87**

### Condition H
- must_mention: 5/5 -- All found
- must_not violations: None
- Completeness: 5 -- All items with revenue impact formula
- Precision: 5 -- P1, detailed partial failure analysis
- Actionability: 5 -- Detailed mitigation table with risk column
- Structure: 5 -- Phased investigation (external vs internal first)
- Efficiency: 4 -- Thorough
- Depth: 5 -- Revenue impact formula, TLS/cert analysis, connection pool staleness
- **Composite: 4.87**

### Condition I
- must_mention: 5/5 -- Same as H
- must_not violations: None
- Completeness: 5
- Precision: 5
- Actionability: 5
- Structure: 5
- Efficiency: 4
- Depth: 5
- **Composite: 4.87**

---

## Task 3: ir-003

**Ground Truth Summary:** Calculate time to 100% (~7.5h), immediate actions (identify large tables, temp files, logs), short-term (archive/purge, expand disk), long-term (retention policies, monitoring at 80%). Structure: time-to-failure estimate, prioritized action list.

### Condition D
- must_mention: 4/4 -- 7.5h estimate, identify consumers, short-term actions, long-term prevention
- must_not violations: None
- Completeness: 5 -- All items with three tiers
- Precision: 5 -- P1 with escalation to P0 timeline
- Actionability: 5 -- Tiered actions with specific commands
- Structure: 5 -- Time-to-failure, tiered mitigation
- Efficiency: 4 -- Thorough
- Depth: 5 -- WAL/binlog, table bloat, batch jobs considered
- **Composite: 4.87**

### Condition E
- must_mention: 4/4 -- All found
- must_not violations: None
- Completeness: 5 -- All items in 3 phases
- Precision: 5 -- P1, correct 7.5h estimate
- Actionability: 5 -- Specific actions with escalation criteria
- Structure: 5 -- Three phases with clear timeline
- Efficiency: 5 -- Concise and well-organized
- Depth: 4 -- Good but less detail on specific DB commands
- **Composite: 4.73**

### Condition F
- must_mention: 4/4 -- All found
- must_not violations: None
- Completeness: 5 -- All items
- Precision: 4 -- P2 severity (should be at least P1 given imminent outage)
- Actionability: 5 -- Priority table with space recovery estimates
- Structure: 5 -- Time-boxed phases
- Efficiency: 4 -- Good
- Depth: 4 -- Good
- **Composite: 4.47**

### Condition G
- must_mention: 4/4 -- All found
- must_not violations: None
- Completeness: 5 -- All items with detailed investigation
- Precision: 4 -- P2 initial (same issue as F, but includes escalation criteria)
- Actionability: 5 -- Phased mitigation with expected space recovery
- Structure: 5 -- Phases with escalation criteria
- Efficiency: 4 -- Thorough
- Depth: 5 -- WAL archiving, replication lag, long-running transactions
- **Composite: 4.60**

### Condition H
- must_mention: 4/4 -- All found
- must_not violations: None
- Completeness: 5 -- All items with critical warnings section
- Precision: 5 -- P1, correct reasoning about imminent P0
- Actionability: 5 -- Phased mitigation with risk/recovery tables, critical warnings
- Structure: 5 -- Phased with monitoring during mitigation section
- Efficiency: 4 -- Thorough
- Depth: 5 -- Critical warnings about VACUUM FULL under disk pressure, batch DELETE WAL generation
- **Composite: 4.87**

### Condition I
- must_mention: 4/4 -- Same as H
- must_not violations: None
- Completeness: 5
- Precision: 5
- Actionability: 5
- Structure: 5
- Efficiency: 4
- Depth: 5
- **Composite: 4.87**

---

## Task 4: ir-004

**Ground Truth Summary:** Immediately revoke key, audit CloudTrail/access logs, identify accessed data, legal/compliance notification (GDPR, breach disclosure), rotate all related credentials. Structure: immediate containment (minutes), investigation (hours), notification/compliance (24-72h).

### Condition D
- must_mention: 5/5 -- Revoke key, audit CloudTrail, identify data, legal/GDPR, rotate credentials
- must_not violations: None
- Completeness: 5 -- All five items with detailed protocol
- Precision: 5 -- P0 security incident, correct prioritization
- Actionability: 5 -- Step-by-step with specific AWS actions
- Structure: 5 -- Minutes/hours/days phasing
- Efficiency: 4 -- Thorough
- Depth: 5 -- Lateral movement, evidence preservation, pre-commit hooks
- **Composite: 4.87**

### Condition E
- must_mention: 5/5 -- All found
- must_not violations: None
- Completeness: 5 -- All items in 3 phases
- Precision: 5 -- P0 security, correct
- Actionability: 5 -- AWS CLI commands
- Structure: 5 -- 15min/2h/24h phases
- Efficiency: 5 -- Very concise yet complete
- Depth: 4 -- Good but less detail on forensics
- **Composite: 4.73**

### Condition F
- must_mention: 5/5 -- All found
- must_not violations: None
- Completeness: 5 -- All items
- Precision: 5 -- P0
- Actionability: 5 -- Specific actions and mitigation table
- Structure: 5 -- Time-boxed phases
- Efficiency: 4 -- Good
- Depth: 5 -- Forensics firm engagement, credential hygiene audit
- **Composite: 4.87**

### Condition G
- must_mention: 5/5 -- All found
- must_not violations: None
- Completeness: 5 -- All items with detailed forensic protocol
- Precision: 5 -- P0, correct prioritization
- Actionability: 5 -- Step-by-step with AWS CLI commands
- Structure: 5 -- Critical sequence (T+0 to T+15min), phases
- Efficiency: 4 -- Very thorough
- Depth: 5 -- Repository traffic/fork analysis, lateral movement checks, persistence mechanisms
- **Composite: 4.87**

### Condition H
- must_mention: 5/5 -- All found
- must_not violations: None
- Completeness: 5 -- All items with resolution criteria
- Precision: 5 -- P0, correct
- Actionability: 5 -- AWS CLI commands, step-by-step with timing
- Structure: 5 -- T+0 to T+2min, T+2 to T+5min, etc.
- Efficiency: 4 -- Very thorough
- Depth: 5 -- GuardDuty, data classification, persistence mechanisms, repo traffic
- **Composite: 4.87**

### Condition I
- must_mention: 5/5 -- Same as H
- must_not violations: None
- Completeness: 5
- Precision: 5
- Actionability: 5
- Structure: 5
- Efficiency: 4
- Depth: 5
- **Composite: 4.87**

---

## Task 5: ir-005

**Ground Truth Summary:** Likely caching issue, P0 severity (data privacy violation), immediate mitigation (disable caching/cache-busting), investigate CDN/reverse proxy/application-level caching, may need to notify affected users. Must not: suggest auth bug without evidence (caching more likely given intermittent + no code change).

### Condition D
- must_mention: 5/5 -- Caching issue identified, P0, disable caching, investigate CDN/proxy/app cache, user notification
- must_not violations: None -- correctly prioritizes caching over auth bug
- Completeness: 5 -- All five items with detailed investigation
- Precision: 5 -- P0, caching as primary hypothesis
- Actionability: 5 -- Immediate containment options prioritized
- Structure: 5 -- Time-boxed, prioritized investigation
- Efficiency: 4 -- Thorough
- Depth: 5 -- Thread-local leaks, session store contamination, Vary headers
- **Composite: 4.87**

### Condition E
- must_mention: 5/5 -- All found
- must_not violations: None -- lists caching as most likely
- Completeness: 5 -- All items
- Precision: 5 -- P0, correct
- Actionability: 5 -- FLUSH ALL CACHES NOW
- Structure: 4 -- Good but less formal
- Efficiency: 5 -- Concise and action-oriented
- Depth: 4 -- Good but less investigation detail
- **Composite: 4.60**

### Condition F
- must_mention: 5/5 -- All found
- must_not violations: None -- caching first
- Completeness: 5 -- All items
- Precision: 5 -- P0, caching priority
- Actionability: 5 -- Priority table, cache purge first
- Structure: 5 -- Time-boxed with mitigation table
- Efficiency: 4 -- Good
- Depth: 5 -- CDN config, sticky sessions, connection pooling, thread safety
- **Composite: 4.87**

### Condition G
- must_mention: 5/5 -- All found
- must_not violations: None -- ranked hypotheses with caching first
- Completeness: 5 -- All items with 5 hypotheses
- Precision: 5 -- P0, correct
- Actionability: 5 -- Prioritized mitigation with maintenance mode fallback
- Structure: 5 -- Ranked hypotheses, phased investigation
- Efficiency: 4 -- Very thorough
- Depth: 5 -- Cache key collision dynamics, RNG entropy, connection pool state leak
- **Composite: 4.87**

### Condition H
- must_mention: 5/5 -- All found
- must_not violations: None -- ranked hypotheses with session cache corruption highest
- Completeness: 5 -- All items with 5 hypotheses and forensic requirements
- Precision: 5 -- P0, excellent hypothesis ranking
- Actionability: 5 -- Mitigation table with risk/speed columns
- Structure: 5 -- Ranked hypotheses, forensic requirements, resolution criteria
- Efficiency: 4 -- Very thorough
- Depth: 5 -- Cache node failure dynamics, entropy pool exhaustion, emergency trace logging
- **Composite: 4.87**

### Condition I
- must_mention: 5/5 -- Same as H
- must_not violations: None
- Completeness: 5
- Precision: 5
- Actionability: 5
- Structure: 5
- Efficiency: 4
- Depth: 5
- **Composite: 4.87**

---

## Summary

| Task | D | E | F | G | H | I |
|------|---|---|---|---|---|---|
| ir-001 | 4.87 | 4.60 | 4.73 | 4.87 | 4.87 | 4.87 |
| ir-002 | 4.87 | 4.60 | 4.73 | 4.87 | 4.87 | 4.87 |
| ir-003 | 4.87 | 4.73 | 4.47 | 4.60 | 4.87 | 4.87 |
| ir-004 | 4.87 | 4.73 | 4.87 | 4.87 | 4.87 | 4.87 |
| ir-005 | 4.87 | 4.60 | 4.87 | 4.87 | 4.87 | 4.87 |
| **Mean** | **4.87** | **4.65** | **4.73** | **4.82** | **4.87** | **4.87** |
