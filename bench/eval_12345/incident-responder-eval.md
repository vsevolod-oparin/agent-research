# incident-responder Evaluation

## Task ir-001: API Response Time Spike
**Ground Truth Summary:** Must mention P0/P1 classification, first 5-min actions (acknowledge, war room, page on-call), check DB/dependencies/infra, stakeholder communication template. Structure: time-boxed action plan, severity classification with reasoning, communication cadence.

### Condition 1
- must_mention: 4/4 (severity implied as high, first 5-min actions, DB/dependencies/infra checks, communication template)
- must_not violations: none
- Completeness: 4 -- Covers immediate actions, investigation, communication. Missing explicit P0/P1 label.
- Precision: 5 -- All suggestions relevant and correct.
- Actionability: 5 -- Specific commands (pg_stat_activity, pg_locks), mitigation options.
- Structure: 4 -- Time-boxed sections, communication section. Missing explicit severity label.
- Efficiency: 4 -- Concise, no wasted content.
- Depth: 4 -- Good diagnostic commands and reasoning.
- **Composite: 4.33**

### Condition 2
- must_mention: 4/4 (P1 classification, 5-min actions, DB/infra checks, communication)
- must_not violations: none
- Completeness: 5 -- All must-mention covered comprehensively.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Specific commands and runbooks.
- Structure: 5 -- Time-boxed plan, severity classification, communication cadence.
- Efficiency: 4 -- Well-balanced.
- Depth: 4 -- Good diagnostic flow.
- **Composite: 4.73**

### Condition 3
- must_mention: 4/4 (P0/SEV-1, 5-min actions, checks, communication)
- must_not violations: none
- Completeness: 5 -- All must-mention plus escalation criteria.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Detailed commands and investigation steps.
- Structure: 5 -- Time-boxed with explicit time markers, severity reasoning.
- Efficiency: 4 -- Thorough.
- Depth: 5 -- Deep investigation pathways.
- **Composite: 4.87**

### Condition 4
- must_mention: 4/4 (P1/SEV-1, actions, checks, communication)
- must_not violations: none
- Completeness: 5 -- All must-mention plus escalation.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Specific commands.
- Structure: 5 -- Time-boxed, severity classification.
- Efficiency: 4 -- Well-organized.
- Depth: 5 -- Detailed investigation framework.
- **Composite: 4.87**

### Condition 5
- must_mention: 4/4 (P0, actions, checks, communication)
- must_not violations: none
- Completeness: 5 -- All must-mention plus post-incident.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Detailed investigation.
- Structure: 5 -- Time-boxed, severity, communication cadence.
- Efficiency: 4 -- Comprehensive.
- Depth: 5 -- Very detailed.
- **Composite: 4.87**

### Condition 22
- must_mention: 4/4
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Good commands.
- Structure: 5 -- Time-boxed, severity.
- Efficiency: 4 -- Balanced.
- Depth: 4 -- Good depth.
- **Composite: 4.73**

### Condition 33
- must_mention: 4/4
- must_not violations: none
- Completeness: 4 -- All must-mention covered.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Good commands.
- Structure: 4 -- Time-boxed but slightly less organized.
- Efficiency: 4 -- Concise.
- Depth: 4 -- Good.
- **Composite: 4.40**

### Condition 44
- must_mention: 4/4
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Good commands.
- Structure: 5 -- Time-boxed, severity.
- Efficiency: 4 -- Balanced.
- Depth: 4 -- Good.
- **Composite: 4.73**

### Condition 111
- must_mention: 4/4
- must_not violations: none
- Completeness: 5 -- All must-mention plus monitoring code.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Detailed with code.
- Structure: 4 -- Has structure but heavy on code.
- Efficiency: 3 -- Code heavy.
- Depth: 4 -- Good.
- **Composite: 4.40**

### Condition 222
- must_mention: 4/4
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Good commands.
- Structure: 5 -- Time-boxed.
- Efficiency: 4 -- Balanced.
- Depth: 4 -- Good.
- **Composite: 4.73**

### Condition 333
- must_mention: 4/4
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Detailed.
- Structure: 5 -- Time-boxed, severity.
- Efficiency: 4 -- Comprehensive.
- Depth: 5 -- Very detailed.
- **Composite: 4.87**

### Condition 444
- must_mention: 4/4
- must_not violations: none
- Completeness: 5 -- All must-mention plus extensive post-incident.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Detailed.
- Structure: 5 -- Time-boxed.
- Efficiency: 3 -- Lengthy.
- Depth: 5 -- Very detailed.
- **Composite: 4.73**

---

## Task ir-002: Payment Processing Failure
**Ground Truth Summary:** Must mention external dependency failure, check gateway outage, fallback/retry strategy, customer communication, revenue impact estimation. Must NOT suggest rolling back (no recent deployment, external issue).

