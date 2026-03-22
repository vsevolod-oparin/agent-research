## Task 1

**Errors:**
```
./main.go:15:2: undefined: Config
./main.go:22:10: cannot use srv (variable of type *Server) as type Handler in argument to router.Handle
```

**Root Cause:**

Two separate issues:

1. `undefined: Config` -- The `Config` type is either defined in another package and not imported, defined in a different file with a build tag that excludes it, or the identifier is unexported (e.g., `config` instead of `Config`).

2. `cannot use srv (*Server) as type Handler` -- The `*Server` type does not satisfy the `Handler` interface. It is missing one or more required methods.

**Fix:**

For error 1, add the missing import or fix the identifier name:

```go
// main.go
import (
    "myproject/config" // add missing import
)

// Then use it as:
cfg := config.Config{}  // if Config lives in a "config" package

// OR if Config is in the same package but unexported:
// Rename `config` to `Config` in its definition file
```

For error 2, identify the missing method(s) by checking the `Handler` interface definition. Add a compile-time check to surface the exact missing method:

```go
var _ Handler = (*Server)(nil)
```

Then implement the missing method(s). For example, if `Handler` requires `ServeHTTP(http.ResponseWriter, *http.Request)`:

```go
func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    // implementation
}
```

**Verification steps:**
```bash
go build ./...
go vet ./...
```

---

## Task 2

**Error:**
```
go: finding module for package github.com/example/deprecated-pkg
go: github.com/example/deprecated-pkg: module lookup disabled by GOPROXY=off
```

**Root Cause:**

The environment has `GOPROXY=off`, which prevents Go from fetching any modules from the network. The code imports `github.com/example/deprecated-pkg`, but it is not in the local module cache or vendored dependencies.

**Fix:**

Three approaches depending on the situation:

**Option A -- Enable proxy temporarily (if network access is allowed):**
```bash
GOPROXY=https://proxy.golang.org,direct go mod tidy
```

**Option B -- Use vendoring (recommended for reproducible builds):**
```bash
# On a machine with network access:
GOPROXY=https://proxy.golang.org,direct go mod tidy
go mod vendor
git add vendor/ go.mod go.sum
git commit -m "Vendor dependencies"
```
Then in CI, build with:
```bash
go build -mod=vendor ./...
```

**Option C -- Replace the deprecated package:**

If the package is truly deprecated, find its replacement and update imports:
```go
// go.mod -- add a replace directive if the module moved
replace github.com/example/deprecated-pkg => github.com/example/new-pkg v1.2.0
```
Or refactor the code to remove the dependency entirely.

**Verification steps:**
```bash
go mod verify
go build ./...
```

---

## Task 3

**Warnings:**
```
./handler.go:34:2: printf: fmt.Sprintf call has arguments but no formatting directives
./handler.go:45:6: loopclosure: loop variable req captured by func literal
```

**Root Cause:**

1. **Line 34** -- `fmt.Sprintf` is called with arguments but the format string contains no verbs (`%s`, `%d`, etc.). The arguments are silently ignored, which is almost certainly a bug.

2. **Line 45** -- A loop variable `req` is captured by a closure (goroutine or deferred function). In Go versions before 1.22, loop variables are reused across iterations, so the closure will see the value from the last iteration, not the iteration when it was created.

**Fix:**

For warning 1, add the correct format directives:

```go
// BEFORE (line 34) -- arguments but no formatting directives:
msg := fmt.Sprintf("request received", userID, path)

// AFTER -- add format verbs:
msg := fmt.Sprintf("request received: userID=%s path=%s", userID, path)

// OR if no formatting is needed, drop the arguments:
msg := "request received"
```

For warning 2, create a local copy of the loop variable:

```go
// BEFORE (line 45):
for _, req := range requests {
    go func() {
        process(req) // captures loop variable
    }()
}

// AFTER -- Option A: shadow the variable
for _, req := range requests {
    req := req // create local copy
    go func() {
        process(req)
    }()
}

// AFTER -- Option B: pass as function argument (preferred)
for _, req := range requests {
    go func(r Request) {
        process(r)
    }(req)
}
```

**Verification steps:**
```bash
go vet ./...
```

---

## Task 4

**Error:**
```
go: updates to go.sum needed, disabled by -mod=readonly
```

**Root Cause:**

The CI pipeline runs with `-mod=readonly` (the default in Go 1.16+ when a `go.sum` file exists). A new dependency was added to the code or `go.mod`, but the corresponding entries were never added to `go.sum`. The CI environment correctly refuses to modify `go.sum` during builds to ensure reproducibility.

**Fix:**

Run `go mod tidy` locally and commit the updated files:

```bash
# Locally (not in CI):
go mod tidy
go build ./...   # verify it works

# Commit both files:
git add go.mod go.sum
git commit -m "Update go.sum with new dependency entries"
git push
```

**Prevention -- add a CI check that catches this early:**

```yaml
# In your CI pipeline (e.g., .github/workflows/ci.yml):
- name: Check go.mod and go.sum are tidy
  run: |
    go mod tidy
    git diff --exit-code go.mod go.sum
```

This fails the build if a developer forgot to run `go mod tidy` before pushing.

**Verification steps:**
```bash
go build -mod=readonly ./...
go mod verify
```

---

## Task 5

**Error:**
```
package cmd/server
  imports pkg/handlers
  imports pkg/middleware
  imports pkg/handlers: import cycle not allowed
```

**Root Cause:**

Circular dependency: `pkg/handlers` imports `pkg/middleware`, and `pkg/middleware` imports `pkg/handlers`. Go does not allow import cycles. This typically happens when middleware needs a type or function defined in handlers (e.g., a handler interface, error type, or context key).

**Fix:**

Extract the shared types into a new leaf package that both can import, breaking the cycle.

**Step 1:** Identify what `pkg/middleware` imports from `pkg/handlers`. Common culprits are interfaces, types, or constants.

**Step 2:** Create a shared package:

```
pkg/
  handlers/      -- imports pkg/types, pkg/middleware
  middleware/    -- imports pkg/types (no longer imports pkg/handlers)
  types/         -- no internal imports (leaf package)
```

**Step 3:** Move the shared types:

```go
// pkg/types/types.go (new file)
package types

// Move shared types here, e.g.:
type Handler interface {
    Handle(ctx context.Context, req Request) Response
}

type Request struct { /* ... */ }
type Response struct { /* ... */ }
```

**Step 4:** Update imports in both packages:

```go
// pkg/middleware/auth.go
import (
    "myproject/pkg/types"  // was: "myproject/pkg/handlers"
)

func AuthMiddleware(next types.Handler) types.Handler {
    // ...
}
```

```go
// pkg/handlers/user.go
import (
    "myproject/pkg/types"
    "myproject/pkg/middleware"
)
```

**Key principle:** Dependency arrows must form a DAG (directed acyclic graph). Shared types belong in a leaf package that depends on nothing internal.

**Verification steps:**
```bash
go build ./...
go vet ./...
```
