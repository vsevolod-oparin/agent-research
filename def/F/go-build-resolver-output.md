## Task 1

**Cause:**

Two distinct errors:

1. `undefined: Config` -- The `Config` type is either defined in a different package that has not been imported, or it is unexported (starts with a lowercase letter like `config`).
2. `cannot use srv (*Server) as type Handler` -- The `*Server` type does not satisfy the `Handler` interface. It is missing one or more required methods, or a method has the wrong receiver type (value vs pointer).

**Fix:**

```go
// 1. Add the missing import for Config (adjust path to your project)
import (
    "yourproject/pkg/config"
)

// Then use it as config.Config{} instead of bare Config{}

// 2. Implement the missing interface method on *Server.
// If Handler requires:
//     ServeHTTP(http.ResponseWriter, *http.Request)
// then add:
func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    // handle request
}
```

To identify the exact missing method, check the `Handler` interface definition:

```bash
go doc yourproject/pkg/router.Handler
```

**Verification:**

```bash
go build ./...
```

---

## Task 2

**Cause:**

The module `github.com/example/deprecated-pkg` cannot be fetched because `GOPROXY=off` is set in the environment. This disables all network-based module resolution. This commonly happens in air-gapped builds or locked-down CI environments.

**Fix:**

**Option A -- Enable the proxy (preferred if network access is allowed):**

```bash
export GOPROXY=https://proxy.golang.org,direct
go mod tidy
```

**Option B -- Vendor the dependency (for restricted environments):**

```bash
# On a machine with network access:
GOPROXY=https://proxy.golang.org,direct go mod tidy
go mod vendor
git add vendor/ go.sum
git commit -m "vendor dependencies"
```

Then build with:

```bash
go build -mod=vendor ./...
```

**Option C -- Replace the deprecated package entirely:**

```go
// go.mod
replace github.com/example/deprecated-pkg => github.com/example/new-pkg v1.2.0
```

---

## Task 3

**Cause:**

Two `go vet` warnings:

1. **Line 34** -- `fmt.Sprintf` is called with arguments but the format string contains no verbs (`%s`, `%d`, etc.). The arguments are silently ignored.
2. **Line 45** -- A loop variable `req` is captured by a closure inside the loop body. All iterations share the same variable, so the closure will see only the final value.

**Fix:**

```go
// Line 34: Add formatting directives
// BEFORE:
msg := fmt.Sprintf("request failed", statusCode, err)
// AFTER:
msg := fmt.Sprintf("request failed: status=%d err=%v", statusCode, err)

// Line 45: Rebind the loop variable
// BEFORE:
for _, req := range requests {
    go func() {
        process(req) // captures loop variable
    }()
}
// AFTER (Go < 1.22):
for _, req := range requests {
    req := req // shadow with local copy
    go func() {
        process(req)
    }()
}
// AFTER (Go >= 1.22): ensure go.mod says `go 1.22` or later;
// the language spec changed loop variable semantics so each
// iteration gets its own copy. No code change needed.
```

**Verification:**

```bash
go vet ./...
```

---

## Task 4

**Cause:**

The `-mod=readonly` flag (the default since Go 1.16) prevents `go build` from modifying `go.mod` or `go.sum`. A new dependency was added to the source code, but `go.sum` was not updated before pushing.

**Fix:**

Run locally, then commit:

```bash
go mod tidy
go mod verify
git add go.mod go.sum
git commit -m "update go.sum with new dependency checksums"
git push
```

If you use vendoring, also run:

```bash
go mod vendor
git add vendor/
```

**Prevention:** Add a CI check that runs `go mod tidy` and fails if `go.mod` or `go.sum` have uncommitted changes:

```bash
go mod tidy
git diff --exit-code go.mod go.sum
```

---

## Task 5

**Cause:**

Circular dependency:

```
pkg/handlers -> pkg/middleware -> pkg/handlers
```

`handlers` imports `middleware`, and `middleware` imports `handlers` right back. Go does not allow import cycles.

**Fix:**

Extract the shared types into a new package that both can import, breaking the cycle:

```
pkg/handlers    -> pkg/middleware   (OK)
pkg/handlers    -> pkg/types        (OK)
pkg/middleware  -> pkg/types        (OK, cycle broken)
```

Concretely:

```bash
mkdir -p pkg/types
```

```go
// pkg/types/types.go
package types

type RequestHandler interface {
    Handle(ctx context.Context, req *Request) (*Response, error)
}
```

Then update both packages to import from `pkg/types` instead of each other:

```go
// pkg/middleware/auth.go
import "yourproject/pkg/types"  // instead of "yourproject/pkg/handlers"

func AuthMiddleware(next types.RequestHandler) types.RequestHandler { ... }
```

```go
// pkg/handlers/user.go
import "yourproject/pkg/types"

type UserHandler struct{ ... }
func (h *UserHandler) Handle(ctx context.Context, req *types.Request) (*types.Response, error) { ... }
```

**Verification:**

```bash
go build ./...
go vet ./...
```

The dependency graph is now acyclic: `handlers -> middleware -> types` and `handlers -> types`.
