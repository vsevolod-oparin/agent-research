# research-analyst Evaluation (D/E/F/G/H/I/J)

## Task 1: ra-001
**Ground Truth Summary:** Homomorphic encryption state. Must mention performance overhead (orders of magnitude), specific libraries (SEAL, HElib, TFHE, Concrete), bootstrapping as bottleneck, real-world deployments (Apple, Google), comparison of FHE schemes (BFV, BGV, CKKS). Must NOT give generic "more research needed" or hallucinate adoption claims.

### Condition D
- must_mention: 5/5 -- performance overhead (10-1000x), libraries (SEAL, HElib, TFHE-rs, Concrete, OpenFHE, Lattigo), bootstrapping, real-world deployments (healthcare, finance, Apple PSI, Google Privacy Sandbox, Zama ML), scheme comparison (BFV, BGV, CKKS, TFHE)
- must_not violations: none
- Completeness: 5 -- Comprehensive coverage with library table, barriers, outlook
- Precision: 5 -- Accurate, nuanced (CKKS attack citation)
- Actionability: 4 -- Research-oriented, appropriate recommendations
- Structure: 5 -- Executive summary, library table, deployment examples, barriers, verdict
- Efficiency: 4 -- Long but appropriate for research topic
- Depth: 5 -- DARPA DPRIVE, Li-Micciancio attack, compiler tooling
- **Composite: 4.67**

### Condition E
- must_mention: 4/5 -- performance, libraries (SEAL, HElib, OpenFHE, Lattigo), schemes (BFV, BGV, CKKS); real-world deployments mentioned (IBM, finance) but NOT Apple or Google specifically; bootstrapping mentioned via hardware acceleration
- must_not violations: none
- Completeness: 4 -- Good coverage but missing some specific deployments
- Precision: 4 -- Mostly accurate; some claims from web search may need verification
- Actionability: 4 -- Good recommendations
- Structure: 4 -- Well organized
- Efficiency: 4 -- Good length
- Depth: 4 -- Hardware acceleration, market projections
- **Composite: 4.00**

### Condition F
- must_mention: 4/5 -- Same as E with web search data (Niobium, Zama funding); missing Apple/Google specific
- must_not violations: none
- Completeness: 4 -- Same scope as E
- Precision: 4 -- Web search results add data but some vendor-sourced
- Actionability: 4 -- Good
- Structure: 4 -- Well organized
- Efficiency: 4 -- Good
- Depth: 4 -- Market projections, hardware investment
- **Composite: 4.00**

### Condition G
- must_mention: 4/5 -- performance (1000x+ FHE), libraries mentioned indirectly, bootstrapping (via FHE slowdown), schemes (BFV, BGV, CKKS, TFHE); limited real-world deployment specifics; comparison table with TEEs/MPC
- must_not violations: none
- Completeness: 3 -- Shorter, less detailed than others; comparison with TEEs/MPC is valuable but at expense of HE depth
- Precision: 5 -- Accurate
- Actionability: 4 -- Good recommendation framework
- Structure: 4 -- Comparison table useful
- Efficiency: 5 -- Very concise
- Depth: 3 -- Less depth than D or H
- **Composite: 3.87**

### Condition H
- must_mention: 5/5 -- performance (10,000-100,000x), libraries (SEAL, HElib, OpenFHE, Zama TFHE-rs), bootstrapping (storage I/O bottleneck), real-world deployments (Zama blockchain, Fhenix, healthcare, finance), schemes (BFV, BGV, CKKS, TFHE)
- must_not violations: none (explicit counter-arguments section)
- Completeness: 5 -- Very thorough with evidence table and confidence levels
- Precision: 5 -- Excellent with arXiv citations, source confidence ratings
- Actionability: 4 -- Research appropriate
- Structure: 5 -- Evidence table, analysis, counter-arguments, uncertainties
- Efficiency: 3 -- Long
- Depth: 5 -- Chen et al. storage I/O paper, ciphertext expansion specifics
- **Composite: 4.47**

