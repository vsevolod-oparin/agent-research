# How to Write Agent Descriptions for Claude Code

Empirical guide based on 5 versions, 7 conditions, 420+ evaluated outputs, and external research.

---

## The Evidence Base

| Version | Avg Lines | Grand Mean | What Happened |
|---------|-----------|-----------|---------------|
| v1 | 106 | **4.74** | Accidental sweet spot. Loose instructions, some filler, but didn't constrain the model |
| v2 | 153 | 4.44 | Over-constrained. Rigid templates, long workflows killed Depth and Completeness |
| v3 | 71 | 4.63 | Too aggressive cuts. Lost domain checklists that review agents needed |
| v4 | 71 | 4.70 | Split strategy worked. Restored review checklists, kept compact implementation agents |
| v5-partial | 71 | **4.71** | One agent updated, rest unchanged. Best methodology |
| v5-full | 93 | 4.49 | Research-driven redesign of all 12 agents. Regressed to bare/v2 level |
| bare | -- | 4.49 | No agent instructions at all |

---

## What Works (DO)

### 1. Domain checklists — the highest-value content

Concrete lists of what to check for. These are knowledge injection — they remind the model of items it might skip.

**Evidence:** v3→v4 gained +0.47 on code-reviewer by restoring React/Next.js, Node.js/Backend, and Performance checklists. The single largest improvement from any prompt change.

```
Good: "Check for N+1 queries — fetching related data in a loop instead of JOIN/batch"
Good: "Missing dependency arrays in useEffect/useMemo/useCallback"
Good: "Parameterized queries only. No string interpolation in SQL"
```

Each item should name a specific failure pattern, not a generic category.

### 2. Anti-patterns and false positive lists — precision boosters

Lists of what NOT to flag or what NOT to do. These prevent known failure modes.

**Evidence:** "grep before claiming X is missing" is the single most impactful line in code-reviewer. False positive prevention is the #1 differentiator in the commercial code review market.

```
Good: "Before claiming 'missing error handling' — check the caller; it may be handled upstream"
Good: "SHA256/MD5 for checksums is fine — only flag for password hashing"
Good: "NEVER modify a failing test to make it pass. Fix the implementation, not the test"
```

### 3. Decision tables — when to choose what

Compact tables that encode decision logic the model might get wrong.

**Evidence:** Technology selection tables, severity calibration tables, and sync/async decision tables all tested well across v3-v5.

```
Good: | App Type | Focus Areas | Lower Priority |
      | REST API | Auth, input validation, rate limiting | XSS (no HTML) |
      | Web App  | XSS, CSRF, session management | CLI injection |
```

### 4. Knowledge activation triggers — brief domain headers

One-line section headers that activate the model's latent knowledge on topics it otherwise skips.

**Evidence:** fastapi-pro v1 (4.82) beat v4 (4.52) because v1's broad domain headers ("Authentication & Security", "Observability", "Testing Patterns") triggered coverage of those topics. v4 had better actionable content but missed entire domains.

```
Good: "## Authentication & Security" followed by 2-3 key bullets
Good: "## Testing Patterns" followed by specific test guidance
```

One line to open the door. The model fills in the rest.

### 5. Constraints that prevent known failures

Rules that stop the model from doing something it naturally does wrong.

**Evidence:** tdd-guide's Red Phase enforcement (+0.55 over bare). The model's #1 failure is writing tests and code simultaneously. The instruction forces discipline.

```
Good: "Write the test. Run it. Confirm it FAILS. Only then write implementation"
Good: "Server-side auth checks on ALL protected routes — hiding UI buttons is not security"
Good: "Do not suggest merging packages to resolve import cycles"
```

### 6. Identity framing — 1-2 lines maximum

A brief role statement sets behavioral mode.

**Evidence:** Consistent across all versions. The opening line matters.

```
Good: "You are a senior code reviewer ensuring high standards of code quality and security."
Good: "You build complete features from database to UI. Shipping working software over architectural purity."
```

### 7. Graduated confidence over binary gates

For review/audit agents, use confidence tiers instead of report/don't-report gates.

**Evidence:** security-reviewer v4 (4.74) lost to v1 (4.87) because v4's "prove it is reachable" requirement caused self-censoring. The model suppressed findings for the most dangerous vulnerability classes (race conditions, authorization logic) where evidence chains are hardest to construct.

```
Good: "Label findings: CONFIRMED (evidence chain proven) / LIKELY (pattern matches) / POSSIBLE (suspicious, needs investigation). Report ALL tiers."
Bad:  "Only report vulnerabilities you can prove are reachable. Without proof, downgrade to informational."
```

---

## What Doesn't Work (DON'T)

### 1. DON'T add rigid output format templates

Templates constrain the model's natural expression and consume attention budget.

**Evidence:** v2's rigid templates (severity tables, finding templates, completion checklists) were the primary cause of its 4.44 score. The model spent tokens on format compliance instead of analysis.

