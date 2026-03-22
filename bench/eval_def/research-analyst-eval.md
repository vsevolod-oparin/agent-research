# research-analyst Evaluation (D/E/F)

## Task 1: ra-001

**Ground Truth Summary:** Must mention: performance overhead (orders of magnitude slower); specific libraries/implementations (SEAL, HElib, TFHE, Concrete); bootstrapping as key bottleneck; real-world deployments (Apple, Google, specific use cases); comparison of FHE schemes (BFV, BGV, CKKS) and their tradeoffs. Must NOT: generic "more research needed" without specifics; hallucinated adoption claims. Structure: organized by barrier type, not by source.

### Condition D
- must_mention coverage: 5/5 -- Hit all: performance overhead (1000-10000x for operations, bootstrapping takes seconds to minutes), libraries (SEAL, OpenFHE, TFHE-rs, Concrete, HElib, Lattigo with detailed table), bootstrapping as bottleneck, real-world deployments (Apple CSAM, Google Privacy Sandbox, Mastercard, Zama ML inference, IARPA DPRIVE), FHE schemes comparison (BFV, BGV, CKKS with tradeoffs including CKKS leakage).
- must_not violations: None (specific throughout, no hallucinated claims)
- Completeness: 5 -- Exceeds requirements: three flavors of HE (PHE/SHE/FHE), six libraries in table, six barriers, security concerns, hardware accelerator outlook.
- Precision: 5 -- Accurate claims about CKKS leakage (Li & Micciancio 2021), DPRIVE program, Zama's Concrete ML. All verifiable.
- Actionability: 4 -- Clear verdict with conditions; less prescriptive than some outputs.
- Structure: 5 -- Organized by barrier type with library table, deployment list, barriers list, verdict.
- Efficiency: 4 -- Thorough but lengthy; the three flavors section and security concerns add value but extend length.
- Depth: 5 -- CKKS information leakage, ciphertext expansion ratios, DPRIVE ASIC results, HomomorphicEncryption.org standardization gaps. Non-obvious insights throughout.
- **Composite: 4.73**

### Condition E
- must_mention coverage: 4/5 -- Hit: performance overhead (1000x FHE), libraries mentioned implicitly (SEAL, HElib, OpenFHE, Lattigo from benchmark study), bootstrapping mentioned, FHE schemes mentioned (BFV, BGV, CKKS). Partially missed: real-world deployments are generic (blockchain/Web3, analytics, regulated data) -- no specific Apple/Google mentions. Comparison table is HE vs alternatives rather than scheme-vs-scheme.
- must_not violations: None
- Completeness: 3 -- Missing specific deployments (Apple, Google). Comparison table compares FHE vs TEEs vs MPC rather than BFV vs BGV vs CKKS. Hardware acceleration mentioned but vaguely.
- Precision: 4 -- "1000x slower" for FHE vs partial HE is a rough simplification. "Minimal" overhead for partial HE is misleading (Paillier is ~20% overhead per the other outputs). The 2025 benchmark study claim is not verifiable.
- Actionability: 4 -- Clear recommendation at end.
- Structure: 4 -- Clean with comparison table, but table compares wrong things for the ground truth.
- Efficiency: 5 -- Very concise, no filler.
- Depth: 3 -- Surface-level compared to D; lacks specific library details, deployment examples, scheme tradeoffs.
- **Composite: 3.80**

### Condition F
- must_mention coverage: 5/5 -- Hit all: performance overhead (1000-1000000x with specific benchmarks), libraries (SEAL, HElib, OpenFHE, Lattigo with 2025 benchmark reference), bootstrapping as bottleneck, real-world deployments (IBM healthcare, finance fraud detection), FHE schemes (BFV, BGV, CKKS with CKKS suited for approximate arithmetic).
- must_not violations: None
- Completeness: 5 -- All must-mentions covered plus hardware acceleration (Niobium, DARPA DPRIVE), ciphertext expansion, standardization gaps, market projections.
- Precision: 4 -- The Niobium $23M raise and specific market projection ($0.31B to $1.52B) are potentially hallucinated or unverifiable. The 246,897x figure for addition is suspiciously specific without a source. The "56% of surveyed organizations" claim lacks sourcing.
- Actionability: 4 -- Clear verdict with use-case guidance.
- Structure: 5 -- Organized by barrier type, clear sections.
- Efficiency: 4 -- Good density.
- Depth: 5 -- Specific benchmark numbers, hardware companies, market projections (even if some may be hallucinated), noise management explanation.
- **Composite: 4.47**

