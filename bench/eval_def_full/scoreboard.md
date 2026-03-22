# Agent Eval Scoreboard -- D / E / F Conditions (FULL Eval)

**Date:** 2026-03-22
**Model:** Sonnet (via GLM agent framework)
**Method:** LLM-as-judge, 6 dimensions (Completeness, Precision, Actionability, Structure, Efficiency, Depth)
**Protocol:** FULL eval including code artifacts on disk -- E produced 103 passing JS tests, F produced 74 passing TS tests, D produced no code files (markdown reports only)
**Total outputs scored:** 180 (12 agents x 5 tasks x 3 conditions)

**Conditions:**
- **D** = v1 agents (current/old agent descriptions from `.claude/agents/`)
- **E** = v2 agents (rewritten agent descriptions from `agents_v2/`)
- **F** = bare (no agent descriptions at all)

---

## Full Results Table

Sorted by D score descending.

| Agent | D | E | F | E LIFT | F LIFT | F vs E |
|-------|-----|-----|-----|--------|--------|--------|
| incident-responder | 4.87 | 4.90 | 4.89 | +0.03 | +0.02 | -0.01 |
| java-pro | 4.87 | 4.40 | 4.45 | -0.47 | -0.42 | +0.05 |
| websocket-engineer | 4.87 | 4.40 | 4.53 | -0.47 | -0.34 | +0.13 |
| tdd-guide | 4.84 | 4.83 | 4.37 | -0.01 | -0.47 | -0.46 |
| security-reviewer | 4.82 | 4.61 | 4.68 | -0.21 | -0.14 | +0.07 |
| full-stack-developer | 4.79 | 4.16 | 4.37 | -0.63 | -0.42 | +0.21 |
| dotnet-framework-pro | 4.78 | 4.27 | 4.79 | -0.51 | +0.01 | +0.52 |
| fastapi-pro | 4.76 | 3.72 | 3.87 | -1.04 | -0.89 | +0.15 |
| code-reviewer | 4.75 | 4.79 | 4.83 | +0.04 | +0.08 | +0.04 |
| research-analyst | 4.72 | 4.04 | 4.57 | -0.68 | -0.15 | +0.53 |
| documentation-pro | 4.71 | 4.76 | 4.47 | +0.05 | -0.24 | -0.29 |
| go-build-resolver | 4.67 | 4.55 | 4.45 | -0.12 | -0.22 | -0.10 |
| **Grand Mean** | **4.79** | **4.45** | **4.52** | **-0.34** | **-0.27** | **+0.07** |

---

## Comparison with Report-Only DEF Eval

Side-by-side of per-agent means: prior report-only eval (`bench/eval_def/scoreboard.md`) vs this full eval including code artifacts on disk.

| Agent | D prior | D full | D delta | E prior | E full | E delta | F prior | F full | F delta |
|-------|---------|--------|---------|---------|--------|---------|---------|--------|---------|
| full-stack-developer | 4.87 | 4.79 | -0.08 | 4.36 | 4.16 | -0.20 | 4.59 | 4.37 | -0.22 |
| incident-responder | 4.87 | 4.87 | +0.00 | 4.60 | 4.90 | +0.30 | 4.84 | 4.89 | +0.05 |
| **tdd-guide** | **4.87** | **4.84** | **-0.03** | **4.20** | **4.83** | **+0.63** | **3.87** | **4.37** | **+0.50** |
| **fastapi-pro** | **4.86** | **4.76** | **-0.10** | **4.04** | **3.72** | **-0.32** | **3.96** | **3.87** | **-0.09** |
| java-pro | 4.84 | 4.87 | +0.03 | 4.51 | 4.40 | -0.11 | 4.52 | 4.45 | -0.07 |
| websocket-engineer | 4.80 | 4.87 | +0.07 | 4.60 | 4.40 | -0.20 | 4.73 | 4.53 | -0.20 |
| security-reviewer | 4.76 | 4.82 | +0.06 | 4.36 | 4.61 | +0.25 | 4.48 | 4.68 | +0.20 |
| documentation-pro | 4.71 | 4.71 | +0.00 | 4.73 | 4.76 | +0.03 | 4.33 | 4.47 | +0.14 |
| dotnet-framework-pro | 4.60 | 4.78 | +0.18 | 4.45 | 4.27 | -0.18 | 4.83 | 4.79 | -0.04 |
| go-build-resolver | 4.52 | 4.67 | +0.15 | 4.75 | 4.55 | -0.20 | 4.56 | 4.45 | -0.11 |
| **code-reviewer** | **4.49** | **4.75** | **+0.26** | **4.60** | **4.79** | **+0.19** | **4.65** | **4.83** | **+0.18** |
| **research-analyst** | **4.37** | **4.72** | **+0.35** | **4.07** | **4.04** | **-0.03** | **4.36** | **4.57** | **+0.21** |
| **Grand Mean** | **4.71** | **4.79** | **+0.07** | **4.44** | **4.45** | **+0.01** | **4.48** | **4.52** | **+0.05** |

