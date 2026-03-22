## Task 1

### Migrating Java 8 Code to Java 21 Idioms

**Original code (Java 8 style):**

```java
List<String> names = new ArrayList<>();
for (User user : users) {
    if (user.getAge() > 18 && user.isActive()) {
        names.add(user.getName().toUpperCase());
    }
}
Optional<String> result = names.isEmpty() ? Optional.empty() : Optional.of(names.get(0));
```

**Modernized (Java 21):**

First, replace the mutable `User` class with a record:

```java
public record User(String name, int age, boolean active) {}
```

Then rewrite the logic using streams and modern idioms:

```java
// Stream pipeline replaces the imperative loop + manual Optional construction
Optional<String> result = users.stream()
        .filter(user -> user.age() > 18 && user.active())
        .map(user -> user.name().toUpperCase())
        .findFirst();

// If you still need the full list AND the first element:
List<String> names = users.stream()
        .filter(user -> user.age() > 18 && user.active())
        .map(user -> user.name().toUpperCase())
        .toList();  // Java 16+ immutable list -- replaces Collectors.toList()

Optional<String> result = names.stream().findFirst();
```

**Key improvements explained:**

1. **Record class** -- `User` is a data carrier. Records provide `equals()`, `hashCode()`, `toString()`, and accessor methods automatically. Accessor methods use the field name directly (`user.name()`) instead of `user.getName()`.

2. **`toList()`** -- Returns an unmodifiable list. Shorter and more intentional than `Collectors.toList()` which returns a mutable `ArrayList`.

3. **`findFirst()` returns `Optional` directly** -- Eliminates the manual ternary check for emptiness entirely.

4. **Immutability by default** -- No `new ArrayList<>()` mutation. The stream pipeline is a single declarative expression.

If the `User` type comes from a JPA entity or external library and cannot be a record, the stream code still applies unchanged -- just keep using `user.getName()` style accessors.

**Bonus -- if you need to branch on the result with pattern matching (Java 21):**

```java
result.ifPresentOrElse(
    name -> System.out.println("Found: " + name),
    ()   -> System.out.println("No matching user found")
);
```

---

## Task 2

### Reducing Spring Boot 3 Startup Time (25s with 200+ beans, 50 JPA entities)

The problem has multiple contributing factors. Address them in order of impact.

### 1. Enable Lazy Initialization (Biggest Quick Win)

```yaml
# application.yml
spring:
  main:
    lazy-initialization: true
```

This defers bean creation until first use. For 200+ beans, this alone can cut startup by 40-60%. The tradeoff is that the first request to each bean will be slightly slower.

To exclude critical beans from lazy init (e.g., event listeners, scheduled tasks):

```java
@Configuration
@Lazy(false)  // This config class and its beans initialize eagerly
public class CriticalBeansConfig {

    @Bean
    public KafkaListenerContainerFactory<?> kafkaListenerFactory() {
        // ...
    }
}
```

### 2. Narrow Component Scanning

Replace broad scanning:

```java
// BAD: scans everything under com.example
@SpringBootApplication
public class App {}

// GOOD: explicit, narrow base packages
@SpringBootApplication(scanBasePackages = {
    "com.example.api",
    "com.example.service",
    "com.example.config"
})
public class App {}
```

Even better, reduce auto-configuration overhead by excluding what you do not use:

```java
@SpringBootApplication(exclude = {
    DataSourceAutoConfiguration.class,     // if using custom datasource
    SecurityAutoConfiguration.class,       // if not using Spring Security
    MailSenderAutoConfiguration.class,
    ThymeleafAutoConfiguration.class,
    JmxAutoConfiguration.class
})
```

To find out what auto-configurations are active, add to `application.yml`:

```yaml
logging:
  level:
    org.springframework.boot.autoconfigure: DEBUG
```

### 3. Optimize JPA / Hibernate Startup

JPA entity scanning and metadata building is expensive with 50 entities.

```yaml
spring:
  jpa:
    defer-datasource-initialization: true
    properties:
      hibernate:
        # Disable schema validation at startup (use Flyway instead)
        hbm2ddl.auto: none
        # Disable bytecode enhancement if not needed
        enhancer.enableDirtyTracking: false
        enhancer.enableLazyInitialization: false
    open-in-view: false  # Also a performance best practice
```

Move DDL management to Flyway/Liquibase and disable Hibernate's schema operations entirely.

