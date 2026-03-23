# Go Build Resolver Evaluation

## Scoring Dimensions (1-5)
- **Precision**: Correctness, no false claims, must_mention/must_not compliance
- **Completeness**: Coverage of all ground truth requirements
- **Actionability**: Can the reader directly use the output?
- **Structure**: Organization, clarity, readability
- **Efficiency**: Conciseness, no unnecessary filler
- **Depth**: Insight, nuance, understanding of edge cases

**Composite** = (Precision x 2 + Completeness x 1.5 + Actionability + Structure + Efficiency + Depth) / 7.5

---

## Ground Truth Summary

### gbr-001: undefined Config + type mismatch
- run diagnostic commands in order (go build, go vet)
- first error: missing import or unexported type
- second error: *Server doesn't implement Handler interface
- fix each minimally
- verify fix with go build

### gbr-002: GOPROXY=off module lookup
- check GOPROXY setting
- check if module is in go.sum
- check if deprecated-pkg has a replacement/fork
- suggest go env GOPROXY and potential fixes
- must_not: suggest "just remove the dependency" without checking usage

### gbr-003: go vet warnings (Sprintf + loopclosure)
- line 34: Sprintf with args but no %s/%d -- use verbs or Sprint
- line 45: goroutine capturing loop variable -- shadow or pass as argument
- both are common go vet findings
- structure: error-cause-fix format, minimal change per fix

### gbr-004: go.sum readonly in CI
- go.sum is out of date -- need go mod tidy locally
- CI uses -mod=readonly (correct behavior)
- developer should run go mod tidy and commit updated go.sum
- do NOT suggest removing -mod=readonly from CI

### gbr-005: Import cycle
- identify the cycle: handlers -> middleware -> handlers
- find shared types causing the cycle
- fix: extract shared interfaces/types to new package (e.g., pkg/types)
- verify with go build
- must_not: suggest merging packages, suggest global variables

---

## Condition Evaluations

### a1

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | All fixes correct. Task 2 checks GOPROXY, suggests replacement. Task 4 correctly says don't remove -mod=readonly. Task 5 correctly identifies cycle and extract-types fix. Go 1.22 mention in task 3 is accurate. |
| Completeness | 4 | Covers all must_mention items. Task 1 lacks explicit diagnostic command ordering. Task 2 missing explicit "check go.sum" step. |
| Actionability | 5 | Concrete bash commands and code snippets |
| Structure | 4 | Clean sections per task, but no formal error-cause-fix table |
| Efficiency | 5 | Very concise, no padding |
| Depth | 4 | Go 1.22 loop variable note is insightful. Mentions vendor mode alternative. |

**Composite**: (5x2 + 4x1.5 + 5 + 4 + 5 + 4) / 7.5 = **4.53**

### a2

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | All fixes correct. Explicit "do not remove -mod=readonly" in task 4. Task 5 has dependency inversion as alternative. |
| Completeness | 5 | Comprehensive. Task 1 has diagnostic grep commands. Task 2 has 4 options including usage check. Task 3 mentions Go 1.22. Task 4 has CI verification step. Task 5 has cycle diagram. |
| Actionability | 5 | Concrete commands and code |
| Structure | 5 | Status badges per task, clear sections |
| Efficiency | 4 | Good density, slightly more verbose than a1 |
| Depth | 5 | Dependency inversion in task 5, CI verification script in task 4, Go 1.22 context in task 3 |

**Composite**: (5x2 + 5x1.5 + 5 + 5 + 4 + 5) / 7.5 = **4.87**

### a3

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | All correct. Task 4 explicitly says not to remove -mod=readonly. Task 5 offers 4 fix strategies including merge (must_not violation partial - but presented as option, not recommendation). |
| Completeness | 5 | Very thorough. Task 2 has corporate proxy option. Task 3 has both pass-as-arg and shadow fixes. Task 5 has dependency injection alternative. |
| Actionability | 5 | Clear bash and Go code examples |
| Structure | 4 | Good organization. Task 5 mentions merge as option B (problematic per must_not). |
| Efficiency | 4 | Good but slightly verbose |
| Depth | 4 | Good alternatives presented. CI diff check suggestion is practical. |

**Composite**: (5x2 + 5x1.5 + 5 + 4 + 4 + 4) / 7.5 = **4.60**

### a4

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | Excellent accuracy. Task 2 includes "go mod why" and "go mod graph" for dependency tracing. Task 4 clearly states -mod=readonly is correct. Task 5 has interface-based dependency inversion explanation. |
| Completeness | 5 | Covers all must_mention items. Task 1 has build constraint check. Task 2 has 4 options with usage check. Task 3 has Go version context. Task 5 has comprehensive steps. |
| Actionability | 5 | Very actionable with concrete commands |
| Structure | 5 | Well-organized with numbered steps. Task 5 has step-by-step refactoring. |
| Efficiency | 4 | Slightly verbose but content-rich |
| Depth | 5 | "go mod why" suggestion is expert-level. Pointer vs value receiver distinction in task 1. Common root causes listed in task 5. |

**Composite**: (5x2 + 5x1.5 + 5 + 5 + 4 + 5) / 7.5 = **4.87**

### a5

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | All correct. Task 1 distinguishes pointer vs value receiver subtlety. Task 4 includes simulate-CI-locally command. |
| Completeness | 5 | Full coverage. Task 2 has "go mod why" and replace directives. Task 5 has diagnostic grep commands and step-by-step extraction. |
| Actionability | 5 | Every fix has concrete code/commands |
| Structure | 5 | Clean markdown with code blocks, step numbering |
| Efficiency | 4 | Good density |
| Depth | 5 | Value/pointer receiver distinction, Go 1.22 scoping, GOFLAGS simulate CI step |

