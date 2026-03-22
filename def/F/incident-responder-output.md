## Task 1 -- API Response Time Spike and Error Rate Surge

**Severity: P0 -- Critical**
**Impact: 2000 active users, 45% error rate, near-total service degradation**

### Immediate Actions (First 5 Minutes)

1. **Declare Incident** -- Open a dedicated incident channel, page all on-call engineers (backend, infrastructure, database).
2. **Confirm scope** -- Verify that ALL endpoints are affected (not a subset), confirming infrastructure-level issue.
3. **Check dependencies** -- Immediately query health of downstream dependencies: database, cache (Redis/Memcached), message queues, DNS, load balancers.

### Investigation Steps

1. **What changed?** No recent deployments, so focus on:
   - Infrastructure events: cloud provider incidents (check status pages).
   - Network changes: security group modifications, DNS TTL changes, certificate expirations.
   - Traffic anomalies: sudden traffic spike or DDoS (check request rates, source IP distribution).
2. **Collect telemetry:**
   - Database query latency and connection pool saturation (most likely culprit for "all endpoints").
   - CPU, memory, and network I/O on application servers.
   - Connection counts to upstream services.
   - Garbage collection pauses if running JVM/.NET.
3. **Analyze patterns:**
   - Do errors correlate with a specific backend host or availability zone?
   - Are responses timing out or returning 5xx immediately?

### Mitigation

| Priority | Action |
|----------|--------|
| 1 | Database connection pool exhaustion: rolling restart of application pods. |
| 2 | DDoS/traffic spike: enable rate limiting or activate WAF rules; scale horizontally. |
| 3 | Downstream dependency down: enable circuit breakers, serve degraded/cached responses. |
| 4 | Single AZ/host failure: drain traffic from unhealthy zone. |

### Follow-Up

- Blameless postmortem within 48 hours.
- Add alerting on database connection pool usage at 80%.
- Implement automated circuit breakers.
- Ensure auto-scaling policies cover sudden degradation.

---

## Task 2 -- Payment Processing Failures

**Severity: P1 -- High**
**Impact: ~10% of transactions failing, direct revenue loss, customer trust at risk**

### Immediate Actions (First 5 Minutes)

1. **Declare Incident** -- Page payments team and vendor/integration lead.
2. **Quantify impact** -- Exact failure count and estimated revenue loss over 20 minutes.
3. **Check payment gateway status page** for known outages.
4. **Contact payment gateway vendor** -- Open support ticket immediately.

### Investigation Steps

1. **Isolate failure pattern:**
   - All transaction types or a subset?
   - Region-specific or global?
   - Specific gateway endpoint or IP?
2. **Network-level checks:**
   - Connectivity to gateway (telnet/curl to endpoint).
   - DNS resolution failures, expired TLS certificates, firewall changes.
   - Security group or network ACL modifications in last 24 hours.
3. **Application-level checks:**
   - Review payment service logs for exact "Connection refused" stack traces.
   - Check connection pool to gateway for exhaustion.
   - Verify API credentials have not expired.
4. **Deployment check** -- Low probability since last deploy was 2 days ago, but verify no delayed config propagation.

### Mitigation

| Priority | Action |
|----------|--------|
| 1 | Activate secondary/failover payment processor if available. |
| 2 | Network/firewall issue on our side: revert immediately. |
| 3 | No failover: implement retry queue for automatic retry on restoration. |
| 4 | Customer communication: provide customer support with acknowledgment script. |

### Follow-Up

- Postmortem focused on payment redundancy.
- Implement secondary payment gateway for failover.
- Add synthetic transaction monitoring (alert within 2 minutes).
- Build automated retry/dead-letter queue for failed transactions.
- Reconcile all failed transactions once service is restored.

---

## Task 3 -- Database Disk Space Critical

**Severity: P2 -- Medium (escalating to P1 if unaddressed)**
**Impact: 15GB remaining at 2GB/hour = approximately 7.5 hours until disk full and database crash**

### Immediate Actions (First 5 Minutes)

1. **Declare Incident** -- Page DBA and infrastructure on-call.
2. **Set hard deadline** -- Disk full in ~7.5 hours. All mitigation must complete before that.
3. **Identify growth source** -- Check which tables are growing fastest, runaway queries, binary log/WAL accumulation, unexpected bulk jobs.

### Investigation Steps

1. **What is consuming space?**
   - Data files (table growth): which of the 3 microservices is driving growth?
   - Transaction logs / WAL: replication lag preventing log cleanup?
   - Temporary files: long-running queries generating large temp tables?
   - Slow query log or general log accidentally enabled in production?
2. **Is this new behavior?** Compare disk growth rate over past 7 days.
3. **Orphaned data?** Tables with no retention policy accumulating logs, sessions, events?

### Mitigation