### Condition 1
- must_mention: 4/5 (external dependency: yes, check outage: yes, fallback/retry: partially, customer comms: yes, revenue impact: not explicitly)
- must_not violations: none -- does not suggest rollback
- Completeness: 4 -- Most must-mention. Missing explicit revenue impact.
- Precision: 5 -- Accurate, correctly identifies external dependency.
- Actionability: 4 -- Good investigation steps.
- Structure: 4 -- Time-boxed.
- Efficiency: 4 -- Concise.
- Depth: 3 -- Brief.
- **Composite: 4.00**

### Condition 2
- must_mention: 5/5 (all covered)
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Detailed steps.
- Structure: 5 -- Time-boxed, structured.
- Efficiency: 4 -- Well-balanced.
- Depth: 4 -- Good.
- **Composite: 4.73**

### Condition 3
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention plus monitoring.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Detailed.
- Structure: 5 -- Time-boxed.
- Efficiency: 4 -- Comprehensive.
- Depth: 5 -- Revenue estimation methodology.
- **Composite: 4.87**

### Condition 4
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Detailed.
- Structure: 5 -- Time-boxed.
- Efficiency: 4 -- Good.
- Depth: 5 -- Detailed revenue estimation.
- **Composite: 4.87**

### Condition 5
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Detailed.
- Structure: 5 -- Time-boxed.
- Efficiency: 4 -- Comprehensive.
- Depth: 5 -- Detailed.
- **Composite: 4.87**

### Condition 22
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Detailed.
- Structure: 5 -- Time-boxed.
- Efficiency: 4 -- Good.
- Depth: 4 -- Good.
- **Composite: 4.73**

### Condition 33
- must_mention: 4/5 (missing explicit revenue impact estimation)
- must_not violations: none
- Completeness: 4 -- Most must-mention.
- Precision: 5 -- Accurate.
- Actionability: 4 -- Good.
- Structure: 4 -- Time-boxed.
- Efficiency: 4 -- Concise.
- Depth: 3 -- Brief.
- **Composite: 4.00**

### Condition 44
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Detailed.
- Structure: 5 -- Time-boxed.
- Efficiency: 4 -- Good.
- Depth: 4 -- Good.
- **Composite: 4.73**

### Condition 111
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- With code.
- Structure: 4 -- Code heavy.
- Efficiency: 3 -- Lengthy.
- Depth: 4 -- Good.
- **Composite: 4.40**

### Condition 222
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Detailed.
- Structure: 5 -- Time-boxed.
- Efficiency: 4 -- Good.
- Depth: 4 -- Good.
- **Composite: 4.73**

### Condition 333
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Detailed.
- Structure: 5 -- Time-boxed.
- Efficiency: 4 -- Comprehensive.
- Depth: 5 -- Detailed.
- **Composite: 4.87**

### Condition 444
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention plus extensive detail.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Detailed.
- Structure: 5 -- Time-boxed.
- Efficiency: 3 -- Lengthy.
- Depth: 5 -- Very detailed.
- **Composite: 4.73**

---

## Task ir-003: Disk Usage Critical
**Ground Truth Summary:** Must mention calculate time to 100% (~7.5 hours), immediate actions (identify large tables/temp files/logs), short-term (archive/purge/expand), long-term (retention policies, monitoring at 80%). Structure: time-to-failure estimate, prioritized action list.

### Condition 1
- must_mention: 4/4 (time calc: yes ~7.5h, immediate: yes, short-term: yes, long-term: yes)
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate time calculation.
- Actionability: 5 -- Specific commands.
- Structure: 5 -- Time-to-failure, prioritized list.
- Efficiency: 4 -- Concise.
- Depth: 4 -- Good commands.
- **Composite: 4.73**

### Condition 2
- must_mention: 4/4
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Commands.
- Structure: 5 -- Time-to-failure, prioritized.
- Efficiency: 4 -- Good.
- Depth: 5 -- Detailed investigation.
- **Composite: 4.87**

### Condition 3
- must_mention: 4/4
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Detailed commands.
- Structure: 5 -- Time-to-failure, prioritized.
- Efficiency: 4 -- Comprehensive.
- Depth: 5 -- Very detailed.
- **Composite: 4.87**

### Condition 4
- must_mention: 4/4
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Commands.
- Structure: 5 -- Time-to-failure, prioritized.
- Efficiency: 4 -- Good.
- Depth: 5 -- Detailed.
- **Composite: 4.87**

### Condition 5
- must_mention: 4/4
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Commands.
- Structure: 5 -- Time-to-failure, prioritized.
- Efficiency: 4 -- Comprehensive.
- Depth: 5 -- Very detailed.
- **Composite: 4.87**

### Condition 22
- must_mention: 4/4
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Commands.
- Structure: 5 -- Prioritized.
- Efficiency: 4 -- Good.
- Depth: 4 -- Good.
- **Composite: 4.73**

