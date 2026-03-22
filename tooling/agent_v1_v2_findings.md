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

## V3 Results (2026-03-23)

V3 agents were designed following the principles above: 71 lines avg (vs v1: 106, v2: 153).

### DEFG Eval (D=v1, E=v2, F=bare, G=v3)

| Condition | Grand Mean |
|-----------|-----------|
| D (v1) | **4.80** |
| G (v3) | 4.71 |
| F (bare) | 4.52 |
| E (v2) | 4.40 |

**V3 is the closest challenger to v1** (gap: 0.09). V3 ties or beats v1 on 5/12 agents (all implementation tasks). V3's weakness: review/analysis tasks (code-reviewer: -0.43, research-analyst: -0.21 vs v1).

### V3 Diagnosis

- **Implementation agents (fastapi-pro, full-stack, documentation, java): v3 matches v1.** The compact format with anti-patterns works. No rigid templates → Sonnet produces thorough output naturally.
- **Review agents (code-reviewer, security-reviewer): v3 underperforms v1.** V3 cut too much from v1's detailed checklists (v1 code-reviewer: 122 lines → v3: 75 lines). The checklist items (React patterns, Node patterns, Performance patterns) appear to genuinely help Sonnet on review tasks — they're not filler.
- **Research agent: v3 underperforms v1 and bare.** V1's adjective lists are useless, but v3's compact format may have cut the wrong things. Bare model (F) tied v1 here.

### V3 Design Refinement for V4

1. **Split strategy by task type:** Implementation agents → keep v3 compact format. Review agents → restore v1-length checklists.
2. **code-reviewer v3 needs:** full React/Next.js checklist, full Node.js/Backend checklist, full Performance checklist restored from v1. These are domain knowledge Sonnet doesn't reliably produce on its own.
3. **research-analyst:** Neither v1 (adjective filler) nor v3 (compact) works well. Bare model ties v1. Consider a minimal agent that only adds anti-hallucination rules and source evaluation criteria.
4. **Keep v3 format for all other agents** — it works.

## Files

- `bench/eval_def/scoreboard.md` — report-only eval (D/E/F)
- `bench/eval_def_full/scoreboard.md` — full eval with code artifacts (D/E/F)
- `bench/eval_abc/scoreboard.md` — Opus eval (ceiling effect)
- `bench/defg_eval/scoreboard.md` — full eval with v3 (D/E/F/G)
- `agents_v3/` — v3 agent files
- `tooling/agent_v1_v2_findings.md` — this file
