# Scoreboard: DEFILMNO Evaluation

**Date:** 2026-03-23
**Method:** LLM-as-judge, 6 dimensions (Precision, Completeness, Actionability, Structure, Efficiency, Depth), composite scoring per task
**Outputs:** 480 (12 agents x 5 tasks x 8 conditions)

**Conditions:**

| Code | Description | Code Artifacts |
|------|------------|----------------|
| D | v1 agents (hand-written, 106 lines avg) | None |
| E | v2 agents (hand-written, over-constrained, 153 lines avg) | JS 103 tests |
| F | bare (no agents) | TS 74 tests |
| I | v4/v5-partial agents (hand-written, 71 lines avg) | JS 105 tests |
| L | **agent-creator round 1** — initial rewrite by plugin | None |
| M | **agent-creator round 2** — targeted improvements after audit | None |
| N | **agent-creator round 3** — polish after audit | JS 61 tests |
| O | **agent-creator round 4** — final polish after audit | JS 67 tests |

L/M/N/O were produced by consecutive runs of the agent-creator plugin, each followed by an audit (see `tooling/claude-creator-post{1,2,3,4}-audit.md`).

---

## Full Results Table

Sorted by agent grand mean (descending). **Bold** = best score per agent row.

| Agent | D | E | F | I | L | M | N | O | Mean |
|-------|-----|-----|-----|-----|-----|-----|-----|-----|------|
| incident-responder | **4.87** | **4.87** | 4.82 | 4.60 | **4.87** | 4.84 | 4.82 | **4.87** | 4.820 |
| tdd-guide | **4.87** | 4.60 | 4.82 | **4.87** | **4.87** | **4.87** | 4.63 | 4.60 | 4.766 |
| security-reviewer | 4.82 | 4.41 | 4.65 | 4.84 | **4.87** | **4.87** | 4.65 | **4.87** | 4.748 |
| full-stack-developer | **4.83** | 4.47 | 4.47 | 4.62 | 4.76 | 4.63 | 4.82 | 4.82 | 4.678 |
| java-pro | **4.87** | 4.24 | 4.52 | 4.63 | 4.71 | 4.62 | 4.62 | 4.65 | 4.607 |
| websocket-engineer | **4.73** | 4.43 | 4.58 | 4.60 | 4.60 | 4.60 | 4.60 | 4.60 | 4.592 |
| documentation-pro | 4.67 | 4.43 | 4.44 | 4.55 | 4.55 | 4.62 | 4.68 | **4.75** | 4.586 |
| dotnet-framework-pro | 4.60 | 4.33 | 4.64 | 4.60 | 4.57 | 4.61 | **4.65** | 4.60 | 4.575 |
| code-reviewer | 4.62 | 4.40 | 4.72 | **4.87** | 4.76 | 4.35 | 4.24 | 4.36 | 4.540 |
| go-build-resolver | 4.57 | 4.37 | 4.37 | **4.60** | 4.51 | 4.40 | 4.47 | 4.40 | 4.461 |
| fastapi-pro | 4.40 | 4.28 | 4.17 | 4.52 | 4.49 | 4.49 | 4.28 | **4.71** | 4.418 |
| research-analyst | 4.34 | 4.07 | 4.28 | 4.32 | **4.37** | **4.37** | **4.37** | **4.37** | 4.311 |

---

## Grand Mean

| D | E | F | I | L | M | N | O | Overall |
|-----|-----|-----|-----|-----|-----|-----|-----|---------|
| 4.683 | 4.408 | 4.540 | 4.635 | 4.661 | 4.606 | 4.569 | 4.633 | 4.592 |

---

## Condition Rankings

| Rank | Condition | Grand Mean | Delta from #1 |
|------|-----------|-----------|---------------|
| 1 | **D** (v1 agents) | **4.683** | -- |
| 2 | **L** (unknown) | **4.661** | -0.022 |
| 3 | **I** (v4/v5-partial) | **4.635** | -0.048 |
| 4 | **O** (unknown) | **4.633** | -0.050 |
| 5 | **M** (unknown) | **4.606** | -0.077 |
| 6 | **N** (unknown) | **4.569** | -0.114 |
| 7 | **F** (bare) | **4.540** | -0.143 |
| 8 | **E** (v2 agents) | **4.408** | -0.275 |

---

## New Conditions Analysis (L, M, N, O)

### Overview

