## Task 1

### Migration from Java 8 to Java 21 Idioms

**Original Java 8 code:**

```java
List<String> names = new ArrayList<>();
for (User user : users) {
    if (user.getAge() > 18 && user.isActive()) {
        names.add(user.getName().toUpperCase());
    }
}
Optional<String> result = names.isEmpty() ? Optional.empty() : Optional.of(names.get(0));
```

**Migrated Java 21 code:**

```java
// 1. Use a record instead of a mutable POJO for User (if you control the class)
public record User(String name, int age, boolean active) {}

// 2. Stream pipeline with modern idioms
List<String> names = users.stream()
        .filter(user -> user.age() > 18 && user.active())
        .map(user -> user.name().toUpperCase())
        .toList(); // Unmodifiable list -- prefer over .collect(Collectors.toList())

// 3. Stream::findFirst replaces the manual emptiness check
Optional<String> result = users.stream()
        .filter(user -> user.age() > 18 && user.active())
        .map(user -> user.name().toUpperCase())
        .findFirst();
```

**Key improvements explained:**

1. **Record class** -- `User` as a record gives you immutable fields, canonical constructor, `equals`, `hashCode`, and `toString` for free. Accessors are `name()` not `getName()`. Use records whenever the class is a plain data carrier.

2. **`Stream.toList()`** (Java 16+) -- returns an unmodifiable list directly, avoiding the verbose `Collectors.toList()`. If you need a mutable list, use `.collect(Collectors.toCollection(ArrayList::new))`.

3. **`findFirst()`** -- eliminates the intermediate list entirely when you only need the first match. The original code builds the full list then grabs index 0, which is wasteful.

4. **Single-pass vs. two-pass** -- the original materializes all matches into a list, then checks emptiness. The migrated version lazily evaluates and short-circuits at the first match.

**If you still need the full list AND the first element:**

```java
var names = users.stream()
        .filter(user -> user.age() > 18 && user.active())
        .map(user -> user.name().toUpperCase())
        .toList();

var result = names.stream().findFirst(); // cleaner than ternary
```

**Bonus -- pattern matching with sealed interfaces (Java 21):**

If `User` has subtypes with different eligibility rules:

```java
sealed interface User permits RegularUser, PremiumUser {}
record RegularUser(String name, int age, boolean active) implements User {}
record PremiumUser(String name, int age, boolean active, String tier) implements User {}

String label = switch (user) {
    case PremiumUser p when p.active() -> p.name().toUpperCase() + " [" + p.tier() + "]";
    case RegularUser r when r.age() > 18 && r.active() -> r.name().toUpperCase();
    default -> null;
};
```

---

## Task 2

### Reducing Spring Boot 3 Startup Time (25s with 200+ beans, 50 JPA entities)

The problem has four root causes that compound: component scanning overhead, JPA/Hibernate metadata initialization, bean creation cost, and classpath scanning. Here is a systematic approach.

### Step 1: Profile Before Optimizing

Add startup profiling to identify the actual bottlenecks:

```properties
# application.properties
spring.application.admin.enabled=false
logging.level.org.springframework.boot.autoconfigure=DEBUG
```

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(Application.class);
        app.setApplicationStartup(new BufferedApplicationStartup(2048));
        app.run(args);
    }
}
```

Access `/actuator/startup` to see exactly which beans and auto-configurations consume time.

### Step 2: Reduce Component Scanning Scope

```java
// BEFORE: scans everything
@SpringBootApplication
public class Application {}

// AFTER: explicit, narrow base packages
@SpringBootApplication(scanBasePackages = {
    "com.example.api",
    "com.example.service",
    "com.example.config"
})
public class Application {}
```

Even better, use explicit `@Import` for configuration classes and avoid scanning entirely:

```java
@SpringBootApplication(scanBasePackages = {})
@Import({
    ApiConfig.class,
    ServiceConfig.class,
    PersistenceConfig.class,
    SecurityConfig.class
})
public class Application {}
```

### Step 3: Exclude Unnecessary Auto-Configurations

```java
@SpringBootApplication(exclude = {
    DataSourceAutoConfiguration.class,        // if using custom datasource
    MongoAutoConfiguration.class,             // if not using Mongo
    KafkaAutoConfiguration.class,             // if configuring Kafka manually
    SecurityAutoConfiguration.class,          // if configuring security manually
    MailSenderAutoConfiguration.class,
    JmxAutoConfiguration.class,
    WebSocketServletAutoConfiguration.class
})
public class Application {}
```

Identify candidates by checking the DEBUG log for auto-configurations that match but are not needed.

### Step 4: Optimize JPA/Hibernate (Biggest Win for 50 Entities)

```properties
# Delay Hibernate DDL and metadata initialization
spring.jpa.defer-datasource-initialization=true
spring.jpa.properties.hibernate.boot.allow_jdbc_metadata_access=false

