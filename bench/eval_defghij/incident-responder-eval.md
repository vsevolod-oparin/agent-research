# incident-responder Evaluation (D/E/F/G/H/I/J)

## Task ir-001: API Response Time Spike
**Ground Truth Summary:** Must mention P0/P1 classification, first 5 min actions (acknowledge, war room, page on-call), check database/dependencies/infrastructure, stakeholder communication template. Structure: time-boxed plan, severity with reasoning, communication cadence.

### Condition D
- must_mention: 4/4 -- P0 classification, war room + paging, DB/dependencies/infra checks, stakeholder communication template
- must_not violations: None
- Completeness: 5 -- All required elements plus ranked hypotheses, tiered mitigations
- Precision: 5 -- P0 correctly justified with reasoning
- Actionability: 5 -- Specific parallel investigation tasks, mitigation options per root cause
- Structure: 5 -- Time-boxed sections, severity table, communication cadence
- Efficiency: 4 -- Thorough but some redundancy
- Depth: 5 -- Certificate expiry, auto-scaling events, batch jobs as hypotheses
- **Composite: 4.87**

### Condition E
- must_mention: 4/4 -- P0, diagnostic steps, DB/cache/network checks, communication template
- must_not violations: None
- Completeness: 5 -- All required
- Precision: 5 -- Correct P0 with reasoning
- Actionability: 5 -- Specific diagnostic commands (SELECT 1), stabilization options table with recovery times
- Structure: 5 -- Clean table format, ordered steps
- Efficiency: 5 -- Concise and action-oriented, no padding
- Depth: 4 -- Good but less detailed than D
- **Composite: 4.87**

### Condition F
- must_mention: 4/4 -- P0, first 5 min actions, DB/dependencies, communication template
- must_not violations: None
- Completeness: 5 -- All required with GC pauses, AZ failure considerations
- Precision: 5 -- Correct P0 classification
- Actionability: 5 -- Prioritized mitigation table
- Structure: 5 -- Time-boxed sections, mitigation table
- Efficiency: 4 -- Good density
- Depth: 4 -- Mentions JVM GC pauses, auto-scaling
- **Composite: 4.73**

### Condition G
- must_mention: 4/4 -- P0, war room + paging, phased investigation, communication
- must_not violations: None
- Completeness: 5 -- All required with three-phase investigation (triage/narrow/deep dive)
- Precision: 5 -- Correct P0 with detailed justification
- Actionability: 5 -- Phased approach with specific commands and tools
- Structure: 5 -- Phase 1/2/3 structure, mitigation table with risk levels
- Efficiency: 4 -- Very thorough, perhaps slightly long
- Depth: 5 -- Distributed tracing mention, connection pool leak, error type classification
- **Composite: 4.87**

### Condition H
- must_mention: 4/4 -- All required
- must_not violations: None
- Completeness: 5 -- All required plus resolution criteria, preserve-state step
- Precision: 5 -- P0 with detailed reasoning
- Actionability: 5 -- Mitigation table with risk column, resolution criteria with specific SLI thresholds
- Structure: 5 -- Situation assessment table, phased investigation, mitigation table, resolution criteria
- Efficiency: 4 -- Comprehensive
- Depth: 5 -- Resolution criteria (p50 < 500ms, error < 1%, sustained 15 min), query timeout enforcement
- **Composite: 4.87**

### Condition I
- must_mention: 4/4 -- Same as H
- must_not violations: None
- Completeness: 5 -- Same as H
- Precision: 5 -- Same as H
- Actionability: 5 -- Same as H
- Structure: 5 -- Same as H
- Efficiency: 4 -- Same as H
- Depth: 5 -- Same as H
- **Composite: 4.87**

### Condition J
- must_mention: 4/4 -- P0, war room, hypotheses ranked, communication
- must_not violations: None
- Completeness: 4 -- All required but less detailed communication template
- Precision: 5 -- Correct P0, good hypothesis ranking
- Actionability: 4 -- Quick fix readiness section; less detailed investigation steps
- Structure: 4 -- Hypothesis table, but less structured than G/H/I
- Efficiency: 5 -- Very concise and action-oriented
- Depth: 4 -- "Working theory" framing with confidence level is good; less detailed mitigation
- **Composite: 4.40**

