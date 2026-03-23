# incident-responder Evaluation (D/E/F/I/L/M/N/O)

## Task ir-001: API Response Time Spike
**Ground Truth Summary:** Must classify P0/P1, provide first 5 min actions (acknowledge, war room, page on-call), check DB/external deps/infrastructure, stakeholder communication template. Time-boxed action plan, severity with reasoning, communication cadence.

### Condition D
- must_mention: 4/4 -- P0 classification, first 5 min actions (war room, paging), DB/deps/infrastructure checks, communication template
- Completeness: 5 -- All items thoroughly covered
- Precision: 5 -- P0 classification correct with reasoning
- Actionability: 5 -- Specific commands/checks, prioritized mitigations
- Structure: 5 -- Time-boxed sections, IMAG roles, communication template
- Efficiency: 4 -- Comprehensive but long
- Depth: 5 -- Hypotheses ranked by probability, postmortem questions
- **Composite: 4.87**

### Condition E
- must_mention: 4/4 -- All items covered
- Completeness: 5 -- All items
- Precision: 5 -- Correct P0 with reasoning
- Actionability: 5 -- Specific checks (SELECT 1, cache, DNS)
- Structure: 5 -- Time-boxed, options table, communication template
- Efficiency: 5 -- Concise but complete
- Depth: 4 -- Good but less detailed than D
- **Composite: 4.87**

### Condition F
- must_mention: 4/4 -- All items
- Completeness: 5 -- All items with detailed investigation
- Precision: 5 -- Correct P0
- Actionability: 5 -- Ordered action list with time targets
- Structure: 5 -- Time-boxed, prioritized tables
- Efficiency: 4 -- Thorough
- Depth: 5 -- Detailed investigation steps, follow-up items
- **Composite: 4.87**

### Condition I
- must_mention: 4/4 -- All items
- Completeness: 5 -- Extremely thorough, all items covered
- Precision: 5 -- P0 correct, detailed reasoning
- Actionability: 5 -- Specific commands, time-boxed actions, mitigation table with risk levels
- Structure: 5 -- Structured with situation assessment, immediate actions, investigation, mitigation, communication, resolution criteria
- Efficiency: 3 -- Very long (600 lines for this task alone), excessive detail
- Depth: 5 -- Deepest analysis of all conditions
- **Composite: 4.60**

### Condition L
- must_mention: 4/4 -- All items
- Completeness: 5 -- All items with pattern matching framework
- Precision: 5 -- P0 correct
- Actionability: 5 -- Specific commands (dmesg, kubectl, dig), remediation table with rollback plans
- Structure: 5 -- IMAG roles, time-boxed, communication templates
- Efficiency: 4 -- Thorough but well organized
- Depth: 5 -- Root cause analysis approach, postmortem template
- **Composite: 4.87**

### Condition M
- must_mention: 4/4 -- All items
- Completeness: 5 -- All items with diagnostic checklist
- Precision: 5 -- P0 correct, IMAG roles
- Actionability: 5 -- Specific commands, time-boxed, checklist format
- Structure: 5 -- Good format with checkboxes
- Efficiency: 4 -- Well organized
- Depth: 5 -- Postmortem template included
- **Composite: 4.87**

### Condition N
- must_mention: 4/4 -- All items
- Completeness: 5 -- All items
- Precision: 5 -- P0 correct
- Actionability: 5 -- Time-boxed actions with specific minute markers
- Structure: 5 -- Pattern matching, IMAG roles, communication
- Efficiency: 4 -- Good organization
- Depth: 5 -- Root cause hypotheses ranked, remediation plan
- **Composite: 4.87**

### Condition O
- must_mention: 4/4 -- All items
- Completeness: 5 -- All items
- Precision: 5 -- P0 correct
- Actionability: 5 -- Minute-by-minute actions
- Structure: 5 -- IMAG roles, time-boxed, escalation criteria
- Efficiency: 4 -- Good
- Depth: 5 -- Retry storms as additional consideration
- **Composite: 4.87**

