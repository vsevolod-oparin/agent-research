# dotnet-framework-pro Evaluation (D/E/F) -- Full

## Task 1: dnf-001

**Ground Truth Summary:** GridView with 50K records. Must mention server-side paging, specific GridView properties (AllowPaging, PageSize), SQL-level pagination (OFFSET/FETCH or ROW_NUMBER), caching. Must not give vague advice or suggest migrating to .NET Core.

### Condition D
- must_mention coverage: 4/4 -- server-side paging, AllowPaging/AllowCustomPaging/PageSize, OFFSET/FETCH SQL, caching (HttpRuntime.Cache for count)
- must_not violations: none (no vague advice, no .NET Core suggestion)
- Completeness: 5 -- Full end-to-end solution with SQL, GridView config, code-behind, repository
- Precision: 5 -- All code correct, AllowCustomPaging + VirtualItemCount pattern is exactly right
- Actionability: 5 -- Copy-paste ready code with SQL, ASPX, C#
- Structure: 5 -- Step-by-step numbered approach
- Efficiency: 4 -- Thorough, slightly long but all relevant
- Depth: 5 -- ViewState disabling, output caching, UpdatePanel consideration, covering index suggestion
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- server-side paging, AllowPaging/AllowCustomPaging/PageSize, OFFSET/FETCH, caching mentioned (for count)
- must_not violations: none
- Completeness: 4 -- Covers main solution well, less detailed on additional optimizations
- Precision: 5 -- Accurate
- Actionability: 4 -- SQL + config + code-behind provided but less complete than D
- Structure: 4 -- Clean sections
- Efficiency: 5 -- Concise and focused
- Depth: 3 -- Less depth on ViewState, caching, indexing
- **Composite: 4.20**

### Condition F
- must_mention coverage: 4/4 -- server-side paging, AllowPaging/PageSize, OFFSET/FETCH + ROW_NUMBER, caching (count query)
- must_not violations: none
- Completeness: 5 -- Full solution with ObjectDataSource approach (alternative pattern), covering index
- Precision: 5 -- Accurate, ObjectDataSource with EnablePaging is a valid .NET Framework pattern
- Actionability: 5 -- Full code examples including SQL index creation
- Structure: 5 -- Well-organized multi-step approach
- Efficiency: 4 -- Thorough
- Depth: 5 -- Covering index suggestion, ObjectDataSource pattern, ViewState analysis
- **Composite: 4.87**

---

## Task 2: dnf-002

**Ground Truth Summary:** WCF message size exceeded. Must mention maxReceivedMessageSize, maxBufferSize/maxBufferPoolSize, specific XML config, streaming transfer mode.

### Condition D
- must_mention coverage: 4/4 -- maxReceivedMessageSize, maxBufferSize+maxBufferPoolSize, full XML config, streaming transferMode
- must_not violations: none
- Completeness: 5 -- Server + client config, programmatic config, IIS limits
- Precision: 5 -- Correct defaults noted (65536), security warning about int.MaxValue
- Actionability: 5 -- Full XML snippets for both sides, table of settings
- Structure: 5 -- Settings table, before/after implied, numbered considerations
- Efficiency: 4 -- Thorough, some redundancy in XML examples
- Depth: 5 -- IIS request limits, readerQuotas, programmatic config, security considerations
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- All four items covered
- must_not violations: none
- Completeness: 4 -- Server + client, streaming, IIS limits
- Precision: 5 -- Accurate
- Actionability: 4 -- XML config provided, key points listed
- Structure: 4 -- Clean sections
- Efficiency: 5 -- Very concise
- Depth: 4 -- Mentions IIS limits and readerQuotas importance
- **Composite: 4.40**

