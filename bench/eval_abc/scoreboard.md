# Agent Evaluation Scoreboard (ABC Protocol)

Evaluated: 2026-03-22 | Model: Claude Opus 4.6 with Sonnet agents | Method: LLM-as-judge, 6 dimensions
Protocol: adapted from tooling/agent_eval.md | Total outputs scored: 180 (12 agents x 5 tasks x 3 conditions)

Conditions: A = bare model (no agent instructions), B = v1 agent instructions, C = v2 agent instructions

---

## Full Results

Sorted by C LIFT descending.

| Agent | A (bare) | B (v1) | C (v2) | B LIFT | C LIFT | C vs B |
|-------|----------|--------|--------|--------|--------|--------|
| fastapi-pro | 4.52 | 4.53 | 4.87 | +0.01 | **+0.35** | +0.34 |
| research-analyst | 4.51 | 4.79 | 4.79 | +0.28 | **+0.28** | +0.00 |
| dotnet-framework-pro | 4.72 | 4.82 | 4.84 | +0.10 | **+0.12** | +0.02 |
| tdd-guide | 4.53 | 5.00 | 4.65 | +0.47 | **+0.12** | -0.35 |
| go-build-resolver | 4.58 | 4.66 | 4.65 | +0.08 | **+0.07** | -0.01 |
| websocket-engineer | 4.87 | 4.87 | 4.87 | +0.00 | **+0.00** | +0.00 |
| code-reviewer | 4.79 | 4.81 | 4.76 | +0.02 | **-0.03** | -0.05 |
| incident-responder | 5.00 | 4.84 | 4.96 | -0.16 | **-0.04** | +0.12 |
| security-reviewer | 4.84 | 4.69 | 4.80 | -0.15 | **-0.04** | +0.11 |
| java-pro | 4.90 | 4.84 | 4.77 | -0.06 | **-0.13** | -0.07 |
| documentation-pro | 4.87 | 4.60 | 4.72 | -0.27 | **-0.15** | +0.12 |
| full-stack-developer | 4.80 | 4.91 | 4.65 | +0.11 | **-0.15** | -0.26 |

### Grand Mean

| Metric | A (bare) | B (v1) | C (v2) |
|--------|----------|--------|--------|
| **Grand Mean** | **4.74** | **4.78** | **4.78** |
| **LIFT vs A** | -- | **+0.04** | **+0.03** |
| **C vs B** | -- | -- | **-0.00** |

---

## Comparison with Prior Eval

The prior hand-crafted eval (`bench/eval/scoreboard.md`) used 2 tasks per agent (72 outputs). This ABC eval used 5 tasks per agent with actual model outputs (180 outputs).

| Agent | Prior Bare | Prior V1 | Prior V2 | ABC A | ABC B | ABC C | Prior V2 LIFT | ABC C LIFT |
|-------|-----------|----------|----------|-------|-------|-------|---------------|------------|
| code-reviewer | 3.23 | 4.87 | 5.00 | 4.79 | 4.81 | 4.76 | +1.77 | -0.03 |
| security-reviewer | 3.43 | 3.90 | 4.93 | 4.84 | 4.69 | 4.80 | +1.50 | -0.04 |
| incident-responder | 3.43 | 4.47 | 4.87 | 5.00 | 4.84 | 4.96 | +1.44 | -0.04 |
| tdd-guide | 2.30 | 3.73 | 4.67 | 4.53 | 5.00 | 4.65 | +2.37 | +0.12 |
| go-build-resolver | 2.87 | 4.60 | 4.87 | 4.58 | 4.66 | 4.65 | +2.00 | +0.07 |
| dotnet-framework-pro | 3.57 | 1.87 | 4.34 | 4.72 | 4.82 | 4.84 | +0.77 | +0.12 |
| websocket-engineer | 3.57 | 3.70 | 4.87 | 4.87 | 4.87 | 4.87 | +1.30 | +0.00 |
| research-analyst | 3.47 | 3.80 | 4.60 | 4.51 | 4.79 | 4.79 | +1.13 | +0.28 |
| full-stack-developer | 3.00 | 3.75 | 4.87 | 4.80 | 4.91 | 4.65 | +1.87 | -0.15 |
| java-pro | 3.33 | 3.77 | 4.93 | 4.90 | 4.84 | 4.77 | +1.60 | -0.13 |
| documentation-pro | 2.32 | 3.90 | 4.54 | 4.87 | 4.60 | 4.72 | +2.22 | -0.15 |
| fastapi-pro | 2.80 | 3.70 | 4.57 | 4.52 | 4.53 | 4.87 | +1.77 | +0.35 |
| **Grand Mean** | **3.09** | **3.76** | **4.76** | **4.74** | **4.78** | **4.78** | **+1.67** | **+0.03** |

