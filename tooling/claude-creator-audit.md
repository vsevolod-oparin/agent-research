# Agent Description Audit Report

Audit of all 12 agent descriptions in `.claude/agents/` scored against the quality rubric.

## Agents Found

| # | Agent | Type | Lines |
|---|-------|------|-------|
| 1 | code-reviewer.md | Review/audit | 123 |
| 2 | java-pro.md | Implementation | 209 |
| 3 | full-stack-developer.md | Implementation | 69 |
| 4 | security-reviewer.md | Review/audit | 111 |
| 5 | research-analyst.md | Research/analysis | 125 |
| 6 | go-build-resolver.md | Implementation | 92 |
| 7 | websocket-engineer.md | Implementation | 8 |
| 8 | documentation-pro.md | Research/analysis | 79 |
| 9 | fastapi-pro.md | Implementation | 172 |
| 10 | incident-responder.md | Review/audit | 101 |
| 11 | dotnet-framework-pro.md | Implementation | 126 |
| 12 | tdd-guide.md | Implementation | 66 |

Type targets: Review/audit 90-120 lines, Implementation 60-90 lines, Research/analysis 30-50 lines.

---

## 1. code-reviewer.md (Review/audit, 123 lines)

**Score: 72/100**

| Criterion | Score | Notes |
|-----------|-------|-------|
| Domain knowledge | 20/25 | Strong specific checklists (Security, React/Next.js, Node.js, Performance). Concrete patterns like "Missing dependency arrays in useEffect" and "N+1 queries". Could add more language-specific patterns. |
| False positive prevention | 16/20 | Excellent: confidence threshold (>80%), skip rules, consolidation rule. Missing explicit false-positive examples. |
| Conciseness | 10/15 | Most lines earn their place. Some redundancy between "Review Output Format" (empty) and "Summary Format". Approval Criteria section is lightweight process. |
| Correct content types | 12/15 | Mostly knowledge content (checklists, patterns). Some process (5-step workflow) but it's brief and useful. |
| Length compliance | 8/10 | 123 lines, target 90-120. Slightly over but dense with knowledge. |
| Identity clarity | 8/10 | Clear: "senior code reviewer ensuring high standards of code quality and security." |
| Currency | 3/5 | Mentions React Server Components (current). No version pins that could go stale. React/Next.js focus may not fit all projects. |

**Anti-patterns found:**
- Rigid output template: "Review Output Format" and "Summary Format" sections (though mostly empty)
- Binary verification gates: "Approval Criteria" section (Approve/Warning/Block)
- Trigger conditions: "When to Run" equivalent missing but "Project-Specific Guidelines" is borderline

**Top improvements:**
1. Remove empty "Review Output Format" / "Summary Format" sections -- they add nothing
2. Add explicit false-positive examples (e.g., "Don't flag `console.log` in CLI tools", "Don't flag missing auth on public health check endpoints")
3. Make framework-specific sections conditional rather than always-present (wastes attention on non-React projects)

---

## 2. java-pro.md (Implementation, 209 lines)

**Score: 18/100**

| Criterion | Score | Notes |
|-----------|-------|-------|
| Domain knowledge | 5/25 | Lists technologies but provides zero actionable guidance. "Virtual Threads: Use Thread.ofVirtual()" is a one-liner the model already knows. No decision tables, no "when to use X vs Y", no gotchas. |
| False positive prevention | 0/20 | No anti-patterns, no "don't do X" rules, no common mistakes to avoid. |
| Conciseness | 1/15 | 209 lines -- massively bloated. The "Capabilities" section (lines 50-161) repeats almost everything from "Core Expertise" (lines 9-48) verbatim. "Behavioral Traits", "Knowledge Base", "Response Approach", "Example Interactions" are all filler. |
| Correct content types | 2/15 | Almost entirely catalog/list content. No knowledge injection -- just topic names. "Response Approach" is process. "Example Interactions" is prompt engineering filler. |
| Length compliance | 0/10 | 209 lines vs. target 60-90. Over 2x the limit. |
| Identity clarity | 5/10 | Identity exists but generic. |
| Currency | 5/5 | Version-pinned: Java 21+, Spring Boot 3.x, Hibernate 6+. |

**Anti-patterns found:**
- Generic knowledge: Entire file is a table of contents of Java topics the model already knows
- Massive duplication: "Core Expertise" and "Capabilities" sections are near-identical
- Step-by-step process: "Response Approach" section
- "Be thorough" adjectives: "comprehensive testing", "clean, maintainable code"
- Trigger conditions: "Example Interactions" section

