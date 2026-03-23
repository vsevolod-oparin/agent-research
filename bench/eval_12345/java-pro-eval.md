# java-pro Evaluation

## Ground Truth Summary

Five tasks: Java 8-to-21 migration (streams, records, pattern matching), Spring Boot 3 startup optimization, Resilience4j retry/circuit breaker, ConcurrentHashMap memory leak diagnosis, and Spring Batch 1M-record processing.

## Scoring Dimensions (1-5)

- **Precision**: Correctness of claims and code; absence of errors
- **Completeness**: Coverage of must_mention items; nothing critical missing
- **Actionability**: Can a developer directly use this output?
- **Structure**: Organization, formatting, before/after comparisons
- **Efficiency**: Conciseness without sacrificing quality; no filler
- **Depth**: Expert-level insight beyond surface recommendations

---

## Per-Condition Evaluations

### Condition 1

**Task-level notes:**
- jp-001: Stream API, findFirst, mentions mapMulti/records but no explicit pattern matching with instanceof. Missing record class suggestion in main code (mentioned as aside). 3/4 must_mention.
- jp-002: Lazy init, GraalVM, AOT mentioned, component scanning narrowed, Hibernate tuning present. Missing explicit @PostConstruct check. 5/6 must_mention.
- jp-003: Resilience4j (not Hystrix), programmatic config with exponential backoff, circuit breaker threshold, slidingWindowSize, fallback via Try. Missing @Retry annotation approach. 4/5 must_mention.
- jp-004: Heap dump (jmap), ConcurrentHashMap unbounded growth, Caffeine fix, OOM heap dump flag. Missing explicit GC log analysis mention. 4/5 must_mention.
- jp-005: Spring Batch, reader-processor-writer, chunk(1000), JobRepository resume, skip policy. All 5/5 must_mention.

| Dimension | Score |
|-----------|-------|
| Precision | 5 |
| Completeness | 4 |
| Actionability | 4 |
| Structure | 4 |
| Efficiency | 5 |
| Depth | 4 |
| **Composite** | **4.33** |

### Condition 2

**Task-level notes:**
- jp-001: Stream API, findFirst, toList(), record class shown. No explicit pattern matching with instanceof. 3/4 must_mention.
- jp-002: Lazy init, GraalVM native image, AOT, narrowed scanning, Hibernate tuning. No explicit @PostConstruct mention. 5/6 must_mention.
- jp-003: Resilience4j with both annotation and YAML config, @Retry, @CircuitBreaker, specific config values, fallback method. All 5/5 must_mention.
- jp-004: Heap dump (jmap, MAT), ConcurrentHashMap unbounded, Caffeine, OOM flag, GC logging. All 5/5 must_mention.
- jp-005: Spring Batch, reader-processor-writer, chunk(1000), JobRepository resume, skip policy with Spring Batch 3.x API. All 5/5 must_mention.

| Dimension | Score |
|-----------|-------|
| Precision | 5 |
| Completeness | 5 |
| Actionability | 5 |
| Structure | 5 |
| Efficiency | 4 |
| Depth | 5 |
| **Composite** | **4.87** |

### Condition 3

**Task-level notes:**
- jp-001: Stream API, findFirst, record class with accessors, pattern matching with instanceof shown, mapMulti variant. All 4/4 must_mention.
- jp-002: Very thorough (8 sections), lazy init, narrow scanning, GraalVM, AOT, Hibernate tuning, auto-config exclusion. Missing @PostConstruct mention. 5/6 must_mention. Impact table included.
- jp-003: Resilience4j, @Retry, @CircuitBreaker, full YAML config, programmatic alternative, observability. Explicit Hystrix deprecation note. All 5/5 must_mention.
- jp-004: Comprehensive 4-phase approach. Heap dump (jmap, jcmd, MAT), ConcurrentHashMap root cause, Caffeine with multiple options, OOM flag, GC logging, ArchUnit test. All 5/5 must_mention.
- jp-005: Spring Batch, reader-processor-writer, chunk(1000), JobRepository, skip policy, partitioning, listeners, performance sizing. All 5/5 must_mention.

| Dimension | Score |
|-----------|-------|
| Precision | 5 |
| Completeness | 5 |
| Actionability | 5 |
| Structure | 5 |
| Efficiency | 3 |
| Depth | 5 |
| **Composite** | **4.73** |

### Condition 4

Identical to Condition 3 (same content observed).

| Dimension | Score |
|-----------|-------|
| Precision | 5 |
| Completeness | 5 |
| Actionability | 5 |
| Structure | 5 |
| Efficiency | 3 |
| Depth | 5 |
| **Composite** | **4.73** |

### Condition 5

