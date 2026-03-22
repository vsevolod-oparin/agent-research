# go-build-resolver Evaluation (A/B/C)

## Task 1: gbr-001

**Ground Truth Summary:** Must mention: (1) run diagnostic commands in order (go build, go vet), (2) first error is missing import or unexported type -- check package for Config, (3) second error is *Server doesn't implement Handler interface -- check missing methods, (4) fix each minimally, (5) verify with go build. Structure: ordered diagnostic steps, minimal fix per error, verification step.

### Condition A (bare)
- must_mention coverage: 4/5 -- Covered missing import/unexported (yes), interface mismatch (yes), minimal fixes (yes), verification with go build (yes). Did NOT explicitly mention running diagnostic commands in order (go build then go vet); jumps straight to root cause.
- must_not violations: None
- Completeness: 4 -- Covers both errors thoroughly with multiple fix options; misses the diagnostic ordering emphasis.
- Precision: 5 -- All claims are technically accurate. Code examples are correct.
- Actionability: 5 -- Specific code examples for both import fix and interface implementation. Clear verification step.
- Structure: 4 -- Clean error-by-error format with root cause, fix, verification. No explicit diagnostic ordering section.
- Efficiency: 4 -- Good signal density though slightly verbose with alternatives.
- Depth: 4 -- Covers value vs pointer receiver nuance, alternative wrapping approach.
- **Composite: 4.47**

### Condition B (v1 agents)
- must_mention coverage: 4/5 -- Same as A: covers import/unexported, interface mismatch, minimal fixes, go build verification. Diagnostic ordering not explicitly structured.
- must_not violations: None
- Completeness: 4 -- Similar coverage to A. Mentions build tags as additional cause. Slightly more concise.
- Precision: 5 -- All claims correct. Mentions checking build tags (valid edge case).
- Actionability: 5 -- Code examples clear and correct. Suggests compile-time interface check `var _ Handler = (*Server)(nil)`.
- Structure: 4 -- Same error-by-error format. Clean but no diagnostic ordering section.
- Efficiency: 4 -- Slightly more concise than A. Good density.
- Depth: 4 -- Compile-time check trick is a useful addition. Build tag mention adds depth.
- **Composite: 4.47**

### Condition C (v2 agents)
- must_mention coverage: 5/5 -- Covers import/unexported, interface mismatch, minimal fixes, go build verification, and includes both `go build` and `go vet` in verification steps.
- must_not violations: None
- Completeness: 5 -- All ground truth items covered. Compile-time interface check included.
- Precision: 5 -- All claims correct.
- Actionability: 5 -- Clear code examples, compile-time check, dual verification commands.
- Structure: 4 -- Clean format, error-by-error. Verification includes both go build and go vet.
- Efficiency: 4 -- Concise and well-organized.
- Depth: 4 -- Build tag mention, compile-time interface check.
- **Composite: 4.60**

---

## Task 2: gbr-002

**Ground Truth Summary:** Must mention: (1) check GOPROXY setting, (2) check if module is in go.sum, (3) check if deprecated-pkg has replacement/fork, (4) suggest go env GOPROXY and potential fixes. Must NOT: suggest "just remove the dependency" without checking usage.

### Condition A (bare)
- must_mention coverage: 4/4 -- GOPROXY discussed, go.sum context implicit in vendor approach, replacement/fork covered, go env GOPROXY fix shown.
- must_not violations: None -- mentions removing dependency but frames it as "best long-term solution" after checking.
- Completeness: 5 -- Four options covering proxy, vendor, replace, local. Thorough.
- Precision: 5 -- All technically accurate.
- Actionability: 5 -- Specific commands for each option with exact syntax.
- Structure: 4 -- Clean option-by-option format.
- Efficiency: 4 -- Good density, each option is distinct.
- Depth: 4 -- Covers air-gapped environments, vendoring, replacement strategy.
- **Composite: 4.60**

