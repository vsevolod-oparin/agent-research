# Agent Evaluation Framework

How to measure: agent vs no-agent, and agent v1 vs agent v2.

---

## The Core Problem

An agent is a prompt. A prompt either improves the LLM's output or it doesn't. We need to measure:

| Comparison | Question |
|------------|----------|
| Agent vs bare LLM | Does the agent prompt add value over just asking the model directly? |
| Agent v1 vs v2 | Did our rewrite actually make it better? |
| Agent A vs Agent B | Which agent handles this task type better? |

---

## Method: Paired Evaluation on Fixed Tasks

### 1. Build a Task Bank

Create 5-10 standardized tasks per agent type. Each task has:

```yaml
task_id: opp-003
agent_type: bottleneck-detector
input: "Analyze the ML inference optimization field. Identify the top 3 chokepoints."
context_files: []  # any files to provide
ground_truth:      # what a good answer should cover
  must_mention:
    - memory bandwidth
    - quantization-accuracy tradeoff
    - deployment complexity on edge devices
  must_not:
    - hallucinated papers
    - vague generalities without specifics
  structure:
    - ranked list with reasoning
    - evidence citations
```

Key: tasks must be specific enough that you can judge quality, but open enough that there's no single correct answer.

### 2. Run Paired Comparisons

For each task, generate output under 3 conditions:

| Condition | How |
|-----------|-----|
| **Bare** | Send the task to the model with no agent prompt |
| **Agent v1** | Send with current agent .md prepended |
| **Agent v2** | Send with revised agent .md prepended |

Use identical model, temperature, and context. Save all outputs.

### 3. Score on 6 Dimensions

Each dimension scored 1-5. Judge can be human, LLM-as-judge, or both.

| Dimension | What it measures | 1 (worst) | 5 (best) |
|-----------|-----------------|-----------|----------|
| **Completeness** | Did it cover what matters? | Missed most key points | Hit all must-mention items and found extras |
| **Precision** | Are claims actually true? | Multiple false/hallucinated claims | Every claim verifiable, no fabrication |
| **Actionability** | Can you act on the output? | Vague platitudes ("more research needed") | Specific next steps with clear reasoning |
| **Structure** | Is output organized and parseable? | Wall of text, no headings | Clean format, tables, downstream-ready |
| **Efficiency** | Signal-to-noise ratio | Buried insights in filler text | Dense, every sentence adds value |
| **Depth** | Does it go beyond surface? | Wikipedia-level summary | Non-obvious insights, traced reasoning |

**Composite score** = weighted average. Default weights: Precision 2x, Completeness 1.5x, rest 1x. Adjust per agent type (e.g., Contrarian Challenger weights Depth 2x).

---

## Practical Scoring Methods

### Option A: LLM-as-Judge (fast, scalable)

Use a separate LLM call to evaluate. Provide:
- The original task
- The ground truth criteria
- The agent output (blinded — don't tell the judge which version it is)

Prompt the judge to score each dimension 1-5 with one-line justification.

**Bias mitigation:** Randomize output order. Run judge twice and average. Use a different model family as judge if possible.

```
You are evaluating a research output. Score each dimension 1-5.

TASK: {task description}
EXPECTED: {ground truth criteria}
OUTPUT TO EVALUATE:
{agent output}

Score (1-5) with one-line justification:
- Completeness:
- Precision:
- Actionability:
- Structure:
- Efficiency:
- Depth:
```

### Option B: Human Spot-Check (slow, gold standard)

For critical evaluations or calibrating the LLM judge:
- Human reads output, scores same 6 dimensions
- Focus on Precision (are claims real?) — the dimension LLM judges are worst at
- 3-5 spot-checks per agent version is enough to calibrate

### Option C: Automated Checks (fast, narrow)

Some dimensions can be partially automated:

| Check | Method |
|-------|--------|
| Structure | Does output match expected format? (regex/parse) |
| Hallucination | Are cited sources real? (web fetch to verify) |
| Coverage | Do must-mention items appear? (keyword search) |
| Length efficiency | tokens_of_useful_content / total_tokens |
| Self-contradiction | Does any claim contradict another? (LLM check) |

---

## The Evaluation Protocol

### For "Does this agent help at all?"

```
1. Pick 5 tasks from the task bank
2. Run each task: bare vs agent (10 outputs total)
3. Score all 10 outputs (blinded, randomized)
4. Compare: mean(agent_scores) - mean(bare_scores) = LIFT
5. If LIFT < 0.5 on composite: agent isn't helping
   If LIFT 0.5-1.0: marginal improvement
   If LIFT > 1.0: agent adds clear value
```

### For "Is v2 better than v1?"

```
1. Pick same 5 tasks
2. Run each: v1 vs v2 (10 outputs total)
3. Score all 10 (blinded)
4. Compare per-dimension: where did v2 improve? regress?
5. Check: did structural changes (workflow, checklists) improve Structure/Completeness?
         did anti-patterns improve Precision?
         did decision criteria improve Actionability?
```

### For "Which agent type for this task?"

```
1. Define task
2. Run with 2-3 candidate agents
3. Score all outputs
4. Pick winner per dimension, overall winner by composite
```

---

## What to Track Over Time

```
tooling/eval/
├── task_bank/
│   ├── bottleneck-detector-tasks.yaml
│   ├── attention-auditor-tasks.yaml
│   └── ...
├── runs/
│   ├── 2026-03-22-bottleneck-v1-vs-bare.md
│   └── ...
└── scoreboard.md    # running table of agent scores
```

Scoreboard format:

| Agent | Version | Comp | Prec | Action | Struct | Effic | Depth | Composite | vs Bare |
|-------|---------|------|------|--------|--------|-------|-------|-----------|---------|
| bottleneck-detector | v1 | 3.2 | 4.0 | 2.8 | 3.5 | 3.0 | 3.8 | 3.4 | +0.9 |
| bottleneck-detector | v2 | 4.0 | 4.2 | 3.5 | 4.5 | 3.8 | 4.0 | 4.0 | +1.5 |

---

## Rules of Thumb

1. **An agent that scores < bare model on any dimension is broken.** The agent prompt is actively hurting. Fix or remove.

2. **Precision is the hardest to improve.** Adding checklists and anti-patterns helps. Adding "be thorough" doesn't.

3. **Structure is the easiest to improve.** Just specify the output format. Instant lift.

4. **Depth and Actionability separate good from great.** These improve when agents have domain checklists and decision criteria — the agent knows what to *look for*, not just what to *say*.

5. **Diminishing returns kick in around score 4.** Going from 2→4 is prompt engineering. Going from 4→5 usually requires better task decomposition or tool access, not better prompts.

6. **5 tasks is the minimum for signal.** Below that, variance dominates. 10 is better if you can afford it.

7. **Re-evaluate after model upgrades.** An agent optimized for Sonnet 3.5 may not be optimal for Sonnet 4. The "agent vs bare" lift can change.
