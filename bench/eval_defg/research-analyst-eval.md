# research-analyst Evaluation (D/E/F/G)

## Task 1: ra-001

**Ground Truth Summary:** Homomorphic encryption current state. Must mention performance overhead (orders of magnitude slower), specific libraries (SEAL, HElib, TFHE, Concrete), bootstrapping as bottleneck, real-world deployments (Apple, Google), comparison of FHE schemes (BFV, BGV, CKKS). Must NOT give generic "more research needed" or hallucinate adoption claims.

### Condition D
- must_mention coverage: 5/5 — Performance overhead 10-1000x (yes), libraries: SEAL, HElib, TFHE-rs, Concrete, OpenFHE, Lattigo (yes, exceeds), bootstrapping bottleneck (yes), real-world deployments: Apple CSAM, Google Privacy Sandbox, healthcare, financial pilots (yes), FHE schemes BFV/BGV/CKKS/TFHE compared (yes)
- must_not violations: none (specific throughout, no hallucinated claims)
- Completeness: 5 — Exhaustive coverage: three HE flavors, six libraries table, five deployment areas, six barriers, security concerns
- Precision: 5 — Accurate, nuanced (CKKS information leakage citation)
- Actionability: 4 — Verdict with conditional recommendations, but more analytical than prescriptive
- Structure: 5 — Executive summary, library table, barriers, verdict, outlook
- Efficiency: 4 — Thorough but long
- Depth: 5 — PHE/SHE/FHE distinction, DARPA DPRIVE program, CKKS security concerns (Li and Micciancio 2021), HomomorphicEncryption.org consortium, GPU computing analogy
- **Composite: 4.73**

### Condition E
- must_mention coverage: 4/5 — Performance overhead (yes), libraries mentioned less specifically (SEAL, others), bootstrapping (not explicitly), real-world deployments: blockchain focus (partial, missing Apple/Google), FHE schemes BFV/BGV/CKKS (yes)
- must_not violations: none
- Completeness: 4 — Good coverage but blockchain-heavy, missing Apple/Google deployments
- Precision: 4 — Mostly accurate but some claims about blockchain deployments are medium-confidence vendor claims
- Actionability: 4 — Clear verdict and recommendation
- Structure: 4 — Comparison table, barriers listed
- Efficiency: 4 — Good balance
- Depth: 4 — Hardware acceleration discussion, ciphertext expansion, developer complexity
- **Composite: 4.00**

### Condition F
- must_mention coverage: 5/5 — Performance overhead 1000-1000000x (yes), libraries: SEAL, HElib, OpenFHE, Lattigo (yes), bootstrapping (yes, implicit via noise management), real-world deployments: IBM healthcare, finance (yes), FHE schemes BFV/BGV/CKKS (yes)
- must_not violations: none
- Completeness: 5 — Detailed benchmarks, library comparison, real deployments, barriers, hardware acceleration
- Precision: 5 — Accurate with specific benchmark numbers and source citations
- Actionability: 4 — Verdict clear, market projection
- Structure: 5 — Well-organized by topic
- Efficiency: 4 — Detailed
- Depth: 5 — Paillier 20% overhead comparison, 246,897x specific benchmark, Niobium funding, market size projection ($0.31B to $1.52B)
- **Composite: 4.73**

### Condition G
- must_mention coverage: 5/5 — Performance overhead 10,000x+ (yes), libraries/implementations discussed with source citations (yes), bootstrapping as bottleneck: storage I/O bottleneck detail (yes), real-world deployments: Zama, Fhenix blockchain, healthcare (yes), FHE schemes BFV/BGV/CKKS/TFHE (yes)
- must_not violations: none (explicitly flags vendor sources as medium-confidence, cautions against overclaiming)
- Completeness: 5 — Evidence table with confidence ratings, analysis, uncertainties, counter-arguments
- Precision: 5 — Careful sourcing, confidence ratings, counter-argument section
- Actionability: 3 — More analytical than prescriptive, less clear recommendation
- Structure: 5 — Evidence table, analysis, uncertainties, counter-arguments format
- Efficiency: 3 — Longest output, research-paper style
- Depth: 5 — Chen et al. arXiv paper on storage I/O bottleneck (357x ASIC degradation), ciphertext expansion (8-bit to 10MB), source confidence ratings, vendor claim skepticism
- **Composite: 4.47**

