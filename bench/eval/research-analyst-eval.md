# research-analyst Evaluation

## Task: ra-001

**Prompt:** Research the current state of homomorphic encryption for practical use. Is it ready for production? What are the key barriers?

**Ground Truth must_mention:** performance overhead (orders of magnitude slower), specific libraries (SEAL, HElib, TFHE, Concrete), bootstrapping as key bottleneck, real-world deployments (Apple, Google), comparison of FHE schemes (BFV, BGV, CKKS)

---

### Bare Response

Homomorphic encryption (HE) lets you compute on encrypted data without decrypting it first. It has improved significantly in recent years but is not ready for general production use.

**Performance is the biggest barrier.** HE operations are orders of magnitude slower than plaintext — typically thousands to millions of times slower depending on the complexity of the computation. This rules out most real-time or high-throughput applications.

**Bootstrapping is the core bottleneck.** Fully homomorphic encryption requires a bootstrapping step to "refresh" ciphertexts after a certain number of operations. This step is extremely expensive computationally and dominates the runtime of complex HE workloads.

**Libraries exist but require expertise.** Microsoft SEAL and IBM's HElib are the most established implementations. They're functional but demand significant cryptographic knowledge to use correctly — choosing parameters wrong can silently break security guarantees.

**Limited real-world adoption.** Apple has used HE techniques in some privacy features, and there have been academic demonstrations in healthcare and finance. But deployments remain narrow and carefully constrained to simple operations.

**Bottom line:** HE is a powerful idea that works in theory and in narrow practice. For most teams, the performance cost and implementation complexity make alternatives like secure enclaves or differential privacy more practical today. The technology is advancing steadily — hardware acceleration efforts and better tooling may change the equation in a few years.

---

### V1 Response

Homomorphic encryption (HE) is a transformative approach to privacy-preserving computation, enabling calculations on encrypted data without decryption. Through systematic research and comprehensive multi-perspective analysis, here is an in-depth assessment of its production readiness.

**Current State of the Field:**

The HE ecosystem has matured significantly. Key implementations include Microsoft SEAL (supporting BFV and CKKS schemes), IBM HElib (BGV scheme), the TFHE library for boolean-circuit-based computation, and Zama's Concrete compiler which provides a higher-level abstraction over TFHE. Each scheme offers different tradeoffs: BFV and BGV excel at exact integer arithmetic while CKKS supports approximate real-number operations, making it popular for machine learning inference.

**Critical Barriers to Production Adoption:**

1. **Performance overhead:** FHE operations carry 10,000x to 1,000,000x slowdown compared to plaintext. Even with recent optimizations, this overhead restricts viable applications to those where privacy value far exceeds computational cost.

2. **Bootstrapping bottleneck:** The bootstrapping procedure — essential for refreshing ciphertext noise in deep computations — consumes the vast majority of compute time. TFHE has achieved faster per-gate bootstrapping, but the aggregate cost remains prohibitive for complex circuits.

3. **Parameter complexity:** Proper configuration of ring dimensions, modulus chains, and noise budgets requires deep cryptographic expertise. Misconfigurations fail silently.

4. **Ciphertext expansion:** Encrypted data is 100-10,000x larger than plaintext, creating bandwidth and storage challenges.

**Real-World Deployments:**

Apple uses HE in privacy features for on-device ML processing and Siri suggestions. Google has deployed HE for privacy-preserving ad measurement and analytics. Both represent carefully scoped, narrow applications.

**Strategic Assessment:** Through thorough evaluation and critical analysis, HE is production-viable only for constrained, high-value privacy scenarios. General-purpose readiness requires continued advances in hardware acceleration (Intel HEXL, DARPA DPRIVE), compiler optimization, and developer tooling. A realistic timeline for broader adoption is 3-5 years.

---

### V2 Response

## Research Report: Homomorphic Encryption Production Readiness

### Answer

No — FHE is not production-ready for general computing. It is viable today only for narrow use cases (encrypted aggregation, simple ML inference) where privacy requirements justify a 10,000x-1,000,000x performance penalty. Two companies (Apple, Google) have shipped FHE in production, both for tightly scoped workloads.

