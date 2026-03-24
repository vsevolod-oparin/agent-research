# Prompt Optimization Plan: Literature Review & Implementation

Date: 2026-03-25

---

## SECTION 1: Literature Review

### The Three Anchor Papers

#### TRIPLE (Shi et al., NeurIPS 2024)
**Core idea:** Frames prompt selection as a fixed-budget best arm identification (BAI-FB) problem from multi-armed bandit theory. Given a pool of candidate prompts and a limited evaluation budget, TRIPLE allocates evaluations across prompts to maximize the probability of identifying the single best prompt.

**Algorithm:** Two core variants: TRIPLE-SH (Sequential Halving) divides the budget across rounds, eliminates the worst-performing half each round. TRIPLE-CR (Continuously Reject) uses adaptive elimination via Large Deviation Principle, discarding underperformers as soon as statistical confidence is sufficient. Two scalability extensions: TRIPLE-CLST (clustering semantically similar prompts via embeddings to share evaluation information) and TRIPLE-GSE (Gaussian Process over prompt embeddings for informed exploration).

**What it optimizes:** Prompt *selection* from a pre-generated pool. Does not generate prompts -- assumes a candidate pool already exists (typically from APE or APO).

**Sample efficiency:** The key contribution. On small prompt pools, TRIPLE-SH/CR outperform uniform sampling by 13-35% at the same budget. On large pools (thousands of candidates), TRIPLE-CLST/GSE achieve 45-51% improvement over uniform on Llama2-7b. Integrates into end-to-end pipelines (APE, APO) as a drop-in replacement for their selection stages.

**Relevance to our problem:** HIGH. Our core constraint is eval budget -- each agent description evaluation requires running 5 tasks through an LLM judge (~$2-5 per condition). TRIPLE's budget-aware selection directly addresses this. We generate candidate .md variants, then use TRIPLE-SH to identify the best one with minimal evaluations. The embedding-based extensions (CLST, GSE) could exploit semantic similarity between prompt variants to reduce required evaluations further.

**Limitations:** Assumes i.i.d. rewards (each prompt evaluation is noisy but stationary). Our eval tasks may have high variance depending on the task. Does not address prompt *generation* -- needs a separate generation method. Assumes discrete candidate pool; our .md files are long structured documents, not short instruction sentences.

---

#### APE (Zhou et al., ICLR 2023)
**Core idea:** Treat the instruction as a "program" and use an LLM to automatically generate and select instructions. Given input-output demonstrations, the LLM proposes candidate instructions, which are then scored on a task and the best is selected.

**Algorithm:** (1) Generate candidate instructions via LLM (forward mode: "What instruction could produce these outputs?" or reverse mode: paraphrase existing instructions). (2) Score each candidate via execution accuracy on a held-out set. (3) Select the best using iterative Monte Carlo search or UCB (Upper Confidence Bound) bandit. Optional iterative refinement via semantic similarity-based resampling.

**What it optimizes:** Short natural language instructions (typically 1-3 sentences). Optimizes for task accuracy on classification/QA benchmarks (Instruction Induction, BIG-Bench).

**Sample efficiency:** Generates ~50-200 candidate prompts, evaluates each on ~5 samples, uses UCB to focus evaluations. Total: ~1000-5000 LLM calls. The famous result: APE-generated "Let's work this out in a step by step way to be sure we have the right answer" outperformed the human-written "Let's think step by step" (82.0 vs 78.7 on MultiArith).

**Relevance to our problem:** MODERATE. APE's generation approach (LLM proposes instruction candidates) maps to having Opus generate agent description variants. However, APE optimizes short instructions (<50 tokens), while our agent descriptions are 60-150 lines of structured markdown with domain checklists, anti-patterns, and decision tables. APE's "generate from demonstrations" framing doesn't directly apply -- we'd need to adapt it to "generate from task failure analysis." APE's UCB selection is superseded by TRIPLE's more principled BAI approach.

**Limitations:** Designed for short instructions, not long structured documents. Candidates are generated independently (no gradient-based refinement). Limited to tasks with clear accuracy metrics. The iterative refinement via semantic similarity is weak compared to APO's gradient-based approach.

---

#### APO / ProTeGi (Pryzant et al., EMNLP 2023)
**Core idea:** Treat prompt optimization as analogous to gradient descent -- generate "text gradients" by having an LLM analyze errors and suggest improvements, then apply those suggestions via beam search over prompt variants.

**Algorithm:** (1) Run current prompt on a batch of training examples. (2) For incorrect examples, generate "gradients" -- natural language descriptions of what went wrong and how the prompt should change. (3) Use an LLM to edit the prompt based on these gradients. (4) Maintain a beam of top-k prompts, expanding each with gradient-based edits and pruning to the best performers. Repeat for T iterations.

**What it optimizes:** Discrete text prompts (instructions). Optimizes for task accuracy, with the gradient step providing directional feedback.

**Sample efficiency:** ~100-500 LLM calls per iteration, ~5-10 iterations typical. More efficient than APE for iterative refinement because gradients provide directional signal rather than random generation. Beam search (width 3-5) maintains diversity while converging.

**Relevance to our problem:** HIGH -- the most directly applicable paper. APO's "text gradient" maps exactly to our failure analysis: run GLM 4.7 on a task, identify must_not violations and missing must_mention items, generate a natural language critique ("the agent description should explicitly prohibit flagging parameterized SQL as injection"), then edit the .md file accordingly. The beam search maintains multiple agent description variants, converging on the best. This is essentially what our agent-creator audit loop tried to do -- but APO formalizes it with proper evaluation at each step, avoiding the "optimizing a proxy that diverges from reality" failure we documented.

