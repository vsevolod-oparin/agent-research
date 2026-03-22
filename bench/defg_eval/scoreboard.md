# Agent Eval Scoreboard -- D / E / F / G Conditions (FULL Eval)

**Date:** 2026-03-23
**Model:** Sonnet (via GLM agent framework)
**Method:** LLM-as-judge, 6 dimensions (Completeness, Precision, Actionability, Structure, Efficiency, Depth)
**Protocol:** FULL eval including code artifacts on disk
**Total outputs scored:** 240 (12 agents x 5 tasks x 4 conditions)

**Conditions:**
- **D** = v1 agents (current/old agent descriptions from `.claude/agents/`)
- **E** = v2 agents (rewritten -- over-constrained, compressed output, killed Depth; see `tooling/agent_v1_v2_findings.md`)
- **F** = bare (no agent descriptions at all)
- **G** = v3 agents (compact redesign: v1's freedom + v2's precision elements, ~71 lines avg; see `agents_v3/`)

---

## Full Results Table

Sorted by G score descending. **Bold** marks the best condition per agent.

| Agent | D | E | F | G |
|-------|-----|-----|-----|-----|
| documentation-pro | 4.83 | 4.48 | 4.29 | **4.87** |
| full-stack-developer | **4.87** | 4.45 | 4.49 | **4.87** |
| fastapi-pro | 4.81 | 3.83 | 3.88 | **4.84** |
| incident-responder | **5.00** | 4.76 | 4.81 | 4.84 |
| java-pro | **4.87** | 4.35 | 4.65 | 4.84 |
| security-reviewer | **4.91** | 4.43 | 4.56 | 4.84 |
| tdd-guide | **4.80** | 4.57 | 4.43 | 4.73 |
| dotnet-framework-pro | 4.79 | 4.31 | **4.81** | 4.71 |
| websocket-engineer | **4.87** | 4.42 | 4.84 | 4.68 |
| go-build-resolver | 4.63 | **4.71** | 4.63 | 4.65 |
| research-analyst | **4.65** | 4.09 | **4.65** | 4.44 |
| code-reviewer | **4.60** | 4.40 | 4.17 | 4.17 |
| **Grand Mean** | **4.80** | **4.40** | **4.52** | **4.71** |

---

## G Analysis

### G's rank position per agent

| Agent | G Rank | G Score | Best Cond | Best Score | G - D |
|-------|--------|---------|-----------|------------|-------|
| documentation-pro | 1st | 4.87 | G | 4.87 | +0.04 |
| fastapi-pro | 1st | 4.84 | G | 4.84 | +0.03 |
| full-stack-developer | 2nd (tied 1st) | 4.87 | D/G tied | 4.87 | +0.00 |
| java-pro | 2nd | 4.84 | D | 4.87 | -0.03 |
| go-build-resolver | 2nd | 4.65 | E | 4.71 | +0.02 |
| tdd-guide | 2nd | 4.73 | D | 4.80 | -0.07 |
| security-reviewer | 2nd | 4.84 | D | 4.91 | -0.07 |
| incident-responder | 2nd | 4.84 | D | 5.00 | -0.16 |
| dotnet-framework-pro | 3rd | 4.71 | F | 4.81 | -0.08 |
| websocket-engineer | 3rd | 4.68 | D | 4.87 | -0.19 |
| research-analyst | 3rd | 4.44 | D/F tied | 4.65 | -0.21 |
| code-reviewer | 4th | 4.17 | D | 4.60 | -0.43 |

**Rank distribution:** 1st on 2 agents, 2nd on 6 agents, 3rd on 3 agents, 4th on 1 agent.

### G vs D: statistical comparison

| Metric | Value |
|--------|-------|
| G Grand Mean | 4.71 |
| D Grand Mean | 4.80 |
| Gap (G - D) | -0.09 |
| G beats D (>0.05 margin) | 0 of 12 agents |
| D beats G (>0.05 margin) | 7 of 12 agents |
| Tied (within 0.05) | 5 of 12 agents |

G and D are **not** statistically tied. D leads by 0.09 on the grand mean, and D strictly beats G on 7 agents with G never strictly beating D on any agent. The gap is modest but consistent -- D dominates.

**Where G ties D:** documentation-pro (+0.04), fastapi-pro (+0.03), go-build-resolver (+0.02), full-stack-developer (+0.00), java-pro (-0.03). These are all within noise.

**Where D beats G:** code-reviewer (-0.43), research-analyst (-0.21), websocket-engineer (-0.19), incident-responder (-0.16), dotnet-framework-pro (-0.08), security-reviewer (-0.07), tdd-guide (-0.07). The code-reviewer gap is notably large.

### G's profile: what does it look like?

G's output characteristics suggest a **v1/v3 hybrid or refined v1 profile**, not v2 or bare:

1. **G is much closer to D than to E or F.** G (4.71) sits between D (4.80) and F (4.52), but much closer to D. E (4.40) is the farthest.

2. **G never collapses like E.** E's worst scores (fastapi-pro 3.83, research-analyst 4.09) show the over-constraining effect of v2. G never drops below 4.17, maintaining D-like consistency.

