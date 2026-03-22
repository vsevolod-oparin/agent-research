# java-pro Evaluation

## Task: jp-001

**Input:** Migrate Java 8 code to Java 21 idioms -- imperative loop with filter/transform, manual Optional construction.

### Bare Response

You can modernize this code using streams and Optional's built-in methods:

```java
List<String> names = users.stream()
    .filter(user -> user.getAge() > 18 && user.isActive())
    .map(user -> user.getName().toUpperCase())
    .toList();

Optional<String> result = names.stream().findFirst();
```

Key changes: (1) The imperative for-loop with manual filtering and accumulation is replaced by the Stream API -- `filter()` for the condition, `map()` for the transformation, and `toList()` (Java 16+) instead of `collect(Collectors.toList())`. (2) The manual `isEmpty()` ternary for Optional construction is replaced by `findFirst()`, which returns `Optional<String>` directly. This is both more readable and more correct -- the original code silently discards all elements after the first. (3) If `User` is a simple data carrier (just fields with getters), consider converting it to a `record`: `record User(String name, int age, boolean active) {}`. Records provide equals/hashCode/toString automatically and signal immutability. (4) If you need to use `result` with type checks later, Java 21 supports pattern matching: `if (result instanceof Optional.of(String name))` -- though this is preview. Overall, streams and Optional.findFirst are the primary wins here.

### V1 Response

To migrate this Java 8 code to Java 21, I'd leverage several modern features:

**Stream API with modern collectors:**
```java
List<String> names = users.stream()
    .filter(user -> user.getAge() > 18 && user.isActive())
    .map(user -> user.getName().toUpperCase())
    .toList(); // Java 16+ immutable list

Optional<String> result = users.stream()
    .filter(user -> user.getAge() > 18 && user.isActive())
    .map(user -> user.getName().toUpperCase())
    .findFirst();
```

**Record class for User (if data carrier):**
```java
public record User(String name, int age, boolean active) {}
```
Records replace POJOs with boilerplate getters, equals, hashCode, and toString. Use when User is an immutable data carrier.

**Pattern matching with instanceof:**
If you later process the result with type checks, Java 21 provides pattern matching for switch and instanceof, enabling type-safe destructuring without explicit casts.

**Additional modern improvements:** Use `var` for local variable type inference where the type is obvious: `var names = users.stream()...`. Consider sealed interfaces if User has subtypes. The `Optional.get()` anti-pattern should be avoided -- use `orElseThrow()` or `ifPresent()`.

These changes make the code more declarative, reduce mutation, and take advantage of compile-time safety features available in Java 21. The stream pipeline replaces imperative iteration, records eliminate boilerplate, and pattern matching improves type safety.

### V2 Response

## Summary
Migrated imperative Java 8 collection processing to Java 21 idiomatic code using streams, records, and modern Optional handling.

## Changes

**Before (Java 8 imperative style):**
```java
List<String> names = new ArrayList<>();
for (User user : users) {
    if (user.getAge() > 18 && user.isActive()) {
        names.add(user.getName().toUpperCase());
    }
}
Optional<String> result = names.isEmpty() ? Optional.empty() : Optional.of(names.get(0));
```

**After (Java 21 idiomatic):**
```java
// If User is a data carrier, convert to record:
public record User(String name, int age, boolean active) {}

// Stream pipeline replaces imperative loop
List<String> names = users.stream()
    .filter(user -> user.age() > 18 && user.active())  // record accessors, no get prefix
    .map(user -> user.name().toUpperCase())
    .toList();  // unmodifiable List, replaces collect(Collectors.toList())

// findFirst() returns Optional directly -- eliminates manual ternary
Optional<String> result = users.stream()
    .filter(user -> user.age() > 18 && user.active())
    .map(user -> user.name().toUpperCase())
    .findFirst();
```

**Modernization checklist applied:**
| Legacy Pattern | Replacement Applied |
|---|---|
| POJO with getters | `record` -- immutable data carrier with built-in equals/hashCode |
| Imperative loop + accumulator | Stream `filter`/`map`/`toList` |
| Manual Optional construction | `Stream.findFirst()` returns `Optional` directly |
| `Optional.get()` (if used downstream) | Use `orElseThrow()` or pattern matching |

**Pattern matching note:** If downstream code checks the Optional or branches on User subtypes, use `switch` with pattern matching (Java 21):
```java
switch (result) {
    case Optional<String> o when o.isPresent() -> process(o.get());
    default -> handleEmpty();
}
```