### Evidence Summary

| # | Finding | Source | Confidence | Notes |
|---|---------|--------|------------|-------|
| 1 | FHE operations incur 10,000x-1,000,000x overhead vs. plaintext | Benchmark papers, SEAL/HElib docs (2023-2024) | HIGH | Varies by scheme, circuit depth, and parameter set |
| 2 | Bootstrapping consumes 80%+ of FHE compute for deep circuits | Cryptographic literature, TFHE benchmarks | HIGH | TFHE achieves ~10ms per gate-level bootstrap — fast but still dominant cost |
| 3 | BFV/BGV: exact integer arithmetic; CKKS: approximate reals; TFHE: boolean gates | SEAL, HElib, TFHE documentation | HIGH | No universal scheme — choice constrains application architecture |
| 4 | Microsoft SEAL, IBM HElib, TFHE-lib, and Zama Concrete are the primary implementations | Library documentation, GitHub activity metrics | HIGH | Concrete is the most developer-friendly (Python/Rust APIs, compiler-based) |
| 5 | Apple ships HE in iOS for privacy-preserving on-device features | Apple WWDC 2021-2023, security whitepapers | HIGH | Narrow scope: keyboard suggestions, Siri, some analytics |
| 6 | Google deployed HE for privacy-preserving ad measurement | Google research publications (2022-2023) | MEDIUM | Single-source for deployment details; scale unclear |
| 7 | Intel HEXL provides AVX-512 acceleration; DARPA DPRIVE funds FHE ASIC development | Intel docs, DARPA program announcements | MEDIUM | No commodity FHE hardware shipping yet |

### Analysis

**The performance wall is real but not uniform (Evidence 1, 3).** The 10,000x-1,000,000x range is wide because it depends entirely on scheme choice and circuit depth. CKKS on batched vectors (packing thousands of values into one ciphertext) can amortize cost dramatically for ML inference. BFV/BGV on simple counting operations can be practical at moderate scale. The worst case — deep circuits requiring many bootstraps — is where the million-x factor applies.

**Bootstrapping is THE bottleneck for deep computation (Evidence 2).** Schemes like CKKS and BFV can operate in "leveled" mode without bootstrapping for shallow circuits, making them practical for specific applications. Once circuit depth exceeds the noise budget, bootstrapping is required, and costs explode. TFHE sidesteps this with fast per-gate bootstrapping (~10ms) but pays that cost on every single gate operation.

**The library landscape is maturing but fragmented (Evidence 4).** SEAL (Microsoft) and HElib (IBM) are battle-tested but low-level. Zama's Concrete compiler represents the most significant developer-experience improvement — it compiles Python-like code to TFHE circuits, handling parameter selection automatically. This addresses one of the major adoption barriers (parameter complexity).

**Production deployments are real but narrow (Evidence 5, 6).** Apple and Google validate that FHE CAN work in production. The key pattern: both use FHE for simple aggregation or inference operations where the computation is shallow, the privacy benefit is clear, and latency tolerance is high.

### Tradeoffs: FHE Scheme Comparison

| Criterion | BFV/BGV | CKKS | TFHE |
|-----------|---------|------|------|
| Data type | Exact integers | Approximate reals | Boolean/small integers |
| Sweet spot | Counting, database queries | ML inference, statistics | Arbitrary computation |
| Bootstrapping model | Expensive, avoided when possible | Expensive, avoided when possible | Fast (~10ms), required per gate |
| Ciphertext size | Large (~MBs) | Large (~MBs) | Smaller per gate |
| Primary libraries | SEAL, HElib | SEAL, HElib | TFHE-lib, Concrete |
| Developer accessibility | Low (manual parameters) | Low (manual parameters) | Medium (Concrete automates) |

### Uncertainties and Gaps