**Limitations:** Gradient quality depends on the meta-LLM's ability to diagnose failures. Can drift toward overfitting if training set is small. The beam search requires evaluating all beam candidates at each step (expensive with our eval setup). No formal budget constraints (unlike TRIPLE).

**Key insight for us:** APO's failure mode -- drifting toward proxy optimization -- is exactly what we observed in our agent-creator iteration findings (rounds 2-4 degraded because the audit rubric diverged from actual output quality). The fix is the same one APO applies: use *actual task performance* as the optimization signal, not a rubric score.

---

### Related Work

#### OPRO (Yang et al., NeurIPS 2024)
**Summary:** Uses the LLM itself as the optimizer. At each step, the LLM sees previously generated prompts with their scores in a meta-prompt, then generates new candidate prompts. The meta-prompt grows with the optimization history, providing implicit gradient signal.

**Key innovation:** No separate optimizer/generator split -- the same LLM does both. The optimization trajectory is encoded in the meta-prompt itself, enabling the LLM to learn from its own exploration history.

**Limitations:** Computationally expensive (each meta-prompt grows with history). Limited to short instructions. Performance plateaus after ~10-20 iterations. The LLM can get stuck in local optima because it tends to generate variations of high-scoring prompts.

**Mapping to our problem:** MODERATE. Could use Opus as the meta-optimizer, showing it previous agent description versions with their eval scores. However, our .md files are too large to fit multiple versions in a single meta-prompt context window. More suitable for optimizing specific *sections* of an agent description rather than the whole document.

---

#### EvoPrompt (Guo et al., ACL 2024)
**Summary:** Applies evolutionary algorithms (GA and DE) to prompt optimization. Maintains a population of prompts, uses LLM-based crossover and mutation operators. GA combines two parent prompts into a child; DE applies differential evolution (takes three prompts, computes a "difference" between two, applies it to the third).

**Key innovation:** Population-based search maintains diversity better than beam search. The DE operator is particularly clever -- it captures the *direction* of improvement between two prompts and applies that direction to a third, analogous to momentum in gradient descent.

**Limitations:** Requires larger populations (10-20+ prompts) and many generations. Sample efficiency is worse than gradient-based methods. Crossover/mutation of long structured documents (our .md files) is poorly defined -- LLM-based operators may produce incoherent combinations.

**Mapping to our problem:** LOW-MODERATE. Population diversity could help avoid the local optima that caused our v5-full regression. However, the sample cost of evaluating 10-20 agent description variants per generation is prohibitive (~$20-50 per generation with our eval setup).

---

#### PromptBreeder (Fernando et al., 2023)
**Summary:** Self-referential self-improvement -- evolves both the task prompts AND the mutation operators that generate new prompts. Uses a population of (prompt, mutation-prompt) pairs. The mutation prompts themselves evolve, enabling the system to discover better ways to improve prompts over time.

**Key innovation:** Meta-evolution -- the search strategy itself adapts. This addresses the problem of fixed mutation operators being suboptimal for specific domains.

**Limitations:** Extremely sample-hungry. Requires many generations with large populations. The self-referential nature can lead to instability. Designed for short classification prompts, not structured documents.

**Mapping to our problem:** LOW. The meta-evolution concept is interesting (evolving the "how to improve agent descriptions" strategy itself), but the sample cost is prohibitive. However, the *idea* of evolving our design guide (agent-description-guide.md) alongside the agent descriptions is worth noting -- our guide itself could be a target for optimization.

---

#### DSPy (Khattab et al., ICLR 2024)
**Summary:** A programming framework for LM pipelines where prompts are *compiled* rather than hand-written. Users define modules with typed signatures (e.g., `question -> answer`), and DSPy's optimizers (MIPRO, BootstrapFewShot) automatically search for optimal instructions and demonstrations.

**Key innovation:** Shifts from "prompt engineering" to "prompt programming." Prompts are intermediate artifacts generated by optimizers, not hand-crafted end products. MIPRO uses Bayesian optimization over instruction and demonstration spaces.

**Limitations:** Designed for pipeline composition (retriever -> reader -> answer), not for single long-form prompts like agent descriptions. Requires a training set with ground-truth outputs. The abstraction level is too high for our use case -- we need to optimize the *content* of a 100-line structured document, not compose pipeline modules.

**Mapping to our problem:** LOW for direct application, but the MIPRO optimizer's Bayesian optimization approach is relevant. We could adapt MIPRO's strategy of treating instruction sections as independent parameters to optimize, testing combinations of checklist items, anti-patterns, and constraints.

---

#### PhaseEvo (Phase-adaptive Evolutionary Prompt Optimization)
**Summary:** Not found in search results with sufficient detail. Based on references in survey papers, it appears to be an evolutionary approach that adapts its strategy across optimization phases (exploration-heavy early, exploitation-heavy late).

**Mapping to our problem:** Insufficient data. The phase-adaptive concept aligns with our intuition that early iterations should explore broadly (diverse agent description structures) while later iterations should refine locally (tweaking specific checklist items).

---

#### PromptBridge (Wang et al., 2025)
**Summary:** Directly addresses cross-model prompt transfer -- the exact problem we face with the Sonnet-to-GLM 4.7 gap. PromptBridge first optimizes prompts for both source and target models on a small set of calibration tasks using MAP-RPE (Model-Adaptive Reflective Prompt Evolution). Then it learns a cross-model prompt mapping from the calibrated pairs. At test time, given a source-model prompt, the mapping produces an optimized prompt for the target model.

