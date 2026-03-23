# Eval 12345 Scoreboard

**Date:** 2026-03-23
**Method:** 12 specialist agents x 5 domain-specific tasks x 12 conditions = **720 outputs** (markdown-only, no code artifacts). Each output scored on 6 dimensions (Precision, Completeness, Actionability, Structure, Efficiency, Depth) yielding a weighted composite (1-5 scale).

**Condition encoding:** Two dimensions — digit value = agent version, digit count = execution mode.

| Digit | Agent Version |
|-------|--------------|
| 1 | F (bare, no agents) |
| 2 | D (v1, hand-crafted) |
| 3 | I (v4/v5-partial) |
| 4 | L (agent-creator round 1) |
| 5 | O (agent-creator round 4) |

| Digit Count | Execution Mode |
|-------------|---------------|
| 1 digit (1-5) | Sonnet direct |
| 2 digits (22,33,44) | Opus lead + Sonnet execution |
| 3 digits (111-444) | Opus lead + GLM 4.7 execution |

---

## Full Results Table

Sorted by agent grand mean (descending). **Bold** = best score for that agent.

| Agent | 1 | 2 | 3 | 4 | 5 | 22 | 33 | 44 | 111 | 222 | 333 | 444 | Grand Mean |
|-------|-----|-----|-----|-----|-----|------|------|------|-------|-------|-------|-------|------------|
| research-analyst | 4.83 | 4.90 | 4.77 | **4.97** | **4.97** | 4.77 | 4.70 | 4.63 | 4.07 | **4.97** | 4.70 | 4.07 | **4.70** |
| incident-responder | 4.30 | 4.81 | **4.87** | **4.87** | **4.87** | 4.76 | 4.40 | 4.79 | 4.40 | 4.69 | 4.84 | 4.73 | **4.69** |
| documentation-pro | 4.53 | 4.53 | **4.87** | **4.87** | **4.87** | 4.53 | 4.53 | 4.53 | 3.27 | 4.40 | 4.40 | 4.40 | **4.48** |
| websocket-engineer | 4.70 | **4.87** | 4.77 | 4.77 | 4.77 | 4.43 | 4.17 | 4.17 | 4.10 | 4.77 | 4.17 | 4.00 | **4.47** |
| java-pro | 4.33 | **4.87** | 4.73 | 4.73 | 4.73 | 4.40 | 4.73 | 4.73 | 3.40 | 4.73 | 4.60 | 3.00 | **4.42** |
| full-stack-developer | 4.60 | 4.67 | **4.77** | **4.77** | **4.77** | 4.13 | 4.07 | 3.63 | 3.73 | **4.77** | 4.07 | 3.50 | **4.29** |
| security-reviewer | 4.08 | 4.31 | **4.87** | 4.47 | **4.87** | 4.38 | 4.43 | 4.47 | 3.47 | 3.83 | 3.77 | 3.68 | **4.22** |
| dotnet-framework-pro | 4.13 | 4.27 | 4.53 | **4.67** | 4.40 | 4.53 | 4.13 | 4.13 | 4.00 | 4.13 | 3.80 | 3.87 | **4.22** |
| fastapi-pro | 4.40 | 4.33 | **4.60** | **4.60** | **4.60** | 4.33 | 4.47 | **4.60** | 3.40 | 3.40 | 4.20 | 3.27 | **4.18** |
| go-build-resolver | 4.53 | 4.53 | 4.40 | 4.07 | 4.07 | **4.73** | 4.40 | **4.73** | 3.87 | 3.60 | 3.67 | 3.40 | **4.17** |
| tdd-guide | 4.13 | 4.13 | **4.87** | **4.87** | 4.00 | 4.40 | 3.13 | 4.00 | 4.27 | 3.13 | 3.13 | 3.13 | **3.93** |
| code-reviewer | 3.59 | 3.83 | 4.51 | **4.53** | 4.37 | 3.99 | 4.13 | 4.23 | 3.39 | 3.44 | 3.16 | 1.27 | **3.70** |
| **Grand Mean** | **4.35** | **4.50** | **4.71** | **4.68** | **4.61** | **4.45** | **4.27** | **4.39** | **3.78** | **4.16** | **4.04** | **3.53** | **4.29** |

---

## Condition Rankings

