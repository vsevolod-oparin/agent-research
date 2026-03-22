# Agent Eval Scoreboard -- D / E / F / G / H Conditions (FULL Eval)

**Date:** 2026-03-23
**Model:** Sonnet (via GLM agent framework)
**Method:** LLM-as-judge, 6 dimensions (Completeness, Precision, Actionability, Structure, Efficiency, Depth)
**Protocol:** FULL eval including code artifacts on disk
**Total outputs scored:** 300 (12 agents x 5 tasks x 5 conditions)

**Conditions:**
- **D** = v1 agents (current/old, 106 lines avg)
- **E** = v2 agents (over-constrained, 153 lines avg)
- **F** = bare (no agents)
- **G** = v3 agents (compact redesign, 71 lines avg)
- **H** = v4 agents (split strategy: v3 base + restored review checklists, 71 lines avg)

**Code artifacts:**
- D = no code (markdown reports only)
- E = JS, 103 tests (src/)
- F = TS, 74 tests (src/)
- G = JS, 68 tests (tmp/)
- H = JS, 105 tests (tmp/)

---

## Full Results Table

Sorted by H score descending. **Bold** = best condition per agent.

| Agent | D | E | F | G | H |
|-------|-----|-----|-----|-----|-----|
| incident-responder | **4.87** | 4.56 | 4.84 | **4.87** | **4.87** |
| tdd-guide | **4.87** | 4.33 | 4.16 | 4.63 | **4.87** |
| code-reviewer | 4.60 | 4.65 | 4.67 | 4.27 | **4.78** |
| documentation-pro | 4.73 | 4.52 | 4.37 | **4.80** | 4.77 |
| java-pro | **4.84** | 4.49 | 4.55 | 4.74 | 4.76 |
| dotnet-framework-pro | 4.75 | 4.17 | 4.80 | **4.84** | 4.73 |
| go-build-resolver | 4.69 | 4.71 | 4.64 | **4.87** | 4.73 |
| websocket-engineer | **4.87** | 4.17 | 4.69 | 4.84 | 4.73 |
| security-reviewer | **4.82** | 4.48 | 4.55 | 4.72 | 4.72 |
| full-stack-developer | **4.87** | 4.64 | 4.39 | 4.84 | 4.70 |
| fastapi-pro | **4.72** | 3.85 | 3.89 | 4.45 | 4.69 |
| research-analyst | **4.69** | 3.96 | **4.69** | 4.65 | 4.61 |
| **Grand Mean** | **4.78** | 4.38 | 4.52 | 4.71 | 4.75 |

---

## H vs G Comparison

H (v4) is an iteration on G (v3). The "split strategy": keep v3's compact format for implementation agents, but restore v1-era review checklists for code-reviewer and security-reviewer, plus add minimal anti-hallucination rules for research-analyst.

### Where H improved over G

| Agent | G | H | Delta | Notes |
|-------|-----|-----|-------|-------|
| code-reviewer | 4.27 | 4.78 | **+0.51** | Largest gain. Restored severity calibration + domain checklists fixed G's severity miscalibration |
| tdd-guide | 4.63 | 4.87 | **+0.24** | Restored TDD process emphasis. H produced 105 tests vs G's 68 |
| fastapi-pro | 4.45 | 4.69 | **+0.24** | Better depth on production patterns (Redis Lua scripts, lifespan shutdown) |
| java-pro | 4.74 | 4.76 | +0.02 | Marginal. H added pattern matching coverage in jp-001 |

### Where H regressed vs G

| Agent | G | H | Delta | Notes |
|-------|-----|-----|-------|-------|
| full-stack-developer | 4.84 | 4.70 | **-0.14** | H consistently scored lower on Efficiency (3/5 on most tasks due to verbosity) |
| go-build-resolver | 4.87 | 4.73 | **-0.14** | Same pattern: H is more verbose, lower Efficiency scores |
| dotnet-framework-pro | 4.84 | 4.73 | **-0.11** | Verbosity penalty. G was more balanced |
| websocket-engineer | 4.84 | 4.73 | **-0.11** | Verbosity again |
| research-analyst | 4.65 | 4.61 | -0.04 | Essentially flat. Anti-hallucination rules didn't help much |
| documentation-pro | 4.80 | 4.77 | -0.03 | Negligible |