All four new conditions outperform bare (F = 4.540) and v2 (E = 4.408). Three of the four (L, M, O) are competitive with v1 (D = 4.683), with L coming closest (gap of only 0.022).

| Condition | Grand Mean | vs D (v1) | vs F (bare) | vs I (v4/v5) | Agent Wins |
|-----------|-----------|-----------|-------------|--------------|------------|
| L | 4.661 | -0.022 | +0.121 | +0.026 | Best on 3 agents |
| O | 4.633 | -0.050 | +0.093 | -0.002 | Best on 3 agents |
| M | 4.606 | -0.077 | +0.066 | -0.029 | Best on 3 agents |
| N | 4.569 | -0.114 | +0.029 | -0.066 | Best on 1 agent |

### Condition L

**Grand mean: 4.661 (rank #2)** -- The strongest new condition and closest competitor to D (v1).

**Closest to:** D (v1 agents). Gap of only 0.022. L and D share the same profile: strong across review, analysis, and implementation tasks.

**Strengths:**
- Ties D at the top on incident-responder (4.87), tdd-guide (4.87), security-reviewer (4.87)
- Strongest new condition on java-pro (4.71) and full-stack-developer (4.76)
- No code artifacts but produces the most output (9671 lines) -- thorough, detailed responses
- Consistent: no agent score below 4.37

**Weaknesses:**
- Slightly behind D on java-pro (4.71 vs 4.87, gap = 0.16)
- No code artifacts produced, which may matter for tasks requiring executable output

### Condition M

**Grand mean: 4.606 (rank #5)**

**Closest to:** I (v4/v5-partial agents). Nearly identical profiles on most agents; M = 4.606 vs I = 4.635.

**Strengths:**
- Ties for best on tdd-guide (4.87), security-reviewer (4.87), research-analyst (4.37)
- Strong on incident-responder (4.84)
- Confidence labels (CONFIRMED/LIKELY/POSSIBLE) add rigor to review tasks
- No code artifacts but substantial output (7785 lines)

**Weaknesses:**
- Worst score on code-reviewer (4.35) -- penalized for must_not violations (type hints complaints on cr-003)
- Below D on java-pro (4.62 vs 4.87, gap = 0.25) and websocket-engineer (4.60 vs 4.73)
- Confidence labels sometimes downgrade severity inappropriately (e.g., audit trail at POSSIBLE)

### Condition N

**Grand mean: 4.569 (rank #6)**

**Closest to:** F (bare model), but slightly better. N scores 4.569 vs F's 4.540. Both share a similar profile of moderate, balanced performance.

**Strengths:**
- Best on dotnet-framework-pro (4.65) -- strong on legacy .NET knowledge
- Ties best on full-stack-developer (4.82 with D and O) and documentation-pro (4.68, near-best)
- Produces code artifacts (JS 61 tests in __tests__/)
- Strong on changelog and troubleshooting documentation

**Weaknesses:**
- Weakest new condition on code-reviewer (4.24) -- false positive on cr-004 (syntax error), must_not violations on cr-003
- Below average on tdd-guide (4.63) -- fewer edge case tests
- Shares M's problem with must_not violations on type hints (cr-003)
- Fewer tests produced than E or I

### Condition O

**Grand mean: 4.633 (rank #4)**

**Closest to:** I (v4/v5-partial agents). O = 4.633 vs I = 4.635 -- virtually identical grand means but different agent profiles.

**Strengths:**
- Ties for best on incident-responder (4.87), security-reviewer (4.87)
- Best on documentation-pro (4.75) and fastapi-pro (4.71) -- strong implementation output
- Best or tied-best on full-stack-developer (4.82)
- Clean, well-structured code with proper separation of concerns (dataclass patterns, Pydantic models)
- Produces code artifacts (JS 67 tests in src/__tests__/)

**Weaknesses:**
- Weakest condition on code-reviewer cr-003 (3.40) -- must_not violation (type hints) AND missed audit trail finding
- Below average on tdd-guide (4.60) -- missing whitespace edge case tests
- Must_not violations shared with M and N on Python code review tasks

---

## Agent-Creator Iteration Trajectory

L→M→N→O represent 4 consecutive rounds of the agent-creator plugin (create/improve + audit).

| Round | Condition | Grand Mean | Delta from prev | Delta from D (v1) |
|-------|-----------|-----------|-----------------|-------------------|
| 1 (initial rewrite) | L | **4.661** | — | -0.022 |
| 2 (targeted fixes) | M | 4.606 | -0.055 | -0.077 |
| 3 (polish) | N | 4.569 | -0.037 | -0.114 |
| 4 (final polish) | O | 4.633 | +0.064 | -0.050 |

**The trajectory is NOT monotonically improving.** Round 1 (L) was the best. Rounds 2-3 degraded. Round 4 partially recovered.

**Why the initial rewrite was best:** L produced the most thorough output (9671 lines) with no code artifacts — similar to v1's approach. The agent-creator's first pass successfully captured domain knowledge without over-constraining.

**Why rounds 2-3 degraded:** Each audit flagged "issues" that led to "improvements" which actually introduced:
- must_not violations on code review (type hints for unchanged code) — introduced in M, persisted through N/O
- Reduced code-reviewer scores: L=4.76, M=4.35, N=4.24, O=4.36
- The audit-improve loop polished format at the expense of substance

**Why round 4 partially recovered:** O recovered on implementation tasks (fastapi-pro: 4.71, documentation-pro: 4.75) but the code review regression persisted.

**The lesson:** Iterative auditing can over-polish agents. The first rewrite captured the highest-value changes. Subsequent rounds introduced the same over-constraining pattern we saw in v2 — optimizing for rubric compliance rather than output quality. The audit tool needs a "do no harm" check: if the current agent already scores well, stop iterating.

---

## Key Findings

1. **D (v1) remains the overall winner** with a grand mean of 4.683, but the margin over L is razor-thin (0.022). V1's advantage is concentrated in java-pro (+0.16 over L) and websocket-engineer (+0.13 over L).

2. **L is the strongest new condition** and a serious contender for the top spot. It matches or beats D on 7/12 agents and never falls below 4.37 on any agent. Its verbose output style (9671 lines, no code artifacts) mirrors v1's approach.

3. **O excels at implementation tasks** (fastapi-pro: 4.71, documentation-pro: 4.75, full-stack: 4.82) but has a code review weakness. Its code quality is notably high with good architectural patterns.

4. **N and O share a code review weakness:** Both commit must_not violations on Python tasks (type hints complaints), suggesting a shared bias or training artifact. This is their primary differentiator from L and D.

5. **E (v2) remains the worst condition** at 4.408, confirming the v1/v2 findings: over-constrained agent instructions compress output and hurt Depth/Completeness on Sonnet.

6. **All new conditions beat bare (F)**, confirming that agent instructions provide value. The gap ranges from +0.029 (N) to +0.121 (L).

7. **incident-responder is the easiest task domain** (grand mean 4.820) with 5/8 conditions scoring 4.87. **research-analyst is the hardest** (grand mean 4.311) with a ceiling around 4.37.

8. **Code artifacts do not correlate with quality.** L produces no code but ranks #2. E produces the most tests (103) but ranks last. Quality of reasoning matters more than quantity of artifacts.

9. **The must_not violation pattern in M/N/O on Python code review** (complaining about missing type hints on unchanged code) is a systematic weakness not present in D, E, F, or L. This suggests a shared characteristic among these three conditions.

---

## Recommendations

1. **The agent-creator plugin works.** Its round 1 output (L: 4.661) nearly matches hand-crafted v1 (D: 4.683) — a gap of only 0.022. This is remarkable: an automated tool produced agents competitive with the best hand-tuned version.

2. **Stop after round 1.** The iteration trajectory shows diminishing and then negative returns. Round 1 captures the highest-value changes. Subsequent audit-improve cycles over-polish, introducing the same over-constraining pattern that killed v2.

3. **Add a "do no harm" check to the agent-creator.** If an agent already scores well on the rubric, the audit should say "no changes needed" rather than finding things to polish. The current rubric incentivizes changes even when the agent is already good.

4. **Fix the code review must_not regression.** Rounds 2-4 (M/N/O) introduced type-hints complaints for unchanged code. The agent-creator needs an explicit "only review changed code" rule in its code-reviewer template.

5. **Use L (round 1) agents as the new production baseline.** They match v1 quality, were produced automatically, and can be regenerated for any new domain.

6. **For implementation tasks, O (round 4) is strongest.** fastapi-pro (4.71) and documentation-pro (4.75) are best-in-class. Consider a hybrid: L-style for review agents, O-style for implementation agents.

7. **E (v2) should be deprecated** — confirmed across all evaluations.
