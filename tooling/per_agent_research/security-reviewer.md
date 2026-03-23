# Security Reviewer Agent -- Research Report

**Current version:** v4 | **Score:** 4.74 | **v1 score:** 4.87 | **Regression:** -0.13
Security-reviewer is one of two agents where v1 still beats v4. Understanding why is critical.

---

## 1. Competitive Landscape

**AI-powered security review tools:**
- **Claude Code Security (Anthropic)** -- reasoning-based vulnerability scanning. Found 500+ high-severity vulns in production OSS that survived decades of expert review and fuzzing. Uses hypothesis generation + verification, not rule matching
- **Snyk Code (DeepCode AI)** -- real-time IDE scanning, AI-powered fix suggestions. Black-box AI model, no custom rules. Gartner Magic Quadrant Leader 2025.
- **Semgrep** -- fast rule-driven SAST with AI-assisted rule generation. Community rules. Noise reduction up to 98% on paid plans
- **GitHub Advanced Security (CodeQL)** -- powerful semantic query language. Copilot Autofix for patches. Steep learning curve for custom rules
- **Checkmarx One** -- enterprise SAST/DAST/SCA. AI Query Builder claims 90% false positive reduction. Exploitability scoring (0-100)
- **Veracode** -- industry-leading <1.1% false-positive rate. Reachability analysis. Up to 5 auto-fix patches per flaw
- **Fortify Aviator** -- LLM + 20 years SAST history. Prediction model classifies true vs false positives
- **Arnica (AI SAST)** -- multi-agent reasoning engine. Detects logic flaws and access control issues. Scans every push, not just PRs
- **ZeroPath** -- AI-native vuln detection with auto-patching. Natural language prompts for custom checks
- **Corgea** -- LLM-based SAST with contextual awareness for logic-level issues

**Key distinctions:**
- "AI-powered SAST" = traditional rules + AI for triage/fix suggestions (Semgrep, Fortify, Checkmarx)
- "AI SAST" = AI IS the detection engine (Corgea, ZeroPath, Arnica) -- can find logic flaws, not just pattern matches
- "Reasoning-based" = hypothesis generation + verification (Claude Code Security) -- finds zero-days through code reasoning

**Breakthrough results:**
- Claude Code Security: 500+ zero-days in production OSS including buffer overflows, race conditions, compression edge cases
- AISLE: found 12/12 OpenSSL zero-days in Jan 2026 security patch
- Sean Heelan (o3): found CVE-2025-37899 in Linux kernel SMB -- 12K lines, race condition across threads
- Cecuro: specialized AI agent detected 92% of exploited DeFi contracts vs 34% for baseline GPT-5.1 coding agent

## 2. Known Failure Modes / Chokepoints

- **False positives** -- traditional SAST tools generate overwhelming noise. Checkmarx Tolly report: 36.3% false positives. This is the #1 adoption killer
- **Missing reachability analysis** -- flagging vulns in dead code or unreachable paths wastes reviewer time
- **Context-dependent blindness** -- failing to adjust focus based on app type (web app vs API vs CLI vs library)
- **Theoretical vulns without proof** -- reporting possible issues without evidence chain (entry point -> call chain -> vulnerable sink)
- **Common false positive patterns** -- .env.example values, test credentials, public API keys, checksums flagged as secrets, base64 data
- **Business logic flaws** -- traditional SAST misses these entirely. Only reasoning-based or domain-specialized AI catches them
- **AI-generated code patterns** -- LLMs produce different vuln patterns than humans. Traditional SAST catches 55% fewer LLM-specific vulns
- **Cross-file vulnerability chains** -- vuln requires tracing data flow across multiple files, most tools analyze single files
- **Severity miscalibration** -- marking everything HIGH/CRITICAL erodes trust as fast as false positives do

## 3. What Would Make This Agent Best-in-Class