# Use metadata-only scanning instead of full class loading
spring.jpa.properties.hibernate.archive.scanner=org.hibernate.boot.archive.scan.internal.DisabledScanner
spring.jpa.hibernate.ddl-auto=none

# Disable Open Session In View (reduces proxy overhead)
spring.jpa.open-in-view=false

# Build metamodel in background
spring.jpa.properties.hibernate.enhancer.enableLazyInitialization=true
spring.jpa.properties.hibernate.enhancer.enableDirtyTracking=true
```

Explicitly list entities instead of scanning:

```java
@Configuration
public class PersistenceConfig {

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(
            DataSource dataSource, JpaVendorAdapter adapter) {
        var emf = new LocalContainerEntityManagerFactoryBean();
        emf.setDataSource(dataSource);
        emf.setJpaVendorAdapter(adapter);
        // Explicit packages -- avoids full classpath scan
        emf.setPackagesToScan("com.example.domain.entity");
        return emf;
    }
}
```

### Step 5: Use Lazy Bean Initialization Selectively

```properties
# Global lazy init -- all beans created on first use, not at startup
spring.main.lazy-initialization=true
```

Warning: global lazy init delays errors to runtime. A better approach is selective:

```java
@Configuration
public class LazyConfig {

    @Bean
    @Lazy
    public ExpensiveReportGenerator reportGenerator() {
        return new ExpensiveReportGenerator(); // Only created when first injected
    }
}
```

### Step 6: Use Virtual Threads to Parallelize Bean Init (Java 21)

```properties
spring.threads.virtual.enabled=true
```

```java
@Bean
public TomcatProtocolHandlerCustomizer<?> protocolHandlerVirtualThreadExecutorCustomizer() {
    return protocolHandler -> protocolHandler.setExecutor(
        Executors.newVirtualThreadPerTaskExecutor()
    );
}
```

### Step 7: GraalVM Native Image (Nuclear Option)

For the most dramatic improvement (25s down to sub-second):

```xml
<plugin>
    <groupId>org.graalvm.buildtools</groupId>
    <artifactId>native-maven-plugin</artifactId>
</plugin>
```

```bash
mvn -Pnative native:compile
# Startup drops from 25s to ~0.1-0.5s
```

### Step 8: Use Spring Boot AOT (Ahead-of-Time) Processing

Even without GraalVM, AOT processing pre-computes bean definitions:

```bash
mvn spring-boot:process-aot
java -Dspring.aot.enabled=true -jar app.jar
```

### Expected Impact Summary

| Optimization | Typical Improvement |
|---|---|
| Exclude unused auto-configs | 2-5s |
| Narrow component scanning | 1-3s |
| JPA/Hibernate tuning | 5-10s |
| Lazy bean initialization | 3-8s |
| Spring AOT | 3-5s |
| GraalVM Native | 20-24s (sub-second total) |

Apply steps 2-5 first for a realistic reduction from 25s to 8-12s without changing the deployment model. Add GraalVM native compilation to reach sub-second if the project can handle the native image constraints.

---

## Task 3

### Retry with Exponential Backoff and Circuit Breaker

This solution uses Resilience4j, the standard library for resilience patterns in Spring Boot 3.

### Dependencies

```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-spring-boot3</artifactId>
    <version>2.2.0</version>
</dependency>
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-retry</artifactId>
</dependency>
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-circuitbreaker</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

### Configuration (application.yml)