**Task-level notes:**
- jp-001: Stream API, findFirst, record class, pattern matching with instanceof, sealed class mention. Good before/after with original shown. All 4/4 must_mention.
- jp-002: Profile first, lazy init, GraalVM, AOT, component scanning, Hibernate tuning, connection pool, auto-config exclusion, component index. Missing @PostConstruct. 5/6 must_mention. Very thorough.
- jp-003: Resilience4j, @Retry/@CircuitBreaker annotations, YAML config, programmatic alternative, non-retryable exception handling, observability, event monitoring. All 5/5 must_mention.
- jp-004: 4-phase approach, heap dump (jmap, jcmd, MAT), ConcurrentHashMap root cause with multiple patterns, Caffeine fix, Spring Cache, Redis option, scheduled eviction stopgap, OOM flags, GC logging, Micrometer. All 5/5 must_mention.
- jp-005: Spring Batch, reader-processor-writer, chunk(1000), JobRepository resume, skip policy, both JPA and JDBC readers, upsert writer, partitioning, listeners, performance config. All 5/5 must_mention.

| Dimension | Score |
|-----------|-------|
| Precision | 5 |
| Completeness | 5 |
| Actionability | 5 |
| Structure | 5 |
| Efficiency | 3 |
| Depth | 5 |
| **Composite** | **4.73** |

### Condition 22

**Task-level notes:**
- jp-001: Stream, findFirst, record, no explicit pattern matching. 3/4 must_mention.
- jp-002: Lazy init, GraalVM, AOT, narrowed scanning, Hibernate tuning, auto-config exclusion. No @PostConstruct. 5/6 must_mention.
- jp-003: Resilience4j, @Retry/@CircuitBreaker, YAML config, specific values, fallback. All 5/5 must_mention.
- jp-004: Heap dump, ConcurrentHashMap, Caffeine, OOM flag, GC logging. All 5/5 must_mention.
- jp-005: Spring Batch, chunk processing, JobRepository, skip policy, partitioning. All 5/5 must_mention.

| Dimension | Score |
|-----------|-------|
| Precision | 5 |
| Completeness | 4 |
| Actionability | 5 |
| Structure | 4 |
| Efficiency | 4 |
| Depth | 4 |
| **Composite** | **4.40** |

### Condition 33

**Task-level notes:**
- jp-001: Stream, findFirst, record, Predicate composition. No explicit pattern matching with instanceof. 3/4 must_mention.
- jp-002: Profile, narrow scanning, lazy init, Hibernate tuning, GraalVM/AOT, auto-config exclusion, @Import, parallel init. No @PostConstruct. 5/6. Summary table included.
- jp-003: Resilience4j, @Retry/@CircuitBreaker, YAML config, specific values, fallback, programmatic alternative, event listeners. All 5/5 must_mention.
- jp-004: Heap dump (jmap, jcmd, MAT), GC logging, multiple root cause patterns, Caffeine, Spring Cache, Kafka batch listener, ClassLoader leak. All 5/5 must_mention. Very thorough.
- jp-005: Both custom implementation AND Spring Batch. Keyset pagination, dead-letter table, bulk upsert, parallel virtual threads. All 5/5 must_mention. Decision table included.

| Dimension | Score |
|-----------|-------|
| Precision | 5 |
| Completeness | 5 |
| Actionability | 5 |
| Structure | 5 |
| Efficiency | 3 |
| Depth | 5 |
| **Composite** | **4.73** |

### Condition 44

Identical to Conditions 3/4 (same content pattern).

| Dimension | Score |
|-----------|-------|
| Precision | 5 |
| Completeness | 5 |
| Actionability | 5 |
| Structure | 5 |
| Efficiency | 3 |
| Depth | 5 |
| **Composite** | **4.73** |

### Condition 111

**Task-level notes:**
- jp-001: Stream, findFirst, record, sealed class, pattern matching for switch mention but example is switch on name length (not instanceof). 3/4 must_mention.
- jp-002: Lazy init, auto-config exclusion, AOT/GraalVM, component scanning, Hibernate tuning (minimal). No @PostConstruct. 4/6 must_mention. Less thorough than others.
- jp-003: Resilience4j, programmatic + annotation approaches, specific config values, fallback. Uses RestTemplate (older). All 5/5 must_mention. Test included.
- jp-004: Heap dump, ConcurrentHashMap, Caffeine/Guava, JVM flags. Mentions Kafka consumer not closing but reasoning is weak. GC logging minimal. 4/5 must_mention.
- jp-005: Custom implementation primary, Spring Batch as alternative. Manual JDBC loop with per-record retry. Violates must_not: "suggest manual JDBC loop without batching" -- the custom approach IS a manual loop (though it does batch at 1000 records, the writeWithRetry does single inserts). Spring Batch version is secondary and less detailed.

| Dimension | Score |
|-----------|-------|
| Precision | 4 |
| Completeness | 3 |
| Actionability | 4 |
| Structure | 3 |
| Efficiency | 3 |
| Depth | 3 |
| **Composite** | **3.40** |

### Condition 222

**Task-level notes:**
- jp-001: Stream, findFirst, record, pattern matching mentioned but no concrete example. Method references used. 3/4 must_mention.
- jp-002: Lazy init, GraalVM/AOT, component scanning, Hibernate tuning, virtual threads, connection pool, auto-config exclusion, parallel init. No @PostConstruct. Impact table. 5/6 must_mention. Very thorough.
- jp-003: Resilience4j, @Retry/@CircuitBreaker, YAML config, programmatic alternative, specific values, fallback, observability. All 5/5 must_mention.
- jp-004: Heap dump (jmap, jcmd, MAT), ConcurrentHashMap, Caffeine, OOM flags, GC logging, multiple root cause patterns, Kafka offset handling, scheduled eviction. All 5/5 must_mention.
- jp-005: Spring Batch, chunk processing, JobRepository resume, skip/retry policy, partitioning, both JPA and JDBC readers, upsert writer, launcher, performance config. All 5/5 must_mention.

