# Incident Response Report

Generated: 2026-03-22

---

## Task 1

### API Response Time Spike and Error Rate Surge

**Incident ID:** INC-20260322-001
**Alert Summary:** API response times spiked from 200ms to 15s across all endpoints. Error rate jumped from 0.1% to 45%. Started 3 minutes ago. No recent deployments. 2000 active users affected.

---

### Severity Assessment

**Severity: P0 -- Critical**

- **User Impact:** 2000 active users affected. 45% error rate means roughly 900 users are experiencing outright failures. The remaining users face 75x slower response times, rendering the service effectively unusable.
- **Business Impact:** Complete service degradation. Revenue loss is active for any transactional flows. Reputational damage is accumulating every minute.
- **System Scope:** All endpoints affected simultaneously, indicating a shared dependency failure rather than a localized issue.
- **Escalation:** Immediate all-hands for on-call SRE, platform team, and database/infrastructure teams.

---

### Immediate Actions (First 5 Minutes)

1. **Declare P0 Incident.** Open a dedicated incident channel (e.g., #inc-api-spike-20260322). Start a war room video call. Assign IC, Operations Lead, and Communications Lead.
2. **Check shared dependencies.** The fact that ALL endpoints are affected rules out application-level bugs in a single service. Immediately investigate:
   - Database connection pool status and query latency.
   - Cache layer (Redis/Memcached) availability and hit rates.
   - Network connectivity between application servers and backend dependencies.
   - DNS resolution times.
   - Load balancer health and backend target status.
3. **Check infrastructure metrics.** CPU, memory, disk I/O, and network throughput on application servers and database servers. Look for saturation.
4. **Check for external factors.** DDoS indicators: unusual traffic patterns, geographic anomalies, request rate spikes. Check WAF/CDN dashboards.
5. **Enable traffic shedding if available.** If the system has circuit breakers or rate limiters, activate them to protect backend systems from cascading overload.

---

### Investigation Steps

1. **Correlate the timeline.** Identify the exact minute the degradation started. Cross-reference with:
   - Infrastructure events (auto-scaling events, instance replacements, AZ issues).
   - Cloud provider status page (AWS/GCP/Azure health dashboard).
   - Scheduled jobs or cron tasks that may have triggered at that time.
   - Certificate expirations or DNS TTL changes.
2. **Examine database metrics.** Query latency, active connections, lock contention, slow query log. A database bottleneck is the most common cause of uniform API degradation.
3. **Check connection pools.** If pools are exhausted, all endpoints will queue requests, explaining the uniform spike. Look for connection leak patterns or pool misconfiguration.
4. **Trace a failing request end-to-end.** Use distributed tracing (Jaeger/Zipkin/X-Ray) to find where the 15s is being spent.
5. **Check for resource exhaustion.** File descriptor limits, thread pool saturation, memory pressure causing garbage collection pauses.

---

### Root Cause Analysis Approach

Given the symptoms (all endpoints, no deployment, sudden onset), the most likely root causes in order of probability:

1. **Database saturation** -- A long-running query, lock escalation, or connection pool exhaustion causing all queries to queue.
2. **Downstream dependency failure** -- A shared service (auth, cache, message queue) became slow or unreachable.
3. **Infrastructure event** -- Cloud provider issue, network partition, or storage I/O degradation.
4. **Resource exhaustion** -- Memory leak reaching critical threshold, file descriptor limit hit, or thread pool starvation.
5. **External attack** -- DDoS or abuse pattern overwhelming backend capacity.

For each hypothesis, define a falsifiable test. For example: if database is the cause, direct database queries from an admin console will also be slow. If cache is the cause, cache hit rate will have dropped to near zero.

---

### Communication Plan

| Time | Audience | Message |
|------|----------|---------|
| T+0 (now) | Engineering team | P0 declared. API degradation affecting all endpoints. War room open. All on-call engineers join immediately. |
| T+5 | Leadership / stakeholders | We are experiencing a service degradation affecting approximately 2000 users. The incident team is assembled and actively investigating. Next update in 15 minutes. |
| T+5 | Customer support | Acknowledge inbound reports. Template: "We are aware of slow performance and errors. Our engineering team is actively working to resolve this. We will provide updates as soon as we have more information." |
| T+15 | All stakeholders | Status update with findings so far, suspected cause, and ETA if known. |
| Every 15 min | All stakeholders | Ongoing updates until resolution. |
| Resolution | All stakeholders | Root cause identified, service restored, timeline of events, follow-up actions. |

---

### Post-Incident Follow-Up

1. **Blameless postmortem** within 48 hours. Document the full timeline, root cause, impact metrics (duration, error count, affected users, revenue impact), and contributing factors.
2. **Action items:**
   - Add monitoring and alerting for the specific failure mode that caused this incident.
   - Implement circuit breakers on shared dependencies if not already present.
   - Review connection pool sizing and timeout configurations.
   - Add automated runbooks for common failure scenarios.
   - Conduct a dependency mapping exercise to identify other single points of failure.
3. **SLO review.** Calculate the error budget consumed by this incident and determine if SLO adjustments or reliability investments are needed.

---
---

## Task 2

### Payment Processing Failures

**Incident ID:** INC-20260322-002
**Alert Summary:** Payment processing failing for ~10% of transactions. Error: "Connection refused" from payment gateway. Started 20 minutes ago. Customer complaints coming in. Last deployment was 2 days ago.

---

### Severity Assessment

**Severity: P1 -- High**

- **User Impact:** 10% of transactions failing. Customers are unable to complete purchases and are actively complaining. However, 90% of transactions are succeeding, which is why this is P1 rather than P0.
- **Business Impact:** Direct revenue loss. Every failed transaction is a lost or delayed sale. Customer trust in payment reliability is eroding. Chargeback and support costs will increase.
- **System Scope:** Isolated to payment gateway connectivity. Other services appear functional.
- **Escalation:** On-call SRE, payments team, and potentially the payment gateway vendor.

---

### Immediate Actions (First 5 Minutes)

1. **Declare P1 Incident.** Open dedicated channel. Assign roles. The 20-minute delay before this response is already concerning -- accelerate all actions.
2. **Check payment gateway vendor status page.** Determine if this is a known outage on the provider's side.
3. **Verify network connectivity to the gateway.** From application servers, test TCP connectivity to the gateway endpoint. The "Connection refused" error means either the gateway is rejecting connections or a network/firewall change is blocking them.
4. **Check if the 10% failure rate correlates with specific servers.** If only some application instances are failing, the issue may be instance-specific (e.g., a specific AZ, a specific host with network issues, or exhausted ephemeral ports).
5. **Implement retry with exponential backoff** if not already in place. For "Connection refused," a retry after a short delay may succeed if the issue is intermittent.
6. **Check for a failover payment processor.** If one exists, prepare to route traffic to the backup.

---

### Investigation Steps

1. **Analyze the failure pattern.**
   - Is it random 10% across all servers, or is it concentrated on specific instances?
   - Is it correlated with transaction type, amount, currency, or card network?
   - Is there a temporal pattern (e.g., every Nth request fails)?
2. **Examine connection metrics to the gateway.**
   - Number of active connections, connection pool usage, TIME_WAIT socket count.
   - DNS resolution for the gateway endpoint -- has the IP changed?
   - TLS handshake failures or certificate issues.
3. **Review gateway rate limits.** "Connection refused" at 10% could indicate the gateway is rate-limiting your traffic. Check if transaction volume has increased.
4. **Check firewall and security group changes.** Even though no deployment occurred, infrastructure changes (security group rules, WAF updates, IP whitelist changes) could block some connections.
5. **Contact the payment gateway vendor.** Open a support ticket and reference the "Connection refused" errors with timestamps and source IPs.

---

### Root Cause Analysis Approach

Most likely causes:

1. **Payment gateway partial outage** -- The vendor is experiencing capacity issues, refusing connections under load. The 10% failure rate suggests some of their backend servers are unhealthy.
2. **Ephemeral port exhaustion** -- On specific application servers, the local port range is depleted, causing connection failures for a subset of requests.
3. **DNS resolution returning mixed results** -- If the gateway uses DNS load balancing, some resolved IPs may point to unhealthy nodes.
4. **Network-level intermittent failure** -- Packet loss, MTU issues, or routing problems affecting a subset of traffic.
5. **Rate limiting** -- The gateway is enforcing connection or request rate limits.

Disambiguation: If the failure is instance-specific, it points to local resource exhaustion. If it is uniform across all instances, it points to the gateway or network.

---

### Communication Plan

| Time | Audience | Message |
|------|----------|---------|
| T+0 | Engineering + payments team | P1 declared. 10% of payment transactions failing with "Connection refused." War room open. |
| T+5 | Customer support | "We are investigating intermittent payment processing issues. Customers experiencing payment failures should retry their transaction. Our team is working to resolve this." |
| T+5 | Leadership | Payment processing experiencing 10% failure rate for the past 20 minutes. Active investigation underway. Estimated revenue impact: [calculate based on transaction volume]. |
| T+15 | All stakeholders | Update with findings -- whether vendor-side or internal. |
| Resolution | Customers (if public-facing) | Brief statement acknowledging the issue and confirming resolution. Affected customers should be proactively contacted if transactions were lost. |

---

### Post-Incident Follow-Up

1. **Blameless postmortem** within 48 hours. Include revenue impact calculation.
2. **Action items:**
   - Implement a secondary/backup payment processor for failover.
   - Add connection-level monitoring (not just HTTP-level) for the payment gateway.
   - Implement circuit breaker pattern: if failure rate exceeds threshold, queue transactions for retry or route to backup.
   - Review retry logic -- ensure idempotency keys prevent duplicate charges.
   - Establish a direct escalation path with the payment gateway vendor for faster incident communication.
   - Add alerting on connection refused errors with a threshold lower than 10% so the team is notified earlier.
3. **Customer remediation.** Identify all affected transactions. Ensure none resulted in charges without order fulfillment. Proactively reach out to affected customers.

---
---

## Task 3

### Database Disk Space Critical

**Incident ID:** INC-20260322-003
**Alert Summary:** Disk usage on primary database server hit 95%. Growth rate: ~2GB/hour. Current free space: 15GB. Database serves 3 microservices. No automated cleanup configured.

---

### Severity Assessment

**Severity: P1 -- High (escalating to P0 within ~7 hours)**

- **User Impact:** No immediate user impact yet. However, if disk fills completely, the database will become read-only or crash, causing a P0 outage for all 3 dependent microservices.
- **Business Impact:** Potential for complete service outage within approximately 7.5 hours (15GB / 2GB per hour). This is a ticking clock.
- **System Scope:** Primary database serving 3 microservices. A failure here cascades to all three services.
- **Escalation:** DBA team, SRE, and service owners of all 3 dependent microservices.

---

### Immediate Actions (First 15 Minutes)

1. **Declare P1 Incident.** This will become P0 if not addressed. The 7.5-hour window provides time, but action must start now.
2. **Identify what is consuming disk space.** Run disk analysis on the database server:
   - Check database data file sizes, WAL/binlog sizes, and temp file usage.
   - Check for large log files (database logs, system logs).
   - Look for core dumps or backup files stored locally.
3. **Quick wins to free space immediately:**
   - Purge old WAL segments / binary logs that have already been archived or replicated.
   - Remove old database log files (after confirming they are not needed for active investigation).
   - Clear temp tables or orphaned temp files.
   - If applicable, run VACUUM (PostgreSQL) or OPTIMIZE TABLE (MySQL) to reclaim dead tuple space.
4. **Reduce the growth rate.**
   - Identify which tables are growing fastest. Check for bulk insert jobs, logging tables, or audit tables.
   - If a specific job is filling disk, pause it.
   - Check for queries generating large temp files on disk.
5. **Prepare emergency disk expansion.** If on cloud infrastructure, prepare to expand the EBS/persistent disk volume. This can often be done online without downtime.

---

### Investigation Steps

1. **Identify the growth driver.**
   - Query table sizes and sort by size. Identify the largest tables and their recent growth.
   - Check for tables without retention policies (audit logs, event logs, session data, job queues).
   - Review WAL/binlog retention settings -- are old segments being retained indefinitely?
2. **Check for anomalous growth.**
   - Has the 2GB/hour rate been consistent, or is it a recent spike?
   - Correlate with application changes, traffic increases, or batch jobs.
   - Look for data duplication bugs (e.g., a retry loop inserting duplicate rows).
3. **Review backup and maintenance schedules.**
   - Are backups being stored on the same volume?
   - Is there a maintenance window for cleanup that has been skipped?
4. **Assess replication status.**
   - If this is a replicated setup, check if WAL/binlog retention is inflated due to a lagging replica.

---

### Root Cause Analysis Approach

Most likely causes:

1. **Missing data retention / cleanup policy** -- Tables grow unbounded because no automated purge process exists (confirmed: "No automated cleanup configured").
2. **WAL/binlog accumulation** -- Transaction logs retained beyond necessity due to misconfigured retention or a stalled replica.
3. **Anomalous data growth** -- A recent change in traffic pattern, batch job, or application bug causing accelerated data insertion.
4. **Temp file accumulation** -- Long-running queries generating large temporary files on disk.

The absence of automated cleanup is the systemic root cause. The immediate trigger may be any of the above.

---

### Communication Plan

| Time | Audience | Message |
|------|----------|---------|
| T+0 | DBA + SRE + service owners | P1 declared. Primary database at 95% disk. Estimated 7.5 hours until full. Immediate action required. |
| T+15 | Leadership | Database disk approaching capacity. No current user impact. Team is actively freeing space and implementing retention. Risk of P0 outage if not resolved within 7 hours. |
| T+30 | All stakeholders | Update: space reclaimed so far, growth rate status, long-term fix timeline. |
| Every hour | All stakeholders | Status updates until disk usage is below 80% and growth rate is managed. |

---

### Post-Incident Follow-Up

1. **Implement automated data retention policies** for all tables. Define TTL for logs, audit records, session data, and temporary data.
2. **Configure disk usage alerting** at 70%, 80%, and 90% thresholds with escalating severity.
3. **Enable auto-scaling storage** if the cloud provider supports it (e.g., AWS RDS storage autoscaling).
4. **Schedule regular maintenance windows** for VACUUM/OPTIMIZE operations.
5. **Capacity planning review.** Project storage needs for the next 6-12 months based on current growth trends. Right-size the volume proactively.
6. **Runbook creation.** Document the emergency disk space recovery procedure so any on-call engineer can execute it.
7. **Audit all 3 dependent microservices** for data hygiene -- ensure they are not writing unbounded data to the database.

---
---

## Task 4

### Potential Data Breach -- Exposed API Key with PII Access

**Incident ID:** INC-20260322-004
**Alert Summary:** An internal employee's API key was found posted on a public GitHub repo. The key has read/write access to production S3 buckets containing user PII. Exposure duration unknown.

---

### Severity Assessment

**Severity: P0 -- Critical (Security Incident)**

- **User Impact:** Potentially all users whose PII is stored in the affected S3 buckets. Scope unknown until investigation completes.
- **Business Impact:** Severe. Potential regulatory violations (GDPR, CCPA, HIPAA depending on data types). Legal liability. Reputational damage. Mandatory breach notification may be required.
- **System Scope:** Production S3 buckets containing user PII. The blast radius depends on what the key can access and whether it was used by unauthorized parties.
- **Escalation:** IMMEDIATE escalation to Security team lead, CISO, Legal, Privacy/Compliance, and executive leadership. This is not optional.

---

### Immediate Actions (First 5 Minutes -- These Are Non-Negotiable)

1. **REVOKE THE API KEY IMMEDIATELY.** This is the single highest priority action. Do not investigate first. Do not wait for approvals. Revoke the key NOW through IAM console or CLI. Every second the key remains active is additional exposure.
2. **Remove the key from the public GitHub repository.** Contact the repo owner or submit a takedown. Note: even after removal from the repo, the key is in Git history and likely cached by scrapers. Revocation (step 1) is the real mitigation.
3. **Issue a replacement key** to the employee for their legitimate workflow, with the minimum required permissions (principle of least privilege review).
4. **Declare a security incident.** Open a restricted-access incident channel. Limit participation to security team, legal, and essential responders. Do not discuss details in public channels.
5. **Preserve evidence.** Before making any changes to S3 bucket policies or CloudTrail settings, ensure all logs are preserved and immutable.

---

### Investigation Steps

1. **Determine exposure window.**
   - When was the key committed to the public repo? Check Git history for the commit date.
   - When was the repo made public? (It may have been private initially.)
   - Cross-reference with GitHub's secret scanning alerts -- did GitHub flag this, and when?
2. **Audit S3 access logs and CloudTrail.**
   - Pull all API calls made with this key for the entire exposure window.
   - Filter for: ListBucket, GetObject, PutObject, DeleteObject operations on the PII buckets.
   - Identify any access from IP addresses outside your corporate network or VPN.
   - Look for bulk download patterns (large ListBucket followed by many GetObject calls).
3. **Determine the scope of accessible data.**
   - What S3 buckets does the key have access to? List all IAM policies attached to the key.
   - What PII is stored in those buckets? (Names, emails, SSNs, payment data, health records?)
   - How many users' data is potentially exposed?
4. **Check for lateral movement.**
   - Did the key have access to any other AWS services beyond S3?
   - Were there any IAM actions (creating new keys, modifying policies) performed with this key?
   - Check for any new or unusual resources created in the account.
5. **Investigate the employee.**
   - Understand how the key ended up on a public repo. Was it accidental (committed in code) or a process failure?
   - Was it a personal repo or an organizational one?
   - This is NOT about blame -- it is about understanding the failure mode to prevent recurrence.

---

### Root Cause Analysis Approach

The investigation must answer three questions:

1. **Was the data actually accessed by unauthorized parties?** CloudTrail and S3 access logs are the definitive source. If there is no evidence of unauthorized access, the incident is a near-miss. If there is evidence, it is a confirmed breach.
2. **How did the key end up in a public repository?** Common causes:
   - Developer committed credentials in code (no pre-commit hook to catch secrets).
   - Key was in a configuration file that was not in .gitignore.
   - Developer used a personal repo for work code without proper secrets management.
3. **Why did the key have such broad access?** Read/write access to production PII buckets suggests over-permissioned credentials. This is a systemic issue.

---

### Communication Plan

**This incident requires legal-reviewed communications. Do not send external communications without legal approval.**

| Time | Audience | Message |
|------|----------|---------|
| T+0 | Security team + CISO | Security incident declared. API key with PII access exposed on public GitHub. Key revoked. Investigation starting. |
| T+15 | Legal + Privacy/Compliance | Briefing on potential data exposure. Need guidance on breach notification obligations. |
| T+30 | Executive leadership | Summary: key exposed, key revoked, investigation in progress, legal engaged. No confirmed unauthorized access yet (or confirmed access if found). |
| T+1h | Security team + Legal | Investigation findings: exposure window, evidence of unauthorized access (or lack thereof), scope of potentially affected data. |
| As required by law | Affected users + regulators | If unauthorized access is confirmed, breach notification per applicable regulations (GDPR: 72 hours to supervisory authority; CCPA: without unreasonable delay; other regulations as applicable). Legal drafts all external communications. |

**Internal communications must emphasize:**
- The key has been revoked.
- Investigation is ongoing.
- Do not discuss this incident outside the restricted channel.
- Do not speculate about breach scope on Slack, email, or social media.

---

### Post-Incident Follow-Up

1. **Immediate security hardening:**
   - Audit ALL API keys and service accounts for over-permissioned credentials. Enforce least-privilege.
   - Enable and enforce pre-commit hooks that scan for secrets (e.g., git-secrets, truffleHog, gitleaks).
   - Implement mandatory secret scanning on all organization GitHub repos.
   - Rotate all credentials that may have been exposed through similar patterns.
2. **Preventive controls:**
   - Migrate from long-lived API keys to short-lived, role-based credentials (IAM roles, OIDC federation).
   - Implement S3 bucket policies that restrict access by source IP/VPC endpoint.
   - Enable S3 Object Lock or versioning to prevent unauthorized deletion.
   - Deploy AWS GuardDuty or equivalent for anomalous API activity detection.
3. **Process improvements:**
   - Mandatory security training for all developers on secrets management.
   - Establish a secrets management solution (HashiCorp Vault, AWS Secrets Manager) and mandate its use.
   - Regular automated scanning of public repositories for organizational secrets.
4. **Legal and compliance:**
   - Complete breach assessment with legal team.
   - File regulatory notifications if required.
   - Document the incident for compliance records.
5. **Blameless postmortem** focused on systemic failures: why was a long-lived key with PII access created? Why were there no guardrails to prevent its exposure? What detection mechanisms failed or were absent?

---
---

## Task 5

### Cross-User Data Leakage

**Incident ID:** INC-20260322-005
**Alert Summary:** Users reporting they can see other users' data after login. Logging in as User A sometimes shows User B's dashboard. Intermittent, ~5% of logins. No recent code changes.

---

### Severity Assessment

**Severity: P0 -- Critical (Data Privacy / Security Incident)**

- **User Impact:** Users are being exposed to other users' private data. Even at 5%, this is a fundamental trust violation. Any user logging in could see another user's data, and their own data could be visible to strangers.
- **Business Impact:** Catastrophic for user trust. Potential regulatory violations (unauthorized disclosure of personal data). Legal liability. This type of bug generates media attention and permanent reputational damage.
- **System Scope:** Authentication and/or session management layer. The intermittent nature at 5% suggests a race condition or caching issue rather than a total system misconfiguration.
- **Escalation:** Immediate P0. All hands: SRE, backend engineering, security team. Legal and privacy team notified.

**Why P0 despite "only" 5%:** Cross-user data leakage is among the most severe categories of bugs. Unlike performance degradation, every occurrence is a discrete privacy violation. The 5% rate means it is happening frequently enough that many users are affected, and the actual rate may be higher than reported (not all users will notice or report seeing someone else's data).

---

### Immediate Actions (First 5 Minutes)

1. **Declare P0 Incident.** This is a data privacy emergency.
2. **Assess whether to take the service offline.** This is a serious consideration. Every login has a 5% chance of leaking private data. If the business can tolerate downtime, taking the login flow offline with a maintenance page is the safest option. If not, proceed with investigation at maximum urgency with the understanding that data leakage is ongoing.
3. **Identify the caching/session layer.** The most common causes of cross-user data leakage are:
   - **Response caching** returning cached responses for one user to another.
   - **Session ID collision or reuse** where two users share a session.
   - **Connection pool contamination** where a database or service connection retains state from a previous user's request.
4. **Check CDN and reverse proxy cache configuration.** Look for missing `Cache-Control: private` or `Vary: Cookie` headers on authenticated endpoints. Check if a CDN (CloudFront, Cloudflare, Akamai) is caching personalized responses.
5. **Check recent infrastructure changes.** Even though there are no code changes, look for:
   - CDN or load balancer configuration changes.
   - Cache layer (Redis, Memcached, Varnish) updates or restarts.
   - Infrastructure-as-code deployments that may have changed proxy settings.

---

### Investigation Steps

1. **Reproduce and capture.** Work with QA or the reporting users to reproduce the issue. Capture:
   - The session IDs / tokens of both the logged-in user and the user whose data is displayed.
   - The HTTP response headers (especially caching headers) of the affected responses.
   - Load balancer access logs for the affected requests.
2. **Examine session management.**
   - Is the session store (Redis, database, in-memory) functioning correctly?
   - Are session IDs being generated with sufficient entropy? Check for collisions.
   - Is session data being correctly isolated by session ID, or is there a key collision in the store?
   - Check for a session fixation vulnerability.
3. **Examine caching layers.**
   - **Application-level cache:** Is there a user-specific cache that uses an incorrect key (e.g., caching by URL without including user ID)?
   - **Reverse proxy / CDN:** Are authenticated responses being cached without the session cookie in the cache key?
   - **Database connection pool:** Are connections being reused without resetting session-level state (e.g., PostgreSQL `SET ROLE` or MySQL `CHANGE USER`)?
4. **Analyze the 5% pattern.**
   - Does it correlate with specific application server instances?
   - Does it correlate with high concurrency (e.g., many logins within the same second)?
   - Does it correlate with specific user attributes (same geographic region, same account type)?
   - The 5% rate may correspond to a specific server, a specific cache node, or a race condition window.
5. **Check thread safety.** If user context is stored in a thread-local or request-scoped variable, a concurrency bug could cause one request to read another request's user context. This is especially common in:
   - Global/static variables holding user state.
   - Middleware that sets user context without proper request isolation.
   - Async frameworks where context can leak between coroutines.

---

### Root Cause Analysis Approach

Most likely causes, ordered by probability given the symptoms (intermittent, 5%, no code changes):

1. **CDN or reverse proxy caching authenticated responses.** A configuration change (even an infrastructure-as-code deployment not considered a "code change") enabled caching of personalized pages. The 5% rate corresponds to the cache hit rate.
2. **In-memory session store corruption.** If sessions are stored in-memory on application servers, a memory pressure event or bug could cause session data to bleed between users.
3. **Race condition in session assignment.** Under concurrent load, a race condition in session creation or lookup causes two users to receive the same session ID.
4. **Connection pool state leakage.** A database or service connection retains user context from a previous request, and the next request on that connection inherits it.
5. **Shared cache key collision.** User-specific cache entries use a key that is not sufficiently unique (e.g., hashing collision, truncated key).

The investigation should test each hypothesis methodically. The CDN/proxy hypothesis is the easiest to test (check response headers) and should be examined first.

---

### Communication Plan

| Time | Audience | Message |
|------|----------|---------|
| T+0 | Engineering + Security | P0 declared. Cross-user data leakage confirmed. ~5% of logins affected. All hands. |
| T+5 | Legal + Privacy | Data privacy incident. Users are being shown other users' data. Investigating scope. |
| T+10 | Leadership | Briefing: nature of the issue, current impact, whether service is being taken offline, investigation status. |
| T+15 | Customer support | "We are aware of an issue affecting some user accounts. Our engineering team is working urgently to resolve it. If a customer reports seeing incorrect data, escalate immediately to [incident channel]." |
| T+30 | All stakeholders | Investigation update. Root cause identified or narrowed. Remediation timeline. |
| Resolution | All affected users | Proactive notification to users whose data was exposed to others. Legal to review notification language. |

**Critical communication rules for this incident:**
- Do NOT publicly describe the bug as "seeing other users' data" until legal approves messaging.
- Use "account display issue" or similar neutral language in customer-facing communications until the full scope is understood.
- Document every known instance of cross-user data exposure for the privacy team.

---

### Post-Incident Follow-Up

1. **Immediate fixes:**
   - Deploy the fix for the root cause with thorough testing.
   - Invalidate all active sessions. Force all users to re-authenticate. This ensures no contaminated sessions remain.
   - Purge all caches that may contain user-specific data served to wrong users.
2. **Impact assessment:**
   - Determine exactly which users were affected (both users who saw others' data and users whose data was exposed).
   - Analyze access logs to map every instance of cross-user data leakage.
   - Assess what types of data were exposed (PII, financial data, health data, etc.).
3. **User notification:**
   - Per regulatory requirements, notify affected users that their data may have been viewed by another user.
   - Legal and privacy teams to determine notification obligations.
4. **Preventive measures:**
   - Add automated tests that verify response isolation (log in as User A, check response contains only User A's data, never User B's).
   - Implement response integrity checks: hash user ID into response headers and validate on the client side.
   - Add `Cache-Control: private, no-store` headers to ALL authenticated endpoints as a defense-in-depth measure.
   - Implement canary monitoring that continuously verifies session isolation in production.
   - Review all caching configurations across CDN, reverse proxy, and application layers.
5. **Blameless postmortem** with emphasis on:
   - Why this was not caught by existing tests or monitoring.
   - What detection mechanisms should be added so cross-user data leakage is caught within seconds, not through user reports.
   - How infrastructure changes are reviewed for security impact, even when they are not "code changes."
