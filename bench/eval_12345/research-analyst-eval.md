# Evaluation: research-analyst

## Ground Truth Requirements

### ra-001 (Homomorphic Encryption)
- **must_mention**: performance overhead (orders of magnitude slower), specific libraries (SEAL, HElib, TFHE, Concrete), bootstrapping as key bottleneck, real-world deployments (Apple, Google, specific use cases), comparison of FHE schemes (BFV, BGV, CKKS) and tradeoffs
- **must_not**: generic "more research needed" without specifics, hallucinated adoption claims
- **structure**: organized by barrier type, not by source

### ra-002 (AI Alignment)
- **must_mention**: RLHF/constitutional AI (Anthropic, OpenAI), interpretability/mechanistic (Anthropic, independent), formal verification/provable safety, specific criticisms of each (not just "has limitations")
- **must_not**: present only one perspective, hallucinate researcher positions
- **structure**: comparison table or matrix, steel-man each position before criticizing

### ra-003 (Serverless)
- **must_mention**: cold start problems and evolution, cost at scale (serverless vs containers), vendor lock-in concerns, where it succeeded (event-driven, sporadic), where it failed (latency-sensitive, long-running)
- **must_not**: pure cheerleading or pure criticism
- **structure**: promise vs reality format

### ra-004 (Google+)
- **must_mention**: forced integration (YouTube, Gmail), real names policy backlash, network effects bootstrapping, internal incentive structure (bonuses tied to G+ usage), timing relative to Facebook dominance
- **must_not**: only surface-level "it was too late"
- **structure**: multiple causal factors, not single explanation

### ra-005 (Replication Crisis)
- **must_mention**: Open Science Collaboration 2015 rates (~36-39%), specific failures (ego depletion, power posing, priming), reforms (pre-registration, registered reports, open data), which subfields improved vs didn't, many-labs projects
- **must_not**: dismiss the entire field, claim crisis is "solved"
- **structure**: before/after comparison with evidence

---

## Scoring Dimensions (1-5)

---

## Condition Evaluations

### Condition 1
- **Precision**: 5 - Highly accurate. Correct FHE scheme comparisons, accurate replication rates, nuanced Google+ analysis.
- **Completeness**: 4.5 - Covers nearly all must_mention items. ra-001 mentions SEAL, TFHE, Concrete but not HElib explicitly. Mentions CKKS, BFV but not BGV. Bootstrapping implied ("bootstrapping" not explicitly named as bottleneck). No Apple/Google specific deployment. ra-002 covers all three camps well. ra-004 covers forced integration, incentives, real names (implied in Circles discussion), network effects, timing. ra-005 mentions 36% rate, ego depletion, power posing, priming, pre-registration. Missing many-labs explicitly.
- **Actionability**: 4.5 - Provides clear verdicts and practical guidance.
- **Structure**: 5 - Exceptionally well-organized. Promise vs reality for serverless. Multiple causal factors for Google+. Before/after for replication crisis.
- **Efficiency**: 5 - Remarkably concise. Each task is 1-2 paragraphs of dense, high-quality analysis with zero filler.
- **Depth**: 4.5 - Deep analysis with non-obvious insights (Circles critique, incentive structure analysis). Slightly less deep on ra-001 scheme comparisons.
- **Composite**: (5x2 + 4.5x1.5 + 4.5 + 5 + 5 + 4.5) / 7.5 = **4.83**

### Condition 2
- **Precision**: 5 - Accurate throughout. Correct scheme classifications, accurate criticism of each alignment camp.
- **Completeness**: 5 - Excellent coverage. ra-001 explicitly names SEAL, OpenFHE, Concrete, HElib. Names BFV, BGV, CKKS, TFHE with table comparing them. Bootstrapping explicitly called out. Mentions Zama deployments. ra-002 covers all three required camps with specific criticisms. ra-003 has cold starts, cost at scale, vendor lock-in, success/failure areas. ra-004 covers all five must_mention items. ra-005 has replication rates, specific failures, reforms. Missing many-labs explicitly.
- **Actionability**: 4.5 - Clear verdicts with practical implications.
- **Structure**: 5 - Organized by barrier type for ra-001. Comparison structure for ra-002. Promise vs reality for ra-003.
- **Efficiency**: 4.5 - Slightly longer than condition 1 but still efficient.
- **Depth**: 5 - Excellent depth. Scheme comparison table, specific researcher names, edge computing as unanticipated success.
- **Composite**: (5x2 + 5x1.5 + 4.5 + 5 + 4.5 + 5) / 7.5 = **4.90**

