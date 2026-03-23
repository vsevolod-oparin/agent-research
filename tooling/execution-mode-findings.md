# Execution Mode Is the Dominant Factor

Date: 2026-03-23

## The Finding

Execution mode accounts for a 0.69-point quality gap — **1.9x larger than the best-to-worst agent version gap** and **the single largest effect measured in this entire research project.**

| Mode | Mean | Delta | What it is |
|------|------|-------|-----------|
| Sonnet direct | **4.57** | baseline | Model executes tasks directly |
| Opus + Sonnet exec | 4.37 | -0.20 | Opus orchestrates, Sonnet executes |
| Opus + GLM 4.7 exec | 3.88 | -0.69 | Opus orchestrates, GLM 4.7 executes |

For comparison, all prior agent version effects:
- v1 vs bare: +0.22
- v4/v5 vs bare: +0.36
- v2 vs bare: -0.13 (harmful)
- Best agent version vs worst: 0.36

**Switching execution mode from Sonnet direct to Opus+GLM4.7 loses more quality than removing all agent instructions entirely.**

## Why Orchestration Hurts

1. **Information loss through indirection.** The orchestrator (Opus) must interpret the task, write a prompt for the executor, and the executor must interpret that prompt. Each handoff loses nuance. The direct model gets the original task unfiltered.

2. **Precision tasks suffer most.** Code-reviewer, tdd-guide, and security-reviewer show the steepest drops. These require exact severity calibration and must_not compliance — precisely what degrades through indirection. The orchestrator may rephrase requirements in ways that lose critical constraints.

3. **Catastrophic failure risk.** GLM 4.7 execution produced a 1.27 score (answered wrong tasks entirely) — something that never happened under Sonnet direct. Orchestration introduces failure modes that direct execution doesn't have.

4. **Verbose agent instructions buffer against orchestration damage.** V1 (106 lines, verbose) survives orchestration better than v4/v5 (71 lines, compact). When instructions pass through an orchestrator to an executor, more explicit instructions have a better chance of being preserved.

## Agent Version Effect Within Each Mode

### Sonnet direct (agent instructions matter)

| Agents | Score |
|--------|-------|
| v4/v5 | **4.71** |
| agent-creator r1 | 4.68 |
| agent-creator r4 | 4.61 |
| v1 | 4.50 |
| bare | 4.35 |

Spread: 0.36. Agent instructions clearly help.

### Opus + Sonnet (agent instructions matter less)

| Agents | Score |
|--------|-------|
| v1 | **4.45** |
| agent-creator r1 | 4.39 |
| v4/v5 | 4.27 |

Spread: 0.18. V1's verbose style wins — compact instructions don't survive orchestration as well.

### Opus + GLM 4.7 (agent instructions matter but differently)

| Agents | Score |
|--------|-------|
| v1 | **4.16** |
| v4/v5 | 4.04 |
| bare | 3.78 |
| agent-creator r1 | 3.53 |

Spread: 0.63. V1 wins again. But agent-creator r1 (which was nearly best under Sonnet direct) is WORST here — its compact format fails catastrophically under GLM 4.7.

## Implications

1. **Optimize execution mode first, agent descriptions second.** The pipeline architecture matters more than the prompt.

2. **For Sonnet direct: use compact, well-designed agents (v4/v5).** They outperform verbose v1.

3. **For orchestrated modes: use verbose, explicit agents (v1).** Compact instructions get lost in transit.

4. **GLM 4.7 is not production-ready for precision tasks.** The catastrophic failure risk and 0.69-point quality gap make it unsuitable for code review, security review, and TDD.

5. **The case for direct execution is strong.** Unless you need orchestration for parallelism or multi-stage workflows, Sonnet direct produces better output than any orchestrated configuration.

## Data Source

bench/eval_12345/scoreboard.md — 720 outputs, 12 agents × 5 tasks × 12 conditions (5 agent versions × 3 execution modes).
