# incident-responder -- Research Report

**Eval scores:** 4.87 under D, H, I (all tied at ceiling). Agent is saturated on current tasks.

---

## 1. Competitive Landscape

**Commercial AI SRE/Incident Tools (2025-2026):**
- **PagerDuty SRE Agent** -- learns from incidents, surfaces context, recommends diagnostics, generates self-updating runbooks, memory system per-service. Early users report 50% faster resolution. Priced as add-on.
- **Rootly** -- AI-powered workflow builder, auto-classification/severity/routing from historical data, Slack-native, post-mortem generation. Leader in configurable automation.
- **incident.io** -- Autonomous AI investigation agent, connects telemetry to code changes, call transcription.
- **Datadog Bits AI** -- Multi-agent (triage, code/deployment, security), auto-timelines, stakeholder updates. Priced per investigation.
- **Resolve AI** -- Multi-agent autonomous responder, generates remediation PRs, updates docs.
- **Cleric** -- First-pass on every alert, joins incident bridges, drafts summaries.
- **Dash0 Agent0** -- Context-focused (not autonomy-focused), transparent reasoning, teaches as it assists.
- **Azure SRE Agent** -- LLM-based telemetry interpretation, custom runbooks, approval workflows, GitHub/ADO ticket creation.
- **AWS Bedrock AgentCore SRE** -- Multi-agent (K8s, logs, metrics, runbooks) with supervisor, MCP integration, memory/personalization.
- **GeneiOps (UST/Telecom)** -- LangGraph + Claude Sonnet, auto-RCA, health checks every 15min, 20-25 automation tasks.
- **NetBrain** -- AI Deep Diagnosis with ReAct framework, 90% resolution rate on real-world network issues.

**Open-source/frameworks:** CrewAI, LangGraph, StackStorm for event-driven automation.

**Research approaches:**
- **Meta** -- Heuristic retrieval + fine-tuned Llama 2 (7B) ranking for root cause isolation. 42% accuracy (top-5) on web monorepo investigations. Key: fine-tuning on ~5K historical RCA examples.
- **Predictive AI** -- ML on 6-18 months historical data to forecast incidents before impact. 30-50% MTTR reduction, 40-80% alert noise reduction.

## 2. Known Failure Modes / Chokepoints

- **False root causes** -- Meta reports only 42% accuracy even after fine-tuning; confident-but-wrong conclusions are the #1 trust-killer
- **Alert fatigue amplification** -- AI that generates more noise or low-quality suggestions during high-stress incidents makes things worse
- **Stale/missing runbooks** -- AI reasoning is only as good as the knowledge base; incomplete KB = bad recommendations
- **Lack of live system access** -- Without real telemetry, logs, and traces, an incident agent is just a chatbot with opinions
- **Over-automation without guardrails** -- Automated remediation that loops (runs same fix 3+ times) or makes multiple changes simultaneously
- **Context window limitations** -- Incidents generate enormous log/trace data; fitting relevant context is a hard problem
- **Human trust gap** -- SRE veterans distrust AI recommendations during high-pressure P0s; adoption requires gradual trust-building
- **Novel incidents** -- Pattern-matching on historical data fails for never-before-seen failure modes (the exact situations that need the most help)
- **Cross-system correlation** -- Incidents spanning multiple services/providers are harder to diagnose; requires broad telemetry access

## 3. What Would Make This Agent Best-in-Class

- **Structured reasoning framework** -- Not just "here's what to do" but show the diagnostic chain: symptom -> hypothesis -> evidence -> action -> verify. The Dash0 approach (transparent reasoning) builds trust.
- **Memory/learning from past incidents** -- PagerDuty's per-service memory model is the gold standard. Each incident resolution should enrich future responses.
- **Graduated automation levels** -- Start with suggestions, graduate to auto-remediation for well-understood patterns. Never skip human approval for novel situations.
- **Explicit uncertainty signaling** -- Unlike current LLMs that are "sometimes wrong, never uncertain," the agent should express confidence levels and flag when it's in uncharted territory.
- **Integration with real tooling** -- MCP servers for PagerDuty/Datadog/Grafana/Splunk. Without live data, the agent is advice-only.
- **Runbook-as-code** -- Executable runbooks (YAML/code) rather than prose. AutoHand.ai's approach: triggers, actions, safeguards, rollback.
- **Post-incident automation** -- Auto-generate timelines, draft blameless post-mortems, track action items. This is the lowest-risk, highest-value AI application in incident management.

## 4. Main Bottleneck

**Tools, not prompt.** The current agent v4 is a well-structured prompt covering the full incident lifecycle (Google SRE best practices, severity levels, classification table, anti-patterns, resolution decisions, post-incident). It scores at ceiling because the eval tasks likely test knowledge/advice quality.

The real bottleneck is that this agent has no access to:
- Live telemetry/monitoring systems
- Runbook knowledge bases
- Incident history/memory
- Automated remediation capabilities

Without these tools, it's a knowledgeable advisor. With them, it could be an autonomous incident partner. The prompt is good enough -- tooling integration is what separates advice from action.

## 5. What Winning Setups Look Like

- **PagerDuty SRE Agent pattern:** Service-scoped memory + runbook ingestion + log search integration + nudge-based UX (suggest actions, learn from feedback). Key: 2K char limit on custom_details keeps context focused.
- **AWS multi-agent pattern:** Supervisor + specialized agents (K8s, logs, metrics, runbooks). Each agent has narrow tool access. Supervisor orchestrates based on incident type.
- **GeneiOps pattern:** LangGraph routing + Claude reasoning + telemetry integration (Splunk/AppD/Grafana) + auto-RCA + continuous health checks. Chat-based execution (Slack/Teams).
- **Meta RCA pattern:** Heuristic retrieval to narrow search space (thousands -> hundreds) + LLM ranking (hundreds -> top 5). Fine-tuned on historical incidents.
- **Graduated trust model:** Read-only -> suggestion -> approved automation -> autonomous remediation (for known patterns only). The Azure SRE Agent and multiple vendors emphasize this progression.
- **Common winning traits:**
  - Chat-native (Slack/Teams) -- meet responders where they work
  - Transparent reasoning -- show what signals were examined
  - Closed feedback loops -- rate AI responses, correct mistakes, improve over time
  - Self-updating runbooks -- capture resolutions automatically
  - Cooldown/circuit-breaker on auto-remediation to prevent loops
