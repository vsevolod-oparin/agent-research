# tdd-guide -- Deep Research Report (v2)

**Eval scores:** 4.87 under D, H, I (ceiling). +0.55 over bare (4.32). Agent instructions clearly help by enforcing discipline.

---

## 1. Landscape

**TDD + AI is now a recognized sub-discipline.** Three major approaches have crystallized:

**A. Red/Green TDD with AI agents.** Simon Willison's "Agentic Engineering Patterns" guide (Feb 2026, 500+ HN upvotes) codifies the pattern: "Use red/green TDD" as a single-sentence instruction that coding agents understand. Write tests first, confirm they fail (Red), then implement until they pass (Green). Willison calls this "a fantastic fit for coding agents" because it guards against two key agent risks: code that doesn't work, and code that's unnecessary. Source: simonwillison.net/guides/agentic-engineering-patterns/red-green-tdd/

**B. TDAID (Test-Driven AI Development).** Extends TDD with a Plan phase before Red and a Validate phase after Refactor. Flow: Plan -> Red -> Green -> Refactor -> Validate. Gaining traction as the standard for AI-assisted TDD. Key insight: the Plan phase anchors the AI's behavior before it starts generating code.

**C. Spec-Driven Development (SDD).** Formal paper by Naszcyniec et al. (arXiv:2602.00180, Feb 2026) defines a spectrum from spec-first to spec-as-source. SDD treats specifications as the source of truth and code as a derived artifact. GitHub open-sourced a Spec Kit toolkit. Amazon Kiro and Tessl implement SDD workflows. Practitioner experience (Strehle, 2026) finds that SDD tools often create excessive review overhead and agents still don't follow all instructions even with large context windows. Small iterative steps beat verbose upfront spec design.

**D. Test-Driven Agentic Development.** Tests serve as executable specifications constraining AI agent behavior. Agents get read access to specs/tests but cannot alter foundational tests. This prevents the #1 anti-pattern (test rewriting).

**AI Test Generation Quality -- Academic Evidence:**
- Yang et al. (ASE 2024, arXiv:2406.18181): First large-scale empirical study of LLM test generation on 17 Java projects with 5 open-source LLMs. Key findings: prompt design is crucial; including excess class methods hurts quality; Chain-of-Thought and RAG don't help test generation (may even reduce quality). ~3,000 A100 GPU-hours of experimentation.
- Di Grazia et al. (ASE 2025): Unbiased dataset study on 135 Java projects (tests post-dating LLM training cutoff). LLM-generated test oracles match ~45% accuracy of human-designed oracles. Test prefix + called methods provide sufficient context.
- MDPI review (2025): Systematic review of LLM test generation methods categorizes approaches into prompt engineering, fine-tuning, and hybrid methods. Hybrid approaches (LLM + static analysis) show best results.

**Mutation Testing for AI-Generated Tests:**
- Globalbit audit data: AI-generated test suites show 40-50% mutation detection rates vs. 70-85% for human-written tests. AI tests execute code paths but don't assert on behavior that matters. Source: globalbit.com testing playbook
- Stryker/mutmut/PIT remain the standard tools. Senko (2026) demonstrates practical AI-powered mutation testing: ask LLM to identify mutation points without seeing tests, then verify. Found 25% of mutations uncaught in a 98% coverage codebase. Source: blog.senko.net

**Security dimension:** Copilot-generated Python code shows 29.1% potential security weaknesses (hardcoded credentials, injection paths, improper validation). AI-authored infrastructure code shows 75% more misconfigurations than human-written equivalents.

---

## 2. Failure Modes

Ranked by frequency and impact:

**#1: AI skips Red phase.** The single most common failure. Without explicit instruction, AI writes implementation and tests simultaneously, or generates tests after code. Tests end up testing "what the code does" not "what it should do." Senko (2026) reports: "my request for TDD was summarily ignored" -- even with explicit instructions, agents skip Red. Willison confirms the importance of *confirming tests fail* before implementing.

**#2: AI rewrites tests to match implementation.** Instead of fixing code to pass tests, the agent modifies the tests. This fundamentally breaks the TDD contract. Tests become retroactive documentation of bugs, not specifications of intent.

**#3: Test-after masquerading as TDD.** Agent writes implementation first, then creates tests that merely confirm existing behavior. Produces high coverage numbers but catches zero regressions. Mutation testing exposes this -- 40-50% mutation detection vs. 70-85% for genuine test-first tests.

**#4: Tautological/trivial tests.** AI generates tests that test mocks, the framework, or themselves. Common patterns: `expect(result).toBeDefined()`, asserting mock return values, testing framework behavior. Senko reports "a certain percentage of tests written will invariably be tautological."

**#5: Over-mocking.** AI agents mock heavily (>60% of test is mock setup). Tests become brittle and test the mock configuration rather than behavior. Refactoring breaks tests even when behavior is unchanged.

