# dotnet-framework-pro Evaluation (D/E/F)

## Task 1: dnf-001

**Ground Truth Summary:** Must mention: server-side paging (not loading all records); specific GridView properties (AllowPaging, PageSize); SQL-level pagination (OFFSET/FETCH or ROW_NUMBER); consider caching for repeated queries. Must NOT: vague advice like "optimize performance"; suggest migrating to .NET Core.

### Condition D
- must_mention coverage: 4/4 -- Hit: server-side paging (AllowPaging, AllowCustomPaging, PageSize), SQL OFFSET/FETCH, caching (HttpRuntime.Cache for total count, OutputCache).
- must_not violations: None (no vague advice, no .NET Core suggestion)
- Completeness: 5 -- All must-mention items plus ViewState optimization, database indexes, UpdatePanel suggestion.
- Precision: 5 -- All code snippets are correct Web Forms / SQL Server syntax.
- Actionability: 5 -- Full working code: SQL query, ASPX markup, C# code-behind, repository method.
- Structure: 5 -- Clear step-by-step (SQL -> GridView config -> code-behind -> repository), expected results section.
- Efficiency: 4 -- Thorough but slightly verbose; the UpdatePanel and OutputCache sections add bulk.
- Depth: 5 -- Explains VirtualItemCount, AllowCustomPaging behavior, ViewState impact. Non-obvious details.
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- Hit all: server-side paging with AllowPaging/AllowCustomPaging/PageSize, SQL OFFSET/FETCH, caching mentioned (ViewState disabled, indexing).
- must_not violations: None
- Completeness: 4 -- Covers core must-mentions but caching for repeated queries is only implicit (indexes mentioned, not explicit query caching).
- Precision: 5 -- Accurate code and config.
- Actionability: 5 -- Working code examples.
- Structure: 4 -- Clean but less detailed than D.
- Efficiency: 5 -- Very concise, no filler.
- Depth: 3 -- Less explanation of VirtualItemCount behavior; more surface-level.
- **Composite: 4.33**

### Condition F
- must_mention coverage: 4/4 -- Hit all: server-side paging with AllowPaging/PageSize, SQL OFFSET/FETCH plus ROW_NUMBER mention, caching (cache count result), ObjectDataSource with custom paging.
- must_not violations: None
- Completeness: 5 -- All points covered plus ObjectDataSource approach, covering index with INCLUDE.
- Precision: 5 -- Correct syntax throughout.
- Actionability: 5 -- Full code with ObjectDataSource, repository, and SQL.
- Structure: 5 -- Numbered steps, expected results summary.
- Efficiency: 4 -- Thorough.
- Depth: 5 -- ObjectDataSource approach is a strong .NET Framework-specific addition; covering index with INCLUDE is advanced.
- **Composite: 4.87**

---

## Task 2: dnf-002

**Ground Truth Summary:** Must mention: maxReceivedMessageSize in binding configuration; maxBufferSize and maxBufferPoolSize; specific XML config example with values; consider streaming transfer mode for very large payloads. Structure: exact config snippet; before/after comparison.

### Condition D
- must_mention coverage: 4/4 -- Hit all: maxReceivedMessageSize, maxBufferSize, maxBufferPoolSize, XML config examples (both server and client), streaming transferMode.
- must_not violations: None
- Completeness: 5 -- Both server and client config, readerQuotas, IIS limits, programmatic config, streaming mode.
- Precision: 5 -- All config values and XML syntax correct.
- Actionability: 5 -- Copy-paste ready config snippets for both sides.
- Structure: 5 -- Table explaining defaults, server/client configs, key considerations.
- Efficiency: 4 -- Comprehensive but lengthy; IIS limits section and programmatic config could be trimmed.
- Depth: 5 -- Mentions IIS httpRuntime/requestFiltering (a real gotcha), programmatic config option, DoS warning.
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- Hit all: maxReceivedMessageSize, maxBufferSize, XML config, streaming transferMode.
- must_not violations: None
- Completeness: 4 -- Covers core points, mentions IIS limits. maxBufferPoolSize not explicitly shown but bufferSize and readerQuotas are.
- Precision: 5 -- Accurate config.
- Actionability: 5 -- Config snippets provided.
- Structure: 4 -- Clean but less detailed than D (only one side of config shown, mirror instruction for client).
- Efficiency: 5 -- Very concise.
- Depth: 4 -- Key points bullet list is good; mentions IIS layer.
- **Composite: 4.53**

