## Task 1: Migrate Java 8 Code to Java 21 Idioms

### Original Code (Java 8)

```java
List<String> names = new ArrayList<>();
for (User user : users) {
    if (user.getAge() > 18 && user.isActive()) {
        names.add(user.getName().toUpperCase());
    }
}
Optional<String> result = names.isEmpty() ? Optional.empty() : Optional.of(names.get(0));
```

### Migrated Code (Java 21)

**Step 1 -- Replace User POJO with a Record (if User is an immutable data carrier):**

```java
public record User(String name, int age, boolean active) {}
```

Records provide built-in `equals`, `hashCode`, `toString`, and accessor methods without boilerplate. The accessor names change from `getAge()` to `age()` and `isActive()` to `active()`. If User is a JPA entity or mutable object, keep the class but update the consuming code below.

**Step 2 -- Rewrite the logic with Streams and modern idioms:**

```java
// Using var for local variable type inference, Stream API, and Optional chaining.
// If User is a record, accessors are age() and active() instead of getAge()/isActive().
var names = users.stream()
        .filter(user -> user.getAge() > 18 && user.isActive())
        .map(user -> user.getName().toUpperCase())
        .toList();  // Java 16+ unmodifiable list -- no need for Collectors.toList()

var result = names.stream().findFirst();  // Returns Optional<String> directly
```

**Step 3 -- If only the first match is needed, avoid collecting entirely:**

```java
var result = users.stream()
        .filter(user -> user.getAge() > 18 && user.isActive())
        .map(user -> user.getName().toUpperCase())
        .findFirst();
```

This is the most idiomatic Java 21 form. It is lazy -- it stops processing as soon as the first matching element is found.

### Key Improvements

| Aspect | Java 8 Style | Java 21 Style |
|--------|--------------|----------------|
| Collection type | Mutable `ArrayList` | Unmodifiable list via `.toList()` |
| Loop construct | Imperative `for` + `if` | Declarative `stream().filter().map()` |
| Optional creation | Manual ternary check | `findFirst()` returns `Optional` natively |
| Type declarations | Explicit `List<String>` | `var` for local type inference |
| Data class | POJO with getters/setters | `record` for immutable data |

### Additional Notes

- If the `names` list is needed elsewhere (not just the first element), keep the two-step form with `.toList()` and `.stream().findFirst()`.
- The `.toList()` method returns an unmodifiable list. If mutation is required downstream, use `.collect(Collectors.toCollection(ArrayList::new))` instead.
- Pattern matching with `instanceof` and sealed classes are not applicable to this particular snippet but would be the next idioms to adopt for type-checking logic elsewhere in the codebase.

---

## Task 2: Reducing Spring Boot 3 Startup Time (25 Seconds)

A 25-second startup with 200+ beans, 50 JPA entities, and component scanning indicates multiple compounding bottlenecks. Here is a systematic approach ordered by impact.

### 1. Enable Lazy Initialization (Immediate Win)

```yaml
# application.yml
spring:
  main:
    lazy-initialization: true
```

This defers bean creation until first use. Typical reduction: 30-50% of startup time. Beans critical at startup (event listeners, scheduled tasks) should be annotated with `@Lazy(false)` to exclude them.

### 2. Narrow Component Scanning Scope

Replace broad base-package scanning:

```java
// BEFORE -- scans everything
@SpringBootApplication
public class App { }

// AFTER -- restrict to specific packages
@SpringBootApplication(scanBasePackages = {
    "com.example.api",
    "com.example.service",
    "com.example.config"
})
public class App { }
```

Alternatively, remove `@ComponentScan` entirely and use explicit `@Import` or `@Bean` methods in `@Configuration` classes for tighter control.

### 3. Optimize JPA/Hibernate Startup

JPA entity scanning and metadata building is a major contributor with 50 entities.

```yaml
spring:
  jpa:
    defer-datasource-initialization: true
    properties:
      hibernate:
        # Disable automatic DDL -- use Flyway/Liquibase instead
        hbm2ddl.auto: none
        # Build metadata in parallel (Hibernate 6+)
        boot.allow_jdbc_metadata_access: false
        # Cache the metamodel
        mapping.precedence: class
    open-in-view: false  # Eliminates lazy-loading anti-pattern and reduces overhead
```