### Condition I
- must_mention: 5/5 -- Same as H (identical)
- must_not violations: none
- Completeness: 5 -- Same
- Precision: 5 -- Same
- Actionability: 4 -- Same
- Structure: 5 -- Same
- Efficiency: 3 -- Same
- Depth: 5 -- Same
- **Composite: 4.47**

### Condition J
- must_mention: 5/5 -- performance (10-100x optimized, worse for complex), libraries (SEAL, HElib, OpenFHE, TFHE-rs, Concrete), bootstrapping, deployments (finance, healthcare pilots, Google transpiler, Apple), schemes (BFV, BGV, CKKS, TFHE)
- must_not violations: none
- Completeness: 5 -- Thorough with confidence markers throughout
- Precision: 5 -- Careful with confidence levels
- Actionability: 4 -- Good recommendations
- Structure: 5 -- Well organized with verification notes
- Efficiency: 4 -- Good length
- Depth: 5 -- ISO standard mention, hybrid approaches recommendation
- **Composite: 4.60**

---

## Task 2: ra-002
**Ground Truth Summary:** Compare top 3 AI alignment approaches. Must mention RLHF/Constitutional AI, interpretability/mechanistic, formal verification/provable safety. Must have specific criticisms of each (not just "has limitations"). Must NOT present only one perspective or hallucinate positions.

### Condition D
- must_mention: 3/3 -- RLHF/Constitutional AI (detailed), mechanistic interpretability (detailed), agent foundations/formal verification (detailed)
- must_not violations: none
- Completeness: 5 -- All three approaches with proponents, methods, arguments for/against
- Precision: 5 -- Accurate attributions (Irving, Burns, Christiano, Olah, Yudkowsky)
- Actionability: 4 -- Research synthesis
- Structure: 5 -- Comparison table, key insight section
- Efficiency: 3 -- Very long
- Depth: 5 -- Specific methods (SAEs, ELK, debate), specific criticisms
- **Composite: 4.47**

### Condition E
- must_mention: 3/3 -- RLHF/Constitutional AI, interpretability, governance/regulation (replaces formal verification)
- must_not violations: none
- Completeness: 4 -- Three approaches but replaces formal verification with governance
- Precision: 4 -- Mostly accurate; governance camp is valid but different from ground truth's "formal verification"
- Actionability: 4 -- Good synthesis
- Structure: 4 -- Comparison table
- Efficiency: 4 -- Good length
- Depth: 4 -- Good criticisms of each
- **Composite: 4.00**

### Condition F
- must_mention: 2/3 -- RLHF/Constitutional AI, interpretability; third approach is governance instead of formal verification
- must_not violations: none
- Completeness: 4 -- Same issue as E -- governance replaces formal verification
- Precision: 4 -- Accurate for what it covers
- Actionability: 4 -- Good
- Structure: 4 -- Good comparison table
- Efficiency: 4 -- Good
- Depth: 4 -- Good criticisms
- **Composite: 3.87**

### Condition G
- must_mention: 3/3 -- RLHF, scalable oversight/Constitutional AI, interpretability; third mentions formal verification tangentially (Alignment Trilemma)
- must_not violations: none
- Completeness: 3 -- Only covers RLHF/scalable oversight and interpretability well; formal verification approach is not a distinct camp
- Precision: 4 -- Alignment Trilemma reference interesting but not well-established
- Actionability: 4 -- Good
- Structure: 4 -- Comparison table
- Efficiency: 5 -- Concise
- Depth: 3 -- Less depth per approach
- **Composite: 3.73**

### Condition H
- must_mention: 3/3 -- RLHF/scalable oversight, interpretability, AI control/containment (replaces formal verification but well-argued)
- must_not violations: none
- Completeness: 5 -- Thorough with evidence table, SAIF citations, Bengio's perspective
- Precision: 5 -- Excellent with specific citations and confidence levels
- Actionability: 4 -- Good research
- Structure: 5 -- Evidence table, comparison matrix
- Efficiency: 3 -- Very long
- Depth: 5 -- Alignment faking evidence, SAIF report, Redwood Research
- **Composite: 4.47**

