# DEFGHIJ Scoreboard

**Date:** 2026-03-23
**Method:** LLM-as-judge (6 dimensions, composite scoring). Sonnet via GLM framework.
**Outputs:** 420 total (12 agents x 5 tasks x 7 conditions)

## Conditions

| Code | Description | Avg Lines | Test Artifacts |
|------|-------------|-----------|----------------|
| D | v1 agents | 106 | None (markdown only) |
| E | v2 agents | 153 | JS, 103 tests |
| F | Bare (no agents) | -- | TS, 74 tests |
| G | v3 agents | 71 | JS, 68 tests |
| H | v4 agents | 71 | JS, 105 tests |
| I | v5-partial (only full-stack-developer updated from v4) | 71 | JS, 105 tests |
| J | v5 agents (full research-driven redesign) | 93 | JS, 35 tests (tmp/tdd/) |

---

## Full Results Table

Sorted by J descending. **Bold** = best score per agent (row).

| Agent | D | E | F | G | H | I | J |
|-------|-----|-----|-----|-----|-----|-----|-----|
| full-stack-developer | 4.82 | 4.68 | 4.51 | **4.84** | 4.70 | 4.79 | **4.84** |
| fastapi-pro | **4.76** | 3.36 | 3.47 | **4.76** | **4.76** | **4.76** | 4.74 |
| code-reviewer | 4.68 | 4.68 | 4.38 | 4.54 | **4.76** | **4.76** | 4.69 |
| security-reviewer | **4.87** | 4.53 | 4.71 | 4.82 | **4.87** | **4.87** | 4.64 |
| documentation-pro | **4.63** | 4.55 | 4.60 | 4.57 | **4.63** | **4.63** | **4.63** |
| dotnet-framework-pro | **4.69** | 4.35 | 4.65 | 4.61 | 4.61 | 4.61 | 4.61 |
| incident-responder | **4.87** | 4.84 | 4.81 | **4.87** | **4.87** | **4.87** | 4.56 |
| websocket-engineer | **4.82** | 4.31 | 4.70 | 4.53 | 4.48 | 4.48 | 4.53 |
| research-analyst | **4.54** | 4.24 | 4.25 | 4.00 | 4.47 | 4.47 | 4.47 |
| go-build-resolver | 4.51 | 4.44 | 4.45 | **4.56** | **4.56** | **4.56** | 4.35 |
| java-pro | **4.84** | 4.47 | 4.58 | **4.84** | 4.81 | 4.81 | 4.31 |
| tdd-guide | **4.87** | 4.79 | 4.82 | 4.60 | **4.87** | **4.87** | 3.53 |
| **Grand Mean** | **4.74** | **4.44** | **4.49** | **4.63** | **4.70** | **4.71** | **4.49** |

---

## J Analysis

### J Rank Per Agent

| Agent | J Score | Rank | Best Condition |
|-------|---------|------|----------------|
| full-stack-developer | 4.84 | 1st (tied G) | G/J = 4.84 |
| fastapi-pro | 4.74 | 5th | D/G/H/I = 4.76 |
| code-reviewer | 4.69 | 3rd | H/I = 4.76 |
| security-reviewer | 4.64 | 6th | D/H/I = 4.87 |
| documentation-pro | 4.63 | 1st (tied D/H/I) | D/H/I/J = 4.63 |
| dotnet-framework-pro | 4.61 | 6th (tied G/H/I) | D = 4.69 |
| incident-responder | 4.56 | 7th | D/G/H/I = 4.87 |
| websocket-engineer | 4.53 | 4th (tied G) | D = 4.82 |
| research-analyst | 4.47 | 4th (tied H/I) | D = 4.54 |
| go-build-resolver | 4.35 | 7th | G/H/I = 4.56 |
| java-pro | 4.31 | 7th | D/G = 4.84 |
| tdd-guide | 3.53 | 7th | D/H/I = 4.87 |

