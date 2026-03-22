# incident-responder Evaluation

## Task: ir-001

**Input:** API response times spiked from 200ms to 15s across all endpoints. Error rate jumped from 0.1% to 45%. Started 3 minutes ago. No recent deployments. 2000 active users affected.

**Ground Truth must_mention:**
1. Classify as P0/P1 (high user impact, all endpoints)
2. First 5 min actions (acknowledge, war room, page on-call)
3. Check database connections, external dependencies, infrastructure
4. Stakeholder communication template

---

### Bare Response

This looks like a serious production incident. Here's what I'd recommend:

**Assessment:** This is a high-severity issue. With 45% error rates across all endpoints and 2000 users affected, you need to treat this as urgent.

**Immediate steps:**
- Check your monitoring dashboards to see which services are degraded
- Look at database connection pools -- a spike from 200ms to 15s often indicates database bottlenecks or connection exhaustion
- Check external dependencies and third-party APIs that your endpoints rely on
- Review infrastructure metrics: CPU, memory, disk I/O on your application servers
- Check if there's a network issue or DNS resolution problem

**Since no recent deployments occurred**, this is likely an infrastructure issue, database problem, or external dependency failure. Look at what changed in the environment -- did traffic spike? Did a background job kick off? Is there a database lock or long-running query?

**Communication:** Let your team and stakeholders know there's an issue being investigated. Keep them updated every 15-30 minutes.

**Investigation approach:** Start with the database layer since latency spikes across ALL endpoints often point to a shared dependency like the database. Check connection pool utilization, active queries, and replication lag if applicable. Also check load balancer health and backend instance status.

Once you identify the root cause, focus on mitigation first (restart, scale up, failover) before attempting a permanent fix.

---

### V1 Response

**INCIDENT DECLARED -- SEVERITY: P0**

**Severity Classification:** P0 -- Critical. 45% error rate across ALL endpoints with 15s response times affecting 2000 active users constitutes a near-complete service outage. All hands on deck, immediate response required.

**Reasoning:** Meets P0 criteria: widespread user impact (2000 users), all endpoints affected (not isolated), error rate indicates significant data loss/failure for nearly half of all requests.

**FIRST 5 MINUTES -- IMMEDIATE ACTIONS:**

1. **Acknowledge** the alert and **declare incident** in the incident channel
2. **Open war room** -- create dedicated Slack channel #inc-api-latency-[date], start video bridge
3. **Page on-call engineers** for: API services, database, infrastructure/platform
4. **Assign roles**: Incident Commander (you), Operations Lead, Communications Lead

**INVESTIGATION PRIORITIES (Minutes 5-15):**

Since no recent deployments, focus on shared dependencies:
- **Database**: Check connection pool exhaustion, active query count, replication lag, lock contention
- **External dependencies**: Verify status of third-party APIs, payment gateways, auth providers
- **Infrastructure**: CPU/memory/disk on app servers, load balancer health, network latency between services
- **Check for**: Background jobs, cron tasks, or batch processes that may have started

**STAKEHOLDER COMMUNICATION (Template):**

> **[INCIDENT] API Performance Degradation -- P0**
> **Status:** Investigating
> **Impact:** API response times elevated (~15s), ~45% of requests failing. ~2000 users affected.
> **Started:** [timestamp, 3 min ago]
> **Next update:** In 15 minutes
> **IC:** [Your name]

**Communication cadence:** Updates every 15 minutes for P0 until mitigated. Tailor messages for leadership (business impact), engineering (technical details), and customer support (user-facing talking points).

---

### V2 Response

**INCIDENT DECLARED -- SEVERITY: P0 (CRITICAL)**

**Classification:** P0. 45% error rate + 15s latency across ALL endpoints + 2000 users = near-total service degradation. Immediate response required, all hands on deck.

**INCIDENT TYPE (Decision Tree):** Gradual degradation, no deploy --> **Infrastructure/shared dependency.** First investigation: Check CPU/memory/disk, database connections, network.

**FIRST 5 MINUTES:**
1. Acknowledge alert, declare incident
2. Open war room: #inc-api-latency-[date] + video bridge
3. Page on-call: API, database, infrastructure teams
4. Assign: IC (self), Operations Lead, Communications Lead