**Key innovation:** Training-free framework that learns a generalizable prompt transformation between models. On SWE-Bench, transferring to o3 via PromptBridge yields 27.39% improvement over direct transfer.

**Limitations:** Requires calibration tasks representative of downstream use. The mapping is learned from a small number of prompt pairs -- may not generalize to our highly structured .md format. The MAP-RPE inner loop itself requires multiple iterations.

**Mapping to our problem:** HIGH. This is the closest existing work to our cross-model transfer problem. Our calibration tasks already exist (5 per agent). The key adaptation: we'd use Opus to learn the Sonnet->GLM 4.7 mapping from our existing eval data (we already have Sonnet scores and GLM 4.7 scores for identical prompts across 5 agent versions).

---

#### PO2G (Prompt Optimization with Two Gradients, 2025)
**Summary:** Extends APO's text gradient approach by generating two separate feedback signals -- one for false positive errors and one for false negative errors. Uses clustering on error examples to provide representative feedback.

**Key innovation:** Error-type-specific feedback prevents the optimizer from fixing one type of error while introducing another. This is directly relevant to our precision-vs-recall tradeoff in agent descriptions.

**Mapping to our problem:** HIGH for review agents. Our code-reviewer and security-reviewer agents face exactly this tradeoff: adding domain checklists improves recall (must_mention) but can introduce false positives (must_not violations). PO2G's dual-gradient approach could separately optimize for "items the agent should catch" and "items the agent should NOT flag."

---

#### PROMST (Chen et al., EMNLP 2024)
**Summary:** Prompt optimization for multi-step tasks. Incorporates human-designed feedback rules and a learned heuristic model that predicts prompt performance to efficiently sample candidates.

**Key innovation:** Addresses the challenge that multi-step agent tasks are harder to optimize than single-step classification -- prompt content is more extensive, individual step impact is hard to evaluate, and different users have varied preferences. Achieves 10.6-29.3% improvement over best methods across 11 multi-step tasks on five LLMs.

**Mapping to our problem:** MODERATE. Our agents execute multi-step tasks (review code, write reports, implement features). PROMST's insight that multi-step prompts need different optimization strategies than single-step ones validates our empirical finding that workflow instructions hurt while domain checklists help.

---

#### AutoPDL (Spiess et al., 2025)
**Summary:** Frames prompt optimization as a structured AutoML problem over a combinatorial space of prompting patterns (Zero-Shot, CoT, ReAct, ReWOO) and demonstrations. Uses successive halving to efficiently navigate this space. Solutions are human-readable PDL programs.

**Key innovation:** Optimizes the *prompting pattern* alongside the prompt content. Finds that optimal strategies vary across models and tasks -- averaging 9.21 percentage point accuracy gains across three tasks and seven LLMs.

**Mapping to our problem:** MODERATE. The finding that optimal prompting strategies vary across models directly supports our observation that v1 (verbose) works better on Sonnet while compact agents (I, O) work relatively better on GLM 4.7. AutoPDL's successive halving is essentially TRIPLE-SH applied to a combinatorial space.

---

#### Synthetic Task/Benchmark Generation Literature

**Self-Instruct (Wang et al., 2022):** LLMs generate instruction-following data from seed tasks. Uses the LLM to generate new tasks, filter low-quality ones, and create input-output pairs. Key insight: a small seed set (175 tasks) can bootstrap a large diverse dataset (52K). Directly applicable to our task generation pipeline.

**Evol-Instruct (Xu et al., 2023, used in WizardLM):** Evolves instructions from simple to complex using LLM-driven rewriting. Applies operations like deepening, concretizing, adding constraints, and increasing reasoning steps. Relevant for difficulty calibration -- we can evolve easy tasks into harder discriminating ones.

**DyVal (Zhu et al., 2023):** Dynamic evaluation protocol that generates evaluation samples on-the-fly to prevent data contamination. Uses graph-based structures to create reasoning tasks with controllable difficulty. The controllable difficulty aspect maps to our need for discriminating tasks.

---

### Summary Table

| Paper | Year | Approach | Sample Efficiency | Relevance |
|-------|------|----------|-------------------|-----------|
| **TRIPLE** | 2024 | BAI-FB for prompt selection | HIGH (13-51% improvement at same budget) | HIGH -- budget-aware selection |
| **APE** | 2022 | LLM generates + UCB selects | MODERATE (~1K-5K calls) | MODERATE -- generation only |
| **APO/ProTeGi** | 2023 | Text gradients + beam search | MODERATE (~500-5K calls) | HIGH -- iterative refinement |
| **OPRO** | 2023 | LLM as optimizer via meta-prompt | LOW (~1K+ calls, plateaus) | MODERATE -- section-level |
| **EvoPrompt** | 2023 | Evolutionary (GA/DE) | LOW (large populations) | LOW -- too expensive |
| **PromptBreeder** | 2023 | Meta-evolution | VERY LOW | LOW -- too expensive |
| **DSPy/MIPRO** | 2023/24 | Bayesian optimization of pipelines | MODERATE | LOW -- wrong abstraction |
| **PromptBridge** | 2025 | Cross-model prompt mapping | MODERATE (calibration tasks) | HIGH -- direct transfer |
| **PO2G** | 2025 | Dual gradients (FP/FN) | MODERATE | HIGH -- precision/recall |
| **PROMST** | 2024 | Multi-step task optimization | MODERATE | MODERATE -- multi-step |
| **AutoPDL** | 2025 | AutoML over prompting patterns | MODERATE (successive halving) | MODERATE -- pattern selection |