3. **G shows D-like depth and completeness.** The eval notes repeatedly cite G producing comprehensive outputs with detailed explanations, multiple approaches, and strong coverage of ground-truth items -- consistent with v1 or v3 (which was designed to combine v1's thoroughness with v2's precision improvements).

4. **G is occasionally verbose.** Several tasks note G as "most verbose" or "very thorough but lengthy," earning Efficiency scores of 3-4. This is a v1 trait, not v2 (which scored Efficiency ~5.0).

5. **G produces code artifacts.** G had runnable tests on disk (68 passing tests in tmp/), similar to E's JS suite. This is a code-generation behavior not present in D (markdown only).

6. **G's code-reviewer and research-analyst scores are lower.** These are the two agents where G looks least like v1. The code-reviewer gap (-0.43) is the largest in the dataset, suggesting G may have used a different approach for review tasks versus implementation tasks.

**Confirmed:** G used v3 agents. The profile matches the design intent: v1-like depth (no rigid output templates) combined with v2's precision elements (anti-patterns, false positive lists) in a compact 71-line avg format.

---

## Comparison with Prior DEF Eval

Side-by-side of per-agent means: prior DEF eval (`bench/eval_def_full/scoreboard.md`, 2026-03-22) vs this DEFG eval.

| Agent | D prior | D new | D delta | E prior | E new | E delta | F prior | F new | F delta |
|-------|---------|-------|---------|---------|-------|---------|---------|-------|---------|
| code-reviewer | 4.75 | 4.60 | -0.15 | 4.79 | 4.40 | -0.39 | 4.83 | 4.17 | -0.66 |
| documentation-pro | 4.71 | 4.83 | +0.12 | 4.76 | 4.48 | -0.28 | 4.47 | 4.29 | -0.18 |
| dotnet-framework-pro | 4.78 | 4.79 | +0.01 | 4.27 | 4.31 | +0.04 | 4.79 | 4.81 | +0.02 |
| fastapi-pro | 4.76 | 4.81 | +0.05 | 3.72 | 3.83 | +0.11 | 3.87 | 3.88 | +0.01 |
| full-stack-developer | 4.79 | 4.87 | +0.08 | 4.16 | 4.45 | +0.29 | 4.37 | 4.49 | +0.12 |
| go-build-resolver | 4.67 | 4.63 | -0.04 | 4.55 | 4.71 | +0.16 | 4.45 | 4.63 | +0.18 |
| incident-responder | 4.87 | 5.00 | +0.13 | 4.90 | 4.76 | -0.14 | 4.89 | 4.81 | -0.08 |
| java-pro | 4.87 | 4.87 | +0.00 | 4.40 | 4.35 | -0.05 | 4.45 | 4.65 | +0.20 |
| research-analyst | 4.72 | 4.65 | -0.07 | 4.04 | 4.09 | +0.05 | 4.57 | 4.65 | +0.08 |
| security-reviewer | 4.82 | 4.91 | +0.09 | 4.61 | 4.43 | -0.18 | 4.68 | 4.56 | -0.12 |
| tdd-guide | 4.84 | 4.80 | -0.04 | 4.83 | 4.57 | -0.26 | 4.37 | 4.43 | +0.06 |
| websocket-engineer | 4.87 | 4.87 | +0.00 | 4.40 | 4.42 | +0.02 | 4.53 | 4.84 | +0.31 |
| **Grand Mean** | **4.79** | **4.80** | **+0.01** | **4.45** | **4.40** | **-0.05** | **4.52** | **4.52** | **+0.00** |

### Did D/E/F scores change with the addition of G?

**D: stable** (+0.01 grand mean). No systematic shift. Individual movements are within judge variance.

**E: slight decline** (-0.05 grand mean). Code-reviewer (-0.39) and tdd-guide (-0.26) dropped notably. The presence of G's strong outputs may have recalibrated the judge's expectations downward for E.

**F: stable** (+0.00 grand mean). Code-reviewer dropped sharply (-0.66) but websocket-engineer rose (+0.31). Net effect is zero.

**Largest movements:** code-reviewer saw all three prior conditions drop (D -0.15, E -0.39, F -0.66). This is the most affected agent -- the 4-condition eval appears to have been harsher on code-reviewer across the board. This may reflect task-level variance (different task instantiations) rather than a G calibration effect.

---

## LIFT Classification

Using D as baseline (the consistent leader across both evaluations).

| LIFT Range | Meaning | E (count) | F (count) | G (count) |
|------------|---------|-----------|-----------|-----------|
| < 0 (harmful) | Scored lower than D | **11** | **9** | **8** |
| 0 to 0.1 (negligible) | Trivial improvement | **1**: go-build-resolver (+0.08) | **3**: dotnet-framework-pro (+0.02), go-build-resolver (+0.00), research-analyst (+0.00) | **4**: documentation-pro (+0.04), fastapi-pro (+0.03), go-build-resolver (+0.02), full-stack-developer (+0.00) |
| 0.1 to 0.5 (marginal) | Modest improvement | **0** | **0** | **0** |
| >= 0.5 (clear value) | Strong improvement | **0** | **0** | **0** |

