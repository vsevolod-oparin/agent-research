# research-analyst Evaluation (D/E/F/G/H)

## Task 1: ra-001

**Ground Truth Summary:** Homomorphic encryption practical state. Must mention performance overhead (orders of magnitude slower), specific libraries (SEAL, HElib, TFHE, Concrete), bootstrapping as bottleneck, real-world deployments (Apple, Google), FHE scheme comparison (BFV, BGV, CKKS). Must NOT give generic "more research needed" or hallucinate adoption claims.

### Condition D
- must_mention coverage: 5/5 -- Performance overhead (10-1000x), libraries (SEAL, HElib, OpenFHE, TFHE-rs, Concrete, Lattigo), bootstrapping bottleneck, real deployments (Apple CSAM, Google Privacy Sandbox, Duality Technologies, Mastercard), FHE scheme comparison (BFV, BGV, CKKS, TFHE)
- must_not violations: none -- No generic vagueness, careful about adoption claims
- Completeness: 5 -- Most comprehensive library table, scheme comparison, six barriers identified
- Precision: 5 -- Accurate technical claims, CKKS information leakage noted
- Actionability: 4 -- Research-oriented, less actionable but appropriate for the question
- Structure: 5 -- Executive summary, library table, barriers, verdict, outlook
- Efficiency: 4 -- Thorough
- Depth: 5 -- CKKS security concern (Li & Micciancio 2021), IARPA DPRIVE, parameter validation
- **Composite: 4.73**

### Condition E
- must_mention coverage: 4/5 -- Performance overhead, libraries (SEAL mentioned in passing), bootstrapping implied, scheme comparison (BFV, BGV, CKKS, TFHE); real-world deployments less specific (blockchain use cases but not Apple/Google)
- must_not violations: none
- Completeness: 4 -- Good but less specific on deployments and libraries
- Precision: 4 -- Generally accurate but "Alignment Trilemma" reference appears in Task 2 context; Task 1 is solid
- Actionability: 4 -- Comparison table helpful
- Structure: 4 -- Clean with comparison table
- Efficiency: 5 -- Very concise
- Depth: 3 -- Less detail on each barrier, fewer specific examples
- **Composite: 3.93**

### Condition F
- must_mention coverage: 5/5 -- Performance overhead (10,000-100,000x), libraries (SEAL, HElib, OpenFHE, Lattigo), bootstrapping (noise management), real deployments (IBM, healthcare, Zama blockchain), FHE schemes (BFV, BGV, CKKS, TFHE)
- must_not violations: none -- Source confidence ratings prevent hallucinated claims
- Completeness: 5 -- Covers performance, libraries, barriers, deployments, hardware
- Precision: 5 -- Sourced with confidence levels, Chen et al. arXiv reference
- Actionability: 4 -- Research-focused
- Structure: 5 -- Evidence table, barriers list, counter-arguments section
- Efficiency: 4 -- Thorough
- Depth: 5 -- Chen et al. I/O bottleneck paper, ciphertext expansion quantified, standardization gaps
- **Composite: 4.73**

### Condition G
- must_mention coverage: 5/5 -- Performance overhead (orders of magnitude), libraries (SEAL, HElib, OpenFHE, Lattigo, TFHE-rs, Concrete), bootstrapping, real deployments (Zama blockchain, IBM healthcare), FHE schemes (BFV, BGV, CKKS, TFHE)
- must_not violations: none -- Sourced claims with confidence ratings
- Completeness: 5 -- Comprehensive with market size projection
- Precision: 5 -- Accurate with source citations
- Actionability: 4 -- Good practical verdict
- Structure: 5 -- Evidence table, analysis, verdict
- Efficiency: 4 -- Detailed
- Depth: 5 -- 2025 benchmark study, Niobium hardware, NIST standardization
- **Composite: 4.73**

