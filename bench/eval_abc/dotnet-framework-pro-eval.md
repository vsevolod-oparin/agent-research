# dotnet-framework-pro Evaluation (A/B/C)

## Task 1: dnf-001

**Ground Truth Summary:** Must mention: (1) server-side paging (not loading all records), (2) specific GridView properties (AllowPaging, PageSize), (3) SQL-level pagination (OFFSET/FETCH or ROW_NUMBER), (4) consider caching for repeated queries. Must NOT: vague "optimize performance" advice, suggest migrating to .NET Core.

### Condition A (bare)
- must_mention coverage: 4/4 -- Server-side paging (yes), AllowPaging/PageSize/AllowCustomPaging/VirtualItemCount (yes), OFFSET/FETCH SQL (yes, with COUNT), caching with ObjectCache/MemoryCache (yes).
- must_not violations: None -- No migration suggestion, no vague platitudes.
- Completeness: 5 -- Covers all must-mention items plus ViewState optimization, SqlDataReader, database indexes, OutputCache.
- Precision: 5 -- All code examples are correct .NET Framework 4.8 Web Forms code.
- Actionability: 5 -- Complete end-to-end solution: SQL, ASPX markup, code-behind. Copy-pasteable.
- Structure: 5 -- Step-by-step numbered approach. Before/after implicit in code flow.
- Efficiency: 4 -- Dense and relevant. Additional optimizations add value without filler.
- Depth: 5 -- VirtualItemCount for custom paging, ViewState disable, expected performance numbers.
- **Composite: 4.87**

### Condition B (v1 agents)
- must_mention coverage: 4/4 -- All items covered. ROW_NUMBER fallback for SQL 2008 included.
- must_not violations: None
- Completeness: 5 -- More detailed than A: stored procedure with sorting, full data access layer, complete code-behind with paging state management, MemoryCache example.
- Precision: 5 -- All code correct. Stored procedure pattern is production-grade.
- Actionability: 5 -- Complete production-ready implementation. Custom pager UI, sorting support.
- Structure: 5 -- Six clear steps from SQL to cache. Complete ASPX and code-behind.
- Efficiency: 4 -- Thorough but possibly more code than needed for the question.
- Depth: 5 -- ROW_NUMBER fallback, sorting support, custom pager, ViewState for page state, cache key strategy.
- **Composite: 4.87**

### Condition C (v2 agents)
- must_mention coverage: 4/4 -- All items covered. AllowCustomPaging + VirtualItemCount noted.
- must_not violations: None
- Completeness: 5 -- All required items plus ViewState, covering index, SqlDataReader suggestion, MemoryCache, OutputCache directive.
- Precision: 5 -- All correct.
- Actionability: 5 -- Complete code: SQL, ASPX, code-behind, caching.
- Structure: 5 -- Step-by-step with clear progression.
- Efficiency: 4 -- Good balance of completeness and conciseness.
- Depth: 5 -- Covering index suggestion, server-side sorting note, search/filter recommendation.
- **Composite: 4.87**

---

## Task 2: dnf-002

**Ground Truth Summary:** Must mention: (1) maxReceivedMessageSize in binding config, (2) maxBufferSize and maxBufferPoolSize, (3) specific XML config example with values, (4) consider streaming transfer mode for very large payloads. Structure: exact config snippet, before/after comparison.

### Condition A (bare)
- must_mention coverage: 4/4 -- maxReceivedMessageSize (yes), maxBufferSize/maxBufferPoolSize (yes), XML config (yes, detailed), streaming transferMode (yes with contract example).
- must_not violations: None
- Completeness: 5 -- Server config, client config, streaming mode, security notes, programmatic config. ReaderQuotas included.
- Precision: 5 -- All config values and XML correct.
- Actionability: 5 -- Copy-pasteable XML configs for both sides. Streaming contract example.
- Structure: 4 -- Detailed steps but no explicit before/after comparison table.
- Efficiency: 4 -- Dense and relevant. Security note adds value.
- Depth: 5 -- Covers all four quota settings, explains why they must match, security warning about int.MaxValue.
- **Composite: 4.73**

### Condition B (v1 agents)
- must_mention coverage: 4/4 -- All items covered. wsHttpBinding variant included.
- must_not violations: None
- Completeness: 5 -- Server, client, wsHttpBinding, streaming, programmatic config, IIS limits (maxRequestLength, maxAllowedContentLength).
- Precision: 5 -- All correct. Additional IIS settings are a valuable precision point.
- Actionability: 5 -- Complete configs for multiple binding types plus IIS settings.
- Structure: 5 -- Clear sections by binding type. Key points summary.
- Efficiency: 4 -- Thorough. wsHttpBinding example may be unnecessary but not filler.
- Depth: 5 -- IIS request filtering settings, dataContractSerializer maxItemsInObjectGraph, streaming with file upload example.
- **Composite: 4.87**

