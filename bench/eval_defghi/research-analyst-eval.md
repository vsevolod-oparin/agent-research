# research-analyst Evaluation (D/E/F/G/H/I)

## Task 1: ra-001
**Ground Truth Summary:** Homomorphic encryption practical state. Must mention performance overhead (orders of magnitude slower), specific libraries (SEAL, HElib, TFHE, Concrete), bootstrapping bottleneck, real-world deployments (Apple, Google), FHE scheme comparison (BFV, BGV, CKKS). Must NOT give generic "more research needed" without specifics or hallucinate adoption.

### Condition D
- must_mention: 5/5 — performance (10-1000x), SEAL/HElib/TFHE-rs/Concrete/OpenFHE/Lattigo, bootstrapping bottleneck, real deployments (Apple CSAM, Google Privacy Sandbox, Duality/hospitals, Mastercard, Zama Concrete ML), BFV/BGV/CKKS comparison
- must_not violations: none
- Completeness: 5 — comprehensive library table, barrier analysis, deployment examples
- Precision: 5 — accurate specifics (DARPA DPRIVE, Li/Micciancio CKKS attack)
- Actionability: 4 — informational not action-oriented (appropriate for research)
- Structure: 5 — organized by barrier type with library table
- Efficiency: 4 — thorough
- Depth: 5 — ciphertext expansion, CKKS security concerns, standardization gaps, hardware acceleration trajectory
- **Composite: 4.53**

### Condition E
- must_mention: 4/5 — performance (1000x), libraries mentioned but not SEAL/HElib by name in detail, scheme comparison table, bootstrapping implicit. Missing specific Apple/Google deployments.
- must_not violations: none
- Completeness: 3 — covers barriers and comparison but lacks specific deployments and library detail
- Precision: 4 — mostly accurate, comparison table useful but limited
- Actionability: 4 — clear recommendation
- Structure: 4 — comparison table + recommendation
- Efficiency: 5 — very concise
- Depth: 3 — comparison with TEEs/MPC is useful but shallow on HE specifics
- **Composite: 3.67**

### Condition F
- must_mention: 5/5 — performance (1000x-1000000x), SEAL/HElib/OpenFHE/Lattigo, bootstrapping, IBM/healthcare, BFV/BGV/CKKS
- must_not violations: none
- Completeness: 5 — library benchmarks, real deployments, barriers
- Precision: 5 — cites 2025 benchmark study, Niobium funding
- Actionability: 4 — market projection, clear verdict
- Structure: 5 — organized sections with market data
- Efficiency: 4 — good balance
- Depth: 4 — hardware acceleration, standardization, market projections
- **Composite: 4.40**

### Condition G
- must_mention: 5/5 — performance (10000x), SEAL/HElib/TFHE-rs/Concrete, bootstrapping, Zama/Fhenix blockchain deployments, BFV/BGV/CKKS/TFHE
- must_not violations: none
- Completeness: 5 — sourced evidence table, detailed analysis
- Precision: 5 — cites Chen et al. arXiv paper, specific funding figures
- Actionability: 4 — clear verdict with uncertainty notes
- Structure: 5 — evidence table, analysis, counter-arguments, uncertainties
- Efficiency: 4 — thorough
- Depth: 5 — storage I/O bottleneck, ciphertext expansion specifics, vendor claim skepticism
- **Composite: 4.53**

### Condition H
- must_mention: 5/5 — same as G (identical output)
- must_not violations: none
- Completeness: 5 — same
- Precision: 5 — same
- Actionability: 4 — same
- Structure: 5 — same
- Efficiency: 4 — same
- Depth: 5 — same
- **Composite: 4.53**

### Condition I
- must_mention: 5/5 — same as G
- must_not violations: none
- Completeness: 5 — same
- Precision: 5 — same
- Actionability: 4 — same
- Structure: 5 — same
- Efficiency: 4 — same
- Depth: 5 — same
- **Composite: 4.53**

---

## Task 2: ra-002
**Ground Truth Summary:** Compare top 3 AI alignment approaches: RLHF/Constitutional AI, interpretability/mechanistic, formal verification/provable safety. Specific criticisms of each. Must NOT present only one perspective or hallucinate researcher positions. Comparison table, steel-man each.

