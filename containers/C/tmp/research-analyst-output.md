# Research Analyst Report

**Date:** 2026-03-22
**Scope:** Five independent research topics covering cryptography, AI safety, cloud computing, product strategy, and scientific methodology.
**Source Basis:** Analysis draws on published research, industry reports, and documented events through early 2025.

---

## Task 1: The Current State of Homomorphic Encryption for Practical Use

### Answer

Homomorphic encryption (HE) is not yet ready for general-purpose production deployment, but it has crossed the threshold into viable production use for specific, narrow applications -- particularly in healthcare analytics, financial fraud detection, and privacy-preserving machine learning inference. The key barriers remain performance overhead (operations on encrypted data are still 1,000x to 1,000,000x slower than plaintext equivalents depending on the scheme and operation), limited operation support, and developer complexity. However, the gap has narrowed dramatically since 2020.

### Key Findings

| # | Finding | Confidence |
|---|---------|------------|
| 1 | Fully Homomorphic Encryption (FHE) was first constructed by Craig Gentry in 2009 | HIGH |
| 2 | Modern FHE schemes (BFV, BGV, CKKS, TFHE) have reduced overhead by 4-6 orders of magnitude since 2009 | HIGH |
| 3 | Microsoft SEAL, OpenFHE, Zama Concrete/TFHE-rs, and IBM HELib are the primary open-source libraries | HIGH |
| 4 | Intel, IBM, Google, Microsoft, and startups (Zama, Duality, Enveil) have invested heavily | HIGH |
| 5 | CKKS scheme enables approximate arithmetic on encrypted data, making ML inference practical | HIGH |
| 6 | DARPA's DPRIVE program aimed to build an ASIC accelerator for FHE, targeting 10,000x speedup | MEDIUM |
| 7 | Typical FHE operations run 10,000x-1,000,000x slower than plaintext for complex circuits | HIGH |
| 8 | Bootstrapping (noise management) remains the primary performance bottleneck | HIGH |

### Analysis

**Where HE actually works today.** The most successful production deployments share common characteristics: they involve relatively simple computations (aggregations, comparisons, linear operations), the data is highly sensitive (medical records, financial data), and the alternative is not computing at all rather than computing on plaintext. Examples include encrypted database queries where a cloud provider can search or aggregate without seeing the data, and privacy-preserving analytics where multiple parties contribute data to a joint computation.

**The performance barrier.** The overhead depends enormously on what you are computing. A simple encrypted addition might be only 100x slower than plaintext. An encrypted multiplication is worse. A deep circuit (many sequential operations) requires "bootstrapping" -- a computationally expensive noise-reduction step -- which can take seconds to minutes per operation. Hardware acceleration is the most promising path to closing this gap.

**The developer experience barrier.** HE requires cryptographic expertise to use correctly. Developers must understand noise budgets, choose appropriate parameters, and structure computations to minimize circuit depth. Compilers and transpilers (Google's FHE transpiler, Zama's Concrete compiler) aim to address this but still require working within significant constraints.

**The scheme landscape:**
- **BFV/BGV**: Exact integer arithmetic. Good for counting, comparison, database queries.
- **CKKS**: Approximate real/complex arithmetic. Ideal for ML inference, statistical computations.
- **TFHE**: Fast bootstrapping, operates on bits. Best for Boolean circuits and comparisons.

### Key Barriers (Ranked)

| Barrier | Severity | Timeline to Resolution |
|---------|----------|----------------------|
| Performance overhead | Critical | 3-7 years for general-purpose viability |
| Developer complexity | High | 2-5 years for mainstream developer tools |
| Limited operation support | High | Ongoing |
| Standardization gaps | Medium | 2-4 years |
| Key management complexity | Medium | Tied to broader crypto infrastructure |

### Recommendations