### Condition F
- must_mention coverage: 4/4 -- All four items covered with full detail
- must_not violations: none
- Completeness: 5 -- Client + server XML, readerQuotas, IIS httpRuntime, binding types
- Precision: 5 -- Accurate, correct default noted, units clarified (KB vs bytes)
- Actionability: 5 -- Full XML snippets, key points summary
- Structure: 5 -- Well-organized with separate sections per concern
- Efficiency: 4 -- Thorough
- Depth: 5 -- Explains readerQuotas interaction, IIS layer independence, wsHttpBinding/netTcpBinding note
- **Composite: 4.87**

---

## Task 3: dnf-003

**Ground Truth Summary:** Add Windows Auth to Web Forms with AD users. Must mention Windows Authentication in IIS, web.config mode="Windows", deny anonymous, WindowsPrincipal/WindowsIdentity for role checks. Must not suggest OAuth/JWT.

### Condition D
- must_mention coverage: 4/4 -- IIS Windows Auth config, web.config mode="Windows", deny users="?", User.IsInRole with AD groups
- must_not violations: none (no OAuth/JWT, correctly positions as intranet solution)
- Completeness: 5 -- IIS config, web.config, code-behind, role-based auth, base page pattern, public page exceptions
- Precision: 5 -- All config correct, notes Kerberos vs NTLM
- Actionability: 5 -- Full XML + C# code, ready to implement
- Structure: 5 -- Step-by-step (6 steps), logical progression
- Efficiency: 4 -- Very thorough, slightly long
- Depth: 5 -- Kerberos/NTLM, Extended Protection, audit logging, internet-facing caveat, base page pattern
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- IIS config, web.config mode="Windows", deny anonymous, IsInRole
- must_not violations: none
- Completeness: 4 -- Core solution covered with role-based access
- Precision: 5 -- Accurate
- Actionability: 4 -- XML + C# provided
- Structure: 4 -- Clean numbered steps
- Efficiency: 5 -- Concise
- Depth: 3 -- Kerberos double-hop noted but less depth on edge cases
- **Composite: 4.20**

### Condition F
- must_mention coverage: 4/4 -- IIS config (with PowerShell), web.config mode="Windows", deny users="?", User.IsInRole + roleManager config
- must_not violations: none
- Completeness: 5 -- IIS config, web.config, role checks, location elements, roleManager provider
- Precision: 5 -- Accurate, includes AspNetWindowsTokenRoleProvider which is a good detail
- Actionability: 5 -- Full XML + C# + PowerShell commands
- Structure: 5 -- Well-organized 4-step approach with additional considerations
- Efficiency: 4 -- Thorough
- Depth: 4 -- PowerShell IIS config, roleManager, Kerberos SPN note, dev environment tip
- **Composite: 4.73**

---

## Task 4: dnf-004

**Ground Truth Summary:** Windows Service OOM with MSMQ. Must mention memory leak investigation (perfmon, profiler), common causes (event handlers, growing collections, LOH), structured logging, graceful degradation (GC.Collect last resort, circuit breaker). Should have ordered diagnostic steps and ranked causes.

### Condition D
- must_mention coverage: 4/4 -- memory profiling (procdump, WinDbg, perfmon counters), common causes (undisposed Message, growing collections, event handlers, LOH), structured logging, graceful degradation (GC.Collect, FailFast + service recovery)
- must_not violations: none
- Completeness: 5 -- Comprehensive diagnosis + fix + prevention checklist
- Precision: 5 -- MSMQ-specific details correct (Message IDisposable, IStream reference)
- Actionability: 5 -- Full code examples for diagnosis, each fix, watchdog, recovery config
- Structure: 5 -- Ordered: diagnose -> common causes -> resilience -> prevention checklist
- Efficiency: 4 -- Long but dense with useful content
- Depth: 5 -- Native memory leak via IStream, ArrayPool for LOH, LOH compaction, sc failure command
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- Memory telemetry, common causes (MessageQueue, events, XmlSerializer, unbounded collections), logging, service recovery
- must_not violations: none
- Completeness: 4 -- Covers main points in Phase 1/2 structure
- Precision: 5 -- Accurate, XmlSerializer cache is a good MSMQ-specific catch
- Actionability: 4 -- Code provided, table of leak sources, but less detailed fixes
- Structure: 4 -- Phase 1 diagnose / Phase 2 fix
- Efficiency: 5 -- Concise table format for leak sources
- Depth: 4 -- XmlSerializer detail is unique, but less code examples for fixes
- **Composite: 4.40**

