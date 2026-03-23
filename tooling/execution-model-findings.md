# Execution Model Findings: Sonnet vs GLM 4.7

Date: 2026-03-24

## The Finding

The execution model is the dominant factor in output quality — **2-3x more impactful than agent instructions.**

| Model | Mean | Output style |
|-------|------|-------------|
| Sonnet | **4.51** | Concise (3-4K lines) |
| GLM 4.7 | 3.82 | Verbose (9-14K lines) |
| **Gap** | **0.69** | |

For comparison, agent instruction effects within Sonnet:
- Best agents (L) vs bare (F): +0.21
- Best agents (L) vs worst agents (I): +0.29

**Switching from Sonnet to GLM 4.7 loses 3x more quality than removing all agent instructions.**

## Agent Version Rankings by Model

### On Sonnet (all perform well)

| Agents | Score |
|--------|-------|
| L (agent-creator r1) | **4.62** |
| D (v1) | 4.61 |
| O (agent-creator r4) | 4.60 |
| F (bare) | 4.41 |
| I (v4/v5) | 4.33 |

### On GLM 4.7 (larger spread, different ordering)

| Agents | Score |
|--------|-------|
| L (agent-creator r1) | **3.95** |
| O (agent-creator r4) | 3.87 |
| I (v4/v5) | 3.84 |
| D (v1) | 3.83 |
| F (bare) | 3.62 |

Notable: v1 (D) drops from #2 on Sonnet to #4 on GLM 4.7. Its verbose 106-line instructions may confuse GLM 4.7. Compact agents (I, O) do relatively better on GLM 4.7.

## Why GLM 4.7 Underperforms

1. **Verbosity without substance.** GLM 4.7 produces 2-4x more output but covers similar must_mention items. The extra content is filler, multiple solutions per task, and speculative analysis.

2. **Precision degrades with length.** More output = more surface area for errors. GLM 4.7 introduces must_not violations that Sonnet avoids:
   - SQL injection false positives on parameterized queries
   - Incorrect HTTPS claims (says HTTP when code uses HTTPS)
   - Suggests removing -mod=readonly from CI
   - Fabricated investigation narratives in incident response

3. **Efficiency collapses.** Sonnet scores 4-5 on Efficiency; GLM 4.7 scores 2-3.5. The pattern: 3-5 "solutions" per task with full code where 1-2 targeted answers suffice.

## Agent Sensitivity to Model Choice

| Sensitivity | Agents | Sonnet-GLM4.7 gap |
|-------------|--------|-------------------|
| **High (>1.0)** | dotnet-framework-pro, full-stack-developer, go-build-resolver, research-analyst, websocket-engineer | 1.03 - 1.43 |
| **Moderate (0.3-0.5)** | code-reviewer, tdd-guide, fastapi-pro, security-reviewer | 0.33 - 0.48 |
| **Low (<0.3)** | incident-responder, java-pro, documentation-pro | -0.02 - 0.29 |

## Key Insight: L (agent-creator r1) Is Model-Robust

L ranks #1 on BOTH models. It was produced by the agent-creator plugin's first pass on v1 agents. Its performance:
- Sonnet: 4.62 (best)
- GLM 4.7: 3.95 (best)
- Gap: 0.67 (smaller than average 0.69)

This suggests agent-creator r1 output, while slightly degraded from v1 on Sonnet-only benchmarks, is the most robust across different execution models.

## Data Source

bench/eval_ab12345/scoreboard.md — 600 outputs, 12 agents × 5 tasks × 10 conditions (5 agent versions × 2 models, both direct execution).
