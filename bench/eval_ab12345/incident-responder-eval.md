# incident-responder Evaluation

## Task 1: ir-001
**Ground Truth Summary:** API spike from 200ms to 15s, 45% error rate, 2000 users. Must classify as P0/P1, provide first 5 min actions (acknowledge, war room, page on-call), check DB/external deps/infrastructure, stakeholder communication template. Structure: time-boxed plan, severity with reasoning, communication cadence.

### Condition a1
- must_mention: 4/4 — P0 classification, first 5 min actions (war room, IC), check DB/external deps/infrastructure, communication template
- must_not violations: none
- Completeness: 5 — All items covered comprehensively
- Precision: 5 — Accurate diagnosis approach, good probable causes
- Actionability: 5 — SQL queries, bash commands, concrete steps
- Structure: 5 — Time-boxed sections, severity classification
- Efficiency: 5 — Concise and focused
- Depth: 5 — Excellent diagnosis depth with specific queries
- **Composite: 5.00**

### Condition a2
- must_mention: 4/4 — P0 classification, first 5 min actions, infrastructure checks, stakeholder update
- must_not violations: none
- Completeness: 5 — All items covered
- Precision: 5 — Accurate
- Actionability: 5 — Concrete commands and steps
- Structure: 5 — Time-boxed, mitigation table, role assignments
- Efficiency: 5 — Well-organized
- Depth: 5 — Thorough with golden signals, mitigation table
- **Composite: 5.00**

### Condition a3
- must_mention: 4/4 — P1 classification (should be P0 given 45% error rate and 2000 users — borderline), first 5 min, DB/deps checks, communication
- must_not violations: none
- Completeness: 5 — All items covered
- Precision: 4 — P1 instead of P0 is debatable but reasonable
- Actionability: 5 — Concrete steps
- Structure: 4 — Less formal structure than best outputs
- Efficiency: 4 — Good
- Depth: 4 — Good analysis
- **Composite: 4.33**

### Condition a4
- must_mention: 4/4 — P0 classification, role assignment, DB/deps checks, stakeholder update
- must_not violations: none
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — Concrete queries and commands
- Structure: 5 — Time-boxed, decision table, communication cadence
- Efficiency: 5 — Well-organized
- Depth: 5 — Thorough with cascading failure analysis
- **Composite: 5.00**

### Condition a5
- must_mention: 4/4 — P0 classification, first 5 min actions, checks, communication
- must_not violations: none
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — Concrete commands
- Structure: 5 — Time-boxed, mitigation table
- Efficiency: 5 — Well-structured
- Depth: 5 — Thorough
- **Composite: 5.00**

### Condition b1
- must_mention: 4/4 — SEV-1 classification (should arguably be P0/SEV-0), first 5 min, checks, communication
- must_not violations: none
- Completeness: 5 — All items, very detailed
- Precision: 4 — Severity classification as SEV-1 is too low; also assumes a specific root cause (third-party) which is speculative
- Actionability: 5 — Very detailed commands
- Structure: 5 — Time-boxed, excellent format
- Efficiency: 3 — Very verbose, assumes root cause before investigation
- Depth: 4 — Good but assumes specifics
- **Composite: 4.27**

### Condition b2
- must_mention: 4/4 — P1 classification (borderline), first 5 min, checks, communication
- must_not violations: none
- Completeness: 5 — All items
- Precision: 4 — P1 is borderline for 2000 users at 45% error
- Actionability: 5 — Concrete commands
- Structure: 5 — Good timeline table format
- Efficiency: 4 — Reasonable
- Depth: 4 — Good
- **Composite: 4.47**

### Condition b3
- must_mention: 4/4 — P0 classification, first 5 min, checks, communication cadence table
- must_not violations: none
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — Concrete steps
- Structure: 5 — Time-boxed, communication cadence table
- Efficiency: 4 — Good
- Depth: 5 — Thorough diagnosis steps
- **Composite: 4.87**

### Condition b4
- must_mention: 4/4 — P1 classification (borderline), first 5 min, checks, communication
- must_not violations: none
- Completeness: 5 — All items
- Precision: 4 — P1 is borderline
- Actionability: 5 — Concrete commands
- Structure: 5 — Good structure with tables
- Efficiency: 4 — Good length
- Depth: 4 — Good diagnosis
- **Composite: 4.47**

