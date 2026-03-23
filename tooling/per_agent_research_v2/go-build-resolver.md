# go-build-resolver: Deep Research Report (v2)

**Eval scores:** v4 = 4.77 (best), +0.44 over bare. Greenfield niche -- no competing tool exists.

---

## 1. Landscape

**No dedicated Go build error resolution tool exists.** The closest alternatives are:

- **gopls** (Go language server): Provides diagnostics, code actions, and some auto-fixes (add imports, fill struct fields, organize imports). It parses `go build` and `go vet` errors into structured LSP diagnostics. However, it is reactive (IDE-bound), not agentic -- it cannot reason about multi-package cascading errors or execute fix-verify loops. gopls code actions are limited to single-file, single-error fixes. Source: [go.dev/wiki/gopls](https://go.dev/wiki/gopls)

- **golangci-lint**: Aggregates 100+ linters but focuses on code quality, not build error resolution. It can detect issues pre-build but cannot fix them. Its `--fix` flag works for a small subset of linters (gofmt, goimports). Not designed for compilation errors.

- **staticcheck** (honnef.co/go/tools): Deep static analysis with some overlap with `go vet`. Catches bugs that the compiler misses (unused assignments, deprecated API usage, incorrect format strings) but is an analysis tool, not a resolver.

- **AI coding assistants** (Copilot, Cursor, Claude): Used ad-hoc by developers for Go debugging. No productized "paste build error, get fix" workflow. The common pattern is: copy error + file context into chat, get suggested fix, manually apply. Our agent automates this entire loop.

- **Go's own toolchain** is a major advantage: `go build` output is highly structured (`file:line:col: message`), `go vet` checks are deterministic, and `go mod` has excellent diagnostic commands (`go mod why`, `go mod graph`, `go mod verify`). This structured output is ideal for LLM parsing. Go 1.23+ improved stack traces with indented formatting that is more AI-parseable.

**Key insight:** The greenfield opportunity is real. No tool combines error parsing + root cause reasoning + automated fix application + verification loop. Our agent occupies this exact niche.

---

## 2. Failure Modes

### Compilation Error Categories (by resolution difficulty)

**Easy (agent handles well today):**
- `declared but not used` -- remove or use the variable
- `imported and not used` -- remove import
- `missing return at end of function` -- add return
- `undefined: X` from missing import -- add import
- `multiple-value in single-value context` -- destructure return
- Syntax errors (missing braces, unclosed strings)

**Medium (requires context but deterministic):**
- `cannot use X as type Y` -- type conversion, pointer/value confusion, interface satisfaction
- `cannot assign to struct field in map` -- copy-modify-reassign or pointer map
- Build tag / `//go:build` constraint mismatches -- file excluded from build unexpectedly
- Module version conflicts -- `go mod graph` + `go mod why` to trace, then pin version
- `go.sum` checksum mismatches -- `go clean -modcache && go mod download`

**Hard (architectural reasoning needed):**
- `import cycle not allowed` -- requires package restructuring. Go compiler only reports the cycle path, not which dependency should be inverted. Common solutions: extract interface to third package, merge tightly-coupled packages, use dependency injection. Source: [jogendra.dev/import-cycles-in-golang](https://jogendra.dev/import-cycles-in-golang-and-how-to-deal-with-them)
- Cascading errors across packages -- Go compiler stops at first package error; downstream packages show misleading "undefined" errors for symbols that failed to compile upstream. Agent must identify and fix the root package first.
- Generics type constraint errors (Go 1.18+) -- `cannot use type X as type parameter Y`, `cannot infer T`. LLMs have less training data on these patterns; constraint satisfaction requires understanding the full type parameter chain.
- Race conditions (`-race` flag) -- requires deep concurrency reasoning. One of the hardest tasks for any AI. Fixes span multiple goroutines and require understanding synchronization primitives.

**Environment-dependent (limited agent control):**
- CGO failures: missing C compiler, missing `-dev` packages, `CGO_ENABLED` mismatch. Agent can diagnose but may not be able to install system packages.
- Cross-compilation: `GOOS`/`GOARCH` mismatches, platform-specific syscalls. Agent can identify the constraint but fix requires build environment changes.
- Go version mismatches: `go.mod` declares `go 1.22` but toolchain is 1.20. Agent can detect via `go env` but cannot upgrade the toolchain.
- Workspace mode (`go.work`): Subtle issues where `go.work` overrides `go.mod` replace directives. `GOWORK=off go build ./...` is the diagnostic escape hatch.

### Root Cause vs. Symptom Problem

The single biggest failure mode for the agent is **chasing symptoms instead of root causes**. When package A has a type error, packages B and C that import A will show `undefined: A.Symbol` errors. A naive agent fixes B and C (adding imports, creating stubs) when the real fix is in A. The current v4 agent mentions "trace error chains across packages" but lacks an explicit triage protocol.

---

## 3. Best-in-Class Improvements

### 3a. Structured Error Triage Protocol

The current v4 workflow is: build -> read -> fix -> build -> vet -> test. This should become:

1. **Environment check** (new step 0): `go env GOVERSION`, `go env GOWORK`, `grep "^go " go.mod`, `grep "replace" go.mod` -- before touching any code
2. **Full error collection**: `go build ./... 2>&1` -- capture ALL errors, not just first
3. **Error grouping**: Group by package, then by file. Identify which package is lowest in the dependency chain (root cause)
4. **Fix root package first**: Fix errors in the leaf/root package, then re-build to see if downstream errors resolve
5. **Iterate**: Re-build after each fix, diff error counts before vs. after. If error count increases, the fix was wrong -- revert

This protocol directly addresses the cascading error problem, which is the most common way the agent wastes turns today.

### 3b. Module Diagnostic Checklist

Before editing code for module-related errors, run:
```
go env GOPATH GOMODCACHE GOWORK GOFLAGS
go mod verify                    # checksum integrity
go mod why -m <problematic_pkg>  # why this dep exists
go mod graph | grep <pkg>        # version selection chain
```

This prevents the common mistake of editing code when the real problem is a `replace` directive, a workspace override, or a version conflict. Go uses Minimal Version Selection (MVS) -- understanding why a version was chosen requires `go mod graph`, not guesswork. Source: [go.dev/ref/mod](https://go.dev/ref/mod)

### 3c. Build Tag Awareness

Missing from v4 entirely. Common errors:
- File not compiled because `//go:build` constraint excludes it from current `GOOS`/`GOARCH`
- `go build -tags=integration` needed but not specified
- Legacy `// +build` syntax vs. new `//go:build` syntax confusion (Go 1.17+)

Agent should check: `go list -f '{{.GoFiles}} {{.IgnoredGoFiles}}' ./...` to see which files are included/excluded.

### 3d. Version-Annotated Fix Patterns

Current v4 fix tables don't indicate Go version requirements. Important additions:
- Generics (`any`, `comparable`, type parameters): Go 1.18+
- `errors.Join`: Go 1.20+
- `slog` package: Go 1.21+
- Range-over-func: Go 1.22+
- Range-over-int: Go 1.22+
- Improved iterator patterns: Go 1.23+

When a fix involves a version-gated feature, agent must verify `go.mod`'s `go` directive first.

### 3e. Expanded Workspace / go.work Coverage

Current v4 has a single line: "check if workspace mode is active." This should expand to:
- `go.work` `use` directives override module cache -- local changes take precedence
- `go.work` `replace` directives compound with `go.mod` `replace` -- order matters
- `GOWORK=off go build ./...` isolates whether workspace is the problem
- `go work sync` aligns dependency versions across workspace modules

### 3f. golangci-lint Integration

When build succeeds but quality issues remain, suggest:
```
golangci-lint run ./... --out-format=line-number
```
The agent should know which linters have `--fix` support (gofmt, goimports, gocritic partial) and which require manual intervention.

---

## 4. Main Bottleneck

**Prompt quality remains the primary lever.** Evidence:

- The +0.44 improvement (4.33 -> 4.77) from bare to v4 confirms that instruction quality drives performance
- Model capability is sufficient -- Go build errors are structured and deterministic, well within LLM reasoning ability
- Tool access is adequate -- Read, Edit, Bash cover the full workflow
- The gap is in **strategy, not capability**: the agent knows Go syntax but lacks explicit decision procedures for error triage, root cause identification, and fix ordering

**Specific prompt gaps in v4:**
1. No "triage all errors before fixing any" instruction -- agent fixes first error it sees
2. No environment diagnostic step -- jumps straight to code changes
3. No package dependency ordering for multi-package errors
4. No build tag / `//go:build` constraint coverage
5. No `go.work` troubleshooting beyond a single line
6. No version awareness in fix patterns
7. No `go mod graph` / `go mod why` usage for dependency debugging
8. The 3-attempt stop condition may be too aggressive for cascading error scenarios where each fix reveals the next layer

**Secondary bottleneck: Error parsing fidelity.** The agent reads `go build` output as prose. An explicit instruction to parse `file:line:col: message` format and group by package would improve root cause identification. Go's error output is one of the most machine-parseable of any language -- the agent should exploit this.

---

## 5. Winning Patterns

**Pattern 1: Environment-First Diagnosis**
Before any code change: `go env`, check `go.mod` version, check for `go.work`, check for `replace` directives. This eliminates an entire class of wasted fix attempts (editing code when the problem is configuration).

**Pattern 2: Root-Cause-First Fix Ordering**
Parse all errors -> group by package -> build dependency graph (package A imports B imports C) -> fix C first -> re-build -> see if A and B errors resolve. This is how experienced Go developers work: they know that `undefined` errors in importing packages usually mean the imported package failed first.

**Pattern 3: Error Count Regression Testing**
After each fix: `go build ./... 2>&1 | wc -l` (count error lines). If error count increases, the fix was wrong. This simple heuristic catches bad fixes immediately and prevents the agent from spiraling.

**Pattern 4: Surgical Fix Discipline**
Current v4 does this well. The anti-pattern list (no `//nolint`, no blank imports, no `unsafe.Pointer` casts) is strong. Worth keeping and potentially expanding with: no `interface{}` when `any` is available (Go 1.18+), no `ioutil` (deprecated since Go 1.16).

**Pattern 5: Module Diagnostics Before Code Changes**
For any `cannot find package` or version-related error: `go mod why -m <pkg>` + `go mod graph | grep <pkg>` before running `go get`. This prevents version conflicts and explains why a dependency exists.

**Pattern 6: Iterative Fix-Verify with Error Diff**
Keep a mental model of "errors before" vs "errors after" each fix. If new, unrelated errors appear, the fix likely had side effects. If the same error persists after 2 attempts with different approaches, escalate (the error may need architectural changes).

---

## 6. Specific Recommendations

### High Priority (expected to move eval score)

1. **Add Step 0: Environment Diagnostic**
   Insert before current step 1. Run `go env GOVERSION GOWORK`, `grep "^go " go.mod`, `grep "replace" go.mod`. Takes 1 line of prompt, prevents entire categories of wasted fixes.

2. **Add Error Triage Protocol**
   After `go build ./...`, explicitly instruct: "Parse ALL errors. Group by package. Identify the package lowest in the import chain. Fix that package first. Re-build before fixing other packages." This is the single highest-impact change.

3. **Add Build Tag Coverage**
   New table row: `file not included in build` -> Check `//go:build` constraints, run `go list -f '{{.IgnoredGoFiles}}' ./...`. Also add: missing `-tags` flag for custom build tags.

4. **Expand Module Troubleshooting**
   Add `go mod why -m <pkg>` for understanding why a dependency is pulled in. Add `go mod graph | grep <pkg>` for version chain tracing. Add `go mod verify` for checksum integrity. These are the tools experienced Go developers use.

5. **Add Version Awareness**
   Annotate fix patterns with minimum Go version. Add instruction: "Before suggesting a fix that uses a feature from Go 1.18+, verify the go.mod go directive."

### Medium Priority (correctness improvements)

6. **Expand go.work Coverage**
   Add explicit troubleshooting for workspace mode: `GOWORK=off go build ./...` to isolate, `go work sync` for version alignment, interaction between `go.work replace` and `go.mod replace`.

7. **Add Error Count Regression Check**
   After each fix: "Re-run `go build ./...`. If the number of errors increased, revert the last change and try a different approach."

8. **Raise Stop Condition to 4-5 Attempts**
   For cascading error scenarios, 3 attempts may be too low. Consider: "3 attempts for a single error, 5 attempts for cascading multi-package errors."

9. **Add Deprecated API Patterns**
   `ioutil` -> `io`/`os` (Go 1.16+), `interface{}` -> `any` (Go 1.18+), `golang.org/x/exp/slices` -> `slices` (Go 1.21+). These come up frequently in codebases being upgraded.

### Low Priority (edge case coverage)

10. **Add CGO Diagnostic Steps**
    When CGO errors detected: check `CGO_ENABLED`, check `pkg-config --libs <lib>`, suggest `CGO_ENABLED=0` if pure-Go alternative exists.

11. **Add `go list` for Package Inspection**
    `go list -m -json all` for module info, `go list -f '{{.Deps}}' ./...` for dependency chains. Useful for complex debugging but rarely needed.

12. **Add Import Cycle Resolution Strategies**
    Expand the single-line "extract shared types to new package" with specific patterns: interface extraction (define interface in consumer package), dependency inversion (third package for shared types), package merging (when packages are too tightly coupled). Source: [jogendra.dev](https://jogendra.dev/import-cycles-in-golang-and-how-to-deal-with-them)

---

## Sources

- Import cycles in Go: https://jogendra.dev/import-cycles-in-golang-and-how-to-deal-with-them
- Go workspaces tutorial: https://go.dev/doc/tutorial/workspaces
- Go build tags: https://www.compilenrun.com/docs/language/go/go-project-structure/go-build-tags/
- Go modules reference (MVS): https://go.dev/ref/mod
- Go test failure triage: https://go.dev/wiki/TestFailures
- Go error handling strategies: https://devtutorials.net/golang/advanced-error-handling-strategies-in-go
- AI agent error handling patterns: https://fast.io/resources/ai-agent-error-handling/
- Go compilation troubleshooting: https://labex.io/tutorials/go-how-to-troubleshoot-go-compilation-errors-419828
