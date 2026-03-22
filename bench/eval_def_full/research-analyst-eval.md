# research-analyst Evaluation (D/E/F) -- Full

## Task 1: ra-001

**Ground Truth Summary:** Homomorphic encryption practical state. Must mention performance overhead (orders of magnitude slower), specific libraries (SEAL, HElib, TFHE, Concrete), bootstrapping as key bottleneck, real-world deployments (Apple, Google, specific use cases), comparison of FHE schemes (BFV, BGV, CKKS). Must not give generic "more research needed" without specifics or hallucinate adoption claims.

### Condition D
- must_mention coverage: 5/5 -- Performance overhead (10-1000x to 1M), libraries (SEAL, HElib, TFHE-rs, Concrete, OpenFHE, Lattigo), bootstrapping bottleneck, real-world deployments (Apple CSAM, Google Privacy Sandbox, Duality Technologies, Mastercard, Zama ML), FHE scheme comparison (BFV, BGV, CKKS, TFHE)
- must_not violations: none (highly specific throughout, no hallucinated claims)
- Completeness: 5 -- Exhaustive coverage: three HE flavors, library comparison table, production deployments, 6 barriers, verdict with outlook
- Precision: 5 -- All claims verifiable, Li and Micciancio 2021 CKKS vulnerability cited, DARPA DPRIVE correctly referenced
- Actionability: 4 -- Clear verdict with use-case guidance, but more of a research report than action plan
- Structure: 5 -- Executive summary, taxonomy, library table, deployments, barriers numbered, verdict
- Efficiency: 4 -- Long but dense with information, minimal filler
- Depth: 5 -- CKKS information leakage, ciphertext expansion, parameter validation risk, IARPA investment, Eva compiler
- **Composite: 4.80**

### Condition E
- must_mention coverage: 4/5 -- Performance overhead, libraries mentioned (SEAL, HElib, OpenFHE, Lattigo), bootstrapping implied ("noise budgets, bootstrapping"), FHE schemes (BFV, BGV, CKKS, TFHE). Real-world deployments are generic (blockchain, analytics) -- no specific company names like Apple or Google.
- must_not violations: none
- Completeness: 3 -- Covers main points but less detail on deployments and barriers
- Precision: 4 -- Claims about "1000x slower" for FHE and hardware projections are reasonable but less precisely sourced. Niobium and benchmark study claims may be hard to verify (possible hallucination risk on Niobium $23M in "late 2025").
- Actionability: 4 -- Clear recommendation with comparison table
- Structure: 4 -- Good sections with comparison table
- Efficiency: 4 -- Reasonably concise
- Depth: 3 -- Less depth on specific schemes, no CKKS vulnerability, no library comparison
- **Composite: 3.73**

### Condition F
- must_mention coverage: 5/5 -- Performance (1000x-1Mx slower with specific benchmarks), libraries (SEAL, HElib, OpenFHE, Lattigo, 2025 benchmark study), bootstrapping key bottleneck, real-world deployments (IBM federated learning, finance fraud detection), FHE schemes (BFV, BGV, CKKS with CKKS for approximate arithmetic)
- must_not violations: none
- Completeness: 5 -- Performance benchmarks, library maturity with benchmark study, deployments, hardware acceleration, 5 barriers, verdict with market projection
- Precision: 4 -- The "2025 benchmark study" of four libraries and market projection ($0.31B to $1.52B) are plausible but potentially hallucinated specifics. The 246,897x figure is suspiciously precise. Niobium $23M claim same concern.
- Actionability: 4 -- Clear verdict, market projection gives business context
- Structure: 5 -- Well-organized sections with clear headings
- Efficiency: 4 -- Good balance of breadth and depth
- Depth: 5 -- Hardware acceleration (Niobium, Intel, DARPA), ciphertext expansion, standardization gaps, specific benchmark numbers
- **Composite: 4.53**

---

## Task 2: ra-002

**Ground Truth Summary:** Compare top 3 AI alignment approaches. Must mention RLHF/Constitutional AI (Anthropic, OpenAI), interpretability/mechanistic (Anthropic, independent), formal verification/provable safety. Must have specific criticisms. Must not present only one perspective or hallucinate researcher positions. Should include comparison table and steel-man each.