```
Bad:  "Use this exact format: ### [SEVERITY] Finding Title\n- **File**: path\n- **Issue**: ...\n- **Suggestion**: ...\n- **Confidence**: HIGH/MEDIUM"
Good: "Report findings with severity, file location, and fix suggestion."
```

### 2. DON'T add workflow/process sections

Step-by-step process instructions are attention tax. The model knows how to work.

**Evidence:** Every version that added process sections (v2 workflows, v5's multi-phase approaches) regressed. Process instructions consume context budget without adding domain knowledge.

```
Bad:  "Step 1: Read the file. Step 2: Check for X. Step 3: Write findings. Step 4: Verify findings. Step 5: Format output."
Good: "Check for X. Verify before claiming — grep the codebase first."
```

Exception: the explore→plan→implement→verify workflow for full-stack-developer is a constraint preventing a known failure (skipping verification), not a generic process.

### 3. DON'T add "be thorough" or thoroughness instructions

Anthropic's 4.6 models are already proactive. Explicit thoroughness creates compliance conflict.

**Evidence:** Every agent that removed "be thorough" in v4 maintained or improved scores. The line has zero measured effect on output quality.

```
Bad:  "Be thorough — cover edge cases, explore non-obvious scenarios. Depth matters more than brevity."
Good: (just don't include it — the model is already thorough)
```

### 4. DON'T add trigger conditions, completion criteria, or success metrics

These waste tokens. The agent is already triggered — it doesn't need to know when to activate.

**Evidence:** v2 added these to every agent (+15-25 lines each). Zero measured benefit. v3 cut them all with no regression.

```
Bad:  "## Trigger Conditions\nActivate when: code has been written, PR is ready, bug fix completed..."
Bad:  "## Completion Criteria\nReview is complete when: every file read, every category checked..."
Bad:  "## Success Metrics\n- No CRITICAL issues found\n- All HIGH issues addressed"
```

### 5. DON'T add generic knowledge the model already has

If Sonnet reliably produces this knowledge without prompting, the instruction is noise.

**Evidence:** dotnet-framework-pro has only +0.08 lift over bare — the model already knows .NET 4.8. Generic best practices ("write clean code", "use version control") compete with your task for attention.

```
Bad:  "Use parameterized queries for database access" (every developer model knows this)
Good: "ConfigureAwait(false) is REQUIRED in Framework 4.8 (SynchronizationContext exists, unlike Core)" (non-obvious, Framework-specific)
```

The test: "Would the bare model get this wrong?" If no, cut it.

### 6. DON'T change all agents simultaneously

The #1 methodology lesson from v5's failure.

**Evidence:** v5-partial (updating 1 agent) improved grand mean by +0.01. v5-full (updating all 12) regressed by -0.22. Same design principles, opposite outcomes. Simultaneous changes make it impossible to identify what broke.

```
Bad:  Redesign 12 agents based on research, ship as a batch
Good: Update 1 agent, evaluate, confirm improvement, then next agent
```

### 7. DON'T over-constrain with verification requirements

Requirements that sound rigorous can suppress the model's detection capability.

**Evidence:** security-reviewer's "prove reachability" requirement filtered out race conditions and authorization bugs — the most dangerous classes where proof is hardest. The two-phase approach (detect everything first, then triage) outperforms single-pass verified detection.

### 8. DON'T write adjective lists as instructions

Listing qualities ("systematic", "thorough", "comprehensive", "actionable") does nothing. Show, don't tell.

**Evidence:** v1 research-analyst was 125 lines of adjective lists ("Systematic approach", "Multiple sources", "Critical thinking"). It scored identically to bare model. Zero lift.

```
Bad:  "Conduct thorough, comprehensive, systematic research with rigorous methodology"
Good: "Search for counter-arguments before concluding. State confidence levels for each source."
```

---

## The Right Length

| Agent Type | Target Lines | Why |
|-----------|-------------|-----|
| Review/audit agents | 90-120 | Domain checklists ARE the product. More checklist items = better recall |
| Implementation agents | 60-90 | Model knows how to code. Needs guardrails and decision tables, not tutorials |
| Research/analysis agents | 30-50 | Bare model ties v1. Only add anti-hallucination rules and tool guidance |

**The ceiling is ~150 lines.** Beyond this, instruction-following degrades uniformly on Sonnet (exponential decay curve per Buildcamp research). At 153 lines, v2 hit the decay zone.

**The floor is ~40 lines.** Below this, you lose domain checklists that prevent false positives and severity miscalibration.

**More lines ≠ better.** v5 at 93 lines scored worse than v4 at 71 lines. What matters is the CONTENT type, not the quantity:
- 100 lines of domain checklists > 150 lines of process instructions
- 70 lines of anti-patterns > 120 lines of workflows + templates

---

## What Content Earns Its Place

For every line in an agent description, it must be one of these:

| Content Type | Value | Example |
|-------------|-------|---------|
| **Domain checklist item** | Knowledge injection — reminds model of specific failure patterns | "Missing keys in lists — array index as key when items reorder" |
| **Anti-pattern / false positive** | Prevents known mistake | "SHA256 for checksums is fine. Only flag for passwords" |
| **Decision table row** | Encodes choice logic | "REST API → focus on auth/validation. Web App → focus on XSS/CSRF" |
| **Knowledge activation trigger** | Opens a topic the model skips | "## Background Tasks" (1 line, 2-3 bullets) |
| **Behavioral constraint** | Stops a known bad behavior | "One test at a time. Never batch tests before implementing" |
| **Non-obvious domain fact** | Something the model gets wrong by default | "ConfigureAwait(false) required in Framework 4.8 (SynchronizationContext)" |
| **Identity framing** | Sets the role | "You are a senior security specialist" (1-2 lines max) |

If a line doesn't fit any of these categories, cut it.

---

## Non-Agent-Description Chokepoints

Some problems cannot be solved by better instructions. These are the real ceilings:

### 1. Lack of tool access (biggest for research/analysis agents)

The model's knowledge has a cutoff. Without web search, citation databases, or document ingestion, research agents are limited to stale training data.

**Evidence:** research-analyst scores identically with or without instructions (4.47-4.54 across all versions). Bare model ties v1. Every successful research tool (Perplexity, Elicit, Deep Research) is model + live retrieval.

**Fix:** MCP integrations (Brave Search, Semantic Scholar, database access), web_search.sh tool usage guidance in the agent.

### 2. No feedback loop (biggest for implementation agents)

The model cannot see what it built. Without browser preview, test execution, or dev server output, it generates plausible but unverified code.

**Evidence:** "Claude performs dramatically better when it can verify its own work" — Anthropic official docs. App generators (Lovable, Bolt) that feel "magical" all have built-in live preview.

**Fix:** Chrome DevTools MCP, background dev server with error checking, test execution after each implementation layer.

### 3. Context window degradation

Performance degrades as context fills. "The 50th prompt produces worse code than the 5th."

**Evidence:** Buildcamp research shows instruction-following degrades uniformly as instruction count rises. Sonnet shows exponential decay; Opus shows linear.

**Fix:** Fresh sessions per feature, compact at 70%, context hygiene (don't read files you don't need).

### 4. Model knowledge currency

The model's training data has a cutoff. Agent instructions that encode stale facts cause incorrect guidance.

**Evidence:** java-pro's top anti-pattern ("Never synchronized around I/O in virtual threads") was wrong for JDK 24+ (JEP 491 eliminated synchronized pinning). Stale instructions are worse than no instructions.

**Fix:** Periodically audit domain-specific facts in agent descriptions against current documentation. Add version numbers to claims.

### 5. Eval rubric limitations

Our LLM-as-judge rubric penalizes verbosity (Efficiency dimension) even when the verbose output includes working code. This creates a bias against agents that produce code artifacts alongside reports.

**Evidence:** H/I consistently scored 3/5 on Efficiency for producing thorough markdown + working tests, while D scored 4/5 for markdown-only. The rubric doesn't reward executable output.

**Fix:** Weight Actionability higher when the task involves code generation. Consider a separate "code works" binary dimension.

---

## The Meta-Lesson

The instruction set that works best is the one that:
1. **Adds knowledge the model lacks** (domain checklists, non-obvious facts, version-specific gotchas)
2. **Prevents mistakes the model makes** (false positive checks, anti-patterns, behavioral constraints)
3. **Stays out of the model's way** for everything else (no process, no templates, no generic advice)

The model is already good. Your job is to make it accurate on the edges, not to teach it fundamentals.

---

## Recommended Update Methodology

1. **Identify the gap.** What specific task does the agent get wrong? What must_mention items does it miss? What must_not items does it violate?
2. **Add the minimum fix.** A single checklist item, anti-pattern, or decision table row that addresses the gap.
3. **Evaluate the single change.** Run the benchmarks. Did the score improve? Did anything else regress?
4. **Ship if positive.** Move to the next agent.
5. **Never batch.** v5-full (12 agents changed simultaneously) regressed. v5-partial (1 agent changed) improved. Always one at a time.

---

## Sources

- Buildcamp, "The Ultimate Guide to CLAUDE.md" (2026): instruction decay curves
- "Same Task, More Tokens" (arXiv 2402.14848): reasoning degrades at 3K redundant tokens
- "Verbosity != Veracity" (ICLR 2025): verbosity compensation behavior
- Parsimony in Context Engineering (Rezvov, 2026): parsimonious instructions survive compression
- Anthropic prompting docs: "Claude 4.6 is significantly more proactive"
- Addy Osmani / ETH Zurich: auto-generated context degrades performance
- Our eval data: 5 versions × 7 conditions × 12 agents × 5 tasks = 420+ scored outputs