If using Flyway or Liquibase, ensure `spring.jpa.hibernate.ddl-auto=none` so Hibernate does not redundantly validate the schema at startup.

### 4. Use Spring AOT (Ahead-of-Time) Processing

Spring Boot 3.x supports AOT processing that pre-computes bean definitions at build time:

```xml
<!-- Maven -->
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <executions>
        <execution>
            <id>process-aot</id>
            <goals>
                <goal>process-aot</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

Run with AOT-generated artifacts: `java -Dspring.aot.enabled=true -jar app.jar`

### 5. GraalVM Native Image (Most Aggressive)

For sub-second startup, compile to a native image:

```xml
<plugin>
    <groupId>org.graalvm.buildtools</groupId>
    <artifactId>native-maven-plugin</artifactId>
</plugin>
```

Build with `mvn -Pnative native:compile`. Typical result: startup drops from 25 seconds to under 1 second. Tradeoff: longer build times and potential reflection/proxy compatibility issues that require GraalVM hint configuration.

### 6. Profile and Eliminate Unnecessary Auto-Configurations

Identify what is being auto-configured:

```yaml
# application.yml
logging:
  level:
    org.springframework.boot.autoconfigure: DEBUG
```

Then exclude unnecessary ones:

```java
@SpringBootApplication(exclude = {
    DataSourceAutoConfiguration.class,       // if not using JDBC directly
    SecurityAutoConfiguration.class,         // if security is configured manually
    JmxAutoConfiguration.class,             // rarely needed
    WebSocketAutoConfiguration.class,       // if not using WebSockets
    MongoAutoConfiguration.class            // if not using MongoDB
})
```

### 7. Use Virtual Threads for Faster Bean Initialization

```yaml
spring:
  threads:
    virtual:
      enabled: true
```

This does not directly speed up bean creation, but it ensures that any I/O-bound initialization (database connections, external service health checks) does not block platform threads.

### 8. Application Startup Tracking

Measure what is actually slow before optimizing blindly:

```java
@SpringBootApplication
public class App {
    public static void main(String[] args) {
        var app = new SpringApplication(App.class);
        app.setApplicationStartup(new BufferingApplicationStartup(2048));
        app.run(args);
    }
}
```

Access `/actuator/startup` to see a detailed breakdown of every startup step and its duration. Target the slowest steps first.

### Expected Results

| Optimization | Estimated Reduction |
|--------------|-------------------|
| Lazy initialization | 8-12 seconds |
| Narrowed scanning | 2-4 seconds |
| JPA optimization | 3-5 seconds |
| Exclude unused auto-config | 2-3 seconds |
| Spring AOT | 3-5 seconds |
| GraalVM native image | Drops to < 1 second total |

Apply the first four items for a realistic reduction from 25 seconds to approximately 5-8 seconds without changing the deployment model. Add GraalVM for sub-second startup if the build pipeline supports it.

---

## Task 3: Retry with Exponential Backoff and Circuit Breaker

This implementation uses Resilience4j, which is the standard resilience library for Spring Boot 3 (Hystrix is deprecated).

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
# application.yml
resilience4j:
  retry:
    instances:
      externalApi:
        max-attempts: 3
        wait-duration: 500ms
        enable-exponential-backoff: true
        exponential-backoff-multiplier: 2.0
        # Retries: 500ms -> 1000ms -> 2000ms
        retry-exceptions:
          - java.io.IOException
          - java.net.SocketTimeoutException
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
        record-exceptions:
          - java.io.IOException
          - java.net.SocketTimeoutException
          - org.springframework.web.client.HttpServerErrorException
```

### Service Implementation

```java
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ExternalApiService {

    private static final Logger log = LoggerFactory.getLogger(ExternalApiService.class);
    private final RestClient restClient;

    public ExternalApiService(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder
                .baseUrl("https://api.external-service.com")
                .build();
    }

    // Circuit breaker wraps the retry -- if the circuit is open, retries are skipped entirely.
    // Order matters: @CircuitBreaker is evaluated first (outer), @Retry is evaluated second (inner).
    @CircuitBreaker(name = "externalApi", fallbackMethod = "fallback")
    @Retry(name = "externalApi")
    public ApiResponse callExternalApi(ApiRequest request) {
        log.info("Calling external API for request: {}", request.id());
        return restClient.post()
                .uri("/api/v1/resource")
                .body(request)
                .retrieve()
                .body(ApiResponse.class);
    }

    // Fallback is invoked when the circuit is open OR all retries are exhausted.
    private ApiResponse fallback(ApiRequest request, Throwable throwable) {
        log.warn("Fallback triggered for request {}: {}", request.id(), throwable.getMessage());
        return new ApiResponse(request.id(), "UNAVAILABLE", "Service temporarily unavailable");
    }
}
```

