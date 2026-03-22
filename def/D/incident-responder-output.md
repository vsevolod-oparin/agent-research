## Task 1: API Response Time Spike and Error Rate Surge

**Incident ID**: INC-2026-0322-001
**Declared**: 2026-03-22 (T+3 minutes from onset)
**Severity**: P0 -- Critical
**Incident Commander**: On-call IC

### 1. Acknowledgment and Declaration

Alert acknowledged. Declaring a P0 incident effective immediately. All API endpoints are degraded: response times have increased 75x (200ms to 15s) and error rate has jumped from 0.1% to 45%. This constitutes a near-total service outage for 2000 active users.

**Actions taken**:
- Created dedicated Slack channel: #inc-api-latency-20260322
- Opened virtual war room (video bridge)
- Paged on-call engineers for API, infrastructure, and database teams

### 2. Severity and Scope Assessment

| Dimension | Assessment |
|---|---|
| **User Impact** | 2000 active users affected. Service is effectively unusable at 15s latency and 45% error rate. |
| **Business Impact** | High. Revenue-impacting if any transactions depend on these APIs. Reputation damage from degraded experience. |
| **System Scope** | All API endpoints affected simultaneously, indicating a shared dependency failure (database, network, load balancer, or upstream service). |
| **Severity** | P0 -- All hands on deck. |

### 3. Response Team Assembly

| Role | Assignment |
|---|---|
| Incident Commander (IC) | On-call IC |
| Operations Lead (OL) | On-call infrastructure engineer + on-call API engineer |
| Communications Lead (CL) | Engineering manager or designated CL |

### 4. Investigation and Mitigation Protocol

**What changed?** No recent deployments reported. Investigation must focus on:
- Infrastructure-level changes (cloud provider incidents, network changes, DNS)
- Database health (connection pool exhaustion, slow queries, replication lag)
- Upstream/downstream dependency failures
- Traffic anomalies (DDoS, unexpected traffic surge)
- Certificate or credential expirations

**Immediate data gathering (OL tasks, in parallel)**:
1. Check cloud provider status page for ongoing incidents
2. Pull database metrics: connection count, query latency, CPU, memory, I/O wait
3. Pull load balancer metrics: active connections, backend health, queue depth
4. Check application logs for error patterns (timeouts, connection refused, OOM)
5. Check network metrics: packet loss, DNS resolution time
6. Review auto-scaling events or resource limit hits
7. Check if any scheduled jobs or batch processes started around the onset time

**Likely root cause hypotheses (ranked by probability given symptoms)**:
1. Database saturation (explains all-endpoint impact, latency spike, and errors)
2. Network or load balancer issue at the infrastructure layer
3. Upstream dependency failure causing cascading timeouts
4. Resource exhaustion on application hosts (memory, file descriptors, threads)

### 5. Stabilization Actions

**Immediate mitigations to evaluate**:
- If database: Kill long-running queries, increase connection pool, failover to read replica if applicable
- If load/resource: Scale up application instances immediately; enable circuit breakers to shed load
- If upstream dependency: Enable fallback/cached responses; disable non-critical features calling the dependency
- If traffic spike: Enable rate limiting; activate DDoS mitigation if applicable

**Stakeholder communication (CL)**:
- T+5min: "We are aware of degraded API performance affecting all endpoints. An incident team has been assembled and is actively investigating. Updates will follow every 15 minutes."
- Customer support should be notified to expect increased ticket volume and given talking points.

### 6. Follow-up Actions

- Once mitigated, monitor for 30 minutes to confirm stability
- Declare incident resolved only after SLIs return to baseline
- Schedule blameless postmortem within 48 hours
- Postmortem must address: why no automated alerting caught this sooner, why no recent deployments yet a systemic failure occurred, and what monitoring gaps exist

---

## Task 2: Payment Processing Failures

**Incident ID**: INC-2026-0322-002
**Declared**: 2026-03-22 (T+20 minutes from onset)
**Severity**: P1 -- High
**Incident Commander**: On-call IC

### 1. Acknowledgment and Declaration

Alert acknowledged. Declaring a P1 incident. Approximately 10% of payment transactions are failing with "Connection refused" errors from the payment gateway. Customer complaints are already being received. This is a revenue-impacting incident.

