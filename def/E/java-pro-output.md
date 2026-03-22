## Task 1

### Migrate Java 8 Code to Java 21 Idioms

The original code uses an imperative loop, manual list construction, and a ternary for `Optional` creation. Here is the modernized Java 21 version:

```java
Optional<String> result = users.stream()
        .filter(user -> user.getAge() > 18 && user.isActive())
        .map(user -> user.getName().toUpperCase())
        .findFirst();
```

**What changed and why:**

1. **Imperative loop replaced with Stream pipeline.** The stream version is declarative, concise, and communicates intent directly.

2. **Mutable `ArrayList` eliminated.** The stream's `findFirst()` short-circuits -- it stops processing as soon as the first match is found, which is more performant for large collections.

3. **Manual `Optional` construction replaced with `findFirst()`.** The ternary `names.isEmpty() ? Optional.empty() : Optional.of(names.get(0))` is exactly what `findFirst()` returns natively.

4. **If the full list is also needed**, the modern idiom would be:

```java
List<String> names = users.stream()
        .filter(user -> user.getAge() > 18 && user.isActive())
        .map(user -> user.getName().toUpperCase())
        .toList();  // Java 16+ unmodifiable list

Optional<String> result = names.stream().findFirst();
```

Additionally, if `User` is a plain data carrier, consider converting it to a `record`:

```java
public record User(String name, int age, boolean active) {}
```

---

## Task 2

### Reducing Spring Boot 3 Startup Time (25 seconds)

A 25-second startup with 200+ beans and 50 JPA entities indicates multiple compounding problems. Systematic approach, ordered by expected impact:

**Step 1: Measure Before Optimizing**

```bash
java -jar app.jar --spring.main.startup=buffered
```

Then hit `/actuator/startup` to see which beans are slow.

**Step 2: Narrow Component Scanning**

```java
@SpringBootApplication(scanBasePackages = "com.example.myapp")
```

**Step 3: Lazy Initialization**

```properties
spring.main.lazy-initialization=true
```

**Step 4: JPA / Hibernate Optimization**

```properties
spring.jpa.hibernate.ddl-auto=none
spring.jpa.open-in-view=false
spring.jpa.properties.hibernate.enhancer.enableLazyInitialization=true
```

**Step 5: Spring AOT + CDS**

```bash
./mvnw spring-boot:process-aot
java -Dspring.context.exit=onRefresh -XX:ArchiveClassesAtExit=app-cds.jsa -jar app.jar
java -XX:SharedArchiveFile=app-cds.jsa -jar app.jar
```

**Step 6: Audit @PostConstruct Methods**

Move heavy work to `ApplicationReadyEvent` listener or background thread:

```java
@EventListener(ApplicationReadyEvent.class)
public void warmUpCache() {
    Thread.ofVirtual().start(this::loadCacheFromDatabase);
}
```

**Step 7: GraalVM Native Image (Nuclear Option)**

```bash
./mvnw -Pnative native:compile
```

**Expected Results:**

| Optimization | Typical Savings |
|---|---|
| Narrow component scan | 2-4s |
| Lazy initialization | 5-10s (deferred) |
| Disable DDL validation | 2-5s |
| Spring AOT + CDS | 3-7s |
| Move @PostConstruct to async | Variable |

Combined, well under 10 seconds on JVM, or under 1 second with native image.

---

## Task 3

### Retry with Exponential Backoff and Circuit Breaker

Using **Spring Boot 3 + Resilience4j**.

**Configuration:**

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
          - java.net.http.HttpTimeoutException
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

**Implementation:**

```java
@Service
public class ExternalApiClient {

    private final RestClient restClient;

    public ExternalApiClient(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder
                .baseUrl("https://api.external-service.com")
                .build();
    }

    @Retry(name = "externalApi", fallbackMethod = "fetchDataFallback")
    @CircuitBreaker(name = "externalApi", fallbackMethod = "fetchDataFallback")
    public ApiResponse fetchData(String resourceId) {
        return restClient.get()
                .uri("/resources/{id}", resourceId)
                .retrieve()
                .body(ApiResponse.class);
    }

    private ApiResponse fetchDataFallback(String resourceId, Throwable throwable) {
        if (throwable instanceof CallNotPermittedException) {
            throw new ExternalApiException("Circuit breaker is open", throwable);
        }
        throw new ExternalApiException("Failed after retries for: " + resourceId, throwable);
    }
}
```

