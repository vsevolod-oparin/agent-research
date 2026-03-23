# Security Reviewer Agent -- Deep Research Report v2

**Current version:** v4 | **Score:** 4.74 | **v1 score:** 4.87 | **Regression:** -0.13
One of two agents where v1 still outperforms v4. The regression is caused by self-censoring from overly strict verification requirements.

---

## 1. Landscape

The AI security scanning space has split into three tiers:

**Tier 1: AI-augmented traditional SAST** -- Semgrep, Checkmarx, Fortify Aviator, GitLab Advanced SAST. These use rules for detection and bolt on AI for triage/fix suggestions. GitLab now offers "Agentic SAST Vulnerability Resolution" that auto-generates MRs for HIGH/CRITICAL findings. Aikido's AutoTriage uses reasoning models downstream of scans to filter false positives, claiming 2x better FP detection than non-reasoning approaches on complex cases (source: Aikido docs). AppSecAI's ETA claims 97% accuracy in identifying true vulnerabilities across Checkmarx, Fortify, SonarQube, CodeQL, Veracode.

**Tier 2: AI-native detection** -- Corgea, ZeroPath, Arnica. The AI IS the detection engine. Can find logic flaws, not just pattern matches. Arnica scans every push. ZeroPath does auto-patching.

**Tier 3: Reasoning-based** -- Claude Code Security (500+ zero-days in production OSS), AISLE (12/12 OpenSSL zero-days, Jan 2026), Sean Heelan + o3 (CVE-2025-37899 in Linux kernel SMB, 12K lines), Cecuro (92% vs 34% baseline on DeFi exploits). These use hypothesis generation + verification, not rule matching. This is where the frontier is.

**Key market data:**
- Checkmarx Tolly report: 36.3% false positive rate (source: prior research)
- Veracode: <1.1% FP rate, industry-leading (source: prior research)
- IBM 2023: organizations receive ~11,000 security alerts daily, up to 70% false positives (source: Avatier/IBM report)
- Gartner: AI-powered anomaly detection reduces FPs by up to 80% (source: Avatier/Gartner)
- OpenAI Codex reviewer: comments on 36% of Codex-generated PRs; 46% result in code changes (source: alignment.openai.com/scaling-code-verification)

**Critical new development -- OpenAI's code reviewer philosophy (June 2025):**
OpenAI explicitly chose to optimize for signal-to-noise FIRST, then push recall without compromising reliability. Their key insight: "We explicitly accepted a measured tradeoff: modestly reduced recall in exchange for high signal quality and developer trust." They found that repo-wide tools and execution are necessary for strong review -- diff-only review misses critical context. Even at a small fraction of the generator's token spend, the verifier catches a large share of high-severity issues.

## 2. Failure Modes

### Self-censoring (THE v4 regression cause)
The v4 agent says: "prove it is reachable... without this chain, downgrade to informational -- unproven findings waste reviewer time and erode trust." This is correct in principle but creates a failure mode where the agent suppresses legitimate findings it cannot fully trace within its context window. The agent interprets "cannot prove" as "should not report" rather than "should report with lower confidence."

This is NOT unique to our agent. Thornton (2026, arXiv:2602.16741) found that commercial LLMs have 89-96% baseline vulnerability detection accuracy but failures concentrate on "inherently difficult vulnerability classes, including race conditions, timing side channels, and complex authorization logic" -- exactly the classes where evidence chains are hardest to construct. A strict "prove or downgrade" policy systematically filters out the hardest-to-find vulnerabilities.

### Cubic's 51% FP reduction case study
Cubic (AI code review platform) found that their initial single-agent approach produced excessive false positives. Three architectural changes achieved 51% FP reduction without sacrificing recall (source: zenml.io/llmops-database):
1. **Structured reasoning output** -- requiring JSON with distinct reasoning, finding, and confidence score fields. When reasoning was flawed, patterns became identifiable.
2. **Tool reduction** -- fewer tools meant less "attention" wasted on tool selection. Sweet spot: enough tools to be effective, not so many that selection becomes a bottleneck.
3. **Specialized micro-agents** -- modular agents for specific review aspects, not one monolithic reviewer.

