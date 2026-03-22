## Task 1

### Java 21 Migration

The original code uses imperative iteration, manual collection building, and a ternary for Optional construction. Here is the idiomatic Java 21 version:

```java
// Assume User is modeled as a record (Java 16+)
public record User(String name, int age, boolean active) {}

// Modern Java 21 stream pipeline
List<String> names = users.stream()
        .filter(user -> user.age() > 18 && user.active())
        .map(user -> user.name().toUpperCase())
        .toList();  // Unmodifiable list (Java 16+)

Optional<String> result = names.stream().findFirst();
```

**Key changes and rationale:**

1. **Record class for User** -- If `User` is a simple data carrier, replace the POJO with a `record`. This gives you immutability, correct `equals`/`hashCode`/`toString`, and accessor methods (`name()`, `age()`, `active()`) with no boilerplate. If `User` has mutable state or inheritance, keep it as a class but consider sealed interfaces.

2. **`Stream.toList()` instead of `Collectors.toList()`** -- Available since Java 16, returns an unmodifiable list. Use `collect(Collectors.toCollection(ArrayList::new))` only if you need mutability.

3. **`findFirst()` instead of manual ternary** -- Produces `Optional<String>` directly, eliminating the empty-check branching.

4. **No `new ArrayList<>()`** -- The stream pipeline handles collection creation internally.

If the list itself is not needed and only the first match matters, collapse further:

```java
Optional<String> result = users.stream()
        .filter(user -> user.age() > 18 && user.active())
        .map(user -> user.name().toUpperCase())
        .findFirst();
```

This is both more readable and more efficient -- it short-circuits after the first match.

---

## Task 2

### Spring Boot 3 Startup Optimization Strategy

A 25-second startup with 200+ beans and 50 JPA entities has several optimization vectors. Apply them in order of impact.

#### 1. Enable Lazy Initialization (Immediate Win)

```yaml
# application.yml
spring:
  main:
    lazy-initialization: true
```

This defers bean creation until first use. Typical reduction: 30-50% of startup time. To exclude critical beans (health checks, message listeners) from lazy init:

```java
@Configuration
public class EagerBeans {

    @Bean
    @Lazy(false)
    public KafkaListenerContainerFactory<?> kafkaListenerContainerFactory() {
        // This bean must be ready at startup
    }
}
```

#### 2. Hibernate Startup Optimization

JPA entity scanning and metadata building with 50 entities is a major contributor.

```yaml
spring:
  jpa:
    properties:
      hibernate:
        boot:
          allow_jdbc_metadata_access: false
    defer-datasource-initialization: true
    hibernate:
      ddl-auto: validate  # Never use 'update' in production
    database-platform: org.hibernate.dialect.PostgreSQLDialect
```

Setting `allow_jdbc_metadata_access: false` skips JDBC metadata queries during startup. Providing the dialect explicitly prevents Hibernate from auto-detecting it via a database round-trip.

#### 3. Replace Component Scanning with Explicit Configuration

Component scanning of 200+ beans is expensive. Narrow the scan scope:

```java
@SpringBootApplication(scanBasePackages = {
    "com.example.core",
    "com.example.api"
})  // Instead of scanning the entire root package
public class Application {}
```

Better yet, for hot paths use explicit `@Bean` methods in `@Configuration` classes. This eliminates classpath scanning for those beans entirely.

#### 4. Use Spring AOT (Ahead-of-Time) Processing

Spring Boot 3 supports AOT processing that pre-computes bean definitions at build time:

```xml
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

#### 5. GraalVM Native Image (Maximum Startup Reduction)

For the most dramatic improvement (startup under 1 second):

```xml
<profiles>
    <profile>
        <id>native</id>
        <build>
            <plugins>
                <plugin>
                    <groupId>org.graalvm.buildtools</groupId>
                    <artifactId>native-maven-plugin</artifactId>
                </plugin>
            </plugins>
        </build>
    </profile>