- Performance benchmarks are highly parameter-dependent; published numbers may not reflect production configurations
- Whether hardware acceleration (Evidence 7) will achieve the 100x+ speedup needed for general viability is an open question — no FHE ASIC has shipped
- Security margins of lattice-based schemes under future quantum attacks are debated; current parameters are believed safe but not proven

### Counter-Arguments

FHE proponents argue that: (a) for batch analytics on encrypted databases, amortized per-record cost is already acceptable; (b) the "not ready" framing ignores that CKKS-based ML inference is in production at Apple; (c) Concrete's compiler approach will eliminate the parameter-complexity barrier within 1-2 years. These points have merit — the question is less "does FHE work?" and more "for which workloads does the tradeoff make sense?"

### Recommendations

1. **Do not default to FHE** — evaluate whether differential privacy, secure enclaves (TEEs), or MPC satisfy your privacy requirements at a fraction of the cost
2. **If FHE is necessary, start with Concrete (Zama)** — it automates parameter selection and compiles to optimized TFHE circuits, dramatically reducing implementation risk
3. **For ML inference specifically, prototype with CKKS via SEAL** — batched vector operations on CKKS achieve the best performance-to-privacy ratio for this workload class
4. **Budget 6+ months for integration** — parameter tuning, noise management, and performance optimization are non-trivial even with better tooling
5. **Track DARPA DPRIVE and Intel HEXL** — hardware acceleration is the most likely catalyst for broader FHE adoption; commodity availability would shift the calculus

Sources Evaluated: 7 | High Confidence: 5 | Gaps Identified: 3

---

### Scores

| Dimension | Bare | V1 | V2 |
|-----------|------|----|----|
| Completeness | 3 | 5 | 5 |
| Precision | 4 | 4 | 4 |
| Actionability | 2 | 3 | 5 |
| Structure | 3 | 3 | 5 |
| Efficiency | 4 | 3 | 4 |
| Depth | 3 | 4 | 5 |
| **Composite** | **3.27** | **3.73** | **4.60** |

Composite = (Precision×2 + Completeness×1.5 + Actionability + Structure + Efficiency + Depth) / 7.5

- Bare: (4×2 + 3×1.5 + 2 + 3 + 4 + 3) / 7.5 = (8 + 4.5 + 2 + 3 + 4 + 3) / 7.5 = 24.5 / 7.5 = **3.27**
- V1: (4×2 + 5×1.5 + 3 + 3 + 3 + 4) / 7.5 = (8 + 7.5 + 3 + 3 + 3 + 4) / 7.5 = 28.5 / 7.5 = **3.80** (corrected from table)
- V2: (4×2 + 5×1.5 + 5 + 5 + 4 + 5) / 7.5 = (8 + 7.5 + 5 + 5 + 4 + 5) / 7.5 = 34.5 / 7.5 = **4.60**

Corrected V1 composite: **3.80**

### Ground Truth Check

- must_mention coverage: bare 3/5, v1 5/5, v2 5/5
  - Bare: performance overhead (YES), specific libraries (PARTIAL — SEAL, HElib but not TFHE/Concrete), bootstrapping (YES), real-world deployments (PARTIAL — Apple only, no Google), FHE scheme comparison (NO)
  - V1: performance overhead (YES), specific libraries (YES — SEAL, HElib, TFHE, Concrete), bootstrapping (YES), real-world deployments (YES — Apple, Google), FHE scheme comparison (YES — BFV, BGV, CKKS)
  - V2: performance overhead (YES), specific libraries (YES), bootstrapping (YES), real-world deployments (YES), FHE scheme comparison (YES — with dedicated comparison table)
- must_not violations: None across all conditions
- Structure requirement (organized by barrier type, not by source): All three comply

---

## Task: ra-003

**Prompt:** What happened to the "serverless" computing trend? Analyze whether it delivered on its promises from 2018-2025.

**Ground Truth must_mention:** cold start problems and evolution, cost at scale (serverless vs containers), vendor lock-in concerns, where it succeeded (event-driven, sporadic workloads), where it failed (latency-sensitive, long-running processes)

---

### Bare Response

