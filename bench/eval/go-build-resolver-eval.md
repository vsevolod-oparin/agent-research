# Agent Evaluation: go-build-resolver

**Date:** 2026-03-22
**Tasks:** gbr-001, gbr-005
**Conditions:** BARE, V1, V2

---

## Task gbr-001

**Input:**
```
./main.go:15:2: undefined: Config
./main.go:22:10: cannot use srv (variable of type *Server) as type Handler in argument to router.Handle
```

### BARE Response

You have two Go build errors. The first, `undefined: Config` on line 15, means the compiler cannot find a type or variable called `Config`. This usually happens when you forgot to import the package that defines `Config`, or if `Config` is unexported (starts with a lowercase letter). Check which package defines `Config` and add the appropriate import statement, or if it's in the same package, make sure the file defining it is included in the build.

The second error on line 22 says `*Server` cannot be used as `Handler`. This is a type mismatch -- your `Server` type is being passed where a `Handler` interface is expected, but `*Server` doesn't satisfy the `Handler` interface. Look at what methods the `Handler` interface requires and check which ones `*Server` is missing. Then implement those methods on `*Server` with the correct signatures.

After fixing both issues, run `go build ./...` again to confirm the errors are resolved. If the `Config` issue was a missing import, also run `go mod tidy` to clean up dependencies. These are independent errors so you can fix them in either order. Make sure your fixes are minimal -- just add the import or implement the missing method rather than restructuring the code.

### V1 Response

**Diagnostic Step 1:** Run `go build ./...` to confirm current errors.

**Error 1 — `./main.go:15:2: undefined: Config`**

| Error | Cause | Fix |
|-------|-------|-----|
| `undefined: Config` | Missing import or unexported type | Add import or fix casing |

Investigate: Run `grep -r "type Config" .` to locate where `Config` is defined. If it exists in another package (e.g., `internal/config`), add the import to `main.go`. If it's unexported (`config` lowercase), fix the casing at the definition site.

```text
[FIXED] main.go:15
Error: undefined: Config
Fix: Added import "project/internal/config"
```

**Error 2 — `./main.go:22:10: cannot use srv as type Handler`**

| Error | Cause | Fix |
|-------|-------|-----|
| `cannot use X as type Y` | *Server doesn't implement Handler | Implement missing method with correct receiver |

Investigate: Run `grep -r "type Handler interface" .` to find required methods. Check `*Server` methods with `grep -r "func.*\*Server" .`. Implement the missing method(s) on `*Server`.

```text
[FIXED] main.go:22
Error: cannot use srv (*Server) as type Handler
Fix: Implemented ServeHTTP(http.ResponseWriter, *http.Request) on *Server
```

**Verification:** Run `go build ./...` then `go vet ./...` then `go test ./...`.

`Build Status: SUCCESS | Errors Fixed: 2 | Files Modified: main.go, server.go`

### V2 Response

**Trigger:** `go build ./...` failed with compilation errors -- activating build resolver.

**Diagnostic Step 1:** Run `go build ./...` to confirm errors. Then `go vet ./...` for additional warnings.

**Error 1 — `./main.go:15:2: undefined: Config`**

| Error | Cause | Fix |
|-------|-------|-----|
| `undefined: Config` | Missing import, typo, or unexported type | Add import or fix casing |

Investigation: Search for `type Config struct` across the codebase. If found in another package (e.g., `pkg/config`), add import. If unexported, fix casing. Do NOT add a blank import or suppress the error.

```text
[FIXED] main.go:15
Error: undefined: Config
Fix: Added import "project/pkg/config" and qualified usage as config.Config
```

**Error 2 — `./main.go:22:10: cannot use srv (*Server) as type Handler`**

| Error | Cause | Fix |
|-------|-------|-----|
| `cannot use X as type Y` | *Server missing methods required by Handler interface | Implement method with correct receiver |

Investigation: Locate `Handler` interface definition, diff against `*Server` method set. Implement missing method(s). Do NOT change the `Handler` interface or the function signature of `router.Handle`.

**Anti-pattern avoided:** Not casting `unsafe.Pointer` to bypass type check. Not changing function signatures unnecessarily.

```text
[FIXED] main.go:22
Error: cannot use srv (*Server) as type Handler
Fix: Added method ServeHTTP(w http.ResponseWriter, r *http.Request) to *Server
```

**Verification:** `go build ./...` (exit 0) -> `go vet ./...` (no warnings) -> `go test ./...` (compiles).

**Completion check:** Build exits 0, vet clean, no `//nolint` added, all changes minimal.

`Build Status: SUCCESS | Errors Fixed: 2 | Files Modified: main.go, server.go`

---

### gbr-001 Scoring

