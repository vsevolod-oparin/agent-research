# incident-responder Evaluation (A/B/C)

## Task 1: ir-001

**Ground Truth Summary:** Must mention: classify as P0/P1 (high user impact, all endpoints), first 5 min actions (acknowledge, war room, page on-call), check database connections/external dependencies/infrastructure, stakeholder communication template. Structure: time-boxed action plan, severity classification with reasoning, communication cadence.

### Condition A (bare)
- must_mention coverage: 4/4 -- P0 classification (hit), first 5 min actions with war room/paging (hit), check DB/external deps/infrastructure (hit), stakeholder communication template (hit)
- must_not violations: None.
- Completeness: 5 -- All must-mentions covered thoroughly. Post-incident follow-up included.
- Precision: 5 -- Severity reasoning is sound (all endpoints, 75x latency, 45% errors).
- Actionability: 5 -- Specific diagnostic commands, SQL for pg_stat_activity, resolution table with ETAs.
- Structure: 5 -- Time-boxed phases (3-10, 10-15, 15-25), severity table, communication cadence with templates.
- Efficiency: 5 -- Dense, well-organized into phases.
- Depth: 5 -- Investigates cache failure, file descriptors, DDoS, cron jobs. Resolution table with ETAs per root cause.
- **Composite: 5.00**

### Condition B (v1 agents)
- must_mention coverage: 4/4 -- P0 (hit), first 5 min actions (hit), check DB/deps/infra (hit), communication template (hit)
- must_not violations: None.
- Completeness: 5 -- All must-mentions. Follow-up actions included.
- Precision: 5 -- Sound reasoning.
- Actionability: 5 -- Investigation steps prioritized, mitigation per root cause.
- Structure: 5 -- Time-boxed, severity assessment table, communication cadence.
- Efficiency: 4 -- Slightly less structured than A -- no resolution ETA table.
- Depth: 4 -- Good but less diagnostic depth (no specific SQL commands, no ETA per root cause).
- **Composite: 4.73**

### Condition C (v2 agents)
- must_mention coverage: 4/4 -- P0 (hit), first 5 min actions (hit), check DB/deps/infra (hit), communication template (hit with table format)
- must_not violations: None.
- Completeness: 5 -- All must-mentions plus SLO review, dependency mapping.
- Precision: 5 -- Sound reasoning. Mentions falsifiable tests per hypothesis.
- Actionability: 5 -- Prioritized investigation steps, communication table with times/audiences/messages.
- Structure: 5 -- Time-boxed, communication plan table, severity assessment, root cause analysis approach.
- Efficiency: 5 -- Dense. Communication plan table is particularly well-structured.
- Depth: 5 -- Mentions 15s timeout analysis (exact vs variable latency), falsifiable hypothesis testing, SLO review.
- **Composite: 5.00**

---

## Task 2: ir-002

**Ground Truth Summary:** Must mention: external dependency failure (payment gateway), check if gateway has known outage, fallback/retry strategy, customer communication needed, revenue impact estimation. Must not: suggest rolling back (no recent deployment, external issue).

### Condition A (bare)
- must_mention coverage: 5/5 -- external dependency (hit), check gateway outage (hit), fallback/retry (hit), customer communication (hit), revenue impact (hit)
- must_not violations: None -- does not suggest rollback. Reviews last deployment as part of investigation but does not suggest reverting.
- Completeness: 5 -- All must-mentions covered. Financial impact assessment in follow-up.
- Precision: 5 -- Correctly identifies external issue. Notes 20-minute detection delay as action item.
- Actionability: 5 -- Gateway status check, network testing, retry with backoff, failover processor, user-friendly error message.
- Structure: 5 -- Time-boxed phases, resolution table with ETAs, communication cadence.
- Efficiency: 5 -- Dense, well-organized.
- Depth: 5 -- Investigates DNS, TLS certs, connection pools, synthetic monitoring. Notes idempotency for retries.
- **Composite: 5.00**

### Condition B (v1 agents)
- must_mention coverage: 5/5 -- external dependency (hit), check gateway outage (hit), fallback/retry (hit), customer communication (hit), revenue impact (hit in business impact and follow-up)
- must_not violations: None -- reviews deployment but does not suggest rollback.
- Completeness: 5 -- All must-mentions.
- Precision: 5 -- Correctly identifies external issue pattern.
- Actionability: 5 -- Gateway status page check, failover processor, retry logic, customer remediation.
- Structure: 5 -- Good structure with phases.
- Efficiency: 4 -- Slightly less dense than A.
- Depth: 4 -- Good but less network diagnostic depth (fewer specific checks like traceroute, DNS analysis).
- **Composite: 4.73**