### Tied

| Agent | G | H |
|-------|-----|-----|
| incident-responder | 4.87 | 4.87 |
| security-reviewer | 4.72 | 4.72 |

### Did the split strategy work?

**Partially.** The targeted fix for code-reviewer was a clear success (+0.51, the largest single-agent improvement in the entire evaluation history). tdd-guide also benefited significantly (+0.24). However, the strategy introduced a **verbosity problem**: H consistently scored 3/5 on Efficiency for implementation agents where G scored 4/5. This created a drag that offset the review-agent gains. The research-analyst minimal intervention (-0.04) was essentially a wash -- neither helping nor hurting.

**Net effect:** H grand mean (4.75) vs G grand mean (4.71) = **+0.04**. A modest improvement driven almost entirely by code-reviewer and tdd-guide.

---

## H vs D Comparison

Did v4 finally beat v1?

**No. D still leads: 4.78 vs 4.75 (delta = -0.03).**

### Per-agent wins and losses

| Agent | D | H | Delta | Winner |
|-------|-----|-----|-------|--------|
| code-reviewer | 4.60 | 4.78 | +0.18 | **H** |
| documentation-pro | 4.73 | 4.77 | +0.04 | **H** |
| go-build-resolver | 4.69 | 4.73 | +0.04 | **H** |
| incident-responder | 4.87 | 4.87 | 0.00 | Tie |
| tdd-guide | 4.87 | 4.87 | 0.00 | Tie |
| dotnet-framework-pro | 4.75 | 4.73 | -0.02 | D |
| fastapi-pro | 4.72 | 4.69 | -0.03 | D |
| java-pro | 4.84 | 4.76 | -0.08 | D |
| research-analyst | 4.69 | 4.61 | -0.08 | D |
| security-reviewer | 4.82 | 4.72 | -0.10 | D |
| websocket-engineer | 4.87 | 4.73 | -0.14 | D |
| full-stack-developer | 4.87 | 4.70 | -0.17 | **D** |

**Record: H wins 3, D wins 7, Ties 2.**

### Where each excels

**H beats D on:** review tasks where restored checklists matter (code-reviewer +0.18), documentation tasks (documentation-pro +0.04), and Go diagnostics (go-build-resolver +0.04). H's code-reviewer is the best code-reviewer across all conditions -- the only agent where H holds the outright best score.

**D beats H on:** implementation-heavy agents that benefit from D's natural verbosity without Efficiency penalty. full-stack-developer (-0.17), websocket-engineer (-0.14), and security-reviewer (-0.10) are the largest D advantages. D's outputs tend to be longer but more thorough, and crucially D does not get penalized on Efficiency the way H does -- because D never produced code artifacts, it was scored on markdown quality alone.

---

## LIFT Classification

Using D (v1) as baseline. Ranges: Large negative (< -0.30), Small negative (-0.30 to -0.06), Neutral (-0.05 to +0.05), Small positive (+0.06 to +0.29), Large positive (> +0.30).

| LIFT Range | E (v2) | F (bare) | G (v3) | H (v4) |
|------------|--------|----------|--------|--------|
| Large negative (< -0.30) | 8 | 4 | 1 | 0 |
| Small negative (-0.30 to -0.06) | 2 | 4 | 4 | 5 |
| Neutral (-0.05 to +0.05) | 1 | 3 | 4 | 6 |
| Small positive (+0.06 to +0.29) | 1 | 1 | 3 | 1 |
| Large positive (> +0.30) | 0 | 0 | 0 | 0 |

**Key observation:** H eliminated all large-negative outcomes (E had 8, F had 4, G had 1). H's distribution is tightly clustered around neutral-to-small-negative, meaning no agent is badly harmed by v4 instructions. However, H also has only 1 small-positive agent (code-reviewer), showing limited upside beyond parity with D.

---

## Evolution Table

Grand means across all evaluation rounds:

