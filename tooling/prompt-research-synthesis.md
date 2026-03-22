# Prompt Design Research Synthesis: Agent Instructions for Claude Code on Sonnet

Date: 2026-03-23
Context: v1 (106 lines, loose) > v3 (71 lines, compact) > bare (no agent) > v2 (153 lines, rigid) on Sonnet 4.6

---

## 1. Longer/more rigid = worse? YES, confirmed

**Academic:**
- "Same Task, More Tokens" (arXiv 2402.14848): LLM reasoning degrades at just 3,000 input tokens of redundant content.
- "Verbosity != Veracity" (ICLR 2025): GPT-4 shows Verbosity Compensation 50.4% of the time. Performance gap between verbose and concise reaches 27.61%.

**Practitioner:**
- Buildcamp (2026): "Claude Code's system prompt already consumes ~50 instructions. ~100-150 instructions before quality starts degrading." Instruction-following degrades **uniformly** — Claude doesn't just ignore late instructions, it ignores ALL more frequently. Smaller models show **exponential decay**; larger thinking models show **linear decay**.
- TurboDocx (2026): "Absolute ceiling ~300 lines before Claude starts losing signal." Recommends <200 lines. Test: "If I remove this line, will Claude make mistakes? If no, cut it."
- Parsimony in Context Engineering (Rezvov, 2026): "Parsimonious instructions survive context compression better. This is the primary failure mode in multi-turn agent workflows."

**Our v2 (153 lines) pushed into the decay zone. v1 (106 lines) stayed safe. v3 (71 lines) is well within bounds.**

## 2. Anthropic's official guidance

- "If you want 'above and beyond' behavior, explicitly request it rather than relying on vague prompts."
- Claude generalizes from the WHY, not just the WHAT — provide motivation.
- **Critical for 4.6:** "Tune anti-laziness prompting. Claude 4.6 models are significantly more proactive and may overtrigger on instructions that were needed for previous models."
- Anthropic's own system prompts moved from vague ("be helpful") to ultra-specific testable rules ("use CommonMark", "never use emojis unless asked").

## 3. Right length / structure

- 100-150 instructions practical ceiling for Sonnet (Buildcamp)
- High-performing teams keep CLAUDE.md under 60 lines
- **Progressive disclosure**: root instructions minimal, detailed knowledge loads on demand
- Addy Osmani / ETH Zurich: Auto-generated context files degraded performance even when fresh. Problem is noise, not staleness. "Every line in AGENTS.md competes with what you actually asked the agent to do."

## 4. The core distinction: Knowledge vs Process

**This is the single most important finding.**

Instructions fall into two categories with opposite effects:

| Type | Effect | Example | Action |
|------|--------|---------|--------|
| **Domain knowledge** (checklists, anti-patterns, gotchas) | Adds capability — knowledge injection | "Check for N+1 queries in ORM calls" | KEEP — this is what the model needs |
| **Process instructions** (workflows, step-by-step) | Subtracts capability — attention tax | "Step 1: Read file. Step 2: Check X. Step 3: Write findings" | CUT — replace with outcome statement |
| **Output templates** (rigid format mandates) | Constrains expression | "Use this exact table format: \|...\|" | CUT — suggest structure, don't mandate |
| **Identity/role framing** | Sets behavior | "You are a security specialist" | KEEP — 1-2 lines max |

Process and template sections consumed v2's budget without adding domain knowledge. v1's checklists (React patterns, Node.js patterns) ARE domain knowledge — they help because Sonnet doesn't reliably recall all items without prompting.

## 5. Review vs Implementation agents

No external source directly addresses this, but our data + community patterns converge:

- **Implementation agents (60-80 lines):** Model knows how to code. Needs only: anti-patterns, safety guardrails, domain quirks. Let model handle workflow.
- **Review agents (100-120 lines):** Extra lines go to domain checklists ONLY. Checklists = knowledge injection improving recall. Anthropic's own safety/policy rules (analogous to review criteria) are detailed and explicit, while implementation guidance is brief.

Community evidence: "For complex workflows, give Claude a checklist to track" (dev.to/nunc). "Use checklists/scratchpads for multi-step audit tasks" (Builder.io).

## 6. Instruction following vs capability expression

The tradeoff is real:
- More prescriptive → more attention on compliance, less on task → shorter, constrained output
- Parsimony framework: "Instructions and output compete for the same cognitive resource"
- Buildcamp: rising instruction count → compliance drops uniformly → NEITHER good compliance NOR good capability
- Resolution: not "fewer instructions" but "better instructions" — replace process with outcomes, keep domain knowledge

## Actionable Rules for V4

1. **Split by task type.** Implementation: 60-80 lines. Review: 100-120 lines. Extra review budget = domain checklists ONLY.
2. **Three valid instruction types:** (a) domain knowledge model lacks, (b) constraint preventing known failure, (c) identity framing. Everything else is noise.
3. **Kill all workflow/process sections.** Replace with outcome statements. "Cover edge cases and non-obvious scenarios" > "Step 1: Check common. Step 2: Check edge. Step 3: Check non-obvious."
4. **Directive, imperative language.** "Check for X" not "You should consider checking for X." Shorter survives compression better.
5. **Explain WHY for non-obvious constraints.** Claude generalizes from explanations.
6. **No rigid output templates.** Suggest, don't mandate. "Present findings with severity and location" not "| Severity | File | Line |".
7. **Domain checklists ARE the product for review agents.** React patterns, security anti-patterns, performance gotchas — knowledge Sonnet doesn't reliably produce unprompted. KEEP.
8. **Test on Sonnet.** Opus ceiling effect makes instruction design invisible.
9. **research-analyst: near-bare.** Only anti-hallucination rules + source evaluation. Bare model ties v1.
10. **Dial back "be thorough" for 4.6.** Anthropic says 4.6 is already proactive — explicit thoroughness can create compliance conflict.

## Sources

- "Same Task, More Tokens" (arXiv 2402.14848)
- "Verbosity != Veracity" (OpenReview, ICLR 2025)
- Parsimony in Context Engineering (Rezvov, dev.to, 2026-03-22)
- Addy Osmani, "Stop Using /init for AGENTS.md" (Medium, 2026-03-19)
- Buildcamp, "The Ultimate Guide to CLAUDE.md in 2026" (buildcamp.io, 2026-02)
- TurboDocx, "How to Write a CLAUDE.md That Actually Works" (turbodocx.com, 2026-03)
- Anthropic prompting docs (platform.claude.com)
- Builder.io, "50 Claude Code Tips" (2026-03-20)