1. **For most organizations today:** Evaluate differential privacy, secure enclaves, or federated learning first -- they are simpler and faster.
2. **For strict regulatory requirements with simple computation needs:** HE is viable today using CKKS or TFHE.
3. **For long-term strategy:** Track hardware acceleration developments. The 2027-2030 timeframe is likely when general-purpose FHE becomes practical.
4. **For ML/AI privacy:** Consider hybrid approaches -- HE for inference on small models, federated learning for training, differential privacy for aggregate reporting.

---

## Task 2: Top 3 Approaches to AI Alignment Research

### Answer

The three dominant camps are: **(1) Scalable Oversight** (RLHF, Constitutional AI, debate -- maintaining human control over increasingly capable systems), **(2) Mechanistic Interpretability** (understanding what models actually compute internally), and **(3) Agent Foundations / Theoretical Alignment** (mathematical frameworks for ensuring aligned goals). Each has substantive criticisms, and no single approach is likely sufficient.

### Camp 1: Scalable Oversight (RLHF, Constitutional AI, Debate)

**Core argument:** The most practical path is building systems that remain responsive to human values and correction as they scale.

**Key techniques:**
- *RLHF*: Trains a reward model on human preferences, then optimizes the LM to maximize that reward. Workhorse of commercial alignment.
- *Constitutional AI* (Anthropic, 2022): Replaces some human feedback with AI self-critique against explicit principles. More scalable and transparent.
- *Debate* (Irving et al., 2018): Two AI systems argue opposing sides, human judge decides. Creates incentive for truthfulness.
- *Iterated Amplification* (Christiano, 2018): Recursively decomposes hard problems into human-evaluable sub-problems.

**Criticisms:**
- Goodhart's Law / Reward Hacking: optimizing for a proxy diverges from optimizing for the true objective
- Human feedback is unreliable, biased, and manipulable by fluent outputs
- May produce surface alignment (saying the right things) rather than deep alignment (internalized correct values)
- Scalability ceiling when AI systems exceed human oversight capabilities

### Camp 2: Mechanistic Interpretability

**Core argument:** We cannot trust what we do not understand. Understanding neural network internals enables verification of alignment and detection of deception.

**Key work:** Chris Olah and collaborators identified "circuits" in neural networks. Discovery of "induction heads" showed algorithmic behaviors could be localized. Anthropic's "Scaling Monosemanticity" (2024) used sparse autoencoders to extract thousands of interpretable, causally active features from Claude.

**Criticisms:**
- Scalability: current techniques work on individual features, unclear if they scale to full systems
- Understanding ≠ alignment: knowing what a model computes doesn't tell us how to change it
- Speed mismatch: interpretability research takes years while new models release every months
- May provide false confidence through oversimplified explanations

### Camp 3: Agent Foundations / Theoretical Alignment

**Core argument:** Mathematical frameworks must formally specify what alignment means and prove systems satisfy those specifications before building powerful AI.

**Key work:** MIRI's research on decision theory, logical uncertainty, corrigibility. "Inner alignment" vs. "outer alignment" (Hubinger et al., 2019) -- mesa-optimizers may develop different internal objectives. Stuart Russell's cooperative inverse reinforcement learning (CIRL).

**Criticisms:**
- No practical output used in aligning current systems
- Unfalsifiable concerns (deceptive mesa-optimization not empirically observed)
- Moving goalposts: each empirical success is declared not addressing the "real" problem
- May draw talent away from immediately impactful empirical work

### Comparison

| Criterion | Scalable Oversight | Mechanistic Interpretability | Agent Foundations |
|-----------|-------------------|----------------------------|-------------------|
| Practical impact today | High | Medium | Low |
| Theoretical rigor | Low-Medium | Medium | High |
| Scalability to superhuman AI | Uncertain | Uncertain | Designed for this, unproven |
| Key institutions | OpenAI, Anthropic, DeepMind | Anthropic, independents | MIRI, academics |
| Main weakness | Goodhart's Law | May not scale | No practical output |

### Recommendations

1. Understand all three camps -- the best outcome likely requires contributions from all approaches.
2. Scalable oversight is the only camp with production-ready techniques today.
3. Mechanistic interpretability offers the best combination of theoretical interest and practical applicability for new researchers.
4. Support all three approaches -- the asymmetry of consequences justifies precaution.

