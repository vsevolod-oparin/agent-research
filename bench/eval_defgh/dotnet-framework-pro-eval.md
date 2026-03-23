# dotnet-framework-pro Evaluation (D/E/F/G/H)

## Task 1: dnf-001

**Ground Truth Summary:** GridView with 50K records. Must mention server-side paging, specific GridView properties (AllowPaging, PageSize), SQL-level pagination (OFFSET/FETCH or ROW_NUMBER), caching for repeated queries. Must NOT give vague advice or suggest migrating to .NET Core.

### Condition D
- must_mention coverage: 4/4 -- Server-side paging, AllowPaging/AllowCustomPaging/PageSize, OFFSET/FETCH SQL, caching (HttpRuntime.Cache)
- must_not violations: none
- Completeness: 5 -- Full code-behind, SQL, GridView markup, additional optimizations
- Precision: 5 -- Correct WF 4.8 API usage, VirtualItemCount, AllowCustomPaging
- Actionability: 5 -- Complete working code examples end-to-end
- Structure: 5 -- Layered solution with clear steps
- Efficiency: 4 -- Thorough but appropriate length
- Depth: 5 -- ViewState bloat, database indexes, output caching, UpdatePanel
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- All items covered
- must_not violations: none
- Completeness: 4 -- Covers main points but less complete code
- Precision: 5 -- Accurate
- Actionability: 4 -- Code examples but less complete than D
- Structure: 4 -- Clean but brief
- Efficiency: 5 -- Very concise
- Depth: 3 -- Less detail on caching, ViewState, indexes
- **Composite: 4.20**

### Condition F
- must_mention coverage: 4/4 -- All covered with ObjectDataSource approach
- must_not violations: none
- Completeness: 5 -- Full ObjectDataSource pattern, SQL, indexes
- Precision: 5 -- Accurate with covering index suggestion
- Actionability: 5 -- Complete repository and GridView markup
- Structure: 5 -- Clear numbered steps
- Efficiency: 4 -- Good length
- Depth: 5 -- Covering index, ObjectDataSource pattern
- **Composite: 4.87**

### Condition G
- must_mention coverage: 4/4 -- All covered comprehensively
- must_not violations: none
- Completeness: 5 -- End-to-end implementation with stored procedure
- Precision: 5 -- Correct .NET Framework 4.8 patterns
- Actionability: 5 -- Complete code, SQL, markup
- Structure: 5 -- Layered approach with "What NOT to do"
- Efficiency: 4 -- Detailed but well-paced
- Depth: 5 -- ObjectDataSource, export-to-CSV alternative, custom pager
- **Composite: 4.87**

### Condition H
- must_mention coverage: 4/4 -- All covered extensively
- must_not violations: none
- Completeness: 5 -- Most thorough with five layers
- Precision: 5 -- Accurate
- Actionability: 5 -- Complete code examples
- Structure: 5 -- Excellent layered structure with "What NOT to do"
- Efficiency: 3 -- Very verbose with five layers
- Depth: 5 -- Export-to-CSV, async pitfall warning, ObjectDataSource
- **Composite: 4.73**

---

## Task 2: dnf-002

**Ground Truth Summary:** WCF message size quota. Must mention maxReceivedMessageSize, maxBufferSize/maxBufferPoolSize, specific XML config example, streaming transfer mode. Should have exact config snippet and before/after.

### Condition D
- must_mention coverage: 4/4 -- maxReceivedMessageSize, maxBufferSize/maxBufferPoolSize, XML config, streaming transfer mode
- must_not violations: none
- Completeness: 5 -- Server and client config, readerQuotas, IIS limits, programmatic config
- Precision: 5 -- Correct WCF binding syntax
- Actionability: 5 -- Full XML snippets for both sides
- Structure: 5 -- Settings table with defaults explained
- Efficiency: 4 -- Comprehensive
- Depth: 5 -- IIS request limits, programmatic config, security warning
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- All covered
- must_not violations: none
- Completeness: 4 -- Covers main config but less detail on IIS
- Precision: 5 -- Accurate
- Actionability: 4 -- Config provided but briefer
- Structure: 4 -- Clean
- Efficiency: 5 -- Concise
- Depth: 3 -- Less detail on streaming, IIS limits
- **Composite: 4.20**

### Condition F
- must_mention coverage: 4/4 -- All covered
- must_not violations: none
- Completeness: 5 -- Client and server config, IIS limits
- Precision: 5 -- Accurate
- Actionability: 5 -- Full XML examples
- Structure: 5 -- Clear sections with key points summary
- Efficiency: 4 -- Good length
- Depth: 5 -- readerQuotas importance, IIS httpRuntime, binding type variations
- **Composite: 4.87**

### Condition G
- must_mention coverage: 4/4 -- All covered with quota layers table
- must_not violations: none
- Completeness: 5 -- Comprehensive with streaming code example
- Precision: 5 -- Accurate
- Actionability: 5 -- Full config with Stream operation contract
- Structure: 5 -- Quota layers table, clear sections
- Efficiency: 4 -- Detailed
- Depth: 5 -- Stream operation contract, six important details, WCF tracing
- **Composite: 4.87**

