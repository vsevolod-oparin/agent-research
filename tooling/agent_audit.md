# Agent Quality Audit — 110 Agents in .claude/agents/

Evaluated against 7 criteria from `agent_anatomy.md`:
1. Concrete workflow (numbered steps, not virtue lists)
2. Decision criteria (thresholds, confidence levels)
3. Domain checklist (specific patterns to look for)
4. Output format (structured report template)
5. Anti-patterns / false positives to avoid
6. Trigger conditions (when to use)
7. Completion criteria (when the job is done)

---

## Full Rankings

| # | Agent | Mark | Why |
|---|-------|------|-----|
| 1 | code-reviewer | 9 | Confidence filtering (>80%), severity checklist, approval matrix, false positives list |
| 2 | security-reviewer | 9 | OWASP checklist, pattern-severity table, emergency protocol, false positives |
| 3 | go-build-resolver | 9 | Ordered diagnostic commands, fix patterns table, stop conditions, output template |
| 4 | incident-responder | 9 | First-5-min protocol, severity levels P0-P3, communication cadence, fix verification |
| 5 | tdd-guide | 9 | Red-Green-Refactor cycle, edge case checklist, coverage targets, anti-patterns |
| 6 | test-automator | 9 | AAA pattern workflow, test pyramid, Definition of Done, environment management |
| 7 | qa-pro | 9 | Numbered workflow, quality gates, Definition of Done, test types checklist |
| 8 | tutorial-engineer | 9 | 3-phase process, 5 exercise categories, output format, writing principles |
| 9 | vector-database-engineer | 9 | 8-step workflow, DB selection criteria, embedding best practices |
| 10 | kubernetes-architect | 9 | 8-step response approach, decision frameworks per area |
| 11 | legacy-modernizer | 9 | Phased workflow, guardrails, deliverables, rollback plans |
| 12 | mobile-security-coder | 9 | Security decision tables, specific testing approach per vulnerability |
| 13 | network-engineer | 9 | 9-step systematic approach, testing methodology, disaster recovery |
| 14 | observability-engineer | 9 | 8-step response approach, example interactions, behavioral traits |
| 15 | posix-shell-pro | 9 | POSIX constraints, compatibility matrices, embedded systems guidance |
| 16 | bash-pro | 9 | Extensive workflow, specific patterns, anti-patterns, completeness criteria |
| 17 | threat-modeling-pro | 8 | 8-step workflow, STRIDE breakdown, attack trees, risk scoring |
| 18 | database-reviewer | 8 | Numbered workflow, checklist, anti-patterns, diagnostics |
| 19 | debugger | 8 | Protocol detailed, output requirements, root cause format, verification plan |
| 20 | build-error-resolver | 8 | Diagnostic commands, priority levels, DO/DON'T anti-patterns, success metrics |
| 21 | deployment-engineer | 8 | Deliverables, guiding principles, workflow phases, runbook requirements |
| 22 | design-system-architect | 8 | Behavioral traits, knowledge base, numbered response approach, examples |
| 23 | agent-organizer | 8 | Clear process, decision framework, output format |
| 24 | devops-incident-responder | 8 | Severity matrix, log analysis workflows, P0-P3 thresholds |
| 25 | e2e-runner | 8 | Plan-Create-Execute-Quarantine workflow, flaky test handling, 95% pass target |
| 26 | frontend-security-coder | 8 | textContent over innerHTML rules, decision framework, domain checklist |
| 27 | go-reviewer | 8 | Priority levels, diagnostic commands, approval matrix, issue checklist |
| 28 | refactor-cleaner | 8 | 4-phase workflow, detection tools, safety checklist, commit batching |
| 29 | sql-pro | 8 | 8-step approach, index/optimization strategy, performance metrics |
| 30 | technical-writer | 8 | Numbered sections, README checklist, API doc strategy table |
| 31 | terraform-pro | 8 | 9-step response approach, state management specifics, example tasks |
| 32 | typescript-pro | 8 | 6-point philosophy, 4-step interaction model, output specification |
| 33 | ui-designer | 8 | 5 design principles, output deliverables, constraints defined |
| 34 | ux-designer | 8 | 6 guiding principles, WCAG accessibility, usability testing methods |
| 35 | kotlin-pro | 8 | Architecture decision tables, Compose patterns, testing strategies |
| 36 | llm-architect | 8 | Decision frameworks, metrics, optimization strategies, selection criteria |
| 37 | microservices-architect | 8 | Pattern decision tables, pitfalls, anti-patterns |
| 38 | mlops-engineer | 8 | Cloud-specific stacks, behavioral traits, capability matrices |
| 39 | monorepo-architect | 8 | Tool selection decision matrix, pitfalls, cache/task orchestration |
| 40 | penetration-tester | 8 | OWASP checklist with tools, decision tables, pitfalls per category |
| 41 | performance-engineer | 8 | 5-step systematic approach, focus areas, deliverables |
| 42 | postgres-pro | 8 | Schema/index decision frameworks, pitfalls, feature selection guides |
| 43 | prompt-engineer | 8 | 5-step optimization process, model-specific expertise, deliverables |
| 44 | python-pro | 8 | SOP with steps, SOLID principles, testing targets, performance profiling |
| 45 | python-reviewer | 8 | Severity criteria, diagnostic commands, approval rubric |
| 46 | database-architect | 8 | Behavioral traits, numbered response approach, workflow defined |
| 47 | cloud-architect | 7 | Decision frameworks, common pitfalls, missing numbered workflow |
| 48 | dependency-manager | 7 | Tools mapped, severity response, automated strategies, pitfalls |
| 49 | backend-security-coder | 7 | Comprehensive capabilities, response approach, missing thresholds |
| 50 | data-engineer | 7 | Methodology defined, focus areas, missing decision thresholds |
| 51 | docs-architect | 7 | Template structure, codebase analysis, information hierarchy |
| 52 | electron-pro | 7 | 5 numbered phases, security focus, IPC patterns |
| 53 | event-sourcing-architect | 7 | CQRS decision criteria, versioning pitfalls, saga decision tree |
| 54 | frontend-developer | 7 | 8-section output format, constraints, accessibility checklist |
| 55 | graphql-architect | 7 | 5-step methodology, DataLoader patterns, schema-first approach |
| 56 | javascript-pro | 7 | Async pattern decision framework, common pitfalls, event loop depth |
| 57 | ml-engineer | 7 | SOP with steps, deliverables, guiding principles |
| 58 | nextjs-pro | 7 | SOP with steps, best practices, missing thresholds |
| 59 | php-pro | 7 | Core expertise, patterns, performance optimization |
| 60 | platform-engineer | 7 | Workflow phases, metrics, excellence checklist |
| 61 | react-pro | 7 | Step-by-step SOP, component methodology, testing guidance |
| 62 | rust-pro | 7 | Response approach steps, example interactions |
| 63 | scala-pro | 7 | Functional programming focus, distributed computing, testing |
| 64 | web-searcher | 7 | 3-step workflow, CLI options table, report template, blocked domains |
| 65 | devops-troubleshooter | 7 | Diagnostic methodology, tool-specific workflows |
| 66 | backend-architect | 6 | Mandated output structure, guiding principles, missing decision criteria |
| 67 | ai-engineer | 6 | Approach outlined, constraints stated, missing workflow steps |
| 68 | api-documenter | 6 | Output format detailed, expertise clear, missing triggers |
| 69 | data-scientist | 6 | Competencies detailed, clarification approach, missing workflow numbers |
| 70 | database-optimizer | 6 | Output format, guiding principles, missing workflow and checklist |
| 71 | devops-engineer | 6 | Workflow phases, excellence checklist, missing thresholds |
| 72 | doc-updater | 6 | Workflow steps, codemap format, validation, generic principles |
| 73 | dx-optimizer | 6 | Profile-Gather-Propose-Implement-Measure flow, success metrics |
| 74 | golang-pro | 6 | Core philosophy, competencies, interaction model, missing checklists |
| 75 | hybrid-cloud-architect | 6 | 8-step response approach, missing decision thresholds |
| 76 | mobile-developer | 6 | Strategic approach, deliverables, missing concrete steps |
| 77 | planner | 6 | Planning process, format template, red flags, missing decision criteria |
| 78 | rails-pro | 6 | Decision tables, anti-patterns, no explicit workflow |
| 79 | spring-boot-pro | 6 | Decision frameworks (WebFlux, R2DBC), pitfalls, no numbered steps |
| 80 | swift-pro | 6 | Decision tables, async/await guidance, Core Data patterns |
| 81 | vue-pro | 6 | Decision tables, Composition API practices, performance table |
| 82 | architect | 5 | Principles detailed, ADR template, missing workflow and thresholds |
| 83 | api-designer | 5 | Workflow phases described, missing decision criteria and anti-patterns |
| 84 | cli-developer | 5 | Workflow phases, missing decision criteria and anti-patterns |
| 85 | data-researcher | 5 | Workflow phases, missing decision criteria and domain checklist |
| 86 | elixir-pro | 5 | Deep expertise, no execution workflow, no decision matrices |
| 87 | flutter-pro | 5 | Capabilities and behavioral traits, no workflow or decision framework |
| 88 | haskell-pro | 5 | Expertise sections, no workflow or decision matrices |
| 89 | ios-pro | 5 | Capabilities and behavioral traits, no workflow or decision framework |
| 90 | mcp-developer | 5 | Phases listed, generic bullet points, no decision thresholds |
| 91 | mermaid-pro | 5 | Expert areas listed, no workflow, no completion criteria |
| 92 | product-manager | 5 | Guiding principles, output examples, missing prioritization workflow |
| 93 | research-analyst | 5 | 3 phases exist but 125 lines of generic adjectives, zero procedures |
| 94 | ruby-pro | 5 | Core expertise, pattern guidance, metaprogramming anti-patterns |
| 95 | sre-engineer | 5 | Phase structure, SRE patterns list, mostly generic virtues |
| 96 | wordpress-master | 5 | Phase structure, technique lists, generic excellence checklist |
| 97 | build-engineer | 5 | Workflow phases outlined, missing metrics and decision criteria |
| 98 | c-pro | 4 | Core expertise documented, no workflow, no decision criteria |
| 99 | cpp-pro | 4 | Expertise documented, no workflow structure, no completion markers |
| 100 | csharp-pro | 4 | Expertise broad, no numbered workflow, no specific patterns |
| 101 | django-pro | 4 | Capabilities/expertise list, no workflows, no checklists, no templates |
| 102 | documentation-pro | 4 | Capabilities-focused list, no workflows, no thresholds, no output format |
| 103 | fastapi-pro | 4 | Comprehensive capability list, no workflow, no decision criteria |
| 104 | full-stack-developer | 4 | Competency list, no workflow steps, no decision criteria |
| 105 | java-pro | 4 | Extensive capability list, no workflow, no execution procedures |
| 106 | julia-pro | 4 | Capability descriptions, no structured workflow or decision criteria |
| 107 | service-mesh-pro | 4 | Capabilities list, no concrete workflow, incomplete sections |
| 108 | dotnet-core-pro | 4 | Generic capabilities, no workflow, no completion criteria |
| 109 | dotnet-framework-pro | 2 | Generic virtues only (stable, secure, optimized), nothing concrete |
| 110 | websocket-engineer | 2 | Minimal content, incomplete file, no structure |

