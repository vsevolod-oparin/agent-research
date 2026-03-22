## Temporary Files

Use `tmp/` for temporary files and intermediate results.

---

## Tasks

Task prompts are in `tasks/`. Each file contains numbered tasks to complete. Read a task file and work through the tasks.

---

## Agents

Agents folder: `.claude/agents/`. Use agents for subtasks.

Before any subtask: select the best agent and read its `.md` file. Apply instructions to the current subtask, complete it, then discard agent instructions.

Available agents:
- `code-reviewer.md` — Code review and quality analysis
- `documentation-pro.md` — Technical documentation
- `dotnet-framework-pro.md` — .NET Framework development
- `fastapi-pro.md` — FastAPI development
- `full-stack-developer.md` — Full-stack web development
- `go-build-resolver.md` — Go build error resolution
- `incident-responder.md` — Incident response
- `java-pro.md` — Java development
- `research-analyst.md` — Research and analysis
- `security-reviewer.md` — Security review
- `tdd-guide.md` — Test-driven development
- `websocket-engineer.md` — WebSocket implementation

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
