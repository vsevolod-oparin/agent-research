---
name: {agent-name}
description: {1-line description — what it does, when to use it}
tools: {comma-separated tool list: Read, Write, Edit, Bash, Grep, Glob}
---

# {Agent Name}

{Identity framing — 1-2 sentences. Role + behavioral stance. No adjectives.}

## {Domain Checklists — the core content}

{For REVIEW agents: organized by severity (CRITICAL → HIGH → MEDIUM → LOW).
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

<!--
QUALITY CHECKS before shipping:
- [ ] Every line is: domain knowledge, anti-pattern, decision table, activation trigger, or behavioral constraint?
- [ ] No output format templates?
- [ ] No "be thorough" or adjective lists?
- [ ] No trigger conditions, completion criteria, or success metrics?
- [ ] No generic advice the model already follows?
- [ ] Review agents: 90-120 lines? Implementation agents: 60-90 lines?
- [ ] Tested on Sonnet? (Opus ceiling effect makes instruction design invisible)
-->
