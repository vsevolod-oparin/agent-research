# Tasks

## Task 1

Alert: API response times spiked from 200ms to 15s across all endpoints.
Error rate jumped from 0.1% to 45%. Started 3 minutes ago.
No recent deployments. 2000 active users affected.

## Task 2

Alert: Payment processing failing for ~10% of transactions.
Error: "Connection refused" from payment gateway.
Started 20 minutes ago. Customer complaints coming in.
Last deployment was 2 days ago.

## Task 3

Alert: Disk usage on primary database server hit 95%.
Growth rate: ~2GB/hour. Current free space: 15GB.
Database serves 3 microservices. No automated cleanup configured.

## Task 4

Alert: Security team reports potential data breach. An internal
employee's API key was found posted on a public GitHub repo.
The key has read/write access to production S3 buckets containing
user PII. Unknown how long it's been exposed.

## Task 5

Alert: Users reporting they can see other users' data after login.
Reproduced: logging in as User A sometimes shows User B's dashboard.
Happens intermittently, ~5% of logins. No recent code changes.
