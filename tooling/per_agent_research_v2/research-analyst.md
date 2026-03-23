# Research Agent Chokepoints — Why Prompt Engineering Doesn't Help

Date: 2026-03-23

## The answer

Our research-analyst scores identically with or without instructions because **the bottleneck is not the prompt — it's the absence of tools.**

"The model is almost commoditized. The bottleneck is context." — Douwe Kiela, CEO Contextual AI

## Chokepoint hierarchy (in order of impact)

### 1. No live information access (PRIMARY)
- Without web search, the agent works from stale training data
- Every successful research tool (Perplexity, Elicit, Deep Research) is model + retrieval
- The retrieval is the differentiator, not the model

### 2. Citation hallucination
- Claude scores 82/100 on research quality but only 18/25 on citation accuracy
- It fabricates references — this is why academic tools (Elicit, Consensus) exist
- They retrieve from actual paper databases rather than generating from memory

### 3. Single-pass vs iterative research
- Real research requires: search → read → refine query → search again → cross-reference
- Databricks KARL needed up to 200 sequential queries for enterprise tasks
- Standard RAG breaks on ambiguous multi-step queries

### 4. Context window exhaustion
- Deep research spanning many documents exhausts even 1M token windows
- Learned context compression improved accuracy from 39% to 57% (Databricks)

### 5. No persistent memory across sessions
- Research projects span days/weeks, each session starts from zero

## What would make research-analyst great

1. **Web search MCP** (Brave, Tavily, Perplexity Sonar) — the single biggest upgrade
2. **Academic APIs** (Semantic Scholar 200M+ papers, PubMed, arXiv, OpenAlex)
3. **Multi-step iterative retrieval** — break question into sub-queries, search each, refine
4. **PDF ingestion** — read actual papers, not summaries
5. **Source verification** — check if cited papers actually exist before including them
6. **Persistent knowledge base** — accumulate findings across queries (NotebookLM pattern)

## Implication for our agent design

Prompt engineering for research-analyst is a dead end. The model's analytical capability is already at ceiling. The gap is:
- We have web_search.sh tool — but the agent instructions don't emphasize using it
- We have no academic database integration
- We have no iterative search workflow
- We have no citation verification

**The v5 research-analyst should be a TOOL-USE agent, not a KNOWLEDGE agent.**
Instead of telling it what to think, tell it what tools to use and when.

## Claude Code is not just for coding

Non-coding use cases are mainstream: knowledge management, file organization, data processing, document analysis, business operations, writing, marketing, research. Anthropic launched Claude Cowork specifically for this. 85% of enterprises use AI research agents.
