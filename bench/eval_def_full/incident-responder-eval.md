# incident-responder Evaluation (D/E/F) -- Full

## Task 1: ir-001 (API Response Time Spike)

**Ground Truth Summary:** Must classify as P0/P1, provide first-5-min actions (acknowledge, war room, page on-call), check database/external deps/infrastructure, include stakeholder communication template. Needs time-boxed action plan, severity classification with reasoning, communication cadence.

### Condition D
- must_mention coverage: 4/4 -- P0 classification, first-5-min actions (war room, Slack, paging), database/infra/dependency checks, stakeholder communication template
- must_not violations: None
- Code artifacts: N/A
- Completeness: 5 -- All required items covered comprehensively
- Precision: 5 -- Accurate severity reasoning (75x latency, 45% errors = near-total outage)
- Actionability: 5 -- Detailed parallel investigation tasks, mitigation options, postmortem timeline
- Structure: 5 -- Time-boxed sections, severity table, role assignments, communication cadence
- Efficiency: 4 -- Very thorough, slightly long
- Depth: 5 -- Hypothesis ranking, certificate expiration, batch job consideration, postmortem requirements
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- P0, diagnostic steps, database/cache/network checks, communication template
- must_not violations: None
- Completeness: 5 -- All items covered
- Precision: 5 -- Correct P0 reasoning, good hypothesis ranking
- Actionability: 5 -- Ordered diagnostic steps, stabilization table with recovery times
- Structure: 5 -- Clean tabular format, prioritized actions
- Efficiency: 5 -- Concise but complete
- Depth: 4 -- Good but less detail on team assembly and postmortem specifics
- **Composite: 4.87**

### Condition F
- must_mention coverage: 4/4 -- P0, first-5-min actions, dependency checks, communication
- must_not violations: None
- Completeness: 5 -- All required items
- Precision: 5 -- Accurate severity and scope
- Actionability: 5 -- Prioritized mitigation table, investigation steps
- Structure: 5 -- Time-boxed sections, clean format
- Efficiency: 5 -- Well-organized, no fluff
- Depth: 4 -- Good analysis but less hypothesis ranking than D
- **Composite: 4.87**

---

## Task 2: ir-002 (Payment Processing Failures)

**Ground Truth Summary:** Must mention external dependency failure, check gateway outage, fallback/retry strategy, customer communication, revenue impact estimation. Must NOT suggest rolling back.

### Condition D
- must_mention coverage: 5/5 -- external dependency (connection refused), gateway outage check, retry/failover, customer communication, revenue impact (reconciliation needs)
- must_not violations: None -- correctly notes last deployment 2 days ago, no rollback suggested
- Completeness: 5 -- All items covered
- Precision: 5 -- Accurate P1 classification with reasoning
- Actionability: 5 -- Specific diagnostic commands, gateway contact protocol
- Structure: 5 -- Severity assessment, investigation, stabilization, follow-up
- Efficiency: 4 -- Thorough
- Depth: 5 -- Connection leak hypothesis, certificate expiry, transaction reconciliation
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- all items covered
- must_not violations: None -- no rollback suggestion
- Completeness: 5 -- All items
- Precision: 5 -- Correct P1, gateway-first approach
- Actionability: 5 -- Specific commands (curl, telnet), contact gateway NOW emphasis
- Structure: 5 -- Clean table format
- Efficiency: 5 -- Concise and actionable
- Depth: 4 -- Good but less detail on reconciliation
- **Composite: 4.87**

### Condition F
- must_mention coverage: 5/5 -- all items covered
- must_not violations: None
- Completeness: 5 -- All required items
- Precision: 5 -- Correct P1
- Actionability: 5 -- Prioritized mitigation, specific investigation steps
- Structure: 5 -- Clean sections
- Efficiency: 5 -- Well-organized
- Depth: 5 -- Synthetic transaction monitoring, dead-letter queue, credential expiry check
- **Composite: 5.00**

---

## Task 3: ir-003 (Database Disk Space Critical)

**Ground Truth Summary:** Must calculate time to 100% (~7.5 hours), identify immediate actions, short-term (archive/purge, expand disk), long-term (retention policies, monitoring at 80%). Needs time-to-failure estimate and prioritized action list.

### Condition D
- must_mention coverage: 4/4 -- 7.5 hours calculation, immediate actions (purge logs, temp files), short-term (expand disk, archive), long-term (retention, alerts at 70/80/90%)
- must_not violations: None
- Completeness: 5 -- All tiers covered comprehensively
- Precision: 5 -- Correct time calculation, appropriate P1 with escalation path
- Actionability: 5 -- Tiered actions with time budgets (1 hour, 2-3 hours, 1-2 weeks)
- Structure: 5 -- Tiered by urgency, deadline prominently stated
- Efficiency: 4 -- Thorough
- Depth: 5 -- WAL retention, table bloat, VACUUM FULL warning about locks, capacity planning
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- 7.5 hours, space consumers, quick wins, alerts at thresholds
- must_not violations: None
- Completeness: 5 -- All items
- Precision: 5 -- Correct calculation, appropriate severity with escalation
- Actionability: 5 -- Phased approach (30 min, 2 hours, 24 hours)
- Structure: 5 -- Clean phases
- Efficiency: 5 -- Concise with specific commands (du -sh)
- Depth: 4 -- Good but less detail on lock warnings
- **Composite: 4.87**