---

## Task ir-002: Payment Processing Failures
**Ground Truth Summary:** Must mention external dependency failure, check gateway outage, fallback/retry, customer communication, revenue impact estimation. Must NOT suggest rolling back.

### Condition D
- must_mention: 5/5 -- External dependency, gateway status check, fallback/retry, customer communication, revenue impact (via reconciliation)
- must_not violations: None -- does not suggest rollback
- Completeness: 5 -- All required plus TLS/cert checks, connection pool investigation
- Precision: 5 -- P1 correctly justified; external dependency correctly identified
- Actionability: 5 -- Specific investigation steps, mitigation table
- Structure: 5 -- Time-boxed, communication template
- Efficiency: 4 -- Thorough
- Depth: 5 -- Delayed deployment effects, connection leak consideration
- **Composite: 4.87**

### Condition E
- must_mention: 5/5 -- All required
- must_not violations: None
- Completeness: 5 -- All required
- Precision: 5 -- P1 correct
- Actionability: 5 -- Specific diagnostic commands (curl, telnet)
- Structure: 4 -- Less structured than D
- Efficiency: 5 -- Very concise
- Depth: 4 -- Good but less detailed
- **Composite: 4.73**

### Condition F
- must_mention: 5/5 -- All required
- must_not violations: None
- Completeness: 5 -- All required plus API credential check, synthetic monitoring
- Precision: 5 -- P1 correct
- Actionability: 5 -- Prioritized mitigation table
- Structure: 5 -- Good format
- Efficiency: 4 -- Thorough
- Depth: 5 -- Dead-letter queue, idempotency, TLS certificate check
- **Composite: 4.87**

### Condition G
- must_mention: 5/5 -- All required with detailed revenue impact estimation formula
- must_not violations: None
- Completeness: 5 -- All required plus partial failure analysis (why 10% not 100%)
- Precision: 5 -- P1 with excellent partial failure analysis
- Actionability: 5 -- Multi-step investigation, mitigation with risk levels
- Structure: 5 -- Phased investigation, revenue tracking section
- Efficiency: 4 -- Very detailed
- Depth: 5 -- Revenue loss formula, DNS round-robin, TLS cert, delayed deploy effects
- **Composite: 4.87**

### Condition H
- must_mention: 5/5 -- All required with revenue impact tracking section
- must_not violations: None
- Completeness: 5 -- All required
- Precision: 5 -- P1 with detailed partial failure analysis
- Actionability: 5 -- Revenue impact formula, double-charge prevention
- Structure: 5 -- Phased investigation, revenue tracking, resolution criteria
- Efficiency: 4 -- Comprehensive
- Depth: 5 -- DNS re-resolution, connection pool flush, idempotency guarantees
- **Composite: 4.87**

### Condition I
- must_mention: 5/5 -- Same as H
- must_not violations: None
- Completeness: 5 -- Same as H
- Precision: 5 -- Same as H
- Actionability: 5 -- Same as H
- Structure: 5 -- Same as H
- Efficiency: 4 -- Same as H
- Depth: 5 -- Same as H
- **Composite: 4.87**

### Condition J
- must_mention: 5/5 -- External dependency, gateway check, retry/failover, communication, revenue (implicit)
- must_not violations: None
- Completeness: 4 -- All required but revenue impact less explicit
- Precision: 5 -- Correct classification
- Actionability: 4 -- Good but less detailed mitigation
- Structure: 4 -- Hypothesis table, less detailed structure
- Efficiency: 5 -- Very concise
- Depth: 4 -- Good hypothesis ranking but less investigation detail
- **Composite: 4.40**

---

## Task ir-003: Database Disk Space Critical
**Ground Truth Summary:** Must mention time-to-failure calculation (~7.5 hours), immediate actions (identify large tables, temp files, logs), short-term (archive/purge, expand disk), long-term (retention policies, monitoring at 80%).

