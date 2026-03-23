# incident-responder -- Deep Research Report v2

**Prior eval:** 4.87 across D/H/I (ceiling). Saturated on knowledge tasks. Real improvement requires tools.

---

## 1. Landscape (2025-2026)

The AI incident response space has bifurcated into two tiers:

**Tier 1 -- Full autonomous agents:**
- **PagerDuty SRE Agent**: Per-service memory, self-updating runbooks, log search integration, nudge-based UX. Shifting to credit-based pricing (work done, not seats). Key insight: they explicitly acknowledge organizations have wildly different AI readiness levels and offer graduated packages. [diginomica.com, PagerDuty blog]
- **Rootly AI**: End-to-end incident management with AI-driven auto-classification, severity assessment, routing from historical data. Slack-native. Claims to outperform PagerDuty on end-to-end workflow completeness. [rootly.com]
- **incident.io**: Autonomous investigation agent that connects telemetry to code changes. Call transcription. Emphasis on "AI that investigates while you respond."
- **Datadog Bits AI**: Multi-agent architecture (triage agent, code/deployment agent, security agent). Auto-generates timelines, stakeholder updates. Priced per investigation.
- **AWS Bedrock AgentCore SRE**: Multi-agent with supervisor pattern -- specialized agents for K8s, logs, metrics, runbooks. MCP integration. Memory/personalization layer.
- **Azure SRE Agent**: LLM-based telemetry interpretation, custom runbooks, approval workflows, GitHub/ADO ticket creation.

**Tier 2 -- Focused tools:**
- **Resolve AI**: Generates remediation PRs, updates docs automatically.
- **Cleric**: First-pass on every alert, joins incident bridges, drafts summaries.
- **Dash0 Agent0**: Context-focused (not autonomy-focused), transparent reasoning, "teaches as it assists." Notable for trust-building approach.
- **Shoreline.io**: Runbook automation platform, pre-built remediation actions, event-driven execution.
- **BigPanda**: AIOps focused on alert correlation and noise reduction, ML-based event grouping.

**Research benchmarks:**
- **Meta**: Heuristic retrieval + fine-tuned Llama 2 (7B) ranking for root cause isolation on their web monorepo. **42% accuracy (top-5)** on ~5K historical RCA examples. This is the only published accuracy number from a major tech company. [Meta engineering blog]
- **Galileo State of Eval Engineering Report**: 84.9% of AI teams experienced incidents in the last 6 months. Only 8.4% reported zero. Elite teams achieve 2.2x better reliability through systematic eval practices -- and paradoxically report *more* incidents (better detection). [galileo.ai]
- **GeneiOps (UST/Telecom)**: LangGraph + Claude Sonnet, auto-RCA, health checks every 15min, 20-25 automation tasks.
- **NetBrain**: AI Deep Diagnosis with ReAct framework, claims 90% resolution rate on real-world network issues.

**Key trend**: The industry is converging on multi-agent architectures with a supervisor/router pattern. Single-agent monolithic approaches are being abandoned by all major vendors.

---

## 2. Failure Modes

Ranked by severity and frequency from production reports and community experience:

### Critical failures
1. **Confident-but-wrong root cause analysis** -- Meta's 42% top-5 accuracy means even fine-tuned models are wrong more than half the time. During a P0, a wrong RCA wastes the team's most scarce resource: focused investigation time. Community reports confirm this is the #1 trust-killer. [Reddit r/devops, r/sre, Meta engineering]
2. **Automation loops without circuit-breakers** -- Real-world incident: a cleanup Lambda deleted Rancher's EBS volume in production. Automated remediation that retries the same failed fix or makes cascading changes is the highest-damage failure mode. [dev.to/aws-builders]
3. **Novel incident blindness** -- Pattern-matching on historical data fails completely for never-before-seen failure modes, which are precisely the incidents that need the most help. All current AI approaches degrade to generic advice for novel failures.

### High-severity failures
4. **Alert fatigue amplification** -- AI that generates additional noise, low-confidence suggestions, or verbose analysis during high-stress P0 incidents actively harms response. Responders at 3 AM need signal, not volume.
5. **Stale/missing runbook dependency** -- AI reasoning is bounded by knowledge base quality. Incomplete or outdated runbooks produce systematically wrong recommendations that look authoritative.
6. **Context window overflow** -- Incidents generate enormous log/trace data. Fitting relevant context is a hard problem. Current approaches (PagerDuty's 2K char limit on custom_details, Datadog's agent-per-domain split) are workarounds, not solutions.

### Medium-severity failures
7. **Cross-system correlation gaps** -- Incidents spanning multiple services/providers require broad telemetry access. Most tools are strong within one observability stack but weak across boundaries.
8. **Human trust gap during P0s** -- SRE veterans distrust AI recommendations under pressure. Community sentiment on Reddit/HN: useful for post-incident, suspicious during active response. Adoption requires the graduated trust model (read-only -> suggestion -> approved automation -> autonomous for known patterns).
9. **Postmortem theater** -- AI-generated postmortems that are "comprehensive" but shallow. They look good but don't capture the actual debugging reasoning or non-obvious contributing factors. Template compliance without insight.