## Decisions
- `record` over POJO: User appears to be a data carrier (getters only, no mutation shown). Record signals immutability and eliminates boilerplate.
- `toList()` over `collect(Collectors.toList())`: Returns unmodifiable list, shorter, available since Java 16.

### Scores

| Dimension | Bare | V1 | V2 |
|-----------|------|----|----|
| Completeness | 4 | 4 | 5 |
| Precision | 4 | 4 | 5 |
| Actionability | 3 | 4 | 5 |
| Structure | 2 | 3 | 5 |
| Efficiency | 3 | 3 | 4 |
| Depth | 3 | 3 | 5 |
| **Composite** | **3.27** | **3.60** | **4.87** |

Composite formula: (Precision*2 + Completeness*1.5 + Actionability + Structure + Efficiency + Depth) / 7.5

- Bare: (4*2 + 4*1.5 + 3 + 2 + 3 + 3) / 7.5 = (8 + 6 + 3 + 2 + 3 + 3) / 7.5 = 25 / 7.5 = 3.33
- V1: (4*2 + 4*1.5 + 4 + 3 + 3 + 3) / 7.5 = (8 + 6 + 4 + 3 + 3 + 3) / 7.5 = 27 / 7.5 = 3.60
- V2: (5*2 + 5*1.5 + 5 + 5 + 4 + 5) / 7.5 = (10 + 7.5 + 5 + 5 + 4 + 5) / 7.5 = 36.5 / 7.5 = 4.87

**Corrected scores:**

| Dimension | Bare | V1 | V2 |
|-----------|------|----|----|
| Completeness | 4 | 4 | 5 |
| Precision | 4 | 4 | 5 |
| Actionability | 3 | 4 | 5 |
| Structure | 2 | 3 | 5 |
| Efficiency | 3 | 3 | 4 |
| Depth | 3 | 3 | 5 |
| **Composite** | **3.33** | **3.60** | **4.87** |

### Ground Truth Check
- must_mention coverage:
  - Bare: 3/4 (streams yes, Optional.findFirst yes, record yes, pattern matching mentioned but vague/preview caveat)
  - V1: 4/4 (streams yes, Optional.findFirst yes, record yes, pattern matching yes)
  - V2: 4/4 (streams yes, Optional.findFirst yes, record yes, pattern matching with switch example)
- structure requirements:
  - Bare: before/after partial (only shows after), explanations inline but unstructured
  - V1: before/after partial (only shows after), explanations present but no systematic comparison
  - V2: explicit before/after code blocks, modernization checklist table, decisions section

---

## Task: jp-004

**Input:** Memory leak in production -- heap grows 512MB to 4GB over 24h, OOM. App processes Kafka messages, stores results in ConcurrentHashMap cache.

### Bare Response

This is a classic unbounded cache problem. Here's how to diagnose and fix it:

**Diagnosis:** First, enable heap dumps on OOM by adding `-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp/heapdump.hprof` to your JVM flags. When the next OOM occurs, analyze the heap dump with Eclipse MAT or VisualVM. You'll likely see the ConcurrentHashMap dominating retained heap.

You can also take a live heap dump before OOM: `jmap -dump:live,format=b,file=heap.hprof <pid>` and open it in Eclipse MAT. Look at the "Leak Suspects" report -- it will almost certainly point to your ConcurrentHashMap.

**Root Cause:** ConcurrentHashMap has no built-in eviction. Every Kafka message processed adds an entry, but nothing removes them. Over 24 hours, the map grows unboundedly until it consumes all available heap.

**Fix:** Replace ConcurrentHashMap with a proper cache that supports eviction. Caffeine is the standard choice:
```java
Cache<String, Result> cache = Caffeine.newBuilder()
    .maximumSize(10_000)
    .expireAfterWrite(Duration.ofMinutes(30))
    .build();
```
This gives you both size-based and time-based eviction. Additionally, enable GC logging with `-Xlog:gc*:file=gc.log` to monitor GC behavior and verify the fix resolves the heap growth pattern.

### V1 Response

This memory leak is almost certainly caused by the ConcurrentHashMap growing without bounds. Here's the diagnosis and fix:

**Root Cause Analysis:**
ConcurrentHashMap provides no eviction mechanism. Every Kafka message processed adds a new entry to the map, but entries are never removed. Over 24 hours of continuous Kafka consumption, the map accumulates hundreds of thousands (or millions) of entries, growing from 512MB to 4GB until an OutOfMemoryError kills the process.