### Condition D
- must_mention: 4/4 -- 7.5 hours calculation, immediate space recovery (logs, temp, binlog), expand disk, retention policies + monitoring alerts at 70/80/90%
- must_not violations: None
- Completeness: 5 -- All required with three tiers (immediate/buy time/prevent recurrence)
- Precision: 5 -- P1 with escalation to P0 pathway
- Actionability: 5 -- Specific actions per tier with expected outcomes
- Structure: 5 -- Tiered structure, deadline tracking
- Efficiency: 4 -- Thorough
- Depth: 5 -- WAL retention, vacuum considerations, partition suggestions
- **Composite: 4.87**

### Condition E
- must_mention: 4/4 -- 7.5 hours, quick wins, root cause, permanent fix
- must_not violations: None
- Completeness: 5 -- All required in three phases
- Precision: 5 -- P1 correct
- Actionability: 5 -- Specific commands (du -sh), phase targets
- Structure: 5 -- Three-phase structure
- Efficiency: 5 -- Very concise and action-oriented
- Depth: 4 -- Less detailed than D but effective
- **Composite: 4.87**

### Condition F
- must_mention: 4/4 -- 7.5 hours, identify consumers, expand/purge, retention + alerts at 70/80/90%
- must_not violations: None
- Completeness: 5 -- All required; P2 with escalation criteria
- Precision: 4 -- P2 classification is debatable (ground truth does not specify, but P1 seems more appropriate for 7.5 hour countdown)
- Actionability: 5 -- Space recovered estimates per action
- Structure: 5 -- Prioritized table with space recovered column
- Efficiency: 4 -- Good density
- Depth: 5 -- Orphaned temp files, autovacuum, batch size warning
- **Composite: 4.73**

### Condition G
- must_mention: 4/4 -- All required with extensive detail
- must_not violations: None
- Completeness: 5 -- All required with WAL archiving, replication lag, index creation warnings
- Precision: 5 -- P2 initially but with clear escalation to P1/P0 criteria
- Actionability: 5 -- Phased mitigation with expected recovery and risk levels
- Structure: 5 -- Phased with critical warnings section
- Efficiency: 4 -- Very detailed
- Depth: 5 -- Critical warnings (DO NOT run VACUUM FULL under disk pressure, DO NOT add index), batch DELETE warning
- **Composite: 4.87**

### Condition H
- must_mention: 4/4 -- All required
- must_not violations: None
- Completeness: 5 -- All required plus critical warnings section
- Precision: 5 -- P1 with escalation criteria
- Actionability: 5 -- Phased with expected recovery, monitoring during mitigation
- Structure: 5 -- Phased, critical warnings, resolution criteria
- Efficiency: 4 -- Comprehensive
- Depth: 5 -- VACUUM FULL warning, batch DELETE warning, replication slot cleanup
- **Composite: 4.87**

### Condition I
- must_mention: 4/4 -- Same as H
- must_not violations: None
- Completeness: 5 -- Same as H
- Precision: 5 -- Same as H
- Actionability: 5 -- Same as H
- Structure: 5 -- Same as H
- Efficiency: 4 -- Same as H
- Depth: 5 -- Same as H
- **Composite: 4.87**

### Condition J
- must_mention: 4/4 -- 7.5 hours, buy time actions, expand disk, retention/alerting
- must_not violations: None
- Completeness: 4 -- All required but less detailed
- Precision: 5 -- P2 with escalation trigger
- Actionability: 4 -- Ordered steps, less detailed
- Structure: 4 -- Step-by-step but less structured phases
- Efficiency: 5 -- Very concise
- Depth: 4 -- Hypothesis table with WAL/data/temp file breakdown
- **Composite: 4.40**

---

## Task ir-004: Potential Data Breach (Exposed API Key)
**Ground Truth Summary:** Must mention immediately revoke key, audit CloudTrail/access logs, identify accessed data, legal/compliance (GDPR, breach disclosure), rotate credentials. Structure: immediate containment (minutes), investigation (hours), notification (24-72h).

### Condition D
- must_mention: 5/5 -- Revoke key, CloudTrail audit, data scope assessment, GDPR/CCPA notification, credential rotation
- must_not violations: None
- Completeness: 5 -- All required plus employee investigation, secret scanning, evidence preservation
- Precision: 5 -- P0 security incident correctly classified
- Actionability: 5 -- Step-by-step immediate actions, forensic analysis checklist
- Structure: 5 -- Containment/investigation/compliance phases
- Efficiency: 4 -- Thorough
- Depth: 5 -- Pre-commit hooks, least-privilege, VPC endpoints, MFA for S3
- **Composite: 4.87**

