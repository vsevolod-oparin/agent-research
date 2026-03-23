# documentation-pro: Deep Research Report (v2)

## Eval Summary
- v3/v4 score: 4.82 (best across all agents and conditions)
- Bare model: 4.23
- Agent uplift: +0.59 (highest lift for any non-fastapi agent)
- Position: ceiling-adjacent. Goal is to defend and find any remaining edge.

---

## 1. Landscape

### Documentation Tooling (2025-2026)

The docs-as-code ecosystem has consolidated around a few dominant approaches:

**Platform tier (hosted, AI-native):**
- **Mintlify**: Emerged as the developer-docs leader. Git-based, auto-generates llms.txt and llms-full.txt, auto-generates MCP servers for docs, AI-powered search, agent-driven quality suggestions that surface gaps and inconsistencies. Used by Anthropic, Cursor, Zapier. Key differentiator: treats docs as an AI interface, not just a human one. (Source: mintlify.com/blog/mintlify-vs-readme-2025)
- **ReadMe**: Stronger for non-technical contributors. WYSIWYG editing, staging environments, better collaboration features. Weaker on AI readiness and developer workflows. (Source: franceselliott.com/2024/08/21/mintlify-vs-readme)
- **GitBook**: Cloud-based, real-time collaboration, GitHub/GitLab integration. Good for team wikis but less developer-focused than Mintlify.

**Generator tier (self-hosted, flexible):**
- **Docusaurus** (Meta): React + MDX, versioning, localization. Standard for open-source project docs.
- **MkDocs Material**: Python ecosystem favorite. Clean UX with minimal config.
- **Hugo**: Fastest build times. Strong llms.txt integration via custom output formats.
- **Sphinx**: Powerful for complex cross-references and multi-format output. Python-native.
- **AsciiDoc/Asciidoctor**: Solves Markdown's key limitations (file includes for tested code snippets, admonitions, complex tables, collapsible sections). Better for books and workshops. (Source: dev.to/nfrankel/asciidoc-over-markdown)

**AI-powered code documentation:**
- **Swimm**: Auto-generates and synchronizes docs with code changes in real-time. Best for codebase-level docs.
- **GitHub Copilot**: Inline docstring/comment suggestions during coding. Not a docs platform.
- **Mutable.ai**: Generates explanations of complex algorithms and data structures.
- **Databricks' approach**: Fine-tuned a bespoke 7B model for table documentation. Better, faster, 10x cheaper than general LLMs. 80%+ of their table metadata updates are now AI-assisted. Key insight: task-specific fine-tuning dramatically outperforms general models. (Source: databricks.com/blog/creating-bespoke-llm-ai-generated-documentation)

### Emerging Standards

**llms.txt** (proposed Sept 2024 by Jeremy Howard, Answer.AI):
- Markdown file at site root (`/llms.txt`) that indexes site content for LLM consumption. H1 = site name, summary, H2 sections with links. Companion `llms-full.txt` contains all content inline.
- 844k+ websites adopted. Anthropic, Stripe, Vercel, Cloudflare have it.
- Mintlify auto-generates both files. Hugo supports it via custom output formats.
- Not an RFC -- community convention. But increasingly expected by AI agents.
(Source: llmstxt.org, dev.to/masutaka, dev.to/devjaime)

**Schema markup for AI consumption:**
- Semrush tested GPT-4 processing content with vs without Schema markup: accuracy jumped from 16% to 54%. FAQ schema, How-To schema, and Article schema are the most impactful for documentation.
- Digidop analyzed 1,000 pages frequently cited by AI: universal patterns were short paragraphs (avg 3 sentences), heavy use of lists, explicit question-answer formats.
(Source: dev.to/geobuddy/llmstxt-schema-markup-and-technical-geo)

**Dual-audience documentation:** Docs now serve humans AND AI agents simultaneously. This is not optional -- it is becoming a competitive differentiator. Mintlify explicitly markets this ("Documentation is your AI interface"). MCP servers let AI agents interact directly with product APIs through docs.