</profiles>
```

Build with `mvn -Pnative native:compile`. Startup drops from 25s to sub-second.

#### 6. Enable Virtual Threads (Java 21)

```yaml
spring:
  threads:
    virtual:
      enabled: true
```

This does not directly speed up bean creation, but enables virtual threads for all request handling, reducing the thread pool overhead that contributes to startup memory pressure.

#### 7. Profile and Measure

Use Spring Boot Actuator's `/actuator/startup` endpoint to identify the slowest beans:

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(Application.class);
        app.setApplicationStartup(new BufferingApplicationStartup(2048));
        app.run(args);
    }
}
```

**Expected results:** Lazy init + Hibernate tuning + narrowed scanning typically brings 25s down to 8-12s. Adding AOT brings it to 4-6s. GraalVM native image brings it under 1s.

---

## Task 3

### Retry with Exponential Backoff and Circuit Breaker

This implementation uses Resilience4j, the standard library for fault tolerance in Spring Boot 3.

#### Dependencies (Maven)

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

#### Configuration

```yaml
# application.yml
resilience4j:
  retry:
    instances:
      externalApi:
        max-attempts: 3
        wait-duration: 1s
        enable-exponential-backoff: true
        exponential-backoff-multiplier: 2.0
        # Backoff: 1s, 2s, 4s
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
        record-exceptions:
          - java.io.IOException
          - java.net.SocketTimeoutException
          - org.springframework.web.client.HttpServerErrorException
```

#### Service Implementation (Annotation-Based)

```java
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ExternalApiClient {

    private static final Logger log = LoggerFactory.getLogger(ExternalApiClient.class);
    private final RestClient restClient;

    public ExternalApiClient(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder
                .baseUrl("https://api.external-service.com")
                .build();
    }

    @CircuitBreaker(name = "externalApi", fallbackMethod = "fallback")
    @Retry(name = "externalApi")
    public ApiResponse fetchData(String resourceId) {
        log.info("Calling external API for resource: {}", resourceId);
        return restClient.get()
                .uri("/resources/{id}", resourceId)
                .retrieve()
                .body(ApiResponse.class);
    }

    private ApiResponse fallback(String resourceId, Throwable throwable) {
        log.warn("Circuit breaker open or retries exhausted for resource: {}. Cause: {}",
                resourceId, throwable.getMessage());

        return switch (throwable) {
            case io.github.resilience4j.circuitbreaker.CallNotPermittedException _ ->
                    new ApiResponse(resourceId, "SERVICE_UNAVAILABLE",
                            "External service is temporarily unavailable");
            default ->
                    new ApiResponse(resourceId, "DEGRADED",
                            "Using fallback due to: " + throwable.getMessage());
        };
    }
}

public record ApiResponse(String resourceId, String status, String data) {}
```

#### Programmatic Approach (For More Control)

When annotation-based configuration is insufficient, use the programmatic API:

```java
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import io.github.resilience4j.retry.Retry;
import io.github.resilience4j.retry.RetryConfig;
import io.github.resilience4j.retry.RetryRegistry;

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

        var cbConfig = CircuitBreakerConfig.custom()
                .failureRateThreshold(50)
                .slidingWindowSize(10)
                .minimumNumberOfCalls(5)
                .waitDurationInOpenState(Duration.ofSeconds(30))
                .permittedNumberOfCallsInHalfOpenState(3)
                .recordExceptions(IOException.class)
                .build();
        this.circuitBreaker = CircuitBreakerRegistry.of(cbConfig)
                .circuitBreaker("externalApi");

        var retryConfig = RetryConfig.custom()
                .maxAttempts(3)
                .waitDuration(Duration.ofSeconds(1))
                .enableExponentialBackoff()
                .exponentialBackoffMultiplier(2.0)
                .retryExceptions(IOException.class)
                .build();
        this.retry = RetryRegistry.of(retryConfig).retry("externalApi");
    }

    public ApiResponse fetchData(String resourceId) {
        // Decoration order matters: CircuitBreaker wraps Retry
        Supplier<ApiResponse> decorated = CircuitBreaker.decorateSupplier(
                circuitBreaker,
                Retry.decorateSupplier(retry, () -> callApi(resourceId))
        );

        try {
            return decorated.get();
        } catch (Exception e) {
            return new ApiResponse(resourceId, "FALLBACK", e.getMessage());
        }
    }

    private ApiResponse callApi(String resourceId) {
        return restClient.get()
                .uri("/resources/{id}", resourceId)
                .retrieve()
                .body(ApiResponse.class);
    }
}
```