---

## Task 2: ra-002

**Ground Truth Summary:** Top 3 AI alignment approaches. Must mention RLHF/Constitutional AI (Anthropic, OpenAI), interpretability/mechanistic (Anthropic, independent), formal verification/provable safety. Must steel-man each before criticizing. Must NOT present only one perspective or hallucinate researcher positions.

### Condition D
- must_mention coverage: 3/3 — RLHF/Constitutional AI with proponents (yes), interpretability/mechanistic with SAEs and circuits (yes), formal verification/agent foundations with MIRI/ARC (yes)
- must_not violations: none (balanced presentation, specific researcher citations)
- Completeness: 5 — Three approaches with methods, arguments for, criticisms, cross-cutting comparison table
- Precision: 5 — Accurate researcher attributions (Olah, Burns, Irving), specific methods named
- Actionability: 3 — Analytical, not prescriptive
- Structure: 5 — Steel-man then criticize format, comparison table
- Efficiency: 4 — Thorough
- Depth: 5 — Weak-to-strong generalization (Burns 2023), SAEs at scale, ELK framework, embedded agency, MIRI pessimism critique, "key insight" synthesis
- **Composite: 4.47**

### Condition E
- must_mention coverage: 3/3 — RLHF/Constitutional AI (yes), interpretability (yes), formal verification/governance (partially -- third camp is governance rather than formal verification)
- must_not violations: none
- Completeness: 4 — Three approaches but third is governance not formal verification
- Precision: 4 — Governance is a valid framing but diverges from ground truth's formal verification camp
- Actionability: 3 — Analytical
- Structure: 4 — Comparison table, synthesis
- Efficiency: 4 — Concise
- Depth: 4 — Alignment Trilemma mention, Bengio's Scientist AI, diversity of values
- **Composite: 3.80**

### Condition F
- must_mention coverage: 3/3 — RLHF/Constitutional AI (yes), interpretability (yes), formal verification approach is present as AI Control/Containment (close but different framing)
- must_not violations: none (balanced, cites specific researchers)
- Completeness: 5 — Three approaches with detailed analysis, evidence table, tradeoffs comparison
- Precision: 5 — Accurate, cites FAR.AI workshop, Anthropic sabotage report, Stickland research
- Actionability: 3 — Research analysis
- Structure: 5 — Evidence table, detailed analysis per approach, tradeoffs comparison table
- Efficiency: 3 — Very long
- Depth: 5 — FAR.AI workshop report citations, Redwood Research control approach, 100% jailbreak rates, Palisade Research chess hacking, deception in Claude Opus 4, Bengio Scientist AI
- **Composite: 4.33**

### Condition G
- must_mention coverage: 3/3 — RLHF/Constitutional AI (yes), interpretability (yes), AI Control/Containment (third approach -- governance framing, close to formal verification concept)
- must_not violations: none (balanced, cites workshop reports)
- Completeness: 5 — Three approaches plus Bengio perspective, evidence table, uncertainties
- Precision: 5 — Well-sourced with confidence ratings
- Actionability: 3 — Research analysis
- Structure: 5 — Evidence table, analysis sections, tradeoffs comparison, uncertainties
- Efficiency: 3 — Very long
- Depth: 5 — FAR.AI Dec 2025 workshop specifics, ARC methodology criticism, UK AISI red-blue exercises, Stickland gaming findings, deception empirical evidence, Bengio Scientist AI keynote
- **Composite: 4.33**

