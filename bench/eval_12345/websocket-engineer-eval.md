# Evaluation: websocket-engineer

## Ground Truth Requirements

### ws-001 (Collaborative Text Editor)
- **must_mention**: OT/CRDT, connection management (heartbeat/reconnection/state sync), horizontal scaling (sticky sessions/pub-sub), message ordering
- **structure**: architecture diagram/component list, specific tech recommendations

### ws-002 (60s Connection Drop)
- **must_mention**: ping/pong frames (server heartbeat), proxy/LB timeout settings (nginx proxy_read_timeout), client reconnection with backoff, specific config examples
- **must_not**: only "add keepalive" without details

### ws-003 (WebSocket JWT Auth)
- **must_mention**: token in upgrade request (query param or header), validate during upgrade handshake (not after), handle token expiry mid-connection, security re: token in URL/logs
- **structure**: code example showing handshake auth

### ws-004 (Scale Socket.IO)
- **must_mention**: Redis adapter (@socket.io/redis-adapter), sticky sessions with LB, horizontal scaling (PM2 cluster/K8s), room/namespace across nodes
- **must_not**: suggest rewriting in different framework first

### ws-005 (Rate Limiting)
- **must_mention**: token bucket/sliding window per connection, server-side enforcement, graceful handling (warning before disconnect), per-user vs per-connection
- **structure**: algorithm choice with reasoning, code sketch

---

## Scoring Dimensions (1-5)
- **Precision**: Accuracy and correctness of information
- **Completeness**: Coverage of must_mention items
- **Actionability**: Practical, implementable guidance
- **Structure**: Organization, readability, formatting
- **Efficiency**: Conciseness, no unnecessary padding
- **Depth**: Technical depth and nuance

---

## Condition Evaluations

### Condition 1
- **Precision**: 5 - All technical details accurate. Correct ping/pong, Yjs recommendations, Redis adapter usage.
- **Completeness**: 4.5 - Covers all must_mention items across all 5 tasks. ws-003 mentions URL logging concern but doesn't explicitly say "validate during upgrade handshake" - validates on connection event instead. Token expiry handling mentioned briefly.
- **Actionability**: 5 - Complete working code examples for every task. Ready to copy-paste.
- **Structure**: 4.5 - Clean, well-organized. Good use of code blocks. Slightly dense.
- **Efficiency**: 5 - Concise, no filler. Every paragraph adds value.
- **Depth**: 4 - Good depth on most topics, though ws-001 could explore ordering guarantees more.
- **Composite**: (5x2 + 4.5x1.5 + 5 + 4.5 + 5 + 4) / 7.5 = **4.70**

### Condition 2
- **Precision**: 5 - Highly accurate. Correct identification of intermediaries, proper ping/pong implementation.
- **Completeness**: 5 - Hits all must_mention items. ws-002 has nginx config, ws-003 validates during upgrade AND mentions short-lived tickets, token expiry, URL security. ws-004 covers Redis adapter, sticky sessions, PM2. ws-005 has token bucket with progressive violation handling + Redis distributed version.
- **Actionability**: 5 - Working code for everything. Redis sliding window implementation is production-quality.
- **Structure**: 4.5 - Well-organized with clear headings. Architecture diagrams included.
- **Efficiency**: 4.5 - Slightly longer but justified by additional Redis-backed rate limiting.
- **Depth**: 5 - Excellent depth throughout. Multi-process rate limiting, cookie-based auth alternative, memory per connection estimates.
- **Composite**: (5x2 + 5x1.5 + 5 + 4.5 + 4.5 + 5) / 7.5 = **4.87**

### Condition 3
- **Precision**: 5 - Technically excellent. Detailed correct information throughout.
- **Completeness**: 5 - Comprehensive coverage. ws-003 has upgrade-level auth with noServer, three auth approaches, token expiry handling with refresh protocol. All must_mention items covered.
- **Actionability**: 5 - Production-grade code examples. Includes monitoring, Redis Lua scripts.
- **Structure**: 5 - Exceptional organization with clear section separation, summary tables, technology recommendation tables.
- **Efficiency**: 3.5 - Significantly longer than needed. Some verbose explanations of basics.
- **Depth**: 5 - Deep coverage of backpressure, slow consumers, distributed rate limiting with Lua scripts.
- **Composite**: (5x2 + 5x1.5 + 5 + 5 + 3.5 + 5) / 7.5 = **4.77**