---

## Task ir-002: Payment Processing Failures
**Ground Truth Summary:** Must mention external dependency failure, check gateway outage, fallback/retry strategy, customer communication, revenue impact estimation. Must NOT suggest rolling back.

### Condition D
- must_mention: 5/5 -- external dep, gateway check, fallback/retry, customer comms, revenue impact (reconciliation)
- must_not violations: None -- does not suggest rollback
- Completeness: 5 -- All items
- Precision: 5 -- Correctly identifies external dependency
- Actionability: 5 -- Contact gateway, retry logic, failover options
- Structure: 5 -- Time-boxed, investigation steps
- Efficiency: 4 -- Thorough
- Depth: 5 -- Partial failure analysis (10% = partial gateway)
- **Composite: 4.87**

### Condition E
- must_mention: 5/5 -- All items
- must_not violations: None
- Completeness: 5 -- All items covered concisely
- Precision: 5 -- Correct classification
- Actionability: 5 -- Specific actions (curl, telnet)
- Structure: 5 -- Clean tables
- Efficiency: 5 -- Very concise and effective
- Depth: 4 -- Good but less depth on partial failure analysis
- **Composite: 4.87**

### Condition F
- must_mention: 5/5 -- All items including revenue tracking
- must_not violations: None
- Completeness: 5 -- All items
- Precision: 5 -- Correct
- Actionability: 5 -- Detailed mitigation options
- Structure: 5 -- Time-boxed, prioritized
- Efficiency: 4 -- Thorough
- Depth: 5 -- Revenue reconciliation, synthetic monitoring suggestion
- **Composite: 4.87**

### Condition I
- must_mention: 5/5 -- All items with revenue impact calculation formula
- must_not violations: None
- Completeness: 5 -- All items extremely thoroughly
- Precision: 5 -- Correct, detailed partial failure analysis
- Actionability: 5 -- Revenue calculation formula, failed transaction logging
- Structure: 5 -- Time-boxed, resolution criteria
- Efficiency: 3 -- Extremely long
- Depth: 5 -- Outstanding depth on partial failure analysis
- **Composite: 4.60**

### Condition L
- must_mention: 5/5 -- All items
- must_not violations: None
- Completeness: 5 -- All items with root cause analysis
- Precision: 5 -- Correct
- Actionability: 5 -- Detailed steps
- Structure: 5 -- IMAG roles, time-boxed
- Efficiency: 4 -- Good organization
- Depth: 5 -- Partial outage diagnostic analysis
- **Composite: 4.87**

### Condition M
- must_mention: 5/5 -- All items
- must_not violations: None
- Completeness: 5 -- All items
- Precision: 5 -- Correct
- Actionability: 5 -- Specific commands
- Structure: 5 -- Good format
- Efficiency: 4 -- Well organized
- Depth: 5 -- Good analysis
- **Composite: 4.87**

### Condition N
- must_mention: 5/5 -- All items
- must_not violations: None
- Completeness: 5 -- All items
- Precision: 5 -- Correct, partial failure analysis
- Actionability: 5 -- Minute-by-minute
- Structure: 5 -- Good format
- Efficiency: 4 -- Good
- Depth: 5 -- DNS round-robin analysis
- **Composite: 4.87**

### Condition O
- must_mention: 5/5 -- All items
- must_not violations: None
- Completeness: 5 -- All items
- Precision: 5 -- Correct
- Actionability: 5 -- Good actions
- Structure: 5 -- IMAG roles, time-boxed
- Efficiency: 4 -- Good
- Depth: 5 -- Partial failure analysis (subset IPs)
- **Composite: 4.87**

---

## Task ir-003: Database Disk Space Critical
**Ground Truth Summary:** Must calculate time to 100% (~7.5h), immediate actions (identify consumers, temp files, logs), short-term (archive/purge, expand disk), long-term (retention policies, 80% alerts). Time-to-failure estimate, prioritized action list.