### Condition 33
- must_mention: 4/4
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Commands.
- Structure: 4 -- Prioritized but less organized.
- Efficiency: 4 -- Concise.
- Depth: 4 -- Good.
- **Composite: 4.53**

### Condition 44
- must_mention: 4/4
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Commands.
- Structure: 5 -- Time-to-failure, prioritized.
- Efficiency: 4 -- Good.
- Depth: 4 -- Good.
- **Composite: 4.73**

### Condition 111
- must_mention: 4/4
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- With code.
- Structure: 4 -- Code heavy.
- Efficiency: 3 -- Lengthy.
- Depth: 4 -- Good.
- **Composite: 4.40**

### Condition 222
- must_mention: 4/4
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Commands.
- Structure: 5 -- Prioritized.
- Efficiency: 4 -- Good.
- Depth: 4 -- Good.
- **Composite: 4.73**

### Condition 333
- must_mention: 4/4
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Commands.
- Structure: 5 -- Time-to-failure, prioritized.
- Efficiency: 4 -- Comprehensive.
- Depth: 5 -- Very detailed.
- **Composite: 4.87**

### Condition 444
- must_mention: 4/4
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Detailed commands.
- Structure: 5 -- Time-to-failure, prioritized.
- Efficiency: 3 -- Lengthy.
- Depth: 5 -- Very detailed.
- **Composite: 4.73**

---

## Task ir-004: Potential Data Breach (API Key on GitHub)
**Ground Truth Summary:** Must mention immediately revoke key, audit CloudTrail/access logs, identify accessed data, legal/compliance notification (GDPR), rotate related credentials. Structure: containment (minutes), investigation (hours), notification (24-72h).

### Condition 1
- must_mention: 5/5 (revoke: yes, audit: yes, identify data: yes, legal: mentioned briefly, rotate: yes)
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Specific AWS commands.
- Structure: 4 -- Time-boxed but missing explicit phases.
- Efficiency: 4 -- Concise.
- Depth: 4 -- Good.
- **Composite: 4.53**

### Condition 2
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Commands.
- Structure: 5 -- Time-phased (immediate, investigation, notification).
- Efficiency: 4 -- Good.
- Depth: 5 -- Detailed.
- **Composite: 4.87**

### Condition 3
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention plus forensic detail.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Detailed commands.
- Structure: 5 -- Time-phased.
- Efficiency: 4 -- Comprehensive.
- Depth: 5 -- Very detailed CloudTrail queries.
- **Composite: 4.87**

### Condition 4
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Commands.
- Structure: 5 -- Time-phased.
- Efficiency: 4 -- Good.
- Depth: 5 -- Detailed.
- **Composite: 4.87**

### Condition 5
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Commands.
- Structure: 5 -- Time-phased.
- Efficiency: 4 -- Comprehensive.
- Depth: 5 -- Very detailed.
- **Composite: 4.87**

### Condition 22
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Commands.
- Structure: 5 -- Time-phased.
- Efficiency: 4 -- Good.
- Depth: 4 -- Good.
- **Composite: 4.73**

### Condition 33
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Commands.
- Structure: 4 -- Time-boxed.
- Efficiency: 4 -- Concise.
- Depth: 4 -- Good.
- **Composite: 4.53**

### Condition 44
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Commands.
- Structure: 5 -- Time-phased.
- Efficiency: 4 -- Good.
- Depth: 5 -- Detailed.
- **Composite: 4.87**

### Condition 111
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- With code.
- Structure: 4 -- Code heavy.
- Efficiency: 3 -- Lengthy.
- Depth: 4 -- Good.
- **Composite: 4.40**

### Condition 222
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Commands.
- Structure: 5 -- Time-phased.
- Efficiency: 4 -- Good.
- Depth: 5 -- Detailed.
- **Composite: 4.87**

### Condition 333
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Commands.
- Structure: 5 -- Time-phased.
- Efficiency: 4 -- Comprehensive.
- Depth: 5 -- Very detailed.
- **Composite: 4.87**

### Condition 444
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Detailed.
- Structure: 5 -- Time-phased.
- Efficiency: 3 -- Very lengthy.
- Depth: 5 -- Very detailed.
- **Composite: 4.73**

---

## Task ir-005: Users Seeing Other Users' Data
**Ground Truth Summary:** Must mention likely caching issue, P0 severity, immediate mitigation (disable caching/cache-busting), investigate CDN/proxy/app caching, may need to notify affected users. Must NOT suggest auth bug without evidence (caching more likely given intermittent + no code change).