### Condition B (v1 agents)
- must_mention coverage: 4/4 -- GOPROXY, go.sum (implicit in vendor approach), replacement/fork, fixes all covered.
- must_not violations: None
- Completeness: 5 -- Four options including private proxy. Long-term fix noted.
- Precision: 5 -- All correct.
- Actionability: 5 -- Specific commands for each option.
- Structure: 4 -- Option-by-option format. Missing verification step.
- Efficiency: 4 -- Concise options, slightly shorter than A.
- Depth: 4 -- Private proxy option adds breadth.
- **Composite: 4.60**

### Condition C (v2 agents)
- must_mention coverage: 4/4 -- All items covered.
- must_not violations: None
- Completeness: 5 -- Three clear options with verification steps.
- Precision: 5 -- All correct.
- Actionability: 5 -- Specific commands, verification steps included.
- Structure: 4 -- Clean format with verification.
- Efficiency: 4 -- Slightly more concise.
- Depth: 4 -- Similar depth to A and B.
- **Composite: 4.60**

---

## Task 3: gbr-003

**Ground Truth Summary:** Must mention: (1) line 34: Sprintf with args but no verbs -- use verbs or Sprint, (2) line 45: goroutine capturing loop variable -- shadow or pass as argument, (3) both are common go vet findings. Structure: error-cause-fix table, minimal change per fix.

### Condition A (bare)
- must_mention coverage: 3/3 -- Sprintf issue with verbs/Sprint alternative, loop variable capture with shadow/pass options, mentions "common go vet findings."
- must_not violations: None
- Completeness: 5 -- Both issues fully explained. Go 1.22 per-iteration semantics noted as bonus.
- Precision: 5 -- All correct. Code examples accurate.
- Actionability: 5 -- Before/after examples for each fix with multiple options.
- Structure: 3 -- Narrative format, not table format as required by ground truth.
- Efficiency: 4 -- Good density, though verbose with three options for loop fix.
- Depth: 5 -- Go 1.22 behavior change is a non-obvious, valuable insight.
- **Composite: 4.47**

### Condition B (v1 agents)
- must_mention coverage: 3/3 -- All items covered. Go 1.22 note included.
- must_not violations: None
- Completeness: 5 -- Thorough coverage with Go 1.22 mention.
- Precision: 5 -- All correct.
- Actionability: 5 -- Clear before/after examples.
- Structure: 3 -- Narrative format, not table format.
- Efficiency: 4 -- Slightly more concise than A.
- Depth: 5 -- Go 1.22 change mentioned with practical caveat.
- **Composite: 4.47**

### Condition C (v2 agents)
- must_mention coverage: 3/3 -- All items covered.
- must_not violations: None
- Completeness: 5 -- Same thorough coverage.
- Precision: 5 -- All correct.
- Actionability: 5 -- Clear examples.
- Structure: 3 -- Narrative, not table.
- Efficiency: 4 -- Clean and well-organized.
- Depth: 4 -- Mentions Go 1.22 but slightly less elaboration than A.
- **Composite: 4.40**

---

## Task 4: gbr-004

**Ground Truth Summary:** Must mention: (1) go.sum out of date -- run go mod tidy locally, (2) CI uses -mod=readonly (correct behavior), (3) developer should run go mod tidy and commit updated go.sum, (4) do NOT suggest removing -mod=readonly from CI. Structure: explain why CI is correct to fail, fix is local not CI config.

### Condition A (bare)
- must_mention coverage: 4/4 -- go.sum needs update, CI readonly is correct, run go mod tidy locally and commit, explicitly says do NOT change CI config.
- must_not violations: None
- Completeness: 5 -- All items covered plus prevention hook suggestion.
- Precision: 5 -- Technically accurate throughout.
- Actionability: 5 -- Exact commands with git add/commit. Prevention hook included.
- Structure: 5 -- Clearly explains CI is correct, fix is local. Well-organized.
- Efficiency: 4 -- Good density with prevention bonus.
- Depth: 5 -- Prevention hook, explains why readonly is default since Go 1.16.
- **Composite: 4.87**