Bolded rows are agents with the largest score movements between the two eval protocols.

---

## Key Findings

### 1. D continues to dominate overall

D (4.79) outperforms E (4.45, delta -0.34) and F (4.52, delta -0.27). D is the top-scoring condition for **9 of 12 agents**. The three exceptions are incident-responder (E wins by +0.03), code-reviewer (F wins by +0.08), and documentation-pro (E wins by +0.05) -- all narrow margins. The full eval slightly widened D's advantage over E/F compared to the report-only eval (prior gap: D-E = 0.27, now 0.34).

### 2. Impact of actual code artifacts on scores

Having runnable code on disk produced **mixed and mostly modest** effects:

- **tdd-guide saw the largest positive shift.** E jumped from 4.20 to 4.83 (+0.63) and F from 3.87 to 4.37 (+0.50). E's 103-test JS suite with actual `parsePrice.js`, `rateLimiter.js`, `calculateDiscount.js`, `registerUser.js`, and `paginate.js` files directly boosted Actionability scores (from 4 to 5 on tasks where files existed). E's tdd-004 (characterization tests) scored 5.00 in the full eval -- the test.each pattern with 27 passing tests was rewarded. F's tdd-004 was the cautionary tale: its TypeScript implementation used **different discount percentages** than the original function (employee 30%, vip 25% vs original premium 20%, vip 30%), earning Precision=3 and a composite of 3.73.

- **fastapi-pro scored worse in the full eval.** E dropped from 4.04 to 3.72 (-0.32). The code artifacts on disk (JS/TS utility functions) were **unrelated to FastAPI tasks**, so the judge noted "disk code unrelated" and penalized the mismatch between the code-generation task and the actual code produced. Having irrelevant code was worse than having none.

- **full-stack-developer dropped moderately.** E: -0.20, F: -0.22. Again, E/F disk code was unrelated utility functions. The full eval judge was stricter about E storing JWT in localStorage without XSS discussion (Precision=3 on fsd-001).

- **code-reviewer and research-analyst rose.** code-reviewer: D +0.26, all conditions up. research-analyst: D +0.35. These agents produce analysis, not code, so the full eval simply re-evaluated the same reports more favorably -- no code artifact effect. This suggests inter-eval variance in the judge rather than a code artifact effect.

### 3. Agents with largest change between report-only and full eval

| Agent | Total |delta| | Pattern |
|-------|----------------|---------|
| tdd-guide | 1.16 | E/F both surged; actual passing test files boosted Actionability |
| code-reviewer | 0.63 | All conditions rose uniformly; judge variance, no code effect |
| research-analyst | 0.59 | D rose +0.35; judge was more generous on research depth |
| fastapi-pro | 0.51 | E dropped -0.32; unrelated disk code penalized |
| security-reviewer | 0.51 | E/F both rose +0.25/+0.20; judge was stricter on D's cookie critique |
| full-stack-developer | 0.50 | E/F dropped; stricter evaluation of security must-not violations |

