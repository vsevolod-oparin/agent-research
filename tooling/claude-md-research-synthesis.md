# CLAUDE.md Research Synthesis

Findings from community research, distinct from or additive to our agent description guide.

---

## 1. What Community Consensus Says Works

### 1.1 The "always-loaded context tax" demands extreme brevity

CLAUDE.md is loaded into EVERY session. This is fundamentally different from agent descriptions (loaded per-task). Every wasted line degrades ALL tasks, not just the current one.

- Boris Cherny's team (Claude Code creators) uses **2.5k tokens (~100 lines)** [Source: alirezarezvani.medium.com, allahabadi.dev]
- Anthropic official docs: "For each line, ask: Would removing this cause Claude to make mistakes? If not, cut it." [Source: code.claude.com/docs/en/best-practices]
- Wisetax hit **700+ lines** and experienced degradation; restructured into knowledge layer [Source: dev.to/szkjn]
- Community consensus: root CLAUDE.md should be **50-100 lines with @imports** for deeper context [Source: morphllm.com]
- One source recommends **under 500 tokens (~400 words, ~25 lines)** for the root file [Source: dev.to/bobbyblaine, citing Faros AI research]

### 1.2 Five essential sections (community convergence)

Multiple independent sources converge on the same 5 sections:

1. **Project identity** — what it does, tech stack (1-3 lines)
2. **Build/test commands** — exact commands to run (`npm run dev`, `npm test`, etc.)
3. **Architecture conventions** — where things live, key patterns
4. **Coding standards** — what linters DON'T catch (naming, type rules, anti-patterns)
5. **Off-limits / gotchas** — files never to edit, non-obvious behaviors

[Sources: buildcamp.io, dev.to/bobbyblaine, claudedirectory.org, morphllm.com, builder.io, code.claude.com]

### 1.3 Progressive disclosure — the scaling pattern

Instead of stuffing everything into one file, use CLAUDE.md as a **map** that points to deeper context:

```
## Knowledge
| File | When to read |
| `.claude/knowledge/autonomous-agent.md` | Working on the main chat agent |
| `.claude/knowledge/evaluations.md` | Working on evaluation framework |
```

Claude reads only what's relevant. This is how teams scale past the 100-line limit.

[Source: dev.to/szkjn (Wisetax), buildcamp.io, morphllm.com]

### 1.4 Living document via team contribution

- Check CLAUDE.md into git, whole team contributes
- "If a code review catches the same issue twice, it goes into CLAUDE.md" [Source: allahabadi.dev]
- Add a PR template line: "Did you update CLAUDE.md?" [Source: dev.to/bobbyblaine]
- The `/update-knowledge` skill pattern: automated end-of-session review [Source: dev.to/szkjn]
- Self-documenting mistakes: "Every time I correct you, add a new rule to CLAUDE.md" — flywheel effect [Source: hashlytics.io]

### 1.5 Verification requirements in CLAUDE.md

Adding exact verification commands to CLAUDE.md causes Claude to run them automatically:

```
## Verification
- Run `npm test` after code changes
- Run `npm run typecheck` before marking complete
```

Boris Cherny claims verification improves final quality **2-3x**. [Source: allahabadi.dev, code.claude.com]

### 1.6 Context ordering matters

Models attend more to content at the **beginning and end** of the context window. Critical constraints belong at the top. Instructions buried in the middle of a 3,000-token CLAUDE.md get deprioritized.

[Source: dev.to/bobbyblaine, citing Faros AI research]

---

## 2. What Community Consensus Says Fails

### 2.1 The /init trap

`/init` generates a starter CLAUDE.md, but the generated file includes obvious things. Community consensus: **run /init, then delete 40% of what it produces**.

[Source: hashlytics.io, morphllm.com, builder.io]

### 2.2 Bloated files — the #1 mistake

- At 32,000 tokens, most LLMs drop below 50% accuracy on recall tasks [Source: allahabadi.dev]
- "Bloated CLAUDE.md files cause Claude to ignore your actual instructions" — Anthropic official [Source: code.claude.com]
- Wisetax: 700+ lines → experienced degradation [Source: dev.to/szkjn]
- One developer: 847 lines, 8x longer than Boris's file, producing worse results [Source: alirezarezvani.medium.com]