---

## Task 3: What Happened to the "Serverless" Computing Trend (2018-2025)

### Answer

Serverless delivered on some promises and fell short on others. It succeeded as a deployment model for event-driven, intermittent workloads and became a standard part of the cloud toolkit. It failed to become the dominant computing paradigm that 2018-era hype predicted. Serverless is a good tool for specific use cases, not a universal replacement for containers or VMs. The industry's attention shifted to containers/Kubernetes as the default, with serverless as one option among many.

### Promise Scorecard

| Promise | Delivered? | Notes |
|---------|-----------|-------|
| No server management | Partially | Traded server ops for config/architecture complexity |
| Auto-scaling | Mostly | Works, with cold start and throttling caveats |
| Pay-per-use economics | At low scale | Inverts at sustained high throughput (~20-30% utilization crossover) |
| Faster development | For simple cases | Complex apps hit constraints quickly |
| Reduced operational burden | Partially | New operational concerns replaced old ones |
| Universal adoption | No | Remained one tool among many |

### Analysis

**Why Kubernetes won the "default" position:** Portability (containers run anywhere), predictability (no cold starts), cost control at scale, better debugging/tooling, existing team skills, and hybrid cloud compatibility.

**The evolution -- serverless containers:** AWS Fargate, Google Cloud Run, and Azure Container Apps provided the best of both worlds: container portability with serverless scaling. By 2024, Cloud Run had gained significant traction as "serverless done right."

**Edge functions (the next wave):** Cloudflare Workers, Vercel Edge Functions, and Deno Deploy eliminate cold start problems (V8 isolates start in milliseconds), reduce latency, and offer simpler programming models, but have their own constraints.

### Recommendations

1. **Use serverless functions for:** Event-driven glue, low-traffic APIs, prototypes, intermittent data processing
2. **Use serverless containers (Cloud Run, Fargate) for:** Production APIs needing auto-scaling + operational simplicity (current sweet spot)
3. **Avoid serverless functions for:** Latency-sensitive apps, sustained high-throughput, complex stateful apps, vendor portability needs

---

## Task 4: Why Google+ Failed While Other Google Products Succeeded

### Answer

Google+ failed primarily because it was a top-down strategic response to a competitive threat (Facebook) rather than a product built around a genuine user need. The non-obvious lessons reveal how even the most capable organizations fail when they violate fundamental product principles.

### Non-Obvious Lessons

**Lesson 1: Manufactured urgency creates pathological organizations.** Google+ was a company-wide mandate with employee bonuses tied to its metrics. Teams optimized for compliance rather than user value. YouTube integrated Google+ comments not because it improved YouTube, but because executives demanded it -- resulting in worse UX and user backlash.

**Lesson 2: Social products require organic community identity.** Facebook succeeded at Harvard first. Twitter grew from tech early adopters. Google+ launched to everyone simultaneously with no distinct identity. "Circles" was technically superior but solved a problem users didn't viscerally feel. No user woke up thinking "I wish Google had a social network."

**Lesson 3: Inflated metrics delay necessary pivots.** By counting anyone who interacted with any Google+-integrated feature as a "user," Google created an illusion of success. This delayed recognition of failure and bred internal cynicism.

**Lesson 4: Engineering excellence cannot substitute for product-market fit.** Google+ had better features than Facebook (Circles, Hangouts, photos). None of it mattered without the social graph. In network-effect businesses, the product IS the network, not the features.

**Lesson 5: Forced integration poisons the host product.** Requiring Google+ for YouTube comments drove YouTube quality down and generated massive backlash. Parasitic growth strategies destroy trust and damage the host.

**Lesson 6: Organizational culture creates systematic blind spots.** Google's DNA (engineering-driven, data-centric, algorithm-focused) excels at information/infrastructure products but is poorly suited to community building and social dynamics. The company kept trying to apply engineering solutions to social problems.