#### Monitoring

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,circuitbreakers,retries
  health:
    circuitbreakers:
      enabled: true
```

Access circuit breaker state at `/actuator/circuitbreakers` and retry metrics at `/actuator/retries`.

---

## Task 4

### Diagnosing and Fixing the ConcurrentHashMap Memory Leak

The symptoms -- linear heap growth over 24 hours with a `ConcurrentHashMap` cache -- point to unbounded cache growth. Here is the systematic diagnosis and fix.

#### Diagnosis

**Step 1: Confirm the leak source with a heap dump.**

```bash
# Trigger heap dump on the running JVM
jcmd <pid> GC.heap_dump /tmp/heapdump.hprof

# Or configure automatic dump on OOM (add to JVM args)
-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/log/app/
```

Analyze with Eclipse MAT or VisualVM. Look for the dominator tree -- the `ConcurrentHashMap` will likely dominate retained heap.

**Step 2: Identify what is being cached.**

```java
// Add diagnostic logging temporarily
log.info("Cache size: {}, estimated memory: {}MB",
        cache.size(),
        cache.size() * estimatedEntrySize / (1024 * 1024));
```

**Step 3: Common root causes with ConcurrentHashMap + Kafka:**

1. **No eviction policy** -- entries are added but never removed
2. **Key accumulation** -- every Kafka message creates a unique cache key (e.g., message ID, timestamp-based key)
3. **Value retention** -- cached values hold references to large objects (byte arrays, deserialized payloads)
4. **Rebalance storms** -- consumer rebalances cause reprocessing, adding duplicate entries

#### The Fix

Replace the raw `ConcurrentHashMap` with Caffeine, a high-performance bounded cache:

```java
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.RemovalCause;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class ProcessingResultCache {

    private static final Logger log = LoggerFactory.getLogger(ProcessingResultCache.class);

    private final Cache<String, ProcessingResult> cache;

    public ProcessingResultCache() {
        this.cache = Caffeine.newBuilder()
                .maximumSize(50_000)                       // Hard upper bound on entries
                .expireAfterWrite(Duration.ofHours(1))     // TTL for each entry
                .expireAfterAccess(Duration.ofMinutes(30)) // Evict if not accessed
                .recordStats()                             // Enable hit/miss metrics
                .removalListener((key, value, cause) -> {
                    if (cause == RemovalCause.SIZE) {
                        log.debug("Cache eviction due to size limit, key: {}", key);
                    }
                })
                .build();
    }

    public void put(String key, ProcessingResult result) {
        cache.put(key, result);
    }

    public ProcessingResult get(String key) {
        return cache.getIfPresent(key);
    }

    public ProcessingResult getOrCompute(String key,
                                          java.util.function.Function<String, ProcessingResult> loader) {
        return cache.get(key, loader);
    }

    // Expose for actuator / monitoring
    public com.github.benmanes.caffeine.cache.stats.CacheStats stats() {
        return cache.stats();
    }

    public long estimatedSize() {
        return cache.estimatedSize();
    }
}

public record ProcessingResult(String id, String status, byte[] payload) {}
```

#### Spring Boot Integration with Metrics

```java
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.binder.cache.CaffeineCacheMetrics;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CacheConfig {

    @Bean
    public ProcessingResultCache processingResultCache(MeterRegistry registry) {
        var cache = new ProcessingResultCache();
        // Register Micrometer metrics for Grafana/Prometheus monitoring
        CaffeineCacheMetrics.monitor(registry, cache.unwrap(), "processing-results");
        return cache;
    }
}
```

#### Kafka Consumer with Proper Cache Usage

```java
@Component
public class KafkaMessageProcessor {