### False positive pattern over-matching
The v4 agent lists 8 explicit "do NOT flag without proof" patterns. These are correct individually but create a halo effect where the agent becomes hesitant to flag ANYTHING that resembles these patterns, even when context clearly indicates a real issue.

### Severity miscalibration
Two failure modes: everything-is-CRITICAL (erodes trust as fast as FPs) and everything-is-informational (the self-censoring variant). The market consensus from Aikido, Mobb, and AppSecAI is that severity must be context-dependent: the same pattern is CRITICAL on a login endpoint and LOW on an internal admin tool.

### Missing cross-file analysis
Thornton (2026) found that "failures concentrate on inherently difficult vulnerability classes" including race conditions and authorization logic -- these almost always require cross-file data flow tracing. Single-file review misses them.

## 3. Best-in-Class Improvements

### What the frontier looks like

**OpenAI's Codex Reviewer (the new gold standard for deployed AI review):**
- Optimizes for precision first, then recall -- "the expected benefit from seeing a proposed bug finding must outweigh the expected cost to verify it and the damage from a false alarm"
- Uses repo-wide tools and code execution, not just diff context
- Steerable tradeoffs via custom task instructions or repo-level configuration
- Inference-time verification gap: "Generating a correct code change often requires broad search and many tokens, while falsifying a proposed change usually needs only targeted hypothesis generation and checks"
- Dedicated training separates review from generation -- a reward model trained for generation is NOT the reviewer you should ship

**Aikido's AutoTriage pipeline:**
1. Reachability engine filters unreachable code paths BEFORE any LLM analysis
2. Reasoning models evaluate complex cases by constructing call trees and tracing variable flow
3. Priority scoring adjusts severity based on code context (trusted source = downgrade, auth endpoint = upgrade)
4. AutoFix generates patches for triaged true positives

**Mobb's 4-stage triage workflow:**
1. Automated pre-triage (known-good libraries, low-severity rules, unreachable code)
2. Contextual review (sanitization present? production code? isolated behind controls?)
3. Developer routing (assign to code owner)
4. Security validation (document suppression reasons)

**Claude Code Security approach:**
- Hypothesis-driven: generate theories about what could be vulnerable, then verify
- Cross-reference git history: same pattern unfixed elsewhere?
- Sandboxed environment with standard vuln analysis tools

### What our agent is missing vs best-in-class
1. **Confidence tiers** instead of binary report/don't-report
2. **Hypothesis-driven scanning** ("what could go wrong if X reaches Y?")
3. **Two-phase review** (identify all, then triage) instead of single-pass censored review
4. **Steerable precision/recall tradeoff** based on review context
5. **Reachability as a scoring factor, not a gate** -- unreachable findings get lower severity, not suppression

## 4. Main Bottleneck

**The verification requirement causes self-censoring that reduces true positive detection.**

The v4 adds: "Before claiming any vulnerability, prove it is reachable. Do not report theoretical vulnerabilities in dead code. For HIGH/CRITICAL findings, provide an evidence chain... Without this chain, downgrade to informational."

This creates three compounding problems:

1. **Binary gate instead of confidence spectrum.** The agent must either prove reachability or downgrade to informational. There is no middle ground for "likely reachable but I cannot fully trace the path in this context." OpenAI's reviewer explicitly avoids this by using a cost-benefit framework instead of a proof requirement.

2. **Asymmetric error cost.** A false positive wastes a reviewer's time (minutes). A missed true positive can cause a breach (millions). The v4 treats these costs as symmetric by requiring the same evidence bar for reporting and suppressing. The market consensus (OpenAI, Aikido, Mobb) is that suppression should require MORE justification than reporting.

3. **Context window limitation.** In a GLM agent context, the security reviewer receives a subset of the codebase. It literally cannot trace many cross-file data flows. The v4 instruction to "downgrade to informational" when evidence is incomplete systematically punishes findings that require broader context -- which are disproportionately the most serious findings (race conditions, auth bypass, SSRF chains).

The v1 agent does not have ANY of these constraints. It simply says "Always verify context before flagging" -- a softer instruction that encourages diligence without mandating suppression. This is why v1 scores higher: it reports more aggressively, and the evaluator rewards finding real issues more than it penalizes occasional false positives.