---

## 3. Best-in-Class Improvements

What separates top-performing setups from the current agent:

### A. Structured diagnostic reasoning (Dash0/Datadog pattern)
The current agent lists investigation steps. Best-in-class agents show the diagnostic chain: **symptom -> hypothesis -> evidence for/against -> action -> verify -> next hypothesis**. This transparent reasoning builds trust and teaches responders. Dash0's "context-focused, not autonomy-focused" philosophy outperforms pure automation approaches on adoption metrics.

### B. Multi-agent with supervisor (AWS/Datadog pattern)
Split the monolithic responder into specialized sub-agents:
- **Triage agent**: Alert correlation, severity assessment, initial classification
- **Code/deployment agent**: Recent deploys, code changes, feature flags
- **Infrastructure agent**: Resource metrics, scaling, network
- **Communication agent**: Stakeholder updates, timeline maintenance

Supervisor routes based on incident classification. Each agent has narrow tool access and focused context window.

### C. Memory and learning loop (PagerDuty pattern)
Per-service incident memory that enriches future responses. Every resolution should update the service's knowledge base. This is the single highest-value architectural addition -- it converts a stateless advisor into one that gets better per-service over time.

### D. Runbook-as-code execution (Shoreline/AutoHand pattern)
Executable runbooks (YAML/code) with triggers, actions, safeguards, and rollback steps -- not prose descriptions of what to do. The agent should be able to execute validated remediation steps, not just describe them.

### E. Graduated automation with circuit-breakers
Read-only -> suggestion -> approved automation -> autonomous (for known patterns only). Each level requires explicit human opt-in. Autonomous remediation requires: cooldown timers, max-retry limits, blast radius constraints, automatic rollback on metric degradation.

### F. Post-incident eval generation (Anthropic/Galileo pattern)
Anthropic's production process generates 20-50 test cases per user-reported failure with three validation layers. Shopify replays real customer conversations through LLM-powered simulators. The highest-ROI reliability practice: converting every incident into eval coverage. [galileo.ai]

---

## 4. Main Bottleneck

**Tools, not prompt.** Confirmed and reinforced by v2 research.

The current agent v4 is a well-structured prompt covering the full SRE incident lifecycle. It scores at ceiling (4.87) because eval tasks test knowledge and advice quality. The prompt itself is essentially complete for a knowledge-only agent.

The gap is entirely in capability:

| Capability | Current | Required for next level |
|---|---|---|
| Live telemetry access | None | MCP servers for Datadog/Grafana/CloudWatch/Splunk |
| Runbook execution | Describes steps | Execute validated remediation via tool calls |
| Incident memory | Stateless | Per-service incident history, resolution patterns |
| Alert correlation | Manual classification table | ML-based alert grouping, noise reduction |
| Code change correlation | "Check deploy log" advice | Git diff analysis, deploy timeline, feature flag state |
| Communication automation | Template advice | Direct Slack/Teams/PagerDuty integration |
| Post-incident generation | Postmortem checklist | Auto-generated timelines, blameless review drafts, action item tracking |

**The eval ceiling at 4.87 is the ceiling of what knowledge-only agents can achieve in this domain.** Further prompt improvements yield diminishing returns. The agent needs to *do things*, not just *know things*.

---

## 5. Winning Patterns

Distilled from commercial tools, big tech approaches, and community experience:

### Pattern 1: Tiered context loading
Don't dump all logs into context. Use tiered retrieval: metadata/summaries first, full output only on request. Wake MCP's `list_commands` + `get_output` pattern is directly applicable. PagerDuty's 2K char limit on custom_details enforces this. [github.com/joemckenney/wake]

### Pattern 2: Hypothesis-driven investigation
Structure the diagnostic process as explicit hypothesis testing rather than open-ended log reading:
1. Generate ranked hypotheses from symptoms + recent changes
2. For each hypothesis: specify what evidence would confirm/refute
3. Gather that specific evidence (not all available evidence)
4. Update hypothesis ranking
5. Recommend action only when confidence exceeds threshold

This is what Meta's heuristic-retrieval-then-LLM-ranking approach implements at scale.

### Pattern 3: Blast radius awareness
Before any remediation action, explicitly assess: what's the worst case if this action is wrong? Require human approval when blast radius exceeds threshold. This is the #1 lesson from the Lambda-deletes-EBS incident and similar automation-gone-wrong stories.

### Pattern 4: Time-pressure-aware communication
Different outputs for different urgency levels:
- **P0 active**: Bullet points only. One recommended action. No explanation unless asked.
- **P0 investigating**: Short hypothesis list with evidence needed.
- **P1-P2**: Full diagnostic reasoning, multiple options.
- **Post-incident**: Comprehensive timeline, contributing factors, action items.

Current agent doesn't adapt output format to incident phase/severity.