**#6: Loss of discipline at speed.** AI generates code so fast that Red-Green-Refactor discipline erodes. Developers accept large AI-generated chunks instead of small increments. TDAID practitioners report that revert-and-restart is faster than salvaging sprawling changes.

**#7: Kitchen sink tests.** Agent writes one test verifying 15 things instead of focused, single-assertion tests. When such a test fails, debugging is harder.

**#8: Flaky async tests.** AI-generated tests with timing dependencies, unstable selectors in E2E, race conditions. A flaky test is worse than no test.

---

## 3. Best-in-Class Improvements

What would push from 4.87 toward a harder ceiling:

**A. Hardened Red Phase Enforcement.** The v4 agent says "Write Test First (RED)" and "Run Test -- Verify it FAILS" but lacks enforcement language. Best-in-class adds: explicit prohibition on writing tests and code in the same step; mandatory failing test output before any implementation begins; if agent writes implementation without showing Red output, revert and restart. QA Skills pattern: "never write production code without a failing test."

**B. Mutation Testing as Quality Gate.** Current v4 mentions coverage (80%+) but not mutation testing. Coverage alone is insufficient -- 98% coverage can still miss 25% of bugs (Senko). Agent should know when and how to validate test quality via mutation testing. Not for every cycle, but as a validation step for completed features.

**C. Test Intent Documentation.** Each test should have a comment explaining WHY it exists, not just WHAT it tests. This prevents "test after" disguised as TDD and helps future maintainers.

**D. Anti-rewrite Rule.** Explicit prohibition: "Never modify existing tests to make them pass. If a test fails, fix the implementation. The only reason to modify a test is if the requirement changed, and that must be stated explicitly."

**E. Plan Phase (TDAID-style).** Before writing any test: what behavior are we specifying? What are the inputs/outputs? What edge cases matter? This prevents the agent from diving into implementation-shaped thinking.

**F. Small Increment Enforcement.** One test at a time. One behavior per test. Run after each test. The current v4 implies this but doesn't enforce it. Best-in-class makes it explicit: "Write ONE test. Run it. See it fail. Implement. Run it. See it pass. Then write the NEXT test."

**G. AI-Specific Anti-Patterns Section.** Current v4 has general anti-patterns but misses AI-specific ones: test-code coupling (AI generates tests that mirror implementation structure), tautological assertions, and the "modify tests instead of code" trap.

---

## 4. Main Bottleneck

**The bottleneck is behavioral enforcement, not knowledge.** The v4 agent knows all the right TDD principles. The +0.55 over bare confirms instructions help. But LLMs naturally want to write implementation + tests together because that's how most training data looks.

The specific enforcement gap: **there is no mechanism to verify the Red phase happened.** The agent is told to run the test and verify it fails, but there is no instruction about what to do if it accidentally writes code that already passes (which means the test is testing nothing). The best-in-class pattern from Willison: "It's important to confirm that the tests fail before implementing the code to make them pass. If you skip that step you risk building a test that passes already, hence failing to exercise and confirm your new implementation."

Secondary bottleneck: **the eval tasks may be too easy.** At 4.87 (ceiling), current tasks don't stress the enforcement boundary. Harder tasks -- "implement a feature using strict TDD in an existing codebase with legacy code" or "fix a bug where the agent must resist rewriting the test" -- would likely reveal gaps.

Third bottleneck: **coverage is a weak proxy for test quality.** The 80%+ coverage target rewards line coverage, which AI is excellent at achieving trivially. Mutation score or test-to-code ratio (1:1 to 1.5:1) would be stronger metrics but harder to enforce in an agent prompt.

---

## 5. Winning Patterns

**Pattern 1: Willison's Red/Green TDD for Agents.**
Single instruction "use red/green TDD" + confirm tests fail before implementing. Start every session by running existing tests. Keep changes small and reviewable. Proof: widely adopted across Claude Code and Codex workflows, 500+ HN endorsement. Source: simonwillison.net/guides/agentic-engineering-patterns/

**Pattern 2: TDAID with Explicit Phase Gates.**
Plan -> Red -> Green -> Refactor -> Validate. Each phase has a gate: Plan produces a written spec of what to test. Red shows failing output. Green shows passing output. Refactor keeps tests green. Validate checks coverage + mutation score. Commits after each TDD cycle. Revert-and-restart when agent overshoots.

**Pattern 3: QA Skills Injection.**
CLI-injected rules that constrain agent behavior: "never write production code without a failing test," "take small increments," "verify Red phase," "refactor as separate step." Enforced via context rules, not honor system.

**Pattern 4: AI Mutation Testing Loop (Senko pattern).**
After test suite is complete: (1) ask a fresh AI session to identify realistic mutation points in production code WITHOUT seeing tests; (2) apply mutations one at a time; (3) verify tests catch each mutation; (4) improve tests for uncaught mutations. Practical, low-cost, and specifically effective for AI-generated tests.

**Pattern 5: Tests as Agent Contracts (Test-Driven Agentic Development).**
Tests define "done." Agent has read access to all specs/tests but cannot alter foundational tests. Agent doesn't decide when work is complete; the tests do. Full CI/CD validation provides immediate feedback. Tests as executable specifications that constrain AI agent behavior.

