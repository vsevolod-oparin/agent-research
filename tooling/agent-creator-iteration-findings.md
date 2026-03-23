# Agent-Creator Plugin: Iteration Findings

Date: 2026-03-23

## The Core Problem

The agent-creator plugin started with v1 agents — the best-performing agents in our entire evaluation history (4.683 grand mean). The audit scored them 78-88/100, found "issues" in all 12, then "improved" them. Every single round of improvement produced agents that scored LOWER on actual output quality than the originals it was trying to fix.

**The auditor thinks the best agents are only B-grade, and its fixes make them worse.**

## Setup

The agent-creator plugin audited and rewrote all 12 v1 agents, then iteratively improved them via audit-improve cycles. 4 rounds total, each audited (see `claude-creator-post{1,2,3,4}-audit.md`). Results evaluated blind against v1 (hand-crafted), v2 (over-constrained), v4/v5 (hand-tuned), and bare model.

## Results

| Round | Condition | Grand Mean | Delta from v1 (4.683) | What changed |
|-------|-----------|-----------|----------------------|--------------|
| — | D (v1, hand-crafted) | **4.683** | baseline | — |
| 1 | L (initial rewrite) | **4.661** | -0.022 | Full rewrite by agent-creator |
| 2 | M (targeted fixes) | 4.606 | -0.077 | Audit-driven improvements |
| 3 | N (polish) | 4.569 | -0.114 | Further polish after audit |
| 4 | O (final polish) | 4.633 | -0.050 | More polish, partial recovery |
| — | I (v4/v5, hand-tuned) | 4.635 | -0.048 | — |
| — | F (bare, no agents) | 4.540 | -0.143 | — |
| — | E (v2, over-constrained) | 4.408 | -0.275 | — |

## Key Finding: Round 1 is best. Iteration degrades.

The trajectory is NOT monotonically improving. The first rewrite captured the highest value. Each subsequent audit-improve cycle degraded quality before partially recovering in round 4.

```
Round 1 (L): 4.661  ← best automated result
Round 2 (M): 4.606  ← -0.055 regression
Round 3 (N): 4.569  ← -0.037 further regression
Round 4 (O): 4.633  ← +0.064 partial recovery
```

## Why Round 1 Was Closest to v1

L was the least-modified version of v1. The first audit found relatively few "issues" (scores 78-88/100) and made conservative changes. The resulting agents preserved most of v1's domain knowledge while adding minor structural improvements. The damage was minimal (-0.022).

But even round 1 was a regression — the "improvements" over the best-performing agents were net negative.

## Why Subsequent Rounds Degraded

Each audit flagged "issues" that led to "improvements" which actually hurt:

1. **Introduced must_not violations.** Rounds 2-4 added code review patterns that complained about type hints in unchanged code — a must_not violation that cost ~0.3 points on affected tasks. Not present in round 1.

2. **Code reviewer regression.** The most affected agent:
   - L (round 1): 4.76
   - M (round 2): 4.35
   - N (round 3): 4.24
   - O (round 4): 4.36

3. **Over-polishing.** The audit rubric rewarded structural changes (adding sections, reformatting) that consumed token budget without adding knowledge. Same mechanism as the v2 failure.

4. **Rubric gaming.** The audit tool optimized for rubric score, not output quality. High rubric score ≠ high output quality — the same disconnect we measured across all versions.

## Why Round 4 Partially Recovered

O recovered on implementation tasks (fastapi-pro: 4.71, documentation-pro: 4.75) — the best scores for these agents across all conditions. The round 4 changes apparently improved implementation-focused agents while the code review regression persisted.

## The V2 Pattern Repeats

This is the same failure mode as v2, happening automatically:

| Version | Mechanism | Result |
|---------|-----------|--------|
| v2 (hand-written) | Added rigid templates, process sections | Scored worse than bare model |
| Rounds 2-4 (automated) | Audit-driven "improvements" added structure | Each round degraded from round 1 |

The common pattern: **optimizing for compliance with a rubric or process gradually displaces the knowledge content that actually helps the model.** Whether done by hand (v2) or by tool (rounds 2-4), the result is the same.

## Implications for the Agent-Creator Plugin

### What works
- **The design guide principles are correct.** The best agents (v1) embody them naturally — domain checklists, no rigid templates, reasonable length.
- **The plugin produces near-v1 quality when starting from scratch** (if given good reference material and design principles). Round 1 damage was minimal.

### The fundamental problem
- **The audit rubric does not predict output quality.** v1 agents score 78-88/100 on the rubric but produce the best actual output (4.683). The rubric penalizes things that don't hurt output (minor structural issues, missing "currency" info) and rewards changes that do hurt (adding process sections, reformatting checklists).
- **The audit-improve loop has no ground truth.** It optimizes for rubric score without measuring whether the "improved" agent actually produces better output. This is the core failure — it's optimizing a proxy metric that diverges from the real objective.

### What needs fixing

1. **Add "stop after round 1" guidance.** The plugin should recommend stopping unless a specific, measurable problem exists. Generic "polish" iterations hurt.

2. **Add a "do no harm" check to the audit.** If an agent scores above a threshold (e.g., 80/100 on the rubric), the audit should say "no changes recommended" rather than finding things to polish.

3. **Fix the code-reviewer template.** Add explicit "only review changed code unless CRITICAL security issue" to prevent the type-hints regression.

4. **Audit should measure output quality, not just rubric compliance.** The current rubric rewards structural changes that don't improve (and may degrade) actual output. Consider adding a "run a test task and compare" step before applying audit-suggested changes.

5. **Track regression explicitly.** The audit tool should compare before/after on at least one test task. If the "improved" agent scores lower, revert the change.

## Summary

The agent-creator audit rubric does not correlate with actual output quality. It scores the best agents (v1) as B-grade, then "improves" them into worse agents. The iteration loop amplifies this: each round optimizes further for rubric compliance, drifting further from what actually works.

The fix is not a better rubric — it's measuring what matters. The audit must include at least one ground-truth test task (run the agent, compare output to expected result) before recommending changes. Without that, it's optimizing a proxy that diverges from reality.

## Files

- `bench/eval_defilmno/scoreboard.md` — full evaluation with trajectory analysis
- `claude-creator-post{1,2,3,4}-audit.md` — audit reports for each round
- Agent-creator plugin: `/Users/smileijp/projects/research/agent-creator/`
