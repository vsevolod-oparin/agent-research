# Evaluation Scoreboard: ab12345

**Date:** 2026-03-24
**Method:** Composite scoring (Precision x2 + Completeness x1.5 + Actionability + Structure + Efficiency + Depth) / 7.5
**Outputs:** 600 total (12 agents x 5 tasks x 10 conditions)
**Format:** Markdown-only evaluation
**Conditions:**
- **a** = Sonnet (direct execution), **b** = GLM 4.7 (direct execution)
- **Digit:** 1=F (bare), 2=D (v1), 3=I (v4/v5), 4=L (agent-creator r1), 5=O (agent-creator r4)

---

## Full Results Table

Agent mean scores across 5 tasks per condition. **Bold** = best score for that agent. Sorted by agent grand mean descending.

| Agent | a1 | a2 | a3 | a4 | a5 | b1 | b2 | b3 | b4 | b5 | Grand Mean |
|-------|----|----|----|----|----|----|----|----|----|----|------------|
| incident-responder | 4.97 | **5.00** | 4.65 | **5.00** | 4.95 | 4.11 | 4.79 | 4.87 | 4.63 | 4.71 | **4.77** |
| security-reviewer | 4.30 | **4.73** | 4.53 | 4.68 | 4.56 | 3.91 | 4.56 | 4.24 | 4.37 | 4.05 | **4.39** |
| websocket-engineer | **4.87** | **4.87** | 4.73 | **4.87** | **4.87** | 3.60 | 3.53 | 4.07 | 3.93 | 3.93 | **4.33** |
| full-stack-developer | 4.87 | **5.00** | 4.27 | **5.00** | 4.60 | 3.07 | 3.07 | 3.47 | 4.20 | 4.07 | **4.16** |
| dotnet-framework-pro | **5.00** | 4.87 | 4.87 | N/A* | 4.87 | 3.47 | 3.47 | 3.47 | 3.47 | 3.47 | **4.11**^ |
| documentation-pro | 3.97 | **4.43** | 3.90 | 3.90 | 4.27 | 3.83 | 4.30 | 4.27 | 4.10 | 4.07 | **4.10** |
| research-analyst | **4.73** | **4.73** | 4.60 | 4.53 | 4.60 | 3.67 | 3.67 | 3.13 | 3.53 | 3.40 | **4.06** |
| java-pro | 3.90 | 4.20 | 3.90 | **4.43** | **4.43** | 3.60 | 3.93 | 3.77 | 4.20 | 4.07 | **4.04** |
| go-build-resolver | 4.53 | **4.87** | 4.60 | **4.87** | **4.87** | 3.20 | 3.60 | 3.60 | 3.20 | 3.07 | **4.04** |
| code-reviewer | 3.92 | **4.40** | 4.20 | 4.36 | 4.23 | 3.55 | 3.69 | 3.79 | 4.12 | 3.95 | **4.02** |
| tdd-guide | 3.87 | 4.00 | 3.87 | **4.73** | **4.73** | 3.87 | 3.73 | 3.73 | 3.73 | 3.73 | **4.00** |
| fastapi-pro | 3.97 | 4.20 | 3.90 | **4.43** | 4.27 | 3.50 | 3.63 | 3.63 | 3.87 | 3.87 | **3.93** |

*\* dotnet-framework-pro a4 had a missing output file. Grand mean computed from 9 conditions.*

---

## Grand Mean by Condition

| a1 | a2 | a3 | a4 | a5 | b1 | b2 | b3 | b4 | b5 |
|----|----|----|----|----|----|----|----|----|-----|
| 4.41 | 4.61 | 4.33 | 4.62* | 4.60 | 3.62 | 3.83 | 3.84 | 3.95 | 3.87 |

*\* a4 grand mean computed from 11 agents (dotnet-framework-pro excluded).*

---

## Condition Rankings

| Rank | Condition | Grand Mean | Group |
|------|-----------|------------|-------|
| 1 | a4 | 4.62 | a |
| 2 | a2 | 4.61 | a |
| 3 | a5 | 4.60 | a |
| 4 | a1 | 4.41 | a |
| 5 | a3 | 4.33 | a |
| 6 | b4 | 3.95 | b |
| 7 | b5 | 3.87 | b |
| 8 | b3 | 3.84 | b |
| 9 | b2 | 3.83 | b |
| 10 | b1 | 3.62 | b |

Every a-condition outranks every b-condition. The gap between the worst a-condition (a3: 4.33) and the best b-condition (b4: 3.95) is 0.38 points.

---

## Group Analysis

### A-group vs B-group (the dominant effect)

| Group | Mean | n |
|-------|------|---|
| A-group | **4.51** | 59 outputs |
| B-group | **3.82** | 60 outputs |
| **Delta** | **+0.69** | |

The a/b prefix is the single largest effect in the dataset. The group letter explains far more variance than the digit.

### Within A-group: rank by digit

| Rank | Digit | Mean |
|------|-------|------|
| 1 | 4 | 4.62 |
| 2 | 2 | 4.61 |
| 3 | 5 | 4.60 |
| 4 | 1 | 4.41 |
| 5 | 3 | 4.33 |

Top tier: digits 4, 2, 5 are essentially tied (4.60-4.62). Bottom tier: digits 1 and 3 trail by ~0.2 points.

### Within B-group: rank by digit