### Condition 1
- must_mention: 4/5 (caching: yes, P0: implied critical, disable caching: partially, CDN/proxy: partially, notify users: not mentioned)
- must_not violations: none -- correctly focuses on caching
- Completeness: 4 -- Most must-mention. Missing user notification.
- Precision: 5 -- Correctly identifies caching as most likely.
- Actionability: 4 -- Good investigation steps.
- Structure: 3 -- Less structured than others.
- Efficiency: 4 -- Concise.
- Depth: 4 -- Good root cause analysis.
- **Composite: 3.93**

### Condition 2
- must_mention: 5/5 (caching: yes, P0: implied, disable caching: yes, CDN/proxy: yes, notify: mentioned in passing)
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Redis commands, investigation steps.
- Structure: 5 -- Well-structured.
- Efficiency: 4 -- Good.
- Depth: 5 -- Multiple root cause hypotheses.
- **Composite: 4.87**

### Condition 3
- must_mention: 5/5 (all covered including notification/legal)
- must_not violations: none -- correctly identifies caching as primary hypothesis
- Completeness: 5 -- All must-mention plus legal, session rotation.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Fix verification checklist.
- Structure: 5 -- Communication cadence, checklist.
- Efficiency: 4 -- Comprehensive.
- Depth: 5 -- Deep analysis with multiple hypotheses.
- **Composite: 4.87**

### Condition 4
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention plus legal, session invalidation.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Detailed mitigation options.
- Structure: 5 -- Communication plan, mitigation table.
- Efficiency: 4 -- Comprehensive.
- Depth: 5 -- Deep analysis.
- **Composite: 4.87**

### Condition 5
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention plus verification criteria, legal.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Fix implementation checklist.
- Structure: 5 -- Communication cadence, checklists.
- Efficiency: 4 -- Comprehensive.
- Depth: 5 -- Very detailed with verification criteria.
- **Composite: 4.87**

### Condition 22
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention plus GDPR 72h, evidence preservation.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Mitigation table.
- Structure: 5 -- Communication cadence, legal section.
- Efficiency: 4 -- Comprehensive.
- Depth: 5 -- GDPR compliance detail.
- **Composite: 4.87**

### Condition 33
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention plus Redis flush, legal.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Redis commands, mitigation options.
- Structure: 4 -- Less organized.
- Efficiency: 4 -- Good.
- Depth: 4 -- Good.
- **Composite: 4.53**

### Condition 44
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention plus forensic scope, legal.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Detailed mitigation per root cause.
- Structure: 5 -- Communication plan, forensics.
- Efficiency: 4 -- Comprehensive.
- Depth: 5 -- Deep analysis.
- **Composite: 4.87**

### Condition 111
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- With code.
- Structure: 4 -- Code heavy.
- Efficiency: 3 -- Lengthy.
- Depth: 4 -- Good.
- **Composite: 4.40**

### Condition 222
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Customer communication template.
- Structure: 4 -- Code heavy.
- Efficiency: 3 -- Lengthy.
- Depth: 4 -- Good.
- **Composite: 4.40**

### Condition 333
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention plus test code.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Test code, verification.
- Structure: 5 -- Well-structured.
- Efficiency: 3 -- Lengthy.
- Depth: 5 -- Deep analysis with test verification.
- **Composite: 4.73**

### Condition 444
- must_mention: 5/5
- must_not violations: none
- Completeness: 5 -- All must-mention.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Verification scripts.
- Structure: 5 -- Well-structured.
- Efficiency: 3 -- Very lengthy.
- Depth: 5 -- Very detailed.
- **Composite: 4.73**

---

## Summary

| Task | 1 | 2 | 3 | 4 | 5 | 22 | 33 | 44 | 111 | 222 | 333 | 444 |
|------|---|---|---|---|---|----|----|----|----|-----|-----|-----|
| ir-001 | 4.33 | 4.73 | 4.87 | 4.87 | 4.87 | 4.73 | 4.40 | 4.73 | 4.40 | 4.73 | 4.87 | 4.73 |
| ir-002 | 4.00 | 4.73 | 4.87 | 4.87 | 4.87 | 4.73 | 4.00 | 4.73 | 4.40 | 4.73 | 4.87 | 4.73 |
| ir-003 | 4.73 | 4.87 | 4.87 | 4.87 | 4.87 | 4.73 | 4.53 | 4.73 | 4.40 | 4.73 | 4.87 | 4.73 |
| ir-004 | 4.53 | 4.87 | 4.87 | 4.87 | 4.87 | 4.73 | 4.53 | 4.87 | 4.40 | 4.87 | 4.87 | 4.73 |
| ir-005 | 3.93 | 4.87 | 4.87 | 4.87 | 4.87 | 4.87 | 4.53 | 4.87 | 4.40 | 4.40 | 4.73 | 4.73 |
| **Mean** | **4.30** | **4.81** | **4.87** | **4.87** | **4.87** | **4.76** | **4.40** | **4.79** | **4.40** | **4.69** | **4.84** | **4.73** |