```yaml
resilience4j:
  retry:
    instances:
      externalApi:
        max-attempts: 3
        wait-duration: 1s
        enable-exponential-backoff: true
        exponential-backoff-multiplier: 2.0
        # Waits: 1s, 2s, 4s
        retry-exceptions:
          - java.io.IOException
          - java.net.SocketTimeoutException
          - org.springframework.web.client.HttpServerErrorException
        ignore-exceptions:
          - org.springframework.web.client.HttpClientErrorException

  circuitbreaker:
    instances:
      externalApi:
        sliding-window-type: COUNT_BASED
        sliding-window-size: 10
        failure-rate-threshold: 50
        wait-duration-in-open-state: 30s
        permitted-number-of-calls-in-half-open-state: 3
        minimum-number-of-calls: 5
        automatic-transition-from-open-to-half-open-enabled: true
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

    public ExternalApiService(RestClient.Builder builder) {
        this.restClient = builder
                .baseUrl("https://api.external-service.com")
                .build();
    }

    // Circuit breaker wraps retry -- retry happens inside the circuit breaker.
    // When circuit is OPEN, calls fail immediately without retrying.
    @CircuitBreaker(name = "externalApi", fallbackMethod = "fallback")
    @Retry(name = "externalApi")
    public ApiResponse callExternalApi(ApiRequest request) {
        log.info("Calling external API for request: {}", request.id());
        return restClient.post()
                .uri("/v1/process")
                .body(request)
                .retrieve()
                .body(ApiResponse.class);
    }

    // Fallback when circuit breaker is open or all retries exhausted
    private ApiResponse fallback(ApiRequest request, Throwable ex) {
        log.warn("Fallback triggered for request {}. Cause: {}", request.id(), ex.getMessage());

        // Options: return cached data, default response, or queue for later
        return new ApiResponse(
                request.id(),
                "DEGRADED",
                "Service temporarily unavailable. Request queued for retry."
        );
    }
}

// Use records for request/response DTOs
record ApiRequest(String id, String payload) {}
record ApiResponse(String id, String status, String message) {}
```

### Programmatic Approach (Without Annotations)

For more control, configure programmatically:

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
    private final CircuitBreaker circuitBreaker;
    private final Retry retry;

    public ResilientApiClient(RestClient.Builder builder) {
        this.restClient = builder.baseUrl("https://api.external-service.com").build();

        this.circuitBreaker = CircuitBreaker.of("externalApi",
                CircuitBreakerConfig.custom()
                        .failureRateThreshold(50)
                        .slidingWindowSize(10)
                        .minimumNumberOfCalls(5)
                        .waitDurationInOpenState(Duration.ofSeconds(30))
                        .permittedNumberOfCallsInHalfOpenState(3)
                        .build());

        this.retry = Retry.of("externalApi",
                RetryConfig.custom()
                        .maxAttempts(3)
                        .waitDuration(Duration.ofSeconds(1))
                        .intervalFunction(IntervalFunction.ofExponentialBackoff(
                                Duration.ofSeconds(1), 2.0))
                        .retryExceptions(IOException.class, SocketTimeoutException.class)
                        .build());
    }

    public ApiResponse callApi(ApiRequest request) {
        // Compose: circuit breaker wraps retry wraps the actual call
        Supplier<ApiResponse> decorated = CircuitBreaker.decorateSupplier(
                circuitBreaker,
                Retry.decorateSupplier(retry, () -> doCall(request))
        );

        try {
            return decorated.get();
        } catch (Exception e) {
            return fallback(request, e);
        }
    }

    private ApiResponse doCall(ApiRequest request) {
        return restClient.post()
                .uri("/v1/process")
                .body(request)
                .retrieve()
                .body(ApiResponse.class);
    }

    private ApiResponse fallback(ApiRequest request, Throwable ex) {
        return new ApiResponse(request.id(), "DEGRADED", ex.getMessage());
    }
}
```

### Monitoring the Circuit Breaker

```java
@RestController
@RequestMapping("/api/health")
public class CircuitBreakerHealthController {

    private final CircuitBreakerRegistry registry;

    public CircuitBreakerHealthController(CircuitBreakerRegistry registry) {
        this.registry = registry;
    }