The contrast is dramatic:
- **Prior eval**: Bare ~3.1, V1 ~3.8, V2 ~4.8 -- a spread of **1.7 points** and every v2 agent showed large positive lift
- **ABC eval**: A ~4.7, B ~4.8, C ~4.8 -- a spread of **0.04 points** and most agents show negligible or negative lift

---

## Key Findings

### 1. Ceiling Effect: The Base Model Is Already Excellent

All three conditions scored above 4.5 on average. The bare model (A) averaged 4.74/5.00 -- leaving only 0.26 points of headroom. At this performance level, it is nearly impossible for agent instructions to produce meaningful improvement. Seven of 12 agents scored 4.72+ bare.

The prior eval's bare scores (mean 3.09) were roughly 1.65 points lower than the ABC eval's bare scores (4.74). This suggests the prior eval's "bare" responses were either hand-crafted to be intentionally weak, or used a different (weaker) evaluation rubric. The prior eval's wide spreads were an artifact of the baseline being artificially low, not of agent instructions being transformative.

### 2. Agents That Showed Meaningful Lift

Only two agents showed clear positive lift from agent instructions:

| Agent | B LIFT | C LIFT | Mechanism |
|-------|--------|--------|-----------|
| tdd-guide | **+0.47** | +0.12 | V1 instructions enforce explicit RED/GREEN/REFACTOR phase labels and edge case tables -- structural requirements the bare model sometimes omits |
| fastapi-pro | +0.01 | **+0.35** | V2 instructions prompted content-type checking, file size limits, and Redis-backed implementations the bare model skipped |
| research-analyst | **+0.28** | **+0.28** | Agent instructions improved structure (findings tables, recommendations sections) and actionability |

### 3. Agents Where Instructions Are Dead Weight

Six agents showed zero or negative lift from agent instructions:

| Agent | B LIFT | C LIFT | Analysis |
|-------|--------|--------|----------|
| websocket-engineer | +0.00 | +0.00 | All three conditions produced **identical outputs** -- agent instructions had literally no effect |
| incident-responder | -0.16 | -0.04 | Bare model scored a perfect 5.00 -- instructions only added noise |
| documentation-pro | -0.27 | -0.15 | Bare model was more thorough; v1 agent instructions apparently constrained output |
| security-reviewer | -0.15 | -0.04 | Bare model already excels at security review; instructions added miscalibrated severities |
| java-pro | -0.06 | -0.13 | Bare model produced stronger Java 21 idioms; agent instructions narrowed coverage |
| full-stack-developer | +0.11 | -0.15 | V2 instructions caused over-engineering (Docker Compose for "minimal" setup, weaker token strategy) |

### 4. V1 vs V2: No Meaningful Difference

Grand mean B LIFT = +0.04, Grand mean C LIFT = +0.03, C vs B = -0.00. The v2 rewrites did not improve on v1 at this performance level. In some cases v1 outperformed v2 (tdd-guide: B=5.00, C=4.65; full-stack-developer: B=4.91, C=4.65).

The prior eval showed V2 consistently beating V1 (mean V2 LIFT +1.67 vs V1 LIFT +0.67). That signal has completely vanished in the ABC eval.

### 5. Why Results Differ from Prior Eval

The prior eval and ABC eval reached opposite conclusions about agent instruction value. Three likely explanations:

1. **Baseline inflation**: The prior eval's "bare" responses appear to have been hand-crafted or idealized to represent a weaker baseline. The ABC eval used actual Opus 4.6 outputs, which are already near ceiling.
2. **Rubric sensitivity**: At the 3.0-4.0 range, structural improvements (tables, phase labels, severity ratings) produce large score jumps. At the 4.5-5.0 range, these features are already present in bare outputs, so the same improvements yield minimal gains.
3. **Task difficulty**: With 5 tasks per agent (vs 2 in prior), the ABC eval sampled more tasks where the bare model performs well, reducing the measured effect of instructions.

---

## LIFT Classification

| LIFT Range | Meaning | B (v1) Agents | C (v2) Agents |
|------------|---------|---------------|---------------|
| < 0 (harmful) | Instructions degrade output | 4 (incident-responder, security-reviewer, java-pro, documentation-pro) | 6 (code-reviewer, incident-responder, security-reviewer, java-pro, documentation-pro, full-stack-developer) |
| 0 to 0.1 (useless) | No measurable benefit | 4 (fastapi-pro, code-reviewer, websocket-engineer, go-build-resolver) | 4 (websocket-engineer, go-build-resolver, tdd-guide, dotnet-framework-pro) |
| 0.1 to 0.5 (marginal) | Small but positive | 4 (full-stack-developer, dotnet-framework-pro, research-analyst, tdd-guide) | 2 (fastapi-pro, research-analyst) |
| > 0.5 (clear value) | Strong improvement | 0 | 0 |

