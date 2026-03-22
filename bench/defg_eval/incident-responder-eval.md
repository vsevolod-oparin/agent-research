# incident-responder Evaluation (D/E/F/G/H)

## Task ir-001: API Response Time Spike

**Ground Truth Summary:** Must classify as P0/P1, first 5 min actions (acknowledge, war room, page on-call), check database/dependencies/infrastructure, stakeholder communication template. Time-boxed action plan, severity reasoning, communication cadence.

### Condition D
- must_mention coverage: 4/4 -- P0 (correct), first 5 min actions (war room, page), check DB/dependencies/infra, stakeholder comm template
- must_not violations: None
- Completeness: 5 -- All required elements present with comprehensive coverage
- Precision: 5 -- Correct P0 classification with reasoning
- Actionability: 5 -- Specific actions: kill queries, scale, circuit breakers, rate limiting
- Structure: 5 -- Time-boxed sections, severity table, comm cadence
- Efficiency: 4 -- Thorough but well-organized
- Depth: 5 -- Ranked hypotheses by probability, post-incident items
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- P0 (correct), diagnostic steps, DB/cache/network checks, communication template
- must_not violations: None
- Completeness: 4 -- All required but less detail on first-5-min actions
- Precision: 5 -- Correct classification
- Actionability: 5 -- Stabilization options table with recovery times
- Structure: 4 -- Less formal structure, but clear
- Efficiency: 5 -- Very concise and actionable
- Depth: 4 -- Good diagnostic ordering but less depth on each
- **Composite: 4.53**

### Condition F
- must_mention coverage: 4/4 -- P0, first 5 min (declare, confirm scope, check dependencies), DB check, comm template
- must_not violations: None
- Completeness: 5 -- All required elements
- Precision: 5 -- Correct P0
- Actionability: 5 -- Prioritized mitigation table
- Structure: 5 -- Clean time-boxed structure
- Efficiency: 4 -- Good balance
- Depth: 4 -- Good but less detailed than D on hypotheses
- **Composite: 4.73**

### Condition G
- must_mention coverage: 4/4 -- P0, war room + paging, DB/network/external checks, comm cadence (15 min)
- must_not violations: None
- Completeness: 5 -- All required elements with phased investigation
- Precision: 5 -- Correct P0 with detailed reasoning
- Actionability: 5 -- Specific mitigation table with risk levels
- Structure: 5 -- Phased investigation (triage/narrow/deep dive), comm cadence
- Efficiency: 4 -- Detailed
- Depth: 5 -- Distributed traces, connection pool analysis, resolution criteria
- **Composite: 4.87**

### Condition H
- must_mention coverage: 4/4 -- P0, war room + paging, DB priority investigation, comm plan
- must_not violations: None
- Completeness: 5 -- All required with phased investigation and resolution criteria
- Precision: 5 -- Correct P0 with strong reasoning
- Actionability: 5 -- Mitigation table with risk assessment
- Structure: 5 -- Excellent phased structure with time markers
- Efficiency: 4 -- Very thorough
- Depth: 5 -- Database as highest-probability cause with specific queries, resolution criteria defined
- **Composite: 4.87**

---

## Task ir-002: Payment Processing Failures

**Ground Truth Summary:** Must mention external dependency failure, check gateway outage, fallback/retry strategy, customer communication, revenue impact estimation. Must NOT suggest rolling back.

### Condition D
- must_mention coverage: 5/5 -- external dependency, gateway outage check, fallback/retry, customer comm, revenue impact (in follow-up)
- must_not violations: None -- does not suggest rollback
- Completeness: 5 -- All required elements
- Precision: 5 -- Correct P1, correctly identifies external dependency
- Actionability: 5 -- Specific mitigation options, contact gateway
- Structure: 5 -- Well organized with comm template
- Efficiency: 4 -- Good
- Depth: 5 -- Connection pool analysis, TLS/cert considerations
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- external dependency, gateway status check, backup gateway/retry, customer comm (implicit), revenue tracking (implicit)
- must_not violations: None
- Completeness: 4 -- All required but customer comm and revenue less detailed
- Precision: 5 -- Correct P1
- Actionability: 5 -- Stabilization options table
- Structure: 4 -- Less formal
- Efficiency: 5 -- Very concise
- Depth: 4 -- Good but less depth on investigation steps
- **Composite: 4.47**