    @GetMapping("/circuit-breaker")
    public Map<String, Object> getStatus() {
        var cb = registry.circuitBreaker("externalApi");
        var metrics = cb.getMetrics();
        return Map.of(
                "state", cb.getState().name(),
                "failureRate", metrics.getFailureRate(),
                "successRate", metrics.getSuccessRate(),
                "numberOfBufferedCalls", metrics.getNumberOfBufferedCalls(),
                "numberOfFailedCalls", metrics.getNumberOfFailedCalls()
        );
    }
}
```

The annotation-based approach is simpler for most cases. The programmatic approach gives you full control for dynamic configuration or when you need to compose multiple resilience patterns with explicit ordering.

---

## Task 4

### Diagnosing and Fixing a ConcurrentHashMap Memory Leak

The symptom pattern -- steady heap growth from 512MB to 4GB over 24 hours while processing Kafka messages into a ConcurrentHashMap -- points to entries being added but never removed. Here is how to diagnose and fix it.

### Step 1: Confirm the Diagnosis

**Heap dump analysis:**

```bash
# Trigger heap dump before OOM
jcmd <PID> GC.heap_dump /tmp/heapdump.hprof

# Or set JVM flag to auto-dump on OOM
-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/log/app/

# Analyze with Eclipse MAT or jhat
jcmd <PID> GC.class_histogram | head -30
```

In Eclipse MAT, open the heap dump and look at the Dominator Tree. You will likely see:
- `ConcurrentHashMap` dominating the heap
- Millions of entries holding references to processed data

**Live monitoring with JMX/Actuator:**

```java
// Add a gauge to expose cache size
@Component
public class CacheMetrics {

    private final Map<String, ProcessedResult> cache;

    public CacheMetrics(Map<String, ProcessedResult> cache, MeterRegistry registry) {
        this.cache = cache;
        Gauge.builder("app.cache.size", cache, Map::size)
                .description("Number of entries in the result cache")
                .register(registry);
    }
}
```

Watch `/actuator/metrics/app.cache.size` -- if it grows monotonically, you have confirmed the leak.

### Step 2: Root Cause

The typical code causing this:

```java
// PROBLEMATIC -- entries never evicted
@Service
public class MessageProcessor {

    private final Map<String, ProcessedResult> cache = new ConcurrentHashMap<>();

    @KafkaListener(topics = "events")
    public void process(ConsumerRecord<String, Event> record) {
        var result = transform(record.value());
        cache.put(record.key(), result);  // Grows forever
    }

    public ProcessedResult getResult(String key) {
        return cache.get(key);
    }
}
```

Every Kafka message adds an entry, but nothing ever removes old entries. Over 24 hours, millions of entries accumulate.

### Step 3: Fix with Caffeine Cache (Bounded, Evicting)

Replace the raw `ConcurrentHashMap` with a bounded cache:

```java
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

@Service
public class MessageProcessor {

    private final Cache<String, ProcessedResult> cache = Caffeine.newBuilder()
            .maximumSize(50_000)                    // Hard upper bound on entries
            .expireAfterWrite(Duration.ofHours(1))  // TTL per entry
            .expireAfterAccess(Duration.ofMinutes(30)) // Evict if not read
            .recordStats()                          // Enable metrics
            .removalListener((key, value, cause) ->
                log.debug("Cache eviction: key={}, cause={}", key, cause))
            .build();

    @KafkaListener(topics = "events")
    public void process(ConsumerRecord<String, Event> record) {
        var result = transform(record.value());
        cache.put(record.key(), result);  // Bounded -- old entries evicted automatically
    }

    public ProcessedResult getResult(String key) {
        return cache.getIfPresent(key);
    }
}
```

### Step 4: Spring Cache Abstraction Alternative

```java
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        var caffeine = Caffeine.newBuilder()
                .maximumSize(50_000)
                .expireAfterWrite(Duration.ofHours(1))
                .recordStats();

        var manager = new CaffeineCacheManager();
        manager.setCaffeine(caffeine);
        return manager;
    }
}

@Service
public class MessageProcessor {

    @CachePut(cacheNames = "results", key = "#record.key()")
    @KafkaListener(topics = "events")
    public ProcessedResult process(ConsumerRecord<String, Event> record) {
        return transform(record.value());
    }

    @Cacheable(cacheNames = "results")
    public ProcessedResult getResult(String key) {
        return null; // Cache miss returns null
    }
}
```

### Step 5: If You Must Use ConcurrentHashMap

If Caffeine is not an option, implement manual eviction:

```java
@Service
public class MessageProcessor {

