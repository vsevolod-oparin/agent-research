# Anthropic Official Plugins Analysis

Two plugins from https://github.com/anthropics/claude-plugins-official that are directly relevant to our research.

## 1. skill-creator

**What it is:** A meta-skill for creating, testing, and iteratively improving other skills.

**Why it matters for our research:** It contains Anthropic's internal philosophy on writing effective instructions. Key findings that align with or extend our research:

### Confirmed findings

- **"Explain the why"** — "Try hard to explain the WHY behind everything. Today's LLMs are smart. They have good theory of mind and when given a good harness can go beyond rote instructions." This matches our finding that constraints with WHY explanations work better.

- **"Keep the prompt lean"** — "Remove things that aren't pulling their weight. Read the transcripts — if the skill is making the model waste time doing things that are unproductive, get rid of those parts." Directly confirms our knowledge vs process finding.

- **"Generalize, don't overfit"** — "Rather than put in fiddly overfitty changes, or oppressively constrictive MUSTs, try branching out and using different metaphors." This explains why v2's rigid templates failed.

- **"Avoid heavy-handed MUSTs"** — "If you find yourself writing ALWAYS or NEVER in all caps, that's a yellow flag — reframe and explain the reasoning." This is the anti-pattern we measured with v2.

### New insights not in our research

- **Progressive disclosure for skills:** Three-level loading: metadata (always in context, ~100 words) → SKILL.md body (on trigger, <500 lines) → bundled resources (as needed). This maps to our CLAUDE.md hierarchy recommendation.

- **Description "pushiness":** "Claude has a tendency to undertrigger skills. Make descriptions a little bit pushy." This is a triggering accuracy issue we haven't studied.

- **Eval-driven iteration:** The skill-creator enforces a formal eval loop: draft → test prompts → run with-skill vs baseline → grade → user review → improve → repeat. This is exactly our v1→v5 methodology, but formalized with tooling (viewer, grader agents, benchmark aggregation).

- **Blind comparison:** Using an independent agent to judge A vs B without knowing which is which. We used LLM-as-judge but didn't blind the conditions in the same structured way.

- **Look for repeated work across test cases:** "If all 3 test cases resulted in the agent writing a similar helper script, that's a signal the skill should bundle that script." Directly applicable to agent design — if the model consistently produces the same boilerplate, encode it.

### Actionable for our templates

1. Add description pushiness guidance to agent template: "Include specific contexts for when to use it, even if not explicitly asked"
2. Consider bundled scripts for agents that always produce similar boilerplate
3. Adopt the eval-driven iteration loop formally (we did it ad-hoc with bench/tasks)

## 2. claude-md-management

**What it is:** Two tools for CLAUDE.md maintenance:
- `claude-md-improver` (skill): Audits quality against rubric, proposes updates
- `/revise-claude-md` (command): Captures session learnings into CLAUDE.md

### Quality criteria rubric

Scores 0-100 across 6 dimensions (20+20+15+15+15+15):

| Criterion | Weight | Our template covers? |
|-----------|--------|---------------------|
| Commands/workflows | 20 | Yes (section 1) |
| Architecture clarity | 20 | Partially — we moved to knowledge file, they keep inline |
| Non-obvious patterns | 15 | Yes (gotchas section) |
| Conciseness | 15 | Yes (quality checks) |
| Currency | 15 | Yes (maintenance checklist) |
| Actionability | 15 | Yes (copy-paste commands) |

### Templates comparison

Their template includes sections we have (Commands, Architecture, Gotchas, Code Style) plus sections we don't emphasize:
- **Key Files** — entry points and important files
- **Environment** — required env vars and setup steps
- **Testing** — testing approach and commands (we fold into Commands)

### Update guidelines alignment

Their "What NOT to Add" list perfectly matches our research:
- Obvious code info (our: "generic knowledge the model already has")
- Generic best practices (our: "the test: would the bare model get this wrong?")
- One-off fixes (our: not in our guide but should be)
- Verbose explanations (our: "conciseness")

### New insight: /revise-claude-md as a flywheel

The `/revise-claude-md` command captures session learnings automatically. This creates a feedback loop:
1. Claude encounters a gotcha during work
2. End of session: `/revise-claude-md` proposes adding it
3. Next session: CLAUDE.md prevents the same gotcha

This is the "if a code review catches the same issue twice, it goes into CLAUDE.md" principle, but automated.

### Actionable for our guides

1. Add "Key Files" and "Environment" as optional sections in our template
2. Add "one-off fixes" to our DON'T list (currently missing)
3. Mention the `/revise-claude-md` command in our CLAUDE.md guide
4. Note the architecture clarity tension: their rubric gives it 20 points (highest weight tied with commands), but our research says to move it to a knowledge file. Resolution: a 1-2 line architecture summary in CLAUDE.md is fine and scores well on their rubric, while detailed architecture goes to knowledge file.

## Sources

- Plugin source: https://github.com/anthropics/claude-plugins-official
- skill-creator SKILL.md: 480 lines of Anthropic's skill design philosophy
- claude-md-management: quality-criteria.md, templates.md, update-guidelines.md, revise-claude-md.md
- Installed locally at ~/.claude/plugins/