**Annotation ordering matters:** `@Retry` is applied first (inner), `@CircuitBreaker` wraps it (outer). Each retry attempt counts individually toward the circuit breaker's failure rate.

---

## Task 4

### Diagnosing and Fixing the ConcurrentHashMap Memory Leak

**Root Cause:** `ConcurrentHashMap` has no eviction policy. Every Kafka message adds an entry, but nothing removes old entries. Over 24 hours, the map exhausts the heap.

**Diagnosis:**

```bash
# Auto-dump on OOM
-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/log/app/heap.hprof
```

Open in Eclipse MAT. Expected: a single `ConcurrentHashMap` dominating retained heap.

**Fix: Replace with Caffeine Cache**

```java
@Configuration
public class CacheConfig {
    @Bean
    public Cache<String, ProcessedResult> resultCache() {
        return Caffeine.newBuilder()
                .maximumSize(100_000)
                .expireAfterAccess(Duration.ofHours(1))
                .recordStats()
                .build();
    }
}
```

```java
@Service
public class KafkaMessageProcessor {
    private final Cache<String, ProcessedResult> resultCache;

    @KafkaListener(topics = "input-topic")
    public void process(ConsumerRecord<String, String> record) {
        String key = record.key();
        ProcessedResult result = transform(record.value());
        resultCache.put(key, result);
    }
}
```

**Additional safeguards:**
- Monitor cache size via Micrometer
- Add `-XX:+ExitOnOutOfMemoryError` JVM flag
- Question whether the cache is needed at all -- if results go to a DB or another Kafka topic, the cache may be redundant

---

## Task 5

### Processing 1 Million Records -- Resumable Batch Pipeline

**Framework: Spring Batch** -- purpose-built for chunk-oriented processing with restart/resume.

```
[Source DB] --cursor--> [ItemReader] --chunk(500)--> [ItemProcessor] --> [ItemWriter] --batch--> [Target DB]
                                          |
                                   [JobRepository]  (tracks progress for resumability)
```

**Implementation:**

```java
@Configuration
@EnableBatchProcessing
public class RecordMigrationJobConfig {

    @Bean
    @StepScope
    public JdbcCursorItemReader<SourceRecord> reader(
            @Qualifier("sourceDataSource") DataSource sourceDataSource) {
        return new JdbcCursorItemReaderBuilder<SourceRecord>()
                .name("sourceRecordReader")
                .dataSource(sourceDataSource)
                .sql("SELECT id, data, created_at FROM source_records ORDER BY id")
                .rowMapper((rs, rowNum) -> new SourceRecord(
                        rs.getLong("id"), rs.getString("data"),
                        rs.getTimestamp("created_at").toInstant()))
                .saveState(true)
                .fetchSize(500)
                .build();
    }

    @Bean
    public JdbcBatchItemWriter<TargetRecord> writer(
            @Qualifier("targetDataSource") DataSource targetDataSource) {
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

    @Bean
    public Step migrationStep(JobRepository jobRepository,
                              PlatformTransactionManager transactionManager,
                              JdbcCursorItemReader<SourceRecord> reader,
                              ItemProcessor<SourceRecord, TargetRecord> processor,
                              JdbcBatchItemWriter<TargetRecord> writer) {
        return new StepBuilder("migrationStep", jobRepository)
                .<SourceRecord, TargetRecord>chunk(500, transactionManager)
                .reader(reader)
                .processor(processor)
                .writer(writer)
                .faultTolerant()
                .skipLimit(100)
                .skip(TransformationException.class)
                .retryLimit(3)
                .retry(TransientDataAccessException.class)
                .taskExecutor(taskExecutor())
                .throttleLimit(4)
                .build();
    }

    @Bean
    public TaskExecutor taskExecutor() {
        SimpleAsyncTaskExecutor executor = new SimpleAsyncTaskExecutor("batch-");
        executor.setVirtualThreads(true);
        executor.setConcurrencyLimit(4);
        return executor;
    }
}
```

**How resumability works:**
1. Spring Batch JobRepository tracks which chunks have been committed.
2. If the process crashes at record 350,000, restarting resumes from that position.
3. `ON CONFLICT` / `UPSERT` ensures idempotency.
4. `ORDER BY id` ensures deterministic ordering across restarts.

**Performance:** ~10,000-50,000 records/minute. Memory: constant ~50-100MB regardless of total count. 1M records: approximately 20-100 minutes.