### Recommendations

1. Never mandate adoption through integration leverage -- if users don't choose it voluntarily, force-feeding generates resentment
2. Compete by being different, not similar-but-from-us
3. Demand honest engagement metrics from day one
4. Recognize cultural blind spots -- social products require different competencies

---

## Task 5: The Replication Crisis in Psychology

### Answer

The crisis is real and severe: only 36-39% of published findings replicated, with effect sizes roughly half the originals. However, it has catalyzed the most significant methodological reform in the field's history. Since 2015, pre-registration, registered reports, larger samples, open data, and multi-site replications have become substantially more common. The field is genuinely healthier, but systemic problems persist.

### How Bad Is It?

- **Reproducibility Project (2015):** 36% of 100 top-journal studies replicated (vs. 97% of originals)
- **Many Labs 2 (2018):** 54% of 28 classic findings replicated; variability across labs was small (failures = original findings likely false)
- **Effect size shrinkage:** Replications showed effects roughly half original magnitude
- **Not uniform:** Cognitive psychology replicated much better than social psychology
- **Statcheck (2016):** ~50% of papers had statistical inconsistencies; 12.5% had conclusion-affecting errors
- **High-profile failures:** Ego depletion, power posing, social priming, facial feedback hypothesis

### Root Causes

1. **Publication bias:** Journals overwhelmingly published positive results; ~91% positive result rate (implausibly high)
2. **Low statistical power:** Median power ~21% -- most studies couldn't detect true effects
3. **Analytic flexibility:** Standard choices (outlier exclusion, variable selection, stopping rules) could inflate false positives from 5% to 60%+
4. **Perverse career incentives:** Academic careers reward novelty and volume over rigor
5. **HARKing:** Presenting post-hoc findings as if predicted a priori

### What Has Changed Since 2015

- **Pre-registration:** Grew from <100 in 2012 to 40,000+ by 2023 on OSF (single most impactful reform)
- **Registered Reports:** 300+ journals; accepted studies published regardless of results; positive rate dropped from ~96% to ~44%
- **Larger samples:** Funding bodies increasingly require power analyses
- **Open data/materials:** TOP guidelines, sharing badges increased data sharing significantly
- **Multi-site replications:** Many Labs model became established research paradigm
- **Statistical reform:** Growing adoption of Bayesian methods, effect-size estimation, equivalence testing

### What Has NOT Changed

- Career incentives still favor publication count and journal prestige over rigor
- Tens of thousands of unreliable findings remain in the literature and continue to be cited
- Applied subfields (clinical, educational) have been slower to adopt reforms
- Journals still favor novelty

### Broader Impact

Similar problems documented in medicine, economics (61% replication), cancer biology (46% replication), and neuroscience. Psychology is arguably ahead of these fields in implementing reforms.

### Recommendations

1. **Consumers:** Treat single studies as preliminary; look for meta-analyses and multi-site replications
2. **Researchers:** Pre-register, power analyze, share data, publish null results -- these are minimum standards now
3. **Institutions:** Reform hiring/funding criteria to value rigor and open science, not just publication count
4. **Practitioners:** Audit evidence bases for treatments/interventions based on unreplicated findings
5. **Other fields:** Assume you have a replication problem until demonstrated otherwise

---

## Summary

| Task | Topic | Key Finding |
|------|-------|-------------|
| 1 | Homomorphic Encryption | Viable for narrow use cases today; 3-7 years from general-purpose readiness |
| 2 | AI Alignment Approaches | Three camps (scalable oversight, interpretability, agent foundations) each with real strengths; field likely needs all three |
| 3 | Serverless Computing | Delivered for event-driven workloads but failed as dominant paradigm; winning form is serverless containers |
| 4 | Google+ Failure | Built for corporate strategy, not user need; key lessons on forced adoption, vanity metrics, cultural blind spots |
| 5 | Replication Crisis | Severe (36-54% replication) but catalyzed historic methodological reform; systemic incentive problems persist |