### Condition D
- must_mention: 4/4 -- 7.5h calculation, immediate actions, short-term, long-term
- Completeness: 5 -- All items with tiered approach
- Precision: 5 -- Correct 7.5h estimate, P1 with escalation path
- Actionability: 5 -- Tiered actions with urgency labels
- Structure: 5 -- Three-tier system, time-boxed
- Efficiency: 4 -- Thorough
- Depth: 5 -- Binary logs, WAL, table bloat all considered
- **Composite: 4.87**

### Condition E
- must_mention: 4/4 -- 7.5h, immediate, short-term, long-term
- Completeness: 5 -- All items
- Precision: 5 -- Correct calculations
- Actionability: 5 -- Phased approach with specific actions
- Structure: 5 -- Three phases with time targets
- Efficiency: 5 -- Very concise and actionable
- Depth: 4 -- Good but less detailed on specific disk consumers
- **Composite: 4.87**

### Condition F
- must_mention: 4/4 -- All items
- Completeness: 5 -- All items, P2 with escalation triggers
- Precision: 4 -- P2 severity is arguably too low for 7.5h to outage
- Actionability: 5 -- Prioritized table with space recovery estimates
- Structure: 5 -- Good format
- Efficiency: 4 -- Thorough
- Depth: 5 -- Growth rate analysis, escalation criteria
- **Composite: 4.60**

### Condition I
- must_mention: 4/4 -- All items
- Completeness: 5 -- Extremely thorough
- Precision: 5 -- P1 correct, excellent time-to-failure reasoning
- Actionability: 5 -- Phased mitigation with risk/space estimates, CRITICAL WARNINGS section
- Structure: 5 -- Phased with time targets, monitoring instructions
- Efficiency: 3 -- Very long
- Depth: 5 -- Outstanding: warns NOT to run VACUUM FULL under disk pressure, NOT to add indexes
- **Composite: 4.60**

### Condition L
- must_mention: 4/4 -- All items
- Completeness: 5 -- All items
- Precision: 5 -- Correct
- Actionability: 5 -- Phased with time targets
- Structure: 5 -- IMAG roles, tiered
- Efficiency: 4 -- Good
- Depth: 5 -- Detailed disk consumer identification
- **Composite: 4.87**

### Condition M
- must_mention: 4/4 -- All items
- Completeness: 5 -- All items
- Precision: 5 -- Correct, good escalation triggers
- Actionability: 5 -- Phased actions
- Structure: 5 -- Good format
- Efficiency: 4 -- Well organized
- Depth: 4 -- Good
- **Composite: 4.73**

### Condition N
- must_mention: 4/4 -- All items
- Completeness: 5 -- All items
- Precision: 4 -- P2 severity is arguably too low
- Actionability: 5 -- Minute-by-minute actions
- Structure: 5 -- Good format
- Efficiency: 4 -- Good
- Depth: 5 -- Detailed analysis of WAL, replication, temp files
- **Composite: 4.60**

### Condition O
- must_mention: 4/4 -- All items
- Completeness: 5 -- All items
- Precision: 5 -- P1 correct with upgrade criteria
- Actionability: 5 -- Time-boxed, specific commands
- Structure: 5 -- Good format with escalation triggers
- Efficiency: 4 -- Good
- Depth: 5 -- WAL retention, batch job investigation
- **Composite: 4.87**

---

## Task ir-004: Data Breach (Exposed API Key)
**Ground Truth Summary:** Must mention: immediately revoke key, audit CloudTrail/access logs, identify accessed data, legal/compliance notifications (GDPR, breach disclosure), rotate all related credentials. Immediate containment (minutes), investigation (hours), notification (24-72h).