### Pattern 5: Incident-to-eval pipeline
Every resolved incident produces: (a) test cases for the failure mode, (b) updated runbook entries, (c) new alert conditions if detection was delayed. This closed loop is what Anthropic (20-50 test cases per incident), Shopify, and Galileo's research all converge on as the highest-ROI practice.

### Pattern 6: Chat-native operation
Meet responders where they work. Slack/Teams integration is not optional -- it's the primary interface for every successful deployment. PagerDuty, Rootly, incident.io all emphasize this. The agent should operate in the incident channel, not require context-switching to a separate tool.

---

## 6. Specific Recommendations

### For the prompt (diminishing returns, but still worth doing):

1. **Add hypothesis-driven investigation protocol** -- Replace the flat "Investigation & Mitigation" section with structured hypothesis testing (generate -> evidence -> confirm/refute -> next). This is the single highest-value prompt change.

2. **Add phase-aware output formatting** -- The agent should explicitly ask "what phase is this incident in?" and adapt verbosity. P0 active = telegraphic. Post-incident = comprehensive.

3. **Add explicit uncertainty signaling** -- Require the agent to state confidence level for every root cause hypothesis and flag when it's reasoning about a novel/unfamiliar failure pattern. "I'm 40% confident this is a connection pool exhaustion issue based on [X], but I haven't ruled out [Y]."

4. **Add blast radius assessment** -- Before recommending any action, require: "Blast radius if wrong: [assessment]. Reversible: yes/no. Requires approval: [threshold]."

5. **Add post-incident eval generation section** -- After resolution, generate: specific test cases for the failure mode, runbook updates, new monitoring conditions.

### For tooling (where the real gains are):

6. **MCP server integrations** -- Priority order: (a) observability stack (Datadog/Grafana/CloudWatch), (b) incident management (PagerDuty/OpsGenie), (c) deployment tracking (GitHub/GitLab deploys, feature flags), (d) communication (Slack/Teams). Each integration unlocks a capability tier.

7. **Incident memory system** -- Per-service memory storing: past incidents, resolution patterns, known failure modes, service dependencies, runbook links. A-MEM or similar persistent memory MCP could serve as foundation. This converts the agent from stateless to learning.

8. **Runbook execution framework** -- Structured runbook format (YAML) with: trigger conditions, diagnostic steps (as tool calls), remediation actions (with approval gates), rollback procedures, verification checks. The agent executes these rather than describing them.

9. **Multi-agent architecture** -- For Claude Code specifically: supervisor agent that routes to specialized sub-agents (triage, code-analysis, infrastructure, communication). Each sub-agent has focused tool access and narrower context. This addresses the context window problem directly.

10. **Terminal session integration** -- Wake MCP or similar for capturing the responder's diagnostic session. The agent sees what commands have been run and their output without requiring copy-paste. This is the lowest-friction path to giving the agent real-time context.

### Priority ranking for maximum eval improvement:

| Priority | Change | Expected impact | Effort |
|---|---|---|---|
| 1 | Hypothesis-driven investigation protocol (prompt) | Moderate -- improves reasoning structure on complex scenarios | Low |
| 2 | Phase-aware output formatting (prompt) | Small -- better UX but same knowledge | Low |
| 3 | Uncertainty signaling (prompt) | Small -- prevents overconfident wrong answers | Low |
| 4 | MCP observability integration (tool) | **High** -- enables real diagnosis | High |
| 5 | Incident memory system (tool) | **High** -- enables learning per-service | Medium |
| 6 | Runbook execution (tool) | **High** -- enables action, not just advice | High |

**Bottom line**: The prompt is near-optimal for a knowledge-only agent. Priorities 1-3 are worth doing but won't move the eval score meaningfully because the eval already tests knowledge at ceiling. Priorities 4-6 are where transformative improvement lives, but they require tool infrastructure that may be outside the eval framework. The agent's real-world utility gap is enormous -- it knows what to do but can't do it.

---

## Sources

- PagerDuty SRE Agent architecture and pricing: diginomica.com, PagerDuty blog (2025-2026)
- Rootly AI vs PagerDuty comparison: rootly.com/sre (2026-03)
- Meta RCA accuracy (42% top-5): Meta engineering blog (2024)
- Galileo State of Eval Engineering: galileo.ai (2026-03) -- 84.9% incident rate, 2.2x reliability for elite teams
- AI incident report template: dev.to/optyxstack (2026-03)
- AWS Bedrock AgentCore SRE: AWS documentation (2025)
- Azure SRE Agent: Microsoft Azure blog (2025)
- Automation failure case study (Lambda/EBS): dev.to/aws-builders (2026-01)
- Runbook best practices: dev.to/aws-builders (2026-01)
- Wake MCP terminal integration: github.com/joemckenney/wake
- Port.io AI-powered RCA generation: docs.port.io (2026)
- EU AI Act incident reporting requirements: EUR-Lex Regulation 2024/1689
- Community sentiment: Reddit r/devops, r/sre, r/ClaudeCode, HN threads (2024-2026)
