# websocket-engineer - Per-Agent Research Report

## Eval Performance
- v4: 4.73, v1: 4.69, bare: 4.48
- Agent instructions help slightly (+0.25 over bare)
- Small gap between v1 and v4 (+0.04) -- diminishing returns from prompt refinement

## 1. Competitive Landscape

**Transport evolution (2025-2026):**
- Industry actively migrating from SSE to WebSockets for AI applications (websocket.org, March 2026)
- MCP (Model Context Protocol) deprecated SSE transport in favor of Streamable HTTP -- clear signal
- Vercel AI SDK deprecated its SSE-based streaming approach
- "Durable Sessions" emerging as category above raw WebSockets (connection resilience, cross-device, async completion)

**Key tools/frameworks:**
- LiveKit: industry standard for real-time voice/video (powers ChatGPT Advanced Voice Mode)
- Socket.IO: still dominant for fallback/reconnection scenarios
- FastAPI WebSocket: trivially easy server-side WebSocket endpoints
- Redis Pub/Sub + Streams: standard pattern for scaling WebSocket horizontally
- Cloudflare AI Gateway: launched Realtime WebSockets API (March 2025) for AI model interactions

**AI + WebSocket intersection:**
- OpenAI Realtime API, Google Gemini Live API both use WebSockets natively
- Agentic applications (LangGraph, CrewAI, AutoGen) need bidirectional communication for human-in-the-loop
- Voice AI pipelines (STT -> LLM -> TTS) heavily rely on WebSocket streaming

**Competing approaches:**
- SSE: still fine for simple one-way token streaming
- WebTransport (HTTP/3): next-gen but not yet mainstream
- gRPC streaming: microservice-to-microservice, not client-facing

## 2. Known Failure Modes / Chokepoints

- **AI processing blocks event loop**: Node.js WebSocket servers that do inline LLM inference (2-10s per request) block other connections. Must separate connection handling from AI processing
- **Connection drops on mobile**: SSE and WebSocket both drop constantly on mobile; without durable sessions, context is lost mid-generation
- **Scaling statefulness**: WebSocket connections are stateful and sticky to servers; without Redis adapter/Pub/Sub, messages don't cross server boundaries
- **Memory pressure**: Keeping 10k connections + AI model context crashes instances. Need external state
- **Proxy/LB misconfiguration**: Reverse proxies stripping upgrade headers is the #1 "works locally, fails in prod" issue
- **No reconnection logic**: Networks are unreliable; tight reconnect loops without backoff cause cascading failures
- **Auth race conditions**: Authenticating after connection opens creates vulnerability window

## 3. What Would Make This Agent Best-in-Class

- **Add AI-specific WebSocket patterns**: The current agent covers generic WebSocket well but misses the AI-specific use cases that are now the primary growth area:
  - Token streaming architecture (separate connection handling from AI worker pools)
  - Redis Streams for AI job queues with consumer groups
  - Streaming AI responses without blocking (async generators)
  - Durable session patterns for long-running agent tasks
- **Add voice/real-time AI pipeline guidance**: LiveKit integration, STT->LLM->TTS patterns
- **Add MCP/Streamable HTTP awareness**: The protocol landscape shifted; agent should know when WebSocket vs Streamable HTTP
- **Multi-device/multi-tab session sync**: Emerging requirement for AI products
- **Cost-aware model routing over WebSocket**: Different AI queries routed to different models based on complexity

## 4. Main Bottleneck

**Prompt scope** is the primary bottleneck. The current agent is a solid generic WebSocket reference but lacks:
- AI-specific scaling patterns (the hottest use case)
- Modern protocol landscape awareness (MCP, Streamable HTTP, durable sessions)
- Production deployment patterns specific to AI workloads

The model already understands WebSocket fundamentals well (bare score 4.48 is high). The agent instructions add marginal value (+0.25) because they mostly codify what the model already knows. To get meaningful lift, the instructions need to cover what the model does NOT already know well -- namely the AI + WebSocket intersection patterns that emerged in 2025-2026.

## 5. What Winning Setups Look Like

**Architecture (from search results):**
```
WebSocket Server (stateless, connection mgmt only)
  -> Redis Pub/Sub (cross-server message delivery)
  -> Redis Streams (AI job queue with consumer groups)
  -> AI Worker Pool (separate processes, 1.5GB+ each)
  -> Back through Redis -> WebSocket -> Client
```

**Key patterns in production:**
- Separate connection handling from AI processing (non-blocking)
- Consumer groups for AI workers (no duplicate processing)
- Streaming AI response chunks back through WebSocket as generated
- Intelligent routing: match query complexity to model (cheap vs expensive)
- Health checks: pending queue depth > 100 = add workers
- Per-task: 4 WebSocket servers (2.5k connections each), 3-5 AI workers

**Production checklist additions for AI workloads:**
- AI worker memory budget (~1.5GB per worker vs ~200MB per WS server)
- Rate limiting per-connection for AI queries
- Heartbeat during long AI processing (prevent timeout during 10s+ inference)
- Message deduplication on reconnect (critical for AI responses)
- Session persistence for multi-turn AI conversations

## Recommendations for v5

1. Add "AI Real-Time Patterns" section covering token streaming, job queues, worker pools
2. Add "Durable Sessions" concept to the Scaling Checklist
3. Update Protocol Selection table: add row for "AI agent workflows" -> WebSocket + durable session layer
4. Add Common Issues row: "AI responses timeout" -> separate AI processing from connection; heartbeat during inference
5. Consider whether the modest +0.25 lift ceiling means effort is better spent on other agents