**INVESTIGATION (Minutes 5-20):**

| Hypothesis | Check | Command/Tool |
|-----------|-------|-------------|
| DB connection exhaustion | Active connections vs pool max | `SELECT count(*) FROM pg_stat_activity;` |
| DB lock contention | Blocked queries | `SELECT * FROM pg_locks WHERE NOT granted;` |
| External dependency down | Third-party status | Check status pages, test connectivity |
| Infrastructure saturation | CPU/mem/disk/network | Monitoring dashboards, `top`, `iostat` |
| DNS/network partition | Connectivity between services | `dig`, `curl` to internal endpoints |

**ANTI-PATTERNS TO AVOID:**
- Do NOT make multiple changes at once -- change one thing, observe, then proceed
- Do NOT deploy a speculative fix straight to production
- Do NOT let the incident channel go silent -- post updates even if "still investigating"

**STAKEHOLDER COMMUNICATION:**

> **[P0 INCIDENT] API Performance Degradation**
> **Impact:** ~45% request failure, 15s response times, 2000 users affected
> **Status:** Investigating -- no recent deployments; focusing on infrastructure/DB
> **Started:** [timestamp]
> **Next update:** 15 minutes | **IC:** [Name]

**Communication cadence:** Every 15 min (P0). Audience-specific: leadership gets business impact, support gets customer talking points, engineering gets technical details.

**ESCALATION TRIGGER:** If no progress in 30 minutes, escalate to VP Engineering and consider activating DR/failover.

---

### Scores

| Dimension | Bare | V1 | V2 |
|-----------|------|-----|-----|
| Completeness | 3 | 5 | 5 |
| Precision | 4 | 5 | 5 |
| Actionability | 3 | 4 | 5 |
| Structure | 2 | 4 | 5 |
| Efficiency | 3 | 4 | 4 |
| Depth | 3 | 4 | 5 |

**Composite Calculation:**
- Bare: (4x2 + 3x1.5 + 3+2+3+3) / 7.5 = (8 + 4.5 + 11) / 7.5 = **3.13**
- V1: (5x2 + 5x1.5 + 4+4+4+4) / 7.5 = (10 + 7.5 + 16) / 7.5 = **4.47**
- V2: (5x2 + 5x1.5 + 5+5+4+5) / 7.5 = (10 + 7.5 + 19) / 7.5 = **4.87**

### Ground Truth Check
- must_mention coverage: bare 2/4 (severity vague, no war room/paging, has DB/deps/infra, communication mentioned but no template), v1 4/4, v2 4/4
- structure coverage: bare 0/3 (no time-boxing, no formal severity, no cadence), v1 3/3, v2 3/3

---

## Task: ir-004

**Input:** Security team reports potential data breach. An internal employee's API key was found posted on a public GitHub repo. The key has read/write access to production S3 buckets containing user PII. Unknown how long it's been exposed.

**Ground Truth must_mention:**
1. Immediately revoke the key
2. Audit CloudTrail/access logs for unauthorized access
3. Identify what data may have been accessed
4. Legal/compliance notification requirements (GDPR, breach disclosure)
5. Rotate all related credentials

---

### Bare Response

This is a serious security incident that needs immediate action. Here's what to do:

**Step 1 -- Revoke the key immediately.** Go to the AWS IAM console and deactivate or delete the compromised API key right now. Every minute it stays active is a minute an attacker could be using it.

**Step 2 -- Check access logs.** Pull the AWS CloudTrail logs for the compromised key. Look for any API calls that weren't made by the legitimate employee -- especially S3 GetObject, ListBucket, or PutObject calls on the PII buckets. Pay attention to unusual source IPs, access times, or regions.

**Step 3 -- Assess the damage.** Based on the CloudTrail audit, determine what data could have been accessed. Which S3 buckets were touched? What PII is stored there? How many user records could be affected?

**Step 4 -- Rotate credentials.** Don't just revoke this one key -- rotate any related credentials. If the employee had other keys or access tokens, rotate those too. Review the employee's IAM permissions.

**Step 5 -- Legal and compliance.** Depending on your jurisdiction, you may need to notify regulators and affected users. GDPR requires breach notification within 72 hours if personal data was compromised. Check with your legal team about disclosure requirements.