### Condition b5
- must_mention: 4/4 — P0 classification, first 5 min, checks, communication
- must_not violations: none
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — Concrete steps
- Structure: 5 — Well-structured
- Efficiency: 4 — Good
- Depth: 4 — Solid
- **Composite: 4.73**

---

## Task 2: ir-002
**Ground Truth Summary:** External dependency failure (payment gateway), check gateway outage, fallback/retry strategy, customer communication, revenue impact estimation. Must NOT suggest rolling back (no recent deployment, external issue).

### Condition a1
- must_mention: 5/5 — External dep failure, check gateway status, fallback/retry, customer communication, revenue impact (implied via "idempotency keys")
- must_not violations: none — does not suggest rollback
- Completeness: 5 — All items covered
- Precision: 5 — Accurate, correctly identifies external issue
- Actionability: 5 — Concrete steps including curl commands
- Structure: 4 — Organized but less time-boxed
- Efficiency: 5 — Concise
- Depth: 5 — Excellent analysis including TLS/IP range checks
- **Composite: 4.87**

### Condition a2
- must_mention: 5/5 — All items covered including revenue impact
- must_not violations: none
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — Concrete commands
- Structure: 5 — Time-boxed, mitigation table
- Efficiency: 5 — Well-organized
- Depth: 5 — Thorough with TLS cert check
- **Composite: 5.00**

### Condition a3
- must_mention: 4/5 — External dep, gateway check, retry/fallback, customer communication; revenue impact estimation missing
- must_not violations: none
- Completeness: 4 — Missing revenue impact
- Precision: 5 — Accurate
- Actionability: 5 — Commands
- Structure: 4 — Organized
- Efficiency: 4 — Good
- Depth: 4 — Good
- **Composite: 4.33**

### Condition a4
- must_mention: 4/5 — External dep, gateway check, retry, customer communication; revenue impact mentioned as "direct revenue loss"
- must_not violations: none — correctly notes 2-day gap means rollback unlikely to help
- Completeness: 5 — Revenue impact mentioned
- Precision: 5 — Accurate with good 10% analysis
- Actionability: 5 — Commands
- Structure: 5 — Time-boxed, tables
- Efficiency: 5 — Good
- Depth: 5 — Thorough
- **Composite: 5.00**

### Condition a5
- must_mention: 5/5 — All items covered
- must_not violations: none
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — Concrete commands
- Structure: 5 — Tables, decision tree
- Efficiency: 4 — Good
- Depth: 5 — Thorough
- **Composite: 4.87**

### Condition b1
- must_mention: 4/5 — External dep, gateway check, retry, customer communication; revenue impact estimated ($2K/10min)
- must_not violations: none — does not suggest rollback
- Completeness: 5 — All items including revenue
- Precision: 4 — Assumes specific root cause (IP block) which may not apply
- Actionability: 5 — Very detailed
- Structure: 5 — Timeline table
- Efficiency: 3 — Very verbose, assumes specific cause
- Depth: 4 — Good but assumes too much
- **Composite: 4.27**

### Condition b2
- must_mention: 5/5 — All items covered
- must_not violations: none
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — Commands
- Structure: 5 — Tables, communication template
- Efficiency: 4 — Good
- Depth: 5 — Thorough with scenario analysis
- **Composite: 4.87**

### Condition b3
- must_mention: 5/5 — All items covered, revenue impact mentioned
- must_not violations: none
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — Concrete commands
- Structure: 5 — Tables, communication templates
- Efficiency: 4 — Good
- Depth: 5 — Thorough with scenario analysis
- **Composite: 4.87**

### Condition b4
- must_mention: 5/5 — External dep, gateway check, retry/queue, customer communication, revenue impact
- must_not violations: none
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — Code examples for retry
- Structure: 5 — Tables, timeline
- Efficiency: 3 — Verbose with code examples
- Depth: 5 — Thorough
- **Composite: 4.60**

### Condition b5
- must_mention: 4/5 — External dep, gateway check, retry, communication; revenue impact not estimated
- must_not violations: none
- Completeness: 4 — Missing explicit revenue estimation
- Precision: 5 — Accurate
- Actionability: 5 — Commands and templates
- Structure: 5 — Decision tree, tables
- Efficiency: 4 — Good
- Depth: 4 — Good
- **Composite: 4.47**

---