    private final Map<String, TimestampedResult> cache = new ConcurrentHashMap<>();

    record TimestampedResult(ProcessedResult result, Instant createdAt) {}

    @KafkaListener(topics = "events")
    public void process(ConsumerRecord<String, Event> record) {
        var result = transform(record.value());
        cache.put(record.key(), new TimestampedResult(result, Instant.now()));
    }

    // Run every 10 minutes to evict stale entries
    @Scheduled(fixedRate = 600_000)
    public void evictStaleEntries() {
        var cutoff = Instant.now().minus(Duration.ofHours(1));
        int before = cache.size();
        cache.entrySet().removeIf(e -> e.getValue().createdAt().isBefore(cutoff));
        log.info("Cache eviction: {} -> {} entries", before, cache.size());
    }
}
```

### Step 6: Prevent Recurrence with Alerts

```yaml
# Prometheus alert rule
- alert: CacheGrowthAnomaly
  expr: rate(app_cache_size[30m]) > 100
  for: 15m
  labels:
    severity: warning
  annotations:
    summary: "Cache growing at >100 entries/30min for 15 minutes"
```

### JVM Flags for Production

```bash
java -Xmx4g \
     -XX:+UseZGC \
     -XX:+HeapDumpOnOutOfMemoryError \
     -XX:HeapDumpPath=/var/log/app/ \
     -XX:+ExitOnOutOfMemoryError \
     -Xlog:gc*:file=/var/log/app/gc.log:time,tags:filecount=5,filesize=50m \
     -jar app.jar
```

The key flags: `HeapDumpOnOutOfMemoryError` captures the evidence, `ExitOnOutOfMemoryError` ensures the container restarts instead of hanging in a degraded state, and ZGC provides low-latency GC suitable for this workload.

---

## Task 5

### Processing 1 Million Records with Failure Handling and Resumability

This is a batch processing problem. Spring Batch is the right tool -- it provides chunked processing, checkpointing, restartability, and skip/retry policies out of the box.

### Architecture Overview

```
Source DB --> ItemReader (paged) --> ItemProcessor (transform) --> ItemWriter (batch insert) --> Target DB
                  |                        |                            |
              JdbcPagingReader      Business Logic               JdbcBatchWriter
                  |                                                     |
              Checkpoint/restart metadata stored in Spring Batch tables
```

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

### Domain Records

```java
// Source record
public record SourceRecord(
    Long id,
    String rawData,
    String category,
    LocalDateTime createdAt
) {}

// Transformed target record
public record TargetRecord(
    Long sourceId,
    String processedData,
    String normalizedCategory,
    BigDecimal score,
    LocalDateTime processedAt
) {}
```

### Batch Job Configuration

```java
@Configuration
@EnableBatchProcessing
public class RecordMigrationJobConfig {

    private static final int CHUNK_SIZE = 500;
    private static final int PAGE_SIZE = 500;

