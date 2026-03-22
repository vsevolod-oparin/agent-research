## Task 1: The Current State of Homomorphic Encryption for Practical Use

### Overview

Homomorphic encryption (HE) allows computations to be performed directly on encrypted data without decrypting it first. After decades of purely academic interest, the technology has reached an inflection point -- but "production-ready" depends heavily on the use case.

### Current Performance Reality

The fundamental barrier remains performance overhead. Fully homomorphic encryption (FHE) operations are **1,000 to 1,000,000 times slower** than equivalent plaintext operations, depending on the scheme and implementation. Specific benchmarks:

- **BFV scheme**: Operations on encrypted integers take up to 1,000x longer than unencrypted equivalents
- **Paillier** (partially homomorphic): Roughly 20% overhead, but supports only limited operations
- **Extreme cases**: Some implementations show addition operations 246,897x slower than plaintext

However, these numbers are improving rapidly. Advances in bootstrapping optimization, SIMD-style batching, and hardware acceleration have narrowed the gap significantly since 2020.

### Library and Tooling Maturity

The ecosystem has matured considerably. A 2025 benchmark study of four leading libraries -- **SEAL** (Microsoft), **HElib** (IBM), **OpenFHE**, and **Lattigo** -- found that OpenFHE emerged as the optimal choice across diverse settings. On constrained devices like Raspberry Pi 4, Lattigo excels at key generation. The three main schemes in active use are **BFV**, **BGV**, and **CKKS**, with CKKS particularly suited to approximate arithmetic on real numbers.

### Real-World Deployments

Production use cases exist but are narrowly scoped:

- **Healthcare**: IBM has incorporated HE into federated learning frameworks, enabling hospitals to jointly train diagnostic models without exposing patient data
- **Finance**: Cross-border fraud detection systems using encrypted computation to comply with banking secrecy laws
- **Fintech/Healthcare Consortia**: Encrypted benchmarking, cross-site AI model tuning, and secure statistics sharing

### Hardware Acceleration: The Missing Piece

Dedicated hardware may be the key. **Niobium** raised over $23 million in late 2025 to develop second-generation FHE hardware. Intel, DARPA (via the DPRIVE program), and others are also investing in FHE-specific accelerators.

### Key Barriers to Adoption

1. **Computational overhead**: 56% of surveyed organizations cite this as the primary barrier
2. **Ciphertext expansion**: Encrypted data is dramatically larger than plaintext
3. **Noise management**: FHE schemes accumulate noise during computation; managing this via "bootstrapping" is expensive
4. **Developer complexity**: Writing FHE-compatible algorithms requires specialized expertise
5. **Standardization gaps**: No universal standard for interoperability

### Verdict

Homomorphic encryption is **ready for production in narrow, high-value use cases** where privacy requirements are strict, data volumes are limited, and computational overhead is acceptable (e.g., regulatory compliance in healthcare and finance). It is **not ready** for general-purpose computing, real-time applications, or high-throughput workloads. The market is projected to grow from $0.31B in 2026 to $1.52B by 2035 (19.5% CAGR), reflecting steady but measured adoption.

---

## Task 2: The Top 3 Approaches to AI Alignment Research

### Approach 1: Behavioral Training (RLHF / Constitutional AI)

**Core Idea**: Align AI systems by training them on human preferences, either through direct human feedback (RLHF) or AI-generated feedback guided by explicit principles (Constitutional AI).

**Key Arguments**:
- Pragmatic and deployable today; RLHF is the backbone of ChatGPT, Claude, and other frontier models
- Constitutional AI scales beyond human reviewers by having the model critique its own outputs
- Produces measurably "safer" outputs across standard benchmarks

**Major Proponents**: OpenAI (RLHF), Anthropic (Constitutional AI)

**Criticisms**:
- **Surface-level compliance**: RLHF incentivizes models to *appear* aligned rather than *be* aligned
- **Annotation bias**: Relies on crowdsourced annotations from specific demographics
- **Scalability paradox**: As AI surpasses human capability, humans become less qualified to provide meaningful feedback
- **Agency problem**: RLHF may inadvertently reward agentic behavior because human raters prefer confident responses

### Approach 2: Mechanistic Interpretability

**Core Idea**: Understand the *internal mechanisms* of neural networks to verify alignment from the inside out rather than relying on behavioral observation.

