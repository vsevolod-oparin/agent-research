## Task 1

**Error:**
```
./main.go:15:2: undefined: Config
./main.go:22:10: cannot use srv (variable of type *Server) as type Handler in argument to router.Handle
```

**Root Cause:**

Two separate issues:

1. `undefined: Config` -- The `Config` type is either defined in a different package that has not been imported, defined in a file with a different package name or build tag, or the identifier is unexported (lowercase `config` instead of `Config`).

2. `cannot use *Server as type Handler` -- The `*Server` type does not satisfy the `Handler` interface. It is missing one or more required methods, or the methods exist but with the wrong receiver type (value vs pointer).

**Fix:**

For the undefined `Config`, add the missing import:

```go
// main.go
import (
    "yourproject/config" // Add the missing import
)

func main() {
    cfg := config.Config{} // Use the fully qualified name
    // ...
}
```

Alternatively, if `Config` is supposed to be in the same package, verify the defining file has `package main` at the top and no excluding build tag.

For the interface mismatch, implement the missing method on `*Server`:

```go
// Assuming Handler requires: ServeHTTP(http.ResponseWriter, *http.Request)
func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    // handle request
}
```

To discover exactly which methods are missing, check the `Handler` interface definition and compare against methods on `*Server`. Every method must match exactly (name, parameters, return types).

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

`go mod tidy` is trying to resolve `github.com/example/deprecated-pkg`, but `GOPROXY=off` prevents any network module lookups. This happens in air-gapped environments, restricted CI systems, or when the module has been removed from the upstream registry.

**Fix:**

**Option A -- Enable the proxy (if network access is available):**
```bash
GOPROXY=https://proxy.golang.org,direct go mod tidy
```

**Option B -- Replace the deprecated package:**
```go
// go.mod
replace github.com/example/deprecated-pkg => github.com/example/new-pkg v1.2.0
```

Or better yet, update the source code to import the replacement package directly.

**Option C -- Vendor dependencies (for offline environments):**
```bash
# On a machine with network access:
GOPROXY=https://proxy.golang.org,direct go mod vendor
git add vendor/
git commit -m "Vendor dependencies"

# Then in the restricted environment:
go build -mod=vendor ./...
```

**Option D -- Use a private proxy:**
```bash
GOPROXY=https://internal-proxy.company.com go mod tidy
```

The best long-term fix is to remove the deprecated package import from source code and replace it with an actively maintained alternative.

---

## Task 3

**Error:**
```
./handler.go:34:2: printf: fmt.Sprintf call has arguments but no formatting directives
./handler.go:45:6: loopclosure: loop variable req captured by func literal
```

**Root Cause:**

1. **Line 34** -- `fmt.Sprintf` is called with extra arguments but the format string has no verbs (`%s`, `%d`, `%v`, etc.). The arguments are silently ignored, which is almost always a bug.

2. **Line 45** -- A loop variable `req` is captured by a closure inside the loop. In Go versions before 1.22, loop variables are reused across iterations, so all goroutines/deferred closures see the value from the last iteration, not the iteration they were created in.

**Fix:**

For line 34 -- add format directives or switch to a non-formatting function:

```go
// BEFORE (bug):
msg := fmt.Sprintf("request failed", err)

// FIX Option A -- add the format verb:
msg := fmt.Sprintf("request failed: %v", err)

// FIX Option B -- use fmt.Sprint if no formatting is needed:
msg := "request failed"
```

For line 45 -- capture the loop variable:

```go
// BEFORE (bug):
for _, req := range requests {
    go func() {
        process(req) // all goroutines may see the last value
    }()
}

// FIX Option A -- pass as function argument:
for _, req := range requests {
    go func(r Request) {
        process(r)
    }(req)
}

// FIX Option B -- shadow with a local variable:
for _, req := range requests {
    req := req // new variable scoped to this iteration
    go func() {
        process(req)
    }()
}
```

Note: Go 1.22+ changed loop variable semantics so each iteration gets its own copy. If your `go.mod` has `go 1.22` or later, this is no longer a runtime bug, but explicit capture is still good practice.

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

The CI pipeline runs with `-mod=readonly` (default in Go 1.16+ when `go.sum` exists). This prevents the toolchain from modifying `go.mod` or `go.sum` during build. A new dependency was added but `go.sum` was not updated before committing. This is a safety mechanism -- CI should never silently download and trust new dependencies.

**Fix:**

Run locally before committing:

```bash
go mod tidy
go mod verify
```

Then commit both files:

```bash
git add go.mod go.sum
git commit -m "Update go.mod and go.sum for new dependency"
```

**Prevention -- add a CI check:**

```bash
# In CI or pre-commit hook:
go mod tidy
git diff --exit-code go.mod go.sum
# Non-zero exit means someone forgot go mod tidy
```

**If CI intentionally restricts network**, vendor dependencies instead:

```bash
go mod tidy
go mod vendor
# Build with:
go build -mod=vendor ./...
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

Circular dependency: `pkg/handlers` imports `pkg/middleware`, and `pkg/middleware` imports `pkg/handlers`. Go forbids import cycles. This typically happens when both packages share types or when middleware needs handler types for its signatures.

**Fix:**

Extract the shared types into a new package that both can import, breaking the cycle.

**Step 1 -- Create a shared types package:**

```
pkg/
  types/         <-- new package
    types.go
  handlers/
    handlers.go
  middleware/
    middleware.go
```

```go
// pkg/types/types.go
package types

import "net/http"

type HandlerFunc func(http.ResponseWriter, *http.Request) error

type Route struct {
    Method  string
    Path    string
    Handler HandlerFunc
}
```

**Step 2 -- Update both packages to import from `types`:**

```go
// pkg/middleware/middleware.go
package middleware

import (
    "yourproject/pkg/types" // NOT handlers
)

func Auth(next types.HandlerFunc) types.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) error {
        // auth logic
        return next(w, r)
    }
}
```

```go
// pkg/handlers/handlers.go
package handlers

import (
    "yourproject/pkg/middleware"
    "yourproject/pkg/types"
)

func NewUserHandler() types.HandlerFunc {
    return middleware.Auth(func(w http.ResponseWriter, r *http.Request) error {
        // handler logic
        return nil
    })
}
```

**Alternative -- use interfaces.** If `middleware` only needs to call a method on handlers, define an interface in `middleware` and have `handlers` implement it:

```go
// pkg/middleware/middleware.go
package middleware

type AuthProvider interface {
    ValidateToken(token string) (bool, error)
}
```

```go
// pkg/handlers/handlers.go
package handlers

import "yourproject/pkg/middleware"

type Server struct{}

func (s *Server) ValidateToken(token string) (bool, error) {
    return true, nil
}
```

The key principle: dependencies must form a directed acyclic graph (DAG). When two packages need each other, extract the shared surface into a third package or use interfaces so only one side imports the other.

**Verification:**
```bash
go build ./...
```