### Condition D
- must_mention: 5/5 -- revoke key, audit CloudTrail, identify data, legal/GDPR, rotate credentials
- Completeness: 5 -- All items with comprehensive structure
- Precision: 5 -- Correct priority (revoke first, investigate second)
- Actionability: 5 -- Step-by-step with ordering, preventive measures
- Structure: 5 -- Phased: containment, investigation, legal, follow-up
- Efficiency: 4 -- Thorough
- Depth: 5 -- Lateral movement checks, employee interview, evidence preservation
- **Composite: 4.87**

### Condition E
- must_mention: 5/5 -- All items
- Completeness: 5 -- All items with aws iam command
- Precision: 5 -- Correct, concise
- Actionability: 5 -- Specific AWS CLI command for key revocation
- Structure: 5 -- Three phases (contain, assess, remediate)
- Efficiency: 5 -- Very concise and effective
- Depth: 4 -- Good but less detail on lateral movement
- **Composite: 4.87**

### Condition F
- must_mention: 5/5 -- All items
- Completeness: 5 -- All items
- Precision: 5 -- Correct
- Actionability: 5 -- Specific commands, time-boxed phases
- Structure: 5 -- Non-negotiable first actions
- Efficiency: 4 -- Good
- Depth: 5 -- Lateral movement, GuardDuty recommendation
- **Composite: 4.87**

### Condition I
- must_mention: 5/5 -- All items
- Completeness: 5 -- Extremely thorough
- Precision: 5 -- Correct
- Actionability: 5 -- AWS CLI commands, step-by-step with timing
- Structure: 5 -- Detailed phased approach
- Efficiency: 3 -- Very long (280 lines for this task)
- Depth: 5 -- Outstanding: lateral movement, persistence mechanisms, evidence preservation, data classification
- **Composite: 4.60**

### Condition L
- must_mention: 5/5 -- All items
- Completeness: 5 -- All items
- Precision: 5 -- Correct
- Actionability: 5 -- Time-boxed, specific commands
- Structure: 5 -- IMAG roles, phased
- Efficiency: 4 -- Good
- Depth: 5 -- Comprehensive
- **Composite: 4.87**

### Condition M
- must_mention: 5/5 -- All items
- Completeness: 5 -- All items
- Precision: 5 -- Correct
- Actionability: 5 -- Phased, detailed
- Structure: 5 -- Good format
- Efficiency: 4 -- Good
- Depth: 5 -- IAM audit, GuardDuty
- **Composite: 4.87**

### Condition N
- must_mention: 5/5 -- All items
- Completeness: 5 -- All items
- Precision: 5 -- Correct
- Actionability: 5 -- Good actions
- Structure: 5 -- Good format
- Efficiency: 4 -- Good
- Depth: 5 -- Good analysis
- **Composite: 4.87**

### Condition O
- must_mention: 5/5 -- All items
- Completeness: 5 -- All items
- Precision: 5 -- Correct
- Actionability: 5 -- Time-boxed, minute markers
- Structure: 5 -- IMAG roles, phased
- Efficiency: 4 -- Good
- Depth: 5 -- Lateral movement, evidence preservation
- **Composite: 4.87**

---

## Task ir-005: Cross-User Data Leakage
**Ground Truth Summary:** Must mention: likely caching issue, P0 severity, immediate mitigation (disable caching/cache-busting), investigate CDN/proxy/app-level caching, may need to notify affected users. Must NOT suggest auth bug without evidence (caching more likely).

### Condition D
- must_mention: 5/5 -- caching issue (most likely), P0, disable caching, investigate CDN/proxy/app, notify affected users
- must_not violations: None -- correctly identifies caching as most likely, lists auth as secondary
- Completeness: 5 -- All items thoroughly covered
- Precision: 5 -- Correct P0, caching as primary hypothesis
- Actionability: 5 -- Flush caches, disable caching, flush sessions, maintenance mode as escalation
- Structure: 5 -- Phased: containment, investigation, verification, follow-up
- Efficiency: 4 -- Thorough
- Depth: 5 -- Cache-Control headers, Vary headers, session ID entropy, thread-local state
- **Composite: 4.87**