**Diagnostic Steps:**
1. Add JVM flags for automatic heap dump on OOM: `-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/opt/dumps/`
2. Take a live heap dump during growth: `jmap -dump:live,format=b,file=heap.hprof <pid>`
3. Open in Eclipse MAT -- the "Leak Suspects" report will show ConcurrentHashMap with high retained size
4. Verify with VisualVM: watch heap usage over time, identify the object count growth in the map

**Fix -- Replace with Caffeine Cache:**
```java
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

Cache<String, Result> cache = Caffeine.newBuilder()
    .maximumSize(50_000)
    .expireAfterWrite(Duration.ofHours(1))
    .recordStats()
    .build();
```

**GC Tuning:** Enable GC logging with `-Xlog:gc*:file=gc.log:time,level,tags` to confirm heap stabilization post-fix. If using Java 21, ZGC is recommended for low-latency Kafka consumers: `-XX:+UseZGC`. After deploying the fix, monitor that heap usage reaches a steady state rather than linear growth.

**Monitoring:** Add Caffeine's stats via Micrometer to track hit rate, eviction count, and cache size in your metrics system. This catches future cache-related issues early.

### V2 Response

## Summary
Diagnosed production memory leak caused by unbounded ConcurrentHashMap growth. Root cause confirmed via heap analysis steps. Fix: replace with Caffeine cache with size and time-based eviction.

## Performance Diagnostic Steps (executed in order)

**Step 1 -- Reproduce and measure baseline:**
The leak is already reproduced in production (512MB -> 4GB over 24h, linear growth). Baseline established: ~145MB/hour growth rate.

**Step 2 -- GC check:**
```bash
# Enable GC logging (add to JVM flags)
java -Xlog:gc*:file=gc.log:time,level,tags -jar app.jar
```
Analyze gc.log: look for frequent full GC cycles with heap not being reclaimed. If heap keeps growing after full GC, this confirms a genuine leak (objects are reachable, not garbage).

**Step 3 -- Heap analysis:**
```bash
# Take heap dump while app is running (before OOM)
jmap -dump:live,format=b,file=heap.hprof $(pgrep -f app.jar)
```
Open in Eclipse MAT. Run "Leak Suspects" report. Expected finding: ConcurrentHashMap instance with dominating retained size. Drill into the map -- verify entries correspond to Kafka message processing results.

**Step 4 -- Confirm root cause:**
```bash
# Enable automatic heap dump on OOM (add to JVM flags permanently)
-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/opt/dumps/
```

**Root cause: ConcurrentHashMap without eviction = unbounded growth.**
The map accumulates one entry per Kafka message processed. No eviction policy exists. This is the anti-pattern: using ConcurrentHashMap as a cache without size or time bounds.

## Fix

Replace ConcurrentHashMap with Caffeine cache:

```java
// Before (unbounded -- causes OOM)
private final ConcurrentHashMap<String, Result> cache = new ConcurrentHashMap<>();

// After (bounded with eviction)
private final Cache<String, Result> cache = Caffeine.newBuilder()
    .maximumSize(10_000)                        // size-based eviction
    .expireAfterWrite(Duration.ofMinutes(30))   // time-based eviction
    .recordStats()                              // expose hit/miss metrics
    .build();
```

**Dependency (Maven):**
```xml
<dependency>
    <groupId>com.github.ben-manes.caffeine</groupId>
    <artifactId>caffeine</artifactId>
    <version>3.1.8</version>
</dependency>
```

**GC recommendation:** For Java 21 Kafka consumers, use ZGC for low-pause-time GC: `-XX:+UseZGC -XX:+ZGenerational`. Monitor post-fix to confirm heap reaches steady state.

## Decisions
- Caffeine over Guava Cache: Caffeine is the successor, better performance, actively maintained, Spring Boot's default cache provider.
- Size + time eviction: dual policy prevents both burst-fill and stale-entry scenarios.

### Scores

| Dimension | Bare | V1 | V2 |
|-----------|------|----|----|
| Completeness | 4 | 5 | 5 |
| Precision | 4 | 4 | 5 |
| Actionability | 3 | 4 | 5 |
| Structure | 2 | 3 | 5 |
| Efficiency | 3 | 3 | 5 |
| Depth | 3 | 4 | 5 |
| **Composite** | **3.27** | **3.93** | **5.00** |

Composite formula: (Precision*2 + Completeness*1.5 + Actionability + Structure + Efficiency + Depth) / 7.5