| Rank | Digit | Mean |
|------|-------|------|
| 1 | 4 | 3.95 |
| 2 | 5 | 3.87 |
| 3 | 3 | 3.84 |
| 4 | 2 | 3.83 |
| 5 | 1 | 3.62 |

### Does the digit ordering match between groups?

Partially. Key patterns:

- **L (agent-creator r1) ranks #1 in both models.** The most consistent agent version regardless of execution model.
- **F (bare) ranks last or near-last in both.** No agents = worst results on both Sonnet and GLM 4.7.
- **D (v1) diverges:** #2 on Sonnet, #4 on GLM 4.7. V1's verbose instructions help Sonnet but may confuse GLM 4.7.
- **I (v4/v5) diverges:** #5 on Sonnet, #3 on GLM 4.7. V4/v5's compact format works relatively better on GLM 4.7.
- **O (agent-creator r4) is stable:** #3 on Sonnet, #2 on GLM 4.7.

The agent version ranking partially changes between models. L and F hold stable positions; D and I swap.

---

## Key Findings

### 1. Sonnet vs GLM 4.7 is the dominant signal

The 0.69-point gap between Sonnet (4.51) and GLM 4.7 (3.82) dwarfs all agent version effects. Within each model, the spread across agent versions is only 0.29 (Sonnet) and 0.33 (GLM 4.7). **The execution model matters 2-3x more than the agent instructions.**

### 2. Precision is the primary differentiator

A-conditions score higher on Precision across nearly every agent. The concise format forces focus on core findings, reducing false positives. B-conditions frequently introduce speculative findings (SQL injection false positives in code-reviewer, None-algorithm claims in security-reviewer, fabricated investigation results in incident-responder b1).

### 3. Verbosity correlates with errors

Longer outputs have more surface area for mistakes:
- **code-reviewer b1-b3**: SQL injection false positives on parameterized queries (must_not violation)
- **go-build-resolver b2-b5**: Suggest removing `-mod=readonly` from CI (must_not violation)
- **security-reviewer b5**: Claims "Missing HTTPS" when URL already uses HTTPS
- **research-analyst b1**: 950-line output with speculative market share data and emoji indicators
- **full-stack-developer b1-b2**: Missing refresh token strategies despite verbose JWT implementations

### 4. Efficiency gap is the sharpest dimensional difference

A-conditions consistently score 4.0-5.0 on Efficiency; b-conditions cluster at 2.0-3.5. The b-group pattern is to provide 3-5 "solutions" per task with full code, diluting the recommendation signal. This is most extreme for dotnet-framework-pro (all b-conditions at exactly 3.47, with Efficiency = 2 across the board).

### 5. Agent sensitivity varies dramatically

| Sensitivity | Agents | a-b Delta |
|-------------|--------|-----------|
| **High** (>1.0) | dotnet-framework-pro, full-stack-developer, go-build-resolver, research-analyst, websocket-engineer | 1.03 - 1.43 |
| **Moderate** (0.3-0.5) | code-reviewer, tdd-guide, fastapi-pro, security-reviewer | 0.33 - 0.48 |
| **Low** (<0.3) | incident-responder, java-pro, documentation-pro | -0.02 - 0.29 |

- **dotnet-framework-pro** is the most sensitive (delta 1.43): a-conditions hit 4.87-5.00, b-conditions collapse to 3.47 uniformly.
- **documentation-pro** is essentially insensitive (delta -0.02): a-group 4.09, b-group 4.11. The only agent where b slightly outperforms a.
- **incident-responder** is the least sensitive among high-performing agents (delta 0.29): strong performance regardless of style.

### 6. Three agents are robust to output style

incident-responder (4.91 vs 4.62), java-pro (4.17 vs 3.91), and documentation-pro (4.09 vs 4.11) show small deltas. These agents' tasks may be less sensitive to verbosity because their domains (incident response playbooks, Java patterns, documentation) tolerate or benefit from additional detail.

---

## Recommendations

1. **Use Sonnet for direct execution.** Sonnet produces higher quality across 11 of 12 agents. The gap (0.69) is the largest effect measured. GLM 4.7's verbosity generates more errors without more substance.

2. **L (agent-creator r1) is the safest agent version.** Ranks #1 on both Sonnet and GLM 4.7. On Sonnet: 4.62. On GLM 4.7: 3.95. Consistent regardless of model.

3. **Bare model (F) is the worst agent version on both models.** Agent instructions help on both Sonnet (+0.21 from bare to best) and GLM 4.7 (+0.33 from bare to best).

4. **For Sonnet: v1 (D) and agent-creator r4 (O) are close alternatives** to L — all three at 4.60-4.62. v4/v5 (I) trails at 4.33.

5. **For GLM 4.7: compact agents (I, O) do relatively better** than verbose v1 (D). GLM 4.7 may struggle with long, verbose agent instructions.

6. **GLM 4.7's precision problem is systemic.** It introduces must_not violations (false SQL injection, incorrect HTTPS claims, suggesting removal of -mod=readonly) that Sonnet avoids. More output = more surface area for errors. This is a model-level issue, not an agent design issue.

7. **Five agents are highly sensitive to model choice** (>1.0 point gap): dotnet-framework-pro, full-stack-developer, go-build-resolver, research-analyst, websocket-engineer. These should never run on GLM 4.7.

8. **Three agents are model-robust** (<0.3 gap): incident-responder, java-pro, documentation-pro. These can tolerate GLM 4.7 if needed.