---

## SECTION 2: Implementation Plan

### Problem A: Synthetic Task Generation

#### 1. Task Anatomy

A good eval task for agent descriptions must test whether the description actually changes model behavior. Based on our 420+ evaluated outputs, discriminating tasks have these components:

**Required components:**
- **Scenario:** A concrete codebase/situation the agent must analyze (e.g., "Review this Express.js API endpoint")
- **must_mention:** Items the agent SHOULD identify. These test recall -- does the description activate the right domain knowledge? (e.g., "must mention missing rate limiting")
- **must_not:** Items the agent should NOT flag. These test precision -- does the description prevent false positives? (e.g., "must not flag parameterized SQL as injection risk"). These MUST include false-positive traps -- code patterns that look suspicious but are actually correct
- **structure_requirements:** Format expectations that test whether the description's guidance on output style is followed (e.g., "findings should include severity and file location")
- **difficulty_tier:** Easy/Medium/Hard, calibrated against the bare model baseline

**What makes a task discriminating:**
- The bare model (no agent instructions) should get 2-3 of the must_mention items but miss 2-3 others
- The bare model should trigger at least 1 must_not trap (false positive)
- A well-instructed model should get 4-5 must_mention items and avoid all must_not traps
- If both bare and instructed models score identically, the task is useless

#### 2. Generation Pipeline

Adapted from Self-Instruct + Evol-Instruct, with our domain constraints:

**Phase 1: Seed task analysis.** Extract patterns from our existing 60 tasks (5 per 12 agents). Classify each task's must_mention items by type: (a) domain knowledge items (things the model might not know), (b) thoroughness items (things the model might skip), (c) precision items (things the model might get wrong). Classify must_not items by trap type: (a) look-alike patterns (parameterized SQL vs string concatenation), (b) context-dependent correctness (SHA256 for checksums vs passwords), (c) scope violations (flagging unchanged code).

**Phase 2: Template generation.** Use Opus to generate task templates per agent type:
```
PROMPT TO OPUS:
"Given this agent type [code-reviewer] and these example tasks [paste 5 existing tasks],
generate 10 new task scenarios. Each must include:
- A realistic code snippet (50-200 lines) with 3-5 intentional issues and 2-3 false-positive traps
- must_mention: 4-6 items, mixing domain knowledge and thoroughness items
- must_not: 2-4 items, each with a specific false-positive trap embedded in the code
- A difficulty estimate (Easy: bare model catches 80%+, Medium: 40-70%, Hard: <40%)

The false-positive traps are the hardest part. Each must_not item should have code that
LOOKS like a problem but IS correct. Examples: [paste 3 examples of good must_not items]"
```

**Phase 3: Code snippet synthesis.** For each template, generate realistic code snippets. Use Opus with specific instructions to embed both real issues and false-positive traps. Key constraint: the code must be realistic enough that the agent treats it as a real review, not a test.

**Phase 4: Human validation pass.** Run each generated task against Sonnet with the best agent description (condition L) and the bare model (condition F). Check that the score difference is meaningful (>0.3 points). Discard tasks where L and F score within 0.1 points.

**Which paper's approach:** Self-Instruct for the bootstrapping pipeline (small seed -> large dataset). Evol-Instruct for difficulty calibration (evolve easy tasks into harder ones by adding more subtle traps). PO2G's dual feedback for ensuring both must_mention and must_not categories are well-represented.

#### 3. Difficulty Calibration

The hardest unsolved problem. Adapted from DyVal's controllable difficulty:

**Calibration protocol:**
1. Generate a task candidate
2. Run it on Sonnet-bare (condition F) and Sonnet-best (condition L). Record scores
3. Compute discrimination score: `D = score_L - score_F`
4. Classify: D < 0.1 = non-discriminating (discard), 0.1-0.3 = easy, 0.3-0.6 = medium, 0.6+ = hard
5. Target distribution: 20% easy, 50% medium, 30% hard

**Making tasks harder:** Following Evol-Instruct, apply difficulty operators:
- **Add subtlety:** Make must_mention items less obvious (move the bug to a helper function)
- **Add traps:** Add more false-positive bait (correct code that looks incorrect)
- **Add context dependency:** Make the correct answer depend on context elsewhere in the file
- **Reduce signal:** Make the code snippet longer so the agent must find a needle in a haystack

#### 4. Train/Val Split

**The overfitting risk:** If we optimize agent descriptions on the same tasks we evaluate on, we overfit to task-specific quirks. A description that mentions "check for N+1 queries" will score well on tasks that test N+1 queries, but the improvement is trivially predictable.

**Split strategy:**
- **Train set:** 15 tasks per agent (10 generated + 5 original). Used for APO gradient computation and prompt variant scoring during optimization
- **Val set:** 10 tasks per agent (all generated, held out). Used only for final evaluation of optimized descriptions. Never shown to the optimizer
- **Cross-validation during optimization:** Use 3-fold cross-validation on the train set to detect overfitting. If train score improves but cross-val score doesn't, stop

**Anti-overfitting measures:**
- Train and val tasks should test the SAME capabilities but with DIFFERENT scenarios (e.g., both test "false positive avoidance on parameterized SQL" but with different code snippets)
- Val tasks should use different tech stacks than train tasks where possible (train: Express.js, val: FastAPI)
- Periodically regenerate val tasks to prevent implicit leakage