---

## Task 3: ra-003

**Ground Truth Summary:** Serverless 2018-2025 retrospective. Must mention cold starts and evolution, cost at scale, vendor lock-in, where it succeeded (event-driven, sporadic), where it failed (latency-sensitive, long-running). Must NOT be pure cheerleading or criticism. Should use promise vs reality format.

### Condition D
- must_mention coverage: 5/5 — Cold starts with Provisioned Concurrency (yes), cost at scale 3-10x (yes), vendor lock-in (yes), success: event-driven/sporadic (yes), failure: sustained/stateful (yes)
- must_not violations: none (balanced assessment)
- Completeness: 5 — Six promises assessed, where it won, backlash section
- Precision: 5 — Accurate, DHH and Amazon Prime Video references
- Actionability: 4 — Clear verdict with grade
- Structure: 5 — Promise-by-promise assessment format matches ground truth requirement
- Efficiency: 4 — Thorough
- Depth: 5 — Amazon Prime Video case, DHH cloud exit, serverless containers (Cloud Run/Fargate), edge computing evolution, "Lambda pinball", downstream bottleneck problem, BaaS success, 10x productivity myth
- **Composite: 4.73**

### Condition E
- must_mention coverage: 5/5 — Cold starts up to 7s (yes), cost at scale (yes), vendor lock-in (yes), succeeded: event-driven (yes), failed: long-running (yes)
- must_not violations: none
- Completeness: 4 — Promise-by-promise table, key data
- Precision: 4 — "Up to 7 seconds cold starts" is a specific claim without clear sourcing
- Actionability: 4 — Clear verdict
- Structure: 4 — Promise/verdict table
- Efficiency: 5 — Very concise
- Depth: 3 — Less detailed analysis, 70% AWS adoption stat, container-based serverless trend
- **Composite: 4.00**

### Condition F
- must_mention coverage: 5/5 — Cold starts (yes), cost (yes), vendor lock-in (yes), succeeded (yes), failed (yes)
- must_not violations: none
- Completeness: 5 — Five promises assessed with evidence, vendor lock-in section, verdict
- Precision: 5 — Accurate with sourced statistics
- Actionability: 4 — Clear verdict
- Structure: 5 — Promise-by-promise, persistent limitations, verdict
- Efficiency: 4 — Detailed
- Depth: 5 — 70%+ AWS adoption, 3-7% YoY growth, Coca-Cola case study, Lambda anniversary, containerized serverless convergence, IAM/VPC operational complexity
- **Composite: 4.73**

### Condition G
- must_mention coverage: 5/5 — Cold starts (yes), cost at scale (yes), vendor lock-in (yes), succeeded (yes), failed: long-running/15min timeout (yes)
- must_not violations: none (balanced)
- Completeness: 5 — Five promises, persistent limitations, uncertainties
- Precision: 5 — Careful sourcing with confidence ratings
- Actionability: 4 — Clear verdict
- Structure: 5 — Promise-by-promise format, evidence table
- Efficiency: 3 — Very long
- Depth: 5 — Coca-Cola 150-day dev, Netflix Lambda usage, VPC connectivity stat (65%), surprise billing problem, Datadog as data source with vendor bias caveat, containerized Lambda convergence
- **Composite: 4.47**

---

## Task 4: ra-004

**Ground Truth Summary:** Why Google+ failed. Must mention forced integration (YouTube, Gmail), real names policy backlash, network effects bootstrapping, internal incentives (employee bonuses tied to G+), timing vs Facebook. Must NOT only say "it was too late." Should identify multiple causal factors.