### Condition H
- must_mention coverage: 5/5 -- Performance overhead (3-6 orders of magnitude), libraries (SEAL, HElib, OpenFHE, TFHE-rs, Concrete, Lattigo), bootstrapping, real deployments (Zama, Fhenix, healthcare, finance), FHE schemes (BFV, BGV, CKKS, TFHE)
- must_not violations: none -- Careful sourcing with confidence ratings
- Completeness: 5 -- Very thorough with Chen et al. paper, market data
- Precision: 5 -- Accurate with specific arXiv reference
- Actionability: 4 -- Good practical assessment
- Structure: 5 -- Evidence table, detailed analysis, uncertainty notes
- Efficiency: 4 -- Thorough
- Depth: 5 -- I/O bottleneck (357x degradation), ciphertext expansion, standardization via HomomorphicEncryption.org
- **Composite: 4.73**

---

## Task 2: ra-002

**Ground Truth Summary:** Compare top 3 AI alignment approaches. Must mention RLHF/Constitutional AI (Anthropic, OpenAI), interpretability/mechanistic (Anthropic, independent), formal verification/provable safety. Must have specific criticisms. Must NOT present single perspective or hallucinate positions. Should have comparison table and steel-man.

### Condition D
- must_mention coverage: 4/5 -- RLHF/Constitutional AI, interpretability, formal verification/agent foundations; specific criticisms for each. Missing: steel-manning is implicit not explicit. Formal verification well-represented via MIRI/ARC
- must_not violations: none -- Multiple perspectives, no hallucinated positions
- Completeness: 5 -- Three approaches with methods, proponents, arguments for/against
- Precision: 5 -- Accurate researcher attributions, correct method descriptions
- Actionability: 3 -- Research survey, less actionable by nature
- Structure: 5 -- Comparison table, detailed per-approach analysis
- Efficiency: 4 -- Thorough
- Depth: 5 -- ELK, sparse autoencoders, embedded agency, weak-to-strong generalization
- **Composite: 4.53**

### Condition E
- must_mention coverage: 3/5 -- RLHF, scalable oversight/Constitutional AI, interpretability; formal verification not covered as separate approach. Criticisms present but less specific
- must_not violations: none
- Completeness: 3 -- Only two distinct approaches plus overlap, missing formal verification camp
- Precision: 4 -- "Alignment Trilemma" claim is not well-sourced, may be a conflation
- Actionability: 3 -- Brief comparison table
- Structure: 4 -- Comparison table present
- Efficiency: 5 -- Concise
- Depth: 3 -- Less detail on criticisms and methods
- **Composite: 3.53**

### Condition F
- must_mention coverage: 4/5 -- RLHF/Constitutional AI, interpretability, AI Control/Governance (not exactly formal verification but a valid third camp); specific criticisms. Missing formal verification as distinct approach
- must_not violations: none
- Completeness: 5 -- Three approaches with detailed analysis, SAIF report citations
- Precision: 5 -- Well-sourced with confidence ratings, specific researcher attributions
- Actionability: 3 -- Research analysis
- Structure: 5 -- Evidence table, detailed per-approach, tradeoffs comparison table
- Efficiency: 4 -- Thorough
- Depth: 5 -- Alignment faking, sandbagging, steganography, Bengio's Scientist AI
- **Composite: 4.53**

### Condition G
- must_mention coverage: 4/5 -- RLHF/Constitutional AI, interpretability, governance/control; specific criticisms for each. Third camp is governance rather than formal verification
- must_not violations: none
- Completeness: 4 -- Three approaches but third camp differs from ground truth
- Precision: 5 -- Accurate with SAIF references
- Actionability: 3 -- Research analysis
- Structure: 5 -- Comparison table, synthesis
- Efficiency: 4 -- Thorough
- Depth: 5 -- Alignment faking evidence, Bengio's Scientist AI, tradeoffs table
- **Composite: 4.33**

