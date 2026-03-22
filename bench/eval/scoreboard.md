# Agent Evaluation Scoreboard

Evaluated: 2026-03-22 | Model: Claude Opus 4.6 | Method: LLM-as-judge on 6 dimensions
Protocol: agent_eval.md | 12 agents × 2 tasks × 3 conditions = 72 outputs scored

---

## Full Results

### Best-in-Class Agents (v1 audit score 9)

| Agent | Audit | Bare | V1 | V2 | V1 LIFT | V2 LIFT | V2 vs V1 |
|-------|-------|------|----|----|---------|---------|----------|
| code-reviewer | 9 | 3.23 | 4.87 | 5.00 | +1.63 | +1.77 | +0.13 |
| security-reviewer | 9 | 3.43 | 3.90 | 4.93 | +0.47 | +1.50 | +1.03 |
| incident-responder | 9 | 3.43 | 4.47 | 4.87 | +1.04 | +1.44 | +0.40 |
| tdd-guide | 9 | 2.30 | 3.73 | 4.67 | +1.43 | +2.37 | +0.94 |
| go-build-resolver | 9 | 2.87 | 4.60 | 4.87 | +1.73 | +2.00 | +0.27 |
| **Mean (best)** | **9** | **3.05** | **4.31** | **4.87** | **+1.26** | **+1.82** | **+0.55** |

### Worst Offender Agents (v1 audit score 2-5)

| Agent | Audit | Bare | V1 | V2 | V1 LIFT | V2 LIFT | V2 vs V1 |
|-------|-------|------|----|----|---------|---------|----------|
| dotnet-framework-pro | 2 | 3.57 | 1.87 | 4.34 | -1.70 | +0.77 | +2.47 |
| websocket-engineer | 2 | 3.57 | 3.70 | 4.87 | +0.13 | +1.30 | +1.17 |
| research-analyst | 5 | 3.47 | 3.80 | 4.60 | +0.33 | +1.13 | +0.80 |
| full-stack-developer | 4 | 3.00 | 3.75 | 4.87 | +0.75 | +1.87 | +1.12 |
| java-pro | 4 | 3.33 | 3.77 | 4.93 | +0.43 | +1.60 | +1.17 |
| documentation-pro | 4 | 2.32 | 3.90 | 4.54 | +1.59 | +2.22 | +0.64 |
| fastapi-pro | 4 | 2.80 | 3.70 | 4.57 | +0.90 | +1.77 | +0.87 |
| **Mean (worst)** | **3.6** | **3.15** | **3.36** | **4.67** | **+0.35** | **+1.52** | **+1.18** |

### All 12 Combined

| Metric | Bare | V1 | V2 |
|--------|------|----|----|
| **Grand Mean** | **3.09** | **3.76** | **4.76** |
| **LIFT vs Bare** | — | +0.67 | **+1.67** |
| **LIFT V2 vs V1** | — | — | **+1.00** |

---

## Key Findings

### 1. One v1 agent is actively harmful

**dotnet-framework-pro v1**: LIFT = **-1.70**. The adjective-list instructions ("performance optimized, security hardened, enterprise patterns") actually displaced the model's existing .NET knowledge with buzzword padding. The bare model scored 3.57; v1 scored 1.87. This is the only agent that makes things worse.

### 2. Most v1 worst-offenders barely help

| Agent | V1 LIFT | Verdict |
|-------|---------|---------|
| dotnet-framework-pro | -1.70 | Harmful |
| websocket-engineer | +0.13 | Useless |
| research-analyst | +0.33 | Useless |
| java-pro | +0.43 | Useless |
| full-stack-developer | +0.75 | Marginal |
| fastapi-pro | +0.90 | Marginal |
| documentation-pro | +1.59 | Helpful |

Only 1 of 7 worst-offender v1 agents crosses the "clear value" threshold (+1.0).

### 3. All v2 rewrites help — every single one

