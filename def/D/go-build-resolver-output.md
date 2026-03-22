## Task 1

**Errors:**
```
./main.go:15:2: undefined: Config
./main.go:22:10: cannot use srv (variable of type *Server) as type Handler in argument to router.Handle
```

**Diagnosis:**

Two distinct issues in `main.go`:

1. **`undefined: Config`** (line 15) -- The `Config` type is referenced but not available in the current scope. This is caused by either a missing import (if `Config` is defined in another package) or a typo/unexported name.

2. **`cannot use srv (*Server) as type Handler`** (line 22) -- The `*Server` type does not satisfy the `Handler` interface. This means `*Server` is missing one or more methods required by the `Handler` interface.

**Fix for error 1 -- `undefined: Config`:**

Determine where `Config` is defined. Common scenarios:

- If `Config` lives in a `config` package, add the import:
  ```go
  import "yourproject/pkg/config"
  ```
  Then use `config.Config{}` at line 15, or use a dot-import if appropriate.

- If `Config` is in the same package but a different file, verify the file is included in the build (same package name, same directory, no build tags excluding it).

- If `Config` was renamed or is unexported (`config` lowercase), fix the casing.

**Fix for error 2 -- `*Server` does not implement `Handler`:**

Step 1: Inspect the `Handler` interface definition to identify required methods:
```go
type Handler interface {
    ServeHTTP(http.ResponseWriter, *http.Request)
}
```

Step 2: Check which methods `*Server` currently has.

Step 3: Add the missing method(s) to `*Server`. For example, if `Handler` is `http.Handler`:
```go
func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    // route handling logic
}
```

Alternatively, if `*Server` already has the logic but under a different method name, wrap it:
```go
func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    s.HandleRequest(w, r)
}
```

**Summary:**
```
[FIX] ./main.go:15 -- Add missing import for the package containing Config, or fix the type name.
[FIX] ./main.go:22 -- Implement the missing interface method(s) on *Server so it satisfies the Handler interface.
```

`Build Status: ACTIONABLE | Errors: 2 | Root causes identified: missing import + missing interface method`

---

## Task 2

**Error:**
```
go: finding module for package github.com/example/deprecated-pkg
go: github.com/example/deprecated-pkg: module lookup disabled by GOPROXY=off
```

**Diagnosis:**

The code imports `github.com/example/deprecated-pkg`, but the Go module proxy is disabled (`GOPROXY=off`), preventing `go mod tidy` from resolving the module. This typically happens in air-gapped or restricted build environments.

**Root cause:** The package `deprecated-pkg` is not in the local module cache and cannot be fetched because the proxy is disabled.

**Fix -- choose the appropriate strategy:**

**Option A: Enable the proxy temporarily (if network access is available):**
```bash
GOPROXY=https://proxy.golang.org,direct go mod tidy
```

**Option B: Replace with a successor package (recommended for deprecated packages):**

Identify the replacement package. Deprecated packages often have a successor noted in their README or Go documentation. Update all import paths in the codebase:
```bash
# Find all files importing the deprecated package
grep -r "github.com/example/deprecated-pkg" --include="*.go" .

# Replace imports with the new package
# Example: sed -i '' 's|github.com/example/deprecated-pkg|github.com/example/new-pkg|g' file.go
```
Then run:
```bash
go get github.com/example/new-pkg@latest
go mod tidy
```

**Option C: Vendor the dependency (for restricted environments):**

If the module was previously available, vendor it from a machine with access:
```bash
# On a machine with proxy access:
go mod vendor
# Commit the vendor/ directory

# Then build with:
go build -mod=vendor ./...
```

**Option D: Use a `replace` directive for a local copy:**
```go
// go.mod
replace github.com/example/deprecated-pkg => ./local/deprecated-pkg
```

**Summary:**
```
[FIX] go.mod -- Either enable GOPROXY, replace the deprecated import with its successor, vendor the dependency, or add a replace directive.
```

`Build Status: ACTIONABLE | Errors: 1 | Root cause: GOPROXY=off blocks module resolution for deprecated-pkg`

---

## Task 3

**Warnings:**
```
./handler.go:34:2: printf: fmt.Sprintf call has arguments but no formatting directives
./handler.go:45:6: loopclosure: loop variable req captured by func literal
```

**Diagnosis and fixes:**

### Warning 1: `fmt.Sprintf` with arguments but no formatting directives (line 34)

This means `fmt.Sprintf` is called with extra arguments that are never interpolated into the format string. Example of the buggy code:
```go
msg := fmt.Sprintf("request failed", err)  // "err" is never used
```

**Fix:** Add the appropriate format verb, or switch to `fmt.Sprint` if no formatting is needed:
```go
// Option A: Add format directive
msg := fmt.Sprintf("request failed: %v", err)

// Option B: Use fmt.Sprint if you just want concatenation
msg := fmt.Sprint("request failed", err)
```

This is a real bug -- the error value is silently discarded, meaning log messages or error responses are missing critical information.

### Warning 2: Loop variable captured by func literal (line 45)