---

## Task 2: ra-002

**Ground Truth Summary:** Must mention: RLHF/constitutional AI approach (Anthropic, OpenAI); interpretability/mechanistic approach (Anthropic, independent); formal verification/provable safety approach; specific criticisms of each (not just "has limitations"). Must NOT: present only one perspective; hallucinate researcher positions. Structure: comparison table or matrix; steel-man each position before criticizing.

### Condition D
- must_mention coverage: 4/4 -- Hit all: RLHF/Constitutional AI (OpenAI, Anthropic, DeepMind), mechanistic interpretability (Anthropic Chris Olah, EleutherAI Neel Nanda), formal verification/agent foundations (MIRI Yudkowsky, ARC Christiano). Specific criticisms for each: Goodhart's Law, deceptive alignment, scalability, interpretability illusion, NP-hardness of verification, MIRI pessimism.
- must_not violations: None (balanced, cites real researchers correctly)
- Completeness: 5 -- Three approaches with extensive detail: 5+ methods per approach, named researchers, specific papers (Burns et al. 2023, Irving et al. 2018).
- Precision: 5 -- Researcher attributions are accurate (Chris Olah at Anthropic, Jan Leike's move, Paul Christiano at ARC). Methods correctly described.
- Actionability: 3 -- Research summary, not prescriptive; appropriate for the task but less actionable than engineering tasks.
- Structure: 5 -- Each approach: proponents -> thesis -> methods -> arguments for -> criticisms. Cross-cutting comparison table. Key insight synthesis.
- Efficiency: 3 -- Very long (nearly 2 pages per approach). Could be more concise while retaining key points.
- Depth: 5 -- SAEs, ELK, weak-to-strong generalization, logical induction, embedded agency. Deep knowledge of specific research programs and their limitations.
- **Composite: 4.27**

### Condition E
- must_mention coverage: 4/4 -- Hit all: RLHF (Anthropic, OpenAI), scalable oversight/Constitutional AI, mechanistic interpretability, and third approach (governance/regulation instead of formal verification). Specific criticisms for each.
- must_not violations: Mild concern -- third approach is governance/regulation rather than formal verification/provable safety as specified in ground truth. This is a valid alignment approach but diverges from the requested "formal verification" camp.
- Completeness: 3 -- Third approach (governance) diverges from ground truth's "formal verification/provable safety." Criticisms are specific but less detailed than D.
- Precision: 4 -- "Alignment Trilemma" claim is hard to verify (may be a specific paper or hallucinated name). Researcher positions are mostly accurate. Yoshua Bengio's "Scientist AI" is a real reference.
- Actionability: 3 -- Summary table with useful dimensions.
- Structure: 4 -- Comparison table, but each approach gets less space than D.
- Efficiency: 5 -- Very concise.
- Depth: 3 -- Less detail on specific methods; "Alignment Trilemma" reference is interesting but unverified. Missing formal verification entirely.
- **Composite: 3.67**

### Condition F
- must_mention coverage: 4/4 -- Hit all: RLHF/Constitutional AI (OpenAI, Anthropic), mechanistic interpretability (Anthropic, MATS), formal verification/governance approach (though framed as governance). Specific criticisms for each.
- must_not violations: None (balanced, steel-mans each)
- Completeness: 4 -- Three approaches covered with specific criticisms. Third approach blends governance with formal verification -- mentions "Legal alignment" and Bengio's Scientist AI but not MIRI or ARC formal methods work.
- Precision: 5 -- Accurate attributions, no hallucinated positions.
- Actionability: 3 -- Synthesis paragraph is insightful.
- Structure: 4 -- Three sections with synthesis. No comparison table/matrix as required by ground truth structure.
- Efficiency: 4 -- Good density.
- Depth: 4 -- Scalability paradox, agency problem in RLHF, annotation bias, moving target for interpretability. Good criticisms but less specific than D on methods.
- **Composite: 3.93**

---

## Task 3: ra-003

**Ground Truth Summary:** Must mention: cold start problems and their evolution; cost at scale (serverless vs containers); vendor lock-in concerns; where it succeeded (event-driven, sporadic workloads); where it failed (latency-sensitive, long-running processes). Must NOT: pure cheerleading or pure criticism. Structure: promise vs reality format.

### Condition D
- must_mention coverage: 5/5 -- Hit all: cold starts (with Provisioned Concurrency mitigation), cost at scale (3-10x more than containers at sustained load, DHH reference), vendor lock-in (proprietary event sources, Lambda+DynamoDB+SQS lock-in), successes (edge computing, cron, data pipelines, BaaS), failures (latency-sensitive, long-running, stateful).
- must_not violations: None (balanced: "C+ as a revolution, B+ as a tool")
- Completeness: 5 -- Six promises assessed individually, where it won (5 areas), backlash section (Prime Video monolith story), Cloud Run/Fargate as middle ground.
- Precision: 5 -- Prime Video 2023 blog post reference is real. DHH cloud exit narrative is real. Claims about Provisioned Concurrency (2019) and downstream bottleneck are accurate.
- Actionability: 3 -- Analysis piece, appropriately non-prescriptive.
- Structure: 5 -- Promise-by-promise format with verdicts (PARTIALLY DELIVERED, DELIVERED WITH CAVEATS, etc.). Matches ground truth structure requirement perfectly.
- Efficiency: 3 -- Very long (most detailed of all outputs). Could be trimmed significantly.
- Depth: 5 -- "Lambda pinball," retry storms, event ordering challenges, SAM/Serverless Framework local dev pain, "thousand functions problem," Kubernetes winning the platform battle. Multiple non-obvious insights.
- **Composite: 4.27**

### Condition E
- must_mention coverage: 5/5 -- Hit all: cold starts (up to 7 seconds), cost at scale (expensive for sustained), vendor lock-in (language, trigger, ecosystem levels), successes (API backends, event processing, webhooks), failures (latency-sensitive, long-running).
- must_not violations: None (balanced)
- Completeness: 4 -- Promise-by-promise table, but less depth on each. Mentions Cloud Run as growing fastest. "Over 70% of AWS customers" stat is unverifiable.
- Precision: 4 -- "Over 70% of AWS customers use at least one serverless solution" is hard to verify. "Up to 7 seconds" cold start is region-dependent and possibly exaggerated.
- Actionability: 3 -- Summary assessment.
- Structure: 5 -- Promise vs verdict table format matches ground truth perfectly.
- Efficiency: 5 -- Very concise table format.
- Depth: 3 -- Surface-level compared to D; lacks specific backlash examples, debugging pain, downstream bottleneck insights.
- **Composite: 3.93**

### Condition F
- must_mention coverage: 5/5 -- Hit all: cold starts and evolution, cost at scale (exceeds traditional), vendor lock-in (each provider proprietary), successes (event-driven microservices, APIs), failures (long-running, stateful, latency-sensitive).
- must_not violations: None (balanced: "one tool in the cloud computing toolkit")
- Completeness: 5 -- Five promises each with delivered/not assessment, vendor lock-in section, clear verdict. Mentions "serverless containers" (Cloud Run, Fargate) as real innovation.
- Precision: 5 -- "Under 20% of public cloud users" and "over 90% of enterprises using serverless report event-driven" are plausible but unverifiable. No clear hallucinations.
- Actionability: 3 -- Analysis with clear verdict.
- Structure: 5 -- Promise vs reality format, each promise explicitly assessed.
- Efficiency: 4 -- Good density, well-organized.
- Depth: 4 -- Mentions "serverless containers" evolution, hidden costs (provisioned concurrency, data transfer, logging), debugging difficulty. Less specific than D on backlash examples.
- **Composite: 4.33**

---

## Task 4: ra-004

**Ground Truth Summary:** Must mention: forced integration strategy (YouTube comments, Gmail); real names policy backlash; network effects bootstrapping problem; internal incentive structure (employee bonuses tied to G+ usage); timing relative to Facebook's dominance. Must NOT: only surface-level "it was too late." Structure: multiple causal factors, not single explanation.

### Condition D
- must_mention coverage: 5/5 -- Hit all: forced integration (YouTube comments, Gmail contacts, Android prompts), real names policy (with impact on LGBTQ+, dissidents, DV survivors), network effects bootstrapping (social network value depends on others), internal incentives (Larry Page tied bonuses to G+ integration), timing (Facebook had 750M users at launch).
- must_not violations: None (explicitly provides 7 non-obvious lessons, far beyond surface-level)
- Completeness: 5 -- Seven detailed lessons covering organizational competency traps, executive sponsorship vs PMF, identity vs network, real names policy cultural blindspot, platform risk cutting both ways, security debt in zombie products, second-mover disadvantage in network-effect markets.
- Precision: 5 -- 300M MAU claim (labeled as inflated), two data breaches (500K in 2018, 52M second incident), Google Photos spin-out, all verifiable. Specific researchers/figures not named to hallucinate.
- Actionability: 4 -- Lessons are generalizable to other products.
- Structure: 5 -- Obvious reasons (briefly) + 7 non-obvious lessons. Multiple causal factors as required.
- Efficiency: 3 -- Very long; some lessons overlap (Lesson 2 and Lesson 3 both touch on network effects). Could be more concise.
- Depth: 5 -- Competency traps, Vic Gundotra, Google Photos trapped inside G+, security debt in zombie products, second-mover strategies (TikTok, Discord, WeChat). Genuine non-obvious insights.
- **Composite: 4.40**

### Condition E
- must_mention coverage: 5/5 -- Hit all: forced integration (Gmail, YouTube), real names policy mentioned implicitly via "resentment rather than engagement," network effects (users inactive -> zero value), internal incentives (employee bonuses), timing (Facebook dominance).
- must_not violations: None
- Completeness: 4 -- Five lessons covering forced distribution, defensive products, network effects, organizational structure, premature scaling. Data breaches mentioned. Real names policy not explicitly called out as a separate lesson.
- Precision: 5 -- Data breach figures (500K and 52.5M) accurate. "3-5 seconds" average daily usage is a commonly cited stat.
- Actionability: 4 -- Clear generalizable lessons.
- Structure: 5 -- Five numbered non-obvious lessons, multiple causal factors.
- Efficiency: 5 -- Very concise, each lesson is tight.
- Depth: 4 -- "Defensive products driven by competitive fear" is insightful. Premature scaling point is good. Less depth than D on cultural/identity issues.
- **Composite: 4.53**

### Condition F
- must_mention coverage: 5/5 -- Hit all: forced integration (YouTube, Gmail), real names policy (Lesson 4 on cultural blind spot), network effects (utility vs destination), internal incentives (competitive panic), timing (Facebook dominance implicit).
- must_not violations: None (seven lessons, well beyond surface)
- Completeness: 5 -- Seven lessons including platform vs product distinction, engineering culture failure (Circles), "one-stop shop" model dying, data breaches as confirmation of suspicions.
- Precision: 5 -- 500K data breach figure accurate. Claims about Circles are accurate. Market fragmentation (Instagram, Snapchat, TikTok) is correct.
- Actionability: 4 -- "Deeper pattern" synthesis is useful.
- Structure: 5 -- Seven non-obvious lessons plus synthesis. Multiple causal factors.
- Efficiency: 4 -- Well-organized but lengthy.
- Depth: 5 -- Platform vs product distinction, engineering culture vs human problem, "one-stop shop" model dying, data breach as confirmation of user suspicions. The "deeper pattern" (individually useful products succeed at Google) is an excellent synthesis.
- **Composite: 4.60**

---

## Task 5: ra-005

**Ground Truth Summary:** Must mention: Open Science Collaboration (2015) replication rates (~36-39%); specific high-profile failures (ego depletion, power posing, priming); reforms adopted (pre-registration, registered reports, open data); which subfields improved vs didn't; many-labs projects and their findings. Must NOT: dismiss the entire field; claim the crisis is "solved." Structure: before/after comparison with evidence.

### Condition D
- must_mention coverage: 5/5 -- Hit all: OSC 2015 (36% replication, 97% original significance, effect sizes halved), high-profile failures (ego depletion with d=0.04, power posing with Carney disavowal, priming Bargh 1996, plus stereotype threat, growth mindset, facial feedback), reforms (pre-registration, Registered Reports 300+ journals, open data via TOP Guidelines, statistical reform), subfield differences (cognitive 50% vs social 25%), Many Labs projects (ML1 10/13, ML2 50%, ML3, ML5).
- must_not violations: None (explicitly "cautiously optimistic," does not dismiss or claim solved)
- Completeness: 5 -- Exceeds requirements: five root causes, six high-profile failures, seven reform areas, five remaining gaps, metascience as discipline, fraud detection (Gino, Ariely, Stapel).
- Precision: 5 -- Hagger et al. 2016 d=0.04 for ego depletion is accurate. Dana Carney disavowal is real. Coles et al. 2022 facial feedback meta-study is real. Simmons, Nelson, Simonsohn 2011 is real. Data Colada / Gino case is real.
- Actionability: 3 -- Research analysis, appropriate.
- Structure: 5 -- Before/after structure: how bad (with evidence) -> root causes -> what changed -> what hasn't -> assessment -> prognosis.
- Efficiency: 2 -- Extremely long (by far the longest output). Many sections could be condensed significantly.
- Depth: 5 -- Winner's curse, HARKing, registered reports null result rates (50-60% vs 5%), prediction markets on replication, GRIM/SPRITE forensic methods, Button et al. 2013 neuroscience power, existing literature correction gap. Extraordinary depth.
- **Composite: 4.20**

### Condition E
- must_mention coverage: 5/5 -- Hit all: OSC 2015 (36-39%), high-profile failures (ego depletion, power posing, social priming), reforms (pre-registration, registered reports, open data, big team science), subfields (social most vulnerable, cognitive better), many-labs implied via "2025 meta-analysis of 240,000 papers."
- must_not violations: None ("reforms are incomplete" -- does not claim solved or dismiss)
- Completeness: 4 -- All must-mentions covered but less detail: no specific Many Labs results, fewer high-profile failures named, reform description is briefer.
- Precision: 4 -- "2025 meta-analysis of 240,000 papers" is unverifiable. "Median sample ~80-100" pre-reform is plausible but unsourced. "Complaints about these issues date back to 1897" is accurate (meta-scientific history). Overall credible but some stats may be fabricated.
- Actionability: 4 -- Clear recommendation at end about treating pre-2015 findings with skepticism.
- Structure: 5 -- Before/after comparison table, clear sections.
- Efficiency: 5 -- Very concise, high signal.
- Depth: 4 -- Key gap identified (no replication of 2015 study using post-reform papers). Cohen 1994 and Meehl 1978 references are nice historical touches. Less granular than D.
- **Composite: 4.40**

### Condition F
- must_mention coverage: 5/5 -- Hit all: OSC 2015 (36-39%, effect sizes half), high-profile failures (ego depletion, power posing, social priming, facial feedback, marshmallow test), reforms (pre-registration, registered reports, open data, big team science), subfields (cognitive better, social worst), many-labs mentioned via 2025 study of 240,355 articles.
- must_not violations: None (balanced: "real but incomplete")
- Completeness: 5 -- All must-mentions plus nuances (not all subfields equal, failure to replicate != original wrong, psychology not unique). 2025 study metrics (32% to 26% fragile p-values). Persistent problems section.
- Precision: 5 -- High-profile failures accurately described (Carney disavowal, Coles et al. follow-up on facial feedback, marshmallow test SES confound from Watts et al.). "505 collected replications" and "over 60%" non-replication figure are plausible and consistent with known data.
- Actionability: 3 -- Research analysis.
- Structure: 5 -- Before/after with evidence: scale of problem -> casualties -> nuances -> changes -> persistent problems -> verdict.
- Efficiency: 4 -- Well-organized, good density. Slightly long.
- Depth: 5 -- Facial feedback nuance (Coles et al. 2022 found small effect after initial failure), marshmallow test SES confound, p-hacking persistence in 2025, institutional incentives still misaligned (top universities), theory crisis argument. Excellent depth with genuine nuance.
- **Composite: 4.47**

---

## Summary

| Task | D | E | F |
|------|---|---|---|
| ra-001 | 4.73 | 3.80 | 4.47 |
| ra-002 | 4.27 | 3.67 | 3.93 |
| ra-003 | 4.27 | 3.93 | 4.33 |
| ra-004 | 4.40 | 4.53 | 4.60 |
| ra-005 | 4.20 | 4.40 | 4.47 |
| **Mean** | **4.37** | **4.07** | **4.36** |
| E LIFT (vs D) | — | -0.30 | — |
| F LIFT (vs D) | — | — | -0.01 |
| F vs E | — | — | +0.29 |
