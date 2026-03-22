# research-analyst Evaluation (A/B/C)

## Task 1: ra-001

**Ground Truth Summary:** Must mention: (1) performance overhead (orders of magnitude slower), (2) specific libraries (SEAL, HElib, TFHE, Concrete), (3) bootstrapping as key bottleneck, (4) real-world deployments (Apple, Google, specific use cases), (5) comparison of FHE schemes (BFV, BGV, CKKS) and tradeoffs. Must NOT: generic "more research needed" without specifics, hallucinated adoption claims. Structure: organized by barrier type, not by source.

### Condition A (bare)
- must_mention coverage: 4/5 -- Performance overhead (10,000x-1,000,000x, yes), libraries (SEAL, HElib, TFHE, Concrete, OpenFHE -- yes), bootstrapping (yes), scheme comparison (BFV, BGV, CKKS, TFHE -- yes). Real-world deployments: mentions financial services, healthcare, ad-tech, Google's Private Join and Compute -- but does NOT specifically mention Apple. Partial credit.
- must_not violations: None -- Specific throughout, no hallucinated claims.
- Completeness: 4 -- Misses Apple deployment. Otherwise thorough with hardware acceleration section (DARPA, Intel HEXL).
- Precision: 5 -- All claims verifiable. Performance numbers reasonable. Library descriptions accurate.
- Actionability: 4 -- Assessment section gives clear verdict. Lacks explicit recommendations for different org types.
- Structure: 5 -- Organized by taxonomy, then state-of-art, then barriers. Not by source.
- Efficiency: 4 -- Dense content, well-organized.
- Depth: 5 -- Hardware acceleration (DARPA DPRIVE, Intel HEXL), ciphertext expansion (10-100x), standardization gaps, hybrid approaches.
- **Composite: 4.53**

### Condition B (v1 agents)
- must_mention coverage: 4/5 -- Performance overhead (yes), libraries (SEAL, HElib, TFHE, Concrete, OpenFHE -- yes), bootstrapping (yes, "primary performance bottleneck"), schemes (BGV/BFV, CKKS, TFHE -- yes). Real-world deployments: mentions financial, healthcare, DARPA -- but NOT Apple or Google specifically by name for deployment. Partial credit.
- must_not violations: None -- No hallucinated claims. Findings table with confidence levels.
- Completeness: 4 -- Similar to A. Findings table format adds structure. Hardware acceleration covered. Apple/Google not mentioned by name for specific deployments.
- Precision: 5 -- All claims accurate. Confidence levels assigned appropriately.
- Actionability: 5 -- Explicit recommendations section with four scenarios. Barrier severity/timeline table. Stronger than A.
- Structure: 5 -- Findings table, analysis sections, barrier ranking table, recommendations.
- Efficiency: 5 -- Findings table + barrier table are exceptionally efficient.
- Depth: 5 -- Scheme comparison with use-case mapping, barrier timeline estimates, hybrid approach recommendations.
- **Composite: 4.73**

### Condition C (v2 agents)
- must_mention coverage: 4/5 -- Performance overhead (1,000x-1,000,000x, yes), libraries (SEAL, OpenFHE, TFHE-rs/Concrete, HELib -- yes), bootstrapping (yes), schemes (BFV, BGV, CKKS, TFHE -- yes). Deployments: mentions encrypted database queries, privacy-preserving analytics -- but NOT Apple or Google by name. Partial credit.
- must_not violations: None
- Completeness: 4 -- Similar coverage. Findings table with confidence. Recommendations section.
- Precision: 5 -- All accurate.
- Actionability: 5 -- Four specific recommendations for different org types. Timeline estimates.
- Structure: 5 -- Findings table, analysis, barrier table, recommendations.
- Efficiency: 5 -- Barrier severity table and recommendations are dense and useful.
- Depth: 5 -- DARPA ASIC mention, scheme-to-use-case mapping, hybrid approach, timeline estimates.
- **Composite: 4.73**

---

## Task 2: ra-002