### Condition E
- must_mention: 5/5 -- All required with AWS CLI command
- must_not violations: None
- Completeness: 5 -- All required
- Precision: 5 -- Correct P0 security
- Actionability: 5 -- AWS CLI command for key revocation, specific CloudTrail operations to check
- Structure: 5 -- Phased (contain/assess/remediate)
- Efficiency: 5 -- Very concise and action-focused
- Depth: 4 -- Good but less detailed than D
- **Composite: 4.87**

### Condition F
- must_mention: 5/5 -- All required
- must_not violations: None
- Completeness: 5 -- All required plus credential hygiene audit
- Precision: 5 -- Correct P0
- Actionability: 5 -- Specific investigation steps
- Structure: 5 -- Phased structure
- Efficiency: 4 -- Good density
- Depth: 5 -- IAM roles, SSO, company-wide audit
- **Composite: 4.87**

### Condition G
- must_mention: 5/5 -- All required with extensive detail
- must_not violations: None
- Completeness: 5 -- All required plus repository traffic analysis, dark web monitoring, evidence preservation
- Precision: 5 -- P0 with detailed blast radius assessment
- Actionability: 5 -- Phased with specific CloudTrail filters, GitHub cache purge
- Structure: 5 -- Phase 1 (blast radius)/Phase 2 (data impact)/Phase 3 (employee) with timeline
- Efficiency: 4 -- Very detailed
- Depth: 5 -- Repository fork/clone analysis, S3 Object Lock, paste site monitoring, lateral movement checks
- **Composite: 4.87**

### Condition H
- must_mention: 5/5 -- All required
- must_not violations: None
- Completeness: 5 -- All required plus persistence mechanisms, MFA, GuardDuty, data classification
- Precision: 5 -- P0 security, evidence preservation emphasis
- Actionability: 5 -- Containment table, IAM CLI commands, lateral movement checks
- Structure: 5 -- Detailed phases, containment table, resolution criteria
- Efficiency: 4 -- Comprehensive
- Depth: 5 -- Persistence mechanism check (new IAM users/roles), STS AssumeRole, MFA enforcement
- **Composite: 4.87**

### Condition I
- must_mention: 5/5 -- Same as H
- must_not violations: None
- Completeness: 5 -- Same as H
- Precision: 5 -- Same as H
- Actionability: 5 -- Same as H
- Structure: 5 -- Same as H
- Efficiency: 4 -- Same as H
- Depth: 5 -- Same as H
- **Composite: 4.87**

### Condition J
- must_mention: 5/5 -- Revoke key, CloudTrail, data scope, legal/GDPR, credential rotation
- must_not violations: None
- Completeness: 5 -- All required
- Precision: 5 -- P0 security, "treat as breach until proven otherwise"
- Actionability: 5 -- Time-targeted actions (under 2 min, under 10 min, under 30 min)
- Structure: 5 -- Exact sequence with time targets
- Efficiency: 5 -- Concise but complete
- Depth: 4 -- Good but less detailed forensics than G/H
- **Composite: 4.87**

---

## Task ir-005: Cross-User Data Leakage
**Ground Truth Summary:** Must mention likely caching issue, P0 severity, immediate mitigation (disable/flush cache), investigate CDN/proxy/app caching, may need user notification. Must NOT suggest auth bug without evidence.

### Condition D
- must_mention: 5/5 -- Caching as most likely cause, P0, disable/flush cache, CDN/proxy/app investigation, user notification + legal/DPO
- must_not violations: None -- does not jump to auth bug; caching is top hypothesis
- Completeness: 5 -- All required plus session store, connection pool, thread-local, auto-scaling
- Precision: 5 -- P0 correct; caching is top hypothesis
- Actionability: 5 -- Ordered mitigation (disable cache -> flush sessions -> restart -> maintenance mode)
- Structure: 5 -- Containment first, then investigation, then verification
- Efficiency: 4 -- Thorough
- Depth: 5 -- Thread-local variables, Vary headers, Cache-Control analysis, session entropy
- **Composite: 4.87**