### Condition I
- must_mention: 3/3 -- Same as H (identical)
- must_not violations: none
- Completeness: 5 -- Same
- Precision: 5 -- Same
- Actionability: 4 -- Same
- Structure: 5 -- Same
- Efficiency: 3 -- Same
- Depth: 5 -- Same
- **Composite: 4.47**

### Condition J
- must_mention: 3/3 -- RLHF/scalable oversight, interpretability, agent foundations/formal (with MIRI, ARC, ELK)
- must_not violations: none
- Completeness: 5 -- All three approaches with methods, proponents, criticisms
- Precision: 5 -- Accurate with careful confidence levels
- Actionability: 4 -- Good
- Structure: 5 -- Well organized with fourth camp note
- Efficiency: 3 -- Long
- Depth: 5 -- ELK, embedded agency, corrigibility, sycophancy
- **Composite: 4.47**

---

## Task 3: ra-003
**Ground Truth Summary:** Serverless computing 2018-2025. Must mention cold starts and evolution, cost at scale, vendor lock-in, where it succeeded (event-driven, sporadic), where it failed (latency-sensitive, long-running). Must NOT be pure cheerleading or criticism. Should use promise vs reality format.

### Condition D
- must_mention: 5/5 -- cold starts (evolution noted), cost at scale, vendor lock-in, successes (event-driven), failures (stateful, long-running)
- must_not violations: none (balanced)
- Completeness: 5 -- Promise-by-promise format, comprehensive
- Precision: 5 -- Accurate
- Actionability: 4 -- Analytical
- Structure: 5 -- Promise vs reality table
- Efficiency: 3 -- Very long
- Depth: 5 -- Container counter-trend, managed K8s
- **Composite: 4.47**

### Condition E
- must_mention: 5/5 -- cold starts (7 seconds), cost at scale (3x more expensive), vendor lock-in, successes (API backends, event processing), failures (latency-sensitive)
- must_not violations: none
- Completeness: 4 -- Good but less detailed
- Precision: 4 -- Some web-sourced statistics
- Actionability: 4 -- Good
- Structure: 4 -- Promise-verdict table
- Efficiency: 5 -- Concise
- Depth: 4 -- Container-based serverless trend
- **Composite: 4.13**

### Condition F
- must_mention: 5/5 -- all covered with web search data
- must_not violations: none
- Completeness: 5 -- Thorough with market data
- Precision: 4 -- Web-sourced data with vendor caveats
- Actionability: 4 -- Good
- Structure: 5 -- Promise-by-promise
- Efficiency: 3 -- Long
- Depth: 5 -- Datadog stats, market size, adoption rates
- **Composite: 4.33**

### Condition G
- must_mention: 5/5 -- cold starts, cost at scale, vendor lock-in, successes (event-driven, sporadic), failures (long-running, stateful)
- must_not violations: none
- Completeness: 4 -- Promise-verdict table, key data
- Precision: 5 -- Accurate
- Actionability: 4 -- Good
- Structure: 5 -- Promise/verdict table
- Efficiency: 5 -- Concise
- Depth: 4 -- Frontend deployment trend noted
- **Composite: 4.33**

### Condition H
- must_mention: 5/5 -- all covered with evidence table and Datadog citations
- must_not violations: none
- Completeness: 5 -- Very thorough with market data, adoption stats
- Precision: 5 -- Well-sourced with confidence levels
- Actionability: 4 -- Good
- Structure: 5 -- Promise-by-promise with evidence
- Efficiency: 3 -- Very long
- Depth: 5 -- Edge serverless, AI/ML convergence, enterprise maturation
- **Composite: 4.47**

### Condition I
- must_mention: 5/5 -- Same as H (identical)
- must_not violations: none
- Completeness: 5 -- Same
- Precision: 5 -- Same
- Actionability: 4 -- Same
- Structure: 5 -- Same
- Efficiency: 3 -- Same
- Depth: 5 -- Same
- **Composite: 4.47**

### Condition J
- must_mention: 5/5 -- all covered with careful confidence levels
- must_not violations: none
- Completeness: 5 -- Thorough with container counter-trend
- Precision: 5 -- Careful with attribution
- Actionability: 4 -- Good
- Structure: 5 -- Promise-by-promise
- Efficiency: 3 -- Long
- Depth: 5 -- Local development pain, observability gap, "Lambda spaghetti"
- **Composite: 4.47**