### Condition E
- must_mention: 5/5 -- All items
- must_not violations: None
- Completeness: 5 -- All items
- Precision: 5 -- Caching identified as most likely
- Actionability: 5 -- Flush caches, CDN check, session management
- Structure: 5 -- Clean format
- Efficiency: 5 -- Concise and effective
- Depth: 4 -- Good but less detailed than D
- **Composite: 4.87**

### Condition F
- must_mention: 5/5 -- All items
- must_not violations: None
- Completeness: 5 -- All items with privacy impact
- Precision: 5 -- Correct P0
- Actionability: 5 -- Prioritized mitigation table with timing
- Structure: 5 -- Good format
- Efficiency: 4 -- Thorough
- Depth: 5 -- Cache-Control: no-store, private suggested
- **Composite: 4.87**

### Condition I
- must_mention: 5/5 -- All items
- must_not violations: None
- Completeness: 5 -- Extremely thorough
- Precision: 5 -- Correct, five hypotheses ranked by probability
- Actionability: 5 -- Emergency logging, mitigation options, forensic requirements
- Structure: 5 -- Comprehensive with resolution criteria
- Efficiency: 3 -- Very long
- Depth: 5 -- Outstanding: entropy pool exhaustion, connection pooling, auto-scaling events
- **Composite: 4.60**

### Condition L
- must_mention: 5/5 -- All items
- must_not violations: None
- Completeness: 5 -- All items
- Precision: 5 -- Correct
- Actionability: 5 -- Good actions
- Structure: 5 -- Good format
- Efficiency: 4 -- Good
- Depth: 5 -- Session ID collision analysis, sticky sessions
- **Composite: 4.87**

### Condition M
- must_mention: 5/5 -- All items
- must_not violations: None
- Completeness: 5 -- All items
- Precision: 5 -- Correct
- Actionability: 5 -- Good actions
- Structure: 5 -- Good format
- Efficiency: 4 -- Good
- Depth: 5 -- Good analysis
- **Composite: 4.87**

### Condition N
- must_mention: 5/5 -- All items
- must_not violations: None
- Completeness: 5 -- All items
- Precision: 5 -- Correct
- Actionability: 5 -- Good actions
- Structure: 5 -- Good format
- Efficiency: 4 -- Good
- Depth: 5 -- Good analysis, regulatory implications
- **Composite: 4.87**

### Condition O
- must_mention: 5/5 -- All items
- must_not violations: None
- Completeness: 5 -- All items
- Precision: 5 -- Correct
- Actionability: 5 -- Good minute-by-minute
- Structure: 5 -- IMAG roles, phased
- Efficiency: 4 -- Good
- Depth: 5 -- VP escalation at 10 min
- **Composite: 4.87**

---

## Summary

| Task | D | E | F | I | L | M | N | O |
|------|---|---|---|---|---|---|---|---|
| ir-001 | 4.87 | 4.87 | 4.87 | 4.60 | 4.87 | 4.87 | 4.87 | 4.87 |
| ir-002 | 4.87 | 4.87 | 4.87 | 4.60 | 4.87 | 4.87 | 4.87 | 4.87 |
| ir-003 | 4.87 | 4.87 | 4.60 | 4.60 | 4.87 | 4.73 | 4.60 | 4.87 |
| ir-004 | 4.87 | 4.87 | 4.87 | 4.60 | 4.87 | 4.87 | 4.87 | 4.87 |
| ir-005 | 4.87 | 4.87 | 4.87 | 4.60 | 4.87 | 4.87 | 4.87 | 4.87 |
| **Mean** | **4.87** | **4.87** | **4.82** | **4.60** | **4.87** | **4.84** | **4.82** | **4.87** |
