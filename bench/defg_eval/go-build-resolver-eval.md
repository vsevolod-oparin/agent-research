# go-build-resolver Evaluation (D/E/F/G/H/I)

## Task 1: gbr-001
**Ground Truth Summary:** Diagnose two build errors (undefined Config, interface mismatch), run diagnostics in order (go build, go vet), fix minimally, verify.

### Condition D
- must_mention: 4/5 — mentions missing import/unexported type for Config, *Server missing Handler methods, minimal fixes (add import/implement method), verify with go build. Does NOT explicitly mention running diagnostic commands in order (go build, go vet) as a workflow step.
- must_not violations: none
- Completeness: 4 — covers both errors thoroughly but lacks explicit diagnostic ordering workflow
- Precision: 5 — all claims are accurate and specific
- Actionability: 5 — provides exact code fixes with multiple scenarios
- Structure: 4 — clear separation of errors with summary table, but not in error-cause-fix table format
- Efficiency: 4 — thorough but slightly verbose
- Depth: 4 — good exploration of alternatives (adapter pattern, build tags)
- **Composite: 4.27**

### Condition E
- must_mention: 5/5 — mentions diagnostic ordering (verification with go build, go vet), Config import/unexported, *Server interface, minimal fix, verification
- must_not violations: none
- Completeness: 5 — all ground truth points covered concisely
- Precision: 5 — accurate throughout
- Actionability: 5 — code examples for both fixes
- Structure: 5 — clean, ordered, with summary table
- Efficiency: 5 — very concise while comprehensive
- Depth: 4 — covers alternatives (shadowing, interface inversion) but less exploratory than some
- **Composite: 4.73**

### Condition F
- must_mention: 5/5 — diagnostic commands (go doc, go build), Config import/unexported, interface method, minimal fix, verification
- must_not violations: none
- Completeness: 5 — all points covered
- Precision: 5 — accurate
- Actionability: 5 — provides go doc command, code fixes
- Structure: 4 — well organized but slightly less structured than E
- Efficiency: 4 — good balance
- Depth: 4 — mentions Go 1.22 loop variable change, build tags
- **Composite: 4.53**

### Condition G
- must_mention: 5/5 — all points covered including diagnostic ordering and verification steps
- must_not violations: none
- Completeness: 5 — thorough coverage
- Precision: 5 — accurate
- Actionability: 5 — code examples, verification commands
- Structure: 4 — well organized with clear sections
- Efficiency: 4 — slightly longer but well justified
- Depth: 4 — good coverage of causes and alternatives
- **Composite: 4.53**

### Condition H
- must_mention: 5/5 — all points covered with detailed diagnostic ordering, root cause analysis, verification
- must_not violations: none
- Completeness: 5 — comprehensive
- Precision: 5 — accurate with nuanced details (build tags, pointer/value receiver)
- Actionability: 5 — grep commands for diagnosis, code fixes, adapter pattern
- Structure: 5 — excellent structure with ranked causes, fix options from least to most invasive
- Efficiency: 4 — longer but density is high
- Depth: 5 — covers build tags, pointer/value receiver mismatch, cascading errors from refactor
- **Composite: 4.80**

### Condition I
- must_mention: 5/5 — identical to H (same output)
- must_not violations: none
- Completeness: 5 — same as H
- Precision: 5 — same as H
- Actionability: 5 — same as H
- Structure: 5 — same as H
- Efficiency: 4 — same as H
- Depth: 5 — same as H
- **Composite: 4.80**

---

## Task 2: gbr-002
**Ground Truth Summary:** Check GOPROXY setting, check go.sum, check for replacement/fork, suggest go env GOPROXY. Must not suggest "just remove" without checking usage.

### Condition D
- must_mention: 4/4 — GOPROXY setting, module in go.sum (vendor approach), replacement/fork, go env GOPROXY (implicit via setting GOPROXY)
- must_not violations: none (does not suggest removing without checking)
- Completeness: 4 — covers all key points
- Precision: 5 — accurate
- Actionability: 5 — multiple concrete options with commands
- Structure: 4 — options clearly labeled A-D
- Efficiency: 4 — good balance
- Depth: 4 — covers vendor, replace directive, proxy approaches
- **Composite: 4.27**

### Condition E
- must_mention: 4/4 — all points covered
- must_not violations: none
- Completeness: 4 — covers all points concisely
- Precision: 5 — accurate
- Actionability: 4 — options listed but less detail than D
- Structure: 4 — ordered options
- Efficiency: 5 — very concise
- Depth: 3 — less exploration of why GOPROXY=off might be set
- **Composite: 4.07**

### Condition F
- must_mention: 4/4 — all covered
- must_not violations: none
- Completeness: 4 — all points
- Precision: 5 — accurate
- Actionability: 4 — concrete options
- Structure: 4 — clear
- Efficiency: 4 — appropriate length
- Depth: 3 — adequate but not exceptional
- **Composite: 3.93**