### 4. E vs F patterns (JS 103 tests vs TS 74 tests)

F outperforms E on average by +0.07 (Grand Mean: F 4.52 vs E 4.45). This is consistent across most agents -- F beats E on 8 of 12 agents. The main exceptions:

- **tdd-guide:** E (4.83) crushes F (4.37) by -0.46. E's 103 JS tests include 26 parsePrice tests, 15 rateLimiter tests, 13 registerUser tests, 27 calculateDiscount tests, and 22 paginate tests. F's 74 TS tests are consistently fewer per task (20, 10, 10, 18, 16). More critically, F's calculateDiscount implementation deviated from the original function's behavior -- a fatal flaw for characterization testing.

- **documentation-pro:** E (4.76) beats F (4.47) by -0.29. E's getting-started guide (dp-002) scored 5.00 by showing expected command output, which F omitted.

- **go-build-resolver:** E (4.55) beats F (4.45) by -0.10. Marginal difference.

Where F excels over E: research-analyst (+0.53), dotnet-framework-pro (+0.52), full-stack-developer (+0.21), fastapi-pro (+0.15).

### 5. Precision issues flagged

- **E research-analyst (ra-001):** "Niobium $23M in late 2025" claim flagged as potentially hallucinated. The "2025 benchmark study" of four HE libraries in ra-001 and "2025 meta-analysis of 240,000 papers" in ra-005 were both marked as hard to verify.

- **F tdd-guide (tdd-004):** The calculateDiscount TypeScript implementation used employee: 0.30, vip: 0.25 instead of the original premium: 0.20, vip: 0.30. This directly contradicts the purpose of characterization testing (capture existing behavior). Precision scored 3, dragging the composite to 3.73.

- **E full-stack-developer (fsd-001):** JWT stored in localStorage without XSS risk discussion is a must-not violation. Precision=3.

- **F research-analyst (ra-001):** "246,897x" overhead figure flagged as suspiciously precise. Market projection "$0.31B to $1.52B" potentially hallucinated.

---

## LIFT Classification

| LIFT Range | Meaning | E Agents (count) | F Agents (count) |
|------------|---------|-------------------|-------------------|
| < 0 (harmful) | Scored lower than D | **9**: dotnet-framework-pro (-0.51), fastapi-pro (-1.04), full-stack-developer (-0.63), go-build-resolver (-0.12), java-pro (-0.47), research-analyst (-0.68), security-reviewer (-0.21), tdd-guide (-0.01), websocket-engineer (-0.47) | **9**: documentation-pro (-0.24), fastapi-pro (-0.89), full-stack-developer (-0.42), go-build-resolver (-0.22), java-pro (-0.42), research-analyst (-0.15), security-reviewer (-0.14), tdd-guide (-0.47), websocket-engineer (-0.34) |
| 0 to 0.1 (useless) | Negligible improvement | **3**: code-reviewer (+0.04), documentation-pro (+0.05), incident-responder (+0.03) | **3**: code-reviewer (+0.08), dotnet-framework-pro (+0.01), incident-responder (+0.02) |
| 0.1 to 0.5 (marginal) | Modest improvement | **0** | **0** |
| >= 0.5 (clear value) | Strong improvement | **0** | **0** |

Neither E nor F achieves marginal or clear-value LIFT for any agent. Both are harmful for 9 of 12 agents and useless for the remaining 3. The full eval is slightly harsher on E/F than the report-only eval was (prior report had 2 marginal E agents and 2 marginal F agents; all have dropped to harmful or useless in the full eval).

---

## Code Artifacts Impact

This section analyzes whether having actual runnable code on disk meaningfully changed eval outcomes versus the report-only markdown evaluation.

### The test: did E/F benefit from having runnable code?