| Priority | Action | Space Recovered |
|----------|--------|-----------------|
| 1 | Purge old binary logs/WAL segments | Potentially GBs |
| 2 | Truncate or archive known-safe large temporary tables | Variable |
| 3 | Kill runaway bulk-write job | Stops the bleed |
| 4 | Expand disk volume (cloud: resize online) | Buys significant time |
| 5 | Emergency data retention DELETE with small batch sizes | Gradual |

### Follow-Up

- Automated disk alerting at 70%, 80%, 90%.
- Configure automated log rotation and data retention policies.
- Auto-expanding storage or managed database with automatic scaling.
- Monthly capacity planning review.

---

## Task 4 -- Leaked API Key with Production S3 Access to PII

**Severity: P0 -- Critical (Security Incident)**
**Impact: Potential unauthorized access to user PII. Regulatory and legal implications.**

### Immediate Actions (First 5 Minutes -- Non-Negotiable)

1. **REVOKE THE KEY IMMEDIATELY.** Go to IAM, deactivate and delete the compromised access key. Do not wait for investigation.
2. **Declare security incident.** Engage: Security team, Legal/Compliance, Engineering leadership, Privacy/DPO.
3. **Remove key from public GitHub repo.** Force-push to remove from git history or request GitHub support to purge. Assume the key is already scraped by bots -- revocation is what matters.
4. **Verify revocation** -- Attempt to use the old key to confirm it fails.

### Investigation Steps

1. **Determine exposure window:** When was the commit pushed? When was the key created?
2. **Audit S3 access logs:** Review CloudTrail and S3 access logs for the compromised key. Look for unknown IP access, bulk downloads, bucket listing, data modification.
3. **Assess data scope:** Which S3 buckets? What PII? How many users affected?
4. **Check for lateral movement:** Did the key have permissions beyond S3?

### Mitigation

| Priority | Action |
|----------|--------|
| 1 | Key revoked (done in immediate actions). |
| 2 | Issue new key through secure channels, rotate related credentials. |
| 3 | Rotate all S3 bucket policies with explicit deny for old key. |
| 4 | If unauthorized access found: engage incident response/forensics firm. |
| 5 | If PII accessed: begin breach notification (72-hour GDPR window). |

### Follow-Up

- Legal/Compliance: determine if reportable breach.
- Implement automated secret scanning on all repos.
- Migrate to IAM roles, SSO, and short-lived credentials.
- Apply least-privilege to all IAM policies.
- Enable S3 bucket access logging and CloudTrail.
- Company-wide credential hygiene audit.
- Mandatory security training on secret management.

---

## Task 5 -- Cross-User Data Leakage

**Severity: P0 -- Critical (Data Privacy Violation)**
**Impact: Users viewing other users' private data. Even at 5%, this is a severe privacy breach.**

### Immediate Actions (First 5 Minutes)

1. **Declare Incident** -- P0 regardless of percentage.
2. **Consider taking service offline** if data is highly sensitive. A brief maintenance window is less damaging than a privacy breach.
3. **Assess caching layer immediately** -- This symptom pattern (intermittent, no code changes, cross-user data) almost always points to caching. Check:
   - CDN cache: responses cached without proper Vary headers or missing `Cache-Control: private`?
   - Application cache (Redis/Memcached): cache keys correctly scoped to user/session?
   - Reverse proxy (Nginx/Varnish): caching authenticated responses?
4. **Page backend, frontend, and infrastructure on-call engineers.**

### Investigation Steps

1. **Caching layer (highest probability):**
   - CDN or reverse proxy config changed recently?
   - Cache keys missing user-scoping parameter?
   - Recent infrastructure change (load balancer, CDN rule, Nginx config)?
2. **Session management:**
   - Session store connection issues causing session ID reuse or collision?
   - Session IDs with sufficient entropy, not being recycled?
   - Sticky sessions recently disabled on load balancer?
3. **Application thread safety:**
   - Shared mutable state (static/global variable holding user context)?
   - Connection pooling not properly cleaning between requests?
4. **Reproduce in staging** to confirm the fix before deploying.

### Mitigation

| Priority | Action |
|----------|--------|
| 1 | CDN/proxy caching: purge cache, add `Cache-Control: no-store, private` to authenticated endpoints. |
| 2 | Session store corruption: flush sessions, force re-authentication. |
| 3 | Application shared state: deploy hotfix. |
| 4 | Root cause unclear within 30 minutes: take service into maintenance mode. |

### Follow-Up

- Determine blast radius: identify all potentially affected users.
- Notify affected users per privacy policy and regulations.
- Add automated testing for session isolation.
- Implement response-level assertions verifying authenticated user matches returned data.
- Audit all caching configurations for authenticated endpoints.
- Add monitoring for cache key collision rates and session integrity.
