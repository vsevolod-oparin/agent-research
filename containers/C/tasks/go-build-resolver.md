# Tasks

## Task 1

Build error:
```
./main.go:15:2: undefined: Config
./main.go:22:10: cannot use srv (variable of type *Server) as type Handler in argument to router.Handle
```

## Task 2

After running `go mod tidy`:
```
go: finding module for package github.com/example/deprecated-pkg
go: github.com/example/deprecated-pkg: module lookup disabled by GOPROXY=off
```

## Task 3

`go vet` warning:
```
./handler.go:34:2: printf: fmt.Sprintf call has arguments but no formatting directives
./handler.go:45:6: loopclosure: loop variable req captured by func literal
```

## Task 4

Build error after adding a new dependency:
```
go: updates to go.sum needed, disabled by -mod=readonly
```
CI pipeline is failing with this error.

## Task 5

Import cycle error:
```
package cmd/server
  imports pkg/handlers
  imports pkg/middleware
  imports pkg/handlers: import cycle not allowed
```