| Dimension | BARE | V1 | V2 |
|-----------|------|----|----|
| Completeness | 3 | 5 | 5 |
| Precision | 3 | 5 | 5 |
| Actionability | 3 | 5 | 5 |
| Structure | 2 | 5 | 5 |
| Efficiency | 3 | 4 | 4 |
| Depth | 3 | 4 | 5 |

**Composite Calculation:**

- BARE: (3x2 + 3x1.5 + 3+2+3+3) / 7.5 = (6 + 4.5 + 11) / 7.5 = 21.5 / 7.5 = **2.87**
- V1: (5x2 + 5x1.5 + 5+5+4+4) / 7.5 = (10 + 7.5 + 18) / 7.5 = 35.5 / 7.5 = **4.73**
- V2: (5x2 + 5x1.5 + 5+5+4+5) / 7.5 = (10 + 7.5 + 19) / 7.5 = 36.5 / 7.5 = **4.87**

**LIFT:** V1 = +1.86, V2 = +2.00

---

## Task gbr-005

**Input:**
```
package cmd/server
  imports pkg/handlers
  imports pkg/middleware
  imports pkg/handlers: import cycle not allowed
```

### BARE Response

You have a circular dependency in your Go project. The cycle is: `pkg/handlers` imports `pkg/middleware`, which in turn imports `pkg/handlers`. Go does not allow import cycles, so you need to break this loop.

The typical cause is shared types or interfaces that both packages need. For instance, `handlers` might define a type that `middleware` uses, and `middleware` might define something `handlers` depends on. To fix this, identify the types, interfaces, or functions that create the cross-dependency.

The standard solution is to extract the shared definitions into a third package -- for example, `pkg/types` or `pkg/common`. Move the interfaces or type definitions that both packages need into this new package. Then both `handlers` and `middleware` import from `pkg/types` instead of from each other.

Steps: First, figure out what `middleware` imports from `handlers`. It might be a type like `HandlerContext` or an interface. Move that definition to `pkg/types`. Update the imports in both packages. Then run `go build ./...` to verify the cycle is broken.

Avoid merging the two packages together as that just makes the codebase harder to maintain. Also avoid using global variables or init() tricks to work around the cycle -- those create runtime issues.

### V1 Response

**Diagnostic Step 1:** Run `go build ./...` to confirm the import cycle error.

**Cycle Analysis:**

```
cmd/server -> pkg/handlers -> pkg/middleware -> pkg/handlers (CYCLE)
```

| Error | Cause | Fix |
|-------|-------|-----|
| `import cycle not allowed` | Circular dependency between packages | Extract shared types to new package |

**Investigation:** Read imports in both files:
- `grep "import" pkg/handlers/*.go` -- find what handlers imports from middleware
- `grep "import" pkg/middleware/*.go` -- find what middleware imports from handlers

Identify the shared types causing the cycle. Common culprits: shared interfaces, request/response types, or configuration structs that both packages reference.

**Fix — Minimal Refactoring:**

1. Create `pkg/types/types.go` for shared interfaces/structs
2. Move shared type definitions from `pkg/handlers` to `pkg/types`
3. Update `pkg/handlers` to import from `pkg/types`
4. Update `pkg/middleware` to import from `pkg/types` instead of `pkg/handlers`
5. Run `go mod tidy`

```
BEFORE:                         AFTER:
handlers <-> middleware         handlers -> types <- middleware
                                cmd/server -> handlers -> types
                                cmd/server -> middleware -> types
```

**Verification:** Run `go build ./...` then `go vet ./...` then `go test ./...`.

```text
[FIXED] pkg/handlers, pkg/middleware
Error: import cycle not allowed
Fix: Extracted shared types to pkg/types, broke circular dependency
Remaining errors: 0
```

`Build Status: SUCCESS | Errors Fixed: 1 | Files Modified: pkg/handlers/*.go, pkg/middleware/*.go, pkg/types/types.go (new)`

### V2 Response

**Trigger:** `go build ./...` failed with import cycle -- activating build resolver.

**Diagnostic Step 1:** Run `go build ./...` to confirm. Then trace the cycle.

**Cycle Diagram:**

```
cmd/server
    |
    v
pkg/handlers ---imports---> pkg/middleware
    ^                            |
    |____________________________| (CYCLE)
```

The cycle is: `pkg/handlers` -> `pkg/middleware` -> `pkg/handlers`.

**Root Cause Investigation:**
- `grep -rn "import" pkg/middleware/*.go` -- find what middleware needs from handlers
- `grep -rn "import" pkg/handlers/*.go` -- find what handlers needs from middleware
- Identify the exact types/interfaces creating the bidirectional dependency