A goroutine or deferred function literal captures the loop variable `req` by reference. By the time the closure executes, `req` has been overwritten by subsequent iterations. Example of the buggy code:
```go
for _, req := range requests {
    go func() {
        process(req)  // BUG: req is the loop variable, not a copy
    }()
}
```

**Fix -- pass the loop variable as a function parameter:**
```go
for _, req := range requests {
    go func(r Request) {
        process(r)
    }(req)
}
```

**Alternative fix (Go 1.22+):** If the project uses Go 1.22 or later, loop variables are scoped per-iteration by default, and this warning should not appear. If it does, ensure the `go` directive in `go.mod` is set to at least `1.22`. However, explicitly passing the variable is still the clearest fix for readability.

**Note:** Both of these are real bugs, not just style issues. The first silently drops error context; the second causes a data race.

**Summary:**
```
[FIX] ./handler.go:34 -- Add format directive (e.g., %v) to fmt.Sprintf, or switch to fmt.Sprint.
[FIX] ./handler.go:45 -- Pass loop variable req as a parameter to the func literal to avoid capture by reference.
```

`Build Status: ACTIONABLE | Warnings: 2 | Both are real bugs (lost error info + race condition)`

---

## Task 4

**Error:**
```
go: updates to go.sum needed, disabled by -mod=readonly
```

**Diagnosis:**

The CI pipeline builds with `-mod=readonly` (this is the default in module-aware mode when a `vendor/` directory is absent and the Go version is 1.16+). A new dependency was added to `go.mod` or to import statements, but `go.sum` was not updated to include the checksums for the new module and its transitive dependencies.

The root cause: the developer added a dependency (via `go get` or by adding an import) but did not commit the updated `go.sum` file.

**Fix:**

Run locally before pushing to CI:
```bash
go mod tidy
go mod verify
```

This updates both `go.mod` and `go.sum`. Then commit both files:
```bash
git add go.mod go.sum
git commit -m "Update go.sum for new dependency"
```

**Prevention -- add this check to your development workflow:**

1. Add a CI step or pre-commit hook that verifies modules are tidy:
   ```bash
   go mod tidy
   git diff --exit-code go.mod go.sum
   ```
   This fails if `go mod tidy` changes anything, catching the issue before merge.

2. If using `vendor/`, also run:
   ```bash
   go mod vendor
   git add vendor/
   ```

**If you cannot run `go mod tidy` locally** (e.g., the CI environment differs), temporarily allow the CI step to update the sum:
```bash
GOFLAGS='' go mod tidy
```
But the correct fix is always to commit the updated `go.sum`.

**Summary:**
```
[FIX] go.sum -- Run `go mod tidy` locally, then commit the updated go.mod and go.sum files.
```

`Build Status: ACTIONABLE | Errors: 1 | Root cause: go.sum not updated after adding new dependency`

---

## Task 5

**Error:**
```
package cmd/server
  imports pkg/handlers
  imports pkg/middleware
  imports pkg/handlers: import cycle not allowed
```

**Diagnosis:**

There is a circular dependency:
```
pkg/handlers -> pkg/middleware -> pkg/handlers
```

`pkg/middleware` imports `pkg/handlers`, and `pkg/handlers` imports `pkg/middleware` (or vice versa), creating an import cycle. Go does not allow circular imports.

**Fix -- extract shared types into a new package:**

Step 1: Identify what `pkg/middleware` needs from `pkg/handlers`. Typically this is a type or interface, such as:
```go
// Currently in pkg/handlers
type HandlerContext struct { ... }
type RouteConfig struct { ... }
```

Step 2: Create a new shared package for these types:
```
pkg/
  handlers/
  middleware/
  types/         <-- new package for shared types
    types.go
```

Move the shared types into `pkg/types/`:
```go
// pkg/types/types.go
package types

type HandlerContext struct { ... }
type RouteConfig struct { ... }
```

Step 3: Update imports in both packages:
```go
// pkg/handlers/handler.go
import "yourproject/pkg/types"

// pkg/middleware/auth.go
import "yourproject/pkg/types"
```

Step 4: Remove the direct import of `pkg/handlers` from `pkg/middleware`.

**Alternative fix -- use interfaces to break the cycle:**

If `pkg/middleware` only calls methods on handler types, define an interface in `pkg/middleware` that describes what it needs:
```go
// pkg/middleware/middleware.go
package middleware

// Handler defines the interface middleware needs -- no import of pkg/handlers required.
type Handler interface {
    Handle(ctx context.Context, req Request) Response
}
```

This way `pkg/middleware` depends on its own interface, not on `pkg/handlers`. The concrete types in `pkg/handlers` satisfy the interface implicitly (Go duck typing).

**Dependency graph after fix:**
```
cmd/server -> pkg/handlers -> pkg/types
cmd/server -> pkg/middleware -> pkg/types
```
No cycle.

**Summary:**
```
[FIX] pkg/middleware + pkg/handlers -- Extract shared types into pkg/types (or define interfaces in pkg/middleware) to break the import cycle.
```

`Build Status: ACTIONABLE | Errors: 1 | Root cause: circular dependency between pkg/handlers and pkg/middleware`
