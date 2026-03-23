# java-pro - Per-Agent Research Report

## Eval Performance
- v4: 4.87 (at ceiling across configs D, G, H, I)
- Bare: 4.47
- Agent instructions lift: +0.40 (significant, strongest signal that prompt matters)
- At ceiling -- further prompt improvements unlikely to raise score

## 1. Competitive Landscape

**Java AI ecosystem (2025-2026) -- major shift:**
- 62% of Java users now rely on Java for AI development (Azul 2026 survey, up from 50% in 2025)
- 78% of Java developers using AI code assistants (Ryz Labs 2026)
- JDK 26 GA (March 2026): HTTP/3, reduced GC sync overhead, structured concurrency preview, Vector API
- JDK 25 is current LTS (September 2025)

**Key frameworks:**
- **Spring AI**: Anthropic-published agentic patterns (chain, parallelization, routing, orchestrator-workers, evaluator-optimizer) now have official Spring AI implementations
- **LangChain4j**: Primary Java LLM orchestration library, integrated with Quarkus
- **Embabel**: Rod Johnson's (Spring founder) new JVM agent framework -- GOAP-based planning, type-safe, builds on Spring AI
- **Koog (JetBrains)**: Enterprise agent framework, now with Java API (March 2026). Functional/graph/planning strategies, persistence, OpenTelemetry, history compression
- **MCP Java SDK**: Model Context Protocol for Java, tool integration standard
- **Google ADK for Java**: Agent Development Kit with builder-style API
- **Dokimos**: LLM evaluation framework for Java/Kotlin (JUnit integration, agent evaluation)

**AI coding assistants for Java:**
- GitHub Copilot leads for Java code generation
- Amazon Q Developer (AWS-integrated, security scans)
- Tabnine (on-premises, privacy-focused)
- SaM Solutions survey: 84% report meaningful productivity gains from AI tools

**Enterprise positioning:**
- Oracle JavaOne 2026 theme: "Java for an AI World"
- Java positioned for inference services, orchestration layers, enterprise integration
- Projects Leyden (startup time), Babylon (AI/inference), Panama (native interop) advancing
- Virtual threads making Java competitive for high-concurrency AI workloads

## 2. Known Failure Modes / Chokepoints

**For AI agents writing Java:**
- **Outdated patterns**: LLMs trained on older Java code frequently generate pre-Java 21 patterns (anonymous classes, instanceof+cast, synchronized blocks around I/O). The current agent's modernization checklist directly addresses this
- **Spring Boot complexity**: AI agents struggle with Spring's annotation-driven magic -- @Transactional on private methods, @ConditionalOn* interactions, component scanning scope
- **Virtual thread pinning**: Using `synchronized` around I/O in virtual thread context pins the carrier thread. This is subtle and LLMs frequently miss it
- **N+1 queries**: AI-generated JPA code often produces N+1 patterns; need explicit JOIN FETCH / @EntityGraph guidance
- **Enterprise context gap**: AI agents don't understand the organizational/architectural context. Agent OS and similar tools try to solve this with "spec-driven methodology"
- **Testing gaps**: AI generates code but often skips edge cases, error handling patterns, integration test setup
- **GraalVM native image**: Reflection-heavy code (common in Spring) breaks native compilation; AI agents rarely account for this

**For the agent itself:**
- At score ceiling (4.87) -- agent is already performing optimally
- The +0.40 lift from bare confirms the modernization checklist and anti-patterns are high-value

## 3. What Would Make This Agent Best-in-Class

Given ceiling performance, focus on maintaining relevance rather than score improvement:

- **Add AI/LLM integration patterns**: Spring AI agentic patterns (chain, parallelization, routing, orchestrator-workers), LangChain4j usage, MCP server implementation in Java
- **Add JDK 25/26 features**: JDK 25 LTS adoption guidance, structured concurrency (now in production), JDK 26 HTTP/3 client, Vector API for AI workloads
- **Add Koog/Embabel awareness**: These frameworks are becoming the standard for Java AI agents
- **Add agent evaluation patterns**: Dokimos-style LLM evaluation in JUnit
- **Keep the modernization checklist current**: Add ScopedValue (replacing ThreadLocal for virtual threads), Foreign Function & Memory API (replacing JNI), Record Patterns for destructuring

## 4. Main Bottleneck

**Not the prompt** -- at ceiling, the agent prompt is doing its job well. The bottleneck is:

- **Model capability**: The base model already knows Java well (4.47 bare). The agent adds +0.40 by steering toward modern patterns and away from anti-patterns. This is the ideal agent profile -- clear, actionable guidance that corrects the model's default tendencies
- **Knowledge currency**: As Java 25/26 and the AI framework ecosystem evolve rapidly, the agent's content will need updates to stay relevant. The modernization checklist currently targets Java 21; Java 25 is now LTS
- **Scope boundary**: The agent covers core Java + Spring Boot well but doesn't touch the AI integration layer (Spring AI, LangChain4j, MCP) which is now the fastest-growing area of Java development

## 5. What Winning Setups Look Like

**Production Java AI stack (2026):**
- Runtime: Quarkus or Spring Boot 3.x on JDK 25 (LTS) with virtual threads
- AI orchestration: Spring AI or LangChain4j
- Agent framework: Koog (JetBrains) or Embabel (Rod Johnson)
- Tool integration: MCP Java SDK
- Observability: OpenTelemetry (critical for non-deterministic AI workflows)
- Evaluation: Dokimos for LLM output testing in CI/CD
- Deployment: GraalVM native image for serverless, JVM JAR for long-running services

**Spring AI agentic patterns (from Anthropic's publication, now implemented):**
1. Chain Workflow: sequential subtasks, output feeds next step
2. Parallelization: concurrent LLM calls via ExecutorService + virtual threads
3. Routing: classify input, delegate to specialized model/agent
4. Orchestrator-Workers: central LLM decomposes, workers execute
5. Evaluator-Optimizer: generate + evaluate loop

**What makes Java agents effective:**
- Strong typing for LLM interactions (Embabel's core thesis)
- Type-safe tool definitions with @Schema annotations (Koog pattern)
- Persistence for long-running agent workflows (checkpoint/resume)
- Thread pool separation: agent logic vs LLM API I/O calls
- History compression to manage token costs at scale

## Recommendations for v5

1. **Update Java version target**: Bump from Java 21 to Java 25 LTS focus, add Java 26 preview features
2. **Add AI integration section**: Spring AI patterns, LangChain4j basics, MCP server implementation
3. **Add virtual thread advanced patterns**: ScopedValue, structured concurrency (now stable), thread pool management for AI workloads
4. **Maintain current strengths**: The modernization checklist and anti-patterns are proven high-value (+0.40 lift). Do not remove or dilute
5. **Low priority for score improvement**: Agent is at ceiling. Changes should focus on keeping content current, not chasing score gains