Every v2 agent shows positive LIFT vs bare. Mean V2 LIFT = +1.67. The rewrite strategy works.

### 4. Worst agents gain most from v2 rewrites

| Group | Mean V2-vs-V1 gain |
|-------|--------------------|
| Best-in-class (score 9) | +0.55 |
| Worst offenders (score 2-5) | +1.18 |

Rewriting bad agents yields **2.1x more improvement** than polishing good ones.

### 5. Best-in-class v1 agents already deliver strong value

Mean V1 LIFT for score-9 agents = +1.26. These agents work because they have procedures. The v2 improvements add incremental value through:
- Verification rules and evidence requirements (security-reviewer: +1.03)
- Characterization test workflow (tdd-guide: +0.94)
- Incident classification decision tree (incident-responder: +0.40)
- Expanded fix patterns and anti-patterns (go-build-resolver: +0.27)
- Scope rules and false positive expansion (code-reviewer: +0.13)

### 6. The tdd-guide v2 had the largest single LIFT

tdd-guide V2 LIFT = +2.37 (vs bare). The characterization test workflow for tdd-004 (refactoring existing code) produced a +2.87 LIFT on that single task — the bare model jumped straight to refactoring without tests, v1 awkwardly forced Red-Green-Refactor, and v2 correctly used characterization tests.

### 7. False positive traps are the sharpest differentiator

Three tasks included false positive traps:
- **cr-004**: parameterized SQL flagged as injection — bare failed, v1/v2 passed
- **sr-005**: correct cookie config flagged as insecure — bare passed, v1 failed, v2 passed
- **fsd-004**: WebSocket suggested for unidirectional notifications — bare failed, v1/v2 passed

V2 passed all 3. V1 passed 2 of 3. Bare passed 1 of 3. Anti-pattern lists are the mechanism.

---

## Dimension Analysis (V2 vs Bare, all 12 agents)

| Dimension | Mean Gain | What Drives It |
|-----------|-----------|----------------|
| **Structure** | +2.00 | Output format templates |
| **Actionability** | +1.75 | Concrete workflow steps |
| **Depth** | +1.58 | Domain checklists, decision tables |
| **Completeness** | +1.42 | Must-answer lists, coverage checklists |
| **Efficiency** | +1.25 | Anti-patterns preventing filler |
| **Precision** | +1.00 | False positive lists, verification rules |

---

## LIFT Classification (from agent_eval.md)

| LIFT Range | Meaning | V1 Agents | V2 Agents |
|------------|---------|-----------|-----------|
| < 0 | Harmful | 1 (dotnet v1) | 0 |
| 0-0.5 | Useless | 3 | 0 |
| 0.5-1.0 | Marginal | 2 | 1 |
| > 1.0 | Clear value | 6 | **11** |

V1: 6 of 12 agents provide clear value.
V2: 11 of 12 agents provide clear value.

---

## Recommendations

1. **Replace all v1 worst-offenders with v2 immediately** — mean gain +1.18
2. **Kill dotnet-framework-pro v1** — it's actively harmful (-1.70)
3. **Deploy v2 for best-in-class agents** — smaller gains (+0.55) but still positive
4. **Prioritize false positive traps in task banks** — they're the best precision test
5. **Focus rewrites on Structure and Actionability** — highest-gain dimensions (+2.00, +1.75)
6. **For remaining 98 un-evaluated agents**: rewrite all score 2-5 agents first (28 agents), expected yield ~+1.18 per agent

---

## Files

```
bench/eval/
├── scoreboard.md                     # this file
├── code-reviewer-eval.md
├── security-reviewer-eval.md
├── incident-responder-eval.md
├── tdd-guide-eval.md
├── go-build-resolver-eval.md
├── dotnet-framework-pro-eval.md
├── websocket-engineer-eval.md
├── research-analyst-eval.md
├── full-stack-developer-eval.md
├── java-pro-eval.md
├── documentation-pro-eval.md
└── fastapi-pro-eval.md
```
