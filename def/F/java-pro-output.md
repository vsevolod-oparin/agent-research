## Task 1

Migrated to Java 21 idioms using streams, records, and pattern matching:

```java
// If User is a simple data carrier, consider defining it as a record:
// record User(String name, int age, boolean active) {}

List<String> names = users.stream()
        .filter(user -> user.getAge() > 18 && user.isActive())
        .map(user -> user.getName().toUpperCase())
        .toList(); // unmodifiable list — no need for Collectors.toList()

Optional<String> result = names.stream().findFirst();
```

Key changes:

- **`Stream` pipeline** replaces the imperative loop with a declarative filter-map chain.
- **`.toList()`** (Java 16+) produces an unmodifiable list, replacing `Collectors.toList()` and the manual `ArrayList`.
- **`findFirst()`** returns `Optional<String>` directly, eliminating the ternary conditional.

If you want to go further and the `User` class is purely a data carrier, model it as a **record**:

```java
public record User(String name, int age, boolean active) {}
```

This gives you immutable fields, `equals`, `hashCode`, `toString`, and a canonical constructor for free. The stream then becomes:

```java
List<String> names = users.stream()
        .filter(u -> u.age() > 18 && u.active())  // accessor methods, no get- prefix
        .map(u -> u.name().toUpperCase())
        .toList();

Optional<String> result = names.stream().findFirst();
```

---

## Task 2

A 25-second startup with 200+ beans and 50 JPA entities has several attack vectors. Here is a layered approach, ordered from highest to lowest impact.

### 1. Switch to GraalVM Native Image (biggest win)

```xml
<plugin>
    <groupId>org.graalvm.buildtools</groupId>
    <artifactId>native-maven-plugin</artifactId>
</plugin>
```

This eliminates JIT warmup and classpath scanning entirely. Typical startup drops from 25 seconds to under 1 second. If native image is not feasible, apply everything below.

### 2. Enable Spring AOT (Ahead-of-Time) Processing

Even without native image, AOT pre-computes bean definitions at build time:

```properties
# application.properties
spring.aot.enabled=true
```

Build with `mvn spring-boot:build-image` or `mvn process-aot`. This eliminates runtime reflection and classpath scanning for bean registration.

### 3. Use Lazy Initialization

```properties
spring.main.lazy-initialization=true
```

Beans are created only on first access. This dramatically cuts startup time but shifts the cost to the first request. Mark critical beans as `@Lazy(false)` explicitly.

### 4. Narrow Component Scanning

Replace broad `@ComponentScan` with explicit base packages or, better, explicit `@Import` / `@Bean` definitions:

```java
@SpringBootApplication(scanBasePackages = "com.example.core")
// Instead of scanning the entire com.example tree
```

### 5. Optimize JPA / Hibernate Startup

This is often the single largest contributor in a 50-entity app:

```properties
# Disable DDL validation at startup
spring.jpa.hibernate.ddl-auto=none

# Defer Hibernate initialization (huge win)
spring.data.jpa.repositories.bootstrap-mode=lazy
spring.jpa.properties.hibernate.boot.allow_jdbc_metadata_access=false
```

### 6. Use Virtual Threads for Startup I/O

```properties
spring.threads.virtual.enabled=true
```

This helps when beans perform I/O during initialization (database connections, health checks, remote config fetching).

### 7. Use Spring Boot's CDS (Class Data Sharing)

```bash
# Training run
java -XX:ArchiveClassesAtExit=app-cds.jsa -jar app.jar
# Production run
java -XX:SharedArchiveFile=app-cds.jsa -jar app.jar
```

Reduces class loading time by 30-50%.

### 8. Profile the Startup to Find Outliers

```java
SpringApplication app = new SpringApplication(MyApp.class);
app.setApplicationStartup(new BufferingApplicationStartup(2048));
// Then GET /actuator/startup to see the slowest beans
```

This often reveals one or two beans consuming 80% of the total time.

**Expected combined impact**: From 25 seconds down to 3-5 seconds (JVM), or under 1 second (native image).