**Ground Truth Summary:** Must mention: (1) RLHF/constitutional AI approach (Anthropic, OpenAI), (2) interpretability/mechanistic approach (Anthropic, independent), (3) formal verification/provable safety approach, (4) specific criticisms of each (not just "has limitations"). Must NOT: present only one perspective, hallucinate researcher positions. Structure: comparison table or matrix, steel-man each position before criticizing.

### Condition A (bare)
- must_mention coverage: 4/4 -- RLHF/CAI (yes, Camp 1 with OpenAI, Anthropic, DeepMind), interpretability (yes, as part of Camp 1 and referenced throughout), formal/theoretical (yes, Camp 2 with MIRI, Russell, ARC). Note: A structures as two main camps + governance camp rather than three technical camps. Interpretability is woven in rather than separate. Also Camp 3 is governance rather than formal verification.
- must_not violations: None -- All three perspectives presented fairly. No hallucinated positions.
- Completeness: 4 -- Three camps well-described. Interpretability is mentioned but not as its own camp (ground truth wants it separate). Governance camp is valuable but substitutes for formal verification camp.
- Precision: 5 -- All researcher attributions accurate. Technique descriptions correct.
- Actionability: 3 -- More analytical than actionable. Synthesis section is insightful but lacks concrete recommendations.
- Structure: 5 -- Three camps with key arguments then criticisms for each. Steel-mans before criticizing. Synthesis section.
- Efficiency: 4 -- Well-written and dense.
- Depth: 5 -- Specific technique names (CIRL, CAI, embedded agency), specific criticisms (shoggoth's mask, Goodhart), synthesis of tensions between camps.
- **Composite: 4.33**

### Condition B (v1 agents)
- must_mention coverage: 4/4 -- RLHF/CAI (yes, Camp 1), interpretability (yes, Camp 2 -- SEPARATE camp as ground truth wants), agent foundations (yes, Camp 3). This matches the ground truth taxonomy better than A.
- must_not violations: None
- Completeness: 5 -- Three camps matching ground truth taxonomy. Specific techniques, researchers, and criticisms for each. Comparison table included.
- Precision: 5 -- All attributions accurate. Technique descriptions correct.
- Actionability: 4 -- Recommendations section with four points. Less specific than ideal.
- Structure: 5 -- Three camps, comparison table, recommendations.
- Efficiency: 5 -- Comparison table efficiently summarizes across dimensions.
- Depth: 5 -- Scaling Monosemanticity reference (2024), induction heads, mesa-optimizers, Goodhart's Law.
- **Composite: 4.80**

### Condition C (v2 agents)
- must_mention coverage: 4/4 -- RLHF/CAI (yes), interpretability (yes, as Camp 2), agent foundations (yes, as Camp 3). Same good taxonomy as B.
- must_not violations: None
- Completeness: 5 -- Same good taxonomy. Comparison table included.
- Precision: 5 -- All accurate.
- Actionability: 4 -- Recommendations present.
- Structure: 5 -- Comparison table, recommendations.
- Efficiency: 5 -- Efficient comparison table.
- Depth: 5 -- Same quality as B.
- **Composite: 4.80**

---

## Task 3: ra-003

**Ground Truth Summary:** Must mention: (1) cold start problems and their evolution, (2) cost at scale (serverless vs containers), (3) vendor lock-in concerns, (4) where it succeeded (event-driven, sporadic workloads), (5) where it failed (latency-sensitive, long-running). Must NOT: pure cheerleading or pure criticism. Structure: promise vs reality format.

### Condition A (bare)
- must_mention coverage: 5/5 -- Cold starts (evolution from seconds to hundreds of ms, provisioned concurrency), cost at scale (3-8x more expensive for sustained workloads), vendor lock-in (function portable but ecosystem not), successes (event-driven, BFF, data pipelines, startups), failures (latency-sensitive, state management, operational complexity).
- must_not violations: None -- Balanced assessment.
- Completeness: 5 -- All items plus debugging/observability issues, Cloud Run as middle ground, cultural impact.
- Precision: 5 -- All claims reasonable and balanced.
- Actionability: 3 -- Analytical assessment, not prescriptive. No explicit recommendations.
- Structure: 5 -- Promise vs reality format. "Where it delivered" vs "Where it fell short."
- Efficiency: 5 -- Dense. Six numbered failure points each substantive.
- Depth: 5 -- "Dirty secret" cost inversion, 80/20 wiring analysis, Cloud Run/Fargate as middle ground, cultural legacy impact.
- **Composite: 4.60**

### Condition B (v1 agents)
- must_mention coverage: 5/5 -- Cold starts (yes), cost at scale (utilization crossover point), vendor lock-in (yes), successes (event-driven, glue), failures (latency-sensitive, long-running, stateful).
- must_not violations: None -- Balanced scorecard format.
- Completeness: 5 -- Promise scorecard table, analysis, edge functions mention, recommendations.
- Precision: 5 -- All accurate. Crossover point estimate reasonable.
- Actionability: 5 -- Explicit recommendations: use for X, avoid for Y. Serverless containers as sweet spot.
- Structure: 5 -- Promise scorecard table. Analysis section. Recommendations.
- Efficiency: 5 -- Promise scorecard table is maximally efficient.
- Depth: 4 -- Less detailed than A on specific failure modes. Edge functions mention adds forward-looking insight.
- **Composite: 4.80**

### Condition C (v2 agents)
- must_mention coverage: 5/5 -- Same coverage as B.
- must_not violations: None
- Completeness: 5 -- Promise scorecard, analysis, recommendations.
- Precision: 5 -- All accurate.
- Actionability: 5 -- Clear recommendations.
- Structure: 5 -- Promise scorecard table.
- Efficiency: 5 -- Same efficient format as B.
- Depth: 4 -- Same as B.
- **Composite: 4.80**

---

## Task 4: ra-004

**Ground Truth Summary:** Must mention: (1) forced integration strategy (YouTube comments, Gmail), (2) real names policy backlash, (3) network effects bootstrapping problem, (4) internal incentive structure (employee bonuses tied to G+ usage), (5) timing relative to Facebook's dominance. Must NOT: only surface-level "it was too late." Structure: multiple causal factors, not single explanation.

### Condition A (bare)
- must_mention coverage: 5/5 -- Forced integration (YouTube, Gmail, Play Store -- yes), real names (implied in "identity and belonging" discussion but NOT explicitly called out as "real names policy backlash"), network effects (yes, detailed asymmetry analysis), internal incentives (yes, Vic Gundotra, employee bonuses), timing/Facebook dominance (yes, explicitly discussed).
- must_not violations: None -- Explicitly addresses why "too late" is insufficient.
- Completeness: 4 -- All items covered but real names policy is not explicitly called out -- it's embedded in the broader identity/privacy discussion.
- Precision: 5 -- All claims accurate. Petition reference, Vic Gundotra.
- Actionability: 3 -- Analytical lessons, not recommendations.
- Structure: 5 -- Six numbered non-obvious lessons. Multi-causal.
- Efficiency: 5 -- Each lesson is a distinct, non-obvious insight.
- Depth: 5 -- Utility vs identity product distinction, network effect asymmetry analysis, brand trust constraint, coordinated migration concept.
- **Composite: 4.47**

### Condition B (v1 agents)
- must_mention coverage: 5/5 -- Forced integration (YouTube comments -- yes), real names (implied in community identity discussion but not explicit), network effects (yes), internal incentives (Vic Gundotra, Larry Page, employee bonuses -- yes), timing (yes).
- must_not violations: None
- Completeness: 4 -- Same slight gap on explicit "real names policy" mention. Concise lesson format.
- Precision: 5 -- All accurate. Larry Page attribution for bonus tie.
- Actionability: 5 -- Four explicit recommendations at end.
- Structure: 5 -- Six numbered lessons plus recommendations.
- Efficiency: 5 -- Each lesson dense and distinct.
- Depth: 5 -- Inflated metrics delaying pivots, engineering vs product-market fit, parasitic growth.
- **Composite: 4.67**

### Condition C (v2 agents)
- must_mention coverage: 5/5 -- Forced integration (YouTube -- yes), real names (yes, context of community identity), network effects (yes), internal incentives (Vic Gundotra, employee bonuses -- yes), timing (yes).
- must_not violations: None
- Completeness: 4 -- Same coverage. Recommendations present.
- Precision: 5 -- All accurate.
- Actionability: 5 -- Four recommendations.
- Structure: 5 -- Lessons plus recommendations.
- Efficiency: 5 -- Dense.
- Depth: 5 -- Same quality as B.
- **Composite: 4.67**

---

## Task 5: ra-005

**Ground Truth Summary:** Must mention: (1) Open Science Collaboration (2015) replication rates (~36-39%), (2) specific high-profile failures (ego depletion, power posing, priming), (3) reforms adopted (pre-registration, registered reports, open data), (4) which subfields improved vs didn't, (5) many-labs projects and their findings. Must NOT: dismiss entire field, claim crisis is "solved." Structure: before/after comparison with evidence.

### Condition A (bare)
- must_mention coverage: 5/5 -- OSC 2015 rates (36-39%), high-profile failures (ego depletion, power posing, stereotype threat, priming), reforms (pre-registration, registered reports, open data, sample sizes), subfields (social worst, cognitive better, clinical mixed), many-labs (Many Labs 2 with 50% rate).
- must_not violations: None -- Does not dismiss field or claim solved.
- Completeness: 5 -- All items plus Bem precognition, Stapel fraud, WEIRD samples, textbook problem, hidden moderator defense.
- Precision: 5 -- All statistics and study references accurate.
- Actionability: 3 -- Analytical assessment. No explicit recommendations.
- Structure: 5 -- Before (precipitating events, how bad) vs after (what changed, remaining challenges).
- Efficiency: 5 -- Dense with specific examples throughout.
- Depth: 5 -- Nuanced assessment section (effect size vs falsehood distinction, base rate comparison with cancer biology, pre-/post-2011 era distinction), hidden moderator defense, Psychological Science Accelerator.
- **Composite: 4.60**

### Condition B (v1 agents)
- must_mention coverage: 5/5 -- OSC 2015 (36% of 100 studies), failures (ego depletion, power posing, social priming, facial feedback), reforms (pre-registration 40,000+ on OSF, registered reports 300+ journals, larger samples), subfields (cognitive better, social worst, applied slower), many-labs (Many Labs 2, 54%).
- must_not violations: None
- Completeness: 5 -- All items plus root causes section (publication bias 91%, low power 21%, HARKing), statcheck reference, broader impact section.
- Precision: 5 -- Statistics accurate. Statcheck reference correct.
- Actionability: 5 -- Five explicit recommendations for different audiences (consumers, researchers, institutions, practitioners, other fields).
- Structure: 5 -- How bad / root causes / what changed / what hasn't / broader impact / recommendations.
- Efficiency: 5 -- Bullet-pointed statistics extremely efficient.
- Depth: 5 -- Root causes section with quantified power (21%), analytic flexibility (5% to 60%+), positive result rate (91%). Cross-field comparison.
- **Composite: 4.93**

### Condition C (v2 agents)
- must_mention coverage: 5/5 -- Same thorough coverage as B.
- must_not violations: None
- Completeness: 5 -- Same.
- Precision: 5 -- Same.
- Actionability: 5 -- Same five-audience recommendations.
- Structure: 5 -- Same format.
- Efficiency: 5 -- Same.
- Depth: 5 -- Same.
- **Composite: 4.93**

---

## Summary

| Task | A | B | C |
|------|---|---|---|
| ra-001 | 4.53 | 4.73 | 4.73 |
| ra-002 | 4.33 | 4.80 | 4.80 |
| ra-003 | 4.60 | 4.80 | 4.80 |
| ra-004 | 4.47 | 4.67 | 4.67 |
| ra-005 | 4.60 | 4.93 | 4.93 |
| **Mean** | **4.51** | **4.79** | **4.79** |
| B LIFT (vs A) | -- | +0.28 | -- |
| C LIFT (vs A) | -- | -- | +0.28 |
| C vs B | -- | -- | +0.00 |