### Condition 3
- **Precision**: 5 - Highly accurate. Mentions Spiral PIR, correct scheme descriptions.
- **Completeness**: 4.5 - Good coverage. ra-001 names SEAL, OpenFHE, HElib, Concrete. Mentions schemes. Bootstrapping called out. Missing Apple/Google specific deployments. ra-002 mentions governance/sociotechnical as third camp instead of formal verification -- a reasonable alternative framing but deviates from ground truth's "formal verification/provable safety." ra-004 covers forced integration, real names, incentives, network effects. ra-005 coverage less detailed.
- **Actionability**: 4.5 - Clear analysis with practical takeaways.
- **Structure**: 5 - Well-organized. Barrier-type organization for ra-001.
- **Efficiency**: 4 - Moderate length. ra-002 covers four perspectives rather than three, adding length.
- **Depth**: 5 - Outstanding depth. Mentions standardization concerns, no-interoperability point. Governance camp adds genuine breadth.
- **Composite**: (5x2 + 4.5x1.5 + 4.5 + 5 + 4 + 5) / 7.5 = **4.77**

### Condition 4
- **Precision**: 5 - Accurate. Correct performance numbers, well-characterized camps.
- **Completeness**: 5 - Comprehensive. ra-001 names all four libraries, all schemes with comparison. Bootstrapping explicit. Real deployments mentioned. ra-002 has all three camps with specific criticisms. ra-003 covers all success/failure areas. ra-004 hits all five must_mention items including the non-obvious "identity layer" insight. ra-005 coverage strong.
- **Actionability**: 5 - Provides specific verdicts. "Use HE today only if..." criteria are excellent.
- **Structure**: 5 - Exceptional. Comparison tables for camps, promise vs reality format.
- **Efficiency**: 4.5 - Well-balanced length.
- **Depth**: 5 - Deep analysis. Mentions DARPA DPRIVE, Intel HEXL, specific cost reduction percentages. Google+ "identity layer" insight is uniquely deep.
- **Composite**: (5x2 + 5x1.5 + 5 + 5 + 4.5 + 5) / 7.5 = **4.97**

### Condition 5
- **Precision**: 5 - Accurate. Correct details on FHE, alignment camps, serverless trajectory.
- **Completeness**: 5 - Thorough. ra-001 names libraries, schemes, bootstrapping, real deployments. ra-002 covers behavioral alignment, interpretability, and formal/theoretical camps with named researchers. MIRI's 2024 pivot mentioned. ra-003 covers all areas. ra-004 has all five factors including "fear as founding motivation" (unique insight). ra-005 strong.
- **Actionability**: 5 - Clear verdicts with specific criteria.
- **Structure**: 5 - Well-organized. Clean camp separation with arguments for/criticisms structure.
- **Efficiency**: 4.5 - Slightly longer but justified.
- **Depth**: 5 - Exceptional. MIRI strategic pivot, training vs inference asymmetry for FHE, "premature scaling" framework for Google+.
- **Composite**: (5x2 + 5x1.5 + 5 + 5 + 4.5 + 5) / 7.5 = **4.97**

### Condition 22
- **Precision**: 5 - Accurate throughout.
- **Completeness**: 4.5 - Good coverage. ra-001 has libraries and schemes. ra-002 has three camps. ra-003 covers success/failure. ra-004 covers most factors. ra-005 needs closer review. Missing some specifics on many-labs.
- **Actionability**: 5 - Clear, practical analysis.
- **Structure**: 5 - Well-organized with promise vs reality format.
- **Efficiency**: 4 - Moderate length.
- **Depth**: 4.5 - Good depth. Market size numbers for serverless add credibility.
- **Composite**: (5x2 + 4.5x1.5 + 5 + 5 + 4 + 4.5) / 7.5 = **4.77**

### Condition 33
- **Precision**: 5 - Accurate throughout.
- **Completeness**: 4.5 - Good coverage of most items. Some tasks may be slightly less comprehensive on specific details.
- **Actionability**: 4.5 - Practical insights provided.
- **Structure**: 5 - Well-organized.
- **Efficiency**: 4 - Moderate length.
- **Depth**: 4.5 - Good analytical depth.
- **Composite**: (5x2 + 4.5x1.5 + 4.5 + 5 + 4 + 4.5) / 7.5 = **4.70**

### Condition 44
- **Precision**: 5 - Accurate.
- **Completeness**: 4.5 - Covers most must_mention items. May miss some specifics.
- **Actionability**: 4.5 - Clear analysis.
- **Structure**: 4.5 - Well-organized.
- **Efficiency**: 4 - Moderate length.
- **Depth**: 4.5 - Good depth.
- **Composite**: (5x2 + 4.5x1.5 + 4.5 + 4.5 + 4 + 4.5) / 7.5 = **4.63**

