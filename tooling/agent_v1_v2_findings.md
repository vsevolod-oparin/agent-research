# Agent V1 vs V2 Evaluation Findings

Date: 2026-03-22

## Setup

- 12 agents evaluated across 3 conditions × 5 tasks = 180 outputs
- D = v1 agents (current), E = v2 agents (rewrite), F = bare (no agents)
- Execution model: Sonnet (via GLM framework)
- Evaluation: LLM-as-judge, 6 dimensions, composite scoring

## Results

| Condition | Grand Mean | Output Lines |
|-----------|-----------|-------------|
| D (v1) | **4.71–4.79** | 7,571 |
| E (v2) | 4.44–4.45 | 2,767 |
| F (bare) | 4.48–4.52 | 4,066 |

V1 won 9/12 agents. V2 lost to bare on several agents.

## Root Cause: V2 Over-Constrains Sonnet

V2 agents are longer (+48 lines avg) with more structure: checklists, anti-patterns, verification rules, rigid output templates. On Sonnet, this:

1. **Compressed output to 27–47% of v1 size.** V2 made Sonnet dramatically more concise.
2. **Killed Depth** (v1: 4.88, v2: 3.75, Δ = -1.13). The biggest scoring dimension loss.
3. **Killed Completeness** (v1: 4.88, v2: 4.30, Δ = -0.58). Fewer must-mention items hit.
4. **Won only Efficiency** (v1: 3.82, v2: 4.97, Δ = +1.15). But rubric doesn't weight this enough to compensate.
5. **Bare outperformed v2** on multiple agents — v2 instructions actively suppressed natural output quality.

## The Efficiency–Depth Tradeoff

V2 optimized for signal density at the cost of coverage. On Sonnet:
- More prescriptive instructions → shorter output → fewer ground truth items
- V1's shorter, looser instructions → more freedom → more thorough output
- Bare model with no instructions produced more thorough output than v2 on several agents

## Model Sensitivity

- **Opus 4.6** (ABC eval): All conditions scored ~4.75. Agent instructions irrelevant — ceiling effect.
- **Sonnet** (DEF eval): V1 = 4.71, V2 = 4.44, Bare = 4.48. Agent instructions matter — but direction matters more than quantity.

## Design Principles for V3

1. **Keep instructions short** — v1 length or shorter. Every line must earn its place.
2. **Preserve v2's best additions** in compact form: false positive lists, anti-pattern bullets, severity calibration examples. These help Precision without hurting Depth.
3. **Do NOT add rigid output templates.** Let the model choose its own structure. Suggest, don't mandate.
4. **Explicitly encourage thoroughness.** Add a line like "Cover edge cases and non-obvious scenarios" rather than specifying what format to use.
5. **Avoid long workflow/process sections.** These consume context and produce compliance-over-quality output on Sonnet.
6. **Test on Sonnet, not Opus.** Agent instructions are invisible at Opus level. Sonnet is the target model.

## Files

- `bench/eval_def/scoreboard.md` — report-only eval
- `bench/eval_def_full/scoreboard.md` — full eval with code artifacts
- `bench/eval_abc/scoreboard.md` — Opus eval (ceiling effect)