### Condition F
- must_mention coverage: 4/4 -- 7.5 hours, identify growth, expand disk, retention policies + alerting
- must_not violations: None
- Completeness: 5 -- All items covered
- Precision: 4 -- Classifies as P2 initially, which underrates the urgency; ground truth expects P1 minimum
- Actionability: 5 -- Prioritized table with expected space recovery
- Structure: 5 -- Clean tiered format
- Efficiency: 5 -- Well-organized
- Depth: 4 -- Auto-expanding storage mention, monthly capacity planning
- **Composite: 4.60**

---

## Task 4: ir-004 (Exposed API Key / Data Breach)

**Ground Truth Summary:** Must mention immediately revoke key, audit CloudTrail/access logs, identify accessed data, legal/compliance notifications (GDPR), rotate related credentials. Needs immediate (minutes), investigation (hours), notification (24-72h) structure.

### Condition D
- must_mention coverage: 5/5 -- revoke key, CloudTrail audit, data scope assessment, GDPR/CCPA/HIPAA notifications, rotate credentials
- must_not violations: None
- Completeness: 5 -- All items plus GitHub removal, employee coordination, secret scanning prevention
- Precision: 5 -- Accurate severity, correct containment order
- Actionability: 5 -- Step-by-step containment, investigation, and compliance actions
- Structure: 5 -- Immediate/investigation/compliance time-boxing, restricted communication
- Efficiency: 4 -- Very thorough, comprehensive
- Depth: 5 -- Lateral movement check, blameless interview, pre-commit hooks, least-privilege recommendations
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- all items covered
- must_not violations: None
- Completeness: 5 -- All items with phased approach
- Precision: 5 -- Correct P0 security, revoke-first approach
- Actionability: 5 -- AWS CLI command for key revocation, phased timeline
- Structure: 5 -- 15-min/2-hour/24-hour phases
- Efficiency: 5 -- Concise and actionable
- Depth: 4 -- Good but less detail on employee coordination and forensics
- **Composite: 4.87**

### Condition F
- must_mention coverage: 5/5 -- all items
- must_not violations: None
- Completeness: 5 -- All required items
- Precision: 5 -- Correct P0
- Actionability: 5 -- Prioritized mitigation table, phased approach
- Structure: 5 -- Clean timeline structure
- Efficiency: 5 -- Well-organized
- Depth: 5 -- Lateral movement, forensics firm engagement, S3 bucket policies, company-wide audit
- **Composite: 5.00**

---

## Task 5: ir-005 (Cross-User Data Leakage)

**Ground Truth Summary:** Must mention likely caching issue, P0 severity, immediate mitigation (disable caching/cache-busting), investigate CDN/reverse proxy/app caching, may need to notify affected users. Must not suggest auth bug without evidence.

### Condition D
- must_mention coverage: 5/5 -- caching as primary hypothesis, P0, disable/flush caching, CDN/proxy/app-level investigation, user notification + regulatory assessment
- must_not violations: None -- correctly identifies caching as most likely, not auth bug
- Completeness: 5 -- All items comprehensively covered
- Precision: 5 -- Accurate analysis of intermittent + no code change = caching
- Actionability: 5 -- Ordered mitigation (disable cache, flush sessions, restart instances, maintenance mode)
- Structure: 5 -- Immediate containment, investigation, communication, verification, follow-up
- Efficiency: 4 -- Very thorough
- Depth: 5 -- Session ID entropy, sticky sessions, thread-local variables, Vary header check, response-level assertions
- **Composite: 4.87**

### Condition E
- must_mention coverage: 5/5 -- all items
- must_not violations: None -- caching first, not auth
- Completeness: 5 -- All items covered
- Precision: 5 -- Correct P0, caching hypothesis ranking
- Actionability: 5 -- Flush caches, check CDN, check sessions, maintenance mode fallback
- Structure: 5 -- Clean prioritized format
- Efficiency: 5 -- Concise
- Depth: 5 -- Vary header, Cache-Control analysis, session entropy, postmortem questions
- **Composite: 5.00**

### Condition F
- must_mention coverage: 5/5 -- all items
- must_not violations: None
- Completeness: 5 -- All items covered
- Precision: 5 -- Correct P0
- Actionability: 5 -- Prioritized table, 30-minute escalation to maintenance mode
- Structure: 5 -- Clean sections
- Efficiency: 5 -- Well-organized
- Depth: 5 -- CDN config, session entropy, sticky sessions, response-level assertions, monitoring for session integrity
- **Composite: 5.00**

---

## Summary

| Task | D | E | F |
|------|---|---|---|
| ir-001 | 4.87 | 4.87 | 4.87 |
| ir-002 | 4.87 | 4.87 | 5.00 |
| ir-003 | 4.87 | 4.87 | 4.60 |
| ir-004 | 4.87 | 4.87 | 5.00 |
| ir-005 | 4.87 | 5.00 | 5.00 |
| **Mean** | **4.87** | **4.90** | **4.89** |
| E LIFT (vs D) | -- | +0.03 | -- |
| F LIFT (vs D) | -- | -- | +0.02 |
| F vs E | -- | -- | -0.01 |