### 2.3 Stale CLAUDE.md is worse than no CLAUDE.md

"A CLAUDE.md written for an Express codebase that was later migrated to Fastify actively misleads the agent. This is worse than no file at all." [Source: dev.to/bobbyblaine]

"Outdated file paths, deprecated patterns, or legacy tech listed prominently mislead Claude into errors that are hard to trace back to the file." [Source: builder.io]

### 2.4 Including things the model already knows

Identical finding to our agent guide, but CLAUDE.md-specific framing: "If Claude already does something correctly without the instruction, remove it. Pergerrupted files make Claude lose track of the important rules." [Source: reymer.ai, hashlytics.io]

### 2.5 Code style rules that linters handle

"Code style guidelines (your linter handles this)" — repeatedly cited as the #1 content to cut. Use hooks instead:

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{ "type": "command", "command": "npm run format || true" }]
    }]
  }
}
```

[Source: allahabadi.dev, hashlytics.io, morphllm.com]

### 2.6 Task-specific instructions in root CLAUDE.md

"Instructions about how to structure a database schema, write a specific API endpoint, or handle a one-off migration don't belong in your root CLAUDE.md." Those belong in `.claude/rules/` scoped to specific paths/globs.

[Source: buildcamp.io]

---

## 3. Real Examples — What Good CLAUDE.md Files Contain

### 3.1 Minimal Next.js example (morphllm.com)

```
# Commands
- Dev: `bun run dev` (port 3000)
- Test: `bun test` (single: `bun test path/to/file`)
- Lint: `bun run lint`
- Typecheck: `bun run typecheck`
- Build: `bun run build`

# Code style
- Use ES modules (import/export), not CommonJS
- Prefer named exports over default exports
- Use TypeScript strict mode — no `any` types

# Architecture
- Database: PostgreSQL with Drizzle ORM
- See @docs/api-patterns.md for REST conventions

# Workflow
- IMPORTANT: Always typecheck after a series of code changes
- Prefer running single tests, not the whole suite

# Gotchas
- IMPORTANT: Never import from @/lib/server in client components
- The /api/webhooks route must remain unprotected by auth
- Drizzle migrations: run `bun run db:push`, never edit SQL directly
```

~25 lines. Note: no code style rules the linter catches, no generic advice.

### 3.2 Minimal Payments API (dev.to/bobbyblaine)

```
# Project: Payments API
**Stack:** Node.js 22, TypeScript 5.7, Postgres 16, Prisma ORM

## Architecture
- API routes in `src/routes/`, one file per resource
- Business logic in `src/services/`, never in route handlers
- All DB queries through Prisma -- no raw SQL

## Standards
- Named exports only. No `any` -- use `unknown` and narrow.
- Env vars via `process.env`, validated with Zod at startup.

## Off-limits
- `prisma/migrations/` -- never edit directly
- `src/generated/` -- overwritten on next build

## Before finishing any task
- Run `npm test` and confirm all pass
- Run `npm run lint` and fix all errors
```

Under 25 lines.

### 3.3 awesome-claude-md repository (github.com/josix)

Curated collection of 80+ real CLAUDE.md files from production projects. Notable patterns observed:
- Best examples are 25-100 lines
- Security-first projects (Citadel Protocol) emphasize off-limits sections
- Monorepo projects (Cloudflare Workers SDK, Lerna) use hierarchical CLAUDE.md
- Testing-focused projects (React Native Testing Library) emphasize test commands and conventions

[Source: github.com/josix/awesome-claude-md]

---

## 4. CLAUDE.md-Specific Issues (Not Applicable to Agent Descriptions)

### 4.1 Always-loaded context tax

Agent descriptions load per-task. CLAUDE.md loads EVERY time. This means:
- Every line competes with the user's actual task for attention
- Bad instructions create bad outputs across ALL tasks
- The ROI calculation is different: a line in CLAUDE.md must prevent mistakes across ALL task types, not just one

[Source: buildcamp.io, code.claude.com]

### 4.2 File hierarchy and inheritance

Claude Code reads CLAUDE.md from multiple locations with inheritance:

| Level | Location | Purpose |
|-------|----------|---------|
| Enterprise/IT | `/Library/Application Support/ClaudeCode/CLAUDE.md` (macOS) | Org-wide policies |
| Personal global | `~/.claude/CLAUDE.md` | Cross-project preferences |
| Project | `./CLAUDE.md` | Team rules (checked into git) |
| Local override | `./CLAUDE.local.md` | Personal prefs (.gitignored) |
| Subdirectory | `./src/auth/CLAUDE.md` | Module-specific rules |

Higher = loaded first. More specific = takes precedence. Child CLAUDE.md files load **on-demand** when Claude works in that directory.

[Source: buildcamp.io, agentrulegen.com, dev.to/letanure, tokencentric.app]

### 4.3 Interaction with .claude/rules/

Path-scoped rules in `.claude/rules/` enable conditional loading:

```yaml
---
paths:
  - "src/api/**/*.ts"