### Condition C (v2 agents)
- must_mention coverage: 4/4 -- All items covered.
- must_not violations: None
- Completeness: 5 -- Server, client, streaming, programmatic, IIS limits with table explaining defaults.
- Precision: 5 -- All correct. Default values table is a precision bonus.
- Actionability: 5 -- Complete configs. Defaults table helps calibrate values.
- Structure: 5 -- Clean sections with explanatory table. Numbered considerations.
- Efficiency: 5 -- Defaults table is exceptionally efficient for quick reference.
- Depth: 5 -- IIS limits, wsHttpBinding note, int.MaxValue warning, defaults table.
- **Composite: 5.00**

---

## Task 3: dnf-003

**Ground Truth Summary:** Must mention: (1) Windows Authentication in IIS configuration, (2) web.config authentication mode="Windows", (3) authorization rules (deny anonymous), (4) WindowsPrincipal/WindowsIdentity for role checks. Must NOT: suggest OAuth/JWT (overkill for intranet AD).

### Condition A (bare)
- must_mention coverage: 4/4 -- IIS Windows Auth (yes), web.config mode="Windows" (yes), deny users="?" (yes), WindowsPrincipal/WindowsIdentity with IsInRole and PrincipalContext (yes).
- must_not violations: None -- No OAuth/JWT suggestion. Forms Auth with AD mentioned as alternative for mixed environments only, which is appropriate.
- Completeness: 5 -- All items plus AD group role checks, PrincipalContext for detailed user info, location blocks, mixed environment fallback.
- Precision: 5 -- All code correct. System.DirectoryServices.AccountManagement usage accurate.
- Actionability: 5 -- Complete config, code-behind with role check, AD query example.
- Structure: 5 -- Step-by-step from IIS to code. Decision table for scenarios.
- Efficiency: 4 -- Forms Auth alternative section adds length but is contextually appropriate.
- Depth: 5 -- Non-domain machine handling, PrincipalContext for AD queries, location blocks.
- **Composite: 4.87**

### Condition B (v1 agents)
- must_mention coverage: 4/4 -- All items covered. WindowsTokenRoleProvider added.
- must_not violations: None
- Completeness: 5 -- IIS config, web.config, role manager, AD user details, custom authorization module, audit logging, deployment checklist.
- Precision: 5 -- All code correct. Custom HttpModule is production-grade.
- Actionability: 5 -- Most actionable of the three -- includes custom auth module, audit logging, and Kerberos delegation checklist.
- Structure: 5 -- Six clear steps plus deployment checklist.
- Efficiency: 4 -- Very thorough, possibly more than asked but all relevant.
- Depth: 5 -- Custom auth module combining AD + DB roles, Kerberos SPN notes, browser-specific auth behavior.
- **Composite: 4.87**

### Condition C (v2 agents)
- must_mention coverage: 4/4 -- All items covered.
- must_not violations: None
- Completeness: 5 -- All items plus WindowsTokenRoleProvider, Forms Auth for mixed, security deployment steps, decision guide table.
- Precision: 5 -- All correct.
- Actionability: 5 -- Decision guide table is highly actionable for architecture decisions.
- Structure: 5 -- Step-by-step with decision guide table at end.
- Efficiency: 5 -- Decision guide table efficiently summarizes when to use which approach.
- Depth: 5 -- HTTPS requirement noted, machineKey for web farms, Azure AD option.
- **Composite: 5.00**

---

## Task 4: dnf-004

**Ground Truth Summary:** Must mention: (1) memory leak investigation (perfmon counters, memory profiler), (2) common causes: event handler not unsubscribed, growing collections, large object heap, (3) add structured logging before crash, (4) implement graceful degradation (GC.Collect as last resort, circuit breaker on queue). Structure: diagnostic steps ordered, likely causes ranked.

### Condition A (bare)
- must_mention coverage: 4/4 -- Perfmon/profiler (PerformanceCounter + procdump/WinDbg), common causes (MessageQueue not disposed, event handler accumulation, LOH, XmlSerializer leak), structured logging (diagnostic timer), graceful degradation (Environment.Exit with SCM restart).
- must_not violations: None
- Completeness: 5 -- Five specific causes with code, diagnostic approach, preventive measures. XmlSerializer assembly leak is a non-obvious bonus.
- Precision: 5 -- All technically accurate. MSMQ-specific patterns correct.
- Actionability: 5 -- Complete diagnostic code, fix code for each cause, sc.exe recovery command.
- Structure: 5 -- Diagnosis section then ranked causes. Clear ordering.
- Efficiency: 4 -- Dense with relevant MSMQ-specific content.
- Depth: 5 -- XmlSerializer dynamic assembly leak, LOH compaction mode, BodyStream disposal, event handler accumulation pattern.
- **Composite: 4.87**