Serverless computing — primarily AWS Lambda, Azure Functions, and Google Cloud Functions — was one of the biggest infrastructure trends around 2018. The promise was simple: no servers to manage, automatic scaling, and pay-per-invocation pricing. Here's how it actually played out.

**Where it delivered:**
Serverless genuinely works well for event-driven tasks. Processing S3 uploads, handling webhooks, running cron jobs, and serving low-traffic APIs — these workloads benefit from the no-ops model and pay-per-use economics. For startups and small teams, it reduced time-to-market for simple backends.

**Cold starts were a persistent issue.** Lambda cold starts could hit several seconds, especially for Java and .NET runtimes. AWS introduced provisioned concurrency and SnapStart to mitigate this, but those features trade away the core serverless benefit (pay only for what you use). The problem improved but was never fully solved.

**Cost surprised people at scale.** For low-traffic workloads, serverless is cheap. For sustained high-throughput workloads, it can cost 3-5x more than containers. Several teams publicly documented savings after migrating from Lambda to ECS or Kubernetes.

**Vendor lock-in became real.** Lambda functions themselves are portable, but the ecosystem around them — API Gateway, DynamoDB, SQS, Step Functions — creates deep provider coupling. Moving off AWS serverless means rewriting the entire integration layer.

**Long-running processes were a poor fit.** Lambda's 15-minute timeout and stateless model made it impractical for video processing, ML training, or any sustained computation.

**Verdict:** Serverless found a solid niche in event-driven and glue workloads. It didn't become the default compute model. Most organizations use a mix of containers and serverless, choosing based on workload characteristics.

---

### V1 Response

Through comprehensive research and thorough analysis of the serverless computing trend from 2018 to 2025, here is a systematic evaluation of its promise versus reality.

**The Original Promises (circa 2018):**
The serverless movement promised four things: (1) eliminate server management, (2) automatic infinite scaling, (3) pay only for execution time, and (4) faster development cycles.

**Promise 1: No Server Management — Largely Delivered**
Serverless genuinely removed infrastructure management for function-level compute. Developers deploy code without thinking about provisioning, patching, or capacity planning. However, new operational challenges emerged — distributed tracing across hundreds of functions, managing IAM policies, configuring event source mappings, and cold start optimization. Complexity was displaced, not eliminated.

**Promise 2: Auto-Scaling — Delivered with the Cold Start Caveat**
Scale-up works as advertised. Scale-from-zero does not. Cold starts plagued serverless from the beginning, with JVM-based runtimes suffering 3-10 second delays. The evolution: AWS Provisioned Concurrency (2019), Lambda SnapStart for Java (2022), and Google Cloud Run min-instances addressed this, but each mitigation reintroduces capacity planning — the very thing serverless promised to eliminate. For latency-sensitive applications requiring <100ms p99, serverless remained unsuitable.

**Promise 3: Pay-Per-Use — True Small, False Large**
At low and sporadic traffic, serverless pricing is a genuine win. At sustained throughput (millions of daily invocations), cost escalates rapidly — teams reported 3-5x higher costs compared to equivalent container deployments on ECS, Fargate, or GKE. DHH's 2023 "leaving the cloud" essays and the Prime Video monolith case study (often miscited but directionally relevant) catalyzed public reassessment.

**Promise 4: Faster Development — Mixed**
Simple functions ship fast. Complex applications face friction: poor local testing, difficult debugging, vendor lock-in to AWS (Lambda + API Gateway + DynamoDB + Step Functions), and architectural constraints (statelessness, 15-min timeout, payload limits).

**Where It Succeeded:** Event-driven processing, webhooks, scheduled tasks, sporadic-traffic APIs, glue between cloud services.

**Where It Failed:** Latency-critical real-time APIs, long-running compute (ML training, video processing), high-throughput data pipelines, and stateful workloads.

**Strategic Conclusion:** Through systematic analysis, serverless matured into one tool among many — effective in its niche, not the universal compute platform its advocates envisioned. The industry pragmatically adopted hybrid container-serverless architectures.

---

### V2 Response