**Top improvements:**
1. Delete "Capabilities" section entirely (duplicate of "Core Expertise") -- saves ~110 lines
2. Replace topic lists with decision tables: "When to use virtual threads vs platform threads", "G1 vs ZGC selection criteria", "WebFlux vs WebMVC decision matrix"
3. Add Java-specific gotchas/anti-patterns: "Don't use synchronized with virtual threads", "Avoid ThreadLocal in virtual thread code -- use ScopedValue", "Spring Data projections over entity fetching for read queries"

---

## 3. full-stack-developer.md (Implementation, 69 lines)

**Score: 14/100**

| Criterion | Score | Notes |
|-----------|-------|-------|
| Domain knowledge | 1/25 | Zero specific knowledge. Every bullet is a textbook definition ("Proficiency in core technologies like HTML, CSS, and JavaScript is essential"). No actionable heuristics. |
| False positive prevention | 0/20 | None. |
| Conciseness | 3/15 | 69 lines is within range, but content density is near zero. Long prose paragraphs restating obvious things. |
| Correct content types | 1/15 | Entirely generic descriptions and process. "Guiding Principles" is motivational filler. "Expected Output" describes job responsibilities, not knowledge. |
| Length compliance | 7/10 | 69 lines within 60-90 target. |
| Identity clarity | 3/10 | Identity restated 3 times (frontmatter, header, Role line) with identical content. |
| Currency | 0/5 | No version pins, no specific technology versions. Mentions "React/Angular/Vue.js" generically. |

**Anti-patterns found:**
- Generic knowledge: Every single bullet ("Proficiency with version control systems, particularly Git")
- "Be thorough" adjectives: "comprehensive", "fundamental", "crucial", "essential" throughout
- Step-by-step process: "Guiding Principles" section
- Rigid output templates: "Expected Output" section mandates deliverable categories
- Trigger conditions/completion criteria: "Constraints & Assumptions" section

**Top improvements:**
1. Replace prose definitions with specific decision heuristics (e.g., "When choosing between SSR and SPA: use SSR for SEO-critical pages, SPA for dashboard/app UIs", "Use cursor-based pagination for infinite scroll, offset for admin tables")
2. Delete "Core Competencies" section entirely -- it's a job description, not agent knowledge
3. Add concrete stack-specific patterns and gotchas relevant to the project

---

## 4. security-reviewer.md (Review/audit, 111 lines)

**Score: 74/100**

| Criterion | Score | Notes |
|-----------|-------|-------|
| Domain knowledge | 21/25 | Strong: OWASP Top 10 as concrete checklist with specific questions per item. Code Pattern table with severity + fix is excellent. Diagnostic commands are actionable. |
| False positive prevention | 16/20 | Explicit "Common False Positives" section with 4 specific examples. "Always verify context before flagging." Good but could be expanded. |
| Conciseness | 11/15 | Mostly dense. "Key Principles" (5 generic lines) and "Success Metrics" could be cut. |
| Correct content types | 12/15 | Mostly knowledge (checklists, patterns, false positives). Some process (workflow, emergency response) but brief. |
| Length compliance | 8/10 | 111 lines, within 90-120 target. |
| Identity clarity | 8/10 | Clear: "expert security specialist focused on identifying and remediating vulnerabilities." |
| Currency | 3/5 | Mentions bcrypt/argon2, JWT. No version pins to go stale. Could mention modern threats (supply chain, SSRF to cloud metadata). |

**Anti-patterns found:**
- Step-by-step process: "Review Workflow" (3 phases) and "Emergency Response" (5 steps)
- Completion criteria: "Success Metrics" section
- "Be thorough": "Be thorough, be paranoid, be proactive" (closing line)
- Trigger conditions: "When to Run" section

**Top improvements:**
1. Remove "Success Metrics", "When to Run", and "Key Principles" sections -- they're process/filler (~15 lines saved)
2. Expand "Common False Positives" with more examples (test fixtures, example configs, public keys vs private keys)
3. Add modern threat patterns: SSRF to cloud metadata (169.254.169.254), dependency confusion attacks, prototype pollution

---

## 5. research-analyst.md (Research/analysis, 125 lines)

**Score: 12/100**