E produced 103 passing JavaScript tests across 5 TDD task files and several utility function files. F produced 74 passing TypeScript tests across similar files. D produced no code files -- all code existed only in markdown blocks within reports.

### Finding: code artifacts had a measurable but **narrowly targeted** effect

**Where code artifacts helped (1 agent):**
- **tdd-guide** was the only agent where having actual test files on disk substantially changed scores. E gained +0.63 and F gained +0.50 versus the report-only eval. The judge explicitly rewarded Actionability=5 ("actual runnable files on disk, part of 103-test passing suite") versus Actionability=4 ("code in markdown only; would need to copy-paste to use") for D. This is the one clear case where code artifacts provided genuine signal.

**Where code artifacts hurt (2 agents):**
- **fastapi-pro** and **full-stack-developer** both saw E/F scores drop. The code files on disk were unrelated utility functions (JS/TS string/array/math helpers), not FastAPI endpoints or React auth components. The judge noted "disk code unrelated to this task" and in some cases this made the evaluation stricter. Having irrelevant code was a negative signal.

**Where code artifacts were irrelevant (9 agents):**
- For the remaining 9 agents (code-reviewer, documentation-pro, dotnet-framework-pro, go-build-resolver, incident-responder, java-pro, research-analyst, security-reviewer, websocket-engineer), code artifacts on disk were either N/A (review/analysis tasks) or unrelated. Score changes between the two evals for these agents reflect judge variance, not code artifact effects.

### Net assessment

Code artifacts on disk only matter when they are **directly relevant to the task being evaluated**. The tdd-guide case demonstrates genuine value: having 103 passing tests that implement the exact TDD tasks being scored is materially different from code-in-markdown. But for all other agents, the E/F code was utility function boilerplate unrelated to the agent's domain tasks. This produced either no effect or a slight negative effect.

The implication: **the E/F code suites (JS 103 tests, TS 74 tests) were too narrowly scoped to benefit most agents.** Only tdd-guide's tasks aligned with the actual code produced. A more impactful experimental design would produce domain-specific code for each agent (FastAPI endpoints for fastapi-pro, Express auth for full-stack-developer, etc.).

---

## Recommendations

1. **D remains the default choice.** Its advantage over E/F widened slightly in the full eval (D-E gap: 0.34 vs prior 0.27). D wins or ties 9 of 12 agents. Its depth, completeness, and code quality in markdown are consistently rewarded by the rubric.

2. **E is viable only for review/diagnostic tasks.** The three agents where E matches or marginally exceeds D (incident-responder, code-reviewer, documentation-pro) all produce analysis rather than code. E's conciseness is an asset when the task is identifying issues, not building implementations.

3. **F slightly outperforms E but offers no niche.** F beats E by +0.07 on average, driven mainly by research-analyst (+0.53) and dotnet-framework-pro (+0.52). F sits between D and E without excelling at either depth or efficiency.

4. **tdd-guide is the proof-of-concept for code artifacts.** When code on disk aligns with the evaluation task, it provides genuine Actionability lift. E's tdd-guide score (4.83) nearly matches D (4.84) entirely because of runnable test files.

5. **Watch for F's calculateDiscount deviation.** F's TypeScript implementation of tdd-004 used wrong discount percentages, undermining the characterization testing purpose and earning Precision=3. This is a systemic risk with code generation: the model may subtly alter business logic while producing syntactically correct code.

6. **fastapi-pro needs investigation.** fastapi-pro has the worst E score (3.72) and F score (3.87) in the entire dataset, with an E LIFT of -1.04. Both E and F produced shallow implementations lacking Redis backends, comprehensive tests, and production guidance. The full eval was even stricter than the report-only eval here.

7. **E's hallucination risk in research tasks.** research-analyst E outputs contained multiple hard-to-verify claims ("Niobium $23M", "2025 meta-analysis of 240,000 papers", specific percentage figures). While Precision remained 4-5 for most tasks, the full eval judge flagged these more consistently. Research tasks should be verified independently regardless of condition.