### Condition H
- must_mention coverage: 4/5 -- RLHF, interpretability, AI Control/Governance; missing formal verification as distinct camp. Specific criticisms present
- must_not violations: none
- Completeness: 5 -- Three approaches with detailed evidence and specific citations
- Precision: 5 -- Well-sourced with Ji et al. survey, SAIF report
- Actionability: 3 -- Research analysis
- Structure: 5 -- Detailed comparison, cross-cutting assessment
- Efficiency: 4 -- Thorough
- Depth: 5 -- Alignment faking (Greenblatt et al.), scalability concerns, simple probes for sleeper agents
- **Composite: 4.53**

---

## Task 3: ra-003

**Ground Truth Summary:** Serverless computing 2018-2025 retrospective. Must mention cold start problems and evolution, cost at scale, vendor lock-in, where it succeeded (event-driven), where it failed (latency-sensitive, long-running). Must NOT be pure cheerleading or criticism. Should use promise vs reality format.

### Condition D
- must_mention coverage: 5/5 -- Cold starts (detailed, Provisioned Concurrency), cost at scale (3-10x more), vendor lock-in (severe), succeeded (event-driven, edge, cron), failed (sustained load, complex apps)
- must_not violations: none -- Balanced "C+ as revolution, B+ as tool"
- Completeness: 5 -- Six promises assessed, backlash section, specific examples
- Precision: 5 -- Amazon Prime Video case study, DHH reference, accurate assessments
- Actionability: 4 -- Retrospective analysis
- Structure: 5 -- Promise-by-promise with verdicts, backlash section
- Efficiency: 4 -- Thorough
- Depth: 5 -- "Lambda pinball", Cloud Run vs FaaS, edge computing evolution
- **Composite: 4.73**

### Condition E
- must_mention coverage: 5/5 -- Cold starts (up to 7 seconds), cost, vendor lock-in, succeeded (event-driven), failed (stateful)
- must_not violations: none -- Balanced
- Completeness: 4 -- Promise-by-promise table but less detail
- Precision: 5 -- Accurate
- Actionability: 4 -- Concise analysis
- Structure: 5 -- Promise/verdict table
- Efficiency: 5 -- Very concise
- Depth: 3 -- Less detail on each promise
- **Composite: 4.20**

### Condition F
- must_mention coverage: 5/5 -- Cold starts, cost, vendor lock-in, succeeded (event-driven), failed (latency-sensitive, long-running)
- must_not violations: none -- Balanced with evidence tables
- Completeness: 5 -- Detailed promise-by-promise with market data
- Precision: 5 -- Sourced with Datadog report, Grand View Research
- Actionability: 4 -- Thorough analysis
- Structure: 5 -- Evidence table, promise-by-promise verdicts
- Efficiency: 4 -- Detailed
- Depth: 5 -- Container-based serverless convergence, edge serverless, AI/ML integration
- **Composite: 4.73**

### Condition G
- must_mention coverage: 5/5 -- Cold starts, cost at scale, vendor lock-in, succeeded (event-driven, API backends), failed (long-running, stateful)
- must_not violations: none -- Balanced assessment
- Completeness: 5 -- Comprehensive promise-by-promise with market data
- Precision: 5 -- Accurate with Datadog data
- Actionability: 4 -- Analysis
- Structure: 5 -- Promise-by-promise with verdicts
- Efficiency: 4 -- Thorough
- Depth: 5 -- Market size ($24.51B), convergence with containers, edge computing
- **Composite: 4.73**

### Condition H
- must_mention coverage: 5/5 -- Cold starts (detailed mitigations), cost at scale (surprise bills), vendor lock-in (detailed migration example), succeeded (event-driven), failed (long-running, latency-sensitive)
- must_not violations: none -- Balanced
- Completeness: 5 -- Most thorough promise-by-promise
- Precision: 5 -- Well-sourced with confidence ratings
- Actionability: 4 -- Detailed analysis
- Structure: 5 -- Evidence table, promise-by-promise, verdict
- Efficiency: 3 -- Very verbose
- Depth: 5 -- VPC connectivity stats (65%), language ecosystem data, migration difficulty details
- **Composite: 4.53**