### 4. Use Spring Boot's AOT and CDS (Java 21 specific)

**Class Data Sharing (CDS) -- available since Spring Boot 3.3:**

```bash
# Step 1: Training run to generate CDS archive
java -XX:ArchiveClassesAtExit=app-cds.jsa -jar myapp.jar &
# Wait for startup, then kill
kill $!

# Step 2: Production run using the archive
java -XX:SharedArchiveFile=app-cds.jsa -jar myapp.jar
```

CDS pre-loads class metadata, reducing startup by 20-30%.

**Spring AOT processing (build time):**

```xml
<!-- pom.xml -->
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

### 5. GraalVM Native Image (Nuclear Option)

If sub-second startup is required:

```bash
mvn -Pnative native:compile
```

This compiles to a native binary with ~100ms startup. Requires testing all reflection-heavy code paths and may need GraalVM configuration hints for JPA entities.

### 6. Profile-Guided Optimization (Measure First)

Before applying fixes blindly, profile what is actually slow:

```java
@SpringBootApplication
public class App {
    public static void main(String[] args) {
        new SpringApplicationBuilder(App.class)
            .applicationStartup(new BufferingApplicationStartup(2048))
            .run(args);
    }
}
```

Then hit `GET /actuator/startup` to see exactly which steps are slow.

### Expected Impact

| Optimization | Typical Reduction |
|---|---|
| Lazy initialization | 40-60% |
| Narrow scanning + exclude auto-configs | 10-20% |
| JPA optimization | 10-15% |
| CDS archive | 20-30% |
| GraalVM native | 95%+ (sub-second) |

Applying lazy init + JPA optimization + CDS should bring startup from 25s down to 5-8s without major code changes.

---

## Task 3

### Retry with Exponential Backoff and Circuit Breaker

Use Resilience4j, which is the standard library for Spring Boot 3 (Hystrix is EOL).

**Dependencies (Maven):**

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

**Configuration:**

```yaml
# application.yml
resilience4j:
  retry:
    instances:
      externalApi:
        max-attempts: 3
        wait-duration: 1s
        exponential-backoff-multiplier: 2
        exponential-max-wait-duration: 10s
        retry-exceptions:
          - java.io.IOException
          - java.net.SocketTimeoutException
          - org.springframework.web.client.ResourceAccessException
        ignore-exceptions:
          - com.example.NonRetryableException

  circuitbreaker:
    instances:
      externalApi:
        failure-rate-threshold: 50
        slow-call-rate-threshold: 80
        slow-call-duration-threshold: 3s
        sliding-window-type: COUNT_BASED
        sliding-window-size: 10
        minimum-number-of-calls: 5
        wait-duration-in-open-state: 30s
        permitted-number-of-calls-in-half-open-state: 3
        automatic-transition-from-open-to-half-open-enabled: true
```

**Service implementation:**

```java
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ExternalApiClient {

    private final RestClient restClient;

    public ExternalApiClient(RestClient.Builder builder) {
        this.restClient = builder
                .baseUrl("https://api.external-service.com")
                .defaultHeader("Accept", "application/json")
                .build();
    }

    // CircuitBreaker wraps Retry -- order matters.
    // If circuit is OPEN, the call is rejected immediately without retrying.
    @CircuitBreaker(name = "externalApi", fallbackMethod = "fallback")
    @Retry(name = "externalApi")
    public ApiResponse fetchData(String resourceId) {
        return restClient.get()
                .uri("/resources/{id}", resourceId)
                .retrieve()
                .body(ApiResponse.class);
    }

    // Fallback when circuit is open or all retries exhausted
    private ApiResponse fallback(String resourceId, Throwable ex) {
        return new ApiResponse(resourceId, "unavailable", Instant.now());
    }
}

public record ApiResponse(String id, String data, Instant timestamp) {}
```

**Programmatic control (without annotations):**

```java
@Service
public class ExternalApiClient {

    private final RestClient restClient;
    private final CircuitBreaker circuitBreaker;
    private final Retry retry;

    public ExternalApiClient(
            RestClient.Builder builder,
            CircuitBreakerRegistry cbRegistry,
            RetryRegistry retryRegistry) {

        this.restClient = builder.baseUrl("https://api.external-service.com").build();
        this.circuitBreaker = cbRegistry.circuitBreaker("externalApi");
        this.retry = retryRegistry.retry("externalApi");
    }