### LIFT detail (harmful agents, sorted by magnitude)

**E harmful (11):** fastapi-pro (-0.98), research-analyst (-0.56), java-pro (-0.52), dotnet-framework-pro (-0.48), security-reviewer (-0.48), websocket-engineer (-0.45), full-stack-developer (-0.42), documentation-pro (-0.35), incident-responder (-0.24), tdd-guide (-0.23), code-reviewer (-0.20)

**F harmful (9):** fastapi-pro (-0.93), documentation-pro (-0.54), code-reviewer (-0.43), full-stack-developer (-0.38), tdd-guide (-0.37), security-reviewer (-0.35), java-pro (-0.22), incident-responder (-0.19), websocket-engineer (-0.03)

**G harmful (8):** code-reviewer (-0.43), research-analyst (-0.21), websocket-engineer (-0.19), incident-responder (-0.16), dotnet-framework-pro (-0.08), security-reviewer (-0.07), tdd-guide (-0.07), java-pro (-0.03)

No condition achieves marginal or clear-value LIFT over D for any agent. G has the fewest harmful agents (8 vs 9 for F and 11 for E) and the shallowest average harm.

---

## Key Findings

### 1. D remains the overall leader, G is a strong second

D (4.80) leads all conditions. G (4.71) finishes second, ahead of F (4.52) and E (4.40). The D-G gap of 0.09 is the smallest gap between D and any other condition, making G the closest challenger to D across both the prior DEF and current DEFG evaluations.

### 2. G outperforms E and F convincingly

G beats E by +0.31 and F by +0.19 on grand mean. G outperforms E on 11 of 12 agents (exception: go-build-resolver where E leads by 0.06). G outperforms F on 9 of 12 agents (exceptions: dotnet-framework-pro, websocket-engineer, research-analyst).

### 3. G's strength is in implementation tasks

G's best showings are on implementation-heavy agents: fastapi-pro (4.84, tied 1st), full-stack-developer (4.87, tied 1st), documentation-pro (4.87, 1st), java-pro (4.84, close 2nd). G produces thorough, well-structured implementations with code artifacts, design rationale tables, and production considerations.

### 4. G's weakness is in review/analysis tasks

G's worst relative performances are code-reviewer (4th place, -0.43 vs D), research-analyst (3rd place, -0.21 vs D), and websocket-engineer (3rd place, -0.19 vs D). For code-reviewer specifically, G and F scored identically (4.17), the lowest scores for any agent-condition pair among D/G. G's code reviews showed severity misclassification patterns (race condition at HIGH instead of CRITICAL, method check at MEDIUM).

### 5. E remains the weakest condition

E (4.40) finishes last again, consistent with the v2 over-constraining finding. E's worst scores are fastapi-pro (3.83), research-analyst (4.09), and dotnet-framework-pro (4.31). The v2 agents compress Sonnet's output too aggressively, sacrificing Depth and Completeness for Efficiency -- a tradeoff the rubric does not reward.

### 6. The prior DEF scores are broadly stable

Adding G to the evaluation did not systematically shift D, E, or F scores. The grand means moved by +0.01, -0.05, and +0.00 respectively. The largest individual movement (code-reviewer F: -0.66) likely reflects task variance rather than a calibration effect.

### 7. No condition achieves positive LIFT over D

Across all 36 agent-condition pairs (12 agents x 3 non-D conditions), zero achieve marginal or clear-value LIFT. G comes closest with 4 agents in the negligible range (0 to +0.1) and only 8 in the harmful range (vs 9 for F and 11 for E).

---

## Recommendations

1. **D remains the default choice.** v1 agents continue to outperform all alternatives. D's depth, completeness, and consistent quality are unmatched.

2. **G warrants investigation for implementation tasks.** G ties or marginally beats D on 5 implementation-heavy agents. If G used v3 agents, this suggests v3 is a viable successor for code-generation tasks specifically.

3. **G needs improvement on review tasks.** The code-reviewer (-0.43) and research-analyst (-0.21) gaps are meaningful. Whatever G used for review tasks underperformed both D and F. Severity calibration and analytical depth need attention.

4. **E should be deprecated.** E finishes last on 8 of 12 agents and has the widest gap to D (-0.40). The v2 over-constraining problem is confirmed across both DEF and DEFG evaluations.

5. **G is confirmed as v3.** The review-task weakness (code-reviewer -0.43, research-analyst -0.21) is a v3 design issue, not an artifact. V3's compact review agents may have cut too much from v1's detailed checklists (v1 code-reviewer: 122 lines vs v3: 75 lines). Consider restoring v1's full review checklist detail in v3 review agents while keeping v3's compact format for implementation agents.

6. **fastapi-pro remains the most condition-sensitive agent.** The spread from best (G: 4.84) to worst (E: 3.83) is 1.01 -- the largest for any agent. E and F both produce shallow FastAPI implementations lacking Redis backends and comprehensive tests. Only D and G consistently deliver production-grade FastAPI code.

7. **Consider separate agent strategies by task type.** The data suggests implementation tasks and review tasks may benefit from different agent configurations. G excels at the former; D excels at both but especially the latter.