### Condition H
- must_mention coverage: 4/4 -- All covered comprehensively
- must_not violations: none
- Completeness: 5 -- Most thorough with verification via WCF tracing
- Precision: 5 -- Accurate
- Actionability: 5 -- Full config with quota layers table
- Structure: 5 -- Excellent with defaults table
- Efficiency: 3 -- Very verbose
- Depth: 5 -- WCF tracing for verification, netTcpBinding note
- **Composite: 4.73**

---

## Task 3: dnf-003

**Ground Truth Summary:** Add auth to Web Forms app with AD users. Must mention Windows Authentication in IIS, web.config authentication mode="Windows", deny anonymous, WindowsPrincipal/Identity for role checks. Must NOT suggest OAuth/JWT.

### Condition D
- must_mention coverage: 4/4 -- IIS Windows Auth, web.config mode="Windows", deny anonymous, User.IsInRole with AD groups
- must_not violations: none -- No OAuth/JWT suggestion
- Completeness: 5 -- IIS config, web.config, code-behind, role-based auth, base page pattern
- Precision: 5 -- Correct .NET Framework patterns
- Actionability: 5 -- Complete step-by-step with code
- Structure: 5 -- Six clear steps
- Efficiency: 4 -- Thorough
- Depth: 5 -- Kerberos vs NTLM, Extended Protection, internet-facing caveat
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- All covered
- must_not violations: none
- Completeness: 4 -- Covers core but less detail on role checks
- Precision: 5 -- Accurate
- Actionability: 4 -- Config and code provided
- Structure: 4 -- Clean
- Efficiency: 5 -- Concise
- Depth: 3 -- Brief on Kerberos, mentions double-hop
- **Composite: 4.20**

### Condition F
- must_mention coverage: 4/4 -- All covered with roleManager
- must_not violations: none
- Completeness: 5 -- Includes PowerShell IIS config, roleManager provider
- Precision: 5 -- Accurate
- Actionability: 5 -- PowerShell, XML, C# examples
- Structure: 5 -- Clear numbered steps
- Efficiency: 4 -- Good length
- Depth: 5 -- AspNetWindowsTokenRoleProvider, IIS Express dev config
- **Composite: 4.87**

### Condition G
- must_mention coverage: 4/4 -- All covered with WindowsIdentity cast
- must_not violations: none
- Completeness: 5 -- Complete with AD attribute lookup, Forms Auth alternative
- Precision: 5 -- Accurate
- Actionability: 5 -- Full code for AD attribute lookup
- Structure: 5 -- Clear steps with alternatives
- Efficiency: 4 -- Thorough
- Depth: 5 -- DirectoryServices.AccountManagement, Forms Auth fallback, security considerations
- **Composite: 4.87**

### Condition H
- must_mention coverage: 4/4 -- All covered extensively
- must_not violations: none
- Completeness: 5 -- Most thorough with custom RoleProvider, rollout strategy
- Precision: 5 -- Accurate
- Actionability: 5 -- Complete code including custom RoleProvider
- Structure: 5 -- Excellent with rollout strategy
- Efficiency: 3 -- Very verbose
- Depth: 5 -- Custom RoleProvider, Forms Auth with LDAP, rollout strategy
- **Composite: 4.73**

---

## Task 4: dnf-004

**Ground Truth Summary:** Windows Service OOM with MSMQ. Must mention memory leak investigation (perfmon, profiler), common causes (events, collections, LOH), structured logging, graceful degradation (GC.Collect as last resort, circuit breaker). Structure: diagnostic steps ordered, causes ranked.

### Condition D
- must_mention coverage: 4/4 -- Memory profiling (procdump/WinDbg), common causes (undisposed Message, collections, events, LOH), structured logging (PerformanceCounter), graceful degradation (memory watchdog, GC.Collect, service recovery)
- must_not violations: none
- Completeness: 5 -- Four specific causes with code, memory watchdog, service recovery
- Precision: 5 -- Correct MSMQ patterns, IDisposable, LOH compaction
- Actionability: 5 -- Complete bad/good code pairs, procdump command, sc failure command
- Structure: 5 -- Diagnostic steps then causes then resilience
- Efficiency: 4 -- Comprehensive
- Depth: 5 -- ArrayPool, LOH compaction, unmanaged stream leak detail
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 -- All covered
- must_not violations: none
- Completeness: 4 -- Covers main causes in table form, less code
- Precision: 5 -- Accurate
- Actionability: 4 -- Table format, less detailed code
- Structure: 4 -- Phase 1/Phase 2 structure
- Efficiency: 5 -- Concise
- Depth: 3 -- XmlSerializer cache note is good but less detail overall
- **Composite: 4.20**

