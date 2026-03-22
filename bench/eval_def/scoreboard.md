# Agent Eval Scoreboard -- D / E / F Conditions

**Date:** 2026-03-22
**Model:** Sonnet (via GLM agent framework)
**Method:** LLM-as-judge, 6 dimensions (Completeness, Precision, Actionability, Structure, Efficiency, Depth)
**Protocol:** Adapted from `tooling/agent_eval.md` -- ground-truth rubrics with must-mention / must-not criteria, per-task composite scoring
**Total outputs scored:** 180 (12 agents x 5 tasks x 3 conditions)

---

## Full Results Table

Sorted by D score descending.

| Agent | D | E | F | E LIFT | F LIFT | F vs E |
|-------|-----|-----|-----|--------|--------|--------|
| full-stack-developer | 4.87 | 4.36 | 4.59 | -0.51 | -0.28 | +0.23 |
| incident-responder | 4.87 | 4.60 | 4.84 | -0.27 | -0.03 | +0.24 |
| tdd-guide | 4.87 | 4.20 | 3.87 | -0.67 | -1.00 | -0.33 |
| fastapi-pro | 4.86 | 4.04 | 3.96 | -0.82 | -0.90 | -0.08 |
| java-pro | 4.84 | 4.51 | 4.52 | -0.33 | -0.32 | +0.01 |
| websocket-engineer | 4.80 | 4.60 | 4.73 | -0.20 | -0.07 | +0.13 |
| security-reviewer | 4.76 | 4.36 | 4.48 | -0.40 | -0.28 | +0.12 |
| documentation-pro | 4.71 | 4.73 | 4.33 | +0.02 | -0.38 | -0.40 |
| dotnet-framework-pro | 4.60 | 4.45 | 4.83 | -0.15 | +0.23 | +0.38 |
| go-build-resolver | 4.52 | 4.75 | 4.56 | +0.23 | +0.04 | -0.19 |
| code-reviewer | 4.49 | 4.60 | 4.65 | +0.11 | +0.16 | +0.05 |
| research-analyst | 4.37 | 4.07 | 4.36 | -0.30 | -0.01 | +0.29 |
| **Grand Mean** | **4.71** | **4.44** | **4.48** | **-0.27** | **-0.24** | **+0.04** |

---

## Key Findings

### 1. Condition D dominates overall

Condition D (4.71) outperforms both E (4.44, delta -0.27) and F (4.48, delta -0.24) on average. D is the top-scoring condition for **9 of 12 agents**. E and F are close to each other (F beats E by +0.04 on average), but neither approaches D.

The advantage is driven primarily by two dimensions where D excels: **Depth** (D: 4.88, E: 3.75, F: 4.15) and **Completeness** (D: 4.88, E: 4.30, F: 4.48). D outputs consistently cover more edge cases, provide richer explanations, and include non-obvious insights that the judge rewards.

### 2. E wins on Efficiency but pays for it elsewhere

Condition E has the highest Efficiency score by a wide margin (E: 4.97 vs D: 3.82 vs F: 4.52). E outputs are consistently the most concise and signal-dense. However, this brevity comes at a steep cost to Depth (-1.13 vs D) and Completeness (-0.58 vs D). In tasks where the ground truth demands thorough coverage of edge cases and non-obvious details, E's conciseness becomes a liability.

### 3. Largest spreads between conditions

The agents with the widest gap between their best and worst condition scores:

| Agent | Spread | Best | Worst | Pattern |
|-------|--------|------|-------|---------|
| tdd-guide | 1.00 | D (4.87) | F (3.87) | F had incorrect characterization tests (tdd-004: precision=2) |
| fastapi-pro | 0.90 | D (4.86) | F (3.96) | E and F both lacked depth (no Redis impl, no tests, minimal production guidance) |
| full-stack-developer | 0.51 | D (4.87) | E (4.36) | E consistently less complete; F had a must-not violation (localStorage JWT) |

These are **implementation-heavy agents** where D's thoroughness (complete code, tests, production considerations) produces materially better output.

### 4. Closest across conditions

| Agent | Spread | D | E | F |
|-------|--------|-----|-----|-----|
| code-reviewer | 0.16 | 4.49 | 4.60 | 4.65 |
| websocket-engineer | 0.20 | 4.80 | 4.60 | 4.73 |
| go-build-resolver | 0.23 | 4.52 | 4.75 | 4.56 |

These are **review/analysis agents** where the task is more about identifying the right issues than producing extensive code. Concise, focused output (E/F) is nearly as effective as thorough output (D) when the core requirement is diagnostic accuracy.

### 5. Condition patterns by task type

- **Code-generation tasks** (fastapi-pro, tdd-guide, full-stack-developer, java-pro): D dominates. Average D lead over E: -0.58. D's thoroughness (complete implementations, tests, production notes) is rewarded heavily by the rubric.
- **Review/analysis tasks** (code-reviewer, security-reviewer, go-build-resolver): D's advantage shrinks or reverses. Average D lead over E: -0.02. Concise, well-structured findings can match or beat verbose analysis.
- **Incident/operational tasks** (incident-responder, dotnet-framework-pro): F performs surprisingly well (4.84 and 4.83), nearly matching or exceeding D. Structured, focused responses with priority tables work well for operational contexts.
- **Research/writing tasks** (research-analyst, documentation-pro): Mixed. D's depth helps for research but hurts Efficiency. E's conciseness helps documentation but lacks depth for research.

