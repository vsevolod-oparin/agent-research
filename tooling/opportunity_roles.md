# Opportunity Discovery Agent Roles — Top 15

Agents for identifying chokepoints, high-impact underserved areas, and white space opportunities within an industry or field (e.g., machine learning, biotech, energy). Goal: find where attention is low but potential impact is high.

Inspired by white space analysis methodology, competitive intelligence frameworks, and Richard Hamming's principles on doing great research ("You and Your Research", 1986).

---

## Knowledge Building

### 1. Landscape Mapper
Builds a structured map of the entire field — key subdomains, active players, funding flows, publication/patent density, and maturity stages. Answers: "what does the terrain look like?" Creates the base layer everything else builds on. Outputs technology trees, domain taxonomies, and activity heat maps.

### 2. Bottleneck Detector
Identifies chokepoints — places where progress in one area blocks progress in many others. Looks for: shared dependencies (everyone needs X but X is hard), infrastructure gaps, missing tooling, data scarcity, compute constraints, regulatory blockers. The most leveraged problems live here.

### 3. Trend Archaeologist
Digs into the history of the field to find abandoned approaches that failed due to limitations now resolved (compute, data, algorithms). Identifies cyclical patterns, ideas ahead of their time, and "dead" research directions worth revisiting. Prevents the field's survivorship bias from hiding good opportunities.

### 4. Failure Analyst
Studies what has been tried and failed — why, under what conditions, and what has changed since. Reads post-mortems, retracted papers, failed startups, abandoned projects. Distinguishes "bad idea" from "bad timing" or "bad execution." Prevents reinventing broken wheels and spots fixable failures.

### 5. Adjacent Field Scanner
Monitors neighboring fields for incoming disruptions, paradigm shifts, and converging trajectories that could reshape the target field. Not looking for transferable solutions (that's Cross-Pollinator) but for early signals: when a neighboring field suddenly accelerates, what does that mean for us? Watches for the "open door" signals that others miss by staying heads-down. *(Hamming: scientists with open doors catch emerging problems that closed-door scientists miss entirely.)*

---

## Gap & Context Analysis

### 6. Attention Auditor
Measures where the field's resources actually go — publication counts, funding allocations, hiring patterns, conference tracks, open-source activity. Quantifies the attention distribution to reveal overcrowded "red oceans" and neglected areas. Key output: attention-vs-importance mismatch map.

### 7. Cross-Pollinator
Looks outside the target field for transferable solutions, methods, or frameworks from adjacent domains. Finds where ML could borrow from control theory, where biotech methods apply to materials science, etc. Specializes in analogical reasoning across domain boundaries — often where the highest-impact non-obvious ideas live.

### 8. Stakeholder Mapper
Identifies who cares about each problem area — researchers, companies, funders, regulators, end users — and what they actually need vs. what they say they need. Maps adoption barriers and reveals where technical solutions exist but deployment is blocked by non-technical factors.

### 9. Incentive Decoder
Analyzes *why* the field's attention distribution looks the way it does. Maps the incentive structures — publication pressure, funding cycles, career rewards, herd behavior, prize effects — that push researchers toward crowded areas and away from important-but-unglamorous ones. Explains the root cause of attention mismatches, not just their existence. Identifies where systemic incentives actively suppress work on high-impact problems. *(Hamming: the "Prize Effect" sterilizes careers; ego costs drain energy; working with systems beats fighting them.)*

---

## Scoring & Reframing

### 10. Impact Estimator
Scores potential impact of solving problems in different areas. Considers: how many downstream applications unblock, size of affected user/patient/customer base, economic value, time horizon, and compounding effects. Separates "important-sounding" from "actually high-leverage." Produces ranked opportunity lists with reasoning.

### 11. Compounding Spotter
Identifies which small foundational contributions would compound over time vs. which flashy problems are dead ends. Evaluates leverage of incremental work — the "acorns" that grow into "mighty oaks." Looks for: infrastructure that many future efforts will build on, standards that lock in early movers, datasets/benchmarks that shape a subfield, tools that change workflows permanently. Favors sustained compound growth over one-shot breakthroughs. *(Hamming: "drive as compound interest" — consistent 10% more effort dramatically outproduces over a career. Plant acorns, don't hunt for big oaks.)*

### 12. Problem Reframer
Takes narrow, isolated problems and reformulates them into more powerful general forms. Asks: "Is this specific problem actually an instance of a broader class? Can we solve the general case instead?" Transforms point solutions into systematic methodologies. This is where a single insight multiplies across many applications. The difference between solving one problem and solving a category. *(Hamming: generalization often simplifies by eliminating incidental complexity. The best work reframes, not just solves.)*

---

## Validation

### 13. Assumption Auditor
Surfaces hidden assumptions baked into the field's current approach — things everyone takes for granted that may not be true. Operates with calibrated ambiguity: believes enough to engage seriously, doubts enough to notice flaws. Explicitly writes down contradicting evidence and unexamined premises. Catches "everyone knows X" beliefs that block alternative paths. *(Hamming: Darwin deliberately wrote down contradicting evidence so it wouldn't fade from memory. Great scientists tolerate ambiguity — too much belief blinds, too much doubt paralyzes.)*

### 14. White Space Scorer
Combines outputs from other agents into a unified opportunity scoring framework. Plots areas on an attention-vs-impact matrix. Applies filters: feasibility, time-to-impact, defensibility, resource requirements, compounding potential. Produces the final ranked list of high-impact, low-attention opportunities with confidence levels.

### 15. Contrarian Challenger
Stress-tests the top opportunities by arguing against them. For each candidate: What if the "low attention" is actually justified? What if the impact estimate is wrong? What hidden competitors exist? What technical barriers are underestimated? What incentive structures will resist this? Prevents the team from falling in love with an opportunity before validating it.

---

## Workflow

```
                        KNOWLEDGE BUILDING
Landscape Mapper ─┬─→ Bottleneck Detector
                  ├─→ Trend Archaeologist
                  ├─→ Failure Analyst
                  └─→ Adjacent Field Scanner
                            │
                     GAP & CONTEXT ANALYSIS
              ┌─────────────┼─────────────┐
    Attention Auditor  Cross-Pollinator  Stakeholder Mapper
              └─────────────┼─────────────┘
                            │
                    Incentive Decoder
                            │
                    SCORING & REFRAMING
              ┌─────────────┼─────────────┐
       Impact Estimator  Compounding   Problem Reframer
                         Spotter
              └─────────────┼─────────────┘
                            │
                        VALIDATION
              ┌─────────────┼─────────────┐
      Assumption Auditor   White Space    Contrarian
                           Scorer         Challenger
                            │
                     Final ranked
                     opportunities
```

Phase 1 (parallel): Landscape Mapper + Bottleneck Detector + Trend Archaeologist + Failure Analyst + Adjacent Field Scanner — build the knowledge base
Phase 2 (parallel): Attention Auditor + Cross-Pollinator + Stakeholder Mapper — analyze gaps and context
Phase 3: Incentive Decoder — explain why mismatches exist
Phase 4 (parallel): Impact Estimator + Compounding Spotter + Problem Reframer — score, reframe, evaluate leverage
Phase 5 (sequential): Assumption Auditor → White Space Scorer → Contrarian Challenger — validate and stress-test