**Key Arguments**:
- Addresses the fundamental opacity problem: behavioral methods cannot distinguish genuine alignment from sophisticated deception
- Enables "mechanistic audits" verifying whether behavioral improvements correspond to genuine internal changes
- Could provide technical foundation for regulatory verification

**Major Proponents**: Anthropic (interpretability research), independent researchers at MATS

**Criticisms**:
- **Scalability in question**: Current techniques work on small models; scaling to hundreds of billions of parameters remains unproven
- **Insufficient alone**: Even perfect interpretability does not solve *what* to align AI toward
- **Moving target**: Findings from one architecture may not transfer to the next
- **Impact uncertainty**: The field has not clearly articulated how interpretability concretely prevents catastrophic outcomes

### Approach 3: Governance, Regulation, and Structural Approaches

**Core Idea**: Alignment is not purely a technical problem. It requires institutional structures, legal frameworks, international coordination, and deployment norms.

**Key Arguments**:
- Technical alignment alone cannot address misuse, concentration of power, or value disagreements
- "Legal alignment" offers established frameworks for balancing competing values
- Governance can impose constraints that technical solutions alone cannot
- Yoshua Bengio's "Scientist AI" advocates for fundamentally non-agentic AI

**Major Proponents**: Partnership on AI, EU (AI Act), Bengio and collaborators

**Criticisms**:
- **Too slow**: Regulation chronically lags behind technology
- **Toothless without technical grounding**: Without mechanistic understanding, regulators cannot verify compliance
- **Geopolitical fragmentation**: International coordination undermined by competitive dynamics
- **Stifling innovation**: Overly restrictive governance could push development to less safety-conscious jurisdictions

### Synthesis

The most credible researchers increasingly argue these approaches are **complementary, not competing**. Behavioral training provides the practical first line of defense; interpretability offers tools to verify that defense is genuine; governance provides institutional scaffolding. The deepest unresolved tension remains the **scalable oversight problem**: as AI systems become more capable than their overseers, all three approaches face fundamental challenges.

---

## Task 3: What Happened to "Serverless" Computing?

### The Promises (circa 2017-2018)

1. No infrastructure management
2. Perfect auto-scaling
3. Pay-per-use economics
4. Faster time to market
5. Universal applicability

### What Was Delivered

**Promise 1 -- No Infrastructure Management: Largely Delivered, With Caveats**

Developers genuinely do not manage servers. However, "no infrastructure" proved misleading. You still manage IAM roles, VPC configurations, API gateways, event source mappings, and deployment pipelines. The operational burden shifted rather than disappeared.

**Promise 2 -- Auto-Scaling: Delivered**

This is serverless's clearest success. Scaling from zero to handling traffic spikes without manual intervention works as advertised.

**Promise 3 -- Cost Efficiency: It Depends**

At low scale, serverless is remarkably cost-effective. But as workloads grow, costs eventually **exceed traditional cloud service costs**. Hidden costs compound: provisioned concurrency charges, data transfer fees, and log storage costs running ~3x more expensive than EC2 equivalents.

**Promise 4 -- Faster Time to Market: Partially Delivered**

For event-driven microservices and APIs, development speed improved. For complex applications, the unfamiliar execution model and debugging difficulties often slowed teams down.

**Promise 5 -- Universal Applicability: Not Delivered**

This was the biggest overpromise. Serverless adoption remains under 20% of public cloud users. Over 90% of enterprises using serverless report event-driven applications. Long-running processes, stateful workloads, and latency-sensitive applications remain poor fits.

### The Vendor Lock-In Reality

This emerged as perhaps the most consequential issue. Each cloud provider's function runtime, event sources, and surrounding services are proprietary. Migration between providers requires substantial rearchitecting.

### Verdict

Serverless delivered on its core technical promises (no servers, auto-scaling) but failed to deliver on its grander narrative. It is now understood as **one tool in the cloud computing toolkit** -- excellent for event-driven, bursty, stateless workloads; poor for everything else. The 2018 hype framed serverless as a paradigm shift; the 2025 reality is that it is a valuable but specialized architectural pattern.

---

## Task 4: Why Google+ Failed While Other Google Products Succeeded