---

## Score Distribution

| Mark | Count | % |
|------|-------|---|
| 9 | 16 | 15% |
| 8 | 30 | 27% |
| 7 | 18 | 16% |
| 6 | 16 | 15% |
| 5 | 16 | 15% |
| 4 | 10 | 9% |
| 2 | 2 | 2% |
| **Unscored** | **2** | **2%** |

**Median: 7** | **Mean: 6.7**

---

## Key Patterns

**What the top agents (9) share:**
- Numbered step-by-step workflows
- Decision tables with severity/priority levels
- Specific anti-patterns and false positive lists
- Structured output format (tables, templates)
- Clear completion/approval criteria
- Domain-specific checklists (not generic)

**What the bottom agents (2-4) share:**
- Lists of adjectives: "comprehensive, thorough, reliable, scalable"
- Capabilities described but not operationalized
- No workflow — just "expertise areas"
- No way to know when the agent is done
- Interchangeable — swap the domain nouns and the file reads the same

**The critical gap (score 5-6):**
These agents have *some* structure (phases, principles) but lack the operational detail that makes 8-9 agents effective. They describe what the agent KNOWS but not what it DOES. Upgrading them requires adding: numbered steps, decision thresholds, output templates, and anti-pattern lists.

---

## Worst Offenders (candidates for rewrite)

| Agent | Issue |
|-------|-------|
| dotnet-framework-pro | Empty shell — generic virtues, nothing actionable |
| websocket-engineer | Incomplete file, barely exists |
| research-analyst | 125 lines of bullet-pointed adjectives, zero concrete procedures |
| full-stack-developer | Competency list could describe any developer role |
| java-pro | Extensive but entirely declarative — "expert in X" repeated 50 times |
| documentation-pro | Ironic: the documentation agent has the worst documentation |
| fastapi-pro | All capabilities, no workflow — agent doesn't know what to do first |

## Best in Class (models for new agents)

| Agent | Why it works |
|-------|-------------|
| code-reviewer | Confidence-based filtering, severity table, approval matrix, false positives |
| security-reviewer | OWASP checklist operationalized, pattern-severity-fix table, emergency protocol |
| incident-responder | Time-boxed actions (first 5 min), severity routing, communication cadence |
| tdd-guide | Mechanical cycle (Red-Green-Refactor), coverage targets, anti-patterns |
| go-build-resolver | Diagnostic commands in order, fix patterns as lookup table, explicit stop conditions |