#### 5. Per-Agent Task Design

| Agent Type | Primary Test Dimensions | Critical Task Components |
|-----------|------------------------|-------------------------|
| **Review agents** (code-reviewer, security-reviewer) | Precision (must_not), Recall (must_mention), Severity calibration | False-positive traps (look-alike code patterns), must_not items that test common LLM false positives (parameterized SQL, checksums vs passwords) |
| **Implementation agents** (full-stack-developer, fastapi-pro) | Completeness, Correctness, Architecture decisions | Tasks with incomplete specs where the agent must make decisions; test whether it implements ALL required layers (DB, API, auth, tests) |
| **Domain specialists** (go-build-resolver, dotnet-framework-pro, java-pro) | Domain accuracy, Version-specific knowledge, Non-obvious facts | Tasks requiring knowledge the model might not have (JDK 24+ virtual thread changes, .NET Framework 4.8 ConfigureAwait) |
| **Process agents** (tdd-guide) | Process adherence, Anti-pattern avoidance | Tasks where the natural (wrong) approach is to write tests and code simultaneously; must test that the agent enforces red-green-refactor |
| **Research agents** (research-analyst) | Hallucination resistance, Source quality, Counter-argument inclusion | Tasks with verifiable facts where the model might hallucinate; include questions where the correct answer is "this is uncertain" |
| **Incident response** (incident-responder) | Structured thinking, Root cause analysis, Actionability | Scenarios with multiple plausible causes; test whether the agent investigates systematically vs jumping to conclusions |

#### 6. Quality Filtering

A generated task passes quality control if ALL conditions are met:
1. **Discrimination test:** D = score_L - score_F >= 0.1 (it differentiates good from bad descriptions)
2. **Stability test:** Run the same task 3 times on the same model; variance < 0.3 points (it gives consistent results)
3. **Ground truth validation:** A human reviewer confirms all must_mention items are genuinely present in the code and all must_not items are genuinely false positives
4. **No ceiling/floor:** Score_L < 4.8 (not too easy) and score_F > 2.0 (not incomprehensible)
5. **Cross-agent specificity:** The task should be solvable primarily by the target agent type. If a code-reviewer task is equally well-handled by security-reviewer instructions, it tests generic capability, not agent-specific knowledge

---

### Problem B: Cross-Model Prompt Transfer (Sonnet -> GLM 4.7)

#### 1. The Transfer Problem

Identical .md files produce 0.69 quality gap between Sonnet (4.51) and GLM 4.7 (3.82). This is not a generic capability gap -- it's model-specific interaction with our prompt format:

- v1 (verbose, 106 lines): #2 on Sonnet, drops to #4 on GLM 4.7
- v4/v5 (compact, 71 lines): #5 on Sonnet, rises to #3 on GLM 4.7
- L (agent-creator r1): #1 on both -- the most transfer-robust version

GLM 4.7's failure modes are specific and documented:
- Verbosity breeds errors: 2-4x more output, but must_not violations that Sonnet avoids
- False positives on parameterized SQL (code-reviewer)
- Incorrect HTTPS claims when code uses HTTPS (security-reviewer)
- Suggests removing -mod=readonly from CI (go-build-resolver)
- Fabricated investigation narratives (incident-responder)
- Efficiency collapses: 3-5 "solutions" per task where 1-2 suffice

Five agents show >1.0 point gap (dotnet-framework-pro, full-stack-developer, go-build-resolver, research-analyst, websocket-engineer). Three are nearly model-robust (<0.3 gap: incident-responder, java-pro, documentation-pro).

#### 2. Approach: Model-Specific Prompt Variants

Use APO to optimize separate agent descriptions for GLM 4.7, with text gradients derived from GLM 4.7's specific failures.

**Protocol:**
1. Start from the L version (best on both models)
2. Run GLM 4.7 on train tasks, collect failures (must_not violations, missing must_mention)
3. Generate text gradients: "GLM 4.7 flagged parameterized SQL as injection. Add explicit instruction: 'Parameterized queries using $1/$2 or ? placeholders are SAFE. Only flag string concatenation in SQL.'"
4. Apply gradients via Opus, generating 3-5 variant descriptions
5. Evaluate variants on GLM 4.7 using TRIPLE-SH for budget-efficient selection
6. Iterate until convergence or budget exhaustion

**Expected outcome:** Close 30-50% of the gap on high-sensitivity agents (the five with >1.0 delta), with targeted instructions that counteract GLM 4.7's verbosity and false-positive tendencies.

**Risk:** Over-fitting to GLM 4.7 may degrade Sonnet performance. Mitigation: evaluate all variants on BOTH models; reject any variant that regresses Sonnet by >0.1.

#### 3. Approach: Prompt Translation (PromptBridge-inspired)

Use Opus as a meta-optimizer that reads the Sonnet-optimal prompt and rewrites it for GLM 4.7, informed by GLM 4.7's documented failure patterns.

**Protocol:**
1. Provide Opus with: (a) the current agent description, (b) GLM 4.7's failure analysis (specific must_not violations, verbosity patterns), (c) the empirical finding that compact descriptions work better on GLM 4.7
2. Opus generates a GLM 4.7-specific variant with explicit verbosity controls: "Provide ONE solution per task. Maximum 3000 words. Do not speculate on issues you cannot confirm from the code."
3. Evaluate on GLM 4.7

