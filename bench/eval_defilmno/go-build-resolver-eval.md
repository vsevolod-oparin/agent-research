# go-build-resolver Evaluation (D/E/F/I/L/M/N/O)

## Task 1: gbr-001
**Ground Truth Summary:** Diagnose two build errors (undefined Config, interface mismatch), run diagnostics in order, fix minimally, verify.

### Condition D
- must_mention: 4/4 (diagnostic commands implied via `go build`, missing import/unexported type checked, interface method checked, minimal fixes, verification with go build)
- must_not violations: none
- **Precision:** 5 -- All suggestions are accurate and relevant
- **Completeness:** 4 -- Covers both errors thoroughly but doesn't explicitly mention running `go vet` as a diagnostic step
- **Actionability:** 5 -- Concrete code examples for both fixes
- **Structure:** 4 -- Clear separation of errors with summary, but not a strict ordered diagnostic table
- **Efficiency:** 4 -- Thorough but somewhat verbose
- **Depth:** 5 -- Multiple fix options with reasoning
- **Composite: 4.47**

### Condition E
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5 -- Accurate and concise
- **Completeness:** 4 -- Covers both errors, includes verification
- **Actionability:** 5 -- Code examples, commands
- **Structure:** 5 -- Clean, concise, well-organized
- **Efficiency:** 5 -- Most concise of all conditions
- **Depth:** 4 -- Less exploration of edge cases than D
- **Composite: 4.60**

### Condition F
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4 -- Mentions `go doc` for interface discovery
- **Actionability:** 5 -- Good code examples
- **Structure:** 4 -- Clear but standard
- **Efficiency:** 4 -- Moderate length
- **Depth:** 4 -- Mentions Go 1.22 and build tags
- **Composite: 4.40**

### Condition I
- must_mention: 5/5 (explicitly mentions diagnostic ordering with go build then go vet, both errors diagnosed, minimal fixes, verification)
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Most thorough: covers build tags, mentions checking git history, adapter pattern, value/pointer receivers
- **Actionability:** 5 -- Multiple fix options with code
- **Structure:** 5 -- Excellent organization with numbered options ranked by invasiveness
- **Efficiency:** 3 -- Very verbose
- **Depth:** 5 -- Deepest exploration of all conditions
- **Composite: 4.60**

### Condition L
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4
- **Actionability:** 5
- **Structure:** 4 -- Good with prevention tips
- **Efficiency:** 4
- **Depth:** 4
- **Composite: 4.40**

### Condition M
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 4
- **Depth:** 4
- **Composite: 4.40**

### Condition N
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 4
- **Depth:** 4
- **Composite: 4.40**

### Condition O
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 4
- **Depth:** 4
- **Composite: 4.40**

---

## Task 2: gbr-002
**Ground Truth Summary:** GOPROXY=off blocking module lookup. Check GOPROXY, check go.sum, check for replacement/fork, suggest go env GOPROXY. Must not suggest removing dependency without checking usage.

### Condition D
- must_mention: 4/4 (checks GOPROXY, mentions go.sum via vendoring, suggests replacement, shows `go env GOPROXY` via GOPROXY setting)
- must_not violations: none -- does not suggest removing without checking
- **Precision:** 5
- **Completeness:** 4 -- Multiple options (A-D) cover all scenarios
- **Actionability:** 5 -- Specific commands
- **Structure:** 4
- **Efficiency:** 4
- **Depth:** 4
- **Composite: 4.40**