### Condition G
- must_mention: 4/4 — all covered with good detail
- must_not violations: none
- Completeness: 5 — thorough with GOPRIVATE mention
- Precision: 5 — accurate
- Actionability: 5 — concrete commands
- Structure: 4 — clear options
- Efficiency: 4 — slightly verbose
- Depth: 4 — covers GOPRIVATE, module mirror check
- **Composite: 4.40**

### Condition H
- must_mention: 4/4 — all covered extensively with go env commands, go.sum check, replacement check
- must_not violations: none
- Completeness: 5 — comprehensive with go mod why, go mod graph diagnostics
- Precision: 5 — accurate and nuanced
- Actionability: 5 — step-by-step with commands for each scenario
- Structure: 5 — excellent with table for scenarios, ordered steps
- Efficiency: 4 — thorough but lengthy
- Depth: 5 — covers transitive deps, module mirror permanent cache, CI config
- **Composite: 4.73**

### Condition I
- must_mention: 4/4 — same as H
- must_not violations: none
- Completeness: 5 — same as H
- Precision: 5 — same as H
- Actionability: 5 — same as H
- Structure: 5 — same as H
- Efficiency: 4 — same as H
- Depth: 5 — same as H
- **Composite: 4.73**

---

## Task 3: gbr-003
**Ground Truth Summary:** Line 34 Sprintf with args but no verbs; line 45 loop variable capture. Both common go vet patterns. Error-cause-fix table format preferred.

### Condition D
- must_mention: 3/3 — Sprintf verbs/Sprint, loop variable shadow/param, common go vet patterns
- must_not violations: none
- Completeness: 5 — thorough with Go 1.22 note
- Precision: 5 — identifies both as real bugs (not style issues)
- Actionability: 5 — exact fix code for both
- Structure: 4 — clear sections per warning but no table format
- Efficiency: 4 — good
- Depth: 5 — notes data race implication, Go 1.22 semantics
- **Composite: 4.53**

### Condition E
- must_mention: 3/3 — all covered
- must_not violations: none
- Completeness: 4 — good coverage
- Precision: 5 — accurate
- Actionability: 5 — two fix options for each
- Structure: 4 — clean
- Efficiency: 5 — very concise
- Depth: 4 — Go 1.22 note
- **Composite: 4.40**

### Condition F
- must_mention: 3/3 — all covered
- must_not violations: none
- Completeness: 4 — good
- Precision: 5 — accurate
- Actionability: 5 — clear code fixes
- Structure: 4 — clean sections
- Efficiency: 4 — good
- Depth: 4 — Go 1.22 mention
- **Composite: 4.27**

### Condition G
- must_mention: 3/3 — all covered
- must_not violations: none
- Completeness: 5 — thorough
- Precision: 5 — accurate
- Actionability: 5 — multiple options per fix
- Structure: 4 — good sections
- Efficiency: 4 — adequate
- Depth: 4 — Go 1.22 note, both options
- **Composite: 4.40**

### Condition H
- must_mention: 3/3 — all covered with format directive table
- must_not violations: none
- Completeness: 5 — comprehensive
- Precision: 5 — accurate, notes both are real bugs
- Actionability: 5 — code fixes, go test -race suggestion
- Structure: 5 — includes directive table, clear before/after
- Efficiency: 4 — thorough
- Depth: 5 — directive table, -race flag, Go 1.22, option comparison
- **Composite: 4.73**

### Condition I
- must_mention: 3/3 — same as H
- must_not violations: none
- Completeness: 5 — same as H
- Precision: 5 — same as H
- Actionability: 5 — same as H
- Structure: 5 — same as H
- Efficiency: 4 — same as H
- Depth: 5 — same as H
- **Composite: 4.73**

---

## Task 4: gbr-004
**Ground Truth Summary:** go.sum out of date, CI uses -mod=readonly correctly, developer must run go mod tidy locally. Must NOT suggest removing -mod=readonly from CI.

### Condition D
- must_mention: 4/4 — go.sum out of date, CI -mod=readonly correct, run go mod tidy locally, do not remove -mod=readonly
- must_not violations: none (mentions GOFLAGS='' as temp workaround but clearly states correct fix is local)
- Completeness: 5 — all points covered with prevention
- Precision: 5 — accurate
- Actionability: 5 — exact commands
- Structure: 5 — explains why CI is correct, fix is local
- Efficiency: 4 — good
- Depth: 4 — prevention checklist
- **Composite: 4.53**

### Condition E
- must_mention: 4/4 — all covered
- must_not violations: none
- Completeness: 5 — all points with CI check
- Precision: 5 — accurate
- Actionability: 5 — commands provided
- Structure: 5 — clear structure
- Efficiency: 5 — concise
- Depth: 4 — CI check prevention
- **Composite: 4.73**

