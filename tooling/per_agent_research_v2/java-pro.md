# java-pro - Deep Research Report (v2)

## Eval Performance
- v4: 4.87 (at ceiling across configs D, G, H, I)
- Bare: 4.47
- Agent instructions lift: +0.40 (strongest signal that prompt matters)
- At ceiling -- further prompt improvements unlikely to raise score, but content currency matters

---

## 1. Landscape (March 2026)

### Java Platform Evolution

**JDK 25 LTS (September 2025)** -- the new enterprise baseline. Stable features since JDK 21:
- **Compact source files and instance main methods** (JEP 512) -- simplified entry points
- **Module import declarations** (JEP 511) -- `import module java.base`
- **Flexible constructor bodies** (JEP 513) -- statements before `super()`, validates/computes data pre-super
- **Scoped Values** (JEP 506) -- finalized, replaces ThreadLocal for virtual threads
- **Foreign Function & Memory API** (JEP 454, finalized JDK 22) -- replaces JNI
- **Record Patterns** (finalized JDK 21) -- destructuring in pattern matching
- **String Templates** were removed (withdrawn after JDK 23 preview); no longer on the table
- **Stream Gatherers** (JEP 485, finalized JDK 24) -- custom intermediate stream operations
- **JEP 491: Synchronize Virtual Threads without Pinning** (JDK 24) -- synchronized blocks no longer pin virtual threads to carrier threads