    @Bean
    public Job recordMigrationJob(JobRepository jobRepository,
                                   Step migrationStep) {
        return new JobBuilder("recordMigrationJob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .listener(jobCompletionListener())
                .start(migrationStep)
                .build();
    }

    @Bean
    public Step migrationStep(JobRepository jobRepository,
                              PlatformTransactionManager txManager,
                              ItemReader<SourceRecord> reader,
                              ItemProcessor<SourceRecord, TargetRecord> processor,
                              ItemWriter<TargetRecord> writer) {
        return new StepBuilder("migrationStep", jobRepository)
                .<SourceRecord, TargetRecord>chunk(CHUNK_SIZE, txManager)
                .reader(reader)
                .processor(processor)
                .writer(writer)
                .faultTolerant()
                .skipLimit(1000)                          // Allow up to 1000 bad records
                .skip(TransformationException.class)      // Skip records that fail transformation
                .skip(DataIntegrityViolationException.class)
                .retryLimit(3)                            // Retry transient failures
                .retry(DeadlockLoserDataAccessException.class)
                .retry(CannotAcquireLockException.class)
                .listener(skipListener())
                .listener(chunkListener())
                .build();
    }

    // --- READER: Paged JDBC reader for 1M records ---

    @Bean
    @StepScope
    public JdbcPagingItemReader<SourceRecord> reader(
            @Qualifier("sourceDataSource") DataSource sourceDs) {

        var queryProvider = new SqlPagingQueryProviderFactoryBean();
        queryProvider.setDataSource(sourceDs);
        queryProvider.setSelectClause("SELECT id, raw_data, category, created_at");
        queryProvider.setFromClause("FROM source_records");
        queryProvider.setSortKey("id");  // Critical for restartability

        return new JdbcPagingItemReaderBuilder<SourceRecord>()
                .name("sourceRecordReader")
                .dataSource(sourceDs)
                .queryProvider(queryProvider.getObject())
                .pageSize(PAGE_SIZE)
                .rowMapper((rs, rowNum) -> new SourceRecord(
                        rs.getLong("id"),
                        rs.getString("raw_data"),
                        rs.getString("category"),
                        rs.getTimestamp("created_at").toLocalDateTime()
                ))
                .build();
    }

    // --- PROCESSOR: Transformation logic ---

    @Bean
    public ItemProcessor<SourceRecord, TargetRecord> processor() {
        return source -> {
            // Return null to filter out records
            if (source.rawData() == null || source.rawData().isBlank()) {
                return null; // Filtered, not counted as skip
            }

            try {
                String processed = transformData(source.rawData());
                String normalized = normalizeCategory(source.category());
                BigDecimal score = calculateScore(processed);

                return new TargetRecord(
                        source.id(),
                        processed,
                        normalized,
                        score,
                        LocalDateTime.now()
                );
            } catch (Exception e) {
                throw new TransformationException(
                        "Failed to transform record " + source.id(), e);
            }
        };
    }

    // --- WRITER: Batch insert into target database ---

    @Bean
    public JdbcBatchItemWriter<TargetRecord> writer(
            @Qualifier("targetDataSource") DataSource targetDs) {

        return new JdbcBatchItemWriterBuilder<TargetRecord>()
                .dataSource(targetDs)
                .sql("""
                    INSERT INTO target_records
                        (source_id, processed_data, normalized_category, score, processed_at)
                    VALUES
                        (:sourceId, :processedData, :normalizedCategory, :score, :processedAt)
                    ON CONFLICT (source_id) DO UPDATE SET
                        processed_data = EXCLUDED.processed_data,
                        score = EXCLUDED.score,
                        processed_at = EXCLUDED.processed_at
                    """)
                .beanMapped()
                .build();
    }

    // --- LISTENERS ---

    @Bean
    public SkipListener<SourceRecord, TargetRecord> skipListener() {
        return new SkipListener<>() {
            private static final Logger log = LoggerFactory.getLogger("SkipListener");

            @Override
            public void onSkipInProcess(SourceRecord item, Throwable t) {
                log.warn("Skipped record {} during processing: {}",
                        item.id(), t.getMessage());
                // Write to dead-letter table for manual review
                deadLetterRepository.save(new DeadLetter(
                        item.id(), t.getMessage(), LocalDateTime.now()));
            }

            @Override
            public void onSkipInWrite(TargetRecord item, Throwable t) {
                log.warn("Skipped record {} during write: {}",
                        item.sourceId(), t.getMessage());
            }
        };
    }

    @Bean
    public ChunkListener chunkListener() {
        return new ChunkListener() {
            private static final Logger log = LoggerFactory.getLogger("ChunkListener");
            private final AtomicLong chunksProcessed = new AtomicLong(0);

            @Override
            public void afterChunk(ChunkContext context) {
                long count = chunksProcessed.incrementAndGet();
                if (count % 100 == 0) { // Log every 100 chunks = 50,000 records
                    var stepExec = context.getStepContext().getStepExecution();
                    log.info("Progress: {} records read, {} written, {} skipped",
                            stepExec.getReadCount(),
                            stepExec.getWriteCount(),
                            stepExec.getSkipCount());
                }
            }
        };
    }

    @Bean
    public JobExecutionListener jobCompletionListener() {
        return new JobExecutionListener() {
            private static final Logger log = LoggerFactory.getLogger("JobListener");

            @Override
            public void afterJob(JobExecution exec) {
                var step = exec.getStepExecutions().iterator().next();
                log.info("""
                    Job completed: status={}
                    Records read:    {}
                    Records written: {}
                    Records skipped: {}
                    Duration:        {}s
                    """,
                    exec.getStatus(),
                    step.getReadCount(),
                    step.getWriteCount(),
                    step.getSkipCount(),
                    Duration.between(exec.getStartTime(), exec.getEndTime()).getSeconds()
                );
            }
        };
    }

    private String transformData(String raw) { /* business logic */ return raw; }
    private String normalizeCategory(String cat) { return cat.toLowerCase().trim(); }
    private BigDecimal calculateScore(String data) { return BigDecimal.ONE; }
}
```

### Dual DataSource Configuration

```java
@Configuration
public class DataSourceConfig {