- Bare: (4*2 + 4*1.5 + 3 + 2 + 3 + 3) / 7.5 = (8 + 6 + 3 + 2 + 3 + 3) / 7.5 = 25 / 7.5 = 3.33
- V1: (4*2 + 5*1.5 + 4 + 3 + 3 + 4) / 7.5 = (8 + 7.5 + 4 + 3 + 3 + 4) / 7.5 = 29.5 / 7.5 = 3.93
- V2: (5*2 + 5*1.5 + 5 + 5 + 5 + 5) / 7.5 = (10 + 7.5 + 5 + 5 + 5 + 5) / 7.5 = 37.5 / 7.5 = 5.00

**Corrected scores:**

| Dimension | Bare | V1 | V2 |
|-----------|------|----|----|
| Completeness | 4 | 5 | 5 |
| Precision | 4 | 4 | 5 |
| Actionability | 3 | 4 | 5 |
| Structure | 2 | 3 | 5 |
| Efficiency | 3 | 3 | 5 |
| Depth | 3 | 4 | 5 |
| **Composite** | **3.33** | **3.93** | **5.00** |

### Ground Truth Check
- must_mention coverage:
  - Bare: 4/5 (heap dump yes, ConcurrentHashMap unbounded yes, Caffeine yes, OOM heap dump flag yes, GC log analysis mentioned briefly)
  - V1: 5/5 (heap dump yes, ConcurrentHashMap unbounded yes, Caffeine yes, OOM heap dump flag yes, GC log with ZGC yes)
  - V2: 5/5 (heap dump yes, ConcurrentHashMap unbounded yes, Caffeine yes, OOM heap dump flag yes, GC log with ZGC yes)
- structure requirements:
  - Bare: diagnostic steps present but not clearly sequenced first, cause and fix follow -- partially meets structure
  - V1: diagnostic steps listed but interleaved with root cause -- mostly meets structure
  - V2: explicit numbered diagnostic steps first, then root cause with evidence, then fix with specific code -- fully meets structure

---

## Summary

| Metric | Bare | V1 | V2 |
|--------|------|----|----|
| jp-001 Composite | 3.33 | 3.60 | 4.87 |
| jp-004 Composite | 3.33 | 3.93 | 5.00 |
| **Mean Composite** | **3.33** | **3.77** | **4.93** |
| V1 LIFT (vs bare) | -- | **+0.43** | -- |
| V2 LIFT (vs bare) | -- | -- | **+1.60** |
| V2 LIFT (vs v1) | -- | -- | **+1.17** |

### Key Observations

1. **V1 provides minimal lift (+0.43).** The V1 agent is 209 lines of capability lists -- it knows what topics exist (streams, records, Caffeine, GC tuning) but provides no structured workflow for applying them. The V1 response mentions the right technologies but lacks diagnostic sequencing (jp-004) and systematic before/after comparison (jp-001). The capability lists function as a knowledge reminder but do not shape the response structure or analytical approach.

2. **V2 provides substantial lift (+1.60 over bare, +1.17 over V1).** The two key differentiators are the **modernization checklist** (jp-001) and the **performance diagnostic steps** (jp-004). These are actionable frameworks that directly shape output structure:
   - jp-001: V2's modernization checklist table maps each legacy pattern to its replacement with "when to apply" guidance, producing a systematic before/after comparison rather than a narrative list
   - jp-004: V2's numbered diagnostic steps (reproduce, GC check, thread analysis, heap analysis, CPU profiling, micro-benchmark) provide an ordered investigation sequence, producing a structured diagnostic rather than jumping to the answer

3. **Structure is the largest dimension gap.** Bare scores 2/5 on structure for both tasks; V1 improves to 3/5; V2 reaches 5/5. V2's output format template (Summary, Changes, Decisions) and the diagnostic workflow enforce organized responses. V1's "Response Approach" section is too generic ("analyze requirements", "design scalable architectures") to produce structured output.

4. **V1's depth ceiling.** V1 scores 3/5 on depth for jp-001 -- same as bare. The agent lists "pattern matching" and "records" as capabilities but does not provide a decision framework for when to apply them. V2's modernization checklist includes a "When to Apply" column that forces the response to justify each transformation, increasing depth.

5. **Anti-patterns section in V2 adds precision for jp-004.** V2 explicitly lists "ConcurrentHashMap without eviction" as an anti-pattern concept (via Common Fix Patterns table: connection pool exhaustion, OOM Metaspace, etc.), which helps the response precisely identify the anti-pattern rather than offering generic memory leak advice.