### Non-Obvious Lesson 1: Google Confused a Platform Problem With a Product Problem

Google's successful products -- Search, Maps, Gmail, Android -- are fundamentally *platforms* or *utilities* that serve as infrastructure. They succeed by being useful independent of network effects. Google+ was built as a *destination* where the value proposition is entirely dependent on who else is there. Google had no institutional muscle memory for building products where value comes from other users rather than from engineering.

### Non-Obvious Lesson 2: Fear-Driven Strategy Produces Inauthentic Products

Google+ was born from **existential panic about Facebook**, not from genuine user insight. The product mimicked Facebook's feature set rather than finding a genuinely differentiated purpose. Contrast this with Gmail (engineers genuinely wanted better email) or Chrome (Google needed a faster browser for its web applications).

### Non-Obvious Lesson 3: Coercion Destroys Trust

Google's decision to force Google+ integration into YouTube, Gmail, and other services **violated the implicit social contract** between Google and its users. Distribution advantage cannot substitute for genuine demand.

### Non-Obvious Lesson 4: Engineering Culture Failed at a Fundamentally Human Problem

The Circles feature was technically elegant but practically burdensome. Engineers valued taxonomic precision; users valued effortless sharing. The Google+ team did not use their own product enthusiastically.

### Non-Obvious Lesson 5: The "One-Stop Shop" Model Was Already Dying

Google+ launched attempting to be a comprehensive social platform while the market was fragmenting toward specialized apps (Instagram, Snapchat, Vine, TikTok).

### Non-Obvious Lesson 6: Data Breaches Reveal What Users Already Suspected

The 2018 disclosure that a bug had exposed the private data of up to 500,000 users confirmed suspicions that Google+ existed primarily to harvest data.

### The Deeper Pattern

Google's successful products share a common trait: they are **individually useful from the first interaction**, independent of network effects. Search, Maps, Gmail, Chrome, YouTube -- all work with one user. Google+ required your friends to be present, and Google's DNA was poorly suited to that kind of product.

---

## Task 5: The Replication Crisis in Psychology

### The Scale of the Problem

The 2015 Reproducibility Project attempted to replicate 100 studies from top journals. Only **36-39%** produced statistically significant results matching originals, and effect sizes were on average half as large. Of 505 collected replications in a comprehensive database, **over 60%** did not find statistically significant effects reported in original studies.

### High-Profile Casualties

- **Ego Depletion**: Failed two registered replication reports across dozens of labs and thousands of participants. The most severely tested and most thoroughly discredited theory.
- **Power Posing**: Near-zero effects on originally claimed physiological measures. Dramatically reduced claim survives only for self-reported feelings.
- **Social Priming**: Multiple replication attempts of Bargh's 1996 walking-speed study failed. Broader social priming field substantially discredited.
- **Facial Feedback Hypothesis**, **Marshmallow Test** (effect sizes shrank dramatically when controlling for SES), various terror management findings.

### Important Nuances

1. **Not all subfields equally affected**. Cognitive psychology and psychophysics replicate far better than social psychology.
2. **Failure to replicate does not always mean the original was wrong**. Contextual factors can explain some failures.
3. **Psychology is not unique**. Estimated replication rates in cancer biology and economics are also troublingly low.

### What Has Changed Since 2015

A 2025 study examining **240,355 empirical psychology articles** from 2004 to 2024 provides clear evidence of improvement:

- The percentage of significant p-values in the "fragile range" dropped from 32% to ~26%
- Every subdiscipline shows a trend toward statistically stronger results
- **Pre-registration**, **Registered Reports**, **Open Data**, and **Big Team Science** have become established norms
- Median sample sizes have increased substantially

### Persistent Problems

- **P-hacking persists**: A 2025 analysis found evidence that questionable statistical practices have not disappeared entirely
- **Institutional incentives remain misaligned**: Top universities still publish articles with weaker p-values
- **Theory crisis**: Some argue the deeper problem is the absence of strong theories that would generate robustly replicable predictions

### Verdict

The replication crisis was as bad as initially reported -- over 60% of examined findings did not replicate. But the response has been substantial and measurable. Psychology has undergone more methodological self-correction in the past decade than perhaps any other scientific field. The reforms are real but incomplete. The next decade will determine whether psychology can also address its theoretical weaknesses.