**Key insight from PromptBridge:** The mapping from Sonnet-optimal to GLM 4.7-optimal prompts can be learned from calibration data. We already HAVE this data: 5 agent versions x 12 agents x 2 models = 120 data points showing how the same prompt performs across models. We can extract systematic patterns (e.g., "verbose instructions help Sonnet but hurt GLM 4.7" -> "compress all instructions for GLM 4.7 variant").

#### 4. Approach: Iterative Refinement with Feedback

APO-style optimization with GLM 4.7 as the target model and Sonnet outputs as reference:

**Protocol:**
1. Run both Sonnet and GLM 4.7 on the same task with the same agent description
2. Compare outputs: identify where GLM 4.7 diverges from Sonnet (extra false positives, missing key findings, verbosity)
3. Generate "contrastive gradient": "GLM 4.7 produced 5 solutions and included false SQL injection finding. Sonnet produced 1 focused solution without the false positive. The description should add: 'Provide exactly ONE recommended approach. Additional alternatives only if the primary approach has clear limitations.'"
4. Apply gradient, evaluate, iterate

**Advantage:** Uses Sonnet outputs as soft gold standard without requiring manually labeled ground truth. The comparison is automated.

**Risk:** Sonnet's output style may not be optimal for GLM 4.7 -- we might be optimizing GLM 4.7 to imitate Sonnet rather than to be its best self.

#### 5. Budget Considerations

TRIPLE's BAI framework is directly applicable. Our budget constraints:

| Resource | Cost per eval | Budget per agent |
|----------|---------------|------------------|
| GLM 4.7 run (5 tasks) | ~$1-2 | ~$20-40 (10-20 evals) |
| Sonnet run (5 tasks) | ~$2-4 | ~$20-40 (5-10 evals) |
| Opus meta-optimization call | ~$5-10 | ~$50 (5-10 gradient steps) |
| Total per agent | | ~$90-130 |
| Total for 5 high-sensitivity agents | | ~$450-650 |

**Budget allocation strategy (TRIPLE-SH):**
1. Generate 8-10 GLM 4.7-specific description variants per agent
2. Round 1: Evaluate all 10 on 2 tasks each (20 evals). Eliminate bottom 5
3. Round 2: Evaluate remaining 5 on 3 tasks each (15 evals). Eliminate bottom 3
4. Round 3: Evaluate remaining 2 on all 5 tasks (10 evals). Select winner
5. Total: 45 evals per agent (~$45-90), well within budget

#### 6. Our Unique Advantage: Three-Model Setup

Most papers assume a single model or source-target pair. We have three models in a hierarchy:

- **Opus (4.6):** Meta-optimizer. Reads failure analyses, generates gradients, produces prompt variants. Never evaluated as a task executor
- **Sonnet:** Gold-standard executor. Produces the outputs we want GLM 4.7 to match. Used to generate reference outputs and validate that prompt changes don't regress
- **GLM 4.7:** Target model to optimize for. Cheaper, used as GLM agent executor. The model whose performance we're trying to improve

This enables a workflow no single paper covers:
1. **Opus analyzes** GLM 4.7's failures relative to Sonnet's successes on the same task
2. **Opus generates** targeted prompt edits based on the analysis
3. **GLM 4.7 executes** the edited prompt on eval tasks
4. **Sonnet validates** that the edited prompt still works well (no regression)
5. **Opus synthesizes** results and generates the next round of edits

This is APO's gradient descent, but with Opus as the gradient computer, Sonnet as the validation oracle, and GLM 4.7 as the training target. No existing paper uses this three-model setup.

#### 7. What We Already Know

Our empirical findings constrain the search space, making optimization more efficient:

**Known GLM 4.7 failure modes (from execution-model-findings.md):**
- Verbosity without substance (2-4x output, same must_mention coverage)
- SQL injection false positives on parameterized queries
- Incorrect HTTPS claims
- Suggests removing -mod=readonly from CI
- Fabricated investigation narratives
- Efficiency collapse: 3-5 solutions per task

**Known prompt design principles (from agent-description-guide.md):**
- Domain checklists are the highest-value content (+0.47 on code-reviewer)
- Anti-patterns and false positive lists are precision boosters
- Rigid templates kill quality (v2 failure)
- Workflow instructions are attention tax
- 150-line ceiling, 40-line floor
- More lines != better (v5 at 93 lines < v4 at 71 lines)

**Known cross-model patterns (from scoreboard.md):**
- Compact descriptions (v4/v5) do relatively better on GLM 4.7
- L (agent-creator r1) is most robust across models
- Verbose v1 helps Sonnet but may confuse GLM 4.7