    @Bean
    @ConfigurationProperties("spring.datasource.source")
    @Qualifier("sourceDataSource")
    public DataSource sourceDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource.target")
    @Qualifier("targetDataSource")
    public DataSource targetDataSource() {
        return DataSourceBuilder.create().build();
    }
}
```

```yaml
spring:
  datasource:
    source:
      url: jdbc:postgresql://source-host:5432/sourcedb
      username: reader
      hikari:
        maximum-pool-size: 5
        read-only: true
    target:
      url: jdbc:postgresql://target-host:5432/targetdb
      username: writer
      hikari:
        maximum-pool-size: 10
  batch:
    jdbc:
      initialize-schema: always  # Creates Spring Batch metadata tables
    job:
      enabled: false             # Don't auto-run, trigger manually
```

### Resumability

Spring Batch handles resumability automatically through its metadata tables. When a job fails mid-run:

```java
@RestController
@RequestMapping("/api/batch")
public class BatchController {

    private final JobLauncher jobLauncher;
    private final Job recordMigrationJob;
    private final JobExplorer jobExplorer;

    // Start a new run
    @PostMapping("/start")
    public ResponseEntity<String> startJob() throws Exception {
        var params = new JobParametersBuilder()
                .addLocalDateTime("startTime", LocalDateTime.now())
                .toJobParameters();
        var execution = jobLauncher.run(recordMigrationJob, params);
        return ResponseEntity.ok("Job started: " + execution.getId());
    }

    // Restart a failed run -- resumes from the last committed chunk
    @PostMapping("/restart/{executionId}")
    public ResponseEntity<String> restartJob(@PathVariable Long executionId) throws Exception {
        var failedExecution = jobExplorer.getJobExecution(executionId);
        var params = failedExecution.getJobParameters();
        var execution = jobLauncher.run(recordMigrationJob, params);
        return ResponseEntity.ok("Job restarted: " + execution.getId());
    }

    // Check status
    @GetMapping("/status/{executionId}")
    public ResponseEntity<Map<String, Object>> getStatus(@PathVariable Long executionId) {
        var exec = jobExplorer.getJobExecution(executionId);
        var step = exec.getStepExecutions().iterator().next();
        return ResponseEntity.ok(Map.of(
                "status", exec.getStatus(),
                "readCount", step.getReadCount(),
                "writeCount", step.getWriteCount(),
                "skipCount", step.getSkipCount(),
                "progress", String.format("%.1f%%", step.getReadCount() / 10_000.0)
        ));
    }
}
```

When you call `/restart/{executionId}`, Spring Batch:
1. Reads the step execution context from its metadata tables
2. Determines the last successfully committed chunk
3. Repositions the reader to the next unprocessed page (using the sort key)
4. Resumes processing from that point

### Performance Considerations for 1M Records

| Setting | Value | Rationale |
|---|---|---|
| Chunk size | 500 | Balances commit overhead vs. retry blast radius |
| Page size | 500 | Match chunk size to avoid reader/processor mismatch |
| Writer pool | 10 connections | Enough parallelism for batch inserts |
| Reader pool | 5 connections | Read-only, less contention |
| Skip limit | 1000 (0.1%) | Acceptable error rate for data migration |

With chunk size 500 and 1M records, you get 2,000 chunks. Each chunk is one transaction. On failure, you lose at most 500 records of work, and the job restarts from the last committed chunk.

Expected throughput: 5,000-20,000 records/second depending on transformation complexity and database latency, completing in 1-3 minutes for simple transforms.