### Condition 4
- **Precision**: 5 - Accurate throughout. Correct details on all protocols and configurations.
- **Completeness**: 5 - Thorough coverage of all must_mention items. ws-003 has three approaches plus ticket exchange. Mentions Sec-WebSocket-Protocol header approach (unique). Token expiry covered.
- **Actionability**: 5 - Excellent code examples with specific configs for nginx, HAProxy, AWS ALB.
- **Structure**: 5 - Clean organization with comparison tables. Decision tree for violation handling in ws-005.
- **Efficiency**: 3.5 - Very long output. Multiple approaches per task create length.
- **Depth**: 5 - Outstanding depth. Covers hybrid rate limiting (local + Redis), client-side rate limiting, flow control signals.
- **Composite**: (5x2 + 5x1.5 + 5 + 5 + 3.5 + 5) / 7.5 = **4.77**

### Condition 5
- **Precision**: 5 - Highly accurate. Good details on connection management and fan-out calculations.
- **Completeness**: 5 - All must_mention items covered. ws-003 has three approaches plus ticket/nonce exchange via Redis. Token expiry with re-auth timeout.
- **Actionability**: 5 - Complete code with upgrade handler, Redis-backed ticket validation, rate limiting.
- **Structure**: 5 - Excellent formatting with tables, diagrams, and summary sections.
- **Efficiency**: 3.5 - Lengthy. Includes details beyond what's needed.
- **Depth**: 5 - Exceptional. WAL for persistence, capacity estimates with concrete numbers, monitoring metrics.
- **Composite**: (5x2 + 5x1.5 + 5 + 5 + 3.5 + 5) / 7.5 = **4.77**

### Condition 22
- **Precision**: 5 - Accurate throughout. Correct nginx, ALB, HAProxy configs.
- **Completeness**: 5 - All must_mention items present. Good coverage of token expiry mid-connection. ws-004 mentions Kubernetes deployment.
- **Actionability**: 5 - Working code examples. Includes Socket.IO-specific middleware patterns.
- **Structure**: 4 - Well-organized but uses Socket.IO examples mixed with raw WS, which may confuse.
- **Efficiency**: 3 - Very long, particularly ws-001 with extensive Socket.IO implementation code. Task 3 uses Socket.IO auth middleware instead of raw WS handshake (less aligned with ground truth "during upgrade handshake").
- **Depth**: 4 - Good depth but ws-003 doesn't mention URL logging security concern explicitly enough. Task 3 focuses on Socket.IO-style auth rather than upgrade handshake.
- **Composite**: (5x2 + 5x1.5 + 5 + 4 + 3 + 4) / 7.5 = **4.43**

### Condition 33
- **Precision**: 4.5 - Mostly accurate. Uses TypeScript examples with some interface-heavy code. OT implementation is simplified.
- **Completeness**: 4.5 - Covers most must_mention items. ws-003 is less detailed on security concerns (URL logging mentioned but briefly). Token expiry covered. Redis pub/sub and sticky sessions present.
- **Actionability**: 4 - Code examples are TypeScript and more abstract/class-based, requiring more adaptation.
- **Structure**: 4.5 - Well-organized with tables and diagrams. TypeScript adds visual noise.
- **Efficiency**: 3 - Very lengthy with extensive class implementations.
- **Depth**: 4 - Good depth on OT implementation details. Rate limiting section is less thorough than top conditions.
- **Composite**: (4.5x2 + 4.5x1.5 + 4 + 4.5 + 3 + 4) / 7.5 = **4.17**