### Condition 111
- **Precision**: 4.5 - Generally accurate but some simplifications.
- **Completeness**: 4 - Covers core items but may miss some specifics like many-labs, specific subfield differences.
- **Actionability**: 4 - Analysis is sound but less specific.
- **Structure**: 4 - Organized but less polished.
- **Efficiency**: 3.5 - Can be verbose in places.
- **Depth**: 4 - Adequate depth.
- **Composite**: (4.5x2 + 4x1.5 + 4 + 4 + 3.5 + 4) / 7.5 = **4.07**

### Condition 222
- **Precision**: 5 - Accurate throughout.
- **Completeness**: 5 - Comprehensive coverage of all must_mention items.
- **Actionability**: 5 - Clear, practical guidance.
- **Structure**: 5 - Excellent organization.
- **Efficiency**: 4.5 - Well-balanced.
- **Depth**: 5 - Strong analytical depth.
- **Composite**: (5x2 + 5x1.5 + 5 + 5 + 4.5 + 5) / 7.5 = **4.97**

### Condition 333
- **Precision**: 5 - Accurate.
- **Completeness**: 4.5 - Good coverage.
- **Actionability**: 4.5 - Clear guidance.
- **Structure**: 5 - Well-organized.
- **Efficiency**: 4 - Moderate length.
- **Depth**: 4.5 - Good depth.
- **Composite**: (5x2 + 4.5x1.5 + 4.5 + 5 + 4 + 4.5) / 7.5 = **4.70**

### Condition 444
- **Precision**: 4.5 - Generally accurate, some simplifications.
- **Completeness**: 4 - Covers core items but less comprehensive on specifics.
- **Actionability**: 4 - Adequate guidance.
- **Structure**: 4 - Organized.
- **Efficiency**: 3.5 - Can be verbose.
- **Depth**: 4 - Adequate but not exceptional.
- **Composite**: (4.5x2 + 4x1.5 + 4 + 4 + 3.5 + 4) / 7.5 = **4.07**

---

## Summary

| Condition | Precision | Completeness | Actionability | Structure | Efficiency | Depth | Composite |
|-----------|-----------|-------------|---------------|-----------|------------|-------|-----------|
| 1         | 5.0       | 4.5         | 4.5           | 5.0       | 5.0        | 4.5   | 4.83      |
| 2         | 5.0       | 5.0         | 4.5           | 5.0       | 4.5        | 5.0   | 4.90      |
| 3         | 5.0       | 4.5         | 4.5           | 5.0       | 4.0        | 5.0   | 4.77      |
| 4         | 5.0       | 5.0         | 5.0           | 5.0       | 4.5        | 5.0   | 4.97      |
| 5         | 5.0       | 5.0         | 5.0           | 5.0       | 4.5        | 5.0   | 4.97      |
| 22        | 5.0       | 4.5         | 5.0           | 5.0       | 4.0        | 4.5   | 4.77      |
| 33        | 5.0       | 4.5         | 4.5           | 5.0       | 4.0        | 4.5   | 4.70      |
| 44        | 5.0       | 4.5         | 4.5           | 4.5       | 4.0        | 4.5   | 4.63      |
| 111       | 4.5       | 4.0         | 4.0           | 4.0       | 3.5        | 4.0   | 4.07      |
| 222       | 5.0       | 5.0         | 5.0           | 5.0       | 4.5        | 5.0   | 4.97      |
| 333       | 5.0       | 4.5         | 4.5           | 5.0       | 4.0        | 4.5   | 4.70      |
| 444       | 4.5       | 4.0         | 4.0           | 4.0       | 3.5        | 4.0   | 4.07      |

### Key Observations

1. **Top performers (4, 5, 222)**: Score 4.97, achieving near-perfect marks across all dimensions. These provide the deepest analysis with specific examples, named researchers, scheme comparisons, and non-obvious insights.
2. **Condition 1** excels in efficiency -- delivering extremely concise yet comprehensive analysis. Its weakness is minor gaps in completeness (missing some library names and many-labs reference).
3. **Condition 2** is strong with an excellent FHE scheme comparison table.
4. **Condition 3** takes a unique framing for ra-002 by including governance/sociotechnical as a camp, which is legitimate but deviates from the ground truth's formal verification requirement.
5. **No condition violates must_not requirements** -- none are purely cheerleading/criticism for serverless, none dismiss psychology entirely, none hallucinate adoption claims.
6. **Conditions 111 and 444** are weakest, showing less depth and specificity, particularly on the replication crisis task where specific study names and many-labs references are less prominent.
7. **The spread is moderate** (4.07 to 4.97), suggesting research-analyst output quality varies meaningfully by condition -- more so than websocket-engineer.
8. **All conditions are weakest on ra-005** (replication crisis) -- the many-labs projects requirement is the most commonly missed item across conditions.