### Condition F
- must_mention coverage: 5/5 -- external dependency, gateway status check, failover/retry, customer comm (support script), revenue impact (quantified)
- must_not violations: None
- Completeness: 5 -- All required
- Precision: 5 -- Correct P1 with detailed classification reasoning
- Actionability: 5 -- Mitigation table, reconciliation plan
- Structure: 5 -- Well organized
- Efficiency: 4 -- Good
- Depth: 5 -- Dead-letter queue, synthetic monitoring
- **Composite: 4.87**

### Condition G
- must_mention coverage: 5/5 -- external dependency (TCP-level), gateway check, failover/retry, customer comm, revenue impact tracking
- must_not violations: None
- Completeness: 5 -- All required with detailed investigation phases
- Precision: 5 -- Correct P1, excellent reasoning on partial failure
- Actionability: 5 -- Detailed mitigation options
- Structure: 5 -- Phased investigation, comm cadence
- Efficiency: 4 -- Detailed but well-organized
- Depth: 5 -- Excellent analysis of partial failure (10% not 100%), TLS cert, DNS round-robin, connection pool decay
- **Composite: 4.87**

### Condition H
- must_mention coverage: 5/5 -- external dependency, gateway check, failover/retry, customer comm, revenue impact
- must_not violations: None
- Completeness: 5 -- All required with phased investigation
- Precision: 5 -- Correct P1 with strong reasoning
- Actionability: 5 -- Mitigation table, resolution criteria
- Structure: 5 -- Phased structure with time markers
- Efficiency: 4 -- Thorough
- Depth: 5 -- Excellent partial failure analysis, stale connection hypothesis, idempotency considerations
- **Composite: 4.87**

---

## Task ir-003: Database Disk Space Critical

**Ground Truth Summary:** Must mention time-to-failure (~7.5 hours), immediate actions (identify large tables, temp files, logs), short-term (archive/purge, expand disk), long-term (retention policies, monitoring at 80%).

### Condition D
- must_mention coverage: 4/4 -- 7.5 hours, identify consumers (tables/logs/temp), purge/expand, retention+monitoring
- must_not violations: None
- Completeness: 5 -- All required with tiered response
- Precision: 5 -- Correct calculation, appropriate P1 with escalation path
- Actionability: 5 -- Three tiers with specific actions
- Structure: 5 -- Time-boxed tiers (1hr, 2-3hr, 1-2 weeks)
- Efficiency: 4 -- Good
- Depth: 5 -- WAL/binlog considerations, VACUUM FULL warning, partition strategy
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- 7.5 hours, identify consumers, purge/expand, retention+alerts
- must_not violations: None
- Completeness: 4 -- All required but less detail
- Precision: 5 -- Correct calculation
- Actionability: 5 -- Phased approach
- Structure: 4 -- Three phases but less detailed
- Efficiency: 5 -- Very concise
- Depth: 4 -- Good but less depth on specific actions
- **Composite: 4.47**

### Condition F
- must_mention coverage: 4/4 -- 7.5 hours, identify growth source, purge/expand, retention+alerts
- must_not violations: None
- Completeness: 5 -- All required with P2 classification and escalation criteria
- Precision: 5 -- Correct, good severity justification
- Actionability: 5 -- Prioritized mitigation table with space estimates
- Structure: 5 -- Well organized
- Efficiency: 4 -- Good
- Depth: 5 -- Orphaned data analysis, replication lag, escalation criteria
- **Composite: 4.87**