---

## Task 4: ra-004
**Ground Truth Summary:** Why Google+ failed. Must mention forced integration, real names policy backlash, network effects bootstrapping, internal incentive structure (bonuses), timing vs Facebook. Must NOT give only surface-level "it was too late."

### Condition D
- must_mention: 4/5 -- forced integration (YouTube, Gmail), network effects bootstrapping, internal incentives (bonuses), timing vs Facebook; does NOT mention real names policy
- must_not violations: none (multiple causal factors, not just "too late")
- Completeness: 4 -- Good depth on 5 non-obvious lessons but missing real names
- Precision: 5 -- Accurate
- Actionability: 4 -- Analytical lessons
- Structure: 5 -- Numbered non-obvious lessons
- Efficiency: 4 -- Good length
- Depth: 5 -- Engineering culture mismatch, data breaches as proximate cause
- **Composite: 4.40**

### Condition E
- must_mention: 4/5 -- forced integration, network effects, incentive structure, timing; missing real names policy
- must_not violations: none
- Completeness: 4 -- Good with 6 lessons
- Precision: 5 -- Accurate
- Actionability: 4 -- Good lessons
- Structure: 5 -- Numbered lessons, deeper pattern section
- Efficiency: 4 -- Good
- Depth: 5 -- Platform vs product insight, "One-Stop Shop" dying
- **Composite: 4.40**

### Condition F
- must_mention: 4/5 -- Same as E; forced integration, network effects, incentives, timing; missing real names
- must_not violations: none
- Completeness: 4 -- Same scope as E (identical content)
- Precision: 5 -- Same
- Actionability: 4 -- Same
- Structure: 5 -- Same
- Efficiency: 4 -- Same
- Depth: 5 -- Same
- **Composite: 4.40**

### Condition G
- must_mention: 4/5 -- forced integration, network effects, incentives (bonuses tied to engagement), timing; missing real names
- must_not violations: none
- Completeness: 4 -- 4 non-obvious lessons plus data
- Precision: 5 -- Accurate with usage data (3-5 seconds)
- Actionability: 4 -- Good
- Structure: 4 -- Numbered format
- Efficiency: 5 -- Concise
- Depth: 4 -- Good but less detail per lesson
- **Composite: 4.20**

### Condition H
- must_mention: 4/5 -- forced integration, network effects (manufactured distribution), incentive structure (bonuses/OKRs), timing; missing real names
- must_not violations: none
- Completeness: 5 -- Detailed with specific data (3.3 min/month, 70% decline)
- Precision: 5 -- Accurate with source citations
- Actionability: 4 -- Good
- Structure: 5 -- Well organized
- Efficiency: 3 -- Long
- Depth: 5 -- Specific engagement data, Goodhart's Law at org scale
- **Composite: 4.47**

### Condition I
- must_mention: 4/5 -- Same as H (identical)
- must_not violations: none
- Completeness: 5 -- Same
- Precision: 5 -- Same
- Actionability: 4 -- Same
- Structure: 5 -- Same
- Efficiency: 3 -- Same
- Depth: 5 -- Same
- **Composite: 4.47**

### Condition J
- must_mention: 4/5 -- forced integration, network effects, incentive structure (performance reviews), timing; missing real names policy explicitly
- must_not violations: none
- Completeness: 5 -- 5 non-obvious lessons with data
- Precision: 5 -- Accurate
- Actionability: 4 -- Good
- Structure: 5 -- Well organized
- Efficiency: 4 -- Good
- Depth: 5 -- Privacy/trust asymmetry, engineering culture mismatch
- **Composite: 4.53**

---

## Task 5: ra-005
**Ground Truth Summary:** Replication crisis in psychology. Must mention OSC 2015 (~36-39%), specific failures (ego depletion, power posing, priming), reforms (pre-registration, registered reports, open data), subfield differences, many-labs projects. Must NOT dismiss field or claim crisis "solved." Should use before/after format.