---

## LIFT Classification

| LIFT Range | Meaning | E Agents (count) | F Agents (count) |
|------------|---------|-------------------|-------------------|
| < 0 (harmful) | Condition scored lower than D | **9** -- full-stack-developer, incident-responder, tdd-guide, fastapi-pro, java-pro, websocket-engineer, security-reviewer, dotnet-framework-pro, research-analyst | **9** -- full-stack-developer, tdd-guide, fastapi-pro, java-pro, websocket-engineer, security-reviewer, documentation-pro, incident-responder, research-analyst |
| 0 to 0.1 (useless) | Negligible improvement | **1** -- documentation-pro (+0.02) | **1** -- go-build-resolver (+0.04) |
| 0.1 to 0.5 (marginal) | Modest improvement | **2** -- go-build-resolver (+0.23), code-reviewer (+0.11) | **2** -- dotnet-framework-pro (+0.23), code-reviewer (+0.16) |
| >= 0.5 (clear value) | Strong improvement | **0** | **0** |

**Neither E nor F produces a clear-value LIFT over D for any agent.** Both conditions are harmful for 9 of 12 agents. The only agents where E or F improve on D are the lower-scoring D agents (code-reviewer at 4.49, go-build-resolver at 4.52, dotnet-framework-pro at 4.60), suggesting E/F may help when D's baseline is weaker but hurt when D is already strong.

---

## Dimension Analysis

Mean scores across all 60 task evaluations per condition (12 agents x 5 tasks):

| Dimension | D | E | F | E - D | F - D | F - E |
|-----------|-----|-----|-----|-------|-------|-------|
| Completeness | 4.88 | 4.30 | 4.48 | -0.58 | -0.40 | +0.18 |
| Precision | 4.90 | 4.80 | 4.75 | -0.10 | -0.15 | -0.05 |
| Actionability | 4.87 | 4.55 | 4.53 | -0.32 | -0.33 | -0.02 |
| Structure | 4.88 | 4.30 | 4.48 | -0.58 | -0.40 | +0.18 |
| Efficiency | 3.82 | 4.97 | 4.52 | **+1.15** | +0.70 | -0.45 |
| Depth | 4.88 | 3.75 | 4.15 | **-1.13** | -0.73 | +0.40 |

### Dimensions that most differentiate conditions

1. **Efficiency** (largest E advantage): E scores +1.15 over D. E outputs are consistently rated as concise, dense, and free of filler. F is also more efficient than D (+0.70) but less so than E.

2. **Depth** (largest D advantage): D scores +1.13 over E and +0.73 over F. D outputs explore edge cases, explain attack chains, provide alternative approaches, and include non-obvious insights that E and F omit for brevity.

3. **Completeness** and **Structure** (tied, second-largest D advantage): Both show D +0.58 over E. D outputs more often include comparison tables, before/after examples, multiple solution approaches, and explicit labels (RED/GREEN/REFACTOR, severity tables).

4. **Precision** (most stable dimension): All three conditions score above 4.75. Factual accuracy is largely independent of condition -- the model rarely hallucinates regardless of prompt style.

5. **Actionability** (moderate D advantage): D +0.32 over E. D outputs include more complete working code, tests, and production-ready configurations.

### The Efficiency-Depth tradeoff

The data reveals a clear tradeoff axis: E maximizes Efficiency at the cost of Depth, while D maximizes Depth at the cost of Efficiency. F sits between them on both dimensions. Since the composite scoring weights all 6 dimensions equally, and D wins 5 of 6 dimensions, D's Efficiency penalty is more than offset by its advantages elsewhere.

---

## Recommendations

1. **D is the default choice.** For any task where quality matters more than token cost, D produces the best output. Its advantage is especially pronounced for code-generation tasks (avg +0.58 over E) and tasks requiring thorough analysis.

2. **E is viable for review/diagnostic tasks only.** The three agents where E matches or exceeds D (code-reviewer, go-build-resolver, documentation-pro) share a common trait: their tasks reward identifying the right issues over producing extensive implementations. For quick diagnostic workflows, E's efficiency advantage could justify the tradeoff.

3. **F offers no compelling niche.** F sits between D and E on most dimensions without excelling at any. It slightly outperforms E overall (+0.04) but the difference is negligible. The one exception is dotnet-framework-pro, where F scored 4.83 vs D's 4.60 -- suggesting F may handle certain domain-specific tasks well.

4. **Investigate tdd-guide and fastapi-pro F failures.** F scored 3.87 and 3.96 respectively for these agents, representing the two largest quality drops in the dataset. For tdd-guide, F produced incorrect characterization tests (precision=2 on tdd-004). For fastapi-pro, F consistently lacked depth and production guidance. These may indicate F-specific failure modes worth understanding.

5. **Consider a hybrid approach.** Given that E excels at Efficiency (+1.15 over D) while D excels at Depth (+1.13 over E), a two-pass strategy could work: use E for initial triage/review, then D for implementation and detailed analysis. This would combine E's signal density for diagnosis with D's thoroughness for execution.

6. **Weight the composite differently for different use cases.** The current equal weighting of 6 dimensions implicitly penalizes E's brevity. If Efficiency were weighted 2x (valuing conciseness for production use), the gap between D and E would narrow substantially.