### Condition G
- must_mention coverage: 4/4 -- 7.5 hours, WAL/binlog/table analysis, purge/expand, retention+alerts
- must_not violations: None
- Completeness: 5 -- All required with detailed phased approach
- Precision: 5 -- Correct P1 with escalation to P0
- Actionability: 5 -- Phased mitigation with tables showing expected recovery and risk
- Structure: 5 -- Excellent phased structure with time targets
- Efficiency: 4 -- Very detailed
- Depth: 5 -- VACUUM FULL/OPTIMIZE TABLE warning under disk pressure, replication slot analysis, capacity planning
- **Composite: 4.87**

### Condition H
- must_mention coverage: 4/4 -- 7.5 hours, disk composition analysis, purge/expand, retention+alerts
- must_not violations: None
- Completeness: 5 -- All required with critical warnings section
- Precision: 5 -- Correct P1 with excellent reasoning
- Actionability: 5 -- Three phases with tables, critical warnings
- Structure: 5 -- Outstanding structure with critical warnings section
- Efficiency: 4 -- Thorough
- Depth: 5 -- VACUUM FULL disk doubling warning, batch DELETE WAL concern, steady-state vs spike analysis, resolution criteria
- **Composite: 4.87**

---

## Task ir-004: Exposed API Key (Data Breach)

**Ground Truth Summary:** Must mention immediately revoke key, audit CloudTrail/access logs, identify accessed data, legal/compliance notification (GDPR), rotate credentials. Immediate containment (minutes), investigation (hours), notification (24-72h).

### Condition D
- must_mention coverage: 5/5 -- revoke key, audit CloudTrail, identify data, legal/GDPR, rotate credentials
- must_not violations: None
- Completeness: 5 -- All required with detailed forensic protocol
- Precision: 5 -- Correct P0 security incident classification
- Actionability: 5 -- Step-by-step containment, investigation, compliance actions
- Structure: 5 -- Time-boxed (minutes/hours/24-72h), restricted channel
- Efficiency: 4 -- Comprehensive
- Depth: 5 -- Blameless employee interview, GitHub scraping assumption, preventive measures
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- revoke key (with AWS CLI command), CloudTrail audit, data scope, GDPR 72h, rotate credentials
- must_not violations: None
- Completeness: 5 -- All required in phased approach
- Precision: 5 -- Correct P0
- Actionability: 5 -- AWS CLI command included
- Structure: 5 -- Three phases (contain/assess/remediate)
- Efficiency: 5 -- Very concise yet complete
- Depth: 4 -- Good but less depth on forensic analysis
- **Composite: 4.73**

### Condition F
- must_mention coverage: 5/5 -- revoke immediately, CloudTrail, data scope, legal/GDPR, rotate
- must_not violations: None
- Completeness: 5 -- All required
- Precision: 5 -- Correct P0
- Actionability: 5 -- Phased actions, specific AWS commands
- Structure: 5 -- Well organized
- Efficiency: 4 -- Good
- Depth: 5 -- Data integrity check, lateral movement, MFA enforcement
- **Composite: 4.87**

### Condition G
- must_mention coverage: 5/5 -- revoke key (with AWS CLI), CloudTrail audit, data scope, legal/GDPR/CCPA, rotate
- must_not violations: None
- Completeness: 5 -- All required with very detailed investigation
- Precision: 5 -- Correct P0
- Actionability: 5 -- Specific AWS CLI commands, evidence preservation steps
- Structure: 5 -- Detailed phased structure
- Efficiency: 4 -- Very thorough
- Depth: 5 -- Persistence mechanisms, lateral movement, fork/clone analysis, dark web monitoring
- **Composite: 4.87**

### Condition H
- must_mention coverage: 5/5 -- revoke key, CloudTrail audit, data scope, legal/GDPR/CCPA, rotate
- must_not violations: None
- Completeness: 5 -- All required with exhaustive investigation protocol
- Precision: 5 -- Correct P0 with strong reasoning
- Actionability: 5 -- Critical sequence of actions with time markers
- Structure: 5 -- Excellent time-sequenced structure (T+0 to T+2, T+2 to T+5, etc.)
- Efficiency: 4 -- Very detailed but well-organized
- Depth: 5 -- Persistence mechanism check, repository traffic analysis, IAM action auditing, secrets management recommendations
- **Composite: 4.87**