### Condition D
- must_mention coverage: 5/5 — Forced integration YouTube/Gmail (yes), real names policy (yes, detailed), network effects (yes), internal incentives/bonuses (yes), timing vs Facebook (yes, 750M users)
- must_not violations: none (seven non-obvious lessons, far beyond surface-level)
- Completeness: 5 — Seven lessons covering obvious + non-obvious factors
- Precision: 5 — Accurate, nuanced (competency trap concept, bundling negative value)
- Actionability: 4 — Lessons generalizable to other products
- Structure: 5 — Obvious reasons first, then non-obvious lessons numbered
- Efficiency: 4 — Long but each lesson adds unique insight
- Depth: 5 — Platform vs destination distinction, security debt of zombie products, second-mover in network-effect markets (TikTok/Discord/WeChat comparison), Google Photos spun-out success, fourth social attempt pattern, LGBTQ+/dissident real-names impact
- **Composite: 4.73**

### Condition E
- must_mention coverage: 5/5 — Forced integration (yes), real names (yes, implied in "coercion"), network effects (yes), internal incentives: employee bonuses (yes), timing: Facebook dominance (yes)
- must_not violations: none
- Completeness: 4 — Five lessons, good coverage
- Precision: 5 — Accurate
- Actionability: 4 — Non-obvious lessons applicable
- Structure: 4 — Lessons listed
- Efficiency: 4 — Concise
- Depth: 4 — Premature scaling, engineering culture mismatch, data breaches as symptom
- **Composite: 4.33**

### Condition F
- must_mention coverage: 5/5 — Forced integration (yes), real names backlash (not explicitly named but "coercion destroys trust"), network effects (yes), internal incentives (yes, "organizational structure predicted failure"), timing (yes, "Facebook dominance")
- must_not violations: none
- Completeness: 5 — Six non-obvious lessons plus deeper pattern
- Precision: 5 — Accurate
- Actionability: 4 — Generalizable lessons
- Structure: 5 — Numbered lessons with deeper pattern section
- Efficiency: 4 — Good depth per lesson
- Depth: 5 — Platform vs product distinction, fear-driven strategy concept, "one-stop shop" model dying, engineering culture vs human problem, individually-useful-from-first-interaction insight
- **Composite: 4.73**

### Condition G
- must_mention coverage: 5/5 — Forced integration YouTube/Gmail/Play Store (yes), real names (yes), network effects (yes), internal incentives: bonuses tied to G+ (yes), timing: Facebook with 750M+ users (yes)
- must_not violations: none (six lessons plus obvious reasons)
- Completeness: 5 — Obvious + six non-obvious lessons, evidence table, counter-arguments, uncertainties
- Precision: 5 — Specific data: 3.3 min/month, 90% under 5s, $585M investment, data breach numbers
- Actionability: 4 — Generalizable lessons
- Structure: 5 — Evidence table, obvious then non-obvious, counter-arguments, uncertainties
- Efficiency: 3 — Longest output
- Depth: 5 — Startup Genome premature scaling reference, third-party ecosystem absence, Comscore data, 70% login decline stat, four prior social attempts (Orkut/Buzz/Jaiku/Wave), structural organizational mismatch pattern
- **Composite: 4.47**

---

## Task 5: ra-005

**Ground Truth Summary:** Replication crisis in psychology. Must mention Open Science Collaboration 2015 replication rates (36-39%), specific failures (ego depletion, power posing, priming), reforms (pre-registration, registered reports, open data), which subfields improved, many-labs projects. Must NOT dismiss the field or claim crisis solved. Should use before/after comparison.