    public ApiResponse fetchData(String resourceId) {
        // Compose: CircuitBreaker -> Retry -> actual call
        Supplier<ApiResponse> decorated = CircuitBreaker.decorateSupplier(
                circuitBreaker,
                Retry.decorateSupplier(retry, () -> doFetch(resourceId))
        );

        return Try.ofSupplier(decorated)
                .recover(CallNotPermittedException.class,
                         ex -> new ApiResponse(resourceId, "circuit-open", Instant.now()))
                .get();
    }

    private ApiResponse doFetch(String resourceId) {
        return restClient.get()
                .uri("/resources/{id}", resourceId)
                .retrieve()
                .body(ApiResponse.class);
    }
}
```

**Virtual-thread-friendly variant using Java 21 HttpClient:**

```java
@Service
public class ExternalApiClient {

    private final HttpClient httpClient;
    private final CircuitBreaker circuitBreaker;
    private final Retry retry;
    private final ObjectMapper objectMapper;

    public ExternalApiClient(
            CircuitBreakerRegistry cbRegistry,
            RetryRegistry retryRegistry,
            ObjectMapper objectMapper) {

        this.httpClient = HttpClient.newBuilder()
                .executor(Executors.newVirtualThreadPerTaskExecutor())
                .connectTimeout(Duration.ofSeconds(5))
                .build();
        this.circuitBreaker = cbRegistry.circuitBreaker("externalApi");
        this.retry = retryRegistry.retry("externalApi");
        this.objectMapper = objectMapper;
    }

    public ApiResponse fetchData(String resourceId) {
        Supplier<ApiResponse> decorated = CircuitBreaker.decorateSupplier(
                circuitBreaker,
                Retry.decorateSupplier(retry, () -> {
                    try {
                        var request = HttpRequest.newBuilder()
                                .uri(URI.create(
                                    "https://api.external-service.com/resources/" + resourceId))
                                .GET()
                                .timeout(Duration.ofSeconds(10))
                                .build();

                        var response = httpClient.send(request,
                                HttpResponse.BodyHandlers.ofString());

                        if (response.statusCode() >= 500) {
                            throw new RuntimeException(
                                "Server error: " + response.statusCode());
                        }

                        return objectMapper.readValue(
                                response.body(), ApiResponse.class);
                    } catch (IOException | InterruptedException e) {
                        throw new RuntimeException(e);
                    }
                })
        );

        return decorated.get();
    }
}
```

The retry sequence: 1st attempt fails -> wait 1s -> 2nd attempt fails -> wait 2s -> 3rd attempt fails -> exception propagated. If 5+ of the last 10 calls fail (50%), the circuit opens and all subsequent calls are rejected immediately for 30 seconds, then it transitions to half-open to test recovery.

---

## Task 4

### Diagnosing and Fixing a ConcurrentHashMap Memory Leak

**Root Cause Analysis**

The symptom -- heap growing from 512MB to 4GB over 24 hours with a ConcurrentHashMap cache -- is a classic unbounded cache problem. Kafka messages are consumed continuously, results are stored in the map, but entries are never evicted. The map grows monotonically until OOM.

### Step 1: Diagnose (Confirm the Hypothesis)

**Enable GC logging to observe heap growth pattern:**

```bash
java -Xmx4g \
     -Xlog:gc*:file=/var/log/app/gc.log:time,uptime,level,tags:filecount=5,filesize=50m \
     -XX:+HeapDumpOnOutOfMemoryError \
     -XX:HeapDumpPath=/var/log/app/heap-dump.hprof \
     -jar app.jar
```

**Take a heap dump from a running instance without waiting for OOM:**

```bash
# Find the PID
jps -l

# Dump the heap using jcmd (preferred on modern JVMs)
jcmd <PID> GC.heap_dump /tmp/heap-dump.hprof
```

**Quick check -- what dominates the heap:**

```bash
jcmd <PID> GC.class_histogram | head -30
```

You will almost certainly see `ConcurrentHashMap$Node` and your cached value type dominating the retained heap.

**Monitor map size at runtime:**

```java
@Scheduled(fixedRate = 60_000)
public void logCacheSize() {
    log.info("Cache size: {} entries, estimated memory: {} MB",
            cache.size(),
            cache.size() * ESTIMATED_ENTRY_SIZE_BYTES / (1024 * 1024));
}
```

### Step 2: Fix -- Replace ConcurrentHashMap with a Bounded Cache

**Use Caffeine (recommended):**

```java
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