**Step 6 -- Prevent recurrence.** Set up GitHub secret scanning, enforce credential rotation policies, and consider using short-lived tokens instead of long-lived API keys.

---

### V1 Response

**INCIDENT DECLARED -- SEVERITY: P0 (SECURITY)**

**Severity Classification:** P0 -- Critical. Potential exposure of user PII via compromised production credentials on public internet. Data breach implications require immediate response. All hands on deck.

**FIRST 5 MINUTES -- IMMEDIATE ACTIONS:**

1. **Acknowledge and declare** security incident. Open dedicated war room: #inc-security-api-key-leak
2. **Page on-call**: Security team lead, platform/IAM engineer, VP Engineering
3. **IMMEDIATELY REVOKE the compromised API key** via AWS IAM. This is the #1 priority -- every second the key is live increases exposure
4. **Assign roles**: IC (you), Security Lead (investigation), Communications Lead (stakeholder/legal comms)

**INVESTIGATION (Minutes 5-60):**

- **Audit CloudTrail logs** for the compromised access key ID. Search for:
  - All S3 API calls (GetObject, PutObject, ListBucket, DeleteObject)
  - Source IP addresses -- identify any non-corporate IPs
  - Time range: from key creation to now (exposure duration unknown)
  - Geographic anomalies in access patterns
- **Identify affected data**: Which S3 buckets were accessible? What PII do they contain? How many user records?
- **Check the GitHub repo**: When was the key posted? Public for how long? Has it been forked or cached?
- **Rotate ALL related credentials**: Not just this key -- any credentials the employee has access to, any shared secrets in the same scope

**STAKEHOLDER COMMUNICATION:**

> **[P0 SECURITY INCIDENT] Potential Data Breach -- Compromised API Key**
> **Status:** Containment in progress. Key revoked. Investigating access logs.
> **Impact:** Production S3 buckets with user PII potentially exposed. Scope under investigation.
> **Next update:** 30 minutes

**LEGAL/COMPLIANCE (24-72h):**
- Engage legal counsel immediately to assess breach notification obligations
- **GDPR**: 72-hour notification window to supervisory authority if EU user data involved
- **State laws**: Check applicable breach notification statutes (e.g., CCPA for California residents)
- Prepare draft notification for affected users pending investigation results
- Preserve all evidence and logs for potential regulatory inquiry

**Communication cadence:** Every 30 minutes during active containment, every 2 hours during investigation phase.

---

### V2 Response

**INCIDENT DECLARED -- SEVERITY: P0 (SECURITY INCIDENT)**

**Classification:** P0 -- Critical. Compromised production credentials with PII access on the public internet. Data breach protocol activated.

**INCIDENT TYPE (Decision Tree):** Security alerts firing --> **Security incident.** First step: Isolate affected systems, preserve logs, escalate to security team.

**IMMEDIATE CONTAINMENT (Minutes 0-5):**
1. **REVOKE the API key NOW** -- AWS IAM console, deactivate immediately
2. Declare incident, open war room #inc-security-key-leak
3. Page: Security lead, IAM/platform engineer, VP Eng, Legal counsel
4. Assign: IC (self), Security Lead, Communications Lead

**INVESTIGATION (Minutes 5-60):**

| Step | Action | What to Look For |
|------|--------|-----------------|
| CloudTrail audit | Filter by access key ID, full time range | Non-corporate IPs, unusual regions, S3 API calls |
| S3 access analysis | GetObject/ListBucket/PutObject on PII buckets | Bulk downloads, unfamiliar user agents |
| GitHub exposure window | Check commit history, repo forks, web caches | When key first appeared, who may have seen it |
| Blast radius | Map all buckets/resources the key could access | Full scope of potentially compromised data |
| Credential rotation | Rotate ALL employee credentials + shared secrets | Don't limit to just the exposed key |

**ANTI-PATTERNS TO AVOID:**
- Do NOT assume "no unauthorized access found" means no breach occurred -- absence of evidence is not evidence of absence
- Do NOT delete the GitHub repo/commit before preserving evidence (screenshot, archive)
- Do NOT skip postmortem because "it was just a leaked key" -- this is P0
- Do NOT communicate breach details externally before legal review

