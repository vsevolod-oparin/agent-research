# dotnet-framework-pro Evaluation (D/E/F/I/L/M/N/O)

## Task 1: dnf-001
**Ground Truth Summary:** GridView with 50K records. Must mention server-side paging, GridView properties (AllowPaging, PageSize), SQL-level pagination (OFFSET/FETCH or ROW_NUMBER), caching. Must not give vague advice or suggest migrating to .NET Core.

### Condition D
- must_mention: 4/4 (server-side paging, AllowPaging/AllowCustomPaging/PageSize, OFFSET/FETCH, caching via HttpRuntime.Cache)
- must_not violations: none
- **Precision:** 5 -- All advice specific and correct
- **Completeness:** 5 -- Full code: SQL, ASPX, code-behind, repository
- **Actionability:** 5 -- Copy-pasteable code
- **Structure:** 5 -- Layered approach with expected results
- **Efficiency:** 4 -- Thorough but lengthy
- **Depth:** 5 -- Includes ViewState optimization, indexing, UpdatePanel mention
- **Composite: 4.73**

### Condition E
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4 -- Shorter but hits all points
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 5
- **Depth:** 4
- **Composite: 4.53**

### Condition F
- must_mention: 4/4 (uses ObjectDataSource approach)
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- ObjectDataSource, covering index, ROW_NUMBER mentioned
- **Actionability:** 5
- **Structure:** 5 -- Clear multi-step
- **Efficiency:** 4
- **Depth:** 5
- **Composite: 4.73**

### Condition I
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Five layers, "What NOT to do" section
- **Actionability:** 5
- **Structure:** 5 -- Layered strategy
- **Efficiency:** 3 -- Very verbose
- **Depth:** 5 -- Warns against half-async, output caching misuse
- **Composite: 4.60**

### Condition L
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Full stored procedure with sort whitelist
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3 -- Extremely verbose with custom pager
- **Depth:** 5
- **Composite: 4.60**

### Condition M
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 4
- **Depth:** 5
- **Composite: 4.73**

### Condition N
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- ObjectDataSource approach
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 4
- **Depth:** 5
- **Composite: 4.73**

### Condition O
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 4
- **Depth:** 4
- **Composite: 4.40**

---

## Task 2: dnf-002
**Ground Truth Summary:** WCF message size quota. Must mention maxReceivedMessageSize, maxBufferSize/maxBufferPoolSize, specific XML config, streaming transfer mode. Before/after comparison.

### Condition D
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Both client/server config, IIS limits, programmatic config, streaming
- **Actionability:** 5 -- Full XML snippets
- **Structure:** 5 -- Table of settings, before/after implicit via defaults
- **Efficiency:** 4
- **Depth:** 5 -- Security warning about int.MaxValue, IIS httpRuntime
- **Composite: 4.73**

### Condition E
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 5
- **Depth:** 4
- **Composite: 4.40**

### Condition F
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Full client/server configs, IIS layer, readerQuotas
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 4
- **Depth:** 5
- **Composite: 4.73**

### Condition I
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Three quota layers, defaults table, WCF tracing, streaming
- **Actionability:** 5
- **Structure:** 5 -- Quota layers table
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition L
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition M
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 4
- **Depth:** 4 -- Uses wsHttpBinding instead of basicHttpBinding, slightly off-pattern
- **Composite: 4.40**

### Condition N
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 4
- **Depth:** 5
- **Composite: 4.73**

### Condition O
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5
- **Actionability:** 5
- **Structure:** 5 -- Diagnostics with WCF tracing
- **Efficiency:** 4
- **Depth:** 5
- **Composite: 4.73**

---

## Task 3: dnf-003
**Ground Truth Summary:** Windows Auth for Web Forms with AD users. Must mention IIS config, web.config mode="Windows", deny anonymous, WindowsPrincipal/IsInRole. Must not suggest OAuth/JWT.

### Condition D
- must_mention: 4/4
- must_not violations: none -- appropriately focuses on Windows Auth
- **Precision:** 5
- **Completeness:** 5 -- IIS config, web.config, IsInRole, base page class, location-based auth, Kerberos note
- **Actionability:** 5
- **Structure:** 5 -- Step-by-step
- **Efficiency:** 4
- **Depth:** 5 -- Kerberos vs NTLM, Extended Protection
- **Composite: 4.73**

### Condition E
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4 -- Shorter, mentions ADFS for external as alternative
- **Actionability:** 5
- **Structure:** 4
- **Efficiency:** 5
- **Depth:** 4
- **Composite: 4.40**

### Condition F
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- PowerShell commands, roleManager, location elements
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 4
- **Depth:** 5
- **Composite: 4.73**

### Condition I
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Includes Forms Auth against AD as alternative, custom RoleProvider, rollout strategy
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3 -- Very long with two approaches
- **Depth:** 5
- **Composite: 4.60**

### Condition L
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition M
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- ViewStateUserKey CSRF protection, browser compatibility notes
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 4
- **Depth:** 5
- **Composite: 4.73**

### Condition N
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- Forms Auth with LDAP alternative, ViewStateUserKey
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 4
- **Depth:** 5
- **Composite: 4.73**

### Condition O
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 4
- **Depth:** 5
- **Composite: 4.73**

---