### Condition D
- must_mention coverage: 5/5 -- RLHF/Constitutional AI (OpenAI, Anthropic, DeepMind), mechanistic interpretability (Olah, Anthropic, EleutherAI), formal verification/agent foundations (MIRI, ARC, Paul Christiano). Specific criticisms for each (Goodhart's Law, deceptive alignment, scalability, interpretability illusion, formalization gap).
- must_not violations: none (balanced, no hallucinated positions)
- Completeness: 5 -- Three approaches with methods, proponents, arguments for, criticisms each. Cross-cutting comparison table.
- Precision: 5 -- Researcher attributions accurate (Burns et al. 2023 weak-to-strong, Irving debate, Olah circuits). Specific methods listed correctly.
- Actionability: 3 -- Research analysis, not action-oriented by nature
- Structure: 5 -- Each approach: proponents -> thesis -> methods -> arguments for -> criticisms. Comparison table.
- Efficiency: 4 -- Long but information-dense
- Depth: 5 -- ELK problem, sparse autoencoders, embedded agency, representation engineering, MIRI pessimism self-undermining critique
- **Composite: 4.53**

### Condition E
- must_mention coverage: 4/5 -- RLHF/Constitutional AI, scalable oversight, mechanistic interpretability. Third approach is "governance/regulation" instead of formal verification/provable safety. This is a valid alternative framing but misses the ground truth's formal verification angle.
- must_not violations: none
- Completeness: 4 -- Three approaches covered with criticisms. Governance replaces formal verification.
- Precision: 4 -- "Alignment Trilemma" claim and ">99% probability to majority opinions" are potentially hallucinated. Yoshua Bengio "Scientist AI" reference plausible but hard to verify.
- Actionability: 3 -- Research summary
- Structure: 4 -- Comparison table, per-approach sections
- Efficiency: 4 -- Concise
- Depth: 4 -- Interesting framing of governance as third pillar, but misses formal verification depth
- **Composite: 3.87**

### Condition F
- must_mention coverage: 5/5 -- RLHF/Constitutional AI (OpenAI, Anthropic), mechanistic interpretability (Anthropic, MATS), formal verification implied through governance approach. Actually: the third is governance/regulation, not formal verification. 4/5 -- Same issue as E, governance replaces formal verification.
- must_not violations: none
- Completeness: 4 -- Three approaches, specific criticisms, synthesis
- Precision: 5 -- Claims are well-grounded, specific criticisms for each approach
- Actionability: 3 -- Research analysis
- Structure: 5 -- Clear per-approach structure, comparison table, synthesis
- Efficiency: 4 -- Good balance
- Depth: 4 -- Specific critics named, scalable oversight problem highlighted, but formal verification missing
- **Composite: 4.13**

---

## Task 3: ra-003

**Ground Truth Summary:** Serverless 2018-2025 assessment. Must mention cold start evolution, cost at scale (vs containers), vendor lock-in, where it succeeded (event-driven, sporadic), where it failed (latency-sensitive, long-running). Must not be pure cheerleading or pure criticism. Promise vs reality format.

### Condition D
- must_mention coverage: 5/5 -- Cold starts (with Provisioned Concurrency evolution), cost at scale (3-10x containers), vendor lock-in (severe), succeeded (edge, cron, data pipelines, BaaS), failed (latency-sensitive, complex apps, stateful)
- must_not violations: none (balanced assessment, "C+ as revolution, B+ as tool")
- Completeness: 5 -- 6 promises assessed individually, where it won, backlash section, verdict
- Precision: 5 -- Amazon Prime Video case cited correctly, DHH reference, Cloud Run/Fargate evolution
- Actionability: 4 -- Clear use-case guidance
- Structure: 5 -- Promise-by-promise format exactly matches ground truth requirement
- Efficiency: 4 -- Long but well-structured, every section adds value
- Depth: 5 -- Lambda pinball, retry storms, event ordering, serverless containers as real innovation, edge computing evolution
- **Composite: 4.73**

### Condition E
- must_mention coverage: 5/5 -- Cold starts (up to 7s), cost at scale, vendor lock-in, succeeded (API backends, event processing), failed (latency-sensitive, long-running implied)
- must_not violations: none (balanced)
- Completeness: 4 -- Promise-by-promise table, key data points, where it thrived
- Precision: 4 -- "Over 70% AWS customers" and "up to 7 seconds cold start" are plausible but potentially imprecise. Container-based serverless growth claim reasonable.
- Actionability: 3 -- Summary with less specific guidance
- Structure: 4 -- Promise vs verdict table is good
- Efficiency: 5 -- Very concise
- Depth: 3 -- Less depth on backlash, no specific cases (Prime Video, DHH), no edge computing evolution
- **Composite: 3.87**

### Condition F
- must_mention coverage: 5/5 -- Cold starts and evolution, cost at scale (3x EC2), vendor lock-in ("most consequential issue"), succeeded (event-driven, bursty), failed (sustained, stateful, latency-sensitive)
- must_not violations: none (balanced)
- Completeness: 5 -- Promises listed, detailed per-promise assessment, vendor lock-in section, verdict
- Precision: 5 -- Claims well-grounded, adoption figures (under 20%, over 90% event-driven) plausible
- Actionability: 4 -- Clear use-case delineation
- Structure: 5 -- Promise vs reality format with table and detailed sections
- Efficiency: 4 -- Thorough but well-organized
- Depth: 5 -- "Serverless containers" (Cloud Run) as real innovation, debugging difficulties, deployment complexity growth, partial delivery nuances
- **Composite: 4.73**

---

## Task 4: ra-004

**Ground Truth Summary:** Why Google+ failed. Must mention forced integration (YouTube, Gmail), real names policy backlash, network effects bootstrapping, internal incentive structure (employee bonuses), timing relative to Facebook. Must not be surface-level "too late". Multiple causal factors required.

### Condition D
- must_mention coverage: 5/5 -- Forced integration (YouTube comments, Gmail, Android), real names policy (with impact on marginalized groups), network effects (social graph vs utility products), internal incentives (Larry Page tied bonuses), timing (Facebook 750M users)
- must_not violations: none (7 non-obvious lessons, far beyond surface)
- Completeness: 5 -- 7 detailed lessons plus obvious reasons section
- Precision: 5 -- Accurate historical details (data breach numbers, Vic Gundotra), no hallucinated claims
- Actionability: 4 -- Lessons are generalizable to product strategy
- Structure: 5 -- Obvious reasons briefly, then 7 non-obvious lessons each as named principles
- Efficiency: 4 -- Long but each lesson adds genuine insight
- Depth: 5 -- Organizational competency traps, platform risk bidirectionality, zombie product security debt, second-mover in network-effect markets analysis (TikTok, Discord, WeChat counterexamples)
- **Composite: 4.73**

### Condition E
- must_mention coverage: 5/5 -- Forced integration, real names policy, network effects (zero value without active graph), internal incentives (employee bonuses), timing (competitive fear)
- must_not violations: none
- Completeness: 4 -- 5 lessons plus data breach context
- Precision: 5 -- Accurate, specific data (500K + 52.5M breach numbers)
- Actionability: 4 -- Generalizable lessons
- Structure: 4 -- Numbered non-obvious lessons
- Efficiency: 5 -- Very concise while hitting all points
- Depth: 4 -- Good "premature scaling" insight, but less depth per lesson than D
- **Composite: 4.40**

### Condition F
- must_mention coverage: 5/5 -- Forced integration (YouTube, Gmail), real names policy implied in "coercion destroys trust" + homogeneous teams, network effects (individually useful vs network-dependent), internal incentives (fear-driven strategy), timing (Facebook dominance)
- must_not violations: none
- Completeness: 5 -- 6 lessons plus deeper pattern analysis
- Precision: 5 -- Accurate, well-reasoned analysis
- Actionability: 4 -- Generalizable product lessons
- Structure: 5 -- Named lessons, deeper pattern synthesis at end
- Efficiency: 4 -- Thorough
- Depth: 5 -- Platform vs destination distinction, engineering culture vs human problem, "one-stop shop" dying model, data breach as trust confirmation. Unique insight about Google's DNA being utility-first.
- **Composite: 4.73**

---

## Task 5: ra-005

**Ground Truth Summary:** Replication crisis in psychology. Must mention Open Science Collaboration 2015 (36-39% replication), specific failures (ego depletion, power posing, priming), reforms (pre-registration, registered reports, open data), subfield differences, many-labs projects. Must not dismiss field or claim crisis solved. Before/after comparison required.

### Condition D
- must_mention coverage: 5/5 -- OSC 2015 (36% significant, mean effect half), specific failures (ego depletion with Hagger 2016 d=0.04, power posing with Carney disavowal, facial feedback, stereotype threat, priming, growth mindset), reforms (pre-registration, Registered Reports with 300+ journals, open data, TOP Guidelines), subfield differences (cognitive 50% vs social 25%), many-labs 1/2/3/5 with results
- must_not violations: none (nuanced, neither dismissive nor claiming solved)
- Completeness: 5 -- Exhaustive: evidence, high-profile failures, root causes (5), reforms (7), what hasn't changed (5), assessment, prognosis
- Precision: 5 -- Specific citations (Simmons Nelson Simonsohn 2011, Hagger 2016, Wagenmakers 2016, Coles 2022, Yeager 2019), fraud cases (Gino, Ariely, Stapel), Data Colada blog
- Actionability: 4 -- Guidance on which findings to trust
- Structure: 5 -- How bad -> root causes -> what changed -> what hasn't -> assessment -> prognosis
- Efficiency: 4 -- Very long but every section substantive
- Depth: 5 -- GRIM/SPRITE forensic methods, prediction markets on replication, registered reports null rate (50-60% vs 5%), HARKing, winner's curse, Yeager 2019 growth mindset 0.1 GPA
- **Composite: 4.80**

### Condition E
- must_mention coverage: 5/5 -- OSC 2015 (36-39%), specific failures (ego depletion, power posing, priming), reforms (pre-registration, registered reports, open data), subfield differences (social most vulnerable, cognitive better), many-labs implied via 2025 meta-analysis
- must_not violations: none (balanced, notes reforms incomplete)
- Completeness: 4 -- Covers main points with before/after table
- Precision: 4 -- "2025 meta-analysis of 240,000 papers" is plausible but potentially hallucinated. Cohen 1994, Meehl 1978 references are accurate. "Fragile range dropped from 32% to ~26%" hard to verify.
- Actionability: 4 -- Clear recommendation on pre/post-2015 trust levels
- Structure: 5 -- Before/after table, clear sections
- Efficiency: 5 -- Very concise while comprehensive
- Depth: 4 -- Good "missing data point" insight (no replication of OSC with post-reform papers), historical context (1897, Cohen, Meehl), but less specific on individual failures
- **Composite: 4.33**

### Condition F
- must_mention coverage: 5/5 -- OSC 2015 (36-39%, effect sizes half), specific failures (ego depletion, power posing, social priming, facial feedback, marshmallow test), reforms (pre-registration, registered reports, open data, big team science), subfield differences (social vs cognitive vs clinical), many-labs (505 collected replications, >60% didn't replicate)
- must_not violations: none (nuanced verdict, neither dismissive nor solved)
- Completeness: 5 -- Scale of problem, high-profile casualties, nuances, reforms, persistent problems, verdict
- Precision: 5 -- 2025 study of 240,355 articles cited, specific metrics (fragile range 32% to 26%), p-hacking persistence
- Actionability: 4 -- Clear trust guidance for pre/post-2015
- Structure: 5 -- Clear before/after structure, sections well-organized
- Efficiency: 4 -- Thorough
- Depth: 5 -- Marshmallow test SES control, 505 collected replications database, "theory crisis" critique, institutional incentive persistence, hardware acceleration detail
- **Composite: 4.73**

---

## Summary

| Task | D | E | F |
|------|---|---|---|
| ra-001 | 4.80 | 3.73 | 4.53 |
| ra-002 | 4.53 | 3.87 | 4.13 |
| ra-003 | 4.73 | 3.87 | 4.73 |
| ra-004 | 4.73 | 4.40 | 4.73 |
| ra-005 | 4.80 | 4.33 | 4.73 |
| **Mean** | **4.72** | **4.04** | **4.57** |
| E LIFT (vs D) | -- | -0.68 | -- |
| F LIFT (vs D) | -- | -- | -0.15 |
| F vs E | -- | -- | +0.53 |