**Composite**: (5x2 + 5x1.5 + 5 + 5 + 4 + 5) / 7.5 = **4.87**

### b1

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 3 | Task 1 defines a complete Config struct and full working example (too much invention, not diagnostic). Task 2 suggests setting GOPROXY in .bashrc (bad practice for project-level). Task 5 is excessively verbose with full code examples. |
| Completeness | 4 | Covers must_mention items but buries them in excessive code. Task 4 missing explicit "don't remove -mod=readonly." |
| Actionability | 4 | Code is runnable but invents too much context |
| Structure | 4 | Headers and code blocks, but verbose |
| Efficiency | 2 | Extremely verbose. Task 1 is 175 lines for two simple errors. Task 5 is hundreds of lines. |
| Depth | 3 | Wide but shallow. Lots of code, less diagnostic insight. |

**Composite**: (3x2 + 4x1.5 + 4 + 4 + 2 + 3) / 7.5 = **3.20**

### b2

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Mostly correct. Task 4 suggests "Fix 2: Modify CI to Use -mod=mod" which violates must_not (removing readonly). Task 2 suggests direct mode and vendor. |
| Completeness | 4 | Good coverage. Task 3 mentions both fixes. Task 4 has multiple options. |
| Actionability | 4 | Concrete but some suggestions are wrong (removing readonly) |
| Structure | 4 | Summary table at end is helpful |
| Efficiency | 3 | Verbose, many redundant code alternatives |
| Depth | 3 | Mentions "Understanding -mod Flags" table which is useful, but lacks deeper Go-specific insight |

**Composite**: (4x2 + 4x1.5 + 4 + 4 + 3 + 3) / 7.5 = **3.60**

### b3

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Task 4: "Option 1: Remove -mod=readonly flag" and "Option 4: Use -mod=mod" both violate must_not. Other tasks are correct. |
| Completeness | 4 | Covers items but with wrong recommendations mixed in |
| Actionability | 4 | Code examples are usable |
| Structure | 4 | Clean sections |
| Efficiency | 3 | Verbose |
| Depth | 3 | Task 5 suggests merge (must_not) and interface-based inversion. Quick reference table is nice. |

**Composite**: (4x2 + 4x1.5 + 4 + 4 + 3 + 3) / 7.5 = **3.60**

### b4

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 3 | Task 4: "Option 1: Remove -mod=readonly" directly violates must_not. "Option 4: Use -mod=mod" same violation. Task 5 option 4 suggests merging packages (must_not). |
| Completeness | 4 | Covers must_mention items but diluted with wrong options |
| Actionability | 4 | Many options given, reader must filter |
| Structure | 4 | Clear sections with options labeled |
| Efficiency | 2 | Very verbose with many alternatives, some contradictory |
| Depth | 3 | Has diagnostic commands but lacks go-specific nuance |

**Composite**: (3x2 + 4x1.5 + 4 + 4 + 2 + 3) / 7.5 = **3.20**

### b5

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 3 | Task 4: "Option 1: Remove -mod=readonly" violates must_not. "Option 3: Use -mod=mod" same. Task 2 has "Option 2: Use direct mode" with GOPROXY=off (contradictory). Task 5 option 3 has handlers importing middleware which recreates the cycle. |
| Completeness | 4 | Covers items broadly but accuracy issues |
| Actionability | 3 | Some suggestions would make things worse |
| Structure | 4 | Well-organized with diagrams |
| Efficiency | 2 | Extremely verbose with many full code examples |
| Depth | 3 | Verify section at end of each task is good practice |

**Composite**: (3x2 + 4x1.5 + 3 + 4 + 2 + 3) / 7.5 = **3.07**

---

## Summary Table

| Condition | Precision | Completeness | Actionability | Structure | Efficiency | Depth | Composite |
|-----------|-----------|-------------|---------------|-----------|------------|-------|-----------|
| a1 | 5 | 4 | 5 | 4 | 5 | 4 | 4.53 |
| a2 | 5 | 5 | 5 | 5 | 4 | 5 | 4.87 |
| a3 | 5 | 5 | 5 | 4 | 4 | 4 | 4.60 |
| a4 | 5 | 5 | 5 | 5 | 4 | 5 | 4.87 |
| a5 | 5 | 5 | 5 | 5 | 4 | 5 | 4.87 |
| b1 | 3 | 4 | 4 | 4 | 2 | 3 | 3.20 |
| b2 | 4 | 4 | 4 | 4 | 3 | 3 | 3.60 |
| b3 | 4 | 4 | 4 | 4 | 3 | 3 | 3.60 |
| b4 | 3 | 4 | 4 | 4 | 2 | 3 | 3.20 |
| b5 | 3 | 4 | 3 | 4 | 2 | 3 | 3.07 |

**Key Observations:**
- a-conditions are dramatically better than b-conditions across the board
- a-conditions consistently respect must_not constraints (never suggest removing -mod=readonly, never suggest merging packages as primary fix)
- b-conditions frequently violate must_not rules: b2/b3/b4/b5 all suggest removing -mod=readonly from CI; b1/b4 suggest merging packages
- a-conditions are 2-3x more concise while containing equal or greater substance
- a4 and a5 show expert-level Go knowledge (go mod why, pointer vs value receivers, Go 1.22 scoping)
- b-conditions tend to pad with full working examples and CI config templates that add bulk without diagnostic value