### Condition F
- must_mention coverage: 4/4 -- Hit all: maxReceivedMessageSize, maxBufferSize, maxBufferPoolSize, XML config (both sides), streaming transferMode mentioned via binding type notes.
- must_not violations: None
- Completeness: 5 -- Both client and server configs, readerQuotas, IIS limits, key points table.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Full config snippets, both sides.
- Structure: 5 -- Clear sections, explanation table, key points list.
- Efficiency: 4 -- Thorough.
- Depth: 5 -- Explains the difference between maxRequestLength (KB) and maxAllowedContentLength (bytes) -- a common gotcha. DoS warning included.
- **Composite: 4.87**

---

## Task 3: dnf-003

**Ground Truth Summary:** Must mention: Windows Authentication in IIS configuration; web.config authentication mode="Windows"; authorization rules (deny anonymous); WindowsPrincipal/WindowsIdentity for role checks. Must NOT: suggest OAuth/JWT (overkill for intranet AD scenario).

### Condition D
- must_mention coverage: 4/4 -- Hit all: IIS Windows Auth config, web.config mode="Windows", deny anonymous (<deny users="?"/>), role checks via User.IsInRole with AD groups.
- must_not violations: None (explicitly notes Windows Auth is "most natural" for intranet; mentions ADFS only for internet-facing caveat)
- Completeness: 5 -- Goes beyond basics: base page class, public page exceptions, Kerberos vs NTLM, Extended Protection.
- Precision: 5 -- All config and code correct.
- Actionability: 5 -- Step-by-step with IIS, web.config, code-behind, base page, location elements.
- Structure: 5 -- Six numbered steps, clear progression.
- Efficiency: 3 -- Very verbose; SecureBasePage and public page sections may be overkill for the question asked.
- Depth: 5 -- Kerberos/NTLM negotiation, Extended Protection, audit logging, internet-facing caveat.
- **Composite: 4.53**

### Condition E
- must_mention coverage: 4/4 -- Hit all: IIS config, web.config mode="Windows", deny anonymous, role checks with IsInRole.
- must_not violations: None
- Completeness: 4 -- Core items covered; mentions Kerberos double-hop, ADFS fallback for external users.
- Precision: 5 -- Accurate.
- Actionability: 5 -- Code examples for config and role checks.
- Structure: 4 -- Clean steps but less detailed.
- Efficiency: 5 -- Concise and focused.
- Depth: 4 -- Mentions Kerberos delegation (double-hop) and LDAP fallback.
- **Composite: 4.53**

### Condition F
- must_mention coverage: 4/4 -- Hit all: IIS config (with PowerShell commands), web.config mode="Windows", deny anonymous, role checks via User.IsInRole, roleManager with AspNetWindowsTokenRoleProvider.
- must_not violations: None
- Completeness: 5 -- Adds PowerShell IIS config, roleManager configuration, granular location elements for multiple areas.
- Precision: 5 -- Accurate throughout.
- Actionability: 5 -- PowerShell commands for IIS, XML configs, C# code, multiple location elements.
- Structure: 5 -- Well numbered, includes additional considerations.
- Efficiency: 4 -- Thorough; the multiple location examples add some bulk but are useful.
- Depth: 5 -- roleManager with AspNetWindowsTokenRoleProvider is a nice Framework-specific detail; Kerberos SPN mention.
- **Composite: 4.87**

---

## Task 4: dnf-004

**Ground Truth Summary:** Must mention: memory leak investigation (perfmon counters, memory profiler); common causes (event handler not unsubscribed, growing collections, LOH); add structured logging before crash; implement graceful degradation (GC.Collect as last resort, circuit breaker on queue). Structure: diagnostic steps ordered; likely causes ranked.

### Condition D
- must_mention coverage: 4/4 -- Hit all: memory diagnostics (PerformanceCounter, procdump, WinDbg), common causes (MSMQ Message not disposed, collections growth, event handlers, LOH), structured logging, graceful degradation (memory watchdog with GC.Collect and FailFast, service recovery config).
- must_not violations: None
- Completeness: 5 -- Comprehensive: procdump, WinDbg commands, 4 common causes with code, ArrayPool, memory watchdog, SC failure config.
- Precision: 5 -- All code and commands correct; MSMQ IDisposable pattern is accurate.
- Actionability: 5 -- Exact commands, before/after code for each cause, prevention checklist.
- Structure: 5 -- Diagnosis -> causes -> resilience -> prevention; ordered logically.
- Efficiency: 3 -- Very long; some code examples could be trimmed.
- Depth: 5 -- MSMQ Message IDisposable (unmanaged IStream), LOH compaction mode, ArrayPool, sc failure command.
- **Composite: 4.60**