**Secondary bottleneck:** The v4 removed v1's analysis commands (`npm audit`, `bandit`, `gosec`) and review workflow structure (Initial Scan -> OWASP Check -> Code Pattern Review). The v1 has a clear sequential workflow; the v4 has principles without workflow.

## 5. Winning Patterns

### Pattern 1: Confidence tiers replace binary gates
Instead of "proven" vs "downgraded to informational":
- **CONFIRMED**: Full evidence chain (entry point -> call chain -> sink). Report at detected severity.
- **LIKELY**: Partial evidence, pattern strongly suggests vulnerability. Report at detected severity with evidence note.
- **POSSIBLE**: Pattern match, cannot trace full path. Report one severity level below detected, flag for manual verification.

This is what Aikido, Mobb, and AppSecAI all converge on. None of them suppress findings -- they adjust priority.

### Pattern 2: Structured two-phase review
Phase 1 (Detection): Scan broadly, flag everything suspicious. No self-censoring.
Phase 2 (Triage): For each finding, assess reachability, context, severity. Adjust confidence tier.

Cubic's 51% FP reduction came from separating detection and evaluation into distinct steps. When combined in one pass, the evaluation instinct suppresses the detection instinct.

### Pattern 3: Asymmetric evidence requirements
Reporting a finding: pattern match + basic context is sufficient.
Suppressing a finding: must prove it is unreachable, properly sanitized, or otherwise mitigated.

This is the inverse of v4's current approach. OpenAI: "We optimize for signal-to-noise first" but their suppression bar is higher than their reporting bar.

### Pattern 4: Context-adaptive severity
Same finding, different severity based on:
- Endpoint type (public auth endpoint = higher, internal admin = lower)
- Data sensitivity (PII/financial = higher, telemetry = lower)
- Environment (production code = higher, test code = lower)
- Existing mitigations (WAF present = lower, raw input = higher)

Aikido does this explicitly: "An SQL injection report might be safely downgraded if the input originates from a trusted source... A login endpoint with NoSQL injection risk can be upgraded to very high priority."

### Pattern 5: Structured reasoning output
Cubic's biggest single improvement: require the agent to output reasoning BEFORE the finding. JSON with distinct fields for reasoning, finding, and confidence. "Forcing the agent to justify its findings first encouraged more structured thinking, significantly reducing arbitrary or unfounded conclusions."

### Pattern 6: Reachability as scoring factor, not gate
Thornton (2026) found that adversarial comments have minimal effect on detection (p > 0.21) but "static analysis cross-referencing performs best at 96.9% detection and recovers 47% of baseline misses." The lesson: cross-reference with static analysis patterns to boost confidence, but don't gate on full proof.

## 6. Specific Recommendations for v5

### Change 1: Replace verification requirement with confidence tiers
**Remove:**
> Before claiming any vulnerability, prove it is reachable. Do not report theoretical vulnerabilities in dead code.
> For HIGH/CRITICAL findings, provide an evidence chain... Without this chain, downgrade to informational -- unproven findings waste reviewer time and erode trust.

**Replace with:**
> For every finding, assess and report a confidence level:
> - **CONFIRMED**: Full evidence chain (entry point -> data flow -> vulnerable sink). Report at full severity.
> - **LIKELY**: Strong pattern match with partial evidence (e.g., user input reaches function but full chain not traceable). Report at full severity with evidence note.
> - **POSSIBLE**: Pattern match, context suggests risk but cannot verify path. Report one level below detected severity.
>
> Never suppress a finding solely because you cannot trace the full path. Unreachable code is the ONLY valid reason to omit a finding -- and you must prove unreachability, not assume it.

### Change 2: Add two-phase workflow
Add a review workflow section:
> ## Review Workflow
> **Phase 1 -- Detection:** Scan all code for security patterns. Flag everything that matches a known vulnerability pattern. Do not self-censor during this phase.
> **Phase 2 -- Triage:** For each finding from Phase 1, assess: (a) confidence level, (b) context-adjusted severity, (c) existing mitigations. Adjust and report.
>
> Detection and triage are separate cognitive steps. Do not combine them.