- **Evidence chains for HIGH/CRITICAL** -- entry point -> call chain -> vulnerable sink (our v4 has this)
- **Reachability proof** -- prove the vuln is reachable before reporting
- **False positive prevention list** -- explicit patterns to NOT flag (our v4 has 8 patterns)
- **Context-dependent focus table** -- different priorities for web app vs API vs CLI vs library vs microservice (our v4 has this)
- **Severity calibration** -- pattern-to-severity mapping table (our v4 has this)
- **Verification requirement** -- "prove it is reachable, do not report theoretical vulns in dead code" (our v4 has this)
- **OWASP Top 10 systematic check** -- structured walkthrough (our v4 has this)
- **Dual-use awareness** -- understanding that findings must be actionable for defenders, not attackable recipes

## 4. Main Bottleneck -- Why v1 Beats v4

**Hypothesis: v4 over-constrains the agent, causing it to under-report real issues.**

The v4 additions that could cause regression:
- **Verification Requirement** ("prove it is reachable... without this chain, downgrade to informational") -- this is the right principle but may cause the agent to self-censor legitimate findings it cannot fully trace in the time/context available
- **False Positive Checks** -- 8 explicit "do NOT flag without proof" patterns may be too aggressive, causing the agent to skip real issues that resemble the false positive patterns
- **Evidence chain requirement for HIGH/CRITICAL** -- may cause severity downgrading of real issues when the agent cannot fully trace the call chain

The v1 likely had a simpler, more direct approach: find security issues and report them. The v4 adds many guardrails that reduce false positives but may also reduce true positives.

**The core tension:** false positive reduction vs true positive retention. The market data shows this is THE fundamental tradeoff in security scanning. Veracode's <1.1% FP rate is industry-leading precisely because it's so hard to achieve. Our v4 may have over-optimized for FP reduction.

**Secondary bottleneck:** The agent's scope. Our security-reviewer is a code-level reviewer. The market has moved toward:
- Multi-phase review (SAST -> DAST -> IAST -> SCA)
- Reasoning-based detection (hypothesis generation + verification)
- Cross-file data flow analysis
Our agent does single-pass code review, which limits what it can find.

## 5. What Winning Setups Look Like

**Claude Code Security approach:**
- Hypothesis-driven: generate theories about what could be vulnerable, then verify
- Cross-reference git history: if a fix was applied in one location, check if the same pattern exists unfixed elsewhere
- Sandboxed environment with standard vuln analysis tools
- Internal + external security review before disclosure

**Cecuro (DeFi) approach -- 92% vs 34% detection:**
- Domain-specific security methodology layered on top of the same base model
- Structured review phases (not single-pass)
- Domain-focused heuristics
- Same model, completely different results -- the application layer is everything

**Veracode approach (<1.1% false positive):**
- Reachability analysis: traces tainted data to sinks
- ML model + RAG for generating secure patches
- Up to 5 alternative patches per flaw

**Key patterns across winners:**
- Domain specialization dramatically outperforms generic review (Cecuro: 92% vs 34%)
- Structured multi-phase review beats single-pass
- Reachability/exploitability analysis is non-negotiable for credibility
- False positive rate must be managed but not at the cost of missing real issues
- Evidence chains build trust -- show your work

**Recommendations for improving v4 -> v5:**
- **Soften the self-censoring language** -- change "downgrade to informational" to "note limited evidence, still report at appropriate severity"
- **Add structured review phases** -- Phase 1: identify all potential issues. Phase 2: verify/triage. Phase 3: report with evidence levels
- **Add hypothesis-driven scanning** -- "what could go wrong if X input reaches Y function?" approach inspired by Claude Code Security
- **Restore v1's directness** -- compare v1 and v4 prompts side by side. v1 likely reports more aggressively. Find the balance point
- **Consider a confidence tier** -- CONFIRMED (full evidence chain), LIKELY (partial evidence), POSSIBLE (pattern match, needs verification) rather than binary report/don't-report
