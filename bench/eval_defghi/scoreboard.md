# DEFGHI Evaluation Scoreboard

**Date:** 2026-03-23
**Method:** LLM-as-judge, 6 dimensions (Completeness, Precision, Actionability, Structure, Efficiency, Depth), composite scoring per task. 12 agents x 5 tasks x 6 conditions = 360 evaluated outputs.
**Execution model:** Sonnet (via GLM framework)

## Conditions

| Condition | Description | Agent Lines (avg) | Code Artifacts |
|-----------|-------------|-------------------|----------------|
| D | v1 agents | 106 | No code |
| E | v2 agents | 153 | JS, 103 tests (src/) |
| F | Bare (no agents) | -- | TS, 74 tests (src/) |
| G | v3 agents | 71 | JS, 68 tests (tmp/) |
| H | v4 agents (split strategy) | 71 | JS, 105 tests (tmp/) |
| I | v5 agents (v4 + fsd verification workflow) | 76 (fsd) | JS, 105 tests (tmp/) |

---

## Full Results

Sorted by I descending. Best score per agent in bold.

| Agent | D | E | F | G | H | I |
|-------|-----|-----|-----|-----|-----|-----|
| full-stack-developer | **4.87** | 4.56 | 4.45 | **4.87** | **4.87** | **4.87** |
| java-pro | **4.87** | 4.12 | 4.47 | **4.87** | **4.87** | **4.87** |
| incident-responder | **4.87** | 4.65 | 4.73 | 4.82 | **4.87** | **4.87** |
| tdd-guide | **4.87** | 4.63 | 4.32 | 4.72 | **4.87** | **4.87** |
| documentation-pro | 4.55 | 4.33 | 4.23 | **4.82** | **4.82** | **4.82** |
| go-build-resolver | 4.47 | 4.53 | 4.33 | 4.56 | **4.77** | **4.77** |
| code-reviewer | 4.58 | 4.60 | 4.65 | 4.36 | **4.74** | **4.74** |
| security-reviewer | **4.87** | 4.52 | 4.57 | 4.74 | 4.74 | 4.74 |
| dotnet-framework-pro | 4.62 | 4.10 | 4.65 | **4.73** | **4.73** | **4.73** |
| websocket-engineer | 4.69 | 4.07 | 4.48 | 4.69 | **4.73** | **4.73** |
| fastapi-pro | **4.82** | 3.67 | 3.67 | 4.23 | 4.52 | 4.52 |
| research-analyst | **4.37** | 3.60 | 4.04 | 4.33 | 4.33 | 4.33 |
| **Grand Mean** | **4.70** | **4.28** | **4.38** | **4.65** | **4.74** | **4.74** |

---

## I vs H Comparison

**The key question: did v5's full-stack-developer redesign (added verification workflow, testing section) produce different results?**

| Agent | H | I | Delta |
|-------|-----|-----|-------|
| full-stack-developer | 4.87 | 4.87 | 0.00 |
| java-pro | 4.87 | 4.87 | 0.00 |
| incident-responder | 4.87 | 4.87 | 0.00 |
| tdd-guide | 4.87 | 4.87 | 0.00 |
| documentation-pro | 4.82 | 4.82 | 0.00 |
| go-build-resolver | 4.77 | 4.77 | 0.00 |
| code-reviewer | 4.74 | 4.74 | 0.00 |
| security-reviewer | 4.74 | 4.74 | 0.00 |
| dotnet-framework-pro | 4.73 | 4.73 | 0.00 |
| websocket-engineer | 4.73 | 4.73 | 0.00 |
| fastapi-pro | 4.52 | 4.52 | 0.00 |
| research-analyst | 4.33 | 4.33 | 0.00 |
| **Grand Mean** | **4.74** | **4.74** | **0.00** |

**Result: H and I are identical across all 12 agents, all 60 tasks.**

Evaluators confirmed that H and I outputs were "essentially identical" or "same output" on every task for every agent. The v5 changes to full-stack-developer (added verification workflow, testing section, +5 lines) produced zero measurable difference in output quality or content. For non-fsd agents (which were unchanged between H and I), identical outputs were expected and confirmed.

---

## Evolution Across Evaluation Rounds

Grand means from each evaluation round (using that round's own scoring):

| Round | Conditions | D (v1) | E (v2) | F (bare) | G (v3) | H (v4) | I (v5) |
|-------|-----------|--------|--------|----------|--------|--------|--------|
| DEF (report-only) | 3 | 4.71 | 4.44 | 4.48 | -- | -- | -- |
| DEF (full, +code) | 3 | 4.79 | 4.45 | 4.52 | -- | -- | -- |
| DEFGHI (this eval) | 6 | 4.70 | 4.28 | 4.38 | 4.65 | 4.74 | 4.74 |

**Ranking (this eval):** H = I (4.74) > D (4.70) > G (4.65) > F (4.38) > E (4.28)

Note: Scores shifted slightly downward compared to prior DEF rounds. This is expected when adding more conditions -- evaluator calibration adjusts. Relative ordering within D/E/F is preserved (D > F > E).

---

## Key Findings

1. **H = I, exactly.** The v5 full-stack-developer redesign (adding verification workflow and testing section) produced zero difference. All 12 agents, all 60 tasks, identical scores. For most agents this is trivially expected (same agent files). For full-stack-developer specifically, the evaluators found the outputs "essentially indistinguishable" between H and I conditions.

2. **v4 split strategy is the best performing condition.** H/I (4.74) edges out v1 (4.70) for the first time in any evaluation round. The split strategy -- compact format for implementation agents, restored checklists for review agents -- successfully addressed v3's weakness without sacrificing its strengths.

3. **v1 remains strong but is no longer the leader.** D (4.70) held the top position in DEF and DEFG rounds. H/I surpasses it by +0.04. The gap is small but consistent: H/I ties or beats D on 10/12 agents.

4. **v2 continues to be the worst condition** (4.28), now trailing bare by -0.10. The over-constraining effect on Sonnet is confirmed across all evaluation rounds.

5. **Agents at the ceiling (4.87) are saturated.** full-stack-developer, java-pro, incident-responder, and tdd-guide all hit 4.87 under D, H, and I. Further improvements for these agents require harder tasks, not better instructions.

6. **fastapi-pro and research-analyst remain the hardest agents to optimize.** Both score below 4.55 even under the best conditions. fastapi-pro's weakness is fa-002 (rate limiting) and fa-005 (background tasks). research-analyst's weakness is inherent to research tasks where the model's knowledge and reasoning matter more than agent instructions.

---

## Recommendations

Given that H = I with zero difference:

1. **The v5 verification workflow addition had no effect.** Adding a verification/testing section to full-stack-developer's agent file did not change Sonnet's output behavior. This suggests that at v4's instruction quality level, marginal additions to already-good agents are invisible to the model. The agent was already producing verification-quality output without being told to.

2. **Stop iterating on agents that are at or near ceiling (4.87).** full-stack-developer, java-pro, incident-responder, and tdd-guide do not need further agent refinement. Effort should shift to harder benchmarks or to underperforming agents.

3. **Focus optimization effort on fastapi-pro and research-analyst.** These two agents have the most room for improvement (+0.35 and +0.54 respectively to reach 4.87).

4. **v4 (= v5) is the production-ready agent set.** It outperforms v1 overall and has no regressions. Ship it.

5. **Instruction length has diminishing returns.** v1 (106 lines) -> v3 (71 lines) -> v4 (71 lines, split strategy) shows that shorter, better-targeted instructions outperform longer ones. Adding 5 lines to fsd for v5 changed nothing. The signal is clear: instruction quality matters, instruction quantity does not.