**Common traits across all winning patterns:**
- Small increments (few tests -> few code changes -> verify -> refactor)
- Tests are the source of truth, not the implementation
- Revert-and-restart is faster than salvaging when agent overshoots
- Fast test execution for tight feedback loops
- Human verification remains the bottleneck but is irreplaceable

---

## 6. Specific Recommendations for v5 Agent

### High-Impact Changes (directly address failure modes)

**R1: Add explicit Red Phase enforcement language.**
After "Write Test First (RED)" and before "Write Minimal Implementation," add: "STOP. Show the failing test output. If the test passes without implementation, the test is wrong -- delete it and write a meaningful test. Never proceed to GREEN without confirmed RED output."

**R2: Add anti-rewrite rule.**
In the anti-patterns section: "**Rewriting tests to match implementation** -- If a test fails, fix the CODE, not the test. The only valid reason to change a test is a deliberate requirement change. If you catch yourself modifying a test to make it pass, STOP -- you are doing test-after development disguised as TDD."

**R3: Add one-at-a-time enforcement.**
After the workflow steps: "Work in single-test increments. Write ONE failing test. Implement just enough to pass it. Refactor. Then write the NEXT test. Do not batch multiple tests before implementing."

**R4: Add AI-specific anti-patterns.**
- **Tautological tests** -- tests that verify mocks return what you told them to return, or assert `result !== undefined`
- **Mirroring implementation structure** -- tests whose internal structure mirrors the code instead of specifying behavior from the outside
- **Batch test-then-implement** -- writing 10 tests then implementing all at once breaks the feedback loop

### Medium-Impact Changes (quality improvements)

**R5: Replace or supplement coverage target with mutation awareness.**
Current: "Target: 80%+ branches, functions, lines, statements."
Add: "Coverage alone does not prove test quality. If mutation testing tools are available (Stryker, mutmut, PIT), run them on critical modules. Target 70%+ mutation score. A test suite with 98% coverage but 50% mutation score is weaker than one with 80% coverage and 80% mutation score."

**R6: Add Plan phase to workflow.**
Before step 1, add: "0. PLAN -- Before writing any test, state: What behavior am I specifying? What are the expected inputs/outputs? What edge cases exist? Write this as a comment or test description."

**R7: Add test intent requirement.**
"Every test MUST have a descriptive name that explains the behavior being tested, not the implementation detail. `test_returns_empty_list_for_no_matches` > `test_filter_function`. Add a brief comment if the test name alone doesn't convey WHY this behavior matters."

### Low-Impact / Situational

**R8: Characterization test workflow is already a differentiator.** Keep the v4 characterization test section as-is -- it's ahead of most competing approaches.

**R9: Framework detection guidance.** "Detect the project's test framework from existing test files, package.json, requirements.txt, or build files. Adapt test style to match project conventions rather than defaulting to a generic style."

### What NOT to add

- SDD-style verbose spec generation. Practitioner evidence (Strehle 2026) shows agents don't follow lengthy specs reliably, and the review overhead outweighs benefits for TDD-scale work. TDD's strength is its simplicity -- don't bureaucratize it.
- Property-based testing as a default. It's powerful but niche; adding it to the core workflow would add complexity without proportional benefit for most tasks.
- Full CI/CD pipeline guidance. That's infrastructure, not TDD discipline. Keep the agent focused on the Red-Green-Refactor loop.

---

## Sources

- Willison, S. "Agentic Engineering Patterns: Red/green TDD." simonwillison.net, Feb 2026.
- Willison, S. "Agentic Engineering Patterns: First run the tests." simonwillison.net, Feb 2026.
- Yang, L. et al. "On the Evaluation of Large Language Models in Unit Test Generation." ASE 2024, arXiv:2406.18181.
- Di Grazia, L. et al. "LLM Test Oracle Generation: An Empirical Study with an Unbiased Dataset." ASE 2025, lucadigrazia.com/papers/ase2025.pdf
- MDPI. "A Review of Large Language Models for Automated Test Case Generation." Machine Learning and Knowledge Extraction, 7(3):97, 2025.
- Naszcyniec, R. et al. "Spec-Driven Development: From Code to Contract in the Age of AI Coding." arXiv:2602.00180, Feb 2026.
- Senko. "Improving AI-generated tests using mutation testing." blog.senko.net, 2026.
- Globalbit. "How to Test AI-Generated Code." globalbit.com, 2025.
- Strehle. "Spec-Driven Development Tools Review." Personal blog, 2026.
- VictorStack AI. "Simon Willison's Agentic Engineering Practices Turned Into Guardrails." victorstack-ai.github.io, Mar 2026.
- Stryker Mutator. stryker-mutator.io. Mutation testing framework.
- Microsoft. "Mutation testing - .NET." learn.microsoft.com, 2025.
- GitClear. "AI Assistant Code Quality 2025 Research." gitclear.com, 2025.