### Industry Shift

- Technical writers evolving to "Knowledge Conductors" / "AI Content Architects" -- less writing, more information architecture.
- GEO (Generative Engine Optimization) emerging alongside SEO -- docs must be discoverable by AI, not just search engines.
- Stack Overflow traffic collapsed 78% in two years. 52% of ChatGPT answers to SO questions are incorrect. The knowledge commons is degrading. (Source: dev.to/dannwaneri/were-creating-a-knowledge-collapse)

---

## 2. Failure Modes

### AI-Generated Documentation Failures (ranked by frequency and severity)

**1. Confident wrongness (most dangerous):**
AI generates plausible but incorrect technical details -- wrong API signatures, fabricated parameters, outdated version info. The Undo.io analysis specifically identifies: nonexistent APIs (e.g., suggesting `Server::terminate_debuggee()` when no such method exists), hallucinated libraries (e.g., `<stringutils.h>`), and incorrect fixes that compile but hide bugs. (Source: undo.io/resources/detect-mitigate-ai-hallucination)

**2. Missing imports and incomplete code examples:**
The single most common complaint from developers consuming AI-generated docs. Code examples that look correct but fail because imports are missing, environment setup is assumed, or dependencies are unstated. This is the #1 RAG retrieval failure mode -- when LLMs retrieve a code snippet without its surrounding context, the snippet becomes unusable.

**3. Hallucinated cause-and-effect chains:**
Worse than API hallucination -- AI invents plausible execution paths without verification. "The function calls X which triggers Y which causes Z" when none of that actually happens. This is particularly dangerous in troubleshooting docs. (Source: undo.io)

**4. Stale examples referencing removed APIs:**
AI training data lags behind the current codebase. Generated examples may use deprecated methods, old parameter names, or removed endpoints. The agent already addresses this but the enforcement mechanism is weak.

**5. Generic explanations that miss product-specific distinctions:**
AI produces readable text but conflates similar concepts across different sub-products (e.g., confusing Prisma ORM vs Prisma Accelerate). Docs must segment clearly by sub-product with explicit scope declarations.

**6. The verification gap:**
AI cannot validate docs against actual product behavior. Steps that look correct may not actually work. Cursor's AI support bot hallucinated a company policy that didn't exist, telling users about a "one device per subscription" security feature that was fabricated. (Source: cnet.com)

**7. Knowledge commons decay loop:**
AI trains on public knowledge (SO, Wikipedia, docs) -> humans stop contributing -> AI trains on AI output -> quality degrades. Future AI-generated docs may be trained on previous AI-generated docs, compounding errors. (Source: dev.to/dannwaneri)

### Structural Failures

- Mixing doc types (tutorial + reference in one doc) confuses both humans and AI consumers
- JavaScript-only content invisible to AI agents
- Images without text alternatives rot and are invisible to AI
- PDFs/linked files rather than inline text -- hard for LLMs to parse

---

## 3. Best-in-Class Improvements

### What the current agent does well (keep)
- Diataxis framework classification (tutorial/how-to/reference/explanation)
- "Shortest path first" principle
- Verification-after-every-step ("you should see:")
- Anti-patterns list (philosophy before commands, undocumented prerequisites, stale examples)
- Code-over-prose rule
- API reference workflow (parameters table, status codes, curl examples)
- Quality rules (copy-paste ready, exact versions, no skipped steps)

### What would close the remaining gap

**A. Self-contained code examples (high impact):**
Every code example must include ALL imports, ALL setup, ALL environment context. The current agent says "copy-paste ready" but does not explicitly mandate import completeness. This is the single most cited failure in AI-consumed documentation. Add an explicit rule: "Every code block must be runnable in isolation. Include all imports, all variable declarations, all configuration. If a code block depends on prior blocks, state which ones and include a combined version."

