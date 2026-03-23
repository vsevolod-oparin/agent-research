# Evaluation: research-analyst

## Ground Truth Requirements

### ra-001 (Homomorphic encryption)
- **must_mention**: performance overhead (orders of magnitude slower), specific libraries (SEAL, HElib, TFHE, Concrete), bootstrapping bottleneck, real-world deployments (Apple, Google), comparison of FHE schemes (BFV, BGV, CKKS) and tradeoffs
- **must_not**: generic "more research needed" without specifics, hallucinated adoption claims
- **structure**: organized by barrier type

### ra-002 (AI alignment approaches)
- **must_mention**: RLHF/Constitutional AI (Anthropic, OpenAI), interpretability/mechanistic (Anthropic, independent), formal verification/provable safety, specific criticisms of each
- **must_not**: present only one perspective, hallucinate researcher positions
- **structure**: comparison table/matrix, steel-man each position before criticizing

### ra-003 (Serverless 2018-2025)
- **must_mention**: cold start problems and evolution, cost at scale (serverless vs containers), vendor lock-in, where it succeeded (event-driven, sporadic), where it failed (latency-sensitive, long-running)
- **must_not**: pure cheerleading or pure criticism
- **structure**: promise vs reality format

### ra-004 (Google+ failure)
- **must_mention**: forced integration (YouTube, Gmail), real names policy backlash, network effects bootstrapping, internal incentive structure (employee bonuses), timing relative to Facebook
- **must_not**: only surface-level "it was too late"
- **structure**: multiple causal factors

### ra-005 (Psychology replication crisis)
- **must_mention**: Open Science Collaboration (2015) rates (~36-39%), specific failures (ego depletion, power posing, priming), reforms (pre-registration, registered reports, open data), which subfields improved vs didn't, many-labs projects
- **must_not**: dismiss entire field, claim crisis is "solved"
- **structure**: before/after comparison with evidence

---

## Condition Evaluations

### a1
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | All claims accurate. Performance numbers, library names, scheme comparisons correct. No hallucinations. |
| Completeness | 5 | All must_mention items across all 5 tasks. FHE schemes compared, bootstrapping discussed, Apple mentioned (ra-001). RLHF + interpretability + formal methods with specific criticisms (ra-002). Cold starts, cost, vendor lock-in, success/failure areas (ra-003). Forced integration, real names, bonuses, timing, network effects (ra-004). OSC 36-39%, ego depletion, power posing, priming, pre-registration, registered reports, ManyLabs, subfield differences (ra-005). |
| Actionability | 4 | Research synthesis, not implementation -- appropriate for analyst task. Clear verdicts. |
| Structure | 4 | Organized by barrier type for ra-001. Multiple camps for ra-002. Promise vs reality for ra-003. Multiple causal factors for ra-004. Before/after for ra-005. Missing explicit comparison table for ra-002. |
| Efficiency | 5 | Very concise (~137 lines for 5 tasks). No filler. |
| Depth | 5 | IAT critique, "alignment" as shallow sycophancy, Basecamp cost analysis reference, Circles solving wrong problem, p-curve analysis mention. |
| **Composite** | **4.73** | |

### a2
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | Accurate throughout. OpenFHE, Zama Concrete ML, edge functions evolution all correct. |
| Completeness | 5 | All must_mention items present. Bootstrapping cost explicit. CKKS vs BFV/BGV discussed. Edge functions as serverless evolution. Bonuses tied to G+ success mentioned. ManyLabs projects mentioned. |
| Actionability | 4 | Good synthesis with clear verdicts and timelines. |
| Structure | 4 | Good organization. ra-002 has camp-by-camp structure but no comparison table. |
| Efficiency | 5 | Concise (~177 lines). Well-edited. |
| Depth | 5 | Vanity metrics insight, organizational self-deception, culture fit failure, effect size recalibration, partial replication inflation. |
| **Composite** | **4.73** | |

### a3
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | Accurate. Correctly identifies BFV, BGV, CKKS schemes. Specific researcher names (Olah, Christiano, Yudkowsky) correct. |
| Completeness | 5 | All must_mention items. Bootstrapping as key bottleneck explicit. Constitutional AI and RLHF both covered. Cold starts, cost, lock-in all present. Forced integration, bonuses, real names all mentioned. OSC 36-39%, specific failures, reforms all covered. |
| Actionability | 4 | Clear assessments. Meta-observation about convergence of camps is valuable. |
| Structure | 4 | Good organization but ra-002 lacks comparison table. |
| Efficiency | 5 | Concise (~157 lines). |
| Depth | 4 | Solid depth but slightly less nuanced than a1/a2 on some topics (e.g., less detail on specific deployment examples for HE). |
| **Composite** | **4.60** | |