    private static final Logger log = LoggerFactory.getLogger(KafkaMessageProcessor.class);
    private final ProcessingResultCache cache;

    public KafkaMessageProcessor(ProcessingResultCache cache) {
        this.cache = cache;
    }

    @KafkaListener(topics = "input-topic", groupId = "processor-group")
    public void process(ConsumerRecord<String, String> record) {
        String key = record.key();

        // Deduplicate: skip if already processed (idempotency)
        ProcessingResult existing = cache.get(key);
        if (existing != null) {
            log.debug("Skipping duplicate message: {}", key);
            return;
        }

        ProcessingResult result = transform(record.value());
        cache.put(key, result);
    }

    private ProcessingResult transform(String payload) {
        return new ProcessingResult("id", "PROCESSED", payload.getBytes());
    }
}
```

#### JVM Flags for Production Monitoring

```bash
java \
  -XX:+UseZGC \
  -Xms512m -Xmx4g \
  -XX:+HeapDumpOnOutOfMemoryError \
  -XX:HeapDumpPath=/var/log/app/ \
  -Dcom.sun.management.jmxremote \
  -jar app.jar
```

#### Prevention Checklist

- Never use unbounded `Map` or `ConcurrentHashMap` as a cache in long-running services
- Always set `maximumSize` and TTL on caches
- Monitor cache size via Micrometer metrics and set alerts (e.g., alert if estimated size exceeds 80% of max)
- Use weak references (`Caffeine.weakKeys()` / `weakValues()`) when cache entries reference large objects that should be GC-eligible
- For Kafka consumers, implement idempotency at the cache or database level to prevent reprocessing

---

## Task 5

### Batch Processing 1 Million Records: Resumable, Fault-Tolerant

This solution uses Spring Batch, which is purpose-built for exactly this scenario. It provides chunked processing, automatic restart/resume from the last successful chunk, skip/retry policies, and transaction management.

#### Dependencies

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

#### Domain Model

```java
// Source entity
@Entity
@Table(name = "source_records")
public class SourceRecord {
    @Id
    private Long id;
    private String rawData;
    private String category;
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public String getRawData() { return rawData; }
    public String getCategory() { return category; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}

// Target entity
@Entity
@Table(name = "transformed_records")
public class TransformedRecord {
    @Id
    private Long id;
    private String processedData;
    private String enrichedCategory;
    private LocalDateTime processedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public void setProcessedData(String d) { this.processedData = d; }
    public void setEnrichedCategory(String c) { this.enrichedCategory = c; }
    public void setProcessedAt(LocalDateTime t) { this.processedAt = t; }
}
```

#### Batch Job Configuration

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
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;

@Configuration
public class RecordMigrationJobConfig {

    private static final int CHUNK_SIZE = 500;
    private static final int SKIP_LIMIT = 100;

    @Bean
    public Job recordMigrationJob(JobRepository jobRepository, Step migrationStep) {
        return new JobBuilder("recordMigrationJob", jobRepository)
                .start(migrationStep)
                .listener(new JobCompletionListener())
                .build();
    }

    @Bean
    public Step migrationStep(JobRepository jobRepository,
                              PlatformTransactionManager transactionManager,
                              JdbcCursorItemReader<SourceRecord> reader,
                              RecordTransformProcessor processor,
                              JdbcBatchItemWriter<TransformedRecord> writer) {
        return new StepBuilder("migrationStep", jobRepository)
                .<SourceRecord, TransformedRecord>chunk(CHUNK_SIZE, transactionManager)
                .reader(reader)
                .processor(processor)
                .writer(writer)
                .faultTolerant()
                .skipLimit(SKIP_LIMIT)
                .skip(TransformationException.class)    // Skip bad records
                .retryLimit(3)
                .retry(java.sql.SQLException.class)     // Retry transient DB errors
                .listener(new ChunkProgressListener())
                .build();
    }

    @Bean
    public JdbcCursorItemReader<SourceRecord> reader(
            @Qualifier("sourceDataSource") DataSource sourceDataSource) {
        return new JdbcCursorItemReaderBuilder<SourceRecord>()
                .name("sourceRecordReader")
                .dataSource(sourceDataSource)
                .sql("SELECT id, raw_data, category, created_at FROM source_records ORDER BY id")
                .fetchSize(CHUNK_SIZE)
                .rowMapper((rs, rowNum) -> {
                    var record = new SourceRecord();
                    // Map fields from ResultSet to entity
                    return record;
                })
                .saveState(true)  // Enables restart from last position
                .build();
    }

    @Bean
    public JdbcBatchItemWriter<TransformedRecord> writer(
            @Qualifier("targetDataSource") DataSource targetDataSource) {
        return new JdbcBatchItemWriterBuilder<TransformedRecord>()
                .dataSource(targetDataSource)
                .sql("""
                    INSERT INTO transformed_records (id, processed_data, enriched_category, processed_at)
                    VALUES (:id, :processedData, :enrichedCategory, :processedAt)
                    ON CONFLICT (id) DO UPDATE SET
                        processed_data = EXCLUDED.processed_data,
                        enriched_category = EXCLUDED.enriched_category,
                        processed_at = EXCLUDED.processed_at
                    """)
                .beanMapped()
                .build();
    }
}
```

#### Processor (Transformation Logic)

```java
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class RecordTransformProcessor implements ItemProcessor<SourceRecord, TransformedRecord> {

    @Override
    public TransformedRecord process(SourceRecord source) throws Exception {
        // Return null to filter out records that should be skipped
        if (source.getRawData() == null || source.getRawData().isBlank()) {
            return null;  // Spring Batch skips null returns
        }

        var target = new TransformedRecord();
        target.setId(source.getId());
        target.setProcessedData(transform(source.getRawData()));
        target.setEnrichedCategory(enrichCategory(source.getCategory()));
        target.setProcessedAt(LocalDateTime.now());
        return target;
    }

    private String transform(String rawData) {
        // Business transformation logic
        return rawData.trim().toUpperCase();
    }

    private String enrichCategory(String category) {
        return switch (category) {
            case "A" -> "CATEGORY_ALPHA";
            case "B" -> "CATEGORY_BETA";
            case null -> "UNCATEGORIZED";
            default -> "CATEGORY_" + category;
        };
    }
}
```

#### Multi-DataSource Configuration

```java
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.beans.factory.annotation.Qualifier;

import javax.sql.DataSource;

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
      url: jdbc:postgresql://source-db:5432/source
      username: reader
      password: ${SOURCE_DB_PASSWORD}
    target:
      url: jdbc:postgresql://target-db:5432/target
      username: writer
      password: ${TARGET_DB_PASSWORD}
  batch:
    jdbc:
      initialize-schema: always  # Creates Spring Batch metadata tables
    job:
      enabled: false  # Don't auto-run; trigger via REST or scheduler
```

#### Progress Monitoring

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
            log.info("Progress: read={}, written={}, skipped={}, commits={}",
                    readCount, writeCount, skipCount, stepExecution.getCommitCount());
        }
    }
}
```

#### Job Completion Listener

```java
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobExecutionListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class JobCompletionListener implements JobExecutionListener {

    private static final Logger log = LoggerFactory.getLogger(JobCompletionListener.class);

    @Override
    public void afterJob(JobExecution jobExecution) {
        var status = jobExecution.getStatus();
        var duration = java.time.Duration.between(
                jobExecution.getStartTime(), jobExecution.getEndTime());

        jobExecution.getStepExecutions().forEach(step ->
                log.info("Step '{}': read={}, written={}, skipped={}, duration={}",
                        step.getStepName(),
                        step.getReadCount(),
                        step.getWriteCount(),
                        step.getSkipCount(),
                        duration));

        log.info("Job completed with status: {} in {}", status, duration);
    }
}
```

#### Job Launcher (REST Trigger and Restart)

```java
import org.springframework.batch.core.*;
import org.springframework.batch.core.explore.JobExplorer;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/batch")
public class BatchJobController {

