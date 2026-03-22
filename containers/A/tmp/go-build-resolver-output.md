## Task 1

**Error:**
```
./main.go:15:2: undefined: Config
./main.go:22:10: cannot use srv (variable of type *Server) as type Handler in argument to router.Handle
```

**Root Cause:**

Two distinct issues:

1. `undefined: Config` -- The `Config` type is either defined in a different package that has not been imported, or it is unexported (lowercase `config`), or it simply does not exist yet.

2. `cannot use srv (*Server) as type Handler` -- The `*Server` type does not satisfy the `Handler` interface. This means `*Server` is missing one or more methods that `Handler` requires. A common case is that `Handler` requires a `ServeHTTP(http.ResponseWriter, *http.Request)` method and `*Server` does not implement it, or the method exists but has an incorrect signature (e.g., value receiver instead of pointer receiver, or wrong parameter types).

**Fix:**

For error 1 -- add the missing import or fix the reference:

```go
// If Config is in another package:
import "yourproject/pkg/config"

// Then use config.Config instead of bare Config:
cfg := config.Config{ /* ... */ }
```

If `Config` is supposed to be in the same package, ensure the struct name is exported (capital `C`) and the file defining it has the same `package` declaration as `main.go`.

For error 2 -- implement the missing interface method on `*Server`:

```go
// Assuming Handler requires ServeHTTP:
type Handler interface {
    ServeHTTP(http.ResponseWriter, *http.Request)
}

// Add the missing method to *Server:
func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    // route handling logic
}
```

Alternatively, if `Server` already has the logic under a different method name, wrap it:

```go
// If Server has a Handle method but Handler expects ServeHTTP:
func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    s.Handle(w, r)
}
```

**Verification:**
```bash
go build ./...
```

---

## Task 2

**Error:**
```
go: finding module for package github.com/example/deprecated-pkg
go: github.com/example/deprecated-pkg: module lookup disabled by GOPROXY=off
```

**Root Cause:**

The code imports `github.com/example/deprecated-pkg`, but the environment has `GOPROXY=off`, which completely disables module downloads from any proxy or origin server. This typically happens in restricted CI/build environments, air-gapped systems, or when the proxy is intentionally disabled. Even `go mod tidy` cannot resolve the dependency because it cannot reach any module source.

Additionally, the package is described as "deprecated," meaning it may have been removed from the registry or is no longer maintained.

**Fix:**

There are several approaches depending on the situation:

**Option A -- Enable the proxy (if network access is allowed):**
```bash
export GOPROXY=https://proxy.golang.org,direct
go mod tidy
```

**Option B -- Vendor the dependency (best for CI with GOPROXY=off):**

First, on a machine with network access:
```bash
export GOPROXY=https://proxy.golang.org,direct
go mod tidy
go mod vendor
```

Then commit the `vendor/` directory. In CI, build with:
```bash
go build -mod=vendor ./...
```

**Option C -- Replace the deprecated package:**

If the package is truly deprecated, find its replacement and update imports:
```go
// go.mod -- redirect to a fork or replacement
replace github.com/example/deprecated-pkg => github.com/example/new-pkg v1.2.0
```

Or refactor the code to remove the dependency entirely, which is the best long-term solution for deprecated packages.

**Option D -- Use a local copy:**
```
// go.mod
replace github.com/example/deprecated-pkg => ../local/deprecated-pkg
```

**Verification:**
```bash
go mod tidy
go build ./...
```

---

## Task 3

**Error:**
```
./handler.go:34:2: printf: fmt.Sprintf call has arguments but no formatting directives
./handler.go:45:6: loopclosure: loop variable req captured by func literal
```

**Root Cause:**

1. **Line 34 -- Sprintf with no format directives:** `fmt.Sprintf` is called with extra arguments but the format string contains no verbs (`%s`, `%d`, `%v`, etc.). The arguments are silently ignored, which is almost always a bug.

2. **Line 45 -- Loop variable capture:** A closure (anonymous function or goroutine) inside a loop captures the loop variable `req` by reference. Since the loop variable is reused on each iteration, all closures end up referencing the same variable, which holds the value from the last iteration. This is a classic Go concurrency bug.

**Fix:**

For error 1 -- add format directives or switch to a non-formatting function:

```go
// BEFORE (broken):
msg := fmt.Sprintf("request failed", userID, err)

// AFTER -- Option A: add format verbs:
msg := fmt.Sprintf("request failed for user %d: %v", userID, err)

// AFTER -- Option B: use fmt.Sprint if no formatting needed:
msg := fmt.Sprint("request failed")
```