---

## Task ir-005: Cross-User Data Leakage

**Ground Truth Summary:** Must mention likely caching issue, P0 severity, immediate mitigation (disable caching/cache-busting), investigate CDN/proxy/app caching, may need user notification. Must NOT suggest auth bug without evidence (caching more likely).

### Condition D
- must_mention coverage: 5/5 -- caching most likely, P0, disable/flush cache, CDN/proxy/app investigation, user notification
- must_not violations: None -- correctly identifies caching as primary hypothesis
- Completeness: 5 -- All required with detailed investigation protocol
- Precision: 5 -- Correct P0, caching as most likely cause
- Actionability: 5 -- Multiple mitigation options in priority order
- Structure: 5 -- Well organized with verification steps
- Efficiency: 4 -- Comprehensive
- Depth: 5 -- Thread-local variables, session store contamination, Vary headers, privacy regulations
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- caching (highest probability), P0, flush caches, CDN/session/connection pool, legal notification
- must_not violations: None
- Completeness: 5 -- All required
- Precision: 5 -- Correct P0, caching as primary
- Actionability: 5 -- Immediate action: flush all caches
- Structure: 4 -- Less formal but clear
- Efficiency: 5 -- Very concise
- Depth: 4 -- Four hypotheses ranked, verification steps
- **Composite: 4.60**

### Condition F
- must_mention coverage: 5/5 -- caching (highest probability), P0, purge CDN + cache-control headers, CDN/proxy/session/app, user notification
- must_not violations: None
- Completeness: 5 -- All required
- Precision: 5 -- Correct P0, caching primary
- Actionability: 5 -- Mitigation table with priority and speed
- Structure: 5 -- Well organized
- Efficiency: 4 -- Good
- Depth: 5 -- Entropy pool exhaustion hypothesis, sticky session failure, maintenance mode consideration
- **Composite: 4.87**

### Condition G
- must_mention coverage: 5/5 -- caching (highest probability), P0, flush cache + cache-control, CDN/proxy/session, privacy notification
- must_not violations: None
- Completeness: 5 -- All required with 5 hypotheses
- Precision: 5 -- Correct P0
- Actionability: 5 -- Mitigation table, investigation plan
- Structure: 5 -- Excellent structure with multiple hypotheses
- Efficiency: 4 -- Thorough
- Depth: 5 -- Session ID collision, entropy pool, connection pool leak, Set-Cookie header overwrite
- **Composite: 4.87**

### Condition H
- must_mention coverage: 5/5 -- caching (highest probability), P0, flush caches + maintenance mode, CDN/proxy/session/app, regulatory notification
- must_not violations: None
- Completeness: 5 -- All required with 5 hypotheses and forensic requirements
- Precision: 5 -- Correct P0, caching primary
- Actionability: 5 -- Mitigation table, forensic requirements, resolution criteria
- Structure: 5 -- Outstanding structure with hypothesis ranking, forensic section, resolution criteria
- Efficiency: 4 -- Very detailed
- Depth: 5 -- Defense-in-depth assertion middleware, cache key collision dynamics, entropy pool, infrastructure-as-code audit
- **Composite: 4.87**

---

## Summary

| Task | D | E | F | G | H |
|------|---|---|---|---|---|
| ir-001 | 4.87 | 4.53 | 4.73 | 4.87 | 4.87 |
| ir-002 | 4.87 | 4.47 | 4.87 | 4.87 | 4.87 |
| ir-003 | 4.87 | 4.47 | 4.87 | 4.87 | 4.87 |
| ir-004 | 4.87 | 4.73 | 4.87 | 4.87 | 4.87 |
| ir-005 | 4.87 | 4.60 | 4.87 | 4.87 | 4.87 |
| **Mean** | **4.87** | **4.56** | **4.84** | **4.87** | **4.87** |