### Condition F
- must_mention coverage: 4/4 -- All covered with detailed patterns
- must_not violations: none
- Completeness: 5 -- Five causes with code, MemoryCache solution
- Precision: 5 -- Accurate
- Actionability: 5 -- Detailed bad/good code, MemoryCache config XML
- Structure: 5 -- Clear diagnostic then fix pattern
- Efficiency: 4 -- Thorough
- Depth: 5 -- MemoryCache with XML config, dotMemory, WinDbg SOS commands
- **Composite: 4.87**

### Condition G
- must_mention coverage: 4/4 -- All covered extensively
- must_not violations: none
- Completeness: 5 -- Five patterns with detailed code
- Precision: 5 -- Accurate
- Actionability: 5 -- Complete code examples, procdump
- Structure: 5 -- Excellent diagnostic ordering
- Efficiency: 4 -- Detailed
- Depth: 5 -- Async receive pattern, XmlSerializer leak, BinaryMessageFormatter
- **Composite: 4.87**

### Condition H
- must_mention coverage: 4/4 -- All covered with additional patterns
- must_not violations: none
- Completeness: 5 -- Five causes including DB connection leaks
- Precision: 5 -- Accurate
- Actionability: 5 -- Detailed bad/good code, service recovery config
- Structure: 5 -- Clear diagnostic steps, patterns labeled A-E
- Efficiency: 3 -- Very verbose
- Depth: 5 -- Platform target/bitness check, XmlSerializer dynamic assembly leak
- **Composite: 4.73**

---

## Task 5: dnf-005

**Ground Truth Summary:** Expose .NET Framework 4.8 class libraries as REST API. Must mention ASP.NET Web API 2, reference existing libraries directly, OWIN self-hosting alternative, API versioning. Must NOT suggest ASP.NET Core or WCF REST.

### Condition D
- must_mention coverage: 3/4 -- Web API 2, reference directly, OWIN self-host; API versioning not explicitly mentioned
- must_not violations: 1 -- Mentions WCF REST as Option 4 (though disclaims "Not recommended for new work")
- Completeness: 4 -- Covers three options plus WCF REST
- Precision: 4 -- WCF REST inclusion is technically a must_not violation though it's deprecated
- Actionability: 5 -- Full controller, WebApiConfig, OWIN code
- Structure: 5 -- Clear options with pros/cons
- Efficiency: 4 -- Thorough
- Depth: 4 -- Good coverage but missing versioning
- **Composite: 4.27**

### Condition E
- must_mention coverage: 3/4 -- Web API 2, reference directly, OWIN self-host; no versioning
- must_not violations: none
- Completeness: 4 -- Three options with cross-cutting concerns
- Precision: 5 -- Accurate
- Actionability: 4 -- Controller example, brief OWIN
- Structure: 4 -- Clean
- Efficiency: 5 -- Concise
- Depth: 3 -- Swagger, CORS mentions but brief
- **Composite: 4.07**

### Condition F
- must_mention coverage: 3/4 -- Web API 2, reference directly, OWIN; no versioning
- must_not violations: none
- Completeness: 5 -- Three options with comparison table
- Precision: 5 -- Accurate
- Actionability: 5 -- Full code, NuGet commands, OWIN startup
- Structure: 5 -- Comparison table
- Efficiency: 4 -- Thorough
- Depth: 4 -- Good coverage with comparison table
- **Composite: 4.53**

### Condition G
- must_mention coverage: 3/4 -- Web API 2, reference directly, OWIN; no explicit versioning section
- must_not violations: none -- Explicitly says "Do not use WCF REST"
- Completeness: 5 -- Complete with DI, serialization, error handling, CORS
- Precision: 5 -- Accurate
- Actionability: 5 -- Full code end-to-end with DI
- Structure: 5 -- Excellent step-by-step with hosting table
- Efficiency: 4 -- Detailed
- Depth: 5 -- Unity DI, global exception handler, CORS, Swagger
- **Composite: 4.73**

### Condition H
- must_mention coverage: 4/4 -- Web API 2, reference directly, OWIN, API versioning mentioned
- must_not violations: none -- Explicitly says not to use WCF REST
- Completeness: 5 -- Most thorough with versioning, DI, Swagger, error handling
- Precision: 5 -- Accurate
- Actionability: 5 -- Complete code with Unity DI, exception filter
- Structure: 5 -- Excellent step-by-step with cross-cutting section
- Efficiency: 3 -- Very verbose
- Depth: 5 -- Versioning strategy, DI, global exception handler, DataSet warning
- **Composite: 4.73**

---

## Summary

| Task | D | E | F | G | H |
|------|---|---|---|---|---|
| dnf-001 | 4.87 | 4.20 | 4.87 | 4.87 | 4.73 |
| dnf-002 | 4.87 | 4.20 | 4.87 | 4.87 | 4.73 |
| dnf-003 | 4.87 | 4.20 | 4.87 | 4.87 | 4.73 |
| dnf-004 | 4.87 | 4.20 | 4.87 | 4.87 | 4.73 |
| dnf-005 | 4.27 | 4.07 | 4.53 | 4.73 | 4.73 |
| **Mean** | **4.75** | **4.17** | **4.80** | **4.84** | **4.73** |