## Task 3: ir-003
**Ground Truth Summary:** Calculate time to 100% (~7.5 hours), immediate actions (identify large tables, temp files, logs), short-term (archive/purge, expand disk), long-term (retention policies, monitoring at 80%). Structure: time-to-failure estimate, prioritized action list.

### Condition a1
- must_mention: 4/4 — Time to full (7.5 hours), identify consumers, archive/purge/expand, retention policies with alerts at 70/80/90%
- must_not violations: none
- Completeness: 5 — All items including stuck replication slots
- Precision: 5 — Accurate with specific SQL
- Actionability: 5 — Excellent SQL queries and commands
- Structure: 5 — Prioritized action list
- Efficiency: 5 — Well-organized
- Depth: 5 — Outstanding with WAL/replication slot analysis
- **Composite: 5.00**

### Condition a2
- must_mention: 4/4 — Time to full (7.5 hours), identify consumers, cleanup/expand, retention/alerts
- must_not violations: none
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — Detailed SQL and commands
- Structure: 5 — Prioritized list with permanent fixes
- Efficiency: 5 — Well-structured
- Depth: 5 — Excellent dead tuple and WAL analysis
- **Composite: 5.00**

### Condition a3
- must_mention: 4/4 — Time to full (7.5 hours), identify consumers, cleanup, retention/alerts
- must_not violations: none
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — SQL and commands
- Structure: 5 — Time-boxed, prioritized
- Efficiency: 4 — Good
- Depth: 5 — Good replication slot analysis
- **Composite: 4.87**

### Condition a4
- must_mention: 4/4 — All items covered
- must_not violations: none
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — Concrete steps
- Structure: 5 — Time-boxed sections
- Efficiency: 5 — Concise
- Depth: 5 — Good with replication slot analysis
- **Composite: 5.00**

### Condition a5
- must_mention: 4/4 — All items covered
- must_not violations: none
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — Commands and SQL
- Structure: 5 — Prioritized with tables
- Efficiency: 5 — Well-organized
- Depth: 5 — Good with replication slots and WAL
- **Composite: 5.00**

### Condition b1
- must_mention: 4/4 — All items covered including time to full
- must_not violations: none
- Completeness: 5 — All items very detailed
- Precision: 4 — Assumes specific findings (WAL files) without investigation
- Actionability: 5 — Detailed commands
- Structure: 5 — Resolution table, timeline
- Efficiency: 3 — Very verbose, assumes specific cause
- Depth: 4 — Good but assumes
- **Composite: 4.27**

### Condition b2
- must_mention: 4/4 — All items covered
- must_not violations: none
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — Concrete SQL and commands
- Structure: 5 — Prioritized, communication timeline
- Efficiency: 4 — Good
- Depth: 5 — Thorough
- **Composite: 4.87**

### Condition b3
- must_mention: 4/4 — All items covered, time to full, cleanup, expand, alerts
- must_not violations: none
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — SQL and commands
- Structure: 5 — Prioritized, tables
- Efficiency: 4 — Good
- Depth: 5 — Good with tables
- **Composite: 4.87**

### Condition b4
- must_mention: 4/4 — All items covered
- must_not violations: none
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — Commands
- Structure: 5 — Prioritized, long-term table
- Efficiency: 4 — Good
- Depth: 5 — Thorough
- **Composite: 4.87**

### Condition b5
- must_mention: 4/4 — All items covered
- must_not violations: none
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — Commands, SQL
- Structure: 5 — Tables, prioritized
- Efficiency: 4 — Good
- Depth: 5 — Thorough
- **Composite: 4.87**

---

## Task 4: ir-004
**Ground Truth Summary:** Immediately revoke key, audit CloudTrail/access logs, identify accessed data, legal/compliance notifications (GDPR, breach disclosure), rotate all related credentials. Structure: immediate containment (minutes), investigation (hours), notification (24-72h).

### Condition a1
- must_mention: 5/5 — Revoke key, audit CloudTrail, identify data, legal/compliance (GDPR/CCPA), rotate credentials
- must_not violations: none
- Completeness: 5 — All items including repo scanning
- Precision: 5 — Accurate with specific AWS CLI commands
- Actionability: 5 — Concrete commands
- Structure: 5 — Time-phased (15 min, 1 hour, post-incident)
- Efficiency: 5 — Concise and focused
- Depth: 5 — Excellent with IAM review
- **Composite: 5.00**

