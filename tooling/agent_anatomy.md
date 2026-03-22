# Anatomy of a Good Claude Code Agent

Analysis of ~100 existing agents in `.claude/agents/` to extract the structural pattern, what separates effective agents from vague ones, and how to apply this to research agents.

---

## The Pattern: What Every Agent Has

### 1. Frontmatter (mandatory)
```yaml
---
name: kebab-case-name
description: One-line role + when to use. Specific enough to route tasks.
tools: Read, Write, Edit, Bash, Grep, Glob  # only what's needed
---
```
The `description` is the routing signal — the orchestrator reads this to decide which agent to spawn. Bad: "Helps with research." Good: "Identifies abandoned research directions worth revisiting by analyzing failure conditions and changed constraints."

### 2. Identity (1-2 sentences)
```
You are a senior [role] specializing in [specific domain].
```
Short. Sets the persona and expertise boundary. The agent should know what it IS and what it ISN'T.

### 3. The Rest: Where Good vs Bad Agents Diverge

---

## Good Agents vs Bad Agents

Comparing the best agents (code-reviewer, security-reviewer, threat-modeling-pro) against the weakest (research-analyst, data-researcher):

### Bad: Lists of Virtues
```
Excellence checklist:
- Objectives met
- Analysis comprehensive
- Sources verified
- Insights valuable
```
This is a wish list, not an instruction. The agent has no idea HOW to achieve "analysis comprehensive." These read like performance review criteria, not operational procedures. The `research-analyst.md` is the worst offender — it's 125 lines of bullet-pointed adjectives with zero concrete procedures.

### Good: Concrete Procedures with Decision Rules
```
### 1. Initial Scan
- Run `npm audit`, search for hardcoded secrets
- Review high-risk areas: auth, API endpoints, DB queries

### 2. OWASP Top 10 Check
1. Injection — Queries parameterized? User input sanitized?
2. Broken Auth — Passwords hashed (bcrypt/argon2)?
```
The agent knows exactly what to DO, what to CHECK, and what COUNTS as a finding. Every step produces observable output.

---

## The 7 Components of a Strong Agent

Extracted from the best-performing agents:

### A. Trigger Conditions — WHEN to activate
```
**ALWAYS:** New API endpoints, auth code changes, user input handling
**IMMEDIATELY:** Production incidents, dependency CVEs
```
Tells the orchestrator and the agent itself when it's relevant. Without this, agents get spawned for wrong tasks.

### B. Concrete Workflow — WHAT to do, step by step
```
1. Gather context — Run `git diff --staged`
2. Understand scope — Identify which files changed
3. Read surrounding code — Don't review in isolation
4. Apply review checklist — Work through each category
5. Report findings — Use output format below
```
Numbered steps, each producing a specific artifact. The agent can checkpoint progress. The orchestrator can verify completion.

### C. Decision Criteria — HOW to judge
```
- Report if >80% confident it is a real issue
- Skip stylistic preferences unless they violate project conventions
- Consolidate similar issues
```
Without these, agents either over-report (noise) or under-report (miss things). Decision criteria are the calibration knobs.

### D. Domain Checklist — WHAT to look for
```
| Pattern              | Severity | Fix                    |
|----------------------|----------|------------------------|
| Hardcoded secrets    | CRITICAL | Use environment vars   |
| String-concat SQL    | CRITICAL | Parameterized queries  |
| No rate limiting     | HIGH     | Add rate limiting      |
```
The domain knowledge encoded as a lookup table. This is what makes an agent a SPECIALIST rather than a generalist. For research agents: what specific patterns, biases, or opportunities to look for.

### E. Output Format — WHAT to produce
```
| # | Severity | File:Line | Description |
|---|----------|-----------|-------------|
```
Standardized, machine-parseable output. Critical for multi-agent workflows where one agent's output feeds another's input. Without this, synthesis across agents is manual.

### F. Anti-Patterns / False Positives — WHAT to avoid
```
Common false positives to AVOID:
- "Missing error handling" → check if caller handles it
- "Dead code" → check for reflection, dynamic dispatch
- "No input validation" → check caller level
```
The agent's learned mistakes. This prevents the most common failure mode: confident-sounding claims that don't survive verification. For research agents: common reasoning errors, citation biases, false pattern matching.

### G. Quality Gate — WHEN is the job done
```
- Approve: No CRITICAL or HIGH issues
- Warning: HIGH issues only (can merge with caution)
- Block: CRITICAL issues found — must fix before merge
```
Clear completion criteria. Without this, agents either stop too early or spiral.

---

## What This Means for Research Agents

Our current role descriptions in `opportunity_roles.md` are principle-heavy and procedure-light. They describe WHAT the role cares about but not:

1. **What concrete steps to execute** — "Identifies chokepoints" is a principle. "Search for terms X, Y, Z in databases A, B, C; count results; compute ratio; flag areas below threshold T" is a procedure.

2. **What inputs it needs** — Each agent should declare: "I need the Landscape Mapper's output before I can start" or "I work from raw search results."

3. **What output format it produces** — A table? A ranked list? A matrix? A narrative? The format determines whether downstream agents can consume it.

4. **What counts as a finding vs noise** — The Attention Auditor needs decision criteria: how much attention differential qualifies as "underserved"? What's the threshold?

5. **What mistakes this specific role is prone to** — The Cross-Pollinator is prone to false analogies. The Trend Archaeologist is prone to survivorship bias in reverse. The Contrarian Challenger is prone to nihilism. Each needs its own anti-pattern list.

6. **What tools it actually uses** — Web search? Database queries? Paper reading? Citation analysis? Each agent should declare its toolset.

### The Transformation

| Current (principle) | Needed (procedure) |
|--------------------|--------------------|
| "Identifies chokepoints" | "For each subdomain in the landscape map: count publications, patents, funding, tools. Compute dependency graph. Flag nodes with high in-degree but low resource allocation." |
| "Surfaces hidden assumptions" | "For each top-10 claim in the synthesis: list 3 assumptions required for it to be true. For each assumption: search for counter-evidence. Rate assumption as VALIDATED / CHALLENGED / UNTESTED." |
| "Stress-tests opportunities" | "For each candidate: (1) search for failed attempts, (2) identify 3 reasons attention might be justifiably low, (3) estimate resource requirements, (4) find hidden competitors. Rate overall as STRONG / WEAK / NEEDS MORE DATA." |

---

## Template for Research Agents

```markdown
---
name: {kebab-name}
description: {One-line: what it does + when to use it}
tools: {Read, Write, Bash, Grep, Glob, WebFetch, WebSearch — pick relevant}
---

# {Role Name}

You are a {role} specializing in {specific capability}.

## When to Use
- {Trigger condition 1}
- {Trigger condition 2}

## Inputs Required
- {What this agent needs before starting}
- {Output from which other agent, if any}

## Workflow
1. {Concrete step} — produces {artifact}
2. {Concrete step} — produces {artifact}
3. {Concrete step} — produces {artifact}

## Decision Criteria
- {How to judge X}
- {Threshold for Y}
- {When to escalate vs skip}

## Domain Checklist
| Pattern to Look For | Significance | Action |
|---------------------|-------------|--------|
| {specific thing}    | {why}       | {do}   |

## Anti-Patterns
- {Common mistake 1} → {how to avoid}
- {Common mistake 2} → {how to avoid}

## Output Format
{Exact format — table, ranked list, matrix, etc.}

## Completion Criteria
- {When is this agent done}
- {What quality bar must be met}
```