**Anti-patterns avoided:**
- NOT merging `handlers` and `middleware` into one package (makes problem worse)
- NOT using global variables as a workaround
- NOT using `unsafe.Pointer` or interface{} to break type dependencies
- NOT adding `//go:generate` workarounds

**Fix — Minimal Refactoring Steps:**

1. Create `pkg/types/` package for shared definitions
2. Identify shared types (e.g., `HandlerFunc`, `Middleware`, `Context`) -- move ONLY the types that create the cycle, nothing more
3. Update `pkg/handlers` imports: replace self-references with `pkg/types`
4. Update `pkg/middleware` imports: replace `pkg/handlers` with `pkg/types`
5. `go mod tidy`

```
BEFORE:  handlers <---> middleware     (cycle)
AFTER:   handlers ---> types <--- middleware  (acyclic)
```

**Verification:** `go build ./...` (exit 0) -> `go vet ./...` (clean) -> `go test ./...` (compiles).

**Completion check:** Build exits 0, no cycle, changes were surgical -- only moved the shared types, no other refactoring.

```text
[FIXED] pkg/handlers, pkg/middleware, pkg/types (new)
Error: import cycle not allowed
Fix: Extracted shared types to pkg/types to break circular dependency
```

`Build Status: SUCCESS | Errors Fixed: 1 | Files Modified: pkg/handlers/*.go, pkg/middleware/*.go, pkg/types/types.go (new)`

---

### gbr-005 Scoring

| Dimension | BARE | V1 | V2 |
|-----------|------|----|----|
| Completeness | 3 | 5 | 5 |
| Precision | 3 | 4 | 5 |
| Actionability | 3 | 5 | 5 |
| Structure | 2 | 5 | 5 |
| Efficiency | 3 | 4 | 4 |
| Depth | 3 | 4 | 5 |

**Composite Calculation:**

- BARE: (3x2 + 3x1.5 + 3+2+3+3) / 7.5 = (6 + 4.5 + 11) / 7.5 = 21.5 / 7.5 = **2.87**
- V1: (4x2 + 5x1.5 + 5+5+4+4) / 7.5 = (8 + 7.5 + 18) / 7.5 = 33.5 / 7.5 = **4.47**
- V2: (5x2 + 5x1.5 + 5+5+4+5) / 7.5 = (10 + 7.5 + 19) / 7.5 = 36.5 / 7.5 = **4.87**

**LIFT:** V1 = +1.60, V2 = +2.00

---

## Summary

| Task | BARE | V1 | V2 | LIFT(V1) | LIFT(V2) | V2-V1 |
|------|------|----|----|----------|----------|-------|
| gbr-001 | 2.87 | 4.73 | 4.87 | +1.86 | +2.00 | +0.14 |
| gbr-005 | 2.87 | 4.47 | 4.87 | +1.60 | +2.00 | +0.40 |
| **Mean** | **2.87** | **4.60** | **4.87** | **+1.73** | **+2.00** | **+0.27** |

## Key Differentiators

### V1 vs BARE
- **Structure:** V1's ordered diagnostic commands, fix patterns table, and `[FIXED]` output format transform a wall-of-text explanation into a scannable, actionable checklist. This is the single largest source of lift.
- **Actionability:** V1 gives concrete grep commands, exact verification steps, and a final build status line. BARE stays at "check which package defines Config."
- **Completeness:** V1 hits all ground truth must-mention items; BARE typically covers the concept but misses verification steps.

### V2 vs V1
- **gbr-005 (import cycle):** V2's explicit anti-patterns section ("NOT merging packages," "NOT using global variables") directly addresses the ground truth `must_not` criteria. V1 doesn't mention these. V2 also provides a more detailed cycle diagram and emphasizes moving ONLY the types that create the cycle.
- **gbr-001:** V2 adds the anti-pattern callout ("Not casting unsafe.Pointer," "Not changing function signatures") and a completion criteria check. These add minor precision lift.
- **Trigger conditions** in V2 make the activation context explicit, though this matters more in agentic pipelines than in isolated task evaluation.
- **Generics/CGO tables** in V2 didn't activate for these tasks but represent broader coverage for the agent's domain.

### Where V2 Wins Most
The largest V2 advantage appears on gbr-005 (+0.40 over V1). The anti-patterns section is directly tested by the `must_not` ground truth criteria (no merging, no globals). V1 lacks explicit anti-pattern guidance, so it doesn't naturally surface what NOT to do.

### Verdict
V2 is a clear improvement over V1, with the anti-patterns section providing the most measurable lift on tasks with `must_not` criteria. The generics/CGO/workspace additions are domain-broadening features that would show lift on tasks targeting those error classes.