### Condition a2
- must_mention: 5/5 — All items covered
- must_not violations: none
- Completeness: 5 — All items with excellent detail
- Precision: 5 — Accurate
- Actionability: 5 — Detailed AWS commands
- Structure: 5 — Time-phased, legal section
- Efficiency: 5 — Well-organized
- Depth: 5 — Thorough with exfiltration indicators
- **Composite: 5.00**

### Condition a3
- must_mention: 5/5 — All items covered
- must_not violations: none
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — AWS commands
- Structure: 5 — Time-phased (5 min, 30 min, legal)
- Efficiency: 4 — Good
- Depth: 5 — Thorough
- **Composite: 4.87**

### Condition a4
- must_mention: 5/5 — All items covered
- must_not violations: none
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — Concrete commands
- Structure: 5 — Time-phased, communication table
- Efficiency: 5 — Well-organized
- Depth: 5 — Thorough with evidence preservation
- **Composite: 5.00**

### Condition a5
- must_mention: 5/5 — All items covered
- must_not violations: none
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — AWS commands
- Structure: 5 — Time-phased, remediation list
- Efficiency: 4 — Good
- Depth: 5 — Thorough
- **Composite: 4.87**

### Condition b1
- must_mention: 5/5 — All items covered in extreme detail
- must_not violations: none
- Completeness: 5 — All items plus forensic analysis
- Precision: 4 — Assumes specific findings (suspicious IP from Russia) which is narrative
- Actionability: 5 — Very detailed commands
- Structure: 5 — Time-phased, checklists
- Efficiency: 2 — Extremely verbose (narrative with fake investigation results)
- Depth: 4 — Good but narrative is speculative
- **Composite: 4.07**

### Condition b2
- must_mention: 5/5 — All items covered
- must_not violations: none
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — Commands
- Structure: 5 — Checklists, regulatory table
- Efficiency: 4 — Good
- Depth: 5 — Thorough
- **Composite: 4.87**

### Condition b3
- must_mention: 5/5 — All items covered
- must_not violations: none
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — Concrete commands
- Structure: 5 — Time-phased, checklist, communication table
- Efficiency: 4 — Good
- Depth: 5 — Thorough
- **Composite: 4.87**

### Condition b4
- must_mention: 5/5 — All items covered
- must_not violations: none
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — Commands, forensic queries
- Structure: 5 — Time-phased, checklists
- Efficiency: 3 — Verbose
- Depth: 5 — Thorough
- **Composite: 4.60**

### Condition b5
- must_mention: 5/5 — All items covered
- must_not violations: none
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — Commands
- Structure: 5 — Time-phased
- Efficiency: 4 — Good
- Depth: 5 — Thorough with postmortem triggers
- **Composite: 4.87**

---

## Task 5: ir-005
**Ground Truth Summary:** Likely caching issue (session/response cache), P0 severity (data privacy violation), immediate mitigation (disable caching/cache-busting), investigate CDN/proxy/app cache, may need to notify affected users. Must NOT suggest it's an auth bug without evidence (caching more likely given intermittent + no code change).

### Condition a1
- must_mention: 5/5 — Caching issue identified, P0, cache flush mitigation, CDN/Redis/proxy investigation, breach notification
- must_not violations: none — correctly identifies caching as most likely
- Completeness: 5 — All items covered comprehensively
- Precision: 5 — Excellent identification of cache key issues
- Actionability: 5 — Redis FLUSHDB, cache key inspection
- Structure: 5 — Time-boxed, prioritized
- Efficiency: 5 — Well-focused
- Depth: 5 — Outstanding analysis of cache key patterns, session collision, CDN
- **Composite: 5.00**

### Condition a2
- must_mention: 5/5 — All items covered
- must_not violations: none — correctly prioritizes caching
- Completeness: 5 — All items with code examples
- Precision: 5 — Accurate
- Actionability: 5 — Concrete commands and code
- Structure: 5 — Time-boxed, communication plan, post-incident
- Efficiency: 5 — Well-organized
- Depth: 5 — Excellent with session fixation, CDN, connection pool analysis
- **Composite: 5.00**

### Condition a3
- must_mention: 5/5 — Caching issue, P0, mitigation, CDN/proxy/cache investigation, user notification
- must_not violations: none — caching identified as most likely
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — Concrete commands
- Structure: 5 — Prioritized hypotheses
- Efficiency: 4 — Good
- Depth: 5 — Good with multiple hypotheses ranked
- **Composite: 4.87**