### Data Records

```java
public record ApiRequest(String id, String payload) {}
public record ApiResponse(String id, String status, String message) {}
```

### Programmatic Approach (Without Annotations)

For cases where annotation-based configuration is insufficient (for example, dynamic retry policies or per-request configuration):

```java
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.retry.Retry;
import io.github.resilience4j.retry.RetryConfig;

import java.io.IOException;
import java.time.Duration;
import java.util.function.Supplier;

@Service
public class ResilientApiClient {

    private final RestClient restClient;
    private final Retry retry;
    private final CircuitBreaker circuitBreaker;

    public ResilientApiClient(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder
                .baseUrl("https://api.external-service.com")
                .build();

        var retryConfig = RetryConfig.custom()
                .maxAttempts(3)
                .waitDuration(Duration.ofMillis(500))
                .enableExponentialBackoff()
                .retryExceptions(IOException.class)
                .build();
        this.retry = Retry.of("externalApi", retryConfig);

        var cbConfig = CircuitBreakerConfig.custom()
                .slidingWindowSize(10)
                .failureRateThreshold(50f)
                .waitDurationInOpenState(Duration.ofSeconds(30))
                .permittedNumberOfCallsInHalfOpenState(3)
                .recordExceptions(IOException.class)
                .build();
        this.circuitBreaker = CircuitBreaker.of("externalApi", cbConfig);
    }

    public ApiResponse callApi(ApiRequest request) {
        Supplier<ApiResponse> supplier = () -> restClient.post()
                .uri("/api/v1/resource")
                .body(request)
                .retrieve()
                .body(ApiResponse.class);

        Supplier<ApiResponse> retryingSupplier = Retry.decorateSupplier(retry, supplier);
        Supplier<ApiResponse> resilientSupplier = CircuitBreaker.decorateSupplier(
                circuitBreaker, retryingSupplier);

        return resilientSupplier.get();
    }
}
```

### Monitoring

Resilience4j integrates with Micrometer out of the box. Add the actuator dependency and the following to expose circuit breaker and retry metrics:

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,circuitbreakers,retries,metrics
  health:
    circuitbreakers:
      enabled: true
```

Access `/actuator/circuitbreakers` to see the current state (CLOSED, OPEN, HALF_OPEN) and `/actuator/metrics/resilience4j.retry.calls` for retry statistics.

---

## Task 4: Diagnosing and Fixing ConcurrentHashMap Memory Leak

### Diagnosis

The symptoms -- linear heap growth over 24 hours with eventual OOM -- combined with a `ConcurrentHashMap` cache strongly suggest entries are being added but never evicted. This is the single most common memory leak pattern in Java applications.

### Step 1: Confirm the Hypothesis

**Heap dump analysis:**

```bash
# Trigger a heap dump on the running process
jcmd <pid> GC.heap_dump /tmp/heapdump.hprof

# Or configure automatic dump on OOM (add to JVM args)
# -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp/heapdump.hprof
```

Open the dump in Eclipse MAT (Memory Analyzer Tool) or VisualVM:
1. Open the Leak Suspects report.
2. Look at the Dominator Tree -- the `ConcurrentHashMap` will likely dominate retained heap.
3. Check the number of entries: if it is in the millions and growing, the diagnosis is confirmed.

**Runtime monitoring without a heap dump:**

```java
// Add a temporary metric to confirm growth
@Scheduled(fixedRate = 60_000)
public void reportCacheSize() {
    log.info("Cache size: {} entries, estimated memory: {} MB",
            cache.size(),
            cache.size() * estimatedEntryBytes / (1024 * 1024));
}
```

### Step 2: Root Cause

The root cause is one or more of the following:

1. **No eviction policy** -- entries are inserted on every Kafka message but never removed.
2. **Unbounded key space** -- every unique message ID or payload creates a new cache entry.
3. **References preventing GC** -- even if "removed" logically, strong references to values may be retained.

### Step 3: Fix -- Replace ConcurrentHashMap with Caffeine Cache

Caffeine is the standard high-performance caching library for Java. It provides bounded size, TTL-based expiration, and eviction policies.

**Dependency:**

```xml
<dependency>
    <groupId>com.github.ben-manes.caffeine</groupId>
    <artifactId>caffeine</artifactId>