**B. RAG/chunking optimization (high impact for AI consumption):**
Content should be self-contained at the section level. Each H2 section should be independently useful without needing surrounding context. This maps directly to how RAG systems chunk and retrieve documentation. Add: "Each section should answer its heading's implied question completely, without requiring the reader to have read previous sections."

**C. FAQ/Q&A format for troubleshooting (medium-high impact):**
kapa.ai's research shows technical FAQs formatted as Q&A are the most frequently used source in LLM responses. The current agent has troubleshooting entries (symptom/cause/fix) but should also promote Q&A format: "Q: Why does X fail? A: Because Y. Fix: Z." This format maps directly to how users query AI assistants.

**D. Explicit dual-audience awareness (medium impact):**
Add a principle: "Write for two readers: a human scanning for answers and an AI agent parsing for structured information. Use clear H2/H3 hierarchy, explicit definitions ('X is [definition]'), and self-contained sections that work when extracted in isolation."

**E. Verification protocol strengthening (medium impact):**
The current agent says "run every code example against the actual codebase" but this is aspirational -- the model may not always execute. Strengthen to: "After writing each code example, use Bash to execute it. If execution is not possible, explicitly mark the example as UNVERIFIED and state what would need to be true for it to work."

**F. Version and scope declarations (medium impact):**
Every doc should state at the top: what version of the software it covers, what sub-product it applies to, and when it was last verified. This prevents the Prisma problem (confusing similar sub-products) and the staleness problem.

---

## 4. Main Bottleneck

**The agent is already at 4.82 -- the remaining gap is small and structural, not instructional.**

The primary bottleneck is the **verification enforcement gap**: the agent instructs itself to verify examples but the model may not always do so. The instructions are correct but compliance is probabilistic.

Secondary bottleneck: **import/context completeness in code examples**. The agent says "copy-paste ready" but does not explicitly enumerate what that means (imports, env vars, directory context, prior state). Making this explicit would catch the single most common AI documentation failure mode.

Tertiary bottleneck: **AI-readability is not addressed at all**. The agent writes for humans only. Adding dual-audience awareness, self-contained sections, and structured metadata would make the docs significantly more useful in an AI-agent world without degrading human readability.

The agent is NOT bottlenecked on:
- Framework knowledge (Diataxis is well-implemented)
- Structure (the doc type classification and workflow are solid)
- Tone/style (anti-patterns list handles this well)

---

## 5. Winning Patterns

### Gold-standard documentation characteristics (from analysis of top-cited docs)

**Stripe docs** (industry benchmark):
- Every endpoint: one-sentence description, parameters table, request/response schemas, status codes, working curl with realistic data, error examples
- Code examples in 7+ languages with complete imports
- "Try it" interactive playground alongside static docs
- Clear versioning: every page states which API version it covers

**Cloudflare developer docs:**
- Full llms.txt and llms-full.txt at root
- Every page self-contained with all prerequisites inline
- Heavy use of tabs for language/platform variants (not inline conditionals)
- FAQ section at bottom of capability pages

**Temporal SDK docs:**
- Clear hierarchy that helps both humans and LLMs navigate
- Separate docs per sub-product so LLMs don't confuse similar offerings
- Replay tests within SDK docs for verification

**Common structural patterns in AI-cited docs** (from Digidop analysis of 1,000 pages):
- Short paragraphs (average 3 sentences)
- Heavy use of lists and tables
- Explicit "X is [definition]" patterns
- Question-answer format
- Specific numbers with attribution
- Clear H2/H3 hierarchy mapping to topic structure

**Databricks' insight on fine-tuned doc generation:**
- General LLMs produce acceptable-but-not-great documentation
- Task-specific fine-tuning (even on 3,600 examples) produces dramatically better results
- Human-in-the-loop acceptance/rejection improves quality over time
- 80%+ metadata updates are AI-assisted with human review

### Anti-patterns in failing documentation

- Wall of prose without code blocks (users scan for code first)
- Code examples that require mental assembly from multiple snippets
- "See also" links instead of inline answers
- Nested platform conditionals in main flow instead of tabs
- Screenshots without text alternatives (rot, invisible to AI)
- "Simply"/"Just"/"Obviously" hiding skipped steps

