## Task 1: API Response Time Spike (P0 CRITICAL)

**Severity:** P0 -- 2,000 users affected, 45% error rate, 15s response times. Effectively a full outage.

**Classification:** Infrastructure / External Dependency. "All endpoints" + "no recent deployments" rules out code regression. 75x latency increase points to a downstream dependency (database, cache, or network).

### Immediate Diagnostic Steps (in order):

1. **Check database** -- `SELECT 1;` round-trip time, active connections vs pool max, long-running queries/lock contention
2. **Check cache layer (Redis/Memcached)** -- Is it responding? Memory/eviction rates? Cache failure explains all endpoints degrading.
3. **Check network/DNS** -- Latency to internal services, packet loss, DNS resolution times
4. **Check cloud provider status** -- Region status page, load balancer health, API server CPU/memory
5. **Check external dependencies** -- Connection timeouts to third-party services called on every request

### Stabilization Options:

| Option | When | Recovery Time |
|--------|------|--------------|
| Restart cache cluster | Cache unresponsive | 2-5 min |
| Kill long-running DB queries | Lock contention found | 1-2 min |
| Increase connection pool | Pool exhaustion confirmed | 5 min |
| Failover to read replica | Primary DB bottleneck | 5-10 min |

### Communication:
> INCIDENT IN PROGRESS -- P0. We are aware of degraded API performance affecting all users. Engineering is actively investigating. Next update in 15 minutes.

---

## Task 2: Payment Processing Failures (P1 HIGH)

**Severity:** P1 -- ~10% of transactions failing, direct revenue loss.

**Classification:** External Dependency. "Connection refused" = TCP-level rejection from payment gateway. 2-day gap since deployment rules out code regression. 10% (not 100%) suggests partial failure or intermittent connectivity.

### Immediate Actions:

1. **Check payment gateway status page** + social media/Down Detector
2. **Test connectivity from each API server**: `curl -v https://<gateway>/health`, `telnet <host> 443`
3. **Review payment service logs** -- which endpoint, all servers or some?
4. **Check for network/firewall changes** -- security groups, DNS changes, IP allowlist stale?

### Critical: Contact the payment gateway provider NOW with timestamps, source IPs, error messages.

### Stabilization:

| Option | When |
|--------|------|
| Switch to backup gateway | Primary confirmed down |
| Retry with backoff | Failures intermittent |
| Update firewall rules | IP allowlist stale |
| Queue failed transactions for retry | Gateway expected to recover |

---

## Task 3: Database Disk Space Critical (P1 HIGH)

**Severity:** P1 -- 95% full, 2GB/hour growth, ~7.5 hours until full. No user impact yet but imminent P0 if not addressed.

### Phase 1: Buy Time (30 minutes)

1. **Identify space consumers**: `du -sh /var/lib/postgresql/*`, top 20 tables by size
2. **Quick wins**: Purge old binary logs/WAL, remove temp files, delete local backups
3. Expected: several hours of additional runway

### Phase 2: Root Cause (2 hours)

4. **Why 2GB/hour?** Check `pg_stat_user_tables` for high insert rates, check for misbehaving batch jobs, check if autovacuum has been running

### Phase 3: Permanent Fix (24 hours)

5. Implement automated cleanup (cron job with retention policy)
6. Set up alerts at 70%, 80%, 90% thresholds
7. Expand disk volume if on cloud (zero-downtime on most providers)

**Escalation:** If free space drops below 5GB before Phase 1 complete, escalate to P0.

---

## Task 4: Exposed API Key -- Security Incident (P0 CRITICAL SECURITY)

**Severity:** P0 Security -- API key with read/write access to production S3 containing user PII found on public GitHub.

### Phase 1: CONTAIN (15 minutes)

1. **REVOKE THE KEY IMMEDIATELY**: `aws iam delete-access-key --user-name <user> --access-key-id <key>`
2. **Remove from GitHub** -- delete commit/repo. Assume already scraped by bots.
3. **Issue new credentials** with minimum required permissions via secrets manager.

### Phase 2: ASSESS (2 hours)

4. **Audit CloudTrail** -- all API calls with compromised key (`GetObject`, `ListBucket`, `PutObject`, `DeleteObject`)
5. **Determine exposure window** -- when was it committed? How long exposed?
6. **Assess data scope** -- which buckets, what PII, how many users affected?

### Phase 3: REMEDIATE AND REPORT (24 hours)

7. **Legal/compliance assessment** -- breach notification required? (GDPR: 72-hour window)
8. **Forensic review** -- objects modified/deleted? New objects uploaded?
9. **Harden** -- review all keys for over-broad permissions, add S3 bucket policies, enable GuardDuty, implement pre-commit secrets scanning

### Communication: INTERNAL ONLY until legal is consulted. Do NOT communicate externally.

**Escalate immediately to:** CISO, Legal/General Counsel, VP Engineering, Data Protection Officer.

---

## Task 5: Cross-User Data Leakage (P0 CRITICAL SECURITY)

**Severity:** P0 -- Users seeing other users' private data. Privacy violation even at 5% of logins.

**Most Likely Causes:**
1. Shared cache with keys missing user identity
2. Session ID collision or fixation
3. Connection pool returning stale auth context
4. CDN/reverse proxy caching authenticated responses

### Immediate Actions:

1. **FLUSH ALL APPLICATION CACHES NOW** -- temporary performance hit is vastly preferable to data leakage
2. **Check CDN** -- missing `Vary: Cookie` or `Cache-Control: private`? Purge CDN cache immediately.
3. **Check session management** -- token uniqueness, session store collisions, sticky session breakage
4. **Check connection pooling** -- auth context leaking between requests?

### Verification After Mitigation:
- Log into multiple test accounts, verify isolation
- Log `requested_user_id` vs `response_user_id` on every dashboard request
- Monitor for at least 1 hour

### Communication: CONFIDENTIAL. Engage legal immediately for breach notification assessment.

**Escalate to:** CISO, Legal, VP Engineering, Data Protection Officer.

**Postmortem must answer:** What was the exact mechanism? How long has it been happening? How many users affected? What automated testing exists to catch this class of bug?