**Actions taken**:
- Created dedicated Slack channel: #inc-payments-20260322
- Opened virtual war room
- Paged on-call engineers for payments service, infrastructure, and networking teams
- Notified customer support lead and finance team

### 2. Severity and Scope Assessment

| Dimension | Assessment |
|---|---|
| **User Impact** | ~10% of users attempting payments are unable to complete transactions. Direct revenue loss. |
| **Business Impact** | Revenue loss is ongoing. Customer trust is at risk. Complaints are already arriving. |
| **System Scope** | Payment processing path only. "Connection refused" indicates a network-level or service-level failure between our systems and the payment gateway. |
| **Severity** | P1 -- The 10% partial failure with active customer complaints and revenue impact demands immediate response. Not P0 because 90% of transactions still succeed. |

### 3. Investigation and Mitigation Protocol

**What changed?** Last deployment was 2 days ago -- unlikely to be the direct cause unless a delayed effect (e.g., connection leak, certificate expiry on a timer).

**Key questions for investigation**:
1. Is the payment gateway itself experiencing an outage? Check their status page and contact their support.
2. Is the "Connection refused" coming from a specific gateway endpoint or IP?
3. Are the failing 10% correlated to a specific server instance, region, or payment method?
4. Check network connectivity: firewall rules, IP allowlists, NAT gateway health
5. Check for certificate or TLS handshake failures
6. Review connection pool metrics to the payment gateway -- are connections being exhausted or leaked?
7. Check if any infrastructure changes (security group updates, network ACLs) happened outside of application deployments

**Immediate data gathering (OL tasks)**:
1. Correlate failing transactions with specific application instances -- is one host responsible for all failures?
2. Attempt direct connectivity test to payment gateway from each application host
3. Review payment gateway's status page and open a support ticket with them
4. Pull connection metrics: active connections, failed handshakes, timeout counts
5. Check DNS resolution for the payment gateway endpoint

### 4. Stabilization Actions

**Immediate mitigations**:
- If one or more application hosts are failing: remove unhealthy hosts from the load balancer and replace them
- If gateway IP changed: update DNS cache or configuration
- If connection pool exhaustion: restart affected application instances to reset connections
- If gateway-side issue: enable retry logic with exponential backoff if not already present; consider routing to a backup payment processor if one is configured
- If firewall/network change: revert the change immediately

**Stakeholder communication (CL)**:
- T+0: "We are investigating payment processing failures affecting approximately 10% of transactions. The team is actively working on diagnosis and resolution. Customer support has been briefed."
- T+15min and every 15 minutes thereafter: status update
- Customer support talking points: "We are aware some payments may not be going through. Please try again in a few minutes. If the issue persists, our team is working on a fix."

### 5. Follow-up Actions

- Once resolved, verify transaction consistency -- identify any payments that were charged but not recorded (or vice versa) and reconcile
- Notify finance team of any revenue impact or reconciliation needs
- Schedule blameless postmortem within 48 hours
- Postmortem must cover: why 20 minutes elapsed before the incident was declared, whether retry/failover mechanisms are adequate, and whether a backup payment processor should be configured

---

## Task 3: Database Disk Space Critical

**Incident ID**: INC-2026-0322-003
**Declared**: 2026-03-22
**Severity**: P1 -- High (will escalate to P0 if unmitigated within ~7 hours)
**Incident Commander**: On-call IC

### 1. Acknowledgment and Declaration

Alert acknowledged. Declaring a P1 incident with a ticking clock. The primary database server is at 95% disk usage with 15GB free and growing at ~2GB/hour. At current rate, the disk will be completely full in approximately 7.5 hours, at which point the database will stop accepting writes and this becomes a P0 outage affecting 3 microservices.

**Actions taken**:
- Created dedicated Slack channel: #inc-db-disk-20260322
- Paged on-call DBA and infrastructure engineer
- Notified service owners of the 3 dependent microservices

### 2. Severity and Scope Assessment

| Dimension | Assessment |
|---|---|
| **User Impact** | No immediate user impact yet, but 3 microservices will fail once disk is full. |
| **Business Impact** | Imminent outage of database-backed services within ~7.5 hours if not addressed. |
| **System Scope** | Primary database server. 3 microservices depend on it. |
| **Severity** | P1 now. Will become P0 in approximately 7.5 hours if not mitigated. |
| **Deadline** | ~7.5 hours to prevent service outage. |

### 3. Investigation and Mitigation Protocol