### Condition B (v1 agents)
- must_mention coverage: 4/4 -- All items covered with MemoryDiagnostics class, procdump, four specific causes, MemoryWatchdog.
- must_not violations: None
- Completeness: 5 -- Diagnostic class, dump analysis, four cause patterns, bounded collections, watchdog safety net.
- Precision: 5 -- All correct. HandleCount monitoring is a good diagnostic addition.
- Actionability: 5 -- Production-ready MemoryDiagnostics and MemoryWatchdog classes. Complete service lifecycle code.
- Structure: 5 -- Diagnosis steps then problems with fixes. Watchdog at end.
- Efficiency: 4 -- Thorough. Event-driven processor example is complete but lengthy.
- Depth: 5 -- CancellationToken integration, BodyStream disposal, bounded ConcurrentQueue, LOH compaction, service recovery config.
- **Composite: 4.87**

### Condition C (v2 agents)
- must_mention coverage: 4/4 -- All items covered. Distinguishes managed vs unmanaged leak via PrivateBytes vs GC.TotalMemory.
- must_not violations: None
- Completeness: 5 -- Diagnostic logging, dump analysis, five causes, bounded collection, watchdog.
- Precision: 5 -- All correct. Managed vs unmanaged distinction is precise.
- Actionability: 5 -- Good diagnostic code, fix code per cause, service recovery.
- Structure: 5 -- Ordered diagnostic steps, ranked causes.
- Efficiency: 4 -- Well-organized and thorough.
- Depth: 5 -- Managed vs unmanaged leak distinction, database connection leak mention, BlockingCollection with bounded capacity.
- **Composite: 4.87**

---

## Task 5: dnf-005

**Ground Truth Summary:** Must mention: (1) ASP.NET Web API 2 (framework-compatible, not Core), (2) reference existing class libraries directly, (3) OWIN self-hosting as alternative to IIS, (4) API versioning strategy. Must NOT: suggest ASP.NET Core, suggest WCF REST (outdated).

### Condition A (bare)
- must_mention coverage: 3/4 -- Web API 2 (yes), reference class libraries (yes), OWIN self-host (yes). API versioning NOT mentioned.
- must_not violations: PARTIAL -- Mentions WCF REST as Option 3 (ground truth says must NOT suggest WCF REST). Also mentions API Gateway as Option 4 which is outside scope but not prohibited.
- Completeness: 4 -- Three of four must-mention items. Four options provided but includes WCF REST (prohibited).
- Precision: 4 -- WCF REST suggestion violates must_not. Other content correct.
- Actionability: 5 -- Complete controller code, OWIN setup, configuration examples.
- Structure: 5 -- Options ranked with "when to use" guidance.
- Efficiency: 4 -- Good density but WCF REST option wastes space on prohibited approach.
- Depth: 4 -- Good coverage of hosting options but missing versioning.
- **Composite: 4.27**

### Condition B (v1 agents)
- must_mention coverage: 3/4 -- Web API 2 (yes), reference class libraries (yes, with full example), OWIN self-host (yes). API versioning NOT mentioned.
- must_not violations: None -- Does not suggest ASP.NET Core. Mentions WCF only briefly in decision matrix for comparison, not as a recommendation.
- Completeness: 4 -- Three of four items. Facade pattern is a valuable addition. DI with Unity.
- Precision: 5 -- All code correct. No prohibited suggestions as primary recommendations.
- Actionability: 5 -- Production-ready: DI setup, exception handler, API key auth, Swashbuckle.
- Structure: 5 -- Options A/B/C with decision matrix table.
- Efficiency: 4 -- Very thorough, possibly more than needed but all relevant.
- Depth: 5 -- DI container setup, global exception handler, API key auth, facade pattern, Swashbuckle.
- **Composite: 4.60**

### Condition C (v2 agents)
- must_mention coverage: 3/4 -- Web API 2 (yes), reference class libraries (yes), OWIN self-host (yes). API versioning NOT mentioned.
- must_not violations: PARTIAL -- Mentions WCF REST as Option 4 with "not recommended for new work" but still presents it. Ground truth says must NOT suggest WCF REST.
- Completeness: 4 -- Three items. Five options provided. Hybrid Web Forms option is useful.
- Precision: 4 -- WCF REST inclusion is a must_not issue, though caveated. Decision matrix is useful.
- Actionability: 5 -- Complete code for Web API, OWIN, hybrid. Decision matrix.
- Structure: 5 -- Five options with comprehensive decision matrix.
- Efficiency: 4 -- Decision matrix is excellent. WCF option dilutes slightly.
- Depth: 5 -- Migration path diagram, Swashbuckle mention, hybrid approach, decision matrix.
- **Composite: 4.47**

---

## Summary

| Task | A | B | C |
|------|---|---|---|
| dnf-001 | 4.87 | 4.87 | 4.87 |
| dnf-002 | 4.73 | 4.87 | 5.00 |
| dnf-003 | 4.87 | 4.87 | 5.00 |
| dnf-004 | 4.87 | 4.87 | 4.87 |
| dnf-005 | 4.27 | 4.60 | 4.47 |
| **Mean** | **4.72** | **4.82** | **4.84** |
| B LIFT (vs A) | -- | +0.10 | -- |
| C LIFT (vs A) | -- | -- | +0.12 |
| C vs B | -- | -- | +0.02 |
