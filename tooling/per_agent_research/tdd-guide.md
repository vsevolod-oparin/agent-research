# tdd-guide -- Research Report

**Eval scores:** 4.87 under D, H, I (ceiling). E scored 4.63 (v2 over-constrained). F scored 4.32 (bare). Agent instructions clearly help for TDD (+0.55 over bare).

---

## 1. Competitive Landscape

**TDD + AI Agents -- Current State of Art:**

**Frameworks/methodologies:**
- **TDAID (Test-Driven AI Development)** -- Extends TDD with Plan phase before Red and Validate phase after Refactor. Plan -> Red -> Green -> Refactor -> Validate. Gaining traction as the standard for AI-assisted TDD.
- **Spec-Driven Development (SDD)** -- IBM-promoted alternative. Specs-first, not tests-first. Complements TDD by adding comprehensive specifications. GitHub has an open-source SDD toolkit.
- **Test-Driven Agentic Development** -- TDD + contract-driven development + architectural fitness functions. Tests as executable specifications that constrain AI agent behavior. Agents have read access to specs/tests but cannot alter foundational tests.
- **QA Skills (qaskills.sh)** -- CLI tool that injects TDD discipline into AI agents via context rules. Enforces Red phase verification, small increments, separate refactor step.

**AI Test Generation Tools:**
- **Pynguin** -- Automated unit test generation for Python (1332 stars). Handles dynamic typing. Still under development.
- **Testeranto** -- BDD-driven vibe coding across polyglot codebases (JS, Python, Go, Rust, Java). Gherkin semantics -> AI edits code -> tests pass -> auto-commit.
- **auto-browse** -- Natural language E2E tests integrated with Playwright. Multi-model support.
- **Stryker / mutmut** -- Mutation testing tools that verify test suite quality by injecting deliberate bugs. Essential for validating AI-generated tests.

**AI Coding Agent Approaches to TDD:**
- **Claude Code** -- Strong long-context reasoning, terminal-native, good for TDD workflow. Plan mode supports TDAID-style planning.
- **ChatGPT Codex** -- Faster execution, cloud sandboxed, runs tests automatically in containers.
- **Cursor** -- Has explicit Plan mode that maps to TDAID planning phase.

**Industry validation:**
- DORA 2025 report confirms TDD principles amplified by AI: small batches, confidence in changes, systemic approach
- IBM/Microsoft studies: TDD reduces defect density by 40-90%
- Initial TDD overhead of 15-35% pays off in dramatically fewer production defects
- Teams practicing TDD + pair programming report deploying to production without test environments, relying on unit/integration tests + production testing with feature toggles

## 2. Known Failure Modes / Chokepoints

- **AI skips Red phase** -- The #1 anti-pattern. Without explicit instruction, AI agents write implementation and tests simultaneously, or generate tests after code. Tests end up testing "what the code does" not "what it should do"
- **AI test cheating** -- Agent generates code that passes tests through shortcuts (ignoring edge cases, hardcoding expected values) rather than implementing correct logic
- **Test-after masquerading as TDD** -- Agent writes implementation first, then creates tests that merely confirm existing behavior. Looks like high coverage but catches zero regressions
- **Over-generation / kitchen sink tests** -- Agent writes one test verifying 15 things instead of focused, single-assertion tests
- **AI rewrites tests to match implementation** -- Instead of fixing code to pass tests, agent modifies the tests. This breaks the fundamental TDD contract
- **Validation bottleneck** -- Human review of AI-generated code remains the only reliable quality measure. Models produce working code rapidly but intent verification is slow (cited as current bottleneck in TDAID)
- **Over-mocking** -- AI agents tend to mock heavily (>60% of test is mock setup), making tests brittle and testing mocks rather than behavior
- **Testing implementation details** -- AI tests internal state/private methods rather than observable behavior. Refactoring breaks tests even when behavior is unchanged
- **Flaky tests** -- AI-generated async tests with timing dependencies, unstable selectors in E2E
- **Loss of discipline at speed** -- AI can generate code so fast that the Red-Green-Refactor discipline erodes. Developers accept large AI-generated chunks instead of small increments