### Condition C (v2 agents)
- must_mention coverage: 5/5 -- external dependency (hit), check gateway outage (hit), fallback/retry (hit), customer communication (hit with table), revenue impact (hit in communication plan)
- must_not violations: None.
- Completeness: 5 -- All must-mentions. Customer remediation in follow-up.
- Precision: 5 -- Correctly identifies external issue.
- Actionability: 5 -- Communication plan table, investigation steps, retry logic with idempotency.
- Structure: 5 -- Communication table, severity assessment, investigation phases.
- Efficiency: 5 -- Dense, well-organized.
- Depth: 5 -- Ephemeral port exhaustion, DNS load balancing, temporal pattern analysis. Disambiguates instance-specific vs uniform failure.
- **Composite: 5.00**

---

## Task 3: ir-003

**Ground Truth Summary:** Must mention: calculate time to 100% (~7.5 hours), immediate actions (identify large tables, temp files, logs), short-term (archive/purge old data, expand disk), long-term (retention policies, monitoring alerts at 80%). Structure: time-to-failure estimate, prioritized action list.

### Condition A (bare)
- must_mention coverage: 4/4 -- time to 100% at ~7.5 hours (hit), immediate actions for large tables/temp/logs (hit), short-term archive/expand (hit), long-term retention/monitoring at 80% (hit with 70/80/90/95)
- must_not violations: None.
- Completeness: 5 -- All must-mentions. Adds WAL/replication analysis, autovacuum, table partitioning.
- Precision: 5 -- 15GB / 2GB/hr = 7.5 hours correctly calculated. Notes effective window is shorter (97-98% degradation).
- Actionability: 5 -- Specific SQL queries for table sizes, pg_stat_activity, replication slots. Three-phase plan.
- Structure: 5 -- Time-to-failure estimate, phased actions (immediate/short-term/long-term), resolution table.
- Efficiency: 5 -- Dense.
- Depth: 5 -- Notes 97-98% performance degradation before 100%, replication slots preventing WAL cleanup, autovacuum analysis, table partitioning.
- **Composite: 5.00**

### Condition B (v1 agents)
- must_mention coverage: 4/4 -- time to 100% at 7.5 hours (hit), immediate actions (hit), short-term (hit), long-term with monitoring at 70/80/90 (hit)
- must_not violations: None.
- Completeness: 5 -- All must-mentions.
- Precision: 5 -- Calculation correct.
- Actionability: 5 -- Three-phase plan, specific investigation steps.
- Structure: 5 -- Phased plan, time-to-failure, communication cadence.
- Efficiency: 4 -- Good but slightly less specific diagnostic commands.
- Depth: 4 -- Good but less specific than A (no SQL queries, no replication slot check, no autovacuum analysis).
- **Composite: 4.73**

### Condition C (v2 agents)
- must_mention coverage: 4/4 -- time to 100% at 7.5 hours (hit), immediate actions (hit), short-term (hit), long-term with monitoring at 70/80/90 (hit)
- must_not violations: None.
- Completeness: 5 -- All must-mentions plus auto-scaling storage, capacity planning.
- Precision: 5 -- Calculation correct.
- Actionability: 5 -- Communication plan table, investigation steps, phased actions.
- Structure: 5 -- Time-to-failure, prioritized list, communication table.
- Efficiency: 5 -- Well-organized.
- Depth: 4 -- Good but less database-specific depth than A (no SQL queries for table sizes, no replication slot analysis).
- **Composite: 4.80**

---

## Task 4: ir-004

**Ground Truth Summary:** Must mention: immediately revoke the key, audit CloudTrail/access logs for unauthorized access, identify what data may have been accessed, legal/compliance notification requirements (GDPR, breach disclosure), rotate all related credentials. Structure: immediate containment (minutes), investigation (hours), notification/compliance (24-72h).

### Condition A (bare)
- must_mention coverage: 5/5 -- revoke key (hit, within 60 seconds), audit CloudTrail (hit with specific commands), identify data accessed (hit), legal/compliance GDPR (hit), rotate credentials (hit)
- must_not violations: None.
- Completeness: 5 -- All must-mentions. Adds GitHub removal, evidence preservation, lateral movement, blameless investigation, preventive measures table.
- Precision: 5 -- All claims accurate. AWS CLI commands provided.
- Actionability: 5 -- Specific AWS CLI commands, phase-by-phase plan, preventive measures table with owners.
- Structure: 5 -- Minutes/hours/24-72h structure. Immediate containment, investigation, compliance phases.
- Efficiency: 5 -- Dense, every section adds value.
- Depth: 5 -- CloudTrail query examples, lateral movement assessment, S3 versioning for integrity, GitHub scraper awareness, bucket policies for VPC restriction.
- **Composite: 5.00**