For error 2 -- create a local copy of the loop variable:

```go
// BEFORE (broken -- all goroutines share the same req):
for _, req := range requests {
    go func() {
        process(req) // captures loop variable by reference
    }()
}

// AFTER -- Option A (Go < 1.22): shadow the variable:
for _, req := range requests {
    req := req // local copy
    go func() {
        process(req)
    }()
}

// AFTER -- Option B: pass as function parameter:
for _, req := range requests {
    go func(r Request) {
        process(r)
    }(req)
}

// AFTER -- Option C (Go 1.22+): loop variables are per-iteration by default.
// Upgrade to Go 1.22+ and set `go 1.22` in go.mod. No code change needed.
```

**Verification:**
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

The CI pipeline runs `go build` (or `go test`) with `-mod=readonly` (which is the default behavior in module-aware mode when a `go.sum` exists and the Go version is 1.16+). A new dependency was added to the code or `go.mod`, but `go.sum` was not updated to include the new dependency's checksums. The build refuses to auto-update `go.sum` because readonly mode is active, which is a safety mechanism to ensure builds are reproducible and `go.sum` is always committed.

This happens when a developer adds a new import or runs `go get` but forgets to run `go mod tidy` and commit the updated `go.sum`.

**Fix:**

Run locally on the development machine:

```bash
go mod tidy
```

This updates both `go.mod` (removes unused, adds missing) and `go.sum` (adds checksums for all dependencies). Then commit both files:

```bash
git add go.mod go.sum
git commit -m "Update go.mod and go.sum for new dependency"
```

If the CI intentionally uses `-mod=readonly` (which is good practice), do NOT change the CI configuration. The correct fix is always to commit an up-to-date `go.sum`.

If the CI explicitly passes `-mod=readonly` and you want the build to auto-update, you could change it to `-mod=mod`, but this is discouraged because it hides missing `go.sum` entries and reduces reproducibility.

**Prevention:**

Add a pre-commit hook or CI check that runs `go mod tidy` and verifies no diff:
```bash
go mod tidy
git diff --exit-code go.mod go.sum
```

**Verification:**
```bash
go build -mod=readonly ./...
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

There is a circular dependency: `pkg/handlers` imports `pkg/middleware`, and `pkg/middleware` imports `pkg/handlers`. Go does not allow import cycles. This typically happens when middleware needs types or functions defined in handlers (e.g., a handler type, route registration), and handlers need middleware (e.g., to apply auth, logging).

**Fix:**

Extract the shared types into a new, independent package that both can import, breaking the cycle.

**Step 1:** Identify what `pkg/middleware` imports from `pkg/handlers`. Common culprits are shared types like `Handler`, `Route`, `Context`, or helper functions.

**Step 2:** Create a new package for shared types:

```go
// pkg/types/types.go  (or pkg/common, pkg/shared, pkg/domain -- pick a meaningful name)
package types

import "net/http"

// Move shared types here:
type Handler interface {
    ServeHTTP(http.ResponseWriter, *http.Request)
}

type Route struct {
    Path    string
    Method  string
    Handler Handler
}

// Any other types that both handlers and middleware reference
```

**Step 3:** Update `pkg/middleware` to import from `pkg/types` instead of `pkg/handlers`:

```go
package middleware

import (
    "yourproject/pkg/types" // was: "yourproject/pkg/handlers"
)

func Auth(next types.Handler) types.Handler {
    // ...
}
```

**Step 4:** Update `pkg/handlers` to import from `pkg/types`:

```go
package handlers

import (
    "yourproject/pkg/types"
    "yourproject/pkg/middleware"
)

// Use types.Handler, types.Route, etc.
```

The dependency graph becomes:
```
cmd/server -> pkg/handlers -> pkg/middleware -> pkg/types
                           -> pkg/types
```

No cycles. Both `handlers` and `middleware` depend on `types`, but `types` depends on neither.

**Alternative approaches:**

- **Interface inversion:** If middleware only needs one function from handlers, define an interface in `pkg/middleware` that `pkg/handlers` implements. This avoids a new package but only works for simple cases.
- **Merge packages:** If handlers and middleware are tightly coupled, they may belong in one package. This is simpler but reduces modularity.

**Verification:**
```bash
go build ./...
```
