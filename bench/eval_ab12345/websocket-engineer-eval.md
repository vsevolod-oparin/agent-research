# Evaluation: websocket-engineer

## Ground Truth Requirements

### ws-001 (Collaborative text editor)
- **must_mention**: OT/CRDT, connection management (heartbeat/reconnection/state sync), horizontal scaling (sticky sessions/pub-sub), message ordering guarantees
- **structure**: architecture diagram/component list, specific technology recommendations

### ws-002 (Connection drops at 60s)
- **must_mention**: ping/pong frames, proxy/LB timeout settings (nginx proxy_read_timeout), client reconnection with backoff, specific config examples
- **must_not**: only say "add keepalive" without details

### ws-003 (JWT auth for WebSocket)
- **must_mention**: token in HTTP upgrade request, validate during handshake (not after), handle token expiration mid-connection, security re: token in URL/logs
- **structure**: code example showing handshake auth

### ws-004 (Scale Socket.IO)
- **must_mention**: Redis adapter (@socket.io/redis-adapter), sticky sessions with LB, horizontal scaling (PM2/K8s), room/namespace across nodes
- **must_not**: suggest rewriting as first option

### ws-005 (Rate limiting)
- **must_mention**: token bucket/sliding window per connection, server-side enforcement, graceful handling (warning before disconnect), per-user vs per-connection
- **structure**: algorithm choice with reasoning, code sketch

---

## Scoring Dimensions
- **Precision** (1-5): Accuracy, no hallucinations, correct details
- **Completeness** (1-5): Coverage of must_mention items
- **Actionability** (1-5): Can someone implement from this?
- **Structure** (1-5): Organization, readability, required structural elements
- **Efficiency** (1-5): Conciseness, no bloat
- **Depth** (1-5): Technical depth, nuance, edge cases

**Composite** = (Precision*2 + Completeness*1.5 + Actionability + Structure + Efficiency + Depth) / 7.5

---

## Condition Evaluations

### a1
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | All technical claims accurate. Yjs, Redis Pub/Sub, ping/pong, JWT auth all correct. |
| Completeness | 5 | Hits all must_mention items across all 5 tasks. OT+CRDT, ping/pong + proxy config, token in query + security note, Redis adapter + sticky sessions + PM2, token bucket + server-side + graceful handling + per-user. |
| Actionability | 5 | Complete code examples for every task, directly implementable. |
| Structure | 4 | Well-organized with headers. Missing explicit architecture "diagram" for ws-001 (uses text diagram). |
| Efficiency | 5 | Concise, no bloat. Each task is focused. ~280 lines total. |
| Depth | 5 | Discusses token in URL security, short-lived WS tickets, distributed rate limiting with Redis, violation tracking. Mentions message ordering via Yjs. |
| **Composite** | **4.87** | |

### a2
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | Technically accurate throughout. |
| Completeness | 5 | Covers all must_mention items. OT+CRDT, heartbeat/reconnection/proxy config, token auth with security note, Redis adapter + sticky sessions + PM2, token bucket + graduated response + per-user. |
| Actionability | 5 | Full code examples, architecture diagrams. |
| Structure | 5 | Excellent ASCII diagrams, tables for capacity planning. Clear section headers. |
| Efficiency | 4 | Slightly longer but well-justified. |
| Depth | 5 | Connection state recovery, capacity planning table, cleanup for stale buckets, client-side backoff handling. |
| **Composite** | **4.87** | |

### a3
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | All correct. Cookie-based auth option is a valid addition. |
| Completeness | 5 | All must_mention items covered. Adds cookie-based auth and ticket-based auth patterns. |
| Actionability | 5 | Code examples for all tasks. |
| Structure | 4 | Good structure but ws-003 auth validation happens in 'connection' handler, not strictly during upgrade for query param option. |
| Efficiency | 4 | Reasonable length, some redundancy. |
| Depth | 5 | Three auth options with tradeoffs, Redis Cluster consideration, Socket.IO middleware pattern, persistent abuse handling. |
| **Composite** | **4.73** | |

### a4
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | Accurate. Nginx config examples are correct. Sec-WebSocket-Protocol approach is technically valid. |
| Completeness | 5 | All must_mention items covered. Adds HAProxy config. JWT ticket pattern for auth. |
| Actionability | 5 | Excellent code with specific nginx/HAProxy/AWS configs. |
| Structure | 5 | Well-structured with clear separation. |
| Efficiency | 4 | Concise but thorough. |
| Depth | 5 | Capacity math, Redis Pub/Sub fire-and-forget limitation note, per-connection vs per-user with Redis code, application close code 4029. |
| **Composite** | **4.87** | |

### a5
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | All technically accurate. |
| Completeness | 5 | All must_mention items. Strong coverage of nginx config, capacity estimates, awareness throttling. |
| Actionability | 5 | Full code examples with specific configs. |
| Structure | 5 | Excellent organization with clear challenge/solution pattern. |
| Efficiency | 4 | Slightly longer due to nginx config detail but justified. |
| Depth | 5 | permessage-deflate mention, IndexedDB offline, jittered reconnect, Sec-WebSocket-Protocol hack discussed. |
| **Composite** | **4.87** | |