## Task 4: dnf-004
**Ground Truth Summary:** Windows Service OOM with MSMQ. Must mention memory leak investigation (perfmon, profiler), common causes (events, growing collections, LOH), structured logging, graceful degradation (GC.Collect last resort, circuit breaker). Ordered diagnostic steps and ranked causes.

### Condition D
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- procdump, WinDbg, 4 causes with code, memory watchdog, service recovery
- **Actionability:** 5 -- Full code examples for each cause and fix
- **Structure:** 5 -- Ordered steps, ranked causes
- **Efficiency:** 3 -- Very long
- **Depth:** 5 -- ArrayPool, LOH compaction, PerformanceCounter
- **Composite: 4.60**

### Condition E
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4 -- Table format for leak sources, shorter
- **Actionability:** 4
- **Structure:** 4 -- Diagnosis/fix phases
- **Efficiency:** 5
- **Depth:** 4 -- XmlSerializer cache leak mentioned
- **Composite: 4.40**

### Condition F
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- PerformanceCounter, dotMemory, WinDbg, 4 causes, MemoryCache with config
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition I
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- 5 causes, bitness check, XmlSerializer, service recovery, perfmon counters
- **Actionability:** 5
- **Structure:** 5 -- Diagnostic steps clearly ordered
- **Efficiency:** 3 -- Extremely verbose
- **Depth:** 5 -- Process bitness, ReceiveCompleted pattern, DbContext leak
- **Composite: 4.60**

### Condition L
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition M
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- 5 causes, bitness, XmlSerializer, structured logging
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5 -- DbContext leak, exception accumulation
- **Composite: 4.60**

### Condition N
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5 -- LOH, BlockingCollection, XmlSerializer, service recovery
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition O
- must_mention: 4/4
- must_not violations: none
- **Precision:** 5
- **Completeness:** 5
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

---

## Task 5: dnf-005
**Ground Truth Summary:** Expose .NET Framework 4.8 libraries as REST API. Must mention Web API 2, direct class library references, OWIN self-hosting, API versioning. Must not suggest ASP.NET Core or WCF REST.

### Condition D
- must_mention: 3/4 (Web API 2 yes, direct references yes, OWIN yes, API versioning not mentioned)
- must_not violations: 1 -- Includes WCF REST as Option 4, though noting it's not recommended
- **Precision:** 4 -- Including WCF REST option is against must_not
- **Completeness:** 4 -- Missing versioning, but includes add-to-WebForms option
- **Actionability:** 5
- **Structure:** 5 -- Multiple options clearly compared
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.20**

### Condition E
- must_mention: 3/4 (missing versioning)
- must_not violations: none
- **Precision:** 5
- **Completeness:** 3
- **Actionability:** 4
- **Structure:** 4
- **Efficiency:** 5
- **Depth:** 3
- **Composite: 3.93**

### Condition F
- must_mention: 3/4 (missing versioning)
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4 -- Comparison table, three options
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 4
- **Depth:** 4
- **Composite: 4.40**

### Condition I
- must_mention: 4/4 (mentions versioning strategy)
- must_not violations: 0 -- Explicitly says do not use WCF REST
- **Precision:** 5
- **Completeness:** 5 -- DI, Swagger, versioning, error handling, "What NOT to Do"
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition L
- must_mention: 3/4 (missing versioning)
- must_not violations: none
- **Precision:** 5
- **Completeness:** 4
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.47**

### Condition M
- must_mention: 4/4 (mentions versioning)
- must_not violations: 0 -- Says don't use WCF REST
- **Precision:** 5
- **Completeness:** 5 -- OData option, .NET Standard 2.0 extraction
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.60**

### Condition N
- must_mention: 3/4 (missing versioning)
- must_not violations: 0 -- Warns against WCF REST
- **Precision:** 5
- **Completeness:** 4 -- OData option, .NET Standard 2.0 option
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 3
- **Depth:** 5
- **Composite: 4.47**

### Condition O
- must_mention: 3/4 (missing versioning)
- must_not violations: 0 -- Warns against WCF REST
- **Precision:** 5
- **Completeness:** 4 -- .NET Standard 2.0 option
- **Actionability:** 5
- **Structure:** 5
- **Efficiency:** 4
- **Depth:** 5
- **Composite: 4.53**

---

## Summary

| Task | D | E | F | I | L | M | N | O |
|------|---|---|---|---|---|---|---|---|
| dnf-001 | 4.73 | 4.53 | 4.73 | 4.60 | 4.60 | 4.73 | 4.73 | 4.40 |
| dnf-002 | 4.73 | 4.40 | 4.73 | 4.60 | 4.60 | 4.40 | 4.73 | 4.73 |
| dnf-003 | 4.73 | 4.40 | 4.73 | 4.60 | 4.60 | 4.73 | 4.73 | 4.73 |
| dnf-004 | 4.60 | 4.40 | 4.60 | 4.60 | 4.60 | 4.60 | 4.60 | 4.60 |
| dnf-005 | 4.20 | 3.93 | 4.40 | 4.60 | 4.47 | 4.60 | 4.47 | 4.53 |
| **Mean** | **4.60** | **4.33** | **4.64** | **4.60** | **4.57** | **4.61** | **4.65** | **4.60** |
