# How to Write CLAUDE.md

Empirical guide based on community research, cross-tool comparison, and our agent description experiments (420+ evaluated outputs).

Companion to `agent-description-guide.md`. Same core principles (knowledge > process, stay out of the model's way) but with CLAUDE.md-specific constraints.

---

## The Key Difference from Agent Descriptions

CLAUDE.md is **always loaded**. Agent descriptions load per-task. This means:
- Every line in CLAUDE.md competes with EVERY task for attention
- Bad instructions degrade ALL output, not just one task
- A line must prevent mistakes across ALL task types to earn its place
- The length budget is much tighter: **25-100 lines root** (vs 60-150 for agents)

---

## The Five Essential Sections

Multiple independent sources converge on these. In this order (critical first — positional attention bias means top content gets more weight):

### 1. Build / Test / Lint Commands (most universally valuable)

```markdown
## Commands
- Dev: `npm run dev` (port 3000)
- Test: `npm test` (single: `npm test -- path/to/file`)
- Lint: `npm run lint`
- Typecheck: `npx tsc --noEmit`
- Build: `npm run build`
- DB migrate: `npx prisma migrate dev`
```

Exact commands. Include single-file test syntax. Include port numbers. These save the most correction cycles.

### 2. Gotchas and Off-Limits (highest ROI per line)

Non-obvious facts the model will get wrong without explicit instruction.

```markdown
## Gotchas
- IMPORTANT: Never import from `@/lib/server` in client components
- The `/api/webhooks` route must remain unprotected by auth middleware
- Drizzle migrations: run `npm run db:push`, never edit SQL files directly
- `prisma/migrations/` and `src/generated/` are auto-generated — never edit
```

The test: "Has Claude gotten this wrong before?" If yes, it goes here.

### 3. Architecture pointer (1-2 lines in root, details in a knowledge file)

```markdown
## Architecture
- See `docs/architecture.md` for project structure and patterns
- Auth: Clerk middleware on `/dashboard/*`, webhooks unprotected
```

Architecture details are only relevant when changing architecture — not on every task. Put the full description in a knowledge file and reference it from CLAUDE.md. Only keep architecture gotchas (like unprotected routes) in root because those prevent mistakes on any task.

```markdown
## Knowledge
| File | Read when |
| `docs/architecture.md` | Changing project structure, adding new modules |
```

### 4. Coding Standards (linter gaps only)

Only rules your linter/formatter does NOT enforce:

```markdown
## Standards
- Named exports only (no default exports)
- No `any` types — use `unknown` and narrow
- Env vars via `process.env`, validated with Zod at startup
- Error handling: custom AppError class, never raw strings
```

If ESLint/Prettier/Ruff catches it, it does NOT belong here. Use hooks instead.

### 5. Verification (what to run before finishing)

```markdown
## Before finishing
- Run `npm test` — all must pass
- Run `npm run typecheck` — zero errors
- Run `npm run lint` — fix all warnings
```

Boris Cherny (Claude Code creator) claims verification improves quality 2-3x.

---

## What Works (DO)

### Keep root CLAUDE.md under 100 lines

The evidence:
- Boris Cherny's team: ~100 lines / 2.5k tokens
- Community consensus: 50-100 lines root + @imports for deeper context
- Buildcamp: instruction decay is exponential on Sonnet
- At 700+ lines, Wisetax experienced degradation and restructured

### Use progressive disclosure to scale

CLAUDE.md is a map, not a dump. Point to deeper knowledge:

```markdown
## Knowledge
| File | When to read |
| `.claude/knowledge/auth.md` | Working on authentication |
| `.claude/knowledge/api-patterns.md` | Writing API endpoints |
| `docs/architecture.md` | Changing system architecture |
```

Claude reads these on demand, not on every task.

### Put critical constraints at the top

Positional attention bias: content at the beginning of context gets more weight. Your most important rules go first. Build commands and gotchas before coding standards.

### Use IMPORTANT: prefix for critical rules

```markdown
- IMPORTANT: Always typecheck after code changes
- IMPORTANT: Never push directly to main
```

Claude Code gives higher priority to lines marked IMPORTANT.

### Make it a team document

- Check into git. Whole team contributes.
- "If a code review catches the same issue twice, it goes into CLAUDE.md."
- Add to PR template: "Did you update CLAUDE.md?"
- Review CLAUDE.md in quarterly maintenance sweeps.

### Use hooks for deterministic enforcement

Hooks execute every time. CLAUDE.md is advisory. The split:

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{ "type": "command", "command": "npx prettier --write $FILE || true" }]
    }]
  }
}
```

Formatting/linting rules: hooks. Architecture/design rules: CLAUDE.md.

### Use path-scoped rules for module-specific conventions

```yaml
# .claude/rules/api-rules.md
---
paths:
  - "src/api/**/*.ts"
---
- All endpoints must validate input with Zod schemas
- Return consistent error format: { error: string, code: number }
```

Keeps root CLAUDE.md lean. Rules load only when working on matching files.

---

## What Doesn't Work (DON'T)

### DON'T exceed 100 lines in root

At 700+ lines, measured degradation. Claude's system prompt already uses ~50 instructions. Your CLAUDE.md adds to that. The more you add, the less all instructions are followed — including your most important ones.

### DON'T include what linters enforce

```
Bad:  "Use semicolons at end of statements"     → .eslintrc handles this
Bad:  "Use 2-space indentation"                  → .prettierrc handles this
Bad:  "Sort imports alphabetically"              → eslint-plugin-import handles this
Good: "Named exports only (no default exports)"  → no standard linter rule for this
```

### DON'T include generic advice the model already follows

```
Bad:  "Write clean, maintainable code"
Bad:  "Use meaningful variable names"
Bad:  "Handle errors appropriately"
Bad:  "Follow SOLID principles"
```

The test: remove the line, run the same task. Did anything change? If no, the line is noise.

### DON'T include task-specific instructions in root

API endpoint patterns, database schema guidance, migration procedures — these belong in `.claude/rules/` scoped to the relevant paths, or in knowledge files loaded on demand.

### DON'T include one-off fixes

```
Bad:  "We fixed a bug in commit abc123 where the login button didn't work."
```

Won't recur. Clutters the file. (Source: Anthropic's claude-md-management update-guidelines.md)

### DON'T let it go stale

A stale CLAUDE.md is worse than no CLAUDE.md. "A CLAUDE.md written for Express that was later migrated to Fastify actively misleads the agent." If your stack, commands, or architecture change, update CLAUDE.md immediately.

Use `/revise-claude-md` (from the `claude-md-management` plugin) at end of sessions to capture learnings automatically. This creates a flywheel: encounter gotcha → capture it → prevent it next session.

### DON'T include step-by-step workflows

Same as agent descriptions: process instructions are attention tax.

```
Bad:  "1. Read the file. 2. Understand the context. 3. Make changes. 4. Test."
Good: "Run `npm test` after changes."
```

### DON'T include output format templates

```
Bad:  "Format all responses as: ## Summary\n### Changes\n### Testing"
```

The model knows how to structure output. Let it.

### DON'T start from /init without editing

`/init` generates a starter that includes obvious content. Run it, then delete 40-60% — keep only what passes the "would removing this cause mistakes?" test.

---

## Where Things Belong

| Content | Location | Why |
|---------|----------|-----|
| Build/test/lint commands | **CLAUDE.md** | Needed on every task |
| Gotchas and off-limits | **CLAUDE.md** | Prevent mistakes across all tasks |
| Architecture details | **Knowledge file** | Only relevant when changing architecture |
| Architecture gotchas | **CLAUDE.md** | Prevent mistakes across all tasks (e.g., unprotected routes) |
| Module-specific standards | **`.claude/rules/`** | Scoped loading, doesn't tax unrelated tasks |
| Code formatting rules | **Hooks** | Deterministic > advisory |
| Linting rules | **Linter config** | `.eslintrc`, `ruff.toml`, etc. |
| Detailed API patterns | **Knowledge files** | Loaded on demand via CLAUDE.md map |
| Task workflows (deploy, PR) | **Skills** | Triggered per-task, not always-loaded |
| Type checking config | **`tsconfig.json`** | Let tooling handle it |
| CI/CD config | **Pipeline files** | Not relevant to coding tasks |
| "Write clean code" | **Nowhere** | The model already does this |

---

## CLAUDE.md Hierarchy

5 layers, from broadest to most specific:

| Layer | File | Purpose | Example |
|-------|------|---------|---------|
| Enterprise | `/Library/.../ClaudeCode/CLAUDE.md` | Org-wide policies | Security standards, compliance |
| Personal | `~/.claude/CLAUDE.md` | Cross-project prefs | "I prefer TypeScript", "Always use named exports" |
| Project | `./CLAUDE.md` | Team rules (git-committed) | Build commands, architecture, gotchas |
| Local | `./CLAUDE.local.md` | Personal overrides (.gitignored) | "I'm working on auth this sprint" |
| Subdirectory | `./src/auth/CLAUDE.md` | Module-specific | "Auth uses Clerk. Never store tokens in localStorage" |

Child files load on demand when Claude works in that directory. Use this to keep root lean.

---

## Maintenance Checklist

Run quarterly or when the stack changes:

- [ ] Are build/test/lint commands still accurate?
- [ ] Is the tech stack description current?
- [ ] Are off-limits files/dirs still valid?
- [ ] Are there new gotchas from recent incidents?
- [ ] Can any lines be moved to `.claude/rules/` or hooks?
- [ ] Does every remaining line pass the "would removing this cause mistakes?" test?
- [ ] Is total length under 100 lines?

---

## Template

```markdown
## Commands
- Dev: `{command}` (port {N})
- Test: `{command}` (single: `{command} {path}`)
- Lint: `{command}`
- Typecheck: `{command}`
- Build: `{command}`

## Gotchas
- IMPORTANT: {most critical gotcha}
- IMPORTANT: {second most critical gotcha}
- {other gotchas, one per line}

## Architecture
- {where routes/handlers live}
- {where business logic lives}
- {database access pattern}
- {auth pattern}

## Standards
- {rule linters don't catch}
- {rule linters don't catch}

## Before finishing
- Run `{test command}` — all must pass
- Run `{typecheck command}` — zero errors

## Knowledge
| File | When to read |
| `{path}` | {trigger condition} |
```

~25-40 lines. Add lines only when Claude makes mistakes without them.

---

## Sources

- Boris Cherny (Claude Code creator): ~100 lines, verification 2-3x quality improvement
- Buildcamp.io: instruction decay curves, 50-100 line recommendation
- Anthropic official docs: "Would removing this cause mistakes?"
- Wisetax (dev.to/szkjn): 700+ line degradation, progressive disclosure solution
- Faros AI: positional attention bias, context ordering
- dev.to/bobbyblaine: minimal CLAUDE.md examples
- morphllm.com: scaling patterns, @imports
- awesome-claude-md (github.com/josix): 80+ real CLAUDE.md files
- Our eval data: 420+ outputs across 7 conditions confirming knowledge > process