| Rank | Condition | Grand Mean | Delta from #1 |
|------|-----------|------------|---------------|
| 1 | 3 | 4.71 | -- |
| 2 | 4 | 4.68 | -0.03 |
| 3 | 5 | 4.61 | -0.11 |
| 4 | 2 | 4.50 | -0.21 |
| 5 | 22 | 4.45 | -0.27 |
| 6 | 44 | 4.39 | -0.33 |
| 7 | 1 | 4.35 | -0.37 |
| 8 | 33 | 4.27 | -0.44 |
| 9 | 222 | 4.16 | -0.56 |
| 10 | 333 | 4.04 | -0.67 |
| 11 | 111 | 3.78 | -0.93 |
| 12 | 444 | 3.53 | -1.19 |

---

## Execution Mode Analysis

The dominant factor is NOT agent version — it's execution mode.

### By execution mode (the big effect)

| Mode | Conditions | Mean | Delta |
|------|-----------|------|-------|
| **Sonnet direct** | 1, 2, 3, 4, 5 | **4.57** | baseline |
| **Opus + Sonnet exec** | 22, 33, 44 | **4.37** | -0.20 |
| **Opus + GLM 4.7 exec** | 111, 222, 333, 444 | **3.88** | -0.69 |

**Execution mode accounts for a 0.69-point gap (15% of the scale).** This dwarfs all agent version differences we've ever measured (max 0.28 between v1 and v2).

Sonnet direct > Opus orchestrated with Sonnet > Opus orchestrated with GLM 4.7. Adding an orchestration layer HURTS output quality. The more indirection, the worse the result.

### By agent version within each mode (the small effect)

**Sonnet direct:**

| Agent Version | Condition | Mean |
|---------------|-----------|------|
| I (v4/v5) | 3 | **4.71** |
| L (agent-creator r1) | 4 | 4.68 |
| O (agent-creator r4) | 5 | 4.61 |
| D (v1) | 2 | 4.50 |
| F (bare) | 1 | 4.35 |

Within Sonnet direct, agent instructions produce a 0.36 spread (v4/v5 best, bare worst). This matches our prior findings.

**Opus + Sonnet exec:**

| Agent Version | Condition | Mean |
|---------------|-----------|------|
| D (v1) | 22 | **4.45** |
| L (agent-creator r1) | 44 | 4.39 |
| I (v4/v5) | 33 | 4.27 |

Within Opus+Sonnet, the spread is only 0.18. Agent version matters less when orchestrated.

**Opus + GLM 4.7 exec:**

| Agent Version | Condition | Mean |
|---------------|-----------|------|
| D (v1) | 222 | **4.16** |
| I (v4/v5) | 333 | 4.04 |
| F (bare) | 111 | 3.78 |
| L (agent-creator r1) | 444 | 3.53 |

Within GLM 4.7, v1 still wins but with catastrophic failures for agent-creator r1 (444 scored 1.27 on code-reviewer — answered wrong tasks).

### Agent version effect size by mode

| Mode | Best agent | Worst agent | Spread | Agent effect as % of mode effect |
|------|-----------|-------------|--------|----------------------------------|
| Sonnet direct | 4.71 (v4/v5) | 4.35 (bare) | 0.36 | — |
| Opus+Sonnet | 4.45 (v1) | 4.27 (v4/v5) | 0.18 | — |
| Opus+GLM4.7 | 4.16 (v1) | 3.53 (creator r1) | 0.63 | — |

**The execution mode gap (0.69) is 1.9x larger than the best-to-worst agent gap within Sonnet (0.36).** Switching from Sonnet direct to Opus+GLM4.7 hurts more than removing all agent instructions.

---

## Key Findings

### Catastrophic Failures (any agent score < 3.0)

| Condition | Agent | Score | Root Cause |
|-----------|-------|-------|------------|
| 444 | code-reviewer | **1.27** | Answered the wrong tasks entirely -- reviewed security-reviewer task content instead of code-reviewer tasks. All 5 tasks misdirected. |
| 444 | java-pro | **3.00** | Must-not violation (manual JDBC loop without batching), incorrect AOT artifact, per-record inserts with Thread.sleep retry, shallow depth. |

Condition 444 is responsible for both catastrophic-level failures. No other condition produces a score below 3.0 on any agent.

### Most Resilient Agents (smallest spread across conditions)

| Agent | Min | Max | Spread |
|-------|-----|-----|--------|
| incident-responder | 4.30 | 4.87 | 0.57 |
| research-analyst | 4.07 | 4.97 | 0.90 |
| dotnet-framework-pro | 3.80 | 4.67 | 0.87 |

Incident-responder is the most robust agent, with strong performance even under weak conditions. Its tasks (incident response playbooks) may be less sensitive to condition variation because the domain requires a well-known structure (severity, triage, communication) that most conditions follow.

### Most Sensitive Agents (largest spread)