### Condition 44
- **Precision**: 4.5 - Generally accurate. Some minor issues: nginx timeout of 7d is extreme rather than standard 3600s.
- **Completeness**: 4.5 - Covers most must_mention items. ws-003 mentions query param, first-message auth, and cookies. Token expiry covered. However ws-002 client-side code has incorrect `ws.on('ping')` for browser API (browsers don't expose ping events).
- **Actionability**: 4.5 - Code examples mostly work but the browser ping/pong error reduces reliability.
- **Structure**: 4 - Organized but dense. Quick reference table at end is helpful.
- **Efficiency**: 3 - Very long. Multiple solutions per task adds bulk.
- **Depth**: 4 - Good depth. Sliding window alternative for rate limiting. MQTT alternative for scaling is unique but questionable.
- **Composite**: (4.5x2 + 4.5x1.5 + 4.5 + 4 + 3 + 4) / 7.5 = **4.17**

### Condition 111
- **Precision**: 4.5 - Generally accurate but more class-heavy implementation. Some redundancy in code patterns.
- **Completeness**: 4.5 - Covers must_mention items. Includes presence management, security measures, rate limiting. However some tasks run together due to length.
- **Actionability**: 4 - Code is implementation-heavy but requires more assembly.
- **Structure**: 4 - Organized with tables and diagrams. Very code-heavy.
- **Efficiency**: 3 - Extremely long. Extensive class implementations for document management.
- **Depth**: 4 - Good depth on document session management and presence. Rate limiting included inline.
- **Composite**: (4.5x2 + 4.5x1.5 + 4 + 4 + 3 + 4) / 7.5 = **4.10**

### Condition 222
- **Precision**: 5 - Accurate throughout. Clean, correct implementations.
- **Completeness**: 5 - All must_mention items covered. ws-003 has upgrade-level validation, URL security concerns with short-lived tickets, token expiry. ws-005 has per-user vs per-connection discussion.
- **Actionability**: 5 - Production-quality code examples. Includes AWS CLI commands.
- **Structure**: 5 - Excellent organization. Clear headings, diagnosis checklist for ws-002, comparison tables.
- **Efficiency**: 3.5 - Long but well-justified. Each section adds value.
- **Depth**: 5 - Deep coverage. OS-level TCP keepalive, tcpdump diagnosis, close code conventions.
- **Composite**: (5x2 + 5x1.5 + 5 + 5 + 3.5 + 5) / 7.5 = **4.77**

### Condition 333
- **Precision**: 4.5 - Generally accurate. TypeScript examples are correct.
- **Completeness**: 4.5 - Covers most items. Some tasks are less thorough on specific config examples.
- **Actionability**: 4 - TypeScript class-based code requires more context to use.
- **Structure**: 4.5 - Well-organized with tables and code blocks.
- **Efficiency**: 3 - Very lengthy TypeScript implementations.
- **Depth**: 4 - Good depth on OT implementation. Operation batching is well-covered.
- **Composite**: (4.5x2 + 4.5x1.5 + 4 + 4.5 + 3 + 4) / 7.5 = **4.17**

### Condition 444
- **Precision**: 4.5 - Mostly accurate. Some simplified examples (mock database in auth).
- **Completeness**: 4 - Covers core items but ws-003 is lighter on security (URL logging mentioned briefly). Token expiry less detailed. ws-001 missing explicit message ordering discussion.
- **Actionability**: 4 - Code works but uses simplified patterns (in-memory arrays).
- **Structure**: 4 - Organized. Architecture diagram for ws-001 is good.
- **Efficiency**: 3.5 - Long but less verbose than some others.
- **Depth**: 3.5 - Less depth than top conditions. Rate limiting implementation is simpler (fixed window rather than proper token bucket).
- **Composite**: (4.5x2 + 4x1.5 + 4 + 4 + 3.5 + 3.5) / 7.5 = **4.00**

---

## Summary

| Condition | Precision | Completeness | Actionability | Structure | Efficiency | Depth | Composite |
|-----------|-----------|-------------|---------------|-----------|------------|-------|-----------|
| 1         | 5.0       | 4.5         | 5.0           | 4.5       | 5.0        | 4.0   | 4.70      |
| 2         | 5.0       | 5.0         | 5.0           | 4.5       | 4.5        | 5.0   | 4.87      |
| 3         | 5.0       | 5.0         | 5.0           | 5.0       | 3.5        | 5.0   | 4.77      |
| 4         | 5.0       | 5.0         | 5.0           | 5.0       | 3.5        | 5.0   | 4.77      |
| 5         | 5.0       | 5.0         | 5.0           | 5.0       | 3.5        | 5.0   | 4.77      |
| 22        | 5.0       | 5.0         | 5.0           | 4.0       | 3.0        | 4.0   | 4.43      |
| 33        | 4.5       | 4.5         | 4.0           | 4.5       | 3.0        | 4.0   | 4.17      |
| 44        | 4.5       | 4.5         | 4.5           | 4.0       | 3.0        | 4.0   | 4.17      |
| 111       | 4.5       | 4.5         | 4.0           | 4.0       | 3.0        | 4.0   | 4.10      |
| 222       | 5.0       | 5.0         | 5.0           | 5.0       | 3.5        | 5.0   | 4.77      |
| 333       | 4.5       | 4.5         | 4.0           | 4.5       | 3.0        | 4.0   | 4.17      |
| 444       | 4.5       | 4.0         | 4.0           | 4.0       | 3.5        | 3.5   | 4.00      |

### Key Observations

1. **Top performers (1, 2, 3, 4, 5, 222)**: All achieve near-perfect precision and completeness. The differences are mainly in efficiency (length) and depth.
2. **Condition 1** stands out for exceptional efficiency -- covers everything in the most concise format.
3. **Condition 2** is the best overall, balancing completeness with depth (distributed rate limiting, Redis sliding window).
4. **Conditions 3, 4, 5, 222** are nearly tied -- all excellent but longer than necessary.
5. **Middle tier (22, 33, 44, 111, 333)**: These conditions tend to be verbose, use more framework-specific (Socket.IO, TypeScript class-heavy) patterns, and occasionally miss nuances in the ground truth.
6. **Condition 444** is weakest overall, with simpler implementations and less depth on security concerns.
7. **No condition fails a must_not requirement** -- none suggest rewriting Socket.IO in a different framework first, and all provide implementation details rather than just "add keepalive."
8. **The spread is narrow** (4.00 to 4.87), indicating all conditions produce competent websocket engineering output regardless of agent configuration.