**Summary:** J is best (or tied best) on 2/12 agents, ranks in bottom half on 8/12, and is dead last on 4/12.

### Where J Improved Over H/I

- **full-stack-developer:** J=4.84 vs H=4.70, I=4.79 (+0.14 / +0.05). Best score across all conditions (tied with G). J produces strong implementation with good conciseness.
- **websocket-engineer:** J=4.53 vs H=4.48, I=4.48 (+0.05). Modest gain. H/I suffered from excessive verbosity (Efficiency=2 on some tasks).
- **documentation-pro:** J=4.63 vs H=4.63, I=4.63 (tie). Maintained quality.

### Where J Regressed

- **tdd-guide:** J=3.53 vs H/I=4.87. **Delta: -1.34.** The worst regression in the entire eval. J produced only 35 tests across all 5 tasks (vs H/I's 105). Tests were shallow (8 tests for parsePrice, 5 for rate limiter, 4 for registerUser, 10 for calculateDiscount, 8 for pagination). Missing edge cases across the board: no negative prices, no multiple-dot handling, no concurrent rate limiter tests, no whitespace email tests, no pageSize=0 tests.
- **java-pro:** J=4.31 vs H/I=4.81. **Delta: -0.50.** J was too concise, missing GC log analysis, less thorough on pattern matching, less depth in Spring Batch and Resilience4j.
- **incident-responder:** J=4.56 vs H/I=4.87. **Delta: -0.31.** J responses were too concise, with less structured investigation phases, less detailed mitigation tables, and less thorough communication templates.
- **go-build-resolver:** J=4.35 vs H/I=4.56. **Delta: -0.21.** J had a must_not violation (suggesting package merging for import cycles) and was less thorough overall.
- **security-reviewer:** J=4.64 vs H/I=4.87. **Delta: -0.23.** J missed the path bypass vulnerability in sr-002 (called it a positive finding instead of a security issue), dragging down the mean.

### J Profile

**Strengths:**
- Implementation tasks: full-stack-developer (best), fastapi-pro (near-best), documentation-pro (tied best)
- Good code architecture patterns (app.state, service layer separation, HTTPBearer)
- Confidence calibration adds precision to reviews
- Concise yet complete on implementation tasks

**Weaknesses:**
- Severely underperforms on TDD (3.53 -- worst score in entire eval by any agent under any condition)
- Too concise on analysis/review/incident tasks where depth matters
- Missed critical security findings (sr-002 path bypass)
- Lost depth on Java ecosystem tasks (Spring Boot, Spring Batch, Resilience4j)
- Test artifact count dropped from 105 (H/I) to 35 -- agents produced fewer and shallower tests

---

## Fastapi-pro Recovery Analysis

The fastapi-pro agent was a specific focus of v5 development due to the v2 regression (E=3.36, F=3.47).

| Condition | Score | Delta from D |
|-----------|-------|-------------|
| D (v1) | 4.76 | baseline |
| E (v2) | 3.36 | -1.40 |
| F (bare) | 3.47 | -1.29 |
| G (v3) | 4.76 | 0.00 |
| H (v4) | 4.76 | 0.00 |
| I (v5-partial) | 4.76 | 0.00 |
| J (v5) | 4.74 | -0.02 |

**Verdict:** The v2 regression was catastrophic (-1.40) but was fully fixed in v3 and has remained stable through v4, v5-partial, and v5. J (4.74) is within 0.02 of the established ceiling (4.76), a negligible difference. The fastapi-pro regression is resolved.

The v5 agent uses slightly different patterns (sync endpoint reasoning for csv stdlib, HTTPBearer, service layer separation) but achieves essentially the same quality. The one minor gap is fa-005 (background tasks), where J scored 4.47 vs D/G/H/I's 4.60 -- J's HATEOAS pattern is cleaner but less deep on lifespan shutdown and arq.

---

## Evolution Table

| Round | Condition | Avg Lines | Grand Mean | Notes |
|-------|-----------|-----------|------------|-------|
| 1 | D (v1) | 106 | **4.74** | Baseline. Wins 7/12 agents outright. |
| 2 | E (v2) | 153 | 4.44 | Over-constrained Sonnet. Lost depth. |
| 3 | F (bare) | -- | 4.49 | No agents. Beat v2 overall. |
| 4 | G (v3) | 71 | 4.63 | Compact format. Tied/beat v1 on implementation. |
| 5 | H (v4) | 71 | 4.70 | Restored review checklists. Near-v1 quality. |
| 6 | I (v5-partial) | 71 | 4.71 | Only full-stack-developer changed (+0.09 on that agent). |
| 7 | J (v5) | 93 | 4.49 | Full redesign. Regressed to F/E level overall. |

**Trend:** v1 remains the high-water mark (4.74). v4/v5-partial (4.70-4.71) came closest. v5 full redesign (4.49) regressed sharply, matching bare/v2 level.

---

## Key Findings

1. **v5 (J) is a net regression.** Grand mean 4.49 is 0.25 below v1 (4.74) and 0.22 below v4 (4.70). This is the largest regression since v2.

2. **The tdd-guide collapse is the headline failure.** J scored 3.53 -- the lowest score any agent achieved under any condition in the entire DEFGHIJ eval. The v5 tdd-guide agent produces far fewer tests (35 vs 105) with far less edge case coverage.

3. **J succeeds on implementation, fails on depth-requiring tasks.** The 2 agents where J is best (full-stack-developer, documentation-pro) are implementation-focused. The 4 agents where J is worst (tdd-guide, java-pro, go-build-resolver, incident-responder) all require thoroughness and exhaustive coverage.

4. **The 93-line average is not the problem -- the content is.** v3/v4 at 71 lines outperformed J at 93 lines. More lines != better instructions. The "research-driven redesign" introduced instructions that over-constrained output (similar to the v2 failure mode).

5. **fastapi-pro is stable.** The v2 regression (3.36) was fixed in v3 and has held steady at 4.74-4.76 through all subsequent versions.

6. **v5-partial (I) proves surgical updates work.** Updating only the full-stack-developer agent from v4 improved that single agent (4.70->4.79) without affecting anything else. Grand mean I=4.71 vs H=4.70.

7. **H/I identical outputs on 10/12 agents** confirm that the v5-partial condition correctly isolated the full-stack-developer change.

---

## Recommendations

### Ship
- **H (v4) agents** as the production set. Grand mean 4.70, no catastrophic failures, stable across all agents.
- **I's full-stack-developer** as a cherry-pick upgrade to v4. It improves full-stack from 4.70 to 4.79 with no regressions.

### Fix
- **tdd-guide v5 is broken.** Do not ship. The agent produces too few tests with insufficient edge case coverage. Root cause: likely the v5 instructions constrain test generation rather than encouraging exhaustive coverage. Revert to v4 tdd-guide (4.87).
- **java-pro v5** dropped from 4.81 to 4.31. The v5 instructions likely cut depth-encouraging sections. Revert to v4.
- **incident-responder v5** dropped from 4.87 to 4.56. The v5 instructions produce overly concise responses. Revert to v4.

### Investigate
- **security-reviewer v5** (J=4.64 vs H/I=4.87): The sr-002 path bypass miss is concerning. The two-phase triage format may cause the agent to rationalize away real vulnerabilities as "positive findings."
- **go-build-resolver v5** (J=4.35 vs H/I=4.56): The must_not violation (suggesting package merging) suggests the v5 instructions removed a guardrail.

### General Lesson
The v5 "full research-driven redesign" repeated the v2 mistake: changing too many agents simultaneously without incremental validation. The v5-partial approach (I) -- updating one agent at a time and measuring -- is the correct methodology. Future agent updates should follow the I model, not the J model.