Sources: [JetBrains blog](https://blog.jetbrains.com/idea/2025/09/java-25-lts-and-intellij-idea/), [enji.systems](https://enji.systems/2025/10/12/java-features-22-to-25.html), [InfoQ](https://www.infoq.com/news/2026/02/java-26-so-far/)

**JDK 26 GA (March 17, 2026)** -- non-LTS, 10 JEPs:
- **HTTP/3 for HTTP Client API** (JEP 517) -- production HTTP/3 support
- **Structured Concurrency** (JEP 525, sixth preview) -- added `onTimeout()` method
- **Primitive Types in Patterns** (JEP 530, fourth preview) -- pattern matching for all primitives
- **Lazy Constants** (JEP 526, second preview) -- flexible initialization timing for AI/data apps
- **Vector API** (JEP 529, eleventh incubator) -- SIMD for AI computation, awaiting Valhalla
- **AOT Object Caching with Any GC** (JEP 516) -- startup/warmup improvement for ZGC
- **G1 GC: Reduce Synchronization** (JEP 522) -- throughput improvement
- **Prepare to Make Final Mean Final** (JEP 500) -- warnings on deep reflection mutation of final fields
- **PEM Encodings** (JEP 524, second preview) -- crypto object encoding API
- **Remove Applet API** (JEP 504)

Sources: [Oracle announcement](https://www.oracle.com/news/announcement/oracle-releases-java-26-2026-03-17/), [Oracle blog](https://blogs.oracle.com/java/the-arrival-of-java-26), [InfoQ](https://www.infoq.com/news/2026/02/java-26-so-far/)

### AI Integration Ecosystem

**Spring AI** (GA 2024, rapidly maturing):
- Official Spring project for LLM integration; Anthropic, OpenAI, Google, Ollama providers
- Agentic patterns series launched Jan 2026: Agent Skills (modular, LLM-portable skill folders), tool discovery, argument augmentation
- `ChatClient` portable API, `@Description`-annotated Spring beans as LLM functions
- RAG pipeline support with vector store abstraction (PGVector, Chroma, Pinecone, Milvus)
- MCP protocol support for tool integration

Source: [Spring AI blog](https://spring.io/blog/2026/01/13/spring-ai-generic-agent-skills), [dsinnovators.com](https://www.dsinnovators.com/blog/java/ai-java-enterprise-spring-boot-langchain4j-2026/)

**LangChain4j**:
- Native Java framework (not a Python port); interfaces, DI, annotation-driven
- Structured output extraction: LLM responses mapped to Java records with compile-time safety
- Quarkus integration; Spring Boot starters available
- AI Service interface pattern: `@SystemMessage` + typed return values

Source: [dsinnovators.com](https://www.dsinnovators.com/blog/java/ai-java-enterprise-spring-boot-langchain4j-2026/)

**Koog (JetBrains, Java API March 2026)**:
- Enterprise agent framework with idiomatic Java builder API
- Three workflow strategies: functional (code-based), graph-based (with persistence/visualization), planning (GOAP)
- `@Tool` + `@LLMDescription` annotations on existing Java methods
- Persistence to Postgres/S3/disk with session-based checkpoint/resume
- OpenTelemetry integration (Langfuse, W&B Weave)
- History compression for token cost management
- Thread pool separation: `ExecutorService` for strategy execution vs I/O-bound LLM calls
- Multi-LLM provider support (OpenAI, Anthropic, Google, DeepSeek, Ollama)

Source: [JetBrains AI blog](https://blog.jetbrains.com/ai/2026/03/koog-comes-to-java/)

**Embabel (Rod Johnson)**:
- GOAP-based agent framework for JVM, built on Spring AI
- Type-safe pre/post conditions in Java code; replans after each action
- `@Action` annotated steps; conditions reassessed dynamically
- 100% Kotlin internally, fully supports Java for agent development
- Apache 2.0 license; very early stage

Source: [The New Stack](https://thenewstack.io/meet-embabel-a-framework-for-building-ai-agents-with-java/)

**Amazon Q Developer Transform**:
- Agentic Java modernization: Java 8/11 to 17/21 upgrades, SDK migration
- Custom transform for version upgrades with iterative improvement
- Security scanning integrated

Source: [AWS](https://aws.amazon.com/q/developer/transform/), [tech.yuriybezsonov.com](https://tech.yuriybezsonov.com/upgrade-java-8-to-21-and-reduce-tech-debt-with-amazon-q-developer-transform/)

---

## 2. Failure Modes / Chokepoints

### Critical: Current Agent Has Stale Virtual Thread Guidance

The v4 agent says: "Never `synchronized` around I/O in virtual thread context. Use `ReentrantLock`". This was correct for JDK 21-23 but is **wrong for JDK 24+**. JEP 491 (delivered in JDK 24, inherited by JDK 25 LTS) eliminates synchronized pinning. The agent's most prominent anti-pattern is now outdated for the target JDK.

Impact: Agent actively steers users to replace `synchronized` with `ReentrantLock` when it's no longer necessary. This creates unnecessary churn and teaches a pattern that's no longer relevant on JDK 24+.

Source: [JEP 491](https://openjdk.org/jeps/491), [mikemybytes.com](https://mikemybytes.com/2025/04/09/java24-thread-pinning-revisited/), [springjavalab.com](https://www.springjavalab.com/2025/12/java-25-virtual-threads-benchmarks-pitfalls.html)

### AI-Generated Java Failure Patterns

1. **Outdated idioms**: LLMs trained on older Java generate pre-21 patterns (anonymous classes instead of lambdas, instanceof+cast instead of pattern matching, `Optional.get()` instead of `orElseThrow()`). The v4 agent's modernization checklist addresses this well.

2. **Spring annotation complexity**: AI struggles with:
   - `@Transactional` on private methods (does nothing -- proxy limitation)
   - `@ConditionalOn*` interaction ordering
   - `@ComponentScan` scope creep causing slow startup
   - Proxy boundary violations (self-invocation bypasses AOP)

3. **N+1 JPA queries**: Still the #1 AI-generated JPA problem. AI generates naive repository calls in loops rather than `@EntityGraph` or `JOIN FETCH`.

4. **Context window limitations in enterprise codebases**: AI sees only fragments of large codebases. After 20-30 minutes of work on enterprise projects (1M+ LOC), AI starts forgetting context, repeating mistakes, and proposing already-rejected solutions. Source: [dev.to enterprise AI coding](https://dev.to/apolenkov/battle-for-context-how-we-implemented-ai-coding-in-an-enterprise-project-11hd)

5. **Scope creep**: AI "fixes" unrelated code when given a focused task. Needs explicit scope constraints.

6. **Missing new API awareness**: AI doesn't suggest ScopedValue (finalized JDK 25), Foreign Function & Memory API, Stream Gatherers, or flexible constructor bodies because training data predates their finalization.

7. **GraalVM native image**: Reflection-heavy Spring code breaks native compilation; AI rarely accounts for `@RegisterReflectionForBinding` or resource-config.json needs.

### What the Current Agent Gets Right

The modernization checklist and anti-patterns list are proven high-value (+0.40 lift). The Spring Boot decision table and performance diagnostics flow are solid. These should not be diluted.

---

## 3. Best-in-Class Improvements

### Must-Do Updates (currency)

1. **Update virtual thread guidance for JDK 24+**: Synchronized pinning is eliminated. The advice should be version-conditional:
   - JDK 21-23: Use `ReentrantLock` instead of `synchronized` around I/O
   - JDK 24+ (including JDK 25 LTS): `synchronized` around I/O is fine; JEP 491 handles unmounting. `ReentrantLock` still preferred for try-lock/timed-lock patterns

2. **Add JDK 22-25 stable features to modernization checklist**:
   - `ThreadLocal` -> `ScopedValue` (for virtual thread contexts, finalized JDK 25)
   - JNI -> Foreign Function & Memory API (finalized JDK 22)
   - Custom stream intermediate ops -> Stream Gatherers (finalized JDK 24)
   - Validation-then-super() workarounds -> Flexible constructor bodies (JDK 25)
   - `import java.util.*` -> `import module java.base` (JDK 25, for simpler files)

3. **Update structured concurrency to current API**: JDK 25 refactored `StructuredTaskScope` significantly -- new Joiner-based API, `onTimeout()` in JDK 26 preview. Still preview but widely used.

### Should-Do Additions (scope expansion)

4. **Add AI integration patterns section**: Enterprise Java teams are increasingly adding AI features. Key patterns:
   - Spring AI `ChatClient` with `@Description`-annotated tool beans
   - LangChain4j AI Service interfaces with structured output to records
   - RAG pipeline: embed -> vector store -> retrieve -> augment -> LLM
   - MCP server implementation for tool exposure

5. **Add Koog/Embabel awareness**: For agent-building tasks:
   - `@Tool` + `@LLMDescription` on existing methods (Koog pattern)
   - Functional/graph/planning workflow strategies
   - Persistence for long-running agent workflows
   - Thread pool separation for LLM I/O vs strategy logic

6. **Add GraalVM native image guidance**: When the task involves native compilation:
   - `@RegisterReflectionForBinding` for DTOs
   - resource-config.json for classpath resources
   - Spring AOT processing with `spring-boot-maven-plugin` native profile

---

## 4. Main Bottleneck

**Content currency, not prompt quality.** The agent is at eval ceiling (4.87). The +0.40 lift comes from steering away from stale patterns and toward modern ones. But the "modern" patterns are now stale themselves:

1. The synchronized/ReentrantLock guidance is actively wrong for the current LTS (JDK 25)
2. ScopedValue, FFM API, Stream Gatherers, and flexible constructors are finalized but absent
3. The AI integration layer (Spring AI, LangChain4j, Koog) is the fastest-growing Java area and completely unaddressed

The model already knows Java well (4.47 bare). The agent's value is in corrections and modern pattern steering. When those corrections become incorrect, the agent's value drops.

---

## 5. Winning Patterns

### Production Java Stack (2026)

- **Runtime**: Spring Boot 3.4+ on JDK 25 LTS with virtual threads enabled
- **AI integration**: Spring AI (if Spring-native team) or LangChain4j (if multi-framework)
- **Agent framework**: Koog (enterprise, persistence, observability) or Embabel (GOAP planning)
- **Tool integration**: MCP Java SDK for exposing Java services as AI tools
- **Observability**: OpenTelemetry for both app and AI agent traces
- **Deployment**: JVM JAR for long-running services; GraalVM native for serverless/CLI
- **Concurrency**: Virtual threads + structured concurrency (preview) + ScopedValue

### Enterprise AI Integration Pattern (from dsinnovators.com, Spring AI blog)

```
1. Define AI Service interface with @SystemMessage and typed returns
2. Register tools as @Description-annotated Spring beans
3. Wrap LLM calls in Spring's ChatClient with advisor chain
4. Use Spring Cache + Redis for semantic caching of LLM responses
5. Monitor via Micrometer: latency, token usage, error rates, cache hit ratio
6. Audit via Spring AOP around AI service calls
```

### What Makes Java AI Agents Effective (from Koog, Embabel patterns)

- Strong typing for LLM interactions (structured output to records)
- Type-safe tool definitions with `@Tool` + `@LLMDescription`
- Persistence for checkpoint/resume of long-running agent workflows
- Thread pool separation: agent logic pool vs LLM API I/O pool
- History compression to manage token costs at scale
- GOAP or graph-based planning for deterministic-yet-flexible workflows

---

## 6. Specific Recommendations for v5

### Priority 1: Fix stale guidance (MUST DO)

**A. Version-conditional virtual thread advice:**

Replace the current blanket "Never `synchronized` around I/O in virtual thread context" with:

| JDK Version | Guidance |
|---|---|
| 21-23 | Use `ReentrantLock` instead of `synchronized` for I/O in virtual thread context (pinning risk) |
| 24+ (including 25 LTS) | `synchronized` around I/O is safe (JEP 491). Use `ReentrantLock` only for try-lock/timed-lock semantics |

**B. Expand modernization checklist for JDK 22-25 features:**

| Legacy Pattern | Modern Replacement | When | Since |
|---|---|---|---|
| `ThreadLocal<T>` in virtual thread code | `ScopedValue<T>` | Virtual thread contexts where value is immutable within scope | JDK 25 |
| JNI for native interop | Foreign Function & Memory API (`MemorySegment`, `Linker`) | All native interop | JDK 22 |
| Complex custom `Collector` for intermediate stream ops | `Stream.gather(Gatherer)` | When you need stateful/short-circuiting intermediate operations | JDK 24 |
| Validation-then-super workarounds | Flexible constructor bodies (statements before `super()`) | Constructor validation/computation | JDK 25 |

### Priority 2: Keep what works (DO NOT CHANGE)

The Spring Boot decision table, performance diagnostics flow, anti-patterns list (minus the synchronized item), and common fix patterns are proven. Preserve them.

### Priority 3: Add AI integration section (SHOULD DO if space allows)

Keep it concise -- a decision table and key patterns:

| Decision | Spring AI | LangChain4j | Choose Spring AI When | Choose LangChain4j When |
|---|---|---|---|---|
| LLM integration | ChatClient + advisors | AI Service interface | Deep Spring ecosystem, want portable provider API | Need structured output to records, complex RAG |
| Tool exposure | @Description on beans | @Tool methods | Already Spring beans | Standalone methods |
| Agent framework | Koog or Embabel on top | Built-in agent support | Need persistence/observability | Simpler agent needs |

### Priority 4: What NOT to add

- Do not add JDK 26 preview features as production guidance (it's non-LTS, 6 months of support)
- Do not add framework-specific API details (Spring AI/LangChain4j change too fast)
- Do not expand beyond what fits the agent's focused format -- the v4 format works

### Summary

The agent's architecture (checklist + decision table + diagnostics + anti-patterns) is the right shape and proven effective. The main risk is knowledge decay: the virtual thread pinning guidance is now wrong for JDK 25 LTS, and three significant finalized features (ScopedValue, FFM API, Stream Gatherers) are absent. Fix those, and the agent remains best-in-class. The AI integration section is a nice-to-have that addresses the fastest-growing Java use case but should not come at the cost of the core material's quality.