| Agent | Min | Max | Spread |
|-------|-----|-----|--------|
| code-reviewer | 1.27 | 4.53 | 3.26 |
| tdd-guide | 3.13 | 4.87 | 1.74 |
| java-pro | 3.00 | 4.87 | 1.87 |

Code-reviewer's extreme spread is driven by the condition 444 catastrophic failure. Even excluding that outlier, its spread (3.16 to 4.53 = 1.37) is still substantial.

### Discriminating Tasks

The following tasks showed the widest variation across conditions and best separate strong from weak conditions:

- **cr-005** (TypeScript Cache cleanup): Tests understanding of JavaScript Map iteration semantics. Triple-digit conditions (111, 222) produced major false positives about "undefined behavior" that does not exist in the JS Map spec. Scores ranged from 1.27 to 4.33.
- **sr-002** (Python auth middleware): Conditions 3 and 5 scored 4.87 while condition 444 scored 3.07. Key differentiator: identifying bare-except, path bypass, and token expiry without triggering false positives on algorithm validation.
- **tdd-001-005** (TDD tasks collectively): Conditions 33, 222, 333, 444 all scored 3.13 -- a cliff edge. The TDD domain punishes conditions that produce imprecise edge-case handling or miss TDD cycle structure.

### Notable Patterns

1. **Execution mode is the dominant factor.** The 0.69-point gap between Sonnet direct (4.57) and Opus+GLM4.7 (3.88) is larger than any agent version difference ever measured. Adding orchestration layers degrades output quality.

2. **Orchestration hurts most on precision tasks.** Code-reviewer, tdd-guide, and security-reviewer show the steepest drops under orchestrated modes. These agents require precise severity calibration and must_not compliance — exactly what gets lost through indirection.

3. **Within Sonnet direct, agent instructions still matter.** v4/v5 (4.71) beats bare (4.35) by 0.36 — confirming agent instructions help when the model executes directly. The agent-creator r1 output (4.68) is close to hand-crafted v4/v5.

4. **Within Opus+Sonnet, v1 wins over v4/v5.** This reversal (22: 4.45 vs 33: 4.27) suggests v4/v5's compact format may not survive orchestration as well as v1's verbose style. The Opus lead may benefit from more explicit instructions to pass through.

5. **Within Opus+GLM4.7, v1 also wins.** 222 (4.16) beats all others. But GLM4.7 is catastrophe-prone — 444 (agent-creator r1) scored 1.27 on code-reviewer by answering the wrong tasks.

6. **go-build-resolver bucks the trend** — the only agent where Opus+Sonnet (22: 4.73, 44: 4.73) outperforms Sonnet direct. Build resolution may benefit from Opus's planning ability.

7. **Condition 222 (v1 + Opus+GLM4.7) is the outlier** — scores 4.97 on research-analyst and 4.77 on full-stack/websocket, nearly matching Sonnet direct. v1's verbose instructions may buffer against GLM4.7's weaknesses better than compact agents do.

---

## Recommendations

### On execution mode

1. **Sonnet direct is the best execution mode.** Adding orchestration layers (Opus lead) consistently degrades output quality. The 0.69-point gap between Sonnet direct and Opus+GLM4.7 is the single largest effect measured in this entire research project — larger than any agent version difference.

2. **If orchestration is needed, use Opus+Sonnet, not Opus+GLM4.7.** The Opus+Sonnet penalty is moderate (-0.20) while Opus+GLM4.7 is severe (-0.69) with catastrophic failure risk.

3. **GLM4.7 is not ready for precision tasks.** Code review, security review, and TDD show steep degradation under GLM4.7 execution, including wrong-task failures (444 code-reviewer: 1.27).

### On agent versions

4. **Within Sonnet direct: use v4/v5 agents (condition 3).** Best overall at 4.71. Agent-creator r1 output (condition 4: 4.68) is a close second.

5. **Within orchestrated modes: use v1 agents.** V1's verbose style survives orchestration better than v4/v5's compact format. Condition 22 (v1 + Opus+Sonnet: 4.45) and 222 (v1 + Opus+GLM4.7: 4.16) are the best in their respective modes.

6. **For Sonnet direct, bare model (condition 1: 4.35) is the floor.** All agent versions improve on it, confirming instructions add value when the model executes directly.

### The meta-insight

7. **Optimize execution mode before optimizing agent descriptions.** We spent months improving agents from 4.35 to 4.71 (+0.36). Switching from Sonnet direct to Opus+GLM4.7 loses 0.69 in one step. The execution pipeline matters more than the prompt.