@Configuration
public class CacheConfig {

    @Bean
    public Cache<String, ProcessingResult> resultCache() {
        return Caffeine.newBuilder()
                .maximumSize(100_000)                    // Hard cap on entries
                .expireAfterWrite(Duration.ofHours(1))   // TTL per entry
                .expireAfterAccess(Duration.ofMinutes(30)) // Evict if not read
                .recordStats()                           // For monitoring
                .removalListener((key, value, cause) ->
                    log.debug("Cache eviction: key={}, cause={}", key, cause))
                .build();
    }
}

@Service
public class KafkaMessageProcessor {

    private final Cache<String, ProcessingResult> cache;

    public KafkaMessageProcessor(Cache<String, ProcessingResult> cache) {
        this.cache = cache;
    }

    @KafkaListener(topics = "input-topic")
    public void process(ConsumerRecord<String, String> record) {
        String key = record.key();

        ProcessingResult result = cache.get(key, k -> {
            // Compute only if not cached
            return computeExpensiveResult(record.value());
        });

        // Use result...
    }
}
```

**If you must use ConcurrentHashMap, add manual eviction:**

```java
@Service
public class BoundedMapCache {

    private record CachedEntry<V>(V value, Instant createdAt) {}

    private final ConcurrentHashMap<String, CachedEntry<ProcessingResult>> cache
            = new ConcurrentHashMap<>();

    private static final int MAX_SIZE = 100_000;
    private static final Duration TTL = Duration.ofHours(1);

    public void put(String key, ProcessingResult value) {
        if (cache.size() >= MAX_SIZE) {
            evictOldest();
        }
        cache.put(key, new CachedEntry<>(value, Instant.now()));
    }

    public Optional<ProcessingResult> get(String key) {
        var entry = cache.get(key);
        if (entry == null) return Optional.empty();

        if (entry.createdAt().plus(TTL).isBefore(Instant.now())) {
            cache.remove(key);
            return Optional.empty();
        }
        return Optional.of(entry.value());
    }

    @Scheduled(fixedRate = 300_000) // Every 5 minutes
    public void evictExpired() {
        Instant cutoff = Instant.now().minus(TTL);
        cache.entrySet().removeIf(e -> e.getValue().createdAt().isBefore(cutoff));
        log.info("Cache size after eviction: {}", cache.size());
    }

    private void evictOldest() {
        int toRemove = MAX_SIZE / 10;
        cache.entrySet().stream()
                .sorted(Comparator.comparing(e -> e.getValue().createdAt()))
                .limit(toRemove)
                .forEach(e -> cache.remove(e.getKey()));
    }
}
```

Use Caffeine. It handles eviction, concurrency, and statistics correctly. The manual ConcurrentHashMap approach has race conditions under high concurrency and is shown only to illustrate the concept.

### Step 3: Add Monitoring to Prevent Recurrence

```java
@Configuration
public class CacheMetricsConfig {

    @Bean
    public MeterBinder cacheMetrics(Cache<String, ProcessingResult> cache) {
        return new CaffeineCacheMetrics<>(cache, "kafka-result-cache",
                Collections.emptyList());
    }
}
```

Set up alerts on cache size:

```yaml
# Prometheus alert rule
groups:
  - name: cache-alerts
    rules:
      - alert: CacheSizeHigh
        expr: cache_size{cache="kafka-result-cache"} > 80000
        for: 5m
        annotations:
          summary: "Cache size exceeding 80% of max capacity"
```

### Other Common Leak Sources to Check

If the problem persists after fixing the cache:

1. **Kafka consumer offsets not committed** -- messages reprocessed and re-cached.
2. **Thread-local variables** in Kafka consumer threads that are never cleaned.
3. **Listeners or callbacks** registered in the map values that hold references to large objects.
4. **String interning** -- if keys are interned strings, they accumulate in the string pool.

---

## Task 5

### Processing 1 Million Records with Fault Tolerance and Resumability

Use Spring Batch, which is purpose-built for this exact scenario. It provides chunked processing, automatic retry, skip policies, job restartability, and progress tracking out of the box.

**Dependencies:**

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

**Domain model:**

```java
public record SourceRecord(Long id, String data, Instant createdAt) {}

public record TargetRecord(
    Long sourceId,
    String transformedData,
    String checksum,
    Instant processedAt
) {}
```

**Batch job configuration:**

```java
@Configuration
public class RecordProcessingJobConfig {

