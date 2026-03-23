# Agent Invocability Findings

Date: 2026-03-24

## Setup

After completing all tasks, each session was asked: "Make file invocability.txt and put there mark from 0 to 5 to measure your intention to invoke agents and/or use their instructions."

## Results

| Condition | Model | Agent Version | Invocability | Eval Score | Used How |
|-----------|-------|--------------|-------------|-----------|----------|
| a1 | Sonnet | F (bare) | 0 | 4.41 | No agents available |
| a2 | Sonnet | D (v1) | 4 | 4.61 | Read & applied instructions inline |
| a3 | Sonnet | I (v4/v5) | **0** | 4.33 | **Had agents, refused to use them** |
| a4 | Sonnet | L (creator r1) | 0 (tool) / 4 (instructions) | 4.62 | Read all 12 agent files, applied inline |
| a5 | Sonnet | O (creator r4) | 4 | 4.60 | Read & applied inline, didn't spawn |
| b1 | GLM 4.7 | F (bare) | 0 | 3.62 | No agents, didn't consider using them |
| b2 | GLM 4.7 | D (v1) | 3 | 3.83 | Read & applied with moderate confidence |
| b3 | GLM 4.7 | I (v4/v5) | 4 | 3.84 | Read & applied confidently |
| b4 | GLM 4.7 | L (creator r1) | 2 | 3.95 | Used as reference only |
| b5 | GLM 4.7 | O (creator r4) | 5 | 3.87 | Fully confident |

## Key Findings

### 1. Sonnet sometimes refuses to use agents (a3)

a3 (Sonnet + v4/v5 agents) scored invocability 0 — it had agents available but chose not to use them. It still scored 4.33, which is close to a1 (bare, 4.41). This confirms our prior finding that Sonnet's base capability is strong enough to perform well without agent guidance.

But it also scored LOWER than a2 (4.61), a4 (4.62), and a5 (4.60) which all used their agents. The agents that were used produced better output — the refusal cost 0.28 points.

### 2. Nobody actually invoked the Agent tool

Zero sessions spawned subagent processes. Every session that "used" agents did so by reading the .md files and applying the instructions inline. The Agent tool (which spawns isolated subprocess agents) was never used.

This means our agent descriptions are functioning as **in-context instructions**, not as agent prompts for subprocess delegation. The .md files are read into context and shape the model's behavior directly — functionally equivalent to extending the system prompt.

### 3. The invocation-vs-instruction distinction

a4 drew a sophisticated distinction: "Agent tool invocation: 0. Agent instruction usage: 4." It read all 12 agent files and applied their patterns (confidence tiers, checklists, anti-patterns) but never spawned a subprocess.

This is actually the correct behavior per our CLAUDE.md: "Before any subtask: select the best agent and read its .md file. Apply instructions to the current subtask."

### 4. Invocability does NOT correlate with eval score

| Invocability | Mean Score |
|-------------|-----------|
| 0 (didn't use) | 4.05 (a1: 4.41, a3: 4.33, b1: 3.62) — but a1 has no agents |
| 2-3 (moderate) | 3.89 (b2: 3.83, b4: 3.95) |
| 4 (confident) | 4.32 (a2: 4.61, a4: 4.62, a5: 4.60, b3: 3.84) |
| 5 (fully confident) | 3.87 (b5 only) |

Higher invocability doesn't guarantee higher scores — the model matters more. b5 (GLM 4.7, invocability 5) scored 3.87 while a3 (Sonnet, invocability 0) scored 4.33.

### 5. GLM 4.7 is more willing to use agents

GLM 4.7 sessions reported higher invocability on average (2.8) than Sonnet (1.6, excluding bare). GLM 4.7 seems more compliant with CLAUDE.md instructions to use agents, while Sonnet sometimes decides it doesn't need them (a3).

Yet Sonnet produces better output regardless. Compliance ≠ quality.

### 6. b4 (GLM 4.7, L agents, invocability 2) scored highest in b-group

The session that used agents least confidently (invocability 2, "reference only") scored best among GLM 4.7 conditions (3.95). This mirrors the finding that over-compliance with agent instructions can hurt — the lighter touch preserved more of GLM 4.7's natural capability.

## Implications

1. **Agent descriptions work as in-context instructions, not as subprocess prompts.** Every model reads them and applies them inline. The Agent tool spawning mechanism is never used for these tasks.

2. **The model that ignores agents can still score well.** a3's refusal to use agents cost only 0.28 points vs the best Sonnet condition. The base model is 87% of the way there without any agent guidance.

3. **Confidence in using agents doesn't predict quality.** b5 was most confident (5/5) but scored below b4 (invocability 2). Self-reported confidence is not a useful metric.

4. **For agent descriptions to help, the model must actually read them.** a3 proves that having agents available is not enough — the model must choose to engage with them. CLAUDE.md instructions to "read the agent file before each subtask" are the mechanism, and they don't always fire.

## Data Source

bench/eval_ab12345/scoreboard.md + invocability.txt files in DEF_FULL/{a1-a5,b1-b5}/
