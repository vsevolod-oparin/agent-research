# documentation-pro: Per-Agent Research Report

## Eval Summary
- v3/v4 score: 4.82 (best across all agents)
- v1 score: 4.55
- Bare model: 4.23
- Agent instructions uplift: +0.59 over bare
- This is already the top-performing agent. Goal is to maintain/defend this position.

---

## 1. Competitive Landscape

**Tools & Platforms (2026):**
- **Mintlify**: Docs-as-code, git-based, developer-first. Auto-generates from codebase. Leading for API/SDK docs.
- **GitHub Copilot (docs mode)**: Auto-generates function comments, API docs, README drafts in-context while coding.
- **Notion AI**: Converts rough notes into structured product specs, SOPs, architecture docs.
- **Scribe**: Records workflows, generates step-by-step guides with annotated screenshots automatically.
- **Fireflies AI**: Meeting-to-docs pipeline (transcription, summaries, action items).
- **Dokly**: Auto-generates llms.txt, AI-optimized formatting, cheap docs hosting.
- **kapa.ai**: LLM-powered docs Q&A; their blog is the best source on optimizing docs for LLMs.

**Emerging Standards:**
- **llms.txt**: Machine-readable docs index for AI agents. 844k+ websites adopted. Anthropic, Stripe, Vercel, Cloudflare already have it.
- **MCP servers**: Connect AI models directly to product APIs for real-time doc updates. 75% of developers expected to use by 2026.
- **Diataxis framework**: Already in our agent. Industry standard for doc classification (tutorial/how-to/reference/explanation).

**Industry Trends:**
- Docs now serve two audiences: humans AND AI agents. AI-readiness of docs is becoming a competitive differentiator.
- Technical writers evolving to "Knowledge Conductors" / "AI Content Architects" -- less writing, more information architecture.
- EU AI Act (high-risk enforcement Aug 2026) creating massive new compliance documentation demand.
- GEO (Generative Engine Optimization) emerging alongside SEO -- docs must be discoverable by AI, not just search engines.

## 2. Known Failure Modes / Chokepoints

**AI-generated documentation failures:**
- **"Confident wrongness"**: AI generates plausible but incorrect technical details (wrong API signatures, fabricated parameters, outdated version info). 52% of ChatGPT answers to Stack Overflow questions are incorrect.
- **Stale examples**: Code referencing removed APIs or old versions. AI training data lags behind current codebase.
- **Missing verification**: AI cannot validate docs against actual product behavior. Steps may not actually work.
- **Hallucinated prerequisites**: Inventing dependencies or version requirements that don't exist.
- **Generic explanations**: AI produces readable text but misses key technical distinctions specific to the product.
- **Undocumented edge cases**: AI defaults to happy paths; troubleshooting docs require real-world failure knowledge.
- **Loss of knowledge commons**: As AI replaces Stack Overflow (78% traffic decline), the training data for future AI docs degrades.

**Structural failures:**
- Mixing doc types (tutorial + reference in one doc) confuses both humans and AI consumers.
- JavaScript-only content invisible to AI agents (can't execute JS).
- Docs stored in PDFs/linked files rather than inline text -- hard for LLMs to parse.
- Images without text alternatives rot and are invisible to AI.

## 3. What Would Make This Agent Best-in-Class

**Already strong (keep):**
- Diataxis framework for doc type classification
- "Shortest path first" principle
- Verification-after-every-step approach
- Anti-patterns list (philosophy before commands, undocumented prerequisites, etc.)
- Code-over-prose rule

**Additions to consider:**
- **AI-readiness section**: Guidance on making docs consumable by AI agents (structured headings, self-contained code snippets, llms.txt awareness, OpenAPI specs for APIs)
- **Audience-aware writing**: Explicit dual-audience thinking (humans + AI agents). Structured metadata, taxonomy tags, version tags.
- **Code example verification protocol**: Stronger emphasis on actually running examples against the codebase, not just writing plausible code.
- **Troubleshooting from real errors**: Match error messages exactly from the codebase (already mentioned but could be stronger -- cross-reference actual error strings).
- **FAQ patterns**: Technical FAQs formatted as Q&A are the most frequently used source in LLM responses (kapa.ai finding). Agent should prioritize this format for troubleshooting.
- **Import completeness**: Every code example must include all necessary imports (repeatedly cited as critical for LLM consumption).
- **Modular/chunkable content**: Content should be self-contained at the section level for RAG retrieval.

## 4. Main Bottleneck

**Prompt quality is the primary lever, and it's already well-tuned.** The +0.59 uplift over bare shows the instructions make a meaningful difference. The agent scores 4.82 -- already the ceiling-adjacent performer.

The remaining gap is likely:
- **Model capability**: The model's tendency to generate plausible-but-unverified examples. No prompt can fully fix hallucination.
- **Verification tooling**: The agent says "run every code example" but in practice the model may not always execute/verify. Stronger tool-use patterns (actually running code in Bash) could help.
- **Context window**: For large codebases, the agent may not have full context to write accurate docs. This is a tools limitation.

## 5. What Winning Setups Look Like

- **kapa.ai's approach**: Structured hierarchy, segmented by sub-product, troubleshooting FAQs, self-contained code snippets, community forum integration.
- **Stripe's docs**: Industry gold standard. Every endpoint has: description, parameters table, request/response schemas, status codes, working curl examples, error examples.
- **Mintlify model**: Docs live alongside code, git-versioned, auto-deploy on merge, clean developer-first reading experience.
- **OpenAI's pattern**: Technical FAQs at bottom of every capabilities page. Q&A format mirrors user questions.
- **Temporal's SDK docs**: Clear hierarchy that helps both humans and LLMs navigate (replay tests within Java SDK within specific feature area).
- **Prisma's segmentation**: Separate docs per sub-product (ORM vs Accelerate vs Pulse) so LLMs don't confuse similar offerings.

**Common thread**: Winning docs are structured for machines (metadata, hierarchy, self-contained sections) while remaining clear for humans. They verify everything against real product behavior. They treat docs as an engineering asset, not an afterthought.