---

## Task 3

Use **Resilience4j** with Spring Boot 3 for both retry with exponential backoff and circuit breaker.

### Dependencies

```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-spring-boot3</artifactId>
    <version>2.2.0</version>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

### Configuration

```yaml
resilience4j:
  retry:
    instances:
      externalApi:
        max-attempts: 3
        wait-duration: 500ms
        enable-exponential-backoff: true
        exponential-backoff-multiplier: 2.0
        retry-exceptions:
          - java.io.IOException
          - java.util.concurrent.TimeoutException
          - org.springframework.web.client.HttpServerErrorException

  circuitbreaker:
    instances:
      externalApi:
        sliding-window-type: COUNT_BASED
        sliding-window-size: 10
        failure-rate-threshold: 50
        wait-duration-in-open-state: 30s
        permitted-number-of-calls-in-half-open-state: 3
        automatic-transition-from-open-to-half-open-enabled: true
```

### Service Implementation

```java
@Service
public class ExternalApiClient {

    private final RestClient restClient;

    public ExternalApiClient(RestClient.Builder builder) {
        this.restClient = builder
                .baseUrl("https://api.external-service.com")
                .requestFactory(clientHttpRequestFactory())
                .build();
    }

    @CircuitBreaker(name = "externalApi", fallbackMethod = "fallback")
    @Retry(name = "externalApi")
    public ApiResponse callApi(ApiRequest request) {
        return restClient.post()
                .uri("/endpoint")
                .body(request)
                .retrieve()
                .body(ApiResponse.class);
    }

    private ApiResponse fallback(ApiRequest request, Throwable ex) {
        return new ApiResponse("SERVICE_DEGRADED", "External API unavailable: " + ex.getMessage());
    }

    private ClientHttpRequestFactory clientHttpRequestFactory() {
        var factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(5));
        factory.setReadTimeout(Duration.ofSeconds(10));
        return factory;
    }
}
```

**Important ordering note**: The `@CircuitBreaker` annotation must be declared *before* `@Retry` so that the circuit breaker wraps the retry logic. If the circuit is open, retries are never attempted -- calls fail fast immediately.

---

## Task 4

### Diagnosis

The pattern -- ConcurrentHashMap growing unboundedly over 24 hours while processing Kafka messages -- is a classic unbounded cache leak.

**Step 1: Confirm the suspect with a heap dump.**

```bash
java -XX:+HeapDumpOnOutOfMemoryException -XX:HeapDumpPath=/tmp/heapdump.hprof -jar app.jar
# Or on-demand:
jcmd <pid> GC.heap_dump /tmp/heapdump.hprof
```

Open in Eclipse MAT or VisualVM. Sort by retained size. You will almost certainly see the `ConcurrentHashMap` dominating the heap with millions of entries.

**Step 2: Identify what is being cached and never evicted.**

### Root Cause

The `ConcurrentHashMap` is used as a cache but has no eviction policy. Every processed Kafka message inserts an entry, but nothing ever removes entries. Over 24 hours, millions of entries accumulate until the heap is exhausted.

### Fix

Replace the raw `ConcurrentHashMap` with **Caffeine**, a bounded, high-performance cache:

```java
// BEFORE — unbounded, will leak
private final Map<String, ProcessedResult> cache = new ConcurrentHashMap<>();

// AFTER — bounded with eviction
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

private final Cache<String, ProcessedResult> cache = Caffeine.newBuilder()
        .maximumSize(50_000)
        .expireAfterWrite(Duration.ofMinutes(30))
        .expireAfterAccess(Duration.ofMinutes(10))
        .recordStats()
        .removalListener((key, value, cause) ->
            log.debug("Cache eviction: key={}, cause={}", key, cause))
        .build();
