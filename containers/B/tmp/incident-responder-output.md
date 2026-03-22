# Incident Response Report

Date: 2026-03-22

---

## Task 1: API Response Time Spike and Error Rate Surge

### Incident Declaration

**Incident ID:** INC-20260322-001
**Severity:** P0 -- Critical
**Status:** Active
**Time Detected:** T-3 minutes
**Incident Commander:** On-call IC

### Severity Assessment

- **User Impact:** 2000 active users affected. Response times degraded 75x (200ms to 15s). Error rate jumped from 0.1% to 45%, meaning nearly half of all requests are failing. This is a full service degradation.
- **Business Impact:** Severe. Users are unable to use the product effectively. Revenue loss is occurring in real time. Reputation damage is likely if not resolved within minutes.
- **System Scope:** All endpoints affected simultaneously, which points to a shared infrastructure component rather than an application-level issue in a single service.
- **Severity Justification:** P0. This is a near-complete service outage affecting all users and all endpoints. Immediate all-hands response required.

### Immediate Actions (First 5 Minutes)

1. **Declare the incident.** Open a dedicated Slack channel (#inc-api-degradation-0322), start a war room video call, and page the on-call engineers for API, infrastructure, and database teams.
2. **Assign roles.** Designate an Operations Lead (senior backend engineer) and a Communications Lead to handle stakeholder updates.
3. **Send initial stakeholder notification:** "We are aware of elevated API response times and error rates affecting all users. The incident has been declared P0. Investigation is underway. Next update in 15 minutes."

### Investigation Steps

Since all endpoints are affected and there are no recent deployments, focus on shared infrastructure dependencies:

1. **Check database health.** Query connection pool utilization, active queries, lock contention, and replication lag. A saturated or locked database is the most common cause of uniform API degradation across all endpoints.
2. **Check external dependency health.** Review status of any shared caches (Redis, Memcached), message queues, service mesh, or API gateways. A degraded shared proxy or load balancer can cause this pattern.
3. **Review infrastructure metrics.** CPU, memory, network I/O, and disk I/O on API servers, database servers, and any middleware. Look for saturation on any resource.
4. **Examine recent configuration changes.** Even without code deployments, check for infrastructure changes: DNS updates, certificate rotations, firewall rule modifications, cloud provider configuration changes, auto-scaling events.
5. **Check for upstream provider issues.** Review cloud provider status pages (AWS, GCP, Azure) for region-level incidents.
6. **Correlate the timeline.** Identify what changed exactly 3 minutes ago. Check cron jobs, scheduled tasks, batch processes, or any automated job that may have started at that time and is consuming shared resources.

### Root Cause Analysis Approach

The pattern (all endpoints, sudden onset, no deployment) strongly suggests one of:
- **Database saturation:** A long-running query, table lock, or connection pool exhaustion.
- **Shared infrastructure failure:** A degraded load balancer, service mesh sidecar, or DNS resolver.
- **Resource exhaustion:** A runaway process, memory leak reaching a tipping point, or disk I/O saturation.
- **External dependency:** A downstream service or cloud provider component experiencing issues.

Narrow down by checking the 15-second response times: are they all timing out at exactly 15s (suggesting a connection timeout to a dependency), or is the latency variable (suggesting resource contention)?

### Mitigation Plan

1. **If database is the cause:** Kill long-running queries, increase connection pool limits, or failover to a read replica if available.
2. **If a runaway process or batch job:** Identify and kill the process immediately.
3. **If infrastructure saturation:** Scale horizontally (add API server instances) or vertically (increase resources) as an immediate band-aid.
4. **If external dependency:** Activate circuit breakers, enable cached/degraded responses, or failover to a secondary region.
5. **If load balancer or proxy:** Restart the proxy, or reroute traffic through an alternate path.

### Communication Cadence

- Updates every 15 minutes to stakeholders during P0.
- Customer-facing status page updated to acknowledge degraded performance.
- Engineering leadership notified immediately.

### Follow-Up Actions

1. Schedule a blameless postmortem within 48 hours.
2. Implement alerting on the root cause indicator (e.g., database connection pool utilization, batch job duration) so the team is warned before user impact begins.
3. Review and harden timeout and circuit breaker configurations across all API endpoints.
4. Evaluate whether automated scaling or failover could have prevented user impact.
5. Add runbook for this failure mode.

---

## Task 2: Payment Processing Failures

### Incident Declaration

**Incident ID:** INC-20260322-002
**Severity:** P1 -- High
**Status:** Active (20 minutes elapsed)
**Incident Commander:** On-call IC

### Severity Assessment

- **User Impact:** Approximately 10% of transactions failing. Users attempting to pay are receiving errors. Customer complaints are already arriving.
- **Business Impact:** Direct revenue loss. Every failed transaction is lost or delayed revenue. Customer trust in payment reliability is at risk. Depending on volume, this could represent significant financial impact.
- **System Scope:** Payment gateway connectivity. The "Connection refused" error indicates the payment gateway is either down, rejecting connections, or unreachable from our network.
- **Severity Justification:** P1. Major functionality (payments) is severely impaired. Not P0 because 90% of transactions are still succeeding, suggesting partial rather than total failure.

### Immediate Actions (First 5 Minutes)

1. **Declare the incident.** Open #inc-payment-failure-0322, page payment team and infrastructure on-call.
2. **Assign roles.** Operations Lead from the payments team. Communications Lead to handle customer support coordination.
3. **Send initial stakeholder notification:** "We are investigating payment processing failures affecting approximately 10% of transactions. Customer support should inform affected users that their payments can be retried shortly. Next update in 15 minutes."
4. **Check payment gateway status page immediately.** If the provider has a known outage, this changes the response strategy entirely.

### Investigation Steps

1. **Check the payment gateway provider's status page and support channels.** This is the single most important first step. A "Connection refused" error from their side may indicate their outage, not ours.
2. **Analyze the 10% failure pattern.** Why only 10%? Investigate whether failures correlate with:
   - Specific payment gateway endpoints or regions.
   - Specific API server instances (one server may have a network issue).
   - Specific payment methods, currencies, or transaction types.
   - Time patterns (intermittent connectivity vs. sustained failure from specific sources).
3. **Check network connectivity to the payment gateway.** From each API server, test connectivity: DNS resolution, TCP connection to the gateway's IP and port, TLS handshake. Look for packet loss or routing issues.
4. **Review firewall and security group rules.** Even without a deployment, an automated security rule update, IP allowlist change, or certificate expiration could cause "Connection refused."
5. **Check TLS certificate validity.** An expired client certificate or CA certificate can cause connection failures.
6. **Review connection pool and rate limiting.** Are we hitting the gateway's rate limits? Is our connection pool to the gateway exhausted on some instances?
7. **Check the last deployment (2 days ago).** Although it was 2 days ago, a delayed effect is possible (e.g., a connection pool leak that slowly exhausted, or a retry configuration that only triggers under specific conditions).

### Root Cause Analysis Approach

"Connection refused" at 10% points to:
- **Partial gateway outage:** The provider has some servers or endpoints down.
- **Network-level issue:** Some of our servers cannot reach the gateway (routing, DNS, or firewall).
- **Connection pool exhaustion on specific instances:** Some API servers have exhausted their connection pool to the gateway.
- **Rate limiting:** We are being throttled by the gateway on some requests.
- **IP-based blocking:** Our IP range partially blocked at the gateway.

### Mitigation Plan

1. **If gateway provider outage:** Activate secondary payment provider if available. If not, implement retry with exponential backoff and queue failed transactions for later processing. Communicate expected resolution timeline from the provider.
2. **If network issue on specific servers:** Remove affected servers from the load balancer rotation immediately. Investigate and fix the network issue separately.
3. **If connection pool exhaustion:** Increase pool size. Restart affected instances to reset connections.
4. **If rate limiting:** Reduce request concurrency, implement request queuing, or contact the gateway provider to increase limits.
5. **Immediate customer mitigation:** Enable retry logic on the client side. Queue failed payments for automatic retry once connectivity is restored.

### Communication Cadence

- Customer support briefed with scripted response for affected users.
- Updates every 15 minutes to stakeholders.
- If gateway provider issue, share their status page link with stakeholders.

### Follow-Up Actions

1. Blameless postmortem within 48 hours.
2. Implement a secondary/failover payment gateway if one does not exist.
3. Add monitoring for payment gateway connectivity health (not just transaction success rates).
4. Implement automatic retry and dead-letter queue for failed payment transactions.
5. Review and document the payment gateway SLA and establish an escalation path with the provider.
6. Add alerting that triggers earlier -- 20 minutes before customer complaints arrive is too late.

---

## Task 3: Database Disk Usage at 95%

### Incident Declaration

**Incident ID:** INC-20260322-003
**Severity:** P1 -- High
**Status:** Active
**Incident Commander:** On-call IC

### Severity Assessment

- **User Impact:** No direct user impact yet, but imminent. At 2GB/hour growth with 15GB free, the database will be completely full in approximately 7.5 hours. When the disk fills, the database will stop accepting writes, causing a cascading failure across all 3 dependent microservices.
- **Business Impact:** If the disk fills, this becomes a P0 with full service outage for 3 microservices. Proactive action now prevents a much worse incident.
- **System Scope:** Primary database server. All 3 microservices that depend on it are at risk.
- **Severity Justification:** P1. No current user impact, but the projected time-to-outage is under 8 hours and the blast radius is 3 services. This requires immediate response, not business-hours handling.

### Immediate Actions (First 5 Minutes)

1. **Declare the incident.** Open #inc-db-disk-0322, page database on-call and the leads of all 3 dependent microservices.
2. **Confirm the growth rate.** Verify the 2GB/hour figure is accurate and whether it is accelerating, steady, or decelerating.
3. **Identify what is consuming disk space.** Run filesystem analysis immediately:
   - Check data directory size.
   - Check WAL/binlog size.
   - Check temp files and sort files.
   - Check log file sizes.
4. **Send stakeholder notification:** "Database disk usage has reached 95% on the primary server. No current user impact. We are investigating and taking action to prevent service disruption. ETA for mitigation: within 2 hours. Next update in 30 minutes."

### Investigation Steps

1. **Identify the source of disk growth.** The 2GB/hour rate is abnormal if it is new. Determine:
   - Is it data growth (table sizes increasing)?
   - Is it WAL/transaction log growth (long-running transactions preventing log cleanup)?
   - Is it temporary files (large queries creating temp tables on disk)?
   - Is it binary logs or replication logs not being purged?
   - Is it application logs written to the database disk?
2. **Check for long-running transactions.** A stuck transaction can prevent WAL/binlog cleanup, causing rapid disk growth.
3. **Check for bulk data operations.** Is one of the 3 microservices running a bulk import, migration, or batch job?
4. **Review table sizes.** Identify the largest and fastest-growing tables.
5. **Check if automated cleanup (vacuum, log rotation, binlog purge) was ever configured.** The alert states none is configured, which is itself a systemic issue.

### Root Cause Analysis Approach

The 2GB/hour growth rate combined with no automated cleanup suggests one of:
- **Normal data accumulation that was never managed.** Logs, audit trails, or event tables growing unchecked over time, now reaching critical mass.
- **A new behavior causing accelerated growth.** A bug in one of the microservices writing excessive data, a logging level change, or a retry loop creating duplicate records.
- **WAL/binlog bloat.** Long-running or stuck transactions, replication lag, or misconfigured log retention.

### Mitigation Plan

**Phase 1: Buy time (immediate, within 30 minutes):**
1. Purge binary logs / WAL segments that are no longer needed for replication.
2. Clean up temp files and old query artifacts.
3. Truncate or rotate application logs if they reside on the database disk.
4. If the database supports it, compress or archive old data from the largest tables to a secondary location.

**Phase 2: Stabilize (within 2 hours):**
1. Identify and address the root cause of the 2GB/hour growth.
2. If a stuck transaction, kill it.
3. If a runaway microservice, throttle or fix it.
4. If normal data accumulation, implement an immediate data retention policy: archive or delete data older than the retention threshold.

**Phase 3: Permanent fix (within 1 week):**
1. Add disk space (expand volume or migrate to a larger disk).
2. Implement automated cleanup: scheduled jobs for log rotation, data archival, binlog purging, and vacuum/analyze.
3. Add monitoring and alerting at 70%, 80%, and 90% disk usage thresholds.

### Communication Cadence

- Updates every 30 minutes (P1 cadence).
- All 3 microservice teams informed of the risk and the mitigation timeline.

### Follow-Up Actions

1. Blameless postmortem focused on why automated cleanup was never configured.
2. Implement data retention policies for all tables.
3. Set up automated disk usage monitoring with tiered alerts (warning at 70%, critical at 85%, emergency at 95%).
4. Establish capacity planning reviews on a quarterly cadence for all database servers.
5. Document a runbook for disk space emergencies.
6. Evaluate whether the database should be provisioned with more headroom.

---

## Task 4: Potential Data Breach -- Exposed API Key with PII Access

### Incident Declaration

**Incident ID:** INC-20260322-004
**Severity:** P0 -- Critical (Security Incident)
**Status:** Active
**Incident Commander:** On-call IC, with Security team co-leading

### Severity Assessment

- **User Impact:** Potentially all users whose PII is stored in the affected S3 buckets. Until the scope of access is determined, assume worst-case: all PII may have been accessed by unauthorized parties.
- **Business Impact:** Critical. Potential regulatory violations (GDPR, CCPA, HIPAA depending on data types). Legal liability. Mandatory breach notification may be required. Severe reputational damage.
- **System Scope:** Production S3 buckets containing user PII. The exposed key has read/write access, meaning data could have been exfiltrated (read) or tampered with (write).
- **Severity Justification:** P0 Security Incident. An exposed credential with read/write access to PII is the highest severity security event. Immediate containment is required.

### Immediate Actions (First 5 Minutes)

1. **Revoke the API key immediately.** This is the single most urgent action. Do it within 60 seconds of learning about this incident. Deactivate/delete the key through IAM. Do not wait for investigation.
2. **Declare a security incident.** Open a restricted-access channel (#sec-inc-apikey-0322) with only security team, IC, engineering leadership, and legal. This incident requires information control.
3. **Page security team, infrastructure on-call, and legal/compliance.** This is not a normal engineering incident.
4. **Verify the key is revoked.** Confirm the key no longer grants access by testing it.
5. **Preserve evidence.** Before any remediation, ensure CloudTrail (or equivalent) logs are preserved and cannot be tampered with. Copy logs to a secure, separate location.

### Investigation Steps

1. **Determine exposure duration.** When was the key posted to GitHub? Check the commit history of the public repository for the exact timestamp. Check GitHub's API or the repository's commit log.
2. **Audit all access using the exposed key.** Pull CloudTrail or S3 access logs for the entire period the key was exposed. Look for:
   - Any access from IP addresses outside your organization.
   - Any S3 GetObject (read) operations on PII buckets.
   - Any S3 PutObject, DeleteObject, or ListBucket operations.
   - Any unusual access patterns (bulk downloads, access at unusual hours, access from unusual geographic locations).
3. **Determine if data was exfiltrated.** Quantify what was accessed. Which buckets, which objects, how much data.
4. **Determine if data was tampered with.** If the key has write access, check for unauthorized modifications or deletions. Compare current data against backups.
5. **Identify the employee.** Understand how the key ended up on a public repository. Was it accidental (committed in code)? Was it a personal repository? Approach this in a blameless manner -- the goal is to understand the process failure, not to punish.
6. **Scan for other exposed secrets.** Use tools (e.g., truffleHog, git-secrets, GitHub secret scanning) to check whether other credentials are exposed in the same or other repositories.

### Root Cause Analysis Approach

The root cause is not the employee's mistake. The root causes are systemic:
- **Why did a human-usable API key have read/write access to production PII?** Principle of least privilege was not enforced.
- **Why was there no secret scanning in place?** GitHub offers secret scanning for free on public repositories. Many third-party tools exist.
- **Why was there no alert when the key was used from an unusual location?** Access anomaly detection was absent.
- **Why could a single key access all PII buckets?** Access was overly broad.

### Mitigation Plan

**Phase 1: Contain (immediate, minutes):**
1. Revoke the key (already done in immediate actions).
2. Request GitHub remove the repository or the commit containing the key (use GitHub's secret removal process).
3. Issue a new key with minimum required permissions for the employee's legitimate needs.
4. If evidence of unauthorized access is found, consider rotating all credentials and keys that could have been accessible from the same environment.

**Phase 2: Assess (within 24 hours):**
1. Complete the access log audit.
2. Determine if breach notification is required under applicable regulations.
3. Engage legal counsel for breach notification obligations.
4. If data was exfiltrated, engage incident response forensics.

**Phase 3: Remediate (within 1 week):**
1. Implement automated secret scanning on all repositories (GitHub secret scanning, pre-commit hooks, CI/CD pipeline checks).
2. Rotate all long-lived API keys and migrate to short-lived credentials (IAM roles, temporary security tokens) wherever possible.
3. Apply least-privilege access policies to all S3 buckets containing PII.
4. Enable S3 access logging and anomaly detection on all PII buckets.
5. Implement bucket policies that deny access from outside expected IP ranges/VPCs.

### Communication Cadence

- Security team and legal updated every 30 minutes during active investigation.
- Engineering leadership briefed within 1 hour.
- External breach notification per legal counsel's guidance and regulatory requirements.
- Do NOT communicate externally until legal has assessed notification obligations.

### Follow-Up Actions

1. Security-focused postmortem within 72 hours.
2. Mandatory secret management training for all engineers.
3. Implement and enforce a secrets management solution (e.g., HashiCorp Vault, AWS Secrets Manager) across all teams.
4. Establish a policy: no long-lived credentials for production access. All production access must use short-lived, role-based credentials.
5. Deploy pre-commit hooks across all repositories to prevent secrets from being committed.
6. Conduct a broader audit of all API keys and service accounts for over-permissioned access.
7. Implement anomaly detection on all production access patterns.

---

## Task 5: Cross-User Data Leakage

### Incident Declaration

**Incident ID:** INC-20260322-005
**Severity:** P0 -- Critical (Security/Privacy Incident)
**Status:** Active
**Incident Commander:** On-call IC, with Security team involvement

### Severity Assessment

- **User Impact:** Any user logging in has a ~5% chance of seeing another user's private data. This is a severe privacy violation. Even though it is intermittent, the impact when it occurs is maximum -- users are exposed to other users' personal information.
- **Business Impact:** Critical. This is a data privacy violation that could trigger regulatory action (GDPR, CCPA). Users who discover this will lose trust immediately. This will generate press coverage if it becomes public.
- **System Scope:** Authentication and session management system. The fact that User A sees User B's dashboard indicates that session identifiers, cache keys, or authentication tokens are being incorrectly shared or swapped.
- **Severity Justification:** P0. Cross-user data exposure is one of the most severe categories of bugs. Even at 5% occurrence, this represents an active, ongoing privacy breach for every login. No recent code changes makes this harder to diagnose but does not reduce severity.

### Immediate Actions (First 5 Minutes)

1. **Declare a P0 security/privacy incident.** Open #inc-data-leak-0322, page authentication team, backend on-call, and security on-call.
2. **Evaluate whether to disable logins.** This is a difficult decision. If the data exposure cannot be mitigated quickly, the safest action is to put the application in maintenance mode to stop the bleeding. Weigh the business cost of downtime against the ongoing privacy violation. Recommendation: if a fix is not identified within 30 minutes, enable maintenance mode.
3. **Send stakeholder notification:** "We are investigating a critical issue affecting user sessions. The security team is engaged. Details will follow in a restricted channel. Next update in 15 minutes."
4. **Do not communicate the nature of the bug externally yet.** Coordinate with legal on disclosure obligations.

### Investigation Steps

1. **Reproduce and characterize the bug.** Understand the exact conditions:
   - Does it happen on specific servers/instances? (Load balancer sticky sessions pointing to a misconfigured instance.)
   - Does it correlate with concurrent logins? (Race condition in session creation.)
   - Does it happen more at high traffic times? (Concurrency-related.)
   - Is User B's session always a specific user, or random? (Cache key collision vs. session fixation.)
2. **Inspect the session management layer.** This is the most likely source:
   - **Session cache (Redis/Memcached):** Check for key collisions. If session IDs are being reused or overwritten, a shared cache with insufficient key uniqueness could cause this.
   - **Session serialization:** Check if sessions are being stored and retrieved correctly. A race condition during serialization could swap sessions.
   - **Connection pooling to session store:** A misconfigured connection pool that shares connections across requests without proper isolation could leak session data between users.
3. **Check the CDN/reverse proxy layer.** Misconfigured caching at the CDN or reverse proxy level (e.g., Nginx, Varnish, CloudFront) could cache authenticated responses and serve them to the wrong user. Check Cache-Control headers and caching rules for authenticated endpoints.
4. **Check for recent infrastructure changes.** Even without code changes, the following could cause this:
   - Cache server replacement or restart (new instance with different configuration).
   - Load balancer configuration change.
   - CDN configuration update.
   - Infrastructure-as-code deployment that changed a proxy or cache setting.
5. **Examine server-side session ID generation.** If the session ID generator has insufficient entropy or a seed collision (e.g., after a server restart with predictable seeding), session IDs could collide.

### Root Cause Analysis Approach

The intermittent nature at ~5% and no code changes points strongly to:
- **Response caching of authenticated pages.** A CDN, reverse proxy, or application-level cache is caching a response that includes user-specific data and serving it to subsequent users. This is the most common cause of "seeing another user's data" bugs. Check if a caching layer was recently modified or if cache headers are misconfigured.
- **Shared session store race condition.** Under concurrent load, a race condition in session creation or retrieval is causing session swaps.
- **Connection pool contamination.** A connection pool to the session store or database is leaking state between requests (e.g., a Redis connection that still has a previous user's context selected).

### Mitigation Plan

**Phase 1: Stop the bleeding (immediate):**
1. If a caching layer is identified as the cause, disable caching for all authenticated endpoints immediately. Purge the cache.
2. If the cause is not found within 30 minutes, enable maintenance mode to prevent further data exposure.
3. If a specific server instance is responsible, remove it from rotation immediately.

**Phase 2: Fix (within hours):**
1. **If caching issue:** Add `Cache-Control: no-store, private` and `Vary: Cookie` headers to all authenticated responses. Purge CDN/proxy cache completely. Verify the fix.
2. **If session store race condition:** Add proper locking or use atomic operations for session creation. Verify session ID uniqueness.
3. **If connection pool issue:** Configure the pool to properly reset connection state between uses, or reduce pool sharing.

**Phase 3: Verify and restore:**
1. Deploy the fix to a canary environment and test extensively.
2. Roll out to production with close monitoring.
3. Monitor login events for any recurrence of session cross-contamination.

### Communication Cadence

- Internal updates every 15 minutes during P0.
- Security and legal teams briefed on the privacy implications.
- Customer communication per legal guidance. If users were demonstrably exposed to other users' data, individual notification may be required.

### Follow-Up Actions

1. Security-focused postmortem within 48 hours.
2. Conduct a thorough audit of all caching layers for authenticated content. Establish a policy: authenticated responses must never be cached in shared caches without explicit, verified cache key differentiation.
3. Implement automated testing that verifies session isolation (e.g., concurrent login tests that assert no data leakage).
4. Add monitoring for session anomalies: alert when a session ID is associated with multiple user IDs, or when a user ID appears in multiple concurrent sessions unexpectedly.
5. Review all CDN and proxy caching rules. Ensure no authenticated endpoint is served from a shared cache.
6. If any users were confirmed to have had their data exposed to others, follow the breach notification process per regulatory requirements.
7. Implement request-level logging that associates each response with the authenticated user, enabling forensic analysis of which users may have been affected.