## Research Report: Serverless Computing — Did It Deliver? (2018-2025)

### Answer

Serverless partially delivered. It succeeded as an event-driven compute model for sporadic workloads and became a permanent part of the infrastructure toolkit. It failed to become the general-purpose compute platform predicted in 2018. The three barriers that prevented broader adoption — cold starts, cost at scale, and vendor lock-in — improved but were never resolved.

### Evidence Summary

| # | Finding | Source | Confidence | Notes |
|---|---------|--------|------------|-------|
| 1 | Cold starts: 1-10s in 2018 (JVM/.NET worst); reduced to 100-500ms by 2024 via Provisioned Concurrency (2019), SnapStart (2022), Firecracker | AWS docs, community benchmarks (2023-2024) | HIGH | Mitigations reintroduce capacity planning, partially negating serverless model |
| 2 | At sustained load (>1M invocations/day), Lambda costs 3-5x more than ECS/Fargate equivalents | Engineering blogs, Datadog State of Serverless (2023) | MEDIUM | Crossover varies by memory config, duration, and architecture |
| 3 | Vendor lock-in is ecosystem-level: Lambda + API Gateway + DynamoDB + SQS + Step Functions + EventBridge | Architecture case studies, migration reports | HIGH | Core function code is portable; everything around it is not |
| 4 | Event-driven workloads (S3 triggers, queue consumers, webhooks, cron) report high satisfaction | Developer surveys, AWS case studies (2022-2024) | HIGH | Aligned with original Lambda design intent |
| 5 | Lambda 15-minute timeout and 6MB/10MB payload limits exclude long-running and data-heavy workloads | AWS Lambda documentation | HIGH | Step Functions address duration but add architectural complexity and cost |
| 6 | Kubernetes + KEDA/Knative absorbed "serverless" features (scale-to-zero, event-driven triggers) | CNCF surveys (2022-2024) | HIGH | The container ecosystem learned from serverless without its constraints |
| 7 | Prime Video team saved ~90% by moving from distributed to monolith (2023) | Amazon Prime Video engineering blog | HIGH | Frequently miscited as anti-serverless; actually about microservices overhead |

### Analysis

**Cold starts evolved from blocker to managed friction (Evidence 1).** In 2018, a 5-second cold start for a Java Lambda was a deal-breaker for any user-facing API. By 2024, AWS had layered multiple mitigations: Provisioned Concurrency pre-warms instances (but you pay for idle capacity), SnapStart snapshots JVM state (but adds deployment complexity), and Firecracker microVMs reduced base overhead. The net result: cold starts are manageable for many workloads, but the mitigations contradict the pure serverless model. You're doing capacity planning again — just with different knobs.

**Cost dynamics created a natural ceiling for serverless adoption (Evidence 2).** Per-invocation pricing is brilliant for sporadic workloads: a webhook handler processing 1,000 requests/day costs pennies. The same pricing model at 10M requests/day becomes expensive because you're paying per-unit rather than amortizing over reserved capacity. By ~2022, the cost crossover point was well-understood, and teams began right-sizing: serverless for bursty/sporadic work, containers for steady-state.

**Vendor lock-in proved deeper than anticipated (Evidence 3).** The serverless vision required not just Lambda but an entire event-driven ecosystem — API Gateway for HTTP, DynamoDB for state, SQS/SNS for messaging, Step Functions for orchestration. Each integration point is AWS-specific. The Serverless Framework and SST abstracted deployment but not runtime dependencies. Teams that went deep into serverless found migration costs rivaling initial development.

**The success story is real but scoped (Evidence 4, 5).** Serverless genuinely excels for its original design target: short-lived, stateless, event-triggered functions. File processing, webhooks, scheduled jobs, lightweight APIs — these remain strong use cases and continue growing. The failure was in extrapolation: applying this model to latency-sensitive APIs, long-running batch jobs, or data-intensive pipelines where its constraints (timeout limits, payload caps, cold starts) create friction.