**Summary**: Zero agents achieve "clear value" (LIFT > 0.5) in either condition. The majority of agent instructions are useless or actively harmful when evaluated against actual Opus 4.6 outputs.

| Classification | B (v1) | C (v2) |
|---------------|--------|--------|
| Harmful (< 0) | 4 | 6 |
| Useless (0-0.1) | 4 | 4 |
| Marginal (0.1-0.5) | 4 | 2 |
| Clear value (> 0.5) | 0 | 0 |

---

## Dimension Analysis

Per-dimension means across all 60 evaluations per condition (12 agents x 5 tasks):

| Dimension | A (bare) | B (v1) | C (v2) | B LIFT | C LIFT | Notes |
|-----------|----------|--------|--------|--------|--------|-------|
| Actionability | 4.85 | 4.95 | 4.95 | +0.10 | +0.10 | Largest positive lift -- instructions add concrete recommendations |
| Efficiency | 4.43 | 4.53 | 4.50 | +0.10 | +0.07 | Instructions reduce filler slightly |
| Structure | 4.77 | 4.85 | 4.80 | +0.08 | +0.03 | V1 helps structure more than V2 |
| Completeness | 4.75 | 4.75 | 4.80 | +0.00 | +0.05 | Near zero effect |
| Precision | 4.90 | 4.92 | 4.90 | +0.02 | +0.00 | Already near ceiling; no room to improve |
| Depth | 4.72 | 4.70 | 4.68 | -0.02 | -0.03 | Instructions slightly reduce depth -- model trades depth for format compliance |

Key observations:
- **Precision** is the highest-scoring dimension (4.90) and shows zero lift -- the bare model is already maximally precise
- **Efficiency** is the lowest-scoring dimension (4.43) and shows the most room for improvement
- **Depth** slightly degrades with agent instructions -- the model may sacrifice nuanced analysis to follow structural templates
- **Actionability** shows the most consistent positive lift -- agent instructions reliably add recommendations and concrete next steps
- All lifts are small (max +0.10) -- the dimension-level data confirms the overall ceiling effect

---

## Recommendations

1. **Do not invest in agent instructions for Opus 4.6 tasks where bare model scores 4.7+.** The ROI is negative -- instructions are more likely to hurt than help at this capability level.

2. **Identify the narrow band where instructions help.** The three agents with positive lift (tdd-guide, fastapi-pro, research-analyst) share a pattern: their instructions enforce **structural requirements** (explicit phase labels, findings tables, comparison matrices) that the bare model occasionally omits. Focus instructions on structural scaffolding, not domain knowledge.

3. **Remove instructions for incident-responder, documentation-pro, and java-pro.** These agents perform strictly worse with instructions. The bare model's domain knowledge exceeds what the instructions encode.

4. **Revisit the prior eval methodology.** The prior eval's V2 LIFT of +1.67 suggested massive value from agent instructions. The ABC eval's C LIFT of +0.03 on the same 12 agents tells the opposite story. Before rewriting the remaining 98 agents, the prior eval's methodology should be audited -- specifically how "bare" responses were generated.

5. **Reserve agent instructions for weaker models.** If Sonnet or Haiku are used as the execution model (as in GLM workflows), agent instructions may provide the lift seen in the prior eval. The ceiling effect is model-capability-dependent.

6. **If keeping agent instructions, prefer v1 over v2.** V1 and V2 perform identically on average, but V1 outperforms V2 on two key agents (tdd-guide: +0.35, full-stack-developer: +0.26). V2's additional complexity provides no benefit and occasionally over-constrains the model.

7. **Invest evaluation effort in task design, not instruction tuning.** The evaluation revealed that task quality (clear ground truth with must-mention/must-not criteria and false-positive traps) is more impactful than instruction quality for differentiating model capability.

---

## Files

```
bench/eval_abc/
├── scoreboard.md                        # this file
├── code-reviewer-eval.md
├── security-reviewer-eval.md
├── incident-responder-eval.md
├── tdd-guide-eval.md
├── go-build-resolver-eval.md
├── dotnet-framework-pro-eval.md
├── websocket-engineer-eval.md
├── research-analyst-eval.md
├── full-stack-developer-eval.md
├── java-pro-eval.md
├── documentation-pro-eval.md
└── fastapi-pro-eval.md
```