**What is consuming disk space? (OL tasks, parallel)**:
1. Identify the largest tables and their growth rates
2. Check for uncontrolled log file growth (database logs, slow query logs, general logs)
3. Check for accumulated temporary files, core dumps, or backup files on the same volume
4. Check binary log / WAL (write-ahead log) retention and size
5. Check if a recent data import, migration, or batch job caused unusual growth
6. Identify if any table bloat exists (e.g., dead tuples in PostgreSQL not being vacuumed)

### 4. Stabilization Actions (Tiered, by urgency)

**Tier 1 -- Immediate space recovery (do within 1 hour)**:
- Purge old binary logs / WAL segments that have been replicated and are no longer needed
- Remove or rotate database server log files
- Delete old temporary files, core dumps, or stale backup files on the volume
- If applicable, run VACUUM FULL on bloated tables (PostgreSQL) or OPTIMIZE TABLE (MySQL) -- caution: these can lock tables

**Tier 2 -- Buy more time (do within 2-3 hours)**:
- Expand the disk volume (if cloud-hosted, this can often be done online)
- Archive and delete old data that is no longer needed by applications (with service owner approval)
- Move large, infrequently accessed tables to a separate volume or archive storage

**Tier 3 -- Prevent recurrence (do within 1-2 weeks)**:
- Implement automated log rotation and retention policies
- Configure automated disk space monitoring alerts at 70%, 80%, 90% thresholds
- Implement data retention and automated cleanup jobs (the fact that no automated cleanup is configured is a critical gap)
- Set up binary log / WAL retention limits
- Implement table partitioning for large, continuously growing tables
- Add capacity planning reviews to operational runbooks

### 5. Stakeholder Communication

- T+0: "The primary database disk is at 95% capacity. There is no current user impact, but we are treating this as a P1 with a ~7.5 hour window to prevent a service outage. The team is actively freeing space and expanding capacity."
- Updates every 30 minutes until disk usage drops below 80%.

### 6. Follow-up Actions

- Once stabilized, declare incident resolved
- Schedule blameless postmortem: focus on why no automated cleanup was configured, why alerting did not trigger earlier, and why capacity planning did not catch this growth trend
- Action items must include: automated cleanup jobs, tiered disk alerts, capacity planning process

---

## Task 4: Potential Data Breach -- Exposed API Key with PII Access

**Incident ID**: INC-2026-0322-004
**Declared**: 2026-03-22
**Severity**: P0 -- Critical (Security Incident)
**Incident Commander**: On-call IC, with Security team co-leading

### 1. Acknowledgment and Declaration

Alert acknowledged. Declaring a P0 security incident effective immediately. An internal employee's API key with read/write access to production S3 buckets containing user PII has been found on a public GitHub repository. The duration of exposure is unknown, making this a worst-case assumption scenario.

**Actions taken**:
- Created dedicated, restricted Slack channel: #inc-security-breach-20260322 (access limited to incident responders, security team, legal, and leadership)
- Opened secure virtual war room
- Paged: Security team lead, Infrastructure on-call, Data Protection Officer (DPO), Legal counsel, CISO
- All communications about this incident must go through the restricted channel -- no public discussion

### 2. Severity and Scope Assessment

| Dimension | Assessment |
|---|---|
| **User Impact** | Potentially all users whose PII is stored in the affected S3 buckets. |
| **Business Impact** | Potential regulatory violations (GDPR, CCPA, HIPAA depending on jurisdiction), legal liability, reputation damage, mandatory breach notifications. |
| **System Scope** | Production S3 buckets containing user PII. The blast radius depends on what data the key can access and whether it was used by unauthorized parties. |
| **Severity** | P0 -- Data breach with PII exposure. |

### 3. Immediate Containment Actions (Do NOW, in this order)

**Step 1 -- Revoke the key (within minutes)**:
- Immediately revoke/deactivate the exposed API key in the IAM console. Do not wait for investigation. Revoke first, ask questions later.
- Verify revocation is effective by testing the key.