```

### Additional Safeguards

1. **Add cache metrics** to Prometheus/Grafana for monitoring size, hit rate, and eviction count.
2. **Add memory-pressure alerting** when heap usage exceeds 85% for 5+ minutes.
3. **Consider whether the cache is needed at all** -- if each Kafka message is processed exactly once and written to a database, an in-memory cache may be unnecessary.
4. **If deduplication is the concern**, use a bounded deduplication set or let the downstream database handle idempotency via upserts.

---

## Task 5

Use **Spring Batch** -- this is exactly the problem it was designed for: large-volume, resumable, chunk-oriented processing with fault tolerance.

### Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Source DB   │────>│  Spring Batch │────>│  Target DB  │
│ (1M records) │     │  Job/Step     │     │ (results)   │
└─────────────┘     └──────────────┘     └─────────────┘
                          │
                    ┌─────┴─────┐
                    │ JobRepository│  ← tracks progress for restartability
                    │  (metadata) │
                    └───────────┘
```

### Implementation

```java
@Configuration
@RequiredArgsConstructor
public class RecordProcessingJobConfig {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;

    @Bean
    public Job recordProcessingJob() {
        return new JobBuilder("recordProcessingJob", jobRepository)
                .start(processStep())
                .listener(jobCompletionListener())
                .build();
    }

    @Bean
    public Step processStep() {
        return new StepBuilder("processStep", jobRepository)
                .<SourceRecord, TargetRecord>chunk(500, transactionManager)
                .reader(jdbcReader())
                .processor(recordProcessor())
                .writer(jdbcWriter())
                .faultTolerant()
                .retryLimit(3)
                .retry(DeadlockLoserDataAccessException.class)
                .retry(TransientDataAccessException.class)
                .skipLimit(100)
                .skip(ValidationException.class)
                .listener(skipListener())
                .taskExecutor(taskExecutor())
                .throttleLimit(4)
                .build();
    }

    @Bean
    @StepScope
    public JdbcPagingItemReader<SourceRecord> jdbcReader() {
        return new JdbcPagingItemReaderBuilder<SourceRecord>()
                .name("sourceRecordReader")
                .dataSource(sourceDataSource)
                .selectClause("SELECT id, data, created_at")
                .fromClause("FROM source_records")
                .sortKeys(Map.of("id", Order.ASCENDING))
                .pageSize(500)
                .rowMapper((rs, rowNum) -> new SourceRecord(
                        rs.getLong("id"),
                        rs.getString("data"),
                        rs.getTimestamp("created_at").toLocalDateTime()))
                .build();
    }

    @Bean
    public JdbcBatchItemWriter<TargetRecord> jdbcWriter() {
        return new JdbcBatchItemWriterBuilder<TargetRecord>()
                .dataSource(targetDataSource)
                .sql("""
                    INSERT INTO target_records (id, transformed_data, processed_at)
                    VALUES (:id, :transformedData, :processedAt)
                    ON CONFLICT (id) DO UPDATE SET
                        transformed_data = EXCLUDED.transformed_data,
                        processed_at = EXCLUDED.processed_at
                    """)
                .beanMapped()
                .build();
    }
}
```

### Restartability

Spring Batch handles this automatically via the `JobRepository`. If the job fails at record 600,000, simply relaunch the same job -- it resumes from the last committed chunk. The `JdbcPagingItemReader` with sort keys and chunk-based commits means the framework knows exactly which page to resume from.

### Key Design Decisions

| Concern | Solution |
|---|---|
| **Chunk size** | 500 records per transaction -- balances throughput vs. memory |
| **Restartability** | `JdbcPagingItemReader` with ascending sort key + `JobRepository` metadata |
| **Transient failures** | Retry up to 3 times for deadlocks and transient DB errors |
| **Bad data** | Skip up to 100 validation failures, log to dead-letter table |
| **Idempotency** | `ON CONFLICT DO UPDATE` (upsert) in the writer ensures safe re-runs |
| **Parallelism** | Virtual thread task executor with throttle limit of 4 |

For volumes significantly beyond 1 million (e.g., 100M+), consider **partitioned steps** where the source table is split by ID range and each partition runs as an independent step execution.