---
# API Development Rules
- All API endpoints must include input validation
```

This keeps root CLAUDE.md lean. Rules load only when working on matching files.

[Source: buildcamp.io, agentrulegen.com, deployhq.com]

### 4.4 Interaction with hooks

Hooks are **deterministic** — they execute every time, unlike CLAUDE.md which is advisory. The right split:
- CLAUDE.md: conventions Claude should follow (advisory)
- Hooks: things that MUST happen (deterministic, e.g., auto-format on save)
- Skills: lazy-loaded resources triggered by task matching

[Source: dev.to/bobbyblaine, morphllm.com, allahabadi.dev]

### 4.5 Compaction interaction

When Claude compacts conversation history, CLAUDE.md survives (re-read at session boundaries). But instructions that were given in the conversation may be lost. This makes CLAUDE.md the **stable anchor** — critical rules that must persist through compaction belong here, not in prompts.

Customizing what survives compaction is also possible via CLAUDE.md:
```
# When compacting, preserve:
- The full list of modified files
- Any test commands and their results
- The current implementation plan
```

[Source: morphllm.com, habr.com]

### 4.6 Build commands — unique to CLAUDE.md

Agent descriptions don't include build commands. CLAUDE.md is the canonical location for:
- Dev server start command
- Test runner command (full suite AND single file)
- Lint/format commands
- Build command
- Database migration commands

These are the most universally valuable content. Claude can discover them with /init but may get them wrong.

[Source: nearly every source]

---

## 5. Quantitative Findings

### 5.1 Ideal length

| Source | Recommended Length |
|--------|-------------------|
| Boris Cherny (Claude Code creator) | ~2.5k tokens (~100 lines) |
| Buildcamp.io | 50-100 lines root + @imports |
| dev.to/letanure | Under 100 lines |
| dev.to/bobbyblaine (citing Faros AI) | Under 500 tokens (~25 lines) |
| hashlytics.io | Under 200 lines |
| allahabadi.dev | Under 2,500 tokens (~100-130 lines) |
| morphllm.com | 50-100 lines root |

**Consensus range: 50-130 lines for root file.** Deeper context via @imports or knowledge files.

### 5.2 Instruction decay

- Buildcamp research: instruction-following degrades as instruction count increases. Sonnet shows **exponential** decay; Opus shows **linear** [Source: buildcamp.io, our agent guide]
- Stanford/UC Berkeley: model correctness drops around 32K tokens even for larger windows — "lost-in-the-middle" effect [Source: dev.to/bobbyblaine]
- "You're not just adding noise to one rule, you're degrading Claude's ability to follow ALL of them" [Source: hashlytics.io]
- Claude Code's system prompt already uses ~50 instructions, leaving limited room for task complexity [Source: hashlytics.io]

### 5.3 Productivity impact

- "First-attempt accuracy" is the clearest signal that CLAUDE.md is working [Source: dev.to/bobbyblaine]
- Teams report 40% fewer production bugs after adding test coverage rules [Source: hashlytics.io]
- Boris claims verification improves quality 2-3x [Source: allahabadi.dev]
- 66% of developers report "the 80% problem" — AI solutions almost right but not quite [Source: morphllm.com, citing Addy Osmani]

---

## 6. Cross-Tool Comparison

### 6.1 Feature comparison

| Feature | CLAUDE.md | .cursorrules | copilot-instructions.md | AGENTS.md |
|---------|-----------|-------------|------------------------|-----------|
| Hierarchy | 5 layers | Single file → .cursor/rules/ | 2 layers | Single file |
| Global config | Yes (~/.claude/) | No | Org-level | No |
| Glob scoping | Yes (.claude/rules/) | Yes (frontmatter) | Yes (.github/instructions/) | No |
| Memory/learning | Yes | No | No | No |
| Token visibility | Yes | No | No | No |
| Cross-platform | CLI + IDE | Cursor only | VS Code | ChatGPT/Codex |

[Source: tokencentric.app, agentrulegen.com, deployhq.com]

### 6.2 Content overlap is ~80%

"The content will be 80% identical — your project architecture, build commands, and coding conventions are the same regardless of which AI reads them." Many teams maintain a canonical doc and compile to each format.

[Source: tokencentric.app]

### 6.3 Cursor character limits

Individual Cursor rule files capped at 6,000 characters, total combined rules max 12,000 characters. CLAUDE.md has no hard limit but soft-degrades.

[Source: deployhq.com]

### 6.4 Convergence trend

AGENTS.md (from OpenAI) follows the same format. Frame project symlinks CLAUDE.md → AGENTS.md. Pre-commit hooks that sync all formats exist in the wild.

[Source: agentrulegen.com, github.com/kaanozhan/Frame]

---

## 7. The "What NOT to Include" List

### Should be in CLAUDE.md:
- Build/test/lint commands
- Architecture conventions linters can't enforce
- Off-limits files and directories
- Non-obvious gotchas ("Never import from @/lib/server in client components")
- Verification requirements
- Domain-specific facts the model gets wrong

### Should be in `.claude/rules/` (not root CLAUDE.md):
- Path-scoped conventions (API rules, test patterns)
- Framework-specific patterns for subdirectories
- Module-specific coding standards

### Should be in hooks (not CLAUDE.md):
- Code formatting (auto-format PostToolUse hook)
- Linting enforcement
- Any deterministic action that must happen every time

### Should be in skills (not CLAUDE.md):
- Task-specific workflows (deployment, PR creation)
- Complex multi-step procedures
- Domain-specific analysis patterns

### Should be in code/config (not CLAUDE.md):
- Code style rules (use linter config: .eslintrc, .prettierrc, ruff.toml)
- Type checking settings (tsconfig.json)
- Git hooks (pre-commit, husky)
- CI/CD configuration

### Should be in README/docs (not CLAUDE.md):
- Detailed API documentation (link from CLAUDE.md instead)
- Onboarding guides for humans
- Historical context and decision logs (use knowledge files)
- Information that changes frequently

### Should NOT exist anywhere:
- "Write clean code" / "Use best practices" — generic advice the model already follows
- Trigger conditions / completion criteria / success metrics (zero measured benefit per our eval data)
- Adjective lists ("be thorough, systematic, comprehensive")
- Rigid output format templates
- Step-by-step workflow instructions (the model knows how to work)

---

## 8. Key Findings DIFFERENT From Agent Descriptions

1. **Length ceiling is much lower.** Agent descriptions: 60-150 lines. Root CLAUDE.md: 25-100 lines. Because CLAUDE.md competes with EVERY task, not just one.

2. **Build commands are uniquely valuable.** Agent descriptions don't need `npm run test`. CLAUDE.md does — these are the most universally cited content.

3. **Progressive disclosure replaces length.** Agent descriptions are self-contained. CLAUDE.md should be a MAP pointing to deeper knowledge files, rules, and docs.

4. **Staleness is more dangerous.** A stale agent description produces one bad output. A stale CLAUDE.md produces bad outputs across all tasks indefinitely until someone notices.

5. **Team contribution matters more.** Agent descriptions are maintained by one person. CLAUDE.md should be a shared, git-committed, team-contributed living document.

6. **Hooks replace some instructions.** Agent descriptions can't use hooks. CLAUDE.md instructions for formatting/linting should be REPLACED by deterministic hooks.

7. **Hierarchy enables scoping.** Agent descriptions are flat. CLAUDE.md has 5 inheritance levels + path-scoped rules, enabling much more targeted context delivery.

8. **Context ordering matters.** Not relevant for agent descriptions (loaded in full). For CLAUDE.md, critical constraints go at the top due to positional attention bias.