**Search space constraints for GLM 4.7 optimization:**
- Add explicit output length/count constraints ("ONE solution, under 3000 words")
- Add specific false-positive prevention rules (parameterized SQL, HTTPS, -mod=readonly)
- Keep descriptions compact (60-80 lines, not 100+)
- DO NOT add thoroughness instructions (they amplify verbosity)
- DO NOT add rigid templates (they consume even more of GLM 4.7's limited precision budget)

---

### Problem C: Failure Extraction and Bad Experience Collection

When a user observes an agent/skill producing incorrect or incomplete output, we need a lightweight way to:
1. Extract the **minimal failing example** from the task
2. Store it in a **bad experience collection**
3. Use the collection to improve prompts later — either manually or via APO

This is the feedback flywheel that connects human observation to systematic optimization.

#### The Failure Record Format

Each failure record captures the minimum needed to reproduce and learn from the problem:

```yaml
- id: fail-{agent}-{N}
  agent: code-reviewer
  model: sonnet  # or glm4.7
  agent_version: v4
  input_snippet: |
    # The minimal code/prompt that triggered the failure
    func DeleteUser(w http.ResponseWriter, r *http.Request) {
        id := r.URL.Query().Get("id")
        _, err := db.Exec("DELETE FROM users WHERE id = ?", id)
        ...
  expected: "Should NOT flag SQL injection — query IS parameterized"
  actual: "Flagged SQL injection as CRITICAL"
  failure_type: false_positive  # false_positive | missed_finding | wrong_severity | wrong_advice | hallucination
  root_cause: "Agent lacks explicit 'parameterized queries are safe' rule"
  fix_hint: "Add to false-positive list: parameterized SQL (?, $1, :param) is safe"
```

Key design choices:
- **input_snippet** is minimal — just the code/prompt that fails, not the whole task. This makes it reusable as a regression test and as an APO training example.
- **failure_type** is categorical — enables filtering and prioritization (false_positives are precision failures, missed_findings are recall failures).
- **fix_hint** is optional but valuable — when the human knows what's wrong, capture it. This becomes the "text gradient" in APO terms.

#### Collection Workflow

1. **During work:** User notices agent output is wrong. Types `/collect-failure` (or the agent-creator plugin detects a correction).
2. **Extraction:** Opus reads the conversation, identifies the minimal failing input, the expected behavior, and what went wrong. Proposes a failure record.
3. **User confirms** or edits the record. Stored in `bench/failures/{agent}.yaml`.
4. **Accumulation:** Over time, each agent builds a collection of known failure cases.

#### How Failures Feed Into Optimization

The failure collection serves three purposes:

**1. Regression test suite.** Every failure becomes a test case. Before shipping a prompt change, run all collected failures and verify none regress. This is the "do no harm" check our agent-creator audit was missing.

**2. APO training signal.** In APO's gradient descent framework, each failure record is a training example with a known correct answer. The "text gradient" from Opus can reference specific failures: "The prompt caused a false positive on parameterized SQL in fail-cr-007. Add an explicit rule."

**3. Task generation seeds.** Failures reveal what the current task set doesn't test. A failure on "parameterized SQL false positive" means our cr-004 task caught it but the agent still fails in production. The failure record becomes a seed for generating more tasks that probe the same weakness with variations.

#### Connecting to APO/TRIPLE

The failure collection maps directly onto the optimization pipeline:

| APO concept | Failure collection equivalent |
|-------------|------------------------------|
| Training examples | Failure records (input → expected output) |
| Loss function | Does the optimized prompt still produce the failure? (binary) |
| Text gradient | fix_hint + root_cause → Opus generates prompt edit |
| Validation set | Accumulated failures that MUST pass (regression suite) |
| TRIPLE evaluation | Run candidate prompt on failure collection, count regressions |

The sample efficiency is excellent: each failure record is a highly discriminating test case (by definition — it caught a real problem). Ten targeted failure records may be more valuable than 50 synthetic tasks for optimization.

#### Relation to PROMST and Self-Instruct

PROMST (Prompt Optimization via Multi-Stage Transformation) uses error analysis to guide prompt refinement — essentially what we're proposing, but automated. Our advantage: the human identifies the failure, which is higher-signal than automated error detection on synthetic tasks.

Self-Instruct can extend the collection: given 10 human-identified failures, generate 50 variations that test the same failure class ("parameterized SQL with different placeholder styles: ?, $1, :param, @param").

---

### Concrete Next Steps

#### Step 1: Build the Task Generation Pipeline
**What:** Implement the synthetic task generation pipeline (Phase 1-4 from Problem A). Generate 15 train + 10 val tasks per agent for the 5 high-sensitivity agents (dotnet-framework-pro, full-stack-developer, go-build-resolver, research-analyst, websocket-engineer). Total: 125 tasks.

**Paper approach:** Self-Instruct for bootstrapping from our 25 seed tasks (5 existing tasks for these 5 agents), Evol-Instruct for difficulty calibration.

**Expected sample efficiency:** ~50-100 Opus calls for generation, ~250 Sonnet+bare evaluation runs for calibration. Total cost: ~$200-400.

**Expected impact:** Unlocks all subsequent optimization steps. Without a robust task set, we can't distinguish real improvements from noise.

#### Step 2: Validate Task Quality with Existing Agent Versions
**What:** Run all 5 existing agent conditions (F, D, I, L, O) on the generated task sets for the 5 target agents. Verify that the generated tasks reproduce the known ranking (L > D ~ O > F > I on Sonnet, L > O > I > D > F on GLM 4.7). Discard tasks that don't discriminate.

**Paper approach:** Standard validation. No paper needed -- this is empirical quality control.

**Expected sample efficiency:** 50 evaluation runs (5 agents x 5 conditions x 2 models). Total cost: ~$100-200.

**Expected impact:** Establishes that our generated tasks are measuring the same thing as our hand-crafted tasks. Confidence check before investing in optimization.

#### Step 3: APO-TRIPLE Optimization for GLM 4.7
**What:** For each of the 5 high-sensitivity agents, run APO (text gradient) + TRIPLE-SH (budget-efficient selection) to find GLM 4.7-optimized descriptions. Use Opus as the gradient generator, Sonnet as the validation check, GLM 4.7 as the target.

**Paper approach:** APO for gradient computation, TRIPLE-SH for candidate selection. PO2G's dual-gradient for agents with both precision and recall requirements (code-reviewer, security-reviewer).

**Expected sample efficiency:** Per agent: ~5 gradient iterations x 5-10 candidates x 3-5 eval runs = 75-250 GLM 4.7 evaluations. With TRIPLE-SH: ~45 evaluations. Total across 5 agents: ~225-1250 evals. Cost: ~$225-625.

**Expected impact:** Close 30-50% of the 0.69-point Sonnet-GLM 4.7 gap on the 5 high-sensitivity agents. Concrete target: move GLM 4.7 grand mean from 3.82 to 4.0+ on these agents.

#### Step 4: PromptBridge-style Cross-Model Mapping
**What:** Using the L, D, I, O, F evaluation data across both models, learn systematic transformation rules (e.g., "compress instructions by 30%", "add explicit output length constraints"). Apply these rules to generate GLM 4.7-specific variants for all 12 agents, not just the 5 high-sensitivity ones.

**Paper approach:** PromptBridge's calibration-based mapping, adapted from model pairs to our 3-model setup.

**Expected sample efficiency:** No additional training data needed (use existing eval_ab12345 data). ~12 Opus calls to generate mappings, ~60 evaluation runs to validate (12 agents x 5 tasks).

**Expected impact:** Moderate improvement (15-25% gap closure) across all 12 agents, including the 7 not targeted by Step 3. This is the "broad but shallow" complement to Step 3's "narrow but deep" optimization.

#### Step 5: Build the Optimization Harness
**What:** Implement the APO-TRIPLE loop as a reusable tool. Inputs: an agent .md file, a task set, a target model. Outputs: an optimized .md file with eval scores. This makes future optimization incremental rather than one-off.

**Paper approach:** promptolution framework's modular design (but much simpler -- we only need APO + TRIPLE-SH, not the full zoo of optimizers).

**Expected sample efficiency:** Engineering effort, not eval cost. ~2-3 days of implementation.

**Expected impact:** Makes agent description optimization a push-button operation. When we add new agents or update existing ones, we can automatically optimize for both Sonnet and GLM 4.7.

#### Step 6: Iterative Task Set Improvement
**What:** After Step 3-4, analyze which tasks were most/least discriminating. Regenerate weak tasks using Evol-Instruct's difficulty operators. Add tasks that specifically test the failure modes discovered during optimization.

**Paper approach:** Evol-Instruct for difficulty evolution, DyVal for controllable difficulty parameters.

**Expected sample efficiency:** ~30-50 Opus calls for regeneration, ~100 evaluation runs for recalibration.

**Expected impact:** Improves the eval harness itself, making future optimization rounds more efficient. Expected to improve task discrimination by 20-30%.

#### Step 7: Per-Agent Optimization for Sonnet (Low-Hanging Fruit)
**What:** Apply the same APO-TRIPLE pipeline to optimize agent descriptions for Sonnet, targeting the 3 weakest agents on Sonnet: fastapi-pro (3.93 grand mean), tdd-guide (4.00), code-reviewer (4.02). These have the most room for improvement.

**Paper approach:** APO with Sonnet-specific gradients. Focus on must_mention recall (these agents miss items) rather than must_not precision (which is already good on Sonnet).

**Expected sample efficiency:** Same as Step 3: ~45-250 evals per agent. Cost: ~$150-500 total.

**Expected impact:** +0.1-0.3 on the 3 weakest Sonnet agents. More modest than the GLM 4.7 improvements because Sonnet is already strong, but still worthwhile given these agents trail the best (incident-responder at 4.77) by 0.75+ points.

---

#### Step 0: Build the Failure Collection System
**What:** Create `bench/failures/` directory with per-agent YAML files. Build a `/collect-failure` command for the agent-creator plugin that extracts minimal failing examples from the current conversation. Implement a regression runner that tests all collected failures against a candidate prompt.

**Paper approach:** APO's training set concept, but human-curated instead of synthetically generated. Each failure = one training example with known correct answer.

**Expected sample efficiency:** Near-zero cost — failures are collected during normal use, not generated. The regression runner costs ~$1-2 per agent per run (5-20 failure cases × 1 eval each).

**Expected impact:** Highest ROI of any step. Solves the "do no harm" problem that killed the agent-creator iteration loop (rounds 2-4 regressed because there was no regression check). Also provides the highest-signal training data for APO — each record represents a real failure, not a synthetic scenario.

### Priority Order

| Priority | Step | Cost | Expected Impact | Dependencies |
|----------|------|------|-----------------|--------------|
| **0** | **Failure Collection System** | **~$0 (collected during use)** | **Highest ROI — regression tests + APO training data** | **None** |
| 1 | Task Generation Pipeline | $200-400 | Enables everything | None |
| 2 | Task Validation | $100-200 | Confidence check | Step 1 |
| 3 | GLM 4.7 Optimization (5 agents) | $225-625 | +0.2-0.35 on GLM 4.7 | Steps 1-2 |
| 4 | Cross-Model Mapping (12 agents) | $60-120 | +0.1-0.15 on GLM 4.7 | Existing data |
| 5 | Optimization Harness | Engineering only | Reusable infrastructure | Steps 1-3 |
| 6 | Task Set Improvement | $50-100 | Better discrimination | Steps 1-3 |
| 7 | Sonnet Optimization (3 agents) | $150-500 | +0.1-0.3 on Sonnet | Steps 1-2, 5 |

**Total estimated budget:** $785-1945 in LLM API costs.
**Total expected impact:** GLM 4.7 mean from 3.82 to ~4.1-4.2 on high-sensitivity agents. Sonnet mean from 4.51 to ~4.55-4.60 on weak agents.