| Criterion | Score | Notes |
|-----------|-------|-------|
| Domain knowledge | 2/25 | Zero specific checklists, no decision tables, no domain-specific heuristics. Every bullet is a generic noun phrase ("pattern recognition", "logical reasoning") that any LLM already knows. No concrete research techniques (e.g., Boolean search operators, source credibility frameworks like CRAAP, specific analysis methods like SWOT/PESTLE). |
| False positive prevention | 0/20 | No anti-patterns list, no "don't do X" guidance, no verify-before-claiming rules. Nothing to prevent hallucinated sources, citation fabrication, or overconfident claims. |
| Conciseness | 2/15 | 125 lines for a research agent (target: 30-50). Massive padding -- most content is single-word bullet items that add no information ("Gather information", "Analyze data", "Quality focus"). |
| Correct content types | 2/15 | Almost entirely process content (workflow phases, checklists of verbs). No actual knowledge injection -- no source evaluation criteria, no analysis frameworks, no synthesis techniques. |
| Length compliance | 1/10 | 125 lines vs. target 30-50. Over 2x the recommended length while containing less useful content than a well-written 30-line version would. |
| Identity clarity | 3/10 | Identity line exists but is generic boilerplate. "Senior research analyst with expertise in conducting thorough research" says nothing distinctive. |
| Currency | 2/5 | No version-pinned facts to go stale, but also no domain-specific knowledge to be current about. Neutral. |

**Anti-patterns found:**
- "Be thorough" / adjective lists: "Comprehensive", "thorough", "exceptional", "deep" appear repeatedly -- pure filler adjectives
- Step-by-step process/workflow sections: Entire file is structured as phases (Planning -> Implementation -> Excellence) -- this is process the model handles natively
- Rigid output templates: "Excellence checklist" and "Quality control" sections mandate verification gates
- Binary verification gates: "Objectives met", "Analysis comprehensive", "Sources verified" -- yes/no gates that add no actionable guidance
- Generic knowledge the model already has: Every single bullet point ("Critical thinking", "Bias awareness", "Pattern recognition") is generic knowledge any LLM possesses
- Trigger conditions / completion criteria: "Excellence checklist" section functions as completion criteria

**Top improvements:**
1. Replace all generic bullets with specific, actionable research knowledge -- e.g., source credibility evaluation criteria (primary vs. secondary, recency thresholds, authority signals), specific analysis frameworks (comparative analysis templates, contradiction resolution), concrete search strategies (query expansion techniques, database-specific syntax). This alone would raise Domain Knowledge from 2 to 15+.
2. Add false-positive prevention rules -- e.g., "Never present a URL you haven't fetched as a verified source", "When synthesizing conflicting sources, explicitly state the conflict rather than silently choosing one", "Distinguish between 'evidence suggests' and 'evidence confirms' -- default to the weaker claim".
3. Cut to 30-40 lines -- Delete all six bulleted lists of generic nouns. Keep only content that a research-focused agent needs that differs from default model behavior.

---

## 6. go-build-resolver.md (Implementation, 92 lines)

**Score: 68/100**

| Criterion | Score | Notes |
|-----------|-------|-------|
| Domain knowledge | 19/25 | Strong: 10-row error->cause->fix table is excellent domain knowledge. Module troubleshooting commands are specific and useful. Missing some common errors (e.g., `go:build` constraints, CGO issues, generics type inference). |
| False positive prevention | 12/20 | "Stop Conditions" prevent infinite loops. "Never add //nolint without approval" and "Never change function signatures unless necessary" are good guardrails. Could add more. |
| Conciseness | 12/15 | 92 lines, mostly dense. Output format template is a bit rigid but brief. |
| Correct content types | 11/15 | Mostly knowledge (error table, commands, principles). Workflow section is process but brief and useful for this diagnostic agent. |
| Length compliance | 7/10 | 92 lines vs 60-90 target. Slightly over. |
| Identity clarity | 9/10 | Clear and specific: "expert Go build error resolution specialist... minimal, surgical changes." |
| Currency | 3/5 | Go-version-agnostic. Could mention Go 1.22+ features (range-over-func, loop variable semantics change). |

**Anti-patterns found:**
- Rigid output template: Fixed output format at the end
- Step-by-step process: "Resolution Workflow" (6 steps) -- though appropriate for this diagnostic agent