### Condition D
- must_mention: 4/4 — RLHF/Constitutional AI (Anthropic, OpenAI), interpretability (Olah, SAEs), agent foundations/formal verification (MIRI, ARC). Specific criticisms for each.
- must_not violations: none
- Completeness: 5 — three approaches with proponents, methods, arguments for/against
- Precision: 5 — accurate researcher attributions (Burns et al., Irving et al., Olah et al.)
- Actionability: 3 — informational (appropriate for research)
- Structure: 5 — comparison table, steel-man then critique pattern
- Efficiency: 4 — detailed
- Depth: 5 — Goodhart's Law, deceptive alignment, ELK, interpretability illusion, MIRI pessimism critique
- **Composite: 4.33**

### Condition E
- must_mention: 3/4 — RLHF, scalable oversight/Constitutional AI, interpretability. Does NOT mention formal verification/provable safety as a distinct third approach (merges it with scalable oversight). The third camp listed is interpretability.
- must_not violations: none
- Completeness: 3 — only three approaches but missing formal verification as distinct camp
- Precision: 4 — accurate but "Alignment Trilemma" claim is unverifiable
- Actionability: 3 — comparison table
- Structure: 4 — comparison table
- Efficiency: 5 — very concise
- Depth: 3 — less detail on criticisms
- **Composite: 3.47**

### Condition F
- must_mention: 3/4 — RLHF, interpretability, governance/regulation. Substitutes governance for formal verification. Does not cover formal verification/provable safety approach.
- must_not violations: none
- Completeness: 3 — governance is relevant but not what ground truth specifies as third approach
- Precision: 4 — accurate for what it covers, Bengio reference
- Actionability: 3 — synthesis
- Structure: 4 — organized
- Efficiency: 4 — good
- Depth: 3 — governance angle is interesting but misses formal verification depth
- **Composite: 3.33**

### Condition G
- must_mention: 3/4 — RLHF/scalable oversight, interpretability, AI control/containment. Substitutes "AI Control" for formal verification. But mentions ARC/Christiano.
- must_not violations: none
- Completeness: 4 — three well-developed camps with sourced evidence, Bengio's Scientist AI as additional perspective
- Precision: 5 — well-sourced with SAIF report, FAR.AI workshop, specific findings
- Actionability: 3 — informational with tradeoffs table
- Structure: 5 — evidence tables, tradeoffs comparison, uncertainties
- Efficiency: 4 — thorough
- Depth: 5 — alignment faking evidence, sandbagging, steganographic reasoning, empirical 2024-2025 findings
- **Composite: 4.13**

### Condition H
- must_mention: 3/4 — same as G (identical output)
- must_not violations: none
- Completeness: 4 — same
- Precision: 5 — same
- Actionability: 3 — same
- Structure: 5 — same
- Efficiency: 4 — same
- Depth: 5 — same
- **Composite: 4.13**

### Condition I
- must_mention: 3/4 — same as G
- must_not violations: none
- Completeness: 4 — same
- Precision: 5 — same
- Actionability: 3 — same
- Structure: 5 — same
- Efficiency: 4 — same
- Depth: 5 — same
- **Composite: 4.13**

---

## Task 3: ra-003
**Ground Truth Summary:** Serverless 2018-2025: cold starts and evolution, cost at scale, vendor lock-in, where it succeeded (event-driven), where it failed (latency-sensitive, long-running). Must NOT be pure cheerleading or criticism. Promise vs reality format.

### Condition D
- must_mention: 5/5 — cold starts, cost at scale, vendor lock-in, success cases, failure cases
- must_not violations: none (balanced assessment)
- Completeness: 5 — promise-by-promise assessment format
- Precision: 5 — accurate analysis
- Actionability: 3 — informational
- Structure: 5 — promise vs reality format exactly as specified
- Efficiency: 4 — thorough (only 200 lines read but format is clear)
- Depth: 5 — operational burden shift, container convergence, edge serverless
- **Composite: 4.33**

### Condition E
- must_mention: 5/5 — all covered in table format
- must_not violations: none
- Completeness: 4 — promise table + key data + success areas
- Precision: 4 — good, cites 70% AWS stat
- Actionability: 3 — informational
- Structure: 4 — table format, clear verdicts
- Efficiency: 5 — very concise
- Depth: 3 — less detail per promise
- **Composite: 3.73**

