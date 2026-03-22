## Temporary Files

Use `tmp/` for temporary files and intermediate results.

---

## Tasks

Task prompts are in `tasks/`. Each file contains numbered tasks to complete. Read a task file and work through the tasks.

---

## Memory System

Two-tier memory: **Knowledge** (persistent) and **Session** (temporary).

```bash
# Knowledge
.claude/tools/memory.sh add <category> "<content>" [--tags a,b,c]
.claude/tools/memory.sh search "<query>"

# Session
.claude/tools/memory.sh session add <category> "<content>"
.claude/tools/memory.sh session show
```

---

## Web Search

Use `.claude/tools/web_search.sh "query"` for internet searches. Add `--sci` for scientific, `--med` for medical, `--tech` for tech queries.
