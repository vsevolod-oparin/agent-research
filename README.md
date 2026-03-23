# How to Write Agent Descriptions and CLAUDE.md for Claude Code

Empirical research on what makes AI agent instructions effective. Based on 5 agent versions, 7 experimental conditions, 420+ LLM-judged outputs, 12 specialized agents, and external research synthesis.

## Research Synopsis

We iteratively designed, tested, and evaluated agent description files (system prompts) for Claude Code across 12 specialized agents (code-reviewer, security-reviewer, tdd-guide, fastapi-pro, etc.). Each version was blindly evaluated against ground-truth task rubrics using an LLM-as-judge methodology.

**The core finding:** The model is already good. Your job is to make it accurate on the edges, not to teach it fundamentals. Specifically:

- **Domain checklists** (what to check for) **ADD capability** — they're knowledge injection that improves recall
- **Process instructions** (how to check), output templates, and workflow steps **SUBTRACT capability** — they consume attention and constrain output
- **The bare model (no instructions) scored 4.49/5.0.** Bad instructions (v2, 153 lines avg) scored 4.44 — worse than no instructions at all
- **The best instructions (v1/v4, 71-106 lines)** scored 4.70-4.74 — a modest but consistent lift of +0.21-0.25 over bare
- **Changing all agents simultaneously** caused regressions. **Changing one at a time** with measurement produced improvements. Never batch.

### Version Evolution

| Version | Avg Lines | Score | What Happened |
|---------|-----------|-------|---------------|
| v1 | 106 | **4.74** | Accidental sweet spot. Loose, some filler, didn't constrain |
| v2 | 153 | 4.44 | Rigid templates killed Depth. Worse than bare model |
| v3 | 71 | 4.63 | Cut too much — lost review checklists that genuinely helped |
| v4 | 71 | 4.70 | Split strategy: compact implementation + restored review checklists |
| v5-partial | 71 | **4.71** | One agent updated. Best methodology |
| v5-full | 93 | 4.49 | All 12 redesigned. Regressed to bare level |

---

## Guides

### [Agent Description Guide](tooling/agent-description-guide.md)

Full guide with evidence for every recommendation. Key takeaways:

**DO:**
1. **Domain checklists** — concrete lists of what to check for. Highest-value content. (v3->v4 gained +0.47 on code-reviewer by restoring React/Node/Performance checklists)
2. **Anti-patterns and false positive lists** — "grep before claiming X is missing" is the single most impactful instruction we tested
3. **Decision tables** — compact tables encoding choice logic the model gets wrong
4. **Knowledge activation triggers** — brief 1-line domain headers that activate latent model knowledge on topics it skips
5. **Behavioral constraints** — rules stopping known bad behaviors (e.g., TDD Red Phase enforcement: +0.55 over bare)
6. **Graduated confidence** — for review agents, use CONFIRMED/LIKELY/POSSIBLE tiers, not binary report/don't-report gates

**DON'T:**
1. **Rigid output templates** — the #1 score killer across all versions
2. **Workflow/process sections** — attention tax, not knowledge
3. **"Be thorough"** — Anthropic 4.6 models are already proactive; explicit thoroughness creates compliance conflict
4. **Trigger conditions, completion criteria, success metrics** — zero measured benefit
5. **Generic knowledge the model already has** — the test: "Would the bare model get this wrong?" If no, cut it
6. **Batch changes** — v5-full (12 agents) regressed; v5-partial (1 agent) improved
7. **Strict verification gates** — "prove reachability" caused self-censoring on the most dangerous vulnerability classes