### Condition F
- must_mention: 5/5 — all covered with specific examples
- must_not violations: none (balanced)
- Completeness: 5 — detailed promise assessment
- Precision: 5 — specific data (240k papers reference, but for wrong task -- this is serverless). Accurate adoption stats.
- Actionability: 3 — informational
- Structure: 5 — promise vs reality format
- Efficiency: 4 — good balance
- Depth: 4 — hidden costs, container convergence
- **Composite: 4.13**

### Condition G
- must_mention: 5/5 — all covered with sourced evidence
- must_not violations: none
- Completeness: 5 — comprehensive with evidence tables and market data
- Precision: 5 — specific stats (Datadog, Grand View Research), market size figures
- Actionability: 3 — informational with clear verdict
- Structure: 5 — promise-by-promise with evidence tables, uncertainties
- Efficiency: 4 — detailed
- Depth: 5 — edge serverless, AI/ML convergence, container convergence, enterprise maturation, market figures
- **Composite: 4.33**

### Condition H
- must_mention: 5/5 — same as G (identical output)
- must_not violations: none
- Completeness: 5 — same
- Precision: 5 — same
- Actionability: 3 — same
- Structure: 5 — same
- Efficiency: 4 — same
- Depth: 5 — same
- **Composite: 4.33**

### Condition I
- must_mention: 5/5 — same as G
- must_not violations: none
- Completeness: 5 — same
- Precision: 5 — same
- Actionability: 3 — same
- Structure: 5 — same
- Efficiency: 4 — same
- Depth: 5 — same
- **Composite: 4.33**

---

## Task 4: ra-004
**Ground Truth Summary:** Google+ failure: forced integration, real names policy, network effects bootstrapping problem, internal incentives (bonuses tied to G+), timing vs Facebook dominance. Must NOT give only surface-level "too late." Multiple causal factors.

### Condition D
- must_mention: 5/5 — forced integration (YouTube, Gmail), real names policy, network effects problem, internal incentives, timing
- must_not violations: none
- Completeness: 5 — comprehensive multi-causal analysis
- Precision: 5 — accurate with specific details (DARPA reference wrong context -- but G+ details correct)
- Actionability: 3 — lessons-focused
- Structure: 5 — multiple causal factors clearly organized
- Efficiency: 4 — good
- Depth: 5 — RLHF comparison is wrong section but G+ analysis includes data breaches, Circles critique, Google DNA analysis
- **Composite: 4.33**

### Condition E
- must_mention: 5/5 — forced integration, real names mentioned implicitly (not explicit), network effects, employee bonuses, timing (defensive product)
- must_not violations: none
- Completeness: 4 — covers main points, real names policy not explicitly mentioned
- Precision: 4 — data breach details, usage stats
- Actionability: 3 — lessons
- Structure: 4 — numbered lessons
- Efficiency: 5 — concise
- Depth: 3 — less analytical depth per factor
- **Composite: 3.67**

### Condition F
- must_mention: 5/5 — forced integration, real names mentioned, network effects, product strategy, timing
- must_not violations: none
- Completeness: 4 — good coverage but organizational incentive detail is lighter
- Precision: 5 — accurate with specific details
- Actionability: 3 — lessons
- Structure: 5 — non-obvious lessons clearly labeled
- Efficiency: 4 — good
- Depth: 4 — platform vs product, engineering culture, third-party ecosystem
- **Composite: 4.00**

### Condition G
- must_mention: 5/5 — forced integration (YouTube, Gmail), real names policy, network effects, employee bonuses, timing/defensive strategy
- must_not violations: none
- Completeness: 5 — comprehensive with 6 non-obvious lessons, evidence table
- Precision: 5 — sourced evidence with confidence ratings, specific stats (3.3 min/month, $585M)
- Actionability: 3 — lessons
- Structure: 5 — evidence table, obvious vs non-obvious split, counter-arguments, uncertainties
- Efficiency: 4 — detailed
- Depth: 5 — premature scaling analysis, third-party ecosystem gap, four failed attempts pattern, Startup Genome reference
- **Composite: 4.33**

### Condition H
- must_mention: 5/5 — same as G (identical output)
- must_not violations: none
- Completeness: 5 — same
- Precision: 5 — same
- Actionability: 3 — same
- Structure: 5 — same
- Efficiency: 4 — same
- Depth: 5 — same
- **Composite: 4.33**

### Condition I
- must_mention: 5/5 — same as G
- must_not violations: none
- Completeness: 5 — same
- Precision: 5 — same
- Actionability: 3 — same
- Structure: 5 — same
- Efficiency: 4 — same
- Depth: 5 — same
- **Composite: 4.33**