### Condition B (v1 agents)
- must_mention coverage: 4/4 -- All items covered. go mod verify as extra step.
- must_not violations: None
- Completeness: 5 -- Same coverage plus vendor alternative for restricted networks.
- Precision: 5 -- All correct.
- Actionability: 5 -- Commands clear. CI check YAML example is bonus.
- Structure: 5 -- Clear local-vs-CI framing.
- Efficiency: 4 -- Good density.
- Depth: 5 -- Vendor alternative for restricted CI. YAML example for prevention.
- **Composite: 4.87**

### Condition C (v2 agents)
- must_mention coverage: 4/4 -- All items covered.
- must_not violations: None
- Completeness: 5 -- Full coverage with CI YAML example and prevention.
- Precision: 5 -- All correct.
- Actionability: 5 -- YAML CI config example is highly actionable.
- Structure: 5 -- Clear local-vs-CI framing. Prevention section.
- Efficiency: 4 -- Good density.
- Depth: 5 -- YAML CI example, go mod verify in verification steps.
- **Composite: 4.87**

---

## Task 5: gbr-005

**Ground Truth Summary:** Must mention: (1) identify cycle: handlers -> middleware -> handlers, (2) find shared types causing cycle, (3) fix: extract shared interfaces/types to new package (e.g. pkg/types), (4) verify with go build. Must NOT: suggest merging packages or global variables. Structure: cycle diagram, minimal refactoring steps, verification.

### Condition A (bare)
- must_mention coverage: 4/4 -- Cycle identified, shared types as cause, extract to pkg/types, go build verification.
- must_not violations: PARTIAL -- Mentions "merge packages" as an alternative approach, though frames it as reducing modularity. Ground truth says must NOT suggest merging.
- Completeness: 5 -- Full coverage with code examples and dependency graph.
- Precision: 4 -- Suggesting merge as alternative contradicts must_not, though it's caveated.
- Actionability: 5 -- Step-by-step with code. Dependency graph shown.
- Structure: 5 -- Dependency graph, step-by-step refactoring, verification.
- Efficiency: 4 -- Good density.
- Depth: 4 -- Interface inversion alternative is useful. DAG principle explained.
- **Composite: 4.47**

### Condition B (v1 agents)
- must_mention coverage: 4/4 -- All items covered.
- must_not violations: None -- Does not suggest merging. Uses interface inversion as alternative.
- Completeness: 5 -- Full coverage with code examples and directory layout.
- Precision: 5 -- All correct. No prohibited suggestions.
- Actionability: 5 -- Clear steps with code for both extraction and interface approaches.
- Structure: 5 -- Directory layout diagram, step-by-step, DAG principle.
- Efficiency: 4 -- Good density.
- Depth: 5 -- Interface inversion alternative well-explained. DAG principle.
- **Composite: 4.87**

### Condition C (v2 agents)
- must_mention coverage: 4/4 -- All items covered.
- must_not violations: None
- Completeness: 5 -- Full coverage with code examples.
- Precision: 5 -- All correct.
- Actionability: 5 -- Clear steps, directory layout, verification with both go build and go vet.
- Structure: 5 -- Directory layout, step-by-step, DAG principle.
- Efficiency: 4 -- Good density.
- Depth: 4 -- Leaf package concept explained. Solid but similar to B.
- **Composite: 4.80**

---

## Summary

| Task | A | B | C |
|------|---|---|---|
| gbr-001 | 4.47 | 4.47 | 4.60 |
| gbr-002 | 4.60 | 4.60 | 4.60 |
| gbr-003 | 4.47 | 4.47 | 4.40 |
| gbr-004 | 4.87 | 4.87 | 4.87 |
| gbr-005 | 4.47 | 4.87 | 4.80 |
| **Mean** | **4.58** | **4.66** | **4.65** |
| B LIFT (vs A) | -- | +0.08 | -- |
| C LIFT (vs A) | -- | -- | +0.07 |
| C vs B | -- | -- | -0.01 |