**Kubernetes ate serverless's broader ambition (Evidence 6).** KEDA brought event-driven scaling to containers. Knative brought scale-to-zero. AWS Fargate offered "serverless containers." By 2024, you could get most serverless benefits (no node management, event-driven scaling) within a container model that had none of serverless's constraints (timeouts, payload limits, cold starts). This convergence undermined the case for pure serverless in new architectures.

### Promise vs. Reality

| Promise (2018) | Reality (2025) | Delivered? |
|----------------|----------------|------------|
| No server management | Eliminated OS/capacity work; introduced new concerns (observability, cold start tuning, IAM) | Mostly |
| Automatic infinite scaling | Scale-up works; scale-from-zero has cold start cost; Provisioned Concurrency adds back capacity planning | Partially |
| Pay only for what you use | True at low scale; 3-5x more expensive than containers at sustained high throughput | Context-dependent |
| Faster time to market | Faster for simple functions; slower for complex apps (testing, debugging, vendor coupling) | Mixed |
| No vendor lock-in | Lock-in deepened through ecosystem dependencies (API GW, DynamoDB, Step Functions) | Not delivered |

### Uncertainties and Gaps

- Cost comparison figures are directional — actual crossover depends heavily on memory configuration, execution duration, and concurrency patterns
- Edge function platforms (Cloudflare Workers, Vercel Edge Functions) represent a potential "serverless 2.0" not captured by Lambda-centric analysis
- Whether WebAssembly runtimes (Spin, Fermyon) can deliver near-zero cold starts at scale is unproven

### Counter-Arguments

Serverless advocates make a fair point: the technology was judged against a "replace everything" promise driven by vendor marketing and conference hype, not by the technology's actual design goals. Within its intended scope — event-driven, stateless, short-lived workloads — serverless has been a clear success, and Lambda invocation counts continue to grow year-over-year. The "failure" narrative is a hype-cycle correction, not a technical verdict.

### Recommendations

1. **Default to serverless for event-driven glue** — S3 triggers, queue consumers, webhooks, cron jobs, low-traffic APIs. The economics and operational simplicity are genuinely superior here
2. **Default to containers for sustained workloads** — anything with predictable traffic above ~500K requests/day deserves a cost comparison against Fargate or Kubernetes
3. **Audit serverless costs semi-annually** — workloads that grew from sporadic to steady-state may have silently crossed the cost efficiency threshold
4. **Resist deep ecosystem coupling** — use DynamoDB and Step Functions when they're the right tool, but recognize each one increases migration cost. Prefer services with open-source equivalents for core data paths
5. **Evaluate Kubernetes + KEDA for new projects** — it offers serverless-like developer experience (event-driven, scale-to-zero) without Lambda's constraints (timeouts, payload limits, cold starts)

Sources Evaluated: 7 | High Confidence: 5 | Gaps Identified: 3

---

### Scores

| Dimension | Bare | V1 | V2 |
|-----------|------|----|----|
| Completeness | 5 | 5 | 5 |
| Precision | 4 | 4 | 4 |
| Actionability | 2 | 2 | 5 |
| Structure | 3 | 4 | 5 |
| Efficiency | 4 | 3 | 4 |
| Depth | 3 | 4 | 5 |
| **Composite** | **3.53** | **3.67** | **4.60** |

Composite = (Precision×2 + Completeness×1.5 + Actionability + Structure + Efficiency + Depth) / 7.5

- Bare: (4×2 + 5×1.5 + 2 + 3 + 4 + 3) / 7.5 = (8 + 7.5 + 2 + 3 + 4 + 3) / 7.5 = 27.5 / 7.5 = **3.67** (corrected)
- V1: (4×2 + 5×1.5 + 2 + 4 + 3 + 4) / 7.5 = (8 + 7.5 + 2 + 4 + 3 + 4) / 7.5 = 28.5 / 7.5 = **3.80** (corrected)
- V2: (4×2 + 5×1.5 + 5 + 5 + 4 + 5) / 7.5 = (8 + 7.5 + 5 + 5 + 4 + 5) / 7.5 = 34.5 / 7.5 = **4.60**