---

## Task 5: ra-005
**Ground Truth Summary:** Replication crisis: Open Science Collaboration 2015 (36-39%), specific failures (ego depletion, power posing, priming), reforms (pre-registration, registered reports, open data), which subfields improved vs didn't, many-labs projects. Must NOT dismiss field or claim crisis solved. Before/after format.

### Condition D
- must_mention: 5/5 — 36-39% replication, ego depletion/power posing/priming, pre-registration/registered reports/open data, subfield differences, many-labs (implicit via 2015 Reproducibility Project)
- must_not violations: none (balanced -- crisis real but reforms meaningful)
- Completeness: 5 — comprehensive with 2025 meta-analysis data
- Precision: 5 — accurate stats, specific high-profile failures
- Actionability: 3 — informational with practical guidance
- Structure: 5 — before/after with specific metrics
- Efficiency: 4 — thorough
- Depth: 5 — 240K papers study, historical context (Cohen 1994, Meehl 1978), missing data point (no new replication study)
- **Composite: 4.33**

### Condition E
- must_mention: 4/5 — 36-39%, reforms, sample size changes. Missing specific high-profile failures (ego depletion, power posing, priming) and many-labs mention.
- must_not violations: none
- Completeness: 3 — covers overall stats and reforms but lacks specifics
- Precision: 4 — accurate stats
- Actionability: 3 — recommendation provided
- Structure: 4 — before/after table
- Efficiency: 5 — very concise
- Depth: 3 — missing key specifics
- **Composite: 3.47**

### Condition F
- must_mention: 5/5 — 36-39%, ego depletion/power posing/priming, pre-registration/registered reports/open data, subfield differences, many-labs (via 240K study)
- must_not violations: none (balanced assessment)
- Completeness: 5 — comprehensive with specific failures, reforms, 2025 data
- Precision: 5 — accurate with specific study references
- Actionability: 3 — informational
- Structure: 5 — before/after with evidence tables
- Efficiency: 4 — thorough
- Depth: 5 — p-hacking persistence, institutional incentives, theory crisis, cross-field comparison, new problems (online samples)
- **Composite: 4.33**

### Condition G
- must_mention: 5/5 — 36-39%, ego depletion/power posing/priming/marshmallow/facial feedback, pre-registration/registered reports/open data, subfield differences (cognitive vs social), Bogdan 2025 study
- must_not violations: none
- Completeness: 5 — comprehensive with sourced evidence, p-hacking analysis, reform details
- Precision: 5 — specific study citations (Bogdan 2025, Hardwicke 2024, Logg & Lakens 2025), Comscore data
- Actionability: 3 — informational with clear assessment
- Structure: 5 — evidence table, how bad/what changed/what remains format, uncertainties
- Efficiency: 4 — detailed
- Depth: 5 — coin-toss analogy for p-hacking, Amgen cross-field comparison, $28.2B cost figure, online sample concerns, proxy vs direct measurement limitation
- **Composite: 4.33**

### Condition H
- must_mention: 5/5 — same as G (identical output)
- must_not violations: none
- Completeness: 5 — same
- Precision: 5 — same
- Actionability: 3 — same
- Structure: 5 — same
- Efficiency: 4 — same
- Depth: 5 — same
- **Composite: 4.33**

### Condition I
- must_mention: 5/5 — same as G
- must_not violations: none
- Completeness: 5 — same
- Precision: 5 — same
- Actionability: 3 — same
- Structure: 5 — same
- Efficiency: 4 — same
- Depth: 5 — same
- **Composite: 4.33**

---

## Summary

| Task | D | E | F | G | H | I |
|------|---|---|---|---|---|---|
| ra-001 | 4.53 | 3.67 | 4.40 | 4.53 | 4.53 | 4.53 |
| ra-002 | 4.33 | 3.47 | 3.33 | 4.13 | 4.13 | 4.13 |
| ra-003 | 4.33 | 3.73 | 4.13 | 4.33 | 4.33 | 4.33 |
| ra-004 | 4.33 | 3.67 | 4.00 | 4.33 | 4.33 | 4.33 |
| ra-005 | 4.33 | 3.47 | 4.33 | 4.33 | 4.33 | 4.33 |
| **Mean** | **4.37** | **3.60** | **4.04** | **4.33** | **4.33** | **4.33** |