### Condition F
- must_mention: 4/4 — all covered
- must_not violations: none
- Completeness: 5 — all points
- Precision: 5 — accurate
- Actionability: 5 — commands with vendor note
- Structure: 4 — clear
- Efficiency: 4 — good
- Depth: 4 — CI check, vendor note
- **Composite: 4.40**

### Condition G
- must_mention: 4/4 — all covered with emphasis on not changing CI
- must_not violations: none
- Completeness: 5 — comprehensive
- Precision: 5 — accurate, notes go.sum must not be in .gitignore
- Actionability: 5 — step-by-step with local CI simulation
- Structure: 5 — clear "fix locally, not in CI" framing
- Efficiency: 4 — thorough
- Depth: 5 — .gitignore check, go build -mod=readonly local test
- **Composite: 4.73**

### Condition H
- must_mention: 4/4 — all covered with extensive detail
- must_not violations: none (explicitly warns against -mod=mod in CI)
- Completeness: 5 — comprehensive with why-this-happens scenarios
- Precision: 5 — accurate
- Actionability: 5 — Makefile target, pre-commit hook
- Structure: 5 — why CI is correct + alternative section explicitly warning against it
- Efficiency: 4 — very detailed
- Depth: 5 — pre-commit hook code, .gitignore check, go.sum tracking verification
- **Composite: 4.80**

### Condition I
- must_mention: 4/4 — same as H
- must_not violations: none
- Completeness: 5 — same as H
- Precision: 5 — same as H
- Actionability: 5 — same as H
- Structure: 5 — same as H
- Efficiency: 4 — same as H
- Depth: 5 — same as H
- **Composite: 4.80**

---

## Task 5: gbr-005
**Ground Truth Summary:** Identify cycle handlers->middleware->handlers, find shared types, extract to new package (e.g. pkg/types), verify with go build. Must NOT suggest merging packages or global variables.

### Condition D
- must_mention: 4/4 — cycle identified, shared types, extract to pkg/types, verify
- must_not violations: none
- Completeness: 5 — covers cycle diagram, extraction, interface alternative
- Precision: 5 — accurate with dependency graph after fix
- Actionability: 5 — concrete code examples for pkg/types
- Structure: 5 — cycle diagram, refactoring steps, verification
- Efficiency: 4 — thorough
- Depth: 5 — interface-based dependency inversion alternative
- **Composite: 4.73**

### Condition E
- must_mention: 4/4 — all covered
- must_not violations: none
- Completeness: 5 — cycle diagram, extraction, interface alternative
- Precision: 5 — accurate
- Actionability: 5 — code and verification
- Structure: 5 — before/after diagrams
- Efficiency: 5 — very concise
- Depth: 4 — good but less detailed than D
- **Composite: 4.73**

### Condition F
- must_mention: 4/4 — all covered
- must_not violations: none
- Completeness: 5 — thorough with concrete code
- Precision: 5 — accurate
- Actionability: 5 — full code examples
- Structure: 5 — clear steps with dependency graph
- Efficiency: 4 — good
- Depth: 4 — interface alternative, acyclic verification
- **Composite: 4.53**

### Condition G
- must_mention: 4/4 — all covered thoroughly
- must_not violations: none
- Completeness: 5 — comprehensive with cmd/server wiring
- Precision: 5 — accurate
- Actionability: 5 — full refactoring steps with code
- Structure: 5 — clear before/after, step-by-step
- Efficiency: 4 — detailed
- Depth: 5 — dependency inversion, domain package alternative
- **Composite: 4.73**

### Condition H
- must_mention: 4/4 — all covered with three strategies
- must_not violations: none
- Completeness: 5 — three strategies plus recommendation
- Precision: 5 — accurate, nuanced
- Actionability: 5 — grep commands to diagnose, full code for each strategy
- Structure: 5 — excellent with strategies ranked, before/after, verification with go list
- Efficiency: 4 — longer but high value density
- Depth: 5 — composition root pattern, dependency inversion, go list verification
- **Composite: 4.80**

### Condition I
- must_mention: 4/4 — same as H
- must_not violations: none
- Completeness: 5 — same as H
- Precision: 5 — same as H
- Actionability: 5 — same as H
- Structure: 5 — same as H
- Efficiency: 4 — same as H
- Depth: 5 — same as H
- **Composite: 4.80**

---

## Summary

| Task | D | E | F | G | H | I |
|------|---|---|---|---|---|---|
| gbr-001 | 4.27 | 4.73 | 4.53 | 4.53 | 4.80 | 4.80 |
| gbr-002 | 4.27 | 4.07 | 3.93 | 4.40 | 4.73 | 4.73 |
| gbr-003 | 4.53 | 4.40 | 4.27 | 4.40 | 4.73 | 4.73 |
| gbr-004 | 4.53 | 4.73 | 4.40 | 4.73 | 4.80 | 4.80 |
| gbr-005 | 4.73 | 4.73 | 4.53 | 4.73 | 4.80 | 4.80 |
| **Mean** | **4.47** | **4.53** | **4.33** | **4.56** | **4.77** | **4.77** |