### b1
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Mostly accurate. Uses Socket.IO API in some places where raw ws was asked. Custom OT implementation has potential bugs. Uses deprecated socket.io-redis import. |
| Completeness | 4 | Covers OT/CRDT, ping/pong, auth during handshake, Redis adapter, rate limiting. Misses message ordering guarantees discussion. Token expiration mid-connection covered. |
| Actionability | 4 | Extensive code but some is overly verbose and less directly usable. |
| Structure | 4 | Architecture diagrams present. Very long output. |
| Efficiency | 2 | Extremely verbose (~1000+ lines). KeepAliveManager class, custom OT implementation, monitoring code all add bulk without proportional value. |
| Depth | 4 | Includes monitoring, but custom OT code is risky to recommend. AWS ALB JSON config is unusual format. |
| **Composite** | **3.60** | |

### b2
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Mostly correct. Says "Sticky Sessions NOT Required" for Socket.IO which is incorrect for HTTP long-polling fallback. Auth via Authorization header works for non-browser clients but not browser WebSocket API. |
| Completeness | 4 | Covers most items. Misses token expiration mid-connection handling. Rate limiting covered well. |
| Actionability | 4 | Code examples present. Docker-compose, PM2 config, nginx stickiness all useful. |
| Structure | 4 | Good diagrams. Multiple sections per task. |
| Efficiency | 2 | Very verbose (~900 lines). Monitoring code, health checks, graceful shutdown add bulk. |
| Depth | 4 | Redis Cluster, cookie-based stickiness, connection state in Redis. But sticky sessions claim is wrong. |
| **Composite** | **3.53** | |

### b3
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Mostly accurate. TypeScript version. Cloudflare timeout included (good). |
| Completeness | 5 | All must_mention items covered. Comprehensive auth section with 4 approaches including ticket-based. Origin validation added. Close code table is useful. |
| Actionability | 5 | TypeScript code, multiple approaches, clear comparisons. |
| Structure | 5 | Excellent with horizontal rule separators, comparison tables, close code reference. |
| Efficiency | 2 | Extremely long (~1300 lines). Excessive detail in reconnection, monitoring, metrics per task. |
| Depth | 5 | Origin validation, close codes, vector clock mention, consistent hashing for doc routing, Redis Streams alternative. |
| **Composite** | **3.93** | |

### b4
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Accurate overall. Some unusual patterns (Yjs import as `{ Y }` which is incorrect, should be `import * as Y`). |
| Completeness | 5 | All must_mention items present. Architecture diagrams, multiple scaling strategies, multiple rate limiting approaches (token bucket + sliding window + Redis). |
| Actionability | 4 | Code present but some conceptual rather than directly runnable. |
| Structure | 5 | Excellent tables, diagrams, optimization comparison tables. |
| Efficiency | 2 | Very long (~900 lines). Multiple rate limiting implementations, client-side throttling, monitoring all add bulk. |
| Depth | 5 | Snapshot strategy, operation log retention, recovery strategy, enforcement options comparison table. |
| **Composite** | **3.93** | |

### b5
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Mostly accurate. Auth section recommends `Authorization` header during upgrade which browsers don't support. |
| Completeness | 5 | All must_mention items. Token refresh for long-lived connections explicitly covered. |
| Actionability | 4 | Code examples present, but some (like the Authorization header approach) won't work in browsers. |
| Structure | 5 | Excellent tables, performance optimization tables, close code tables, monitoring metrics. |
| Efficiency | 2 | Extremely long (~1300 lines). Token bucket + sliding window + Redis implementations all included. Client-side throttling, metrics tracking, top violators tracking. |
| Depth | 5 | Token refresh, origin validation, multiple rate limit algorithm comparison with pros/cons table, Redis pipeline for distributed limiting. |
| **Composite** | **3.93** | |

---

## Summary Table

| Condition | Precision | Completeness | Actionability | Structure | Efficiency | Depth | Composite |
|-----------|-----------|--------------|---------------|-----------|------------|-------|-----------|
| a1 | 5 | 5 | 5 | 4 | 5 | 5 | 4.87 |
| a2 | 5 | 5 | 5 | 5 | 4 | 5 | 4.87 |
| a3 | 5 | 5 | 5 | 4 | 4 | 5 | 4.73 |
| a4 | 5 | 5 | 5 | 5 | 4 | 5 | 4.87 |
| a5 | 5 | 5 | 5 | 5 | 4 | 5 | 4.87 |
| b1 | 4 | 4 | 4 | 4 | 2 | 4 | 3.60 |
| b2 | 4 | 4 | 4 | 4 | 2 | 4 | 3.53 |
| b3 | 4 | 5 | 5 | 5 | 2 | 5 | 4.07 |
| b4 | 4 | 5 | 4 | 5 | 2 | 5 | 3.93 |
| b5 | 4 | 5 | 4 | 5 | 2 | 5 | 3.93 |

## Key Observations

1. **a-group (a1-a5)** consistently outperforms b-group on Precision and Efficiency. All a-conditions produce concise, accurate, directly implementable outputs.

2. **b-group (b1-b5)** tends toward extreme verbosity (2-4x longer outputs) with multiple alternative implementations, monitoring code, and client-side rate limiters that add bulk without proportional value for the tasks asked.

3. **b2** has the lowest score due to incorrect claim about sticky sessions not being required for Socket.IO and the Authorization header recommendation for browser WebSocket.

4. **b3** is the best of the b-group, maintaining high completeness and depth despite verbosity, with unique additions like origin validation and close code reference tables.

5. All conditions successfully cover OT/CRDT, ping/pong, Redis adapter, and token bucket -- the core must_mention items. Differentiation comes from precision of details and efficiency of presentation.