### Condition F
- must_mention coverage: 4/4 -- Memory telemetry (PerformanceCounter, WinDbg), common causes (MessageQueue disposal, event handlers, LOH, unbounded collections), logging, LOH compaction
- must_not violations: none
- Completeness: 5 -- Comprehensive with code for each cause, MemoryCache alternative
- Precision: 5 -- Accurate, includes finalizequeue check in WinDbg
- Actionability: 5 -- Full before/after code for each cause, MemoryCache with config XML
- Structure: 5 -- Numbered diagnosis steps, cause-by-cause fixes, action plan
- Efficiency: 4 -- Thorough
- Depth: 5 -- MemoryCache config XML, WinDbg commands (finalizequeue), RecyclableMemoryStream mention, dotMemory suggestion
- **Composite: 4.87**

---

## Task 5: dnf-005

**Ground Truth Summary:** Expose .NET Framework 4.8 class libraries as REST API. Must mention Web API 2 (not Core), reference existing libraries directly, OWIN self-hosting, API versioning. Must not suggest ASP.NET Core or WCF REST.

### Condition D
- must_mention coverage: 3/4 -- Web API 2 (correct), direct project references, OWIN self-host. Missing API versioning strategy. Also mentions WCF REST as Option 4 (borderline must_not violation).
- must_not violations: 1 -- Includes WCF REST (Option 4), though explicitly discourages it ("Not recommended for new work"). Does not suggest ASP.NET Core.
- Completeness: 5 -- Four options including Web Forms integration
- Precision: 4 -- WCF REST inclusion is technically a violation though caveated
- Actionability: 5 -- Full code examples for Web API 2 + OWIN
- Structure: 5 -- Options clearly compared with pros/cons and recommendation
- Efficiency: 4 -- Long but informative
- Depth: 4 -- Multiple hosting options, route config, JSON formatting
- **Composite: 4.40**

### Condition E
- must_mention coverage: 3/4 -- Web API 2, direct references, OWIN self-host. Missing API versioning.
- must_not violations: none
- Completeness: 4 -- Three options covered with cross-cutting concerns
- Precision: 5 -- Accurate, no prohibited suggestions
- Actionability: 4 -- Code examples, NuGet packages listed
- Structure: 4 -- Options A/B/C with cross-cutting concerns section
- Efficiency: 5 -- Concise
- Depth: 3 -- Mentions Swagger/CORS/exception handling but shallow
- **Composite: 4.13**

### Condition F
- must_mention coverage: 3/4 -- Web API 2, direct references, OWIN self-host. Missing API versioning strategy.
- must_not violations: none
- Completeness: 5 -- Three detailed options with comparison table
- Precision: 5 -- Accurate, no prohibited suggestions
- Actionability: 5 -- Full code for all three options, NuGet packages, Global.asax setup
- Structure: 5 -- Comparison table, clear option layout
- Efficiency: 4 -- Thorough but justified
- Depth: 4 -- DI mention (Unity/Autofac), comparison table with multiple criteria
- **Composite: 4.60**

---

## Summary

| Task | D | E | F |
|------|---|---|---|
| dnf-001 | 4.87 | 4.20 | 4.87 |
| dnf-002 | 4.87 | 4.40 | 4.87 |
| dnf-003 | 4.87 | 4.20 | 4.73 |
| dnf-004 | 4.87 | 4.40 | 4.87 |
| dnf-005 | 4.40 | 4.13 | 4.60 |
| **Mean** | **4.78** | **4.27** | **4.79** |
| E LIFT (vs D) | -- | -0.51 | -- |
| F LIFT (vs D) | -- | -- | +0.01 |
| F vs E | -- | -- | +0.52 |