**Non-prompt chokepoints** (problems instructions can't solve):
- Lack of tool access (research agents need web search, not better prompts)
- No feedback loop (implementation agents need browser preview / test execution)
- Context window degradation (fresh sessions per feature, compact at 70%)
- Model knowledge currency (stale facts in instructions are worse than no instructions)

### [CLAUDE.md Guide](tooling/claude-md-guide.md)

Full guide for project-level CLAUDE.md files. Key takeaways:

**CLAUDE.md is always loaded — every line competes with every task.** Root file: 25-100 lines max.

**The five essential sections** (in this order — critical first due to positional attention bias):
1. **Build/test/lint commands** — most universally valuable content
2. **Gotchas and off-limits** — highest ROI per line
3. **Architecture pointer** — link to dedicated doc, only gotchas inline (full architecture is a knowledge file, not always-loaded context)
4. **Standards** — only what linters DON'T enforce
5. **Verification** — what to run before finishing (2-3x quality improvement per Boris Cherny)

**Key differences from agent descriptions:**
- Much tighter length budget (25-100 lines vs 60-150)
- Use **progressive disclosure**: CLAUDE.md as a map pointing to knowledge files
- Use **hooks** for deterministic enforcement (formatting, linting)
- Use **`.claude/rules/`** for path-scoped conventions
- Staleness is more dangerous — affects ALL tasks indefinitely
- Critical constraints at the TOP (positional attention bias)

---

## Templates

### Agent Description Template

```markdown
---
name: {agent-name}
description: {1-line description — what it does, when to use it}
tools: {comma-separated tool list: Read, Write, Edit, Bash, Grep, Glob}
---

# {Agent Name}

{Identity framing — 1-2 sentences. Role + behavioral stance. No adjectives.}

## {Domain Checklists — the core content}

{For REVIEW agents: organized by severity (CRITICAL -> HIGH -> MEDIUM -> LOW).
For IMPLEMENTATION agents: organized by layer or decision type.
Each item: specific failure pattern, not generic category.}

### {Category 1} ({Severity or Layer})

- **{Pattern name}** — {what's wrong and why it matters}
- **{Pattern name}** — {what's wrong and why it matters}

### {Category 2} ({Severity or Layer})

- **{Pattern name}** — {what's wrong and why it matters}

## Anti-Patterns / False Positives

{What NOT to flag or do. Prevents known mistakes. One per line.}

- **{False positive}** — {why it's not actually a problem, and how to verify}
- **{Anti-pattern}** — {what the model does wrong by default, and the correct behavior}

## Decision Table

{When to choose what. Compact table for choices the model might get wrong.}

| Situation | Choose | Why |
|-----------|--------|-----|
| {condition} | {option} | {reason} |

## {Knowledge Activation Triggers — optional, for broad-domain agents}

{Brief section headers (1 line each) with 2-3 key bullets.
These activate the model's latent knowledge on topics it otherwise skips.}

### {Domain Area 1}
- {key fact or pattern}
- {key fact or pattern}

### {Domain Area 2}
- {key fact or pattern}

## Behavioral Constraints

{Rules that stop known bad behaviors. Only include if the model reliably does this wrong.}

- {constraint} — {why: what goes wrong without this rule}
```

Quality checks before shipping:
- Every line is: domain knowledge, anti-pattern, decision table, activation trigger, or behavioral constraint?
- No output format templates?
- No "be thorough" or adjective lists?
- No trigger conditions, completion criteria, or success metrics?
- No generic advice the model already follows?
- Review agents: 90-120 lines? Implementation agents: 60-90 lines?
- Tested on Sonnet? (Opus ceiling effect makes instruction design invisible)

### CLAUDE.md Template

```markdown
## Commands

- Dev: `{command}` (port {N})
- Test: `{command}` (single file: `{command} {path}`)
- Lint: `{command}`
- Typecheck: `{command}`
- Build: `{command}`
- DB migrate: `{command}`

## Gotchas

- IMPORTANT: {most critical gotcha — the thing that wastes the most time when Claude gets it wrong}
- IMPORTANT: {second most critical gotcha}
- {other non-obvious facts, one per line}
- {files/dirs that are auto-generated and must never be edited}

## Architecture

- See `{path to architecture doc}` for project structure and patterns
- {only architecture gotchas that prevent mistakes on ANY task, e.g., unprotected routes}

## Standards

{ONLY rules your linter/formatter does NOT enforce.}

- {naming convention linters don't catch}
- {type usage rule} (e.g., no `any`, use `unknown` and narrow)
- {import/export convention} (e.g., named exports only)
- {error handling pattern} (e.g., custom error class, never raw strings)
- {env var handling} (e.g., validated with Zod at startup)

## Before Finishing

- Run `{test command}` — all must pass
- Run `{typecheck command}` — zero errors
- Run `{lint command}` — fix all warnings

## Knowledge

{Optional — for projects large enough to need progressive disclosure.}

| File | Read when |
|------|-----------|
| `{path}` | {working on what} |
| `{path}` | {working on what} |
```

Quality checks before committing:
- Under 100 lines?
- Every line passes "would removing this cause Claude to make mistakes?"
- No rules that linters/formatters already enforce?
- No generic advice ("write clean code", "handle errors")?
- No step-by-step workflows or output templates?
- Critical constraints at the top (positional attention bias)?
- Build commands are accurate and tested?
- Off-limits files/dirs are current?
- Module-specific rules moved to `.claude/rules/` instead?
- Formatting enforcement moved to hooks instead?

Maintenance: review when stack, commands, or architecture change. Quarterly audit: does every line still prevent real mistakes?

---

## Repository Structure

```
tooling/
  agent-description-guide.md    # Full agent description guide with evidence
  claude-md-guide.md            # Full CLAUDE.md guide with evidence
  template-agent-description.md # Agent description template
  template-claude-md.md         # CLAUDE.md template
  agent_eval.md                 # Evaluation framework
  agent_v1_v2_findings.md       # v1-v5 evaluation findings
  prompt-research-synthesis.md  # External prompt engineering research
  research-agent-chokepoints.md # Research agent limitations
  full-stack-developer-research.md
  per_agent_research/           # Per-agent research (initial)
  per_agent_research_v2/        # Per-agent deep research (dedicated searches)

agents_v1 thru v5/             # Agent description versions
bench/                         # Evaluation tasks and scoreboards
  tasks/                       # Ground-truth task YAMLs
  eval_abc/                    # Opus evaluation
  eval_def/                    # Sonnet report-only evaluation
  eval_def_full/               # Sonnet full evaluation (with code artifacts)
  defg_eval/                   # v3 evaluation
  eval_defghij/                # v5 evaluation (final)
```

## Essential Reading

Start with the official Claude Code documentation: **https://code.claude.com/docs/**

Several of our key findings originate from or are confirmed by Anthropic's official guidance — particularly the CLAUDE.md best practices ("would removing this cause mistakes?"), the 4.6 proactive behavior change (don't add "be thorough"), and the verification quality multiplier. Read the docs first, then use this research to go deeper.

Also see these official Anthropic plugins (installable via `/plugin`):
- **[skill-creator](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/skill-creator)** — Contains Anthropic's internal philosophy on writing effective instructions: "explain the why", "keep prompts lean", "avoid heavy-handed MUSTs", eval-driven iteration loops. Confirms our core findings. See [our analysis](tooling/anthropic-official-plugins-analysis.md).
- **[claude-md-management](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-md-management)** — CLAUDE.md quality auditing (6-dimension rubric) and session-learning capture (`/revise-claude-md`). The quality rubric and update guidelines align closely with our CLAUDE.md guide.

## Meta-Lesson

> The instruction set that works best adds knowledge the model lacks, prevents mistakes the model makes, and stays out of the model's way for everything else.

The model is already good. One well-placed checklist item outperforms a page of process instructions.