---

## Task 4: ra-004

**Ground Truth Summary:** Why Google+ failed. Must mention forced integration (YouTube, Gmail), real names policy, network effects bootstrapping problem, internal incentive structure (bonuses tied to G+), timing relative to Facebook. Must NOT only give surface-level "too late". Should have multiple causal factors.

### Condition D
- must_mention coverage: 5/5 -- Forced integration, real names policy, network effects, internal incentives (bonuses), timing (Facebook at 750M users)
- must_not violations: none -- Deep multi-factor analysis
- Completeness: 5 -- Seven non-obvious lessons, security debt lesson
- Precision: 5 -- Accurate historical details
- Actionability: 4 -- Strategic lessons
- Structure: 5 -- Obvious reasons briefly, then seven non-obvious lessons
- Efficiency: 4 -- Thorough
- Depth: 5 -- Competency traps, data security as symptom, second-mover disadvantage analysis, LGBTQ+ impact of real names
- **Composite: 4.73**

### Condition E
- must_mention coverage: 5/5 -- Forced integration, real names (implicit in "resentment"), network effects, internal incentives, timing
- must_not violations: none
- Completeness: 4 -- Five lessons but briefer
- Precision: 5 -- Accurate
- Actionability: 4 -- Strategic insights
- Structure: 4 -- Clean numbered lessons
- Efficiency: 5 -- Concise
- Depth: 3 -- Less detail on each lesson
- **Composite: 4.07**

### Condition F
- must_mention coverage: 5/5 -- Forced integration, real names implied, network effects, internal incentives (bonuses), timing/Facebook dominance
- must_not violations: none
- Completeness: 5 -- Six non-obvious lessons with evidence
- Precision: 5 -- Sourced with confidence ratings, specific engagement data
- Actionability: 4 -- Strategic analysis
- Structure: 5 -- Obvious vs non-obvious structure
- Efficiency: 4 -- Thorough
- Depth: 5 -- 3.3 minutes vs hours engagement data, premature scaling, third-party ecosystem
- **Composite: 4.73**

### Condition G
- must_mention coverage: 5/5 -- Forced integration (YouTube, Gmail), real names, network effects, internal incentives, timing
- must_not violations: none
- Completeness: 5 -- Six non-obvious lessons, counter-arguments section
- Precision: 5 -- Accurate with evidence table
- Actionability: 4 -- Strategic lessons
- Structure: 5 -- Evidence table, detailed analysis
- Efficiency: 4 -- Thorough
- Depth: 5 -- Platform vs product confusion, Goodhart's Law applied, TikTok counter-example
- **Composite: 4.73**

### Condition H
- must_mention coverage: 5/5 -- Forced integration, real names implicit in coercion analysis, network effects, internal incentives (bonuses), timing
- must_not violations: none -- Deep multi-factor analysis
- Completeness: 5 -- Five detailed non-obvious lessons with broader takeaways
- Precision: 5 -- Well-sourced with evidence
- Actionability: 4 -- Strategic analysis
- Structure: 5 -- Obvious then non-obvious, broader takeaways
- Efficiency: 4 -- Thorough
- Depth: 5 -- Google product success table, privacy paradox, Forrester citation
- **Composite: 4.73**

---

## Task 5: ra-005

**Ground Truth Summary:** Replication crisis in psychology. Must mention OSC 2015 (36-39%), specific failures (ego depletion, power posing, priming), reforms (pre-registration, registered reports, open data), which subfields improved vs didn't, Many Labs projects. Must NOT dismiss entire field or claim crisis "solved". Should use before/after comparison.