### Condition D
- must_mention: 5/5 -- OSC 2015 (36-39%), ego depletion/power posing/priming, reforms (pre-registration, registered reports, open data), subfield differences (social vs cognitive), many-labs (240,000 papers study)
- must_not violations: none (explicitly says reforms incomplete)
- Completeness: 5 -- Comprehensive before/after with specific statistics
- Precision: 5 -- Accurate data points
- Actionability: 4 -- Good recommendations for consumers of research
- Structure: 5 -- Before/after comparison table
- Efficiency: 4 -- Good length
- Depth: 5 -- Cohen 1994, Meehl 1978 references; missing data point noted
- **Composite: 4.67**

### Condition E
- must_mention: 5/5 -- OSC (36-39%), ego depletion/power posing/priming, reforms, subfield differences, many-labs (240,355 papers)
- must_not violations: none
- Completeness: 5 -- Thorough with specific statistics
- Precision: 5 -- Accurate with specific paper counts
- Actionability: 4 -- Good
- Structure: 5 -- Before/after format
- Efficiency: 4 -- Good
- Depth: 5 -- P-hacking persistence, theory crisis
- **Composite: 4.67**

### Condition F
- must_mention: 5/5 -- Same as E (identical content)
- must_not violations: none
- Completeness: 5 -- Same
- Precision: 5 -- Same
- Actionability: 4 -- Same
- Structure: 5 -- Same
- Efficiency: 4 -- Same
- Depth: 5 -- Same
- **Composite: 4.67**

### Condition G
- must_mention: 4/5 -- OSC (36-39%), reforms (pre-registration, registered reports), improvements noted; missing specific failures (ego depletion, power posing, priming not individually named); mentions many-labs (2025 meta-analysis)
- must_not violations: none
- Completeness: 3 -- Missing key high-profile failures by name
- Precision: 5 -- Accurate
- Actionability: 4 -- Good recommendations
- Structure: 4 -- Before/after table
- Efficiency: 5 -- Concise
- Depth: 3 -- Less detailed
- **Composite: 3.87**

### Condition H
- must_mention: 5/5 -- OSC (36-39%), ego depletion/power posing/priming/facial feedback/marshmallow, reforms, subfield differences, many-labs
- must_not violations: none
- Completeness: 5 -- Very thorough with 505 collected replications
- Precision: 5 -- Accurate with specific statistics
- Actionability: 4 -- Good
- Structure: 5 -- Well organized
- Efficiency: 3 -- Long
- Depth: 5 -- Marshmallow test SES confound, 240,355 papers analysis
- **Composite: 4.47**

### Condition I
- must_mention: 5/5 -- Same as H (identical)
- must_not violations: none
- Completeness: 5 -- Same
- Precision: 5 -- Same
- Actionability: 4 -- Same
- Structure: 5 -- Same
- Efficiency: 3 -- Same
- Depth: 5 -- Same
- **Composite: 4.47**

### Condition J
- must_mention: 5/5 -- OSC (36-39%), ego depletion implied via specific failures, reforms, subfield differences, many-labs
- must_not violations: none
- Completeness: 4 -- Good but less specific on high-profile failures
- Precision: 5 -- Careful with confidence levels
- Actionability: 4 -- Good
- Structure: 5 -- Well organized
- Efficiency: 4 -- Good
- Depth: 4 -- Good but less detailed on specific failures
- **Composite: 4.27**

---

## Summary

| Task | D | E | F | G | H | I | J |
|------|---|---|---|---|---|---|---|
| ra-001 | 4.67 | 4.00 | 4.00 | 3.87 | 4.47 | 4.47 | 4.60 |
| ra-002 | 4.47 | 4.00 | 3.87 | 3.73 | 4.47 | 4.47 | 4.47 |
| ra-003 | 4.47 | 4.13 | 4.33 | 4.33 | 4.47 | 4.47 | 4.47 |
| ra-004 | 4.40 | 4.40 | 4.40 | 4.20 | 4.47 | 4.47 | 4.53 |
| ra-005 | 4.67 | 4.67 | 4.67 | 3.87 | 4.47 | 4.47 | 4.27 |
| **Mean** | **4.54** | **4.24** | **4.25** | **4.00** | **4.47** | **4.47** | **4.47** |