### Change 3: Soften false positive list
**Current:** "Common False Positives -- Do NOT Flag Without Proof" (8 patterns, imperative language)

**Replace with:**
> ## Low-Risk Patterns (verify before escalating)
> These patterns are OFTEN false positives but not always. Check context before assigning severity:
> - `.env.example` / `.env.sample` -- usually safe, but verify no real secrets leaked into example files
> - Test credentials in test files -- usually safe, but verify they don't match production credentials
> - Public API keys -- verify they are actually intended to be public (check docs, usage)
> - SHA256/MD5 for checksums -- safe for integrity checks, flag if used for password hashing
> - Base64 strings -- usually data encoding, flag if they decode to credentials
> - `localhost` URLs in dev config -- usually safe, flag if in production config files
> - Placeholder values -- usually safe, flag if deployed to production
> - Constants resembling keys -- check if they are enums/identifiers vs actual secrets
>
> When in doubt, report at POSSIBLE confidence rather than omitting.

### Change 4: Add context-adaptive severity guidance
> ## Severity Adjustment
> Adjust severity based on context:
> - **Upgrade** when: public-facing endpoint, handles auth/payment, processes PII, no existing mitigations visible
> - **Downgrade** when: internal-only endpoint, test/dev environment, existing sanitization/validation present, behind WAF/auth middleware
> - **Never downgrade** CRITICAL patterns (hardcoded production secrets, unparameterized SQL with user input, shell injection) -- these are always critical regardless of context

### Change 5: Restore workflow structure from v1
The v1 had: Initial Scan -> OWASP Top 10 Check -> Code Pattern Review. The v4 lost this structure. Add back a clear sequential workflow that gives the agent a checklist to follow rather than just principles to consider.

### Change 6: Add hypothesis-driven scanning prompt
> ## Hypothesis-Driven Review
> For each entry point (route, handler, API endpoint), ask:
> 1. What user-controlled data enters here?
> 2. Where does it flow? (trace forward through function calls)
> 3. Does it reach a dangerous sink (SQL, shell, HTML render, file system, network request) without sanitization?
> 4. Are there auth/authz checks? Can they be bypassed?
> 5. What happens on error? Does the error path expose data?

### Summary of expected impact

| Change | Expected Effect |
|--------|----------------|
| Confidence tiers | Eliminates self-censoring. Findings that v4 suppresses become LIKELY/POSSIBLE instead of invisible. |
| Two-phase workflow | Separates detection instinct from evaluation instinct. Prevents premature filtering. |
| Softer FP list | Converts hard gates ("do NOT flag") to soft signals ("verify before escalating"). |
| Context-adaptive severity | More accurate severity. Reduces both over-reporting and under-reporting. |
| Restored workflow structure | Gives agent a clear execution path. Prevents skipping review areas. |
| Hypothesis-driven scanning | Encourages forward-tracing from entry points. Catches data flow issues. |

The core bet: these changes will increase true positive detection (fixing the v1 > v4 regression) while maintaining acceptable false positive rates through confidence tiers and context-adaptive severity rather than through suppression.

---

## Sources

- Cubic FP reduction case study: zenml.io/llmops-database/reducing-false-positives-in-ai-code-review-agents
- Thornton (2026), "Can Adversarial Code Comments Fool AI Security Reviewers": arXiv:2602.16741
- OpenAI Codex code reviewer: alignment.openai.com/scaling-code-verification
- Aikido AutoTriage: help.aikido.dev/code-scanning/scanning-practices/sast-autotriage
- Mobb SAST triage workflow: mobb.ai/blog/sast-triage-workflow
- AppSecAI ETA: appsecai.io/blog/introducing-appsecai-expert-triage-automation-eta
- GitLab Agentic SAST: docs.gitlab.com/user/application_security/sast
- IBM/Avatier false positive data: avatier.com/blog/false-positive-reduction-ai
- LLM vulnerability detection survey: arXiv:2502.07049 (Sheng et al., 2025)
- CWEval benchmark: arXiv:2501.08200 (Peng et al., 2025)
- Rapticore LLM Security Benchmark: github.com/rapticore/llm-security-benchmark