### Condition a4
- must_mention: 5/5 — All items covered
- must_not violations: none
- Completeness: 5 — All items including request context leakage
- Precision: 5 — Accurate with priority ordering
- Actionability: 5 — Concrete commands
- Structure: 5 — Priority-ordered hypotheses
- Efficiency: 5 — Well-organized
- Depth: 5 — Excellent with connection pool leak analysis
- **Composite: 5.00**

### Condition a5
- must_mention: 5/5 — All items covered
- must_not violations: none — caching as most likely
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — Concrete commands, cache key fix
- Structure: 5 — Priority ordered, communication plan
- Efficiency: 5 — Well-organized
- Depth: 5 — Thorough with nginx config, Redis scan
- **Composite: 5.00**

### Condition b1
- must_mention: 5/5 — Caching mentioned, P0, mitigation, investigation, notification
- must_not violations: Borderline — identifies root cause as "Session ID collision in Redis" and "Singleton/global variable" which is not caching per se, but session confusion. The ground truth says not to suggest auth bug without evidence. The output proposes a specific code bug. However it does mention caching as well.
- Completeness: 5 — All items, very detailed
- Precision: 3 — Assumes specific root cause (session ID collision) and even writes fake "reproduction" results and "code review" findings. This is speculative narrative.
- Actionability: 5 — Very detailed
- Structure: 5 — Time-boxed, detailed
- Efficiency: 2 — Extremely verbose, assumes specific findings that aren't real
- Depth: 3 — Assumes rather than investigates
- **Composite: 3.67**

### Condition b2
- must_mention: 5/5 — All items covered, caching identified as most likely
- must_not violations: none — correctly prioritizes caching
- Completeness: 5 — All items
- Precision: 5 — Accurate with multiple hypotheses
- Actionability: 5 — Commands
- Structure: 5 — Priority-ordered
- Efficiency: 4 — Good
- Depth: 5 — Thorough with multiple patterns
- **Composite: 4.87**

### Condition b3
- must_mention: 5/5 — All items covered
- must_not violations: none — caching first
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — Concrete commands
- Structure: 5 — Prioritized, communication plan
- Efficiency: 4 — Good
- Depth: 5 — Thorough with CDN, session, thread-local patterns
- **Composite: 4.87**

### Condition b4
- must_mention: 5/5 — All items covered
- must_not violations: none — caching and session confusion both explored
- Completeness: 5 — All items
- Precision: 5 — Accurate, multiple hypotheses
- Actionability: 5 — Commands, code patterns
- Structure: 5 — Well-organized
- Efficiency: 3 — Verbose
- Depth: 5 — Thorough with many code patterns
- **Composite: 4.60**

### Condition b5
- must_mention: 5/5 — All items covered
- must_not violations: none — caching and session confusion explored
- Completeness: 5 — All items
- Precision: 5 — Accurate
- Actionability: 5 — Commands, code patterns
- Structure: 5 — Well-organized, restoration plan
- Efficiency: 3 — Verbose
- Depth: 5 — Thorough with multiple code patterns
- **Composite: 4.60**

---

## Summary

| Task | a1 | a2 | a3 | a4 | a5 | b1 | b2 | b3 | b4 | b5 |
|------|----|----|----|----|----|----|----|----|----|----|
| ir-001 | 5.00 | 5.00 | 4.33 | 5.00 | 5.00 | 4.27 | 4.47 | 4.87 | 4.47 | 4.73 |
| ir-002 | 4.87 | 5.00 | 4.33 | 5.00 | 4.87 | 4.27 | 4.87 | 4.87 | 4.60 | 4.47 |
| ir-003 | 5.00 | 5.00 | 4.87 | 5.00 | 5.00 | 4.27 | 4.87 | 4.87 | 4.87 | 4.87 |
| ir-004 | 5.00 | 5.00 | 4.87 | 5.00 | 4.87 | 4.07 | 4.87 | 4.87 | 4.60 | 4.87 |
| ir-005 | 5.00 | 5.00 | 4.87 | 5.00 | 5.00 | 3.67 | 4.87 | 4.87 | 4.60 | 4.60 |
| **Mean** | **4.97** | **5.00** | **4.65** | **5.00** | **4.95** | **4.11** | **4.79** | **4.87** | **4.63** | **4.71** |