</dependency>
```

**Replace the unbounded map:**

```java
// BEFORE -- unbounded, leaks memory
private final ConcurrentHashMap<String, ProcessingResult> cache = new ConcurrentHashMap<>();

// AFTER -- bounded with TTL and size limit
import com.github.ben-manes.caffeine.cache.Cache;
import com.github.ben-manes.caffeine.cache.Caffeine;

private final Cache<String, ProcessingResult> cache = Caffeine.newBuilder()
        .maximumSize(100_000)                    // Hard cap on entries
        .expireAfterWrite(Duration.ofMinutes(30)) // TTL per entry
        .expireAfterAccess(Duration.ofMinutes(10)) // Evict if not read
        .recordStats()                            // Enable hit/miss metrics
        .removalListener((key, value, cause) ->
            log.debug("Cache eviction: key={}, cause={}", key, cause))
        .build();
```

**Update usage (API is nearly identical to ConcurrentHashMap):**

```java
// Put
cache.put(messageId, result);

// Get
ProcessingResult result = cache.getIfPresent(messageId);

// Get or compute
ProcessingResult result = cache.get(messageId, key -> computeResult(key));
```

### Step 4: Spring Cache Integration (Optional)

If the cache is used across multiple services, integrate with Spring Cache:

```java
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        var caffeine = Caffeine.newBuilder()
                .maximumSize(100_000)
                .expireAfterWrite(Duration.ofMinutes(30))
                .recordStats();
        var manager = new CaffeineCacheManager();
        manager.setCaffeine(caffeine);
        return manager;
    }
}
```

Then use `@Cacheable` on service methods:

```java
@Cacheable(value = "processingResults", key = "#messageId")
public ProcessingResult processMessage(String messageId, byte[] payload) {
    // expensive computation
}
```

### Step 5: Add Monitoring to Prevent Recurrence

```java
@Bean
public MeterBinder caffeineCacheMetrics(Cache<String, ProcessingResult> cache) {
    return new CaffeineCacheMetrics<>(cache, "kafka_processing_cache", List.of());
}
```

This exposes `cache.size`, `cache.eviction.count`, `cache.hit.rate`, and `cache.miss.rate` to Prometheus/Grafana via Micrometer.

### Step 6: JVM Flags for Production Safety

Add these JVM arguments to catch future leaks early and improve GC behavior:

```bash
java \
  -Xmx4g \
  -XX:+UseZGC \
  -XX:+HeapDumpOnOutOfMemoryError \
  -XX:HeapDumpPath=/var/log/app/heapdump.hprof \
  -XX:MaxGCPauseMillis=200 \
  -jar app.jar
```

ZGC handles large heaps with low pause times, and the heap dump flag ensures you always have diagnostic data when OOM occurs.

### Summary of Changes

| Item | Before | After |
|------|--------|-------|
| Cache type | `ConcurrentHashMap` (unbounded) | Caffeine `Cache` (bounded) |
| Eviction | None | Size-based + TTL-based |
| Monitoring | None | Micrometer metrics + Actuator |
| OOM handling | Crash with no diagnostics | Automatic heap dump |

---

## Task 5: Processing 1 Million Records -- Resumable Batch Pipeline

### Architecture Overview

Use Spring Batch, which is purpose-built for this exact use case. It provides chunked processing, automatic checkpointing, restart/resume on failure, and built-in skip/retry policies.

### Dependencies

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-batch</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

### Job Configuration

```java
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.database.JdbcCursorItemReader;
import org.springframework.batch.item.database.JdbcBatchItemWriter;
import org.springframework.batch.item.database.builder.JdbcCursorItemReaderBuilder;
import org.springframework.batch.item.database.builder.JdbcBatchItemWriterBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;