**Top improvements:**
1. Expand the error->fix table with more entries (CGO errors, generics issues, `go:build` constraints, workspace mode problems)
2. Drop the rigid output format -- let the model report naturally
3. Add version-specific gotchas (Go 1.22 loop variable change, Go 1.21 `min`/`max` builtins)

---

## 7. websocket-engineer.md (Implementation, 8 lines body)

**Score: 8/100**

| Criterion | Score | Notes |
|-----------|-------|-------|
| Domain knowledge | 0/25 | Identity line only. Zero knowledge content -- no protocols, no patterns, no libraries, no gotchas. |
| False positive prevention | 0/20 | None. |
| Conciseness | 5/15 | Technically concise, but because it's empty, not because it's well-edited. |
| Correct content types | 0/15 | No content of any type. |
| Length compliance | 0/10 | 8 lines vs. target 60-90. Effectively an empty stub. |
| Identity clarity | 3/10 | Identity exists but is the only content. |
| Currency | 0/5 | Nothing to evaluate. |

**Anti-patterns found:**
- None (there's nothing to contain anti-patterns)

**Top improvements:**
1. Actually write the agent -- this is a stub. Add WebSocket-specific knowledge: connection lifecycle, heartbeat/ping-pong, reconnection strategies, scaling with Redis pub/sub, Socket.IO vs native WS tradeoffs
2. Add common failure patterns: message ordering, backpressure handling, connection leak detection
3. Add security knowledge: origin validation, authentication during handshake, rate limiting per connection

---

## 8. documentation-pro.md (Research/analysis, 79 lines)

**Score: 20/100**

| Criterion | Score | Notes |
|-----------|-------|-------|
| Domain knowledge | 4/25 | Lists documentation categories but provides no actual writing heuristics. "Write step-by-step tutorials for common user scenarios" is a task description, not knowledge. No readability guidelines, no structure templates, no audience-adaptation rules. |
| False positive prevention | 0/20 | None. |
| Conciseness | 4/15 | 79 lines, but most are generic task lists. Every section is "verb + generic noun" bullets. |
| Correct content types | 3/15 | Entirely catalog content -- lists of what documentation types exist. No knowledge about *how* to write well. |
| Length compliance | 3/10 | 79 lines vs. target 30-50. ~60% over. |
| Identity clarity | 6/10 | Decent: "professional software documentation expert specializing in creating clear, comprehensive, and accessible documentation." |
| Currency | 0/5 | Mentions MkDocs, Docusaurus, Sphinx but no versions. No currency-sensitive content. |

**Anti-patterns found:**
- Generic knowledge: Every bullet is a task the model already knows how to do
- "Be thorough" adjectives: "comprehensive", "clear", "accessible" throughout
- Catalog format: 7 sections x 7-8 bullets each, all generic

**Top improvements:**
1. Replace category lists with actual writing heuristics: "Lead with the user's goal, not the feature name", "Code examples before prose explanation", "One concept per page", "Use 2nd person ('you') not 3rd person ('the user')"
2. Add anti-patterns: "Don't document internal implementation details in user-facing docs", "Don't use jargon without defining it", "Don't write 'simply' or 'just' -- it invalidates reader difficulty"
3. Cut to 30-40 lines of dense writing craft knowledge

---

## 9. fastapi-pro.md (Implementation, 172 lines)

**Score: 19/100**

| Criterion | Score | Notes |
|-----------|-------|-------|
| Domain knowledge | 5/25 | Lists FastAPI ecosystem topics but provides no actionable guidance. "Async/await patterns for high-concurrency applications" is not knowledge -- it's a topic label. No code patterns, no decision criteria, no gotchas. |
| False positive prevention | 0/20 | None. |
| Conciseness | 2/15 | 172 lines of topic lists. "Behavioral Traits", "Knowledge Base", "Response Approach", "Example Interactions" are all filler sections. |
| Correct content types | 2/15 | Entirely catalog content. No knowledge injection. "Response Approach" is process. |
| Length compliance | 0/10 | 172 lines vs. target 60-90. Nearly 2x over. |
| Identity clarity | 5/10 | Identity exists but stated twice (line 7 and "Purpose" section). |
| Currency | 5/5 | Version-pinned: FastAPI 0.100+, Pydantic V2, SQLAlchemy 2.0+. |

**Anti-patterns found:**
- Generic knowledge: 10 sections of topic lists the model already knows
- Step-by-step process: "Response Approach" section
- Trigger conditions: "Example Interactions" section
- Duplicate identity: Purpose restates frontmatter description

**Top improvements:**
1. Replace topic lists with FastAPI-specific patterns: "Use `Annotated[Dependency]` over `Depends()` in function signatures (FastAPI 0.100+)", "Use `lifespan` context manager over `on_startup`/`on_shutdown`", "Pydantic V2: use `model_validator(mode='before')` not `@validator`"
2. Add common FastAPI gotchas: "Don't use sync ORM calls in async endpoints -- blocks the event loop", "Use `httpx.AsyncClient` not `requests` in async code", "Background tasks share the request scope -- don't close DB sessions before they complete"
3. Cut to 60-70 lines of dense, actionable patterns

---

## 10. incident-responder.md (Review/audit, 101 lines)

**Score: 52/100**

| Criterion | Score | Notes |
|-----------|-------|-------|
| Domain knowledge | 14/25 | Severity levels (P0-P3) with response times are concrete. IMAG roles (OL, CL) are specific. Quick fix options (rollback, scale, feature flag, failover) are actionable. But overall reads more like a process playbook than domain knowledge. |
| False positive prevention | 5/20 | "Provide ETAs Cautiously" is one guardrail. Missing: "Don't blame individuals in comms", "Don't deploy fixes without monitoring", "Don't close incident before impact is confirmed resolved." |
| Conciseness | 8/15 | 101 lines. Reasonable density but some sections are textbook procedure rather than unique guidance. |
| Correct content types | 5/15 | Heavily process-oriented by nature (this agent IS about process). But even for an incident responder, there should be more knowledge: common root cause patterns, diagnostic shortcuts, communication templates. |
| Length compliance | 8/10 | 101 lines vs. target 90-120. Within range. |
| Identity clarity | 8/10 | Clear: "Battle-tested Incident Commander." |
| Currency | 4/5 | References Google SRE model, modern tooling (Slack/Teams). No version-pinned content to go stale. |

**Anti-patterns found:**
- Step-by-step process: The entire file is a workflow (inherent to incident response, but could inject more knowledge)
- Rigid output templates: Postmortem content structure is mandated
- Completion criteria: "Declare Incident Resolved" section

**Top improvements:**
1. Add common root cause patterns: "If errors spike after deploy -> likely the deploy. If gradual degradation -> likely resource exhaustion. If sudden with no deploy -> likely external dependency or infrastructure."
2. Add communication anti-patterns: "Don't say 'we think' in external comms -- say 'we're investigating'. Don't promise timelines. Don't speculate about cause publicly."
3. Add diagnostic shortcuts: specific commands/queries for common platforms (Kubernetes pod logs, AWS CloudWatch, database connection pool metrics)

---

## 11. dotnet-framework-pro.md (Implementation, 126 lines)

**Score: 11/100**

| Criterion | Score | Notes |
|-----------|-------|-------|
| Domain knowledge | 1/25 | Zero specific .NET Framework knowledge. No mention of specific APIs, patterns, version-specific behaviors, migration gotchas, or common issues. Every bullet is a generic adjective ("Architecture stable", "Security hardened"). |
| False positive prevention | 0/20 | None. |
| Conciseness | 1/15 | 126 lines of single-word/phrase bullets. Content could be reduced to ~5 meaningful lines without losing information. |
| Correct content types | 1/15 | Entirely process phases and adjective checklists. No knowledge content whatsoever. |
| Length compliance | 0/10 | 126 lines vs. target 60-90. Over limit with zero density. |
| Identity clarity | 5/10 | Identity exists, mentions .NET Framework 4.8 specifically. |
| Currency | 3/5 | .NET Framework 4.8 is version-pinned and correct (it's the final version). No stale facts. |

**Anti-patterns found:**
- Generic knowledge: Every bullet ("SOLID principles", "Error handling", "Logging implemented")
- "Be thorough" adjectives: "Comprehensive", "reliable", "robust" throughout
- Step-by-step process: 3-phase workflow structure
- Binary verification gates: Multiple "excellence checklists" with yes/no items
- Massive duplication: 6 separate checklists all containing overlapping items ("Security hardened" appears in multiple lists)

**Top improvements:**
1. Add actual .NET Framework 4.8 knowledge: "Web Forms ViewState encryption must use MachineKey -- don't rely on auto-generated keys in web farms", "WCF BasicHttpBinding is unencrypted by default -- always use wsHttpBinding or configure transport security", "Entity Framework 6 lazy loading can cause N+1 -- use `.Include()` or projection queries"
2. Add modernization decision criteria: "When to migrate to .NET 8 vs maintain on 4.8", "Strangler fig pattern for gradual WCF->gRPC migration", "Shared libraries that must target .NET Standard 2.0 for cross-compatibility"
3. Delete all 6 adjective checklists -- they provide zero value

---

## 12. tdd-guide.md (Implementation, 66 lines)

**Score: 58/100**

| Criterion | Score | Notes |
|-----------|-------|-------|
| Domain knowledge | 15/25 | Edge case list (8 items) is specific and useful. Test anti-patterns (4 items) inject real knowledge. Test type table with "when" column is actionable. Missing: testing patterns for specific frameworks, mocking strategies, test naming conventions. |
| False positive prevention | 10/20 | Anti-patterns section prevents common testing mistakes. "Testing implementation details instead of behavior" is a key guardrail. Could add more. |
| Conciseness | 12/15 | 66 lines, dense. Every section carries weight. Minor: coverage command is npm-specific (may not fit all projects). |
| Correct content types | 10/15 | Good mix of knowledge (edge cases, anti-patterns) and lightweight process (Red-Green-Refactor). Process is appropriate here since TDD IS a methodology. |
| Length compliance | 9/10 | 66 lines within 60-90 target. |
| Identity clarity | 7/10 | Clear: "TDD specialist who ensures all code is developed test-first." |
| Currency | 0/5 | npm-specific commands. No mention of modern testing tools (Vitest, Bun test). Mentions Playwright which is current. |

**Anti-patterns found:**
- Step-by-step process: Red-Green-Refactor workflow (inherent to TDD and brief)
- Generic knowledge: Coverage threshold (80%) is arbitrary without project context

**Top improvements:**
1. Add framework-agnostic test commands or make language-adaptive (not just npm)
2. Expand anti-patterns with more entries: "Don't test private methods directly", "Don't use `sleep` in tests -- use polling/waitFor", "Don't assert on error messages -- assert on error types"
3. Add testing decision heuristics: "Mock external services, don't mock your own code", "Integration test the happy path, unit test the edge cases", "If a test is hard to write, the code design is wrong"

---

## Summary

| Rank | Agent | Type | Lines | Score | Priority |
|------|-------|------|-------|-------|----------|
| 1 | websocket-engineer | Implementation | 8 | **8** | Fix first |
| 2 | dotnet-framework-pro | Implementation | 126 | **11** | Fix 2nd |
| 3 | research-analyst | Research | 125 | **12** | Fix 3rd |
| 4 | full-stack-developer | Implementation | 69 | **14** | Fix 4th |
| 5 | java-pro | Implementation | 209 | **18** | Fix 5th |
| 6 | fastapi-pro | Implementation | 172 | **19** | Fix 6th |
| 7 | documentation-pro | Research | 79 | **20** | Fix 7th |
| 8 | incident-responder | Review/audit | 101 | **52** | Fix 8th |
| 9 | tdd-guide | Implementation | 66 | **58** | Fix 9th |
| 10 | go-build-resolver | Implementation | 92 | **68** | Fix 10th |
| 11 | code-reviewer | Review/audit | 123 | **72** | Fix 11th |
| 12 | security-reviewer | Review/audit | 111 | **74** | Fix 12th |

### Key Findings

- **7 of 12 agents score below 20/100** -- they're effectively empty of useful knowledge, filled with generic topic lists and adjective bullets
- **The 3 review/audit agents (code-reviewer, security-reviewer, go-build-resolver) are the strongest** -- they contain specific checklists, decision tables, and false-positive prevention
- **The pattern is clear**: agents with concrete error->fix tables, specific checklists, and false-positive rules score well. Agents with generic topic catalogs and workflow phases score poorly
- **websocket-engineer is a stub** -- needs to be written from scratch
- **dotnet-framework-pro, research-analyst, full-stack-developer, java-pro, fastapi-pro** all share the same structural problem: long lists of generic nouns where specific knowledge should be

### Recommended Improvement Order

Fix worst-scoring first (websocket-engineer -> dotnet-framework-pro -> research-analyst -> ...), one at a time. Each rewrite should follow the pattern established by the top scorers: specific checklists, decision tables, anti-patterns, and false-positive prevention.