---

## 6. Specific Recommendations

### High-confidence additions (implement)

**1. Import completeness rule** -- add to Quality Rules:
```
- Every code example includes all imports, variable declarations, and setup.
  If it uses a function defined elsewhere in the doc, include that function
  or reference the specific section. No "assume you have X" -- show X.
```

**2. Self-contained sections rule** -- add to Key Principles:
```
5. **Self-contained sections.** Each H2 section answers its heading's implied
   question completely. A reader (or AI agent) extracting just that section
   gets a useful, standalone answer. Don't rely on "as mentioned above."
```

**3. Verification execution** -- strengthen existing principle 2:
```
2. **Verify everything.** After every significant step, show expected output
   ("you should see:"). Run every code example using Bash. If execution is not
   possible, mark the example with "<!-- UNVERIFIED -->" and state the
   conditions required for it to work.
```

**4. Q&A format for troubleshooting** -- add to Troubleshooting Entries:
```
Format troubleshooting as Q&A when possible: "Q: Why does [symptom]? A:
[cause]. Fix: [steps]." This format matches how users query AI assistants
and is the most frequently retrieved format in RAG systems.
```

### Medium-confidence additions (implement if space permits)

**5. Version and scope header** -- add to Getting Started Workflow:
```
Start every document with a scope block: software version, sub-product name,
last-verified date, and target audience (e.g., "Python SDK v3.2+, verified
2024-01-15, for developers integrating payment processing").
```

**6. Dual-audience note** -- add a sentence to the identity paragraph:
```
Structure content so it works both for humans scanning for answers and for AI
agents parsing for structured information: clear heading hierarchy, explicit
definitions, self-contained sections.
```

### Low-confidence / monitor only

**7. llms.txt awareness**: The agent writes documentation content, not site configuration. llms.txt is a platform concern (Mintlify auto-generates it). Not actionable for a writing agent unless the task is specifically about site structure.

**8. Schema markup**: Same reasoning -- this is a publishing-layer concern, not a content-writing concern. The agent should write content that is naturally structured (headings, lists, tables, definitions) which is what Schema markup formalizes anyway.

### What NOT to add

- **AI-specific formatting instructions** (special tokens, metadata blocks): These would confuse the agent and degrade human readability. The structural improvements (self-contained sections, Q&A format, import completeness) achieve AI-readability as a natural byproduct.
- **Tool-specific guidance** (Mintlify config, Docusaurus setup): The agent writes content, not platform config.
- **Lengthy explanations of why**: The agent is already well-calibrated on tone. Adding meta-instructions about writing philosophy would dilute the actionable rules.

---

## Sources

- Mintlify vs ReadMe 2025 comparison: mintlify.com/blog/mintlify-vs-readme-2025
- Mintlify vs ReadMe practitioner review: franceselliott.com/2024/08/21/mintlify-vs-readme
- AI documentation tools landscape: gitloop.com/post/ai-powered-codebase-documentation
- Databricks bespoke LLM for docs: databricks.com/blog/creating-bespoke-llm-ai-generated-documentation
- llms.txt specification: llmstxt.org, dev.to/masutaka, dev.to/devjaime
- Schema markup + GEO testing: dev.to/geobuddy/llmstxt-schema-markup-and-technical-geo
- AI hallucination in code docs: undo.io/resources/detect-mitigate-ai-hallucination
- Knowledge commons collapse: dev.to/dannwaneri/were-creating-a-knowledge-collapse
- AI hallucination rates and examples: cnet.com, datacamp.com/blog/ai-hallucination
- Documentation tools comparison (15 tools): dev.to/therealmrmumba
- AsciiDoc advantages over Markdown: dev.to/nfrankel/asciidoc-over-markdown
- Cursor AI support bot hallucination: theregister.com/2025/04/18/cursor_ai_support_bot_lies