@Configuration
public class RecordMigrationJobConfig {

    // --- Reader: cursor-based for memory efficiency with 1M rows ---
    @Bean
    public JdbcCursorItemReader<SourceRecord> reader(
            @Qualifier("sourceDataSource") DataSource sourceDataSource) {
        return new JdbcCursorItemReaderBuilder<SourceRecord>()
                .name("sourceRecordReader")
                .dataSource(sourceDataSource)
                .sql("SELECT id, data, created_at FROM source_records ORDER BY id")
                .rowMapper((rs, rowNum) -> new SourceRecord(
                        rs.getLong("id"),
                        rs.getString("data"),
                        rs.getTimestamp("created_at").toLocalDateTime()))
                .fetchSize(1000)          // Stream rows, do not load all into memory
                .saveState(true)          // Enable restart -- persists current row position
                .build();
    }

    // --- Processor: transform each record ---
    @Bean
    public RecordProcessor processor() {
        return new RecordProcessor();
    }

    // --- Writer: batch insert to destination database ---
    @Bean
    public JdbcBatchItemWriter<TargetRecord> writer(
            @Qualifier("targetDataSource") DataSource targetDataSource) {
        return new JdbcBatchItemWriterBuilder<TargetRecord>()
                .dataSource(targetDataSource)
                .sql("""
                    INSERT INTO target_records (source_id, transformed_data, processed_at)
                    VALUES (:sourceId, :transformedData, :processedAt)
                    """)
                .beanMapped()
                .build();
    }

    // --- Step: chunk-oriented, 500 records per transaction ---
    @Bean
    public Step migrationStep(JobRepository jobRepository,
                              PlatformTransactionManager transactionManager,
                              JdbcCursorItemReader<SourceRecord> reader,
                              RecordProcessor processor,
                              JdbcBatchItemWriter<TargetRecord> writer) {
        return new StepBuilder("migrationStep", jobRepository)
                .<SourceRecord, TargetRecord>chunk(500, transactionManager)
                .reader(reader)
                .processor(processor)
                .writer(writer)
                .faultTolerant()
                .skipLimit(100)                                   // Allow up to 100 bad records
                .skip(TransformationException.class)              // Skip records that fail transformation
                .retryLimit(3)                                    // Retry transient failures
                .retry(DataAccessException.class)                 // Retry on database errors
                .listener(new ChunkProgressListener())            // Log progress
                .build();
    }

    // --- Job: ties the step together with restart support ---
    @Bean
    public Job migrationJob(JobRepository jobRepository, Step migrationStep) {
        return new JobBuilder("recordMigrationJob", jobRepository)
                .start(migrationStep)
                .build();
    }
}
```

### Data Records

```java
public record SourceRecord(long id, String data, LocalDateTime createdAt) {}

public record TargetRecord(long sourceId, String transformedData, LocalDateTime processedAt) {}
```

### Processor

```java
import org.springframework.batch.item.ItemProcessor;

public class RecordProcessor implements ItemProcessor<SourceRecord, TargetRecord> {

    @Override
    public TargetRecord process(SourceRecord source) throws Exception {
        var transformedData = transformData(source.data());

        // Return null to skip/filter a record without counting it as an error
        if (transformedData == null || transformedData.isBlank()) {
            return null;
        }

        return new TargetRecord(
                source.id(),
                transformedData,
                LocalDateTime.now()
        );
    }

    private String transformData(String raw) {
        // Business-specific transformation
        // Throw TransformationException for unrecoverable per-record errors
        return raw.trim().toUpperCase();
    }
}
```

### Progress Listener

```java
import org.springframework.batch.core.ChunkListener;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ChunkProgressListener implements ChunkListener {

    private static final Logger log = LoggerFactory.getLogger(ChunkProgressListener.class);

    @Override
    public void afterChunk(ChunkContext context) {
        var stepExecution = context.getStepContext().getStepExecution();
        long readCount = stepExecution.getReadCount();
        long writeCount = stepExecution.getWriteCount();
        long skipCount = stepExecution.getSkipCount();

        if (readCount % 10_000 == 0) {
            log.info("Progress: read={}, written={}, skipped={}", readCount, writeCount, skipCount);
        }
    }
}
```

### Multi-DataSource Configuration

```java
@Configuration
public class DataSourceConfig {