### Ground Truth Check

- must_mention coverage: bare 5/5, v1 5/5, v2 5/5
  - Bare: cold starts (YES — with evolution), cost at scale (YES — 3-5x), vendor lock-in (YES), succeeded where (YES — event-driven, sporadic), failed where (YES — latency-sensitive, long-running)
  - V1: cold starts (YES — with detailed evolution timeline), cost at scale (YES — 3-5x, DHH reference), vendor lock-in (YES — ecosystem detail), succeeded (YES), failed (YES)
  - V2: cold starts (YES — with evolution timeline and specific mitigations), cost at scale (YES — with crossover analysis), vendor lock-in (YES — ecosystem-level analysis), succeeded (YES), failed (YES — with specific limits cited)
- must_not violations: None — all three conditions present balanced assessment
- Structure requirement (promise vs reality format): Bare (implicit), V1 (explicit by promise), V2 (explicit table + thematic analysis)

---

## Summary

| Metric | Bare | V1 | V2 |
|--------|------|----|----|
| ra-001 Composite | 3.27 | 3.80 | 4.60 |
| ra-003 Composite | 3.67 | 3.80 | 4.60 |
| **Mean Composite** | **3.47** | **3.80** | **4.60** |
| V1 LIFT (vs bare) | | **+0.33** | |
| V2 LIFT (vs bare) | | | **+1.13** |
| V2 LIFT (vs v1) | | | **+0.80** |

### Analysis

**V1 lift is small (+0.33).** The v1 agent prompt is 125 lines of adjective-laden bullet lists ("comprehensive analysis," "deep understanding," "strategic thinking," "excellence checklist"). It provides no procedural guidance — no workflow steps, no decision rules, no output format, no anti-patterns. The observable effects:

1. **Completeness improves slightly (+0.53 on ra-001).** The "multiple perspectives" and "source triangulation" instructions do nudge the model toward mentioning more specific details (all 4 libraries, both Apple and Google, all FHE schemes). This is the only dimension where V1 consistently helps.

2. **Efficiency decreases.** V1 consistently introduces filler phrases ("through comprehensive analysis and thorough investigation," "through systematic evaluation") that add no information. The persona instructions encourage the model to DESCRIBE itself as thorough rather than BE thorough.

3. **Structure does not meaningfully improve.** V1 says "clear structure" and "compelling narrative" but never specifies WHAT structure. The model defaults to bold-header prose — slightly more organized than bare but not structurally different.

4. **Actionability does not improve.** V1 says "actionable recommendations" but provides no criteria for what makes a recommendation actionable. The recommendations remain vague.

**V2 lift is substantial (+1.13 vs bare, +0.80 vs v1).** The v2 agent drives improvement through three concrete mechanisms:

1. **Prescribed output format forces structure and actionability.** The mandatory sections (Answer, Evidence Summary table, Analysis, Uncertainties, Counter-Arguments, Recommendations) produce consistently structured output. The evidence table with confidence ratings makes every claim traceable. The recommendations section with "specific and actionable" completion criteria prevents vague advice.

2. **Step-by-step workflow ensures completeness.** Steps 1-7 are sequential and mandatory. The model cannot skip source evaluation (Step 4), uncertainty disclosure (Step 6), or counter-arguments (Step 6). The requirement to include counter-evidence queries (Step 2) mechanically ensures the "must_not: pure cheerleading or pure criticism" ground truth requirement is met.

3. **Anti-patterns prevent common failure modes.** Explicitly banning "adjective-stuffing," "burying the answer," and "confirmation bias" addresses the exact problems visible in V1 output. The decision criteria table (what to do when sources conflict, when evidence is old, when claims are single-source) gives concrete rules rather than hoping "critical thinking" handles edge cases.

**Key takeaway:** Personality-level prompting ("you are thorough and comprehensive") produces minimal lift because it describes desired output quality without providing the procedures to achieve it. Procedural prompting with explicit output schemas, decision rules, and anti-patterns produces substantial lift because it changes the model's actual generation behavior — not just its self-description.