| Dimension | Score |
|-----------|-------|
| Precision | 5 |
| Completeness | 5 |
| Actionability | 5 |
| Structure | 5 |
| Efficiency | 3 |
| Depth | 5 |
| **Composite** | **4.73** |

### Condition 333

**Task-level notes:**
- jp-001: Stream, findFirst, record, method references. Pattern matching not demonstrated. 3/4 must_mention.
- jp-002: Lazy init, GraalVM, AOT, component scanning, Hibernate tuning, auto-config, @Import. No @PostConstruct. 5/6 must_mention.
- jp-003: Resilience4j, @Retry/@CircuitBreaker, YAML config, specific values, fallback, programmatic alternative. All 5/5 must_mention.
- jp-004: Heap dump, ConcurrentHashMap, Caffeine, OOM flags, GC logging, multiple root causes, Kafka config. All 5/5 must_mention.
- jp-005: Spring Batch, chunk(1000), JobRepository resume, skip/retry, partitioning, upsert, launcher. All 5/5 must_mention.

| Dimension | Score |
|-----------|-------|
| Precision | 5 |
| Completeness | 4 |
| Actionability | 5 |
| Structure | 5 |
| Efficiency | 4 |
| Depth | 5 |
| **Composite** | **4.60** |

### Condition 444

**Task-level notes:**
- jp-001: Stream, findFirst, record, method references. No pattern matching with instanceof. 3/4 must_mention. Concise.
- jp-002: Lazy init, auto-config, AOT (wrong artifact -- spring-aot experimental is outdated), component scanning, Hibernate tuning (minimal), virtual threads. No @PostConstruct, no GraalVM native image command. 4/6 must_mention. Less detailed than peers.
- jp-003: Resilience4j, programmatic config, annotation config, specific values, fallback. All 5/5 must_mention. But less structured.
- jp-004: Heap dump, ConcurrentHashMap, Caffeine, OOM flag, GC logging. 4/5 must_mention. Kafka consumer "not closing" is a red herring. Mentions Guava (less modern).
- jp-005: Custom implementation primary, Spring Batch secondary. Manual per-record loop with Thread.sleep retry -- violates must_not "suggest manual JDBC loop without batching" (the writeWithRetry does per-record inserts). No skip policy in custom version.

| Dimension | Score |
|-----------|-------|
| Precision | 3 |
| Completeness | 3 |
| Actionability | 3 |
| Structure | 3 |
| Efficiency | 4 |
| Depth | 2 |
| **Composite** | **3.00** |

---

## Summary Table

| Condition | Precision | Completeness | Actionability | Structure | Efficiency | Depth | Composite |
|-----------|-----------|--------------|---------------|-----------|------------|-------|-----------|
| 1 | 5 | 4 | 4 | 4 | 5 | 4 | 4.33 |
| 2 | 5 | 5 | 5 | 5 | 4 | 5 | 4.87 |
| 3 | 5 | 5 | 5 | 5 | 3 | 5 | 4.73 |
| 4 | 5 | 5 | 5 | 5 | 3 | 5 | 4.73 |
| 5 | 5 | 5 | 5 | 5 | 3 | 5 | 4.73 |
| 22 | 5 | 4 | 5 | 4 | 4 | 4 | 4.40 |
| 33 | 5 | 5 | 5 | 5 | 3 | 5 | 4.73 |
| 44 | 5 | 5 | 5 | 5 | 3 | 5 | 4.73 |
| 111 | 4 | 3 | 4 | 3 | 3 | 3 | 3.40 |
| 222 | 5 | 5 | 5 | 5 | 3 | 5 | 4.73 |
| 333 | 5 | 4 | 5 | 5 | 4 | 5 | 4.60 |
| 444 | 3 | 3 | 3 | 3 | 4 | 2 | 3.00 |

## Key Observations

1. **Conditions 2-5, 33, 44, 222** are the top tier (composite 4.73-4.87), with condition 2 being the best overall. These consistently hit all must_mention items across all 5 tasks, with correct code, proper structure, and expert-level depth.

2. **Condition 1** is slightly behind (4.33) due to using only programmatic Resilience4j config (no annotation example) and lighter structure.

3. **Conditions 111 and 444** are notably weaker (3.00-3.40). Both use the wrong artifact for AOT, provide custom manual JDBC loops as primary approach for Task 5 (violating must_not), and show less depth across all tasks. This suggests these conditions degrade output quality.

4. **Pattern matching with instanceof** (jp-001 must_mention) is the most commonly missed item -- only conditions 3, 4, 5, 44 demonstrate it explicitly.

5. **@PostConstruct check** (jp-002 must_mention) is missed by every single condition, suggesting this is either a very specialized recommendation or the models uniformly overlook it.