    @Bean
    @Qualifier("sourceDataSource")
    @ConfigurationProperties("spring.datasource.source")
    public DataSource sourceDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean
    @Qualifier("targetDataSource")
    @ConfigurationProperties("spring.datasource.target")
    public DataSource targetDataSource() {
        return DataSourceBuilder.create().build();
    }
}
```

```yaml
spring:
  datasource:
    source:
      url: jdbc:postgresql://source-host:5432/source_db
      username: reader
      password: ${SOURCE_DB_PASSWORD}
      hikari:
        maximum-pool-size: 5
        read-only: true
    target:
      url: jdbc:postgresql://target-host:5432/target_db
      username: writer
      password: ${TARGET_DB_PASSWORD}
      hikari:
        maximum-pool-size: 10
  batch:
    jdbc:
      initialize-schema: always   # Creates Spring Batch metadata tables
    job:
      enabled: false              # Do not auto-run; trigger via REST or scheduler
```

### How Resumability Works

Spring Batch stores job execution metadata (which chunk was last committed) in its own metadata tables (`BATCH_JOB_EXECUTION`, `BATCH_STEP_EXECUTION`, etc.). When a job fails:

1. The step execution records the `READ_COUNT` (last successfully committed chunk boundary).
2. On restart, the `JdbcCursorItemReader` with `saveState(true)` resumes from the last committed position.
3. The chunk that was in-flight at failure is rolled back and re-processed.
4. Skipped records are logged in `BATCH_STEP_EXECUTION_CONTEXT` for later review.

**Restart a failed job:**

```java
@RestController
@RequestMapping("/api/batch")
public class BatchController {

    private final JobLauncher jobLauncher;
    private final Job migrationJob;
    private final JobExplorer jobExplorer;

    public BatchController(JobLauncher jobLauncher, Job migrationJob, JobExplorer jobExplorer) {
        this.jobLauncher = jobLauncher;
        this.migrationJob = migrationJob;
        this.jobExplorer = jobExplorer;
    }

    @PostMapping("/start")
    public ResponseEntity<String> start() throws Exception {
        var params = new JobParametersBuilder()
                .addLocalDateTime("startTime", LocalDateTime.now())
                .toJobParameters();
        var execution = jobLauncher.run(migrationJob, params);
        return ResponseEntity.ok("Job started: " + execution.getStatus());
    }

    @PostMapping("/restart/{executionId}")
    public ResponseEntity<String> restart(@PathVariable long executionId) throws Exception {
        // Spring Batch automatically resumes from the last checkpoint
        var execution = jobLauncher.run(migrationJob,
                jobExplorer.getJobExecution(executionId).getJobParameters());
        return ResponseEntity.ok("Job restarted: " + execution.getStatus());
    }
}
```

### Performance Characteristics

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Chunk size | 500 | Balances transaction size vs. commit overhead |
| Fetch size | 1000 | Keeps JDBC driver buffer reasonable |
| Skip limit | 100 | Tolerates bad data without aborting the entire job |
| Retry limit | 3 | Handles transient DB connection issues |
| HikariCP pool (target) | 10 | Enough for batch writer throughput |

With these settings, 1 million records typically process in 5-15 minutes depending on transformation complexity and database latency. The chunk size of 500 means the job checkpoints every 500 records, so at most 500 records are re-processed after a failure.

### Scaling Options (If Needed)

If the job must run faster, Spring Batch supports partitioning and parallel step execution:

```java
@Bean
public Step partitionedStep(JobRepository jobRepository,
                            Step migrationStep,
                            TaskExecutor taskExecutor) {
    return new StepBuilder("partitionedMigrationStep", jobRepository)
            .partitioner("migrationStep", new ColumnRangePartitioner())
            .step(migrationStep)
            .gridSize(8)                   // 8 parallel partitions
            .taskExecutor(taskExecutor)    // Virtual-thread executor
            .build();
}

@Bean
public TaskExecutor taskExecutor() {
    return new VirtualThreadTaskExecutor("batch-");
}
```

This splits the 1 million records into 8 partitions of 125,000 each, processing them in parallel on virtual threads. Each partition maintains its own checkpoint, so failures in one partition do not affect others.