### Condition D
- must_mention coverage: 5/5 -- OSC 2015 (36%, 25% social, 50% cognitive), ego depletion, power posing, priming, facial feedback, stereotype threat, growth mindset; reforms (pre-registration, Registered Reports, open data); subfield variation; Many Labs 1-5
- must_not violations: none -- Balanced, not dismissive, not claiming solved
- Completeness: 5 -- Most comprehensive with many specific failures, Many Labs detail, root causes
- Precision: 5 -- Accurate effect sizes, correct attribution
- Actionability: 4 -- Research survey
- Structure: 5 -- Evidence, root causes, reforms, before/after
- Efficiency: 4 -- Thorough
- Depth: 5 -- HARKing, p-hacking demonstration, Registered Reports null result rates, statistical reform
- **Composite: 4.73**

### Condition E
- must_mention coverage: 4/5 -- OSC 2015 (36-39%), ego depletion, power posing, priming; reforms (pre-registration, registered reports, open data); subfield variation; Many Labs mentioned briefly. Missing some specific failures
- must_not violations: none
- Completeness: 4 -- Before/after table, but less detail
- Precision: 5 -- Accurate
- Actionability: 4 -- Practical recommendation at end
- Structure: 5 -- Before/after table
- Efficiency: 5 -- Very concise
- Depth: 3 -- Key gap identified (no replication of replication study) but less detail overall
- **Composite: 4.07**

### Condition F
- must_mention coverage: 5/5 -- OSC 2015 (36%), ego depletion, power posing, priming; reforms (pre-registration, registered reports, open data); subfield variation; Many Labs
- must_not violations: none -- Balanced "credibility revolution" framing
- Completeness: 5 -- Comprehensive with Bogdan 2025 study, specific reform mechanisms
- Precision: 5 -- Well-sourced with confidence ratings, Bogdan 2025
- Actionability: 4 -- Research analysis
- Structure: 5 -- How bad, what changed, what remains
- Efficiency: 4 -- Thorough
- Depth: 5 -- Bogdan 2025 (240,000 papers), p-hacking persistence, theory crisis, counter-arguments
- **Composite: 4.73**

### Condition G
- must_mention coverage: 5/5 -- OSC 2015 (36%), ego depletion, power posing, priming, facial feedback, marshmallow test; reforms; subfield variation; Many Labs
- must_not violations: none -- Balanced
- Completeness: 5 -- Comprehensive with 2025 meta-analysis
- Precision: 5 -- Accurate with specific citations
- Actionability: 4 -- Research analysis
- Structure: 5 -- Scale of problem, casualties, nuances, changes
- Efficiency: 4 -- Thorough
- Depth: 5 -- 240,000 papers analysis, AI-assisted replication assessment, Big Team Science
- **Composite: 4.73**

### Condition H
- must_mention coverage: 5/5 -- OSC 2015 (36%), ego depletion, power posing, priming; reforms (pre-registration, registered reports, open data); subfield variation; Many Labs
- must_not violations: none -- Balanced "credibility revolution" framing
- Completeness: 5 -- Very thorough with Bogdan 2025, counter-arguments
- Precision: 5 -- Well-sourced with confidence ratings
- Actionability: 4 -- Research analysis
- Structure: 5 -- Evidence table, how bad, what changed, counter-arguments
- Efficiency: 3 -- Very verbose
- Depth: 5 -- Bogdan 2025, p-hacking coin analogy, Stroebe & Strack counter-argument, theory crisis
- **Composite: 4.53**

---

## Summary

| Task | D | E | F | G | H |
|------|---|---|---|---|---|
| ra-001 | 4.73 | 3.93 | 4.73 | 4.73 | 4.73 |
| ra-002 | 4.53 | 3.53 | 4.53 | 4.33 | 4.53 |
| ra-003 | 4.73 | 4.20 | 4.73 | 4.73 | 4.53 |
| ra-004 | 4.73 | 4.07 | 4.73 | 4.73 | 4.73 |
| ra-005 | 4.73 | 4.07 | 4.73 | 4.73 | 4.53 |
| **Mean** | **4.69** | **3.96** | **4.69** | **4.65** | **4.61** |