| Eval | D (v1) | E (v2) | F (bare) | G (v3) | H (v4) |
|------|--------|--------|----------|--------|--------|
| DEF report-only | 4.79 | 4.44 | 4.48 | -- | -- |
| DEF full (code artifacts) | 4.79 | 4.45 | 4.52 | -- | -- |
| DEFG full | 4.80 | 4.40 | 4.52 | 4.71 | -- |
| DEFGH full (this eval) | 4.78 | 4.38 | 4.52 | 4.71 | 4.75 |

**Trajectory:**
- D has been remarkably stable across all evaluations (4.78-4.80)
- E has been remarkably stable in its underperformance (4.38-4.45)
- F is rock-steady at 4.48-4.52
- G: 4.71 in both evaluations
- H: 4.75 -- the closest any condition has come to D

---

## Key Findings

1. **The verbosity tax is real and consistent.** H's primary failure mode is Efficiency scores of 3/5 on implementation agents. This is a systematic penalty: when agents produce code artifacts AND detailed markdown, the total output becomes "very verbose" in the judge's assessment. D avoided this entirely because it produced no code artifacts. This creates an asymmetric comparison -- D gets 4/5 Efficiency for thorough markdown, while H gets 3/5 Efficiency for equally thorough markdown plus working code.

2. **Code-reviewer is the success story.** H's code-reviewer (4.78) is the best code-reviewer across all 5 conditions and all prior evaluations. The restored domain checklists (React patterns, Node.js patterns, performance patterns) genuinely help Sonnet calibrate severity labels and avoid the merging/underrating behaviors seen in G. This validates the v3 diagnosis: review agents need domain-specific checklists.

3. **The research-analyst problem persists.** D (4.69), F (4.69), G (4.65), H (4.61) -- all within 0.08 of each other. Agent instructions neither help nor hurt on research tasks. The bare model ties v1. Research quality appears to be model-intrinsic, not instruction-driven.

4. **Implementation agents have a ceiling around 4.73-4.87.** All conditions converge for implementation agents (fastapi-pro, java-pro, dotnet-framework-pro, go-build-resolver). The differences are small and often come down to verbosity-vs-thoroughness tradeoffs rather than fundamental quality differences.

5. **D's resilience is structural, not incidental.** V1 agents were written without optimization pressure. Their length (106 lines) happens to be in a sweet spot: enough context to help Sonnet, short enough to not over-constrain. Every redesign attempt (v2 at 153 lines, v3 at 71 lines, v4 at 71 lines) has failed to beat this accidental optimum on aggregate.

6. **H eliminated catastrophic failures.** No agent under H scored below 4.61. Under G, code-reviewer hit 4.27. Under E, fastapi-pro hit 3.85 and research-analyst hit 3.96. H's floor is higher even if its ceiling isn't.

---

## Recommendations

1. **Accept D as production baseline.** Four iterations of redesign have not beaten v1 on aggregate. The marginal gains from H (+0.04 over G, -0.03 vs D) do not justify the engineering effort of further iteration.

2. **Cherry-pick H's code-reviewer.** H's code-reviewer (4.78) is strictly better than D's (4.60). Replace D's code-reviewer with H's. This is the one clear, validated improvement from the v4 effort.

3. **Consider cherry-picking H's tdd-guide.** H ties D at 4.87 but produces 105 working tests vs D's markdown-only output. If code artifact production matters, H's tdd-guide is preferable.

4. **Stop optimizing research-analyst.** Four conditions produce essentially identical results (4.61-4.69). The bare model ties v1. Research quality is model-intrinsic. Either accept the current level or explore fundamentally different approaches (tool use, web search integration, retrieval augmentation) rather than prompt engineering.

5. **Investigate the verbosity tax.** H's systematic Efficiency penalty (3/5 on implementation agents) may be an artifact of the evaluation rubric rather than a real quality problem. If producing working code is more valuable than concise markdown, the rubric should be adjusted to not penalize thoroughness when it comes with executable artifacts. A rubric recalibration could flip H vs D.

6. **Final recommended agent set:**
   - code-reviewer: **H (v4)** -- validated improvement
   - tdd-guide: **H (v4)** -- ties D with better code artifacts
   - All others: **D (v1)** -- still the aggregate leader
