## Project

Research project evaluating Claude Code agent descriptions. No build/test/lint commands — this is a research repo with markdown, YAML task files, and agent prompt files.

## Temporary Files

Use `tmp/` for intermediate results, reports, and data during workflows.

## Gotchas

- IMPORTANT: Research output goes in `tooling/`, NOT `tmp/` — tmp is for ephemeral data only
- IMPORTANT: Never use the built-in WebSearch tool — use `.claude/tools/web_search.sh` instead
- Agent instructions are TEMPORARY — apply to current subtask only, discard after
- Agents don't load CLAUDE.md — all context must be in their prompt

## Agents

Folder: `.claude/agents/`. Use agents for all non-trivial subtasks.

- Before any subtask: select the best agent and read its `.md` file (fresh re-read every time)
- Load ONE agent at a time. Prefer specialized over general
- Discovery: Glob `.claude/agents/*.md`, Grep by keyword

## Web Research

Use `.claude/tools/web_search.sh "query1" "query2" --flags -s N`
- `--sci` for scientific/CS/physics/math topics
- `--med` for medical/biomedical topics
- `--tech` for software/DevOps/startup topics
- Combine flags for interdisciplinary queries

## Memory

Use `.claude/tools/memory.sh` — two-tier system (knowledge + session).
- `memory.sh add <category> "<content>" [--tags a,b,c]` — permanent knowledge
- `memory.sh session add <category> "<content>"` — current task tracking
- `memory.sh session show` — restore state after compaction
- After tasks: state "**Memories saved:** [list]" or "**Memories saved:** None"

## Opus-GLM

For non-trivial tasks, evaluate for GLM delegation (automatic by default).
- Read `.claude/knowledge/opus-glm.md` for full orchestration protocol
- Quick check: changes < 50 lines AND full context → handle directly, otherwise → delegate

## Knowledge

| File | Read when |
|------|-----------|
| `.claude/knowledge/opus-glm.md` | Delegating work to GLM agents |
| `.claude/knowledge/memory-system.md` | Detailed memory system reference |
| `tooling/agent-description-guide.md` | Writing or evaluating agent descriptions |
| `tooling/claude-md-guide.md` | Writing or evaluating CLAUDE.md files |