### Condition B (v1 agents)
- must_mention coverage: 5/5 -- revoke key (hit, immediate), audit CloudTrail (hit), identify data (hit), legal/compliance GDPR/CCPA (hit), rotate credentials (hit)
- must_not violations: None.
- Completeness: 5 -- All must-mentions. Adds evidence preservation, lateral movement, systemic root causes.
- Precision: 5 -- All claims accurate.
- Actionability: 5 -- Phase-by-phase plan, preventive measures with timelines.
- Structure: 5 -- Minutes/hours/1-week structure.
- Efficiency: 5 -- Dense.
- Depth: 5 -- Systemic root cause analysis (why broad access? why no scanning? why no anomaly detection?), GuardDuty recommendation, OIDC federation.
- **Composite: 5.00**

### Condition C (v2 agents)
- must_mention coverage: 5/5 -- revoke key (hit, within 60 seconds), audit CloudTrail (hit with specific API calls), identify data (hit), legal/compliance GDPR/CCPA (hit), rotate credentials (hit)
- must_not violations: None.
- Completeness: 5 -- All must-mentions. Adds communication plan table, information control emphasis.
- Precision: 5 -- All claims accurate.
- Actionability: 5 -- Communication plan table with times/audiences, investigation steps, preventive measures.
- Structure: 5 -- Immediate/24h/1-week/ongoing structure. Communication table.
- Efficiency: 5 -- Dense, communication table is excellent.
- Depth: 5 -- Three questions framework for root cause, emphasizes systemic failures, mentions S3 Object Lock, OIDC federation.
- **Composite: 5.00**

---

## Task 5: ir-005

**Ground Truth Summary:** Must mention: likely caching issue (session/response cache serving wrong user), P0 severity (data privacy violation), immediate mitigation (disable caching layer or add cache-busting), investigate CDN/reverse proxy/application-level caching, may need to notify affected users (privacy regulations). Must not: suggest it's an auth bug without evidence (caching is more likely given intermittent + no code change).

### Condition A (bare)
- must_mention coverage: 5/5 -- caching issue as primary suspect (hit), P0 severity (hit), immediate mitigation disable caching/purge (hit), investigate CDN/proxy/app cache (hit), user notification per regulations (hit)
- must_not violations: None -- correctly prioritizes caching over auth bug. Mentions session store as secondary, not primary.
- Completeness: 5 -- All must-mentions. Adds service offline consideration, session invalidation, response integrity checking.
- Precision: 5 -- Correctly identifies caching as most likely. Explains why intermittent + no code change points to caching.
- Actionability: 5 -- Disable caching, purge CDN, flush sessions, force re-auth, add Cache-Control headers.
- Structure: 5 -- Time-boxed phases, resolution table by root cause, communication plan.
- Efficiency: 5 -- Dense, every section adds value.
- Depth: 5 -- Redis maxmemory-policy allkeys-lru analysis, CDN config vs "no code changes" distinction, Vary header analysis, canary monitoring.
- **Composite: 5.00**

### Condition B (v1 agents)
- must_mention coverage: 5/5 -- caching issue (hit, primary suspect), P0 (hit), immediate mitigation (hit), CDN/proxy investigation (hit), user notification (hit)
- must_not violations: None -- correctly prioritizes caching. Session store race condition is secondary.
- Completeness: 5 -- All must-mentions. Adds maintenance mode consideration, connection pool contamination.
- Precision: 5 -- Correct prioritization.
- Actionability: 5 -- Three-phase mitigation, Cache-Control headers, session invalidation.
- Structure: 5 -- Time-boxed, communication cadence, follow-up.
- Efficiency: 5 -- Dense.
- Depth: 5 -- CDN hypothesis testing first (easiest to test), connection pool state leakage, async context leak, thread-local variable leakage.
- **Composite: 5.00**

### Condition C (v2 agents)
- must_mention coverage: 5/5 -- caching issue (hit), P0 (hit), immediate mitigation (hit), CDN/proxy/app cache investigation (hit), user notification per regulations (hit)
- must_not violations: None -- caching prioritized correctly.
- Completeness: 5 -- All must-mentions. Communication plan table, maintenance mode assessment.
- Precision: 5 -- Correct prioritization. CDN hypothesis testable first.
- Actionability: 5 -- Communication table, phased mitigation, session invalidation.
- Structure: 5 -- Communication plan table, time-boxed phases.
- Efficiency: 5 -- Dense, well-organized.
- Depth: 5 -- 5% rate may correspond to specific cache node, async framework context leakage, response integrity hashing, in-memory session store corruption.
- **Composite: 5.00**

---

## Summary

| Task | A | B | C |
|------|---|---|---|
| ir-001 | 5.00 | 4.73 | 5.00 |
| ir-002 | 5.00 | 4.73 | 5.00 |
| ir-003 | 5.00 | 4.73 | 4.80 |
| ir-004 | 5.00 | 5.00 | 5.00 |
| ir-005 | 5.00 | 5.00 | 5.00 |
| **Mean** | **5.00** | **4.84** | **4.96** |
| B LIFT (vs A) | -- | -0.16 | -- |
| C LIFT (vs A) | -- | -- | -0.04 |
| C vs B | -- | -- | +0.12 |