**LEGAL/COMPLIANCE TIMELINE:**

| Timeframe | Action |
|-----------|--------|
| Immediately | Engage legal counsel, start evidence preservation |
| 0-24h | Complete CloudTrail audit, determine if data was accessed |
| 24-48h | Draft regulatory notifications if breach confirmed |
| 48-72h | **GDPR deadline**: notify supervisory authority (if EU data) |
| 72h+ | User notifications per applicable law (GDPR, CCPA, state statutes) |

**STAKEHOLDER COMMUNICATION:**

> **[P0 SECURITY] Potential Data Breach -- Compromised Credential**
> **Status:** Key revoked. Investigating access logs for unauthorized usage.
> **Impact:** Production S3 with user PII potentially exposed. Scope TBD.
> **Next update:** 30 minutes | **IC:** [Name]

**ESCALATION:** If CloudTrail shows confirmed unauthorized access, escalate to CEO/Board and activate full breach response plan. Engage forensics firm if needed.

**RESOLUTION CRITERIA:** Key revoked + all related credentials rotated + CloudTrail audit complete + legal notified + postmortem scheduled.

---

### Scores

| Dimension | Bare | V1 | V2 |
|-----------|------|-----|-----|
| Completeness | 4 | 5 | 5 |
| Precision | 4 | 5 | 5 |
| Actionability | 4 | 4 | 5 |
| Structure | 3 | 4 | 5 |
| Efficiency | 4 | 4 | 4 |
| Depth | 3 | 4 | 5 |

**Composite Calculation:**
- Bare: (4x2 + 4x1.5 + 4+3+4+3) / 7.5 = (8 + 6 + 14) / 7.5 = **3.73**
- V1: (5x2 + 5x1.5 + 4+4+4+4) / 7.5 = (10 + 7.5 + 16) / 7.5 = **4.47**
- V2: (5x2 + 5x1.5 + 5+5+4+5) / 7.5 = (10 + 7.5 + 19) / 7.5 = **4.87**

### Ground Truth Check
- must_mention coverage: bare 5/5 (revoke, CloudTrail, identify data, GDPR/legal, rotate credentials), v1 5/5, v2 5/5
- structure coverage: bare 1/3 (sequential but not time-boxed by minutes/hours/days), v1 3/3, v2 3/3

---

## Summary

| Metric | Bare | V1 | V2 |
|--------|------|-----|-----|
| ir-001 Composite | 3.13 | 4.47 | 4.87 |
| ir-004 Composite | 3.73 | 4.47 | 4.87 |
| **Mean Composite** | **3.43** | **4.47** | **4.87** |
| V1 LIFT (vs bare) | | **+1.04** | |
| V2 LIFT (vs bare) | | | **+1.44** |
| V2 LIFT (vs v1) | | | **+0.40** |

### Key Observations

**V1 gains over Bare (+1.04):**
- First-5-minutes protocol gives structured urgency instead of a loose checklist
- P0-P3 severity framework forces explicit classification with reasoning
- Communication cadence (every 15-30 min) and stakeholder template add operational rigor
- War room and role assignment (IC, OL, CL) are absent from bare responses

**V2 gains over V1 (+0.40):**
- **Incident classification decision tree** immediately narrows the investigation -- V2 identifies "Infrastructure/shared dependency" for ir-001 and "Security incident" for ir-004, directing first steps more precisely
- **Anti-patterns** add defensive guardrails (e.g., "don't make multiple changes simultaneously" in ir-001; "don't delete evidence before preserving" in ir-004) -- these are high-value non-obvious additions
- **Tabular investigation plans** with specific commands/tools make V2 more actionable than V1's bullet lists
- **Escalation triggers** with time thresholds (30 min for P0) and **resolution criteria** give clear decision points
- **Legal/compliance timeline table** in ir-004 is more structured than V1's paragraph form
- The runbook template influence shows in V2's consistent "Symptoms -> Actions -> Causes -> Escalation" structure

**Where V2 does NOT gain:** Precision and completeness are already maxed by V1 for these tasks. V2's incremental value is in structure, actionability, and depth -- the operational quality of the response rather than coverage.
