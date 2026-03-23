# Code Reviewer Agent -- Research Report

**Current version:** v4 | **Score:** 4.74 (best across all conditions) | **Key fix from v3:** Restored domain checklists (React, Node.js, Performance)

---

## 1. Competitive Landscape

**Commercial tools (PR-level AI review):**
- **CodeRabbit** -- market leader by install count (2M+ repos, 13M PRs). Runs 40+ linters/SAST tools alongside LLM analysis. Main complaint: verbosity/noise
- **GitHub Copilot Code Review** -- lowest friction for GitHub-native teams. Shallow depth, diff-only, no static analysis integration
- **Qodo (formerly CodiumAI)** -- multi-agent platform combining review + test generation. Cross-repo awareness for enterprise
- **Graphite Agent** -- integrated into stacked PR workflow. Speed-optimized, not deep
- **Bito AI** -- claims full codebase context understanding, enterprise reporting
- **Greptile** -- builds knowledge graph of entire repo for context-aware review
- **BugBot (Cursor)** -- focused exclusively on logic bugs and security vulns, low false-positive rate

**Key market trends (2026):**
- Signal-to-noise ratio is the #1 differentiator -- false positives remain the top complaint across ALL tools
- Tools moving from diff-only to full-codebase context awareness
- "System-aware" reviewers (cross-repo, dependency-aware) emerging as new category
- Automated fix loops (review -> fix -> re-review) becoming table stakes
- AI code review is now considered mandatory due to AI-generated code being reverted 39% more often (GitClear 2025)
- Three-layer approach gaining consensus: linters -> static analysis -> AI review

**Approaches:**
- Rule-based + AI triage (CodeRabbit, SonarQube)
- Pure LLM review (Copilot, Graphite)
- Hybrid multi-agent (Qodo, Capy)
- Context-engine / system-aware (Greptile, Qodo Enterprise)

## 2. Known Failure Modes / Chokepoints

- **False positives** -- #1 killer of adoption. Teams disable tools that cry wolf. CodeRabbit's biggest complaint on G2/Reddit is verbosity
- **Context window limits** -- reviewing large PRs (2000+ lines) produces generic/useless feedback. Smaller PRs dramatically improve AI review quality
- **Missing codebase context** -- diff-only review misses validation done elsewhere, auth middleware, error handling in callers
- **Hallucinated issues** -- claiming something is missing when it exists elsewhere in the codebase
- **Review fatigue** -- too many low-value comments cause developers to ignore all comments
- **Stale closures / framework-specific patterns** -- generic reviewers miss React hooks deps, Next.js server/client boundaries, etc.
- **"Works in isolation" blindness** -- code correct in diff but breaks contracts/downstream dependencies
- **Over-reporting on unchanged code** -- flagging pre-existing issues in code the PR didn't touch

## 3. What Would Make This Agent Best-in-Class

- **Verification-first approach** -- grep/search before claiming something is missing (our v4 already does this well)
- **Calibrated confidence** -- only report >80% confidence findings (our v4 has this)
- **Domain checklists** -- React/Next.js, Node.js/Backend, Performance patterns (restored in v4, the key differentiator vs v3)
- **False positive prevention checklist** -- explicit "before flagging X, check Y" rules (our v4 has 7 of these)
- **Consolidation of similar issues** -- "5 functions missing error handling" not 5 separate findings
- **Severity-tiered output** -- CRITICAL/HIGH/MEDIUM/LOW with clear approval criteria
- **Contextual focus** -- understanding what type of app is being reviewed and adjusting focus
- **Actionable suggestions** -- not just "this is bad" but "here's how to fix it"
- **Framework-aware patterns** -- deep knowledge of React hooks, Next.js SSR/CSR boundary, etc.

## 4. Main Bottleneck

**Prompt design is the primary bottleneck, not model capability.**

Evidence:
- v3 -> v4 score jump (4.27 -> 4.74) came from restoring domain checklists, not from model changes
- The market data confirms: domain-specific rules/checklists are what separate useful from noisy reviews
- The false positive prevention section is critical -- without it, the model hallucinates issues
- The verification-before-claiming pattern (grep before flagging) is the single most impactful instruction

Secondary bottleneck: **tool access**. The agent needs Grep/Glob to verify claims. Without search tools, it would produce significantly more false positives.

## 5. What Winning Setups Look Like

- **CodeRabbit's approach:** 40+ linters + LLM layer + interactive chat + configurable rules per path
- **Graphite's insight:** smaller PRs -> dramatically better AI review quality
- **Qodo's differentiator:** cross-repo awareness, system-level review, not just diff
- **BugBot's strategy:** surgical focus on logic bugs + security only, ignore style entirely -> low false positives

**Common patterns in top performers:**
- Three-tier: deterministic linting -> static analysis -> contextual AI review
- AI review is advisory, not blocking (probabilistic tools should not block PRs)
- Configurable focus areas per file path / project area
- Learning from developer dismiss/accept patterns over time
- Measure "automated issue resolution rate" -- what % of AI comments get addressed vs dismissed

**What our v4 does right:**
- Verification-before-claiming pattern
- Domain-specific checklists (React, Node.js, Performance)
- Confidence-based filtering (>80%)
- False positive prevention rules
- Clear severity tiers with approval criteria

**Potential improvements to explore:**
- Add configurable focus areas (web app vs API vs CLI vs library)
- Add consolidation guidance (group similar findings)
- Consider adding "system-level" awareness instructions for multi-service contexts
- The market is moving toward automated fix suggestions -- our agent could provide more concrete fix code
