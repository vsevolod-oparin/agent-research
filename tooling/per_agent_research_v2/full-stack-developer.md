# Full-Stack Developer Agent: Research Findings

Date: 2026-03-23

## Our eval data

v1 scores 4.87, v3 scores 4.84, v4 scores 4.70 (verbosity penalty), bare scores 4.39-4.49. Agent instructions help (+0.38-0.48 lift over bare) — unlike research-analyst.

## The main chokepoint: Feedback loop, not the prompt

"Claude performs dramatically better when it can verify its own work" — Anthropic official docs.

The gap is between "generates plausible code" and "generates verified working code." Model capability is NOT the bottleneck — Opus/Sonnet already score well on SWE-bench.

### Chokepoint hierarchy
1. **No visual verification** — cannot see what it built (no browser preview). App generators (Lovable, Bolt) feel "magical" because they have built-in live preview
2. **Context pollution** — agents fill context with irrelevant file reads, degrading later output
3. **Missing current docs** — outdated API knowledge causes hallucinated patterns
4. **No test-run loop** — writes code but doesn't run tests to verify
5. **The prompt itself** — v4 is good on WHAT to build but silent on HOW to work (verification, planning, context management)

## Competitive landscape

| Tool | Best for | Weakness |
|------|----------|----------|
| **Claude Code** | Complex work on real codebases, deep reasoning, 500K+ lines | No visual preview, no deployment, requires expertise |
| **Cursor** | Experienced devs wanting AI acceleration | Solo experience, no deployment |
| **v0** | React/Next.js UI generation | Frontend only, locked to React |
| **Bolt.new** | Quick browser-based prototyping | Backend reliability issues, circular debugging loops |
| **Lovable** | Non-technical founders, sprint to MVP | 10% of apps had security issues, limited ceiling |
| **Replit** | General-purpose, plan-build-deploy | Performance degrades on complex projects |

Market splits: app generators (Lovable, Bolt, v0) optimize for zero-to-prototype speed. Developer tools (Cursor, Claude Code) optimize for quality on existing codebases.

## Known failure modes (from community)

- **80% problem**: 66% of devs report AI solutions "almost right but not quite." 45% say debugging AI code takes longer than writing it
- **Circular debugging**: Agent makes things worse trying to fix issues, loops endlessly
- **Security blind spots**: AI code has 1.5-2x more security bugs. Auth edge cases and input validation most common
- **Overengineering**: Generates "kitchen sink" solutions. The skill is knowing what to DELETE
- **Framework version drift**: Confidently writes code for outdated APIs
- **Context degradation**: "The 50th prompt produces worse code than the 5th"
- **Cannot verify UI**: Without browser preview, invisible rendering bugs accumulate

## What's missing from our v4 agent

### Not in the prompt at all
- **Verification loop**: explore → plan → implement → verify. The verification step is the highest-leverage gap
- **Context management**: When to compact, fresh sessions per feature, context hygiene
- **Plan-before-code**: Explicit explore-plan-code-verify phases
- **MCP/tool awareness**: Browser preview, database access, docs fetching
- **Testing strategy**: Zero mention of testing
- **Subagent delegation**: Security review, parallel work

### Present but weak
- **Tech selection**: Missing Supabase, Drizzle ORM, Clerk/Auth.js
- **Security**: Missing rate limiting, CSP headers, common AI auth mistakes
- **Error handling**: Only "empty catch blocks" — needs structured patterns

## Winning Claude Code setups (community patterns)

### CLAUDE.md essentials
- Build/test/lint/typecheck commands upfront
- Architecture decisions (DB, auth, API patterns)
- Gotchas (client/server boundary, unprotected routes)
- For each line: "Would removing this cause Claude to make mistakes?" If not, cut it

### MCP integrations that matter
- **Chrome DevTools** — browser preview + console errors (closes visual loop)
- **Supabase/PostgreSQL** — direct database interaction
- **Docs fetching** (context7) — current framework documentation
- **GitHub** — PR creation, issue reading

### Power user workflow
1. CLAUDE.md with commands, architecture, gotchas
2. Plan mode first — Claude interviews you, produces plan
3. /clear, fresh session with plan as context
4. Dev server in background, implement layer by layer
5. Chrome DevTools verifies UI
6. Tests after each significant change
7. Git commit frequently (rollback points)
8. /compact at 70%, /clear between features

## Recommendations for next version

### High impact, prompt changes
1. Add "Workflow" section: explore → plan → implement → verify
2. Add "Run tests after each layer" to checklist
3. Add "Run dev server in background, check for errors"
4. Add context management: "Fresh sessions per feature. Compact when heavy."

### High impact, new capabilities
5. MCP guidance: Chrome DevTools for visual verify, DB MCP, docs fetching
6. Testing section with concrete patterns
7. "Interview before building" pattern for ambiguous requirements

### Investigation needed
8. V1 scores 0.17 higher than v4 despite verbosity — may come from "behavioral guidance" (holistic approach, test-driven mindset) that v4 cut. Consider restoring
9. Opinionated framework recommendations (Wasp, T3 stack) reduce decision surface and improve AI output