**Step 2 -- Remove the exposure**:
- Request immediate takedown of the GitHub repository or the specific commit containing the key (use GitHub's token scanning/removal process or contact the repo owner).
- If it is the employee's personal repo, coordinate with them directly.
- Note: Assume the key has been scraped by automated bots. Revocation is the primary defense, not removal.

**Step 3 -- Assess blast radius**:
- Pull CloudTrail / S3 access logs for the exposed key for the entire period it may have been active.
- Determine: Was the key used from any IP addresses that are not our corporate/infrastructure IPs?
- Determine: Which S3 buckets were accessed? Which objects were read, written, or deleted?
- Determine: What PII is stored in those buckets? How many users are affected?
- Determine: How long was the key on the public repo? (Check git history for the commit date.)

**Step 4 -- Secure the perimeter**:
- Audit all other API keys and credentials associated with the employee's account. Rotate them.
- Check if the employee has access to other sensitive systems and review those access logs.
- Enable enhanced logging on all S3 buckets containing PII if not already enabled.

### 4. Investigation Protocol

**Forensic analysis (Security team lead)**:
1. Full CloudTrail analysis for the exposed key -- every API call, source IP, timestamp
2. S3 server access log analysis for the affected buckets
3. Git history analysis: when was the key first committed? To which repo(s)?
4. Determine if any data was exfiltrated (unusual download patterns, large data transfers)
5. Determine if any data was modified or deleted (integrity check)
6. Check for any signs of lateral movement using the exposed credentials

**Employee coordination (HR and Security)**:
- Interview the employee in a blameless manner to understand how the key ended up in a public repo
- Determine if this was accidental (e.g., committed in a dotfile or config) or indicates a larger issue
- Do not assign blame -- focus on understanding the process failure

### 5. Legal and Compliance Actions

- Notify the Data Protection Officer (DPO) immediately
- Legal counsel must assess whether mandatory breach notification is required under GDPR (72-hour window), CCPA, or other applicable regulations
- Begin preparing breach notification materials (for regulators and affected users) in case they are needed
- Document all response actions with timestamps for regulatory compliance
- Preserve all logs and evidence -- do not delete anything

### 6. Stakeholder Communication

- **Internal (restricted)**: "A security incident has been declared. An API key with access to production PII was found on a public repository. The key has been revoked. Investigation is ongoing to determine if unauthorized access occurred. All communications about this incident must go through the restricted incident channel."
- **Leadership**: Briefing within 1 hour with scope assessment and preliminary findings
- **External (if breach confirmed)**: Legal and PR teams will coordinate any required notifications. Do not make external statements until legal counsel has reviewed.
- **Do NOT** disclose details of the breach publicly or in unrestricted channels until authorized by legal.

### 7. Follow-up Actions

- Complete forensic investigation and produce a full incident report
- If unauthorized access is confirmed: execute breach notification plan per legal guidance
- Implement preventive measures:
  - Enable automated secret scanning on all GitHub organizations and repositories (GitHub Secret Scanning, git-secrets, or similar)
  - Implement pre-commit hooks that block credential commits
  - Enforce short-lived, rotatable credentials instead of long-lived API keys
  - Apply least-privilege access policies -- no single key should have broad read/write access to PII buckets
  - Implement S3 bucket policies that restrict access by IP range, VPC endpoint, or require MFA
  - Conduct security awareness training on credential management
- Schedule blameless postmortem with security team, infrastructure, and management

---

## Task 5: Cross-User Data Leakage (Session/Cache Contamination)

**Incident ID**: INC-2026-0322-005
**Declared**: 2026-03-22
**Severity**: P0 -- Critical (Data Privacy Violation)
**Incident Commander**: On-call IC

### 1. Acknowledgment and Declaration

Alert acknowledged. Declaring a P0 incident effective immediately. Users are seeing other users' data after login. This is a confirmed cross-user data leakage -- a severe privacy violation regardless of the percentage of affected logins. Even at 5%, this means user PII and private data are being exposed to unauthorized parties.

**Actions taken**:
- Created dedicated Slack channel: #inc-data-leakage-20260322
- Opened virtual war room
- Paged: On-call backend engineers, security team, infrastructure team, DPO
- Notified customer support to handle incoming reports with sensitivity

### 2. Severity and Scope Assessment

| Dimension | Assessment |
|---|---|
| **User Impact** | ~5% of logins result in a user seeing another user's private data. Both the "viewer" and the "viewed" users are affected -- one sees unauthorized data, the other has their data exposed. |
| **Business Impact** | Severe. This is a data privacy violation with potential regulatory implications (GDPR, CCPA). Trust and reputation damage. |
| **System Scope** | Authentication/session management and/or caching layer. The intermittent nature at 5% suggests a race condition or cache poisoning issue. |
| **Severity** | P0 -- Active data leakage to unauthorized users. |

### 3. Immediate Containment (Do NOW)

**The priority is to stop the data leakage, even at the cost of degraded performance.**

**Step 1 -- Identify the contaminated layer**:
The intermittent, cross-user data pattern strongly suggests one of:
1. **Shared cache returning wrong user's data** (most likely -- CDN, reverse proxy cache, application-level cache, or session store)
2. **Session store contamination** (session IDs being reused or colliding)
3. **Connection pool or thread-local variable leaking state** between requests

**Step 2 -- Immediate mitigation options (evaluate in order)**:
- **Disable caching**: If a CDN or reverse proxy cache (e.g., Varnish, Nginx, CloudFront) is in front of authenticated endpoints, disable it immediately or flush the cache. Check cache headers: are authenticated responses being cached without proper Vary headers or with Cache-Control misconfiguration?
- **Flush session store**: Clear all sessions in Redis/Memcached/database. This will force all users to re-login, which is an acceptable tradeoff to stop the data leakage.
- **Restart application instances**: If thread-local or in-memory state is leaking, a rolling restart of all application instances can clear contaminated state.
- **If the above do not resolve it**: Consider putting the service into maintenance mode until the root cause is identified. Active data leakage must be stopped.

### 4. Investigation Protocol

**Root cause analysis (OL tasks)**:

1. **Caching layer audit**:
   - Check CDN/reverse proxy configuration for authenticated routes. Are responses being cached per-user or globally?
   - Check for missing or incorrect Vary, Cache-Control, Set-Cookie headers on authenticated responses
   - Check if a recent infrastructure change altered cache behavior (even if no code was deployed)

2. **Session management audit**:
   - Check session store (Redis, Memcached, database) for health and correctness
   - Check for session ID collisions or insufficient entropy in session ID generation
   - Check if session serialization/deserialization is causing data mixing
   - Check if sticky sessions or session affinity is misconfigured

3. **Application-level state audit**:
   - Check for any global or shared mutable state in the application that holds user-specific data
   - Check for thread-safety issues in request handling (e.g., storing user data in class-level variables instead of request-scoped variables)
   - Check connection pool behavior -- are database connections returning cached result sets from previous queries?

4. **Reproduce the issue**:
   - Attempt to reproduce in a staging environment by simulating concurrent logins
   - Check if the issue correlates with specific application instances (single contaminated node vs. systemic)

**No recent code changes were reported**, so investigate:
- Infrastructure changes (load balancer config, cache config, session store version upgrade)
- Dependency updates that may have changed caching or session behavior
- Auto-scaling events that introduced instances with different configurations
- Session store resource pressure (memory limits causing evictions and key collisions)

### 5. Stakeholder Communication

- **Internal**: "We are investigating reports of users seeing other users' data after login. This is a P0 data privacy incident. The team is working to contain the leakage immediately. Do not discuss details outside the incident channel."
- **Customer support**: "If a user reports seeing someone else's data, apologize sincerely, ask them to log out immediately, clear browser cookies, and assure them the team is actively fixing this. Escalate every report to the incident channel."
- **Leadership**: Brief within 30 minutes with scope, containment status, and regulatory implications.
- **Legal/DPO**: Notify immediately. This may constitute a reportable data breach under GDPR and other regulations.

### 6. Verification After Fix

- Confirm the issue cannot be reproduced after mitigation
- Review application logs to verify each request is returning data for the authenticated user only
- Monitor login flows for any recurrence over the next 24 hours
- Audit access logs to identify which users were affected (both viewers and viewed) and what data was exposed

### 7. Follow-up Actions

- Notify all affected users (both those who saw others' data and those whose data was exposed)
- Assess regulatory notification requirements with legal counsel
- Schedule blameless postmortem within 48 hours
- Action items must include:
  - Fix the root cause (cache misconfiguration, session management bug, or shared state issue)
  - Add automated tests that verify user isolation in authenticated responses
  - Add monitoring and alerting for session anomalies (e.g., user ID mismatch between session and response)
  - Implement response-level checks that validate the data being returned matches the authenticated user
  - Review and harden all caching configurations for authenticated routes
  - Conduct a broader audit of all endpoints for similar user-isolation vulnerabilities
