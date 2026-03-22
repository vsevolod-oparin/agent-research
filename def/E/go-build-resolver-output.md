## Task 1

### Build Error: `undefined: Config` and Interface Mismatch

**Error:**
```
./main.go:15:2: undefined: Config
./main.go:22:10: cannot use srv (variable of type *Server) as type Handler in argument to router.Handle
```

**Error 1: `undefined: Config`**

`Config` is referenced but not available. Common causes:
- Defined in another package with missing import. Fix: add the import (e.g., `import "yourproject/pkg/config"`) and reference as `config.Config`.
- In the same package but in a file not being compiled (wrong build tags, test file). Fix: ensure correct package declaration and no restrictive build tags.
- Unexported (`config` lowercase). Fix: capitalize to `Config`.

**Error 2: `cannot use srv (*Server) as type Handler`**

`*Server` does not satisfy the `Handler` interface. Add the missing method:

```go
func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    s.router.ServeHTTP(w, r)
}
```

Or wrap with the appropriate adapter if `Handler` expects a different signature.

**Verification:** `go build ./...`

---

## Task 2

### Module Lookup Disabled by GOPROXY=off

**Error:**
```
go: github.com/example/deprecated-pkg: module lookup disabled by GOPROXY=off
```

`GOPROXY=off` forbids network fetches. Options (in order of preference):

1. **Replace the deprecated dependency** with its successor. Update imports, run `go mod tidy`.

2. **Vendor approach:** Run `GOPROXY=https://proxy.golang.org,direct go mod vendor` in an environment with network access, commit `vendor/`, build with `go build -mod=vendor ./...`.

3. **Use a `replace` directive:**
   ```
   replace github.com/example/deprecated-pkg => ./local/deprecated-pkg
   ```

4. **Private proxy:** Configure Athens/Artifactory, set `GOPROXY=https://your-proxy.example.com`.

**Verification:** `go mod tidy && go build ./...`

---

## Task 3

### go vet Warnings: printf and loopclosure

**Warning 1: `fmt.Sprintf` with arguments but no formatting directives**

The code likely has: `msg := fmt.Sprintf("some message", someVar)` -- no `%s`, `%d`, `%v` in the format string.

Fix by adding the verb: `msg := fmt.Sprintf("some message: %v", someVar)` or removing extra arguments.

**Warning 2: Loop variable captured by func literal**

The code likely has:
```go
for _, req := range requests {
    go func() {
        process(req) // captures loop variable by reference
    }()
}
```

Fix by shadowing:
```go
for _, req := range requests {
    req := req // new variable scoped to this iteration
    go func() {
        process(req)
    }()
}
```

Or pass as parameter:
```go
for _, req := range requests {
    go func(r Request) {
        process(r)
    }(req)
}
```

Note: Go 1.22+ changed loop variable semantics, but `go vet` may still warn on older module versions.

**Verification:** `go vet ./...`

---

## Task 4

### go.sum Out of Date in -mod=readonly CI

**Error:**
```
go: updates to go.sum needed, disabled by -mod=readonly
```

The CI builds with `-mod=readonly`, preventing `go.sum` modification. A new dependency was added to `go.mod` but `go.sum` wasn't updated before committing.

**Fix (on development machine, before pushing):**

```bash
go mod tidy
go mod verify
git add go.mod go.sum
git commit -m "Update go.sum after adding new dependency"
```

**Prevention:** Add a CI check:
```bash
go mod tidy
git diff --exit-code go.mod go.sum || (echo "ERROR: go.mod/go.sum not up to date" && exit 1)
```

**Verification:** CI passes `go build -mod=readonly ./...`

---

## Task 5

### Import Cycle Resolution

**Error:**
```
package cmd/server
  imports pkg/handlers
  imports pkg/middleware
  imports pkg/handlers: import cycle not allowed
```

**Fix: Extract shared types into a new package.**

Before (cyclic):
```
pkg/handlers --> pkg/middleware --> pkg/handlers
```

After (acyclic):
```
pkg/handlers --> pkg/types <-- pkg/middleware
```

**Steps:**
1. Create `pkg/types/types.go`
2. Move shared types (whatever `middleware` imports from `handlers`) into `pkg/types`
3. Update both packages to import from `pkg/types`

**Alternative: Use interfaces (dependency inversion):**

```go
// pkg/middleware/middleware.go
type RequestHandler interface {
    HandleRequest(ctx context.Context, req *http.Request) error
}
```

`pkg/handlers` satisfies the interface implicitly. `pkg/middleware` depends on the interface, not on `pkg/handlers`.

**Verification:** `go build ./...` -- cycle error gone. Then `go vet ./...` and `go test ./...`.

---

## Summary

| Task | Error | Fix |
|------|-------|-----|
| 1 | `undefined: Config` / interface mismatch | Add missing import; implement missing interface method |
| 2 | GOPROXY=off | Vendor, module proxy, replace directive, or swap package |
| 3 | go vet printf/loopclosure | Add format directive; shadow loop variable |
| 4 | go.sum out of date | `go mod tidy` locally, commit both go.mod and go.sum |
| 5 | Import cycle | Extract shared types or use interface-based dependency inversion |