### Condition E
- must_mention: 5/5 -- Caching, P0, flush caches, CDN check, legal mention
- must_not violations: None
- Completeness: 5 -- All required
- Precision: 5 -- Correct P0, caching top cause
- Actionability: 5 -- Immediate flush, verification steps
- Structure: 5 -- Hypotheses ranked, verification after mitigation
- Efficiency: 5 -- Very concise
- Depth: 4 -- Less detailed but effective
- **Composite: 4.87**

### Condition F
- must_mention: 5/5 -- Caching, P0, CDN/proxy/app cache check, disable caching, user notification
- must_not violations: None
- Completeness: 5 -- All required plus maintenance mode consideration, monitoring
- Precision: 5 -- P0 correct
- Actionability: 5 -- Prioritized mitigation table
- Structure: 5 -- Investigation steps, mitigation table
- Efficiency: 4 -- Good
- Depth: 5 -- Vary headers, sticky sessions, thread safety, response-level assertions
- **Composite: 4.87**

### Condition G
- must_mention: 5/5 -- All required with five ranked hypotheses
- must_not violations: None
- Completeness: 5 -- All required plus forensic requirements, entropy check
- Precision: 5 -- P0 correct, hypotheses ranked
- Actionability: 5 -- Mitigation table with risk/speed columns, recommended immediate action
- Structure: 5 -- Five hypotheses, investigation plan, mitigation table, forensic requirements
- Efficiency: 4 -- Very thorough
- Depth: 5 -- Session entropy, cache node failure dynamics, Set-Cookie header analysis, connection pool state leak
- **Composite: 4.87**

### Condition H
- must_mention: 5/5 -- All required
- must_not violations: None
- Completeness: 5 -- All required plus resolution criteria, forensic requirements
- Precision: 5 -- P0 correct, five hypotheses with probability ranking
- Actionability: 5 -- Mitigation table with risk/speed, recommended immediate action
- Structure: 5 -- Comprehensive with forensic requirements and resolution criteria
- Efficiency: 4 -- Very detailed
- Depth: 5 -- Entropy pool exhaustion, IaC changes, user-data integrity assertion middleware
- **Composite: 4.87**

### Condition I
- must_mention: 5/5 -- Same as H
- must_not violations: None
- Completeness: 5 -- Same as H
- Precision: 5 -- Same as H
- Actionability: 5 -- Same as H
- Structure: 5 -- Same as H
- Efficiency: 4 -- Same as H
- Depth: 5 -- Same as H
- **Composite: 4.87**

### Condition J
- must_mention: 5/5 -- Caching, P0, maintenance mode/disable caching, CDN check, legal/regulatory
- must_not violations: None
- Completeness: 5 -- All required
- Precision: 5 -- P0, cache hit rate correlation insight
- Actionability: 5 -- Immediate maintenance mode recommendation, quick fixes per hypothesis
- Structure: 4 -- Hypothesis table, but less detailed investigation plan
- Efficiency: 5 -- Concise and action-oriented
- Depth: 4 -- Cache hit rate correlation is clever; less detailed investigation steps
- **Composite: 4.73**

---

## Summary

| Task | D | E | F | G | H | I | J |
|------|---|---|---|---|---|---|---|
| ir-001 | 4.87 | 4.87 | 4.73 | 4.87 | 4.87 | 4.87 | 4.40 |
| ir-002 | 4.87 | 4.73 | 4.87 | 4.87 | 4.87 | 4.87 | 4.40 |
| ir-003 | 4.87 | 4.87 | 4.73 | 4.87 | 4.87 | 4.87 | 4.40 |
| ir-004 | 4.87 | 4.87 | 4.87 | 4.87 | 4.87 | 4.87 | 4.87 |
| ir-005 | 4.87 | 4.87 | 4.87 | 4.87 | 4.87 | 4.87 | 4.73 |
| **Mean** | **4.87** | **4.84** | **4.81** | **4.87** | **4.87** | **4.87** | **4.56** |