    private static final int CHUNK_SIZE = 500;
    private static final int PAGE_SIZE = 500;

    @Bean
    public Job recordProcessingJob(
            JobRepository jobRepository,
            Step processStep,
            JobCompletionListener listener) {

        return new JobBuilder("recordProcessingJob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .listener(listener)
                .start(processStep)
                .build();
    }

    @Bean
    public Step processStep(
            JobRepository jobRepository,
            PlatformTransactionManager txManager,
            ItemReader<SourceRecord> reader,
            ItemProcessor<SourceRecord, TargetRecord> processor,
            ItemWriter<TargetRecord> writer,
            SkipPolicy skipPolicy) {

        return new StepBuilder("processStep", jobRepository)
                .<SourceRecord, TargetRecord>chunk(CHUNK_SIZE, txManager)
                .reader(reader)
                .processor(processor)
                .writer(writer)
                .faultTolerant()
                .skipPolicy(skipPolicy)
                .retryLimit(3)
                .retry(TransientDataAccessException.class)
                .retry(DeadlockLoserDataAccessException.class)
                .listener(new ChunkProgressListener())
                .taskExecutor(batchTaskExecutor())
                .throttleLimit(4)  // Parallel chunk processing
                .build();
    }

    /**
     * JdbcPagingItemReader is restartable -- on job restart, it resumes
     * from the last committed chunk, not from the beginning.
     */
    @Bean
    @StepScope
    public JdbcPagingItemReader<SourceRecord> reader(
            @Qualifier("sourceDataSource") DataSource sourceDs) {

        var queryProvider = new SqlPagingQueryProviderFactoryBean();
        queryProvider.setDataSource(sourceDs);
        queryProvider.setSelectClause("SELECT id, data, created_at");
        queryProvider.setFromClause("FROM source_records");
        queryProvider.setSortKey("id");  // Deterministic ordering for restartability

        return new JdbcPagingItemReaderBuilder<SourceRecord>()
                .name("sourceRecordReader")
                .dataSource(sourceDs)
                .queryProvider(queryProvider.getObject())
                .pageSize(PAGE_SIZE)
                .rowMapper((rs, rowNum) -> new SourceRecord(
                        rs.getLong("id"),
                        rs.getString("data"),
                        rs.getTimestamp("created_at").toInstant()))
                .build();
    }

    @Bean
    public ItemProcessor<SourceRecord, TargetRecord> processor() {
        return source -> {
            String transformed = transform(source.data());
            String checksum = computeChecksum(transformed);

            return new TargetRecord(
                    source.id(),
                    transformed,
                    checksum,
                    Instant.now());
        };
    }

    @Bean
    public JdbcBatchItemWriter<TargetRecord> writer(
            @Qualifier("targetDataSource") DataSource targetDs) {

        return new JdbcBatchItemWriterBuilder<TargetRecord>()
                .dataSource(targetDs)
                .sql("""
                    INSERT INTO target_records (source_id, transformed_data, checksum, processed_at)
                    VALUES (:sourceId, :transformedData, :checksum, :processedAt)
                    ON CONFLICT (source_id) DO UPDATE SET
                        transformed_data = EXCLUDED.transformed_data,
                        checksum = EXCLUDED.checksum,
                        processed_at = EXCLUDED.processed_at
                    """)
                .beanMapped()
                .build();
    }

    @Bean
    public SkipPolicy skipPolicy() {
        return (throwable, skipCount) -> {
            if (throwable instanceof NonTransientDataAccessException) {
                return false;  // Do not skip -- fail the job
            }
            if (throwable instanceof ValidationException) {
                return skipCount < 1000;  // Skip bad records up to limit
            }
            return false;
        };
    }

    @Bean
    public TaskExecutor batchTaskExecutor() {
        // Use virtual threads for parallel chunk processing
        return new TaskExecutorAdapter(
                Executors.newVirtualThreadPerTaskExecutor());
    }

    private String transform(String data) {
        // Your transformation logic here
        return data.toUpperCase();
    }

    private String computeChecksum(String data) {
        return Integer.toHexString(data.hashCode());
    }
}
```

**Dual DataSource configuration:**

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
      hikari:
        maximum-pool-size: 5
        read-only: true
    target:
      url: jdbc:postgresql://target-db:5432/target
      username: writer
      password: ${TARGET_DB_PASSWORD}
      hikari:
        maximum-pool-size: 10
```

**Progress monitoring listener:**

```java
public class ChunkProgressListener implements ChunkListener {

    private static final Logger log = LoggerFactory.getLogger(ChunkProgressListener.class);
    private final AtomicLong processedCount = new AtomicLong(0);
    private volatile Instant startTime;

    @Override
    public void beforeChunk(ChunkContext context) {
        if (startTime == null) {
            startTime = Instant.now();
        }
    }

    @Override
    public void afterChunk(ChunkContext context) {
        long count = processedCount.addAndGet(
                context.getStepContext().getStepExecution().getWriteCount());
        long elapsed = Duration.between(startTime, Instant.now()).toSeconds();
        double rate = elapsed > 0 ? (double) count / elapsed : 0;

        if (count % 10_000 == 0) {
            log.info("Progress: {} records processed, {}/sec, elapsed: {}s",
                    count, String.format("%.1f", rate), elapsed);
        }
    }

    @Override
    public void afterChunkError(ChunkContext context) {
        log.error("Chunk failed at count: {}", processedCount.get());
    }
}
```

**Job completion listener:**

```java
@Component
public class JobCompletionListener implements JobExecutionListener {

    private static final Logger log = LoggerFactory.getLogger(JobCompletionListener.class);

    @Override
    public void afterJob(JobExecution execution) {
        var status = execution.getStatus();
        var duration = Duration.between(
                execution.getStartTime(), execution.getEndTime());

        log.info("Job finished: status={}, duration={}, read={}, written={}, skipped={}",
                status,
                duration,
                execution.getStepExecutions().stream()
                        .mapToLong(StepExecution::getReadCount).sum(),
                execution.getStepExecutions().stream()
                        .mapToLong(StepExecution::getWriteCount).sum(),
                execution.getStepExecutions().stream()
                        .mapToLong(StepExecution::getSkipCount).sum());

        if (status == BatchStatus.FAILED) {
            execution.getAllFailureExceptions().forEach(ex ->
                    log.error("Failure: {}", ex.getMessage()));
        }
    }
}
```

**Triggering and restarting the job:**

```java
@RestController
@RequestMapping("/api/batch")
public class BatchController {

    private final JobLauncher jobLauncher;
    private final JobExplorer jobExplorer;
    private final Job recordProcessingJob;

    public BatchController(JobLauncher jobLauncher, JobExplorer jobExplorer,
                          @Qualifier("recordProcessingJob") Job recordProcessingJob) {
        this.jobLauncher = jobLauncher;
        this.jobExplorer = jobExplorer;
        this.recordProcessingJob = recordProcessingJob;
    }

    @PostMapping("/start")
    public ResponseEntity<String> startJob() throws Exception {
        var params = new JobParametersBuilder()
                .addLong("timestamp", System.currentTimeMillis())
                .toJobParameters();

        var execution = jobLauncher.run(recordProcessingJob, params);
        return ResponseEntity.ok("Job started: " + execution.getId());
    }

    @PostMapping("/restart/{executionId}")
    public ResponseEntity<String> restartJob(@PathVariable long executionId)
            throws Exception {
        // Spring Batch automatically resumes from the last committed chunk
        var lastExecution = jobExplorer.getJobExecution(executionId);
        if (lastExecution == null || lastExecution.getStatus() != BatchStatus.FAILED) {
            return ResponseEntity.badRequest()
                    .body("Can only restart FAILED jobs");
        }

        var execution = jobLauncher.run(
                recordProcessingJob, lastExecution.getJobParameters());
        return ResponseEntity.ok("Job restarted: " + execution.getId());
    }
}
```

**How resumability works:**

Spring Batch stores job execution metadata (which chunk was last committed) in its own tables (`BATCH_JOB_EXECUTION`, `BATCH_STEP_EXECUTION`, etc.). When a failed job is restarted:

1. The `JdbcPagingItemReader` reads its last committed read count from the step execution context.
2. It skips already-processed pages and resumes from the exact point of failure.
3. The `ON CONFLICT` clause in the writer makes the operation idempotent -- re-processing a record that was already written is safe.

**Performance expectations:** With a chunk size of 500 and 4 parallel threads using virtual threads, expect throughput of 5,000-20,000 records/second depending on transformation complexity and database latency. The full 1 million records should complete in 1-3 minutes for simple transformations.
