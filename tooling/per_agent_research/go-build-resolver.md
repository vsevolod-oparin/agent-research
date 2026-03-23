# go-build-resolver: Per-Agent Research Report

**Eval scores:** v4 = 4.77 (best), v1 = 4.47, bare = 4.33. Agent instructions add +0.44 over bare.

---

## 1. Competitive Landscape

- **No dedicated "Go build error resolver" AI tool exists.** This is a greenfield niche. The closest things are general-purpose AI coding assistants (Claude, ChatGPT, Copilot) used ad-hoc for Go debugging.
- **Go AI agent frameworks** (ADK, LangChainGo, Genkit, Eino, Jetify AI SDK, Anyi, Agent SDK Go) are flourishing but focus on building agents IN Go, not on fixing Go build errors.
- **Go's own toolchain** (`go build`, `go vet`, `go fmt`, `go mod tidy`) provides excellent structured error output -- this is a strength our agent can exploit.
- **AI-assisted Go debugging workflows** are emerging as blog-post-level practices (e.g., "paste error + context into Claude, get fix"). No productized version exists.
- **Key insight from search:** Go 1.23+ improved stack traces with indented formatting that is more AI-parseable. This is an advantage for LLM-based resolution.

## 2. Known Failure Modes / Chokepoints

- **Cascading errors from single root cause:** Go compiler stops at first package with errors; downstream packages show misleading errors. Agent must identify root cause, not chase symptoms.
- **CGO errors:** Require system-level understanding (missing `-dev` packages, compiler toolchain). Hard for an LLM without environment access.
- **Module/workspace complexity:** `GOWORK`, `replace` directives, checksum mismatches -- these require reading `go.mod`/`go.sum` and understanding resolution order.
- **Import cycles:** Require architectural understanding, not just local fixes. Agent's "surgical fix" philosophy may conflict with needed structural changes.
- **Generics (1.18+):** Type constraint errors are still relatively unfamiliar territory; LLMs have less training data on these patterns.
- **Race conditions:** Detected by `-race` flag but fixes require deep concurrency reasoning -- one of the hardest tasks for any AI.
- **Environment-specific failures:** Cross-compilation (`GOOS`/`GOARCH`), Go version mismatches, missing system dependencies. Agent can't always test these.
- **"Same error persists after 3 attempts" stop condition:** Good safety valve, but 3 may be too low for complex cascading issues.

## 3. What Would Make This Agent Best-in-Class

- **Root cause tracing protocol:** Explicitly instruct the agent to run `go build ./...`, collect ALL errors, group by package, identify the earliest/root error, fix that first, then re-verify. Current v4 mentions "trace error chains across packages" but could be more procedural.
- **Structured error parsing:** Go's error output is highly structured (`file:line:col: message`). Agent should parse this systematically rather than treating it as prose.
- **Iterative fix-verify loop with error diff:** After each fix, compare error list before vs. after. If new errors appear, the fix may have been wrong.
- **Module diagnostic checklist:** Before touching code, run `go env`, check `go.mod` for `replace` directives, check `GOWORK`, verify Go version matches `go.mod`'s `go` directive.
- **CGO awareness:** Detect CGO usage early, check `CGO_ENABLED`, verify C toolchain availability.
- **"Fix the smallest thing first" heuristic:** Missing imports and unused vars are quick wins that clear noise, revealing the real errors underneath.
- **Version-aware patterns:** Go 1.18 (generics), 1.20 (errors.Join), 1.21 (slog), 1.22 (range-over-func), 1.23 (improved stack traces). Agent should know which patterns apply.

## 4. Main Bottleneck

**Prompt quality is the primary lever.** The +0.44 improvement over bare confirms this.

- **Model capability is sufficient:** Go build errors are well-structured and deterministic. LLMs handle these well.
- **Tools are adequate:** Read, Edit, Bash (for `go build`) cover the workflow.
- **Prompt gaps in current v4:**
  - No explicit "parse all errors first, prioritize root cause" workflow
  - No instruction to check environment (`go env`, Go version) before fixing code
  - No guidance on multi-package error triage (fix package A first if package B depends on it)
  - The common fix patterns table is good but could include Go version annotations
  - Missing: workspace mode (`go.work`) troubleshooting beyond the single `go env GOWORK` line
  - Missing: build tags / `//go:build` constraint errors

## 5. What Winning Setups Look Like

- **Error-first workflow:** `go build ./...` > parse structured output > group by root cause > fix root > re-verify > iterate
- **Environment check upfront:** Go version, module mode, workspace mode, CGO status -- before any code changes
- **Minimal change discipline:** Current v4 does this well with "surgical fixes only"
- **Clear escalation criteria:** Current v4 has good stop conditions (3 attempts, more errors introduced, architectural scope)
- **Post-fix verification chain:** `go build` > `go vet` > `go test` (current v4 has this)
- **Anti-pattern enforcement:** Current v4's anti-patterns list is strong (no `//nolint`, no blank imports, no unsafe.Pointer hacks)

## Summary: Key Improvement Opportunities

1. Add explicit "triage all errors before fixing any" step
2. Add environment diagnostic step (go env, go version, module/workspace check) as step 0
3. Add package dependency ordering for multi-package errors
4. Annotate fix patterns with Go version requirements
5. Expand workspace/`go.work` and build tag coverage
6. Consider raising the 3-attempt limit for cascading error scenarios