### Condition E
- must_mention coverage: 4/4 -- Hit all: memory telemetry, procdump/WinDbg, common causes table (MessageQueue disposal, events, XmlSerializer cache, unbounded collections), graceful degradation (service recovery).
- must_not violations: None
- Completeness: 4 -- Good coverage in table format; less code detail for each cause.
- Precision: 5 -- Accurate; XmlSerializer caching tip is a genuine .NET Framework gotcha.
- Actionability: 4 -- Table format is quick-reference but less step-by-step for implementation.
- Structure: 4 -- Two phases (diagnose/fix) with table; clear but less detailed.
- Efficiency: 5 -- Very dense, table format maximizes signal.
- Depth: 4 -- XmlSerializer cache leak is a great non-obvious addition; less code-level detail.
- **Composite: 4.53**

### Condition F
- must_mention coverage: 4/4 -- Hit all: memory telemetry (PerformanceCounter, GC stats), profiling (dotMemory, WinDbg with SOS), common causes (MessageQueue/Message disposal, event handlers, LOH, unbounded collections with MemoryCache fix), logging, action plan.
- must_not violations: None
- Completeness: 5 -- All causes with code examples, MemoryCache with XML config, WinDbg commands including !finalizequeue.
- Precision: 5 -- Accurate throughout.
- Actionability: 5 -- Code for each cause with before/after, 7-step action plan.
- Structure: 5 -- Systematic: diagnose -> causes with code -> action plan.
- Efficiency: 4 -- Thorough but well-organized.
- Depth: 5 -- MemoryCache with XML config for cache limits, !finalizequeue WinDbg command, LOH compaction, ArrayPool + RecyclableMemoryStream.
- **Composite: 4.87**

---

## Task 5: dnf-005

**Ground Truth Summary:** Must mention: ASP.NET Web API 2 (framework-compatible, not Core); reference existing class libraries directly; OWIN self-hosting as alternative to IIS; API versioning strategy. Must NOT: suggest ASP.NET Core; suggest WCF REST (outdated).

### Condition D
- must_mention coverage: 3/4 -- Hit: ASP.NET Web API 2, reference class libraries directly, OWIN self-hosting. Missed: API versioning strategy not mentioned. Also includes WCF REST (Option 4) which is a must_not violation.
- must_not violations: 1 -- Includes WCF REST as Option 4, despite ground truth saying "suggest WCF REST (outdated approach)". However, D does note it's "Not recommended for new work."
- Completeness: 4 -- Covers 3 of 4 must-mentions well, plus adds Web Forms integration option.
- Precision: 4 -- Including WCF REST contradicts must_not, even with disclaimer. Otherwise accurate.
- Actionability: 5 -- Full code for Web API 2, OWIN, WCF REST, route config.
- Structure: 5 -- Four options with pros/cons and clear recommendation.
- Efficiency: 3 -- Very long; WCF REST option adds unnecessary length.
- Depth: 4 -- Good coverage of Web Forms integration path, JSON config.
- **Composite: 4.13**

### Condition E
- must_mention coverage: 3/4 -- Hit: ASP.NET Web API 2, reference class libraries, OWIN self-hosting. Missed: API versioning strategy.
- must_not violations: None
- Completeness: 4 -- Three options covered; adds cross-cutting concerns (Swagger, CORS, exception handling).
- Precision: 5 -- Accurate, no must_not violations.
- Actionability: 5 -- Code examples for main option, NuGet packages listed.
- Structure: 4 -- Three options with key principle at end.
- Efficiency: 5 -- Concise, focused.
- Depth: 3 -- Less detail on each option; cross-cutting concerns are listed but not explained.
- **Composite: 4.33**

### Condition F
- must_mention coverage: 3/4 -- Hit: ASP.NET Web API 2, reference class libraries, OWIN self-hosting. Missed: API versioning strategy.
- must_not violations: None
- Completeness: 4 -- Three options with comparison table, solution structure diagram.
- Precision: 5 -- Accurate throughout.
- Actionability: 5 -- Full code for all three options, NuGet packages, Global.asax integration.
- Structure: 5 -- Comparison table at end is excellent for decision-making.
- Efficiency: 4 -- Well-organized but lengthy.
- Depth: 5 -- Solution structure diagram, DI mention (Unity/Autofac), comparison table with 6 criteria.
- **Composite: 4.67**

---

## Summary

| Task | D | E | F |
|------|---|---|---|
| dnf-001 | 4.87 | 4.33 | 4.87 |
| dnf-002 | 4.87 | 4.53 | 4.87 |
| dnf-003 | 4.53 | 4.53 | 4.87 |
| dnf-004 | 4.60 | 4.53 | 4.87 |
| dnf-005 | 4.13 | 4.33 | 4.67 |
| **Mean** | **4.60** | **4.45** | **4.83** |
| E LIFT (vs D) | — | -0.15 | — |
| F LIFT (vs D) | — | — | +0.23 |
| F vs E | — | — | +0.38 |