### Condition D
- must_mention coverage: 5/5 — OSC 2015 36% (yes), ego depletion/power posing/priming/facial feedback/stereotype threat/growth mindset (yes, exceeds), reforms: pre-registration/registered reports/open data (yes), subfields: social vs cognitive (yes), Many Labs 1/2/3/5 (yes)
- must_not violations: none (balanced: "genuinely bad" but "self-correcting mechanisms function")
- Completeness: 5 — Most comprehensive coverage: root causes (5), reforms (7), what hasn't changed (5), specific failures (6)
- Precision: 5 — Accurate citations (Simmons/Nelson/Simonsohn 2011, Hagger 2016, Wagenmakers 2016, Coles 2022, Yeager 2019, Gino 2023)
- Actionability: 4 — Clear prognosis, cautiously optimistic
- Structure: 5 — How bad, root causes, what changed, what hasn't, assessment, prognosis
- Efficiency: 3 — Very long but information-dense
- Depth: 5 — Many Labs 5 pre-registration finding, facial feedback partial recovery (Coles 2022), growth mindset 0.1 GPA, stereotype threat publication bias, Francesca Gino case, Data Colada blog, registered reports 50-60% null results, metascience as discipline, DARPA SCORE, prediction markets, HARKing definition, applied impact section (textbooks, policy)
- **Composite: 4.60**

### Condition E
- must_mention coverage: 4/5 — OSC 2015 36-39% (yes), specific failures: ego depletion/power posing/priming (yes), reforms: pre-registration/registered reports/open data (yes), subfields: social vs cognitive (yes). Many-labs not specifically mentioned.
- must_not violations: none
- Completeness: 4 — Good coverage, before/after table
- Precision: 5 — Accurate
- Actionability: 4 — Clear recommendation
- Structure: 5 — Before/after table format
- Efficiency: 4 — Concise
- Depth: 4 — Sample size increase data, citation incentive shift, pre-registration gaps
- **Composite: 4.33**

### Condition F
- must_mention coverage: 5/5 — OSC 2015 36% (yes), ego depletion/power posing/priming/facial feedback/marshmallow test (yes), reforms (yes), subfields social vs cognitive (yes), many-labs not directly named but 240,000 paper meta-analysis discussed
- must_not violations: none (balanced)
- Completeness: 5 — Detailed coverage with 2025 meta-analysis, persistent problems
- Precision: 5 — Accurate with source citations and confidence ratings
- Actionability: 4 — Clear verdict
- Structure: 5 — Scale of problem, high-profile casualties, nuances, changes, persistent problems, verdict
- Efficiency: 4 — Detailed but organized
- Depth: 5 — 240,000 paper meta-analysis (Bogdan 2025), p-value fragile range decrease, marshmallow test SES controls, not unique to psychology (Amgen 90%), many preregistrations never public (Logg & Lakens 2025)
- **Composite: 4.73**

### Condition G
- must_mention coverage: 5/5 — OSC 2015 36% (yes), ego depletion/power posing/priming (yes), reforms: pre-registration/registered reports/open data (yes), subfields (yes), Bogdan 2025 meta-analysis as many-labs equivalent (yes)
- must_not violations: none (balanced: "genuinely severe" but "responded substantively")
- Completeness: 5 — Evidence table, detailed analysis, persistent problems, uncertainties
- Precision: 5 — Careful sourcing with confidence ratings, Bogdan 2025 study specifics
- Actionability: 4 — Overall assessment
- Structure: 5 — Evidence table, how bad, what changed (4 points), persistent problems, overall assessment, uncertainties
- Efficiency: 3 — Longest output
- Depth: 5 — Bogdan 2025 (240,355 papers), Amgen 90% non-replication, $28.2B cost, Logg & Lakens 2025 preregistration gaps, Hardwicke 2024 slow adoption, p-value fragile range decrease, sample size doubling, proxy measurement caveat
- **Composite: 4.47**

---

## Summary

| Task | D | E | F | G |
|------|---|---|---|---|
| ra-001 | 4.73 | 4.00 | 4.73 | 4.47 |
| ra-002 | 4.47 | 3.80 | 4.33 | 4.33 |
| ra-003 | 4.73 | 4.00 | 4.73 | 4.47 |
| ra-004 | 4.73 | 4.33 | 4.73 | 4.47 |
| ra-005 | 4.60 | 4.33 | 4.73 | 4.47 |
| **Mean** | **4.65** | **4.09** | **4.65** | **4.44** |