### a4
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | All claims accurate. Specific: Apple PSI, Zama TFHE-rs, NIST tracking. Correct that Camp 3 is Governance/Coordination (valid framing but diverges from ground truth's "formal verification" -- still covers formal methods within other camps). |
| Completeness | 4 | ra-001: All present including Apple. ra-002: Covers RLHF, interpretability, but Camp 3 is Governance instead of formal verification -- formal methods partially covered in Camp 2 discussion. ra-003-005: All present. |
| Actionability | 4 | Clear verdicts with specific timelines. |
| Structure | 4 | Well-organized. Cross-cutting tension section valuable. |
| Efficiency | 5 | Concise (~170 lines). |
| Depth | 5 | TFHE-rs sub-second bootstrapping milestone, Goodhart's Law applied to RLHF, provisioned concurrency erasing economic advantage, organizational culture vs consumer social, preregistration adoption numbers. |
| **Composite** | **4.53** | |

### a5
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | All accurate. Detailed and careful. FHE.org standardization, NIST post-quantum tracking. |
| Completeness | 5 | All must_mention items thoroughly covered. Bootstrapping, scheme comparison (BFV/BGV/CKKS/TFHE), specific libraries, Apple PSI. RLHF + interpretability + formal verification all covered with specific criticisms. Serverless promise vs reality complete. Google+ all 5 factors. Psychology: OSC rates, specific failures, reforms, subfield differences, ManyLabs 2 with specific findings, ongoing problems. |
| Actionability | 4 | Clear, well-reasoned assessments. |
| Structure | 4 | Organized appropriately for each task. No comparison table for ra-002. |
| Efficiency | 4 | Slightly longer (~182 lines) but all content is substantive. |
| Depth | 5 | Winner's curse in effect sizes, preregistration loosely constrained, file drawer persists for null preregistered studies, clinical vs experimental adoption differences, Circles as "high activation energy." |
| **Composite** | **4.60** | |

### b1
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Mostly accurate. Some claims lack specificity. "Duality Technologies, 金融服务" has a Chinese character artifact. Projections ("2030: Near-practical for general-purpose") are speculative. |
| Completeness | 5 | All must_mention items covered across all tasks. Extensive coverage including alternatives to HE, comparison tables, market share estimates. |
| Actionability | 4 | Includes recommendations and when-to-use guidance. |
| Structure | 5 | Excellent tables, comparison matrices, trend indicators. Promise vs reality format for serverless. Timeline for Google+. Metrics tables for psychology. |
| Efficiency | 1 | Extremely verbose (~950 lines). Extensive tables, emoji indicators, repeated information. Market share percentages for serverless vendors without clear sourcing. |
| Depth | 4 | Broad but sometimes shallow -- covers many angles without deep analysis of any. Serverless vendor landscape table is nice but speculative. Google+ section has 8 "lessons" some of which are surface-level. |
| **Composite** | **3.67** | |

### b2
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Mostly accurate. Some code-formatted text (serverless.yml, Dockerfile comparison) is superficial. Cold start times in table are approximate. |
| Completeness | 5 | All must_mention items covered. Libraries listed, schemes compared, bootstrapping mentioned. All three alignment camps. Serverless promise vs reality. Google+ forced integration, real names, empty room. OSC rates, specific failures, reforms. |
| Actionability | 4 | Clear assessments with practical takeaways. |
| Structure | 4 | Good tables and comparisons. Promise vs reality format. |
| Efficiency | 2 | Very verbose (~720 lines). Code snippets in research analysis add little value. Market evolution timeline is detailed but padded. |
| Depth | 4 | Content mix defining network culture is a good insight. "Social graph moats stronger than expected" is valid. But some analysis stays at summary level. |
| **Composite** | **3.67** | |

### b3
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 3 | Admits "web search services experiencing technical difficulties" and relies on training data. Lists Wikipedia as sources. Some claims are generic. ra-002: Three camps are intent alignment/corrigibility/robustness -- valid but non-standard framing that misses interpretability as a distinct camp. |
| Completeness | 4 | ra-001: Missing Apple/Google real-world deployment specifics. Libraries covered. ra-002: RLHF and interpretability covered but as techniques within camps, not as distinct camps matching ground truth. Formal verification covered. ra-003-005: Adequately covered. |
| Actionability | 3 | Analysis is more cautious due to acknowledged limitations. Less decisive verdicts. |
| Structure | 4 | Tables present. Source confidence assessment tables are novel and honest. |
| Efficiency | 2 | Very verbose (~665 lines). Confidence tables and disclaimers add bulk. |
| Depth | 3 | Depth suffers from reliance on training data without web research. Less specific on recent developments. Google+ analysis is solid but less nuanced than a-group. |
| **Composite** | **3.13** | |

### b4
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Mostly accurate. Some speculative numbers (Lambda market share 70%). IBM "Fabric for Cryptographic Services" not verifiable. |
| Completeness | 4 | ra-001: Libraries covered but bootstrapping discussion thin. No Apple deployment mention. ra-002: Interpretability, Safety/Control, Governance -- reasonable but Safety/Control conflates RLHF with scalable oversight. Formal verification under-covered. ra-003-005: Adequately covered. |
| Actionability | 4 | Clear recommendations. When-to-use guidance for HE. |
| Structure | 4 | Tables, timelines, hype cycle diagram. |
| Efficiency | 2 | Verbose (~550 lines). Vendor landscape table for serverless with speculative data. |
| Depth | 4 | "Denial of wallet" attacks mentioned for serverless. Google+ real-name impact on specific communities. ManyLabs 5 time effects mentioned. |
| **Composite** | **3.53** | |

### b5
| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Mostly accurate. "100-1000x slower" for HE is correct range. Some simplification in alignment camps. |
| Completeness | 4 | ra-001: Libraries mentioned but no Apple/Google specific deployments. Bootstrapping briefly mentioned. ra-002: Three camps reasonable but no comparison table. Formal verification thin. ra-003: All items present. ra-004: Good coverage of non-obvious lessons. ra-005: OSC rates, specific failures, reforms all present. |
| Actionability | 4 | Clear practical guidance. |
| Structure | 4 | Good tables. When FHE makes sense table is useful. |
| Efficiency | 2 | Verbose (~550 lines). Wikipedia citations suggest shallow sourcing. |
| Depth | 3 | Less nuanced than a-group on most topics. Alignment analysis lacks specific researcher names beyond major figures. Google+ analysis is solid but more conventional. |
| **Composite** | **3.40** | |

---

## Summary Table

| Condition | Precision | Completeness | Actionability | Structure | Efficiency | Depth | Composite |
|-----------|-----------|--------------|---------------|-----------|------------|-------|-----------|
| a1 | 5 | 5 | 4 | 4 | 5 | 5 | 4.73 |
| a2 | 5 | 5 | 4 | 4 | 5 | 5 | 4.73 |
| a3 | 5 | 5 | 4 | 4 | 5 | 4 | 4.60 |
| a4 | 5 | 4 | 4 | 4 | 5 | 5 | 4.53 |
| a5 | 5 | 5 | 4 | 4 | 4 | 5 | 4.60 |
| b1 | 4 | 5 | 4 | 5 | 1 | 4 | 3.67 |
| b2 | 4 | 5 | 4 | 4 | 2 | 4 | 3.67 |
| b3 | 3 | 4 | 3 | 4 | 2 | 3 | 3.13 |
| b4 | 4 | 4 | 4 | 4 | 2 | 4 | 3.53 |
| b5 | 4 | 4 | 4 | 4 | 2 | 3 | 3.40 |

## Key Observations

1. **a-group dominates on Efficiency and Precision.** a-conditions deliver the same or better substantive content in 1/3 to 1/5 the word count. Every a-condition scores 5 on Precision; no b-condition reaches 5.

2. **b-group adds volume without proportional value.** b1's 950 lines include market share tables, vendor landscapes, and emoji status indicators that look informative but contain speculative data. The extra length does not improve accuracy or insight.

3. **b3 is the weakest condition** due to acknowledged search limitations, Wikipedia-only sourcing, and a non-standard framing of alignment camps that misses interpretability as a distinct approach.

4. **a1 and a2 are the strongest**, combining excellent precision, full completeness, and remarkable efficiency. Both deliver nuanced analysis (IAT critique, vanity metrics, p-curve analysis) in ~140-180 lines.

5. **ra-002 (AI alignment)** is the most discriminating task. a-conditions correctly identify RLHF, interpretability, and formal verification as the three camps. Several b-conditions substitute governance/institutional as a camp, which is valid but not the ground truth framing focusing on technical approaches.

6. **No condition hallucinates adoption claims** (must_not for ra-001) or presents only one perspective (must_not for ra-002). All conditions avoid the must_not violations.