### Condition E
- must_mention: 3/4 (checks GOPROXY, replacement, vendoring; doesn't explicitly suggest `go env GOPROXY` command)
- must_not violations: none
- **Precision:** 5
- **Completeness:** 3 -- More concise, misses some detail
- **Actionability:** 4
- **Structure:** 4
- **Efficiency:** 5
- **Depth:** 3
- **Composite: 3.93**

### Condition F
- must_mention: 3/4 (similar to E)
- must_not violations: none
- **Precision:** 5
- **Completeness:** 3
- **Actionability:** 4
- **Structure:** 4
- **Efficiency:** 5
- **Depth:** 3
- **Composite: 3.93**

### Condition I
- must_mention: 4/4 (explicit `go env GOPROXY` and related env vars, module mirror check, `go mod why`, replacement check)
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Includes `go mod why`, `go mod graph`, module mirror curl check, transitive dependency analysis
- **Actionability:** 5
- **Structure:** 5 -- Table for scenarios, ordered steps
- **Efficiency:** 3 -- Very verbose
- **Depth:** 5
- **Composite: 4.60**

### Condition L
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 4
- **Depth:** 4
- **Composite: 4.40**

### Condition M
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 4
- **Depth:** 4
- **Composite: 4.40**

### Condition N
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4 -- Includes `go mod why`
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 4
- **Depth:** 4
- **Composite: 4.40**

### Condition O
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 4
- **Depth:** 4
- **Composite: 4.40**

---

## Task 3: gbr-003
**Ground Truth Summary:** go vet warnings: Sprintf with no directives (use verbs or Sprint), loopclosure (shadow or pass as argument). Both are common patterns. Error-cause-fix table format, minimal changes.

### Condition D
- must_mention: 3/3
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Mentions Go 1.22 semantics, data race implication
- **Actionability:** 5 -- Both fix options shown
- **Structure:** 4 -- Clear but not table format
- **Efficiency:** 4
- **Depth:** 5 -- Mentions both are real bugs, not style issues
- **Composite: 4.53**

### Condition E
- must_mention: 3/3
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 5
- **Depth:** 4
- **Composite: 4.40**

### Condition F
- must_mention: 3/3
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Includes directive choice table
- **Actionability:** 5
- **Structure:** 5 -- Directive type table
- **Efficiency:** 4
- **Depth:** 5 -- Race flag suggestion
- **Composite: 4.73**

### Condition I
- must_mention: 3/3
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5
- **Actionability:** 5
- **Structure:** 5 -- Directive table, clear sections
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition L
- must_mention: 3/3
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 4
- **Depth:** 4
- **Composite: 4.40**

### Condition M
- must_mention: 3/3
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 4
- **Depth:** 4
- **Composite: 4.40**

### Condition N
- must_mention: 3/3
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 4
- **Depth:** 4
- **Composite: 4.40**

### Condition O
- must_mention: 3/3
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 4
- **Depth:** 4
- **Composite: 4.40**

---

## Task 4: gbr-004
**Ground Truth Summary:** go.sum out of date, CI uses -mod=readonly correctly, developer must run go mod tidy and commit. Do NOT suggest removing -mod=readonly from CI.

### Condition D
- must_mention: 4/4
- must_not violations: none (explicitly says do not suggest removing -mod=readonly via GOFLAGS workaround only as fallback)
- **Precision:** 5
- **Completeness:** 5 -- Prevention hook, CI check
- **Actionability:** 5
- **Structure:** 5 -- Clear explanation of why CI is correct
- **Efficiency:** 4
- **Depth:** 5
- **Composite: 4.73**

### Condition E
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 5
- **Depth:** 4
- **Composite: 4.40**

### Condition F
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 4
- **Depth:** 4
- **Composite: 4.40**

### Condition I
- must_mention: 4/4
- must_not violations: none -- explicitly warns against using -mod=mod
- **Precision:** 5
- **Completeness:** 5 -- Includes pre-commit hook, .gitignore check, Go version matching advice
- **Actionability:** 5
- **Structure:** 5 -- Numbered steps, CI hardening section
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition L
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 4
- **Depth:** 5
- **Composite: 4.73**

### Condition M
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 4
- **Depth:** 4
- **Composite: 4.40**

### Condition N
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 4
- **Depth:** 4
- **Composite: 4.40**

### Condition O
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 4
- **Depth:** 4
- **Composite: 4.40**

---

## Task 5: gbr-005
**Ground Truth Summary:** Import cycle handlers->middleware->handlers. Extract shared types to new package. Verify with go build. Must not suggest merging packages or global variables.

### Condition D
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Both extraction and interface strategies
- **Actionability:** 5 -- Concrete code, dependency graph diagrams
- **Structure:** 5 -- Before/after diagram
- **Efficiency:** 4
- **Depth:** 5
- **Composite: 4.73**

### Condition E
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4 -- Both strategies covered concisely
- **Actionability:** 5
- **Structure:** 5 -- Before/after arrows
- **Efficiency:** 5
- **Depth:** 4
- **Composite: 4.53**

### Condition F
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 4
- **Depth:** 4
- **Composite: 4.40**

### Condition I
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Three strategies (extraction, interfaces, composition root), plus `go list -deps` verification
- **Actionability:** 5
- **Structure:** 5 -- Cycle diagram, recommended approach section
- **Efficiency:** 3 -- Very verbose
- **Depth:** 5 -- Dependency inversion principle discussed
- **Composite: 4.60**

### Condition L
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition M
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 4
- **Depth:** 4
- **Composite: 4.40**

### Condition N
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 4
- **Depth:** 5
- **Composite: 4.73**

### Condition O
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 4
- **Depth:** 4
- **Composite: 4.40**

---

## Summary

| Task | D | E | F | I | L | M | N | O |
|------|---|---|---|---|---|---|---|---|
| gbr-001 | 4.47 | 4.60 | 4.40 | 4.60 | 4.40 | 4.40 | 4.40 | 4.40 |
| gbr-002 | 4.40 | 3.93 | 3.93 | 4.60 | 4.40 | 4.40 | 4.40 | 4.40 |
| gbr-003 | 4.53 | 4.40 | 4.73 | 4.60 | 4.40 | 4.40 | 4.40 | 4.40 |
| gbr-004 | 4.73 | 4.40 | 4.40 | 4.60 | 4.73 | 4.40 | 4.40 | 4.40 |
| gbr-005 | 4.73 | 4.53 | 4.40 | 4.60 | 4.60 | 4.40 | 4.73 | 4.40 |
| **Mean** | **4.57** | **4.37** | **4.37** | **4.60** | **4.51** | **4.40** | **4.47** | **4.40** |