## 3. What Would Make This Agent Best-in-Class

- **Enforce Red phase verification** -- Agent MUST show failing test output before writing any implementation. QA Skills approach: explicit instruction "never write production code without a failing test"
- **Small increment enforcement** -- One test at a time. If agent produces too much code in one burst, revert and restart with constrained scope. The TDAID practitioners report this is faster than salvaging sprawling changes
- **Mutation testing integration** -- Coverage metrics alone are insufficient. Stryker/mutmut verify tests actually catch bugs. Healthy metric: test-to-code ratio of 1:1 to 1.5:1
- **Characterization test workflow for legacy code** -- Current v4 already has this (observe -> capture behavior -> mark bugs -> refactor -> fix separately). This is a differentiator.
- **Plan phase** -- TDAID-style structured planning before coding: what to build, phased changes, tests to write, expected outcomes. Anchors the entire session.
- **Test intent documentation** -- Each test should have a comment explaining WHY it exists, not just WHAT it tests. Prevents "test after" disguised as TDD.
- **Separate refactor step** -- Prevent over-engineering during Green phase. Refactor is its own explicit step with tests staying green.
- **Framework-specific guidance** -- Current v4 is framework-agnostic. Could add detection of project test framework (Jest/Vitest/pytest/etc.) and adapt advice.

## 4. Main Bottleneck

**Prompt is already strong; the bottleneck is model discipline enforcement.** The v4 prompt covers:
- Full Red-Green-Refactor cycle with explicit steps
- Test type decision tree
- Characterization tests for legacy code
- Comprehensive edge case checklist
- Anti-patterns to avoid

The gap is not knowledge but **behavioral enforcement**. The agent knows TDD principles but LLMs naturally want to write implementation + tests together. The key improvements are:
- Stronger "stop and verify" checkpoints (show failing test output before proceeding)
- Explicit prohibition on writing tests and code simultaneously
- Small increment constraints
- Plan phase addition (TDAID-style)

The +0.55 over bare already shows instructions help. The ceiling score suggests current tasks don't stress the enforcement boundary. Harder eval tasks (e.g., "implement a feature using strict TDD in an existing codebase with legacy code") might reveal gaps.

## 5. What Winning Setups Look Like

- **TDAID workflow:** Plan -> Red -> Green -> Refactor -> Validate, with human checkpoints after each phase. Agent marks completed phases in the plan. Commits after each TDD cycle. Revert-and-restart when agent overshoots.
- **QA Skills pattern:** CLI-injected rules that constrain agent behavior: "never write production code without a failing test," "take small increments," "verify Red phase," "refactor as separate step." Enforced via context, not honor system.
- **Test-Driven Agentic Development:** Tests as executable specifications. Agent has read access to all specs/tests but cannot alter foundational tests. Full CI/CD validation pipeline provides immediate feedback. Specialized agents for different roles (implementation, testing, integration, review).
- **Pair programming + TDD (InfoQ/QCon pattern):** No solo tasks. TDD + pair programming -> deploy to production. No separate test environments. Feature toggles for risk reduction. "The fastest feedback from tests, the best feedback from production."
- **CI/CD enforcement:** GitHub Actions pipeline that runs tests, checks coverage thresholds, verifies test files exist for new source files. Mutation testing gate. Test-to-code ratio check.
- **Common winning traits:**
  - Tests define "done" -- the agent doesn't decide when work is complete; the tests do
  - Small increments: few tests -> few code changes -> verify -> refactor loops
  - Revert-and-restart is faster than salvaging when agent overshoots
  - Controlled regression gates: test suite as the contract the agent must satisfy
  - Fast test execution: tight feedback loops are essential for both AI and human productivity