    private final JobLauncher jobLauncher;
    private final JobExplorer jobExplorer;
    private final Job recordMigrationJob;

    public BatchJobController(JobLauncher jobLauncher, JobExplorer jobExplorer,
                              Job recordMigrationJob) {
        this.jobLauncher = jobLauncher;
        this.jobExplorer = jobExplorer;
        this.recordMigrationJob = recordMigrationJob;
    }

    @PostMapping("/start")
    public ResponseEntity<String> startJob() throws Exception {
        var params = new JobParametersBuilder()
                .addLocalDateTime("startTime", LocalDateTime.now())
                .toJobParameters();

        var execution = jobLauncher.run(recordMigrationJob, params);
        return ResponseEntity.ok("Job started: " + execution.getId());
    }

    @PostMapping("/restart/{executionId}")
    public ResponseEntity<String> restartJob(@PathVariable Long executionId) throws Exception {
        var lastExecution = jobExplorer.getJobExecution(executionId);
        if (lastExecution == null) {
            return ResponseEntity.notFound().build();
        }

        // Spring Batch automatically resumes from the last committed chunk
        var execution = jobLauncher.run(recordMigrationJob, lastExecution.getJobParameters());
        return ResponseEntity.ok("Job restarted: " + execution.getId());
    }

    @GetMapping("/status/{executionId}")
    public ResponseEntity<?> getStatus(@PathVariable Long executionId) {
        var execution = jobExplorer.getJobExecution(executionId);
        if (execution == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(Map.of(
                "status", execution.getStatus(),
                "startTime", execution.getStartTime(),
                "readCount", execution.getStepExecutions().stream()
                        .mapToLong(StepExecution::getReadCount).sum(),
                "writeCount", execution.getStepExecutions().stream()
                        .mapToLong(StepExecution::getWriteCount).sum(),
                "skipCount", execution.getStepExecutions().stream()
                        .mapToLong(StepExecution::getSkipCount).sum()
        ));
    }
}
```

#### How Resumability Works

Spring Batch stores job execution metadata (which chunk was last committed) in its internal tables (`BATCH_JOB_EXECUTION`, `BATCH_STEP_EXECUTION`). When a job fails at chunk 1500 of 2000:

1. The failure is recorded with the reader's current position
2. On restart with the same `JobParameters`, Spring Batch detects the incomplete execution
3. The reader resumes from chunk 1501 (the `saveState(true)` on the reader enables this)
4. Already-written records are not duplicated thanks to the `ON CONFLICT` clause in the writer

**Performance characteristics for 1M records at chunk size 500:**
- 2,000 chunk commits
- Each chunk is a single transaction
- At ~200ms per chunk (read + transform + write), total runtime is approximately 7 minutes
- Parallelization via partitioning can reduce this to under 2 minutes with 4 threads

#### Optional: Partitioned Parallel Processing

For faster throughput, partition the data by ID range and process concurrently on virtual threads:

```java
@Bean
public Step partitionedStep(JobRepository jobRepository,
                            Step migrationStep) {
    return new StepBuilder("partitionedStep", jobRepository)
            .partitioner("migrationStep", new ColumnRangePartitioner())
            .step(migrationStep)
            .gridSize(4)  // 4 parallel partitions
            .taskExecutor(new VirtualThreadTaskExecutor())  // Java 21 virtual threads
            .build();
}
```

This splits the 1M records into 4 partitions of 250K each, processed concurrently. Each partition maintains its own restart state, so a failure in one partition does not affect the others.
