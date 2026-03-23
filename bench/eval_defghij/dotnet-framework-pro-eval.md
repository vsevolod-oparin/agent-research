# dotnet-framework-pro Evaluation (D/E/F/G/H/I/J)

## Task 1: dnf-001
**Ground Truth Summary:** GridView with 50K records, 12s render. Must mention server-side paging, AllowPaging/PageSize properties, SQL-level pagination (OFFSET/FETCH or ROW_NUMBER), caching. Must NOT give vague advice or suggest migrating to .NET Core.

### Condition D
- must_mention: 4/4 -- server-side paging, AllowPaging/AllowCustomPaging/PageSize, OFFSET/FETCH SQL, HttpRuntime.Cache
- must_not violations: none
- Completeness: 5 -- Full implementation with SQL, GridView markup, code-behind, repository
- Precision: 5 -- Framework 4.8 specific, correct APIs
- Actionability: 5 -- Complete working code examples
- Structure: 5 -- Step-by-step with additional optimizations
- Efficiency: 4 -- Thorough but appropriate length
- Depth: 5 -- ViewState, indexes, UpdatePanel, output caching
- **Composite: 4.87**

### Condition E
- must_mention: 4/4 -- all covered
- must_not violations: none
- Completeness: 4 -- Good but less detailed than D
- Precision: 5 -- Accurate
- Actionability: 5 -- Code examples
- Structure: 4 -- Clean
- Efficiency: 5 -- Concise
- Depth: 4 -- Good
- **Composite: 4.40**

### Condition F
- must_mention: 4/4 -- server-side paging, AllowCustomPaging/PageSize, OFFSET/FETCH, covering index
- must_not violations: none
- Completeness: 5 -- ObjectDataSource approach, detailed code
- Precision: 5 -- Accurate
- Actionability: 5 -- Full code examples
- Structure: 5 -- Well organized
- Efficiency: 4 -- Good length
- Depth: 5 -- Covering index, ObjectDataSource
- **Composite: 4.73**

### Condition G
- must_mention: 4/4 -- all covered including caching suggestion
- must_not violations: none
- Completeness: 5 -- Layered approach (5 layers)
- Precision: 5 -- Accurate, includes "what NOT to do" section
- Actionability: 5 -- Full code
- Structure: 5 -- Excellent layered organization
- Efficiency: 4 -- Thorough
- Depth: 5 -- ObjectDataSource, UpdatePanel, "what NOT to do"
- **Composite: 4.73**

### Condition H
- must_mention: 4/4 -- Same as G (identical content)
- must_not violations: none
- Completeness: 5 -- Same
- Precision: 5 -- Same
- Actionability: 5 -- Same
- Structure: 5 -- Same
- Efficiency: 4 -- Same
- Depth: 5 -- Same
- **Composite: 4.73**

### Condition I
- must_mention: 4/4 -- Same as G/H
- must_not violations: none
- Completeness: 5 -- Same
- Precision: 5 -- Same
- Actionability: 5 -- Same
- Structure: 5 -- Same
- Efficiency: 4 -- Same
- Depth: 5 -- Same
- **Composite: 4.73**

### Condition J
- must_mention: 4/4 -- all covered with Dapper example
- must_not violations: none
- Completeness: 5 -- Thorough with EF6/Dapper note
- Precision: 5 -- Accurate, notes ConfigurationManager not IConfiguration
- Actionability: 5 -- Full code with Dapper
- Structure: 5 -- Well organized
- Efficiency: 4 -- Good length
- Depth: 5 -- Dapper usage, EF6 note, explicit column declaration
- **Composite: 4.73**

---

## Task 2: dnf-002
**Ground Truth Summary:** WCF max message size. Must mention maxReceivedMessageSize, maxBufferSize/maxBufferPoolSize, specific XML config, streaming transfer mode. Should have exact config snippet.

### Condition D
- must_mention: 4/4 -- maxReceivedMessageSize, maxBufferSize/maxBufferPoolSize, XML config, streaming
- must_not violations: none
- Completeness: 5 -- Both server and client config, IIS limits, programmatic config
- Precision: 5 -- Accurate values and explanations
- Actionability: 5 -- Full XML config snippets
- Structure: 5 -- Config table, before/after implicit
- Efficiency: 4 -- Thorough
- Depth: 5 -- IIS httpRuntime, programmatic config, binding types
- **Composite: 4.87**

### Condition E
- must_mention: 4/4 -- all covered
- must_not violations: none
- Completeness: 4 -- Server and client, IIS limits, streaming
- Precision: 5 -- Accurate
- Actionability: 5 -- Config snippets
- Structure: 4 -- Clean
- Efficiency: 5 -- Concise
- Depth: 4 -- Key points section helpful
- **Composite: 4.40**

### Condition F
- must_mention: 4/4 -- all covered
- must_not violations: none
- Completeness: 5 -- Full configs, IIS limits, streaming
- Precision: 5 -- Accurate
- Actionability: 5 -- Full XML snippets
- Structure: 5 -- Excellent with quota layers table
- Efficiency: 4 -- Good
- Depth: 5 -- Quota layers table, don't use int.MaxValue
- **Composite: 4.73**

### Condition G
- must_mention: 4/4 -- all covered
- must_not violations: none
- Completeness: 5 -- Same as F (identical content for H/I)
- Precision: 5 -- Accurate
- Actionability: 5 -- Full config
- Structure: 5 -- Quota layers table
- Efficiency: 4 -- Thorough
- Depth: 5 -- WCF tracing, wsHttpBinding/netTcpBinding notes
- **Composite: 4.73**

### Condition H
- must_mention: 4/4 -- Same as G
- must_not violations: none
- Completeness: 5 -- Same
- Precision: 5 -- Same
- Actionability: 5 -- Same
- Structure: 5 -- Same
- Efficiency: 4 -- Same
- Depth: 5 -- Same
- **Composite: 4.73**

### Condition I
- must_mention: 4/4 -- Same as G/H
- must_not violations: none
- Completeness: 5 -- Same
- Precision: 5 -- Same
- Actionability: 5 -- Same
- Structure: 5 -- Same
- Efficiency: 4 -- Same
- Depth: 5 -- Same
- **Composite: 4.73**

### Condition J
- must_mention: 4/4 -- all covered
- must_not violations: none
- Completeness: 5 -- Full config, streaming, IIS
- Precision: 5 -- Accurate
- Actionability: 5 -- XML snippets
- Structure: 5 -- Good organization
- Efficiency: 4 -- Good
- Depth: 5 -- Values explained section, binding types
- **Composite: 4.73**

---

## Task 3: dnf-003
**Ground Truth Summary:** Add Windows Auth to Web Forms app with AD users. Must mention Windows Auth in IIS, web.config mode="Windows", deny anonymous, WindowsPrincipal/Identity role checks. Must NOT suggest OAuth/JWT.

### Condition D
- must_mention: 4/4 -- IIS Windows Auth, authentication mode="Windows", deny anonymous, WindowsPrincipal/IsInRole
- must_not violations: none (mentions ADFS only for internet-facing edge case)
- Completeness: 5 -- Full implementation with base page class, location elements
- Precision: 5 -- Framework 4.8 appropriate
- Actionability: 5 -- Complete code examples
- Structure: 5 -- Step-by-step from IIS to code
- Efficiency: 4 -- Thorough
- Depth: 5 -- Kerberos/NTLM notes, audit logging, base page pattern
- **Composite: 4.87**

### Condition E
- must_mention: 4/4 -- all covered
- must_not violations: none
- Completeness: 4 -- Core covered but less detailed
- Precision: 5 -- Accurate
- Actionability: 5 -- Config and code examples
- Structure: 4 -- Clean
- Efficiency: 5 -- Concise
- Depth: 4 -- Kerberos delegation mention
- **Composite: 4.40**

### Condition F
- must_mention: 4/4 -- all covered with roleManager configuration
- must_not violations: none
- Completeness: 5 -- PowerShell IIS config, roleManager, location elements
- Precision: 5 -- Accurate
- Actionability: 5 -- Full code
- Structure: 5 -- Well organized
- Efficiency: 4 -- Good
- Depth: 5 -- IIS Express note, granular auth
- **Composite: 4.73**

### Condition G
- must_mention: 4/4 -- all covered with Forms Auth fallback for external
- must_not violations: none
- Completeness: 5 -- Windows Auth + Forms Auth fallback, custom RoleProvider
- Precision: 5 -- Accurate
- Actionability: 5 -- Full code for both approaches
- Structure: 5 -- Two approaches clearly separated
- Efficiency: 3 -- Lengthy with Forms Auth alternative
- Depth: 5 -- Custom RoleProvider, rollout strategy, security considerations
- **Composite: 4.53**

### Condition H
- must_mention: 4/4 -- Same as G (identical)
- must_not violations: none
- Completeness: 5 -- Same
- Precision: 5 -- Same
- Actionability: 5 -- Same
- Structure: 5 -- Same
- Efficiency: 3 -- Same
- Depth: 5 -- Same
- **Composite: 4.53**

### Condition I
- must_mention: 4/4 -- Same as G/H
- must_not violations: none
- Completeness: 5 -- Same
- Precision: 5 -- Same
- Actionability: 5 -- Same
- Structure: 5 -- Same
- Efficiency: 3 -- Same
- Depth: 5 -- Same
- **Composite: 4.53**

### Condition J
- must_mention: 4/4 -- all covered with custom RoleProvider
- must_not violations: none (mentions Identity/OWIN only to say DO NOT use)
- Completeness: 5 -- Windows Auth + Forms Auth + RoleProvider
- Precision: 5 -- Accurate, correct "Do NOT use" section
- Actionability: 5 -- Full code
- Structure: 5 -- Well organized
- Efficiency: 3 -- Long
- Depth: 5 -- Server Manager install note, "do NOT" section
- **Composite: 4.53**

---

## Task 4: dnf-004
**Ground Truth Summary:** Windows Service OOM with MSMQ. Must mention memory leak investigation (perfmon, profiler), common causes (event handlers, growing collections, LOH), structured logging, graceful degradation (GC.Collect last resort, circuit breaker).

### Condition D
- must_mention: 4/4 -- perfmon/procdump, causes (disposal, collections, event handlers, LOH), logging, GC.Collect + service recovery
- must_not violations: none
- Completeness: 5 -- Comprehensive with memory dumps, 4 causes, watchdog
- Precision: 5 -- Accurate, MSMQ-specific patterns
- Actionability: 5 -- Full code examples for each cause and fix
- Structure: 5 -- Diagnosis + causes + fixes + prevention
- Efficiency: 3 -- Very long
- Depth: 5 -- ArrayPool, PerformanceCounter, service recovery config
- **Composite: 4.53**

### Condition E
- must_mention: 4/4 -- all covered in table format
- must_not violations: none
- Completeness: 4 -- Phase 1/Phase 2 structure, covers main causes
- Precision: 5 -- Accurate
- Actionability: 4 -- Table format less detailed for fixes
- Structure: 4 -- Clean with cause/fix table
- Efficiency: 5 -- Concise
- Depth: 4 -- XmlSerializer leak mention
- **Composite: 4.27**

### Condition F
- must_mention: 4/4 -- all covered with MemoryCache alternative
- must_not violations: none
- Completeness: 5 -- Thorough with dotMemory, WinDbg, 4 causes, MemoryCache
- Precision: 5 -- Accurate
- Actionability: 5 -- Full code examples
- Structure: 5 -- Good organization
- Efficiency: 3 -- Long
- Depth: 5 -- MemoryCache with config, LOH compaction
- **Composite: 4.53**

### Condition G
- must_mention: 4/4 -- all covered with 5 causes, bitness check
- must_not violations: none
- Completeness: 5 -- Very thorough with 5 patterns, monitoring, fault tolerance
- Precision: 5 -- Accurate
- Actionability: 5 -- Full code for each pattern
- Structure: 5 -- Well organized patterns
- Efficiency: 3 -- Very long
- Depth: 5 -- Bitness check, XmlMessageFormatter leak, db connections
- **Composite: 4.53**

### Condition H
- must_mention: 4/4 -- Same as G (identical)
- must_not violations: none
- Completeness: 5 -- Same
- Precision: 5 -- Same
- Actionability: 5 -- Same
- Structure: 5 -- Same
- Efficiency: 3 -- Same
- Depth: 5 -- Same
- **Composite: 4.53**

### Condition I
- must_mention: 4/4 -- Same as G/H
- must_not violations: none
- Completeness: 5 -- Same
- Precision: 5 -- Same
- Actionability: 5 -- Same
- Structure: 5 -- Same
- Efficiency: 3 -- Same
- Depth: 5 -- Same
- **Composite: 4.53**

### Condition J
- must_mention: 4/4 -- all covered with 5 causes, Serilog mention
- must_not violations: none
- Completeness: 5 -- Thorough diagnosis protocol
- Precision: 5 -- Accurate
- Actionability: 5 -- Full code
- Structure: 5 -- Numbered protocol
- Efficiency: 3 -- Long
- Depth: 5 -- Poison message handling, CancellationToken, Serilog
- **Composite: 4.53**

---

## Task 5: dnf-005
**Ground Truth Summary:** Expose .NET Framework 4.8 class libraries as REST API. Must mention Web API 2, reference existing libraries directly, OWIN self-hosting, API versioning. Must NOT suggest ASP.NET Core or WCF REST.

### Condition D
- must_mention: 4/4 -- Web API 2, direct references, OWIN self-host, also mentions API versioning implicitly (route prefix)
- must_not violations: 1 -- Option 4 explicitly shows WCF REST with WebHttpBinding (ground truth says must not suggest WCF REST as "outdated approach"). However, it is marked as "Not recommended for new work"
- Completeness: 5 -- Four options with full code
- Precision: 4 -- Mostly accurate but includes WCF REST option
- Actionability: 5 -- Complete code examples
- Structure: 5 -- Options clearly laid out with pros/cons
- Efficiency: 3 -- Very long
- Depth: 5 -- OWIN, Web Forms integration, WCF option
- **Composite: 4.33**

### Condition E
- must_mention: 3/4 -- Web API 2, direct references, OWIN self-host; no API versioning discussion
- must_not violations: none
- Completeness: 4 -- Three options, cross-cutting concerns
- Precision: 5 -- Accurate
- Actionability: 5 -- Code examples
- Structure: 4 -- Clean
- Efficiency: 5 -- Concise
- Depth: 4 -- Cross-cutting concerns (Swagger, CORS)
- **Composite: 4.27**

### Condition F
- must_mention: 3/4 -- Web API 2, direct references, OWIN; no explicit versioning
- must_not violations: none (mentions WCF only to say "Do not use")
- Completeness: 5 -- Three options with comparison table, DI, exception handling
- Precision: 5 -- Accurate, explicit "What NOT to do" section
- Actionability: 5 -- Full code
- Structure: 5 -- Comparison table, well organized
- Efficiency: 3 -- Long
- Depth: 5 -- DI, exception handling, CORS, Swagger
- **Composite: 4.53**

### Condition G
- must_mention: 4/4 -- Web API 2, references, OWIN, versioning mention
- must_not violations: none (explicit "Do not use WCF REST")
- Completeness: 5 -- Three options, DI, error handling, Swagger, versioning
- Precision: 5 -- Accurate
- Actionability: 5 -- Full code
- Structure: 5 -- Well organized with cross-cutting concerns
- Efficiency: 3 -- Very long
- Depth: 5 -- DI, exception handling, CORS, versioning, Swagger
- **Composite: 4.53**

### Condition H
- must_mention: 4/4 -- Same as G (identical)
- must_not violations: none
- Completeness: 5 -- Same
- Precision: 5 -- Same
- Actionability: 5 -- Same
- Structure: 5 -- Same
- Efficiency: 3 -- Same
- Depth: 5 -- Same
- **Composite: 4.53**

### Condition I
- must_mention: 4/4 -- Same as G/H
- must_not violations: none
- Completeness: 5 -- Same
- Precision: 5 -- Same
- Actionability: 5 -- Same
- Structure: 5 -- Same
- Efficiency: 3 -- Same
- Depth: 5 -- Same
- **Composite: 4.53**

### Condition J
- must_mention: 4/4 -- Web API 2, references, OWIN (implied via step 7), versioning not mentioned but Autofac DI
- must_not violations: none (explicit "Do NOT" section)
- Completeness: 5 -- Seven steps with DI, error handling
- Precision: 5 -- Accurate, specific version numbers (Autofac 6.x)
- Actionability: 5 -- Full code
- Structure: 5 -- Step-by-step
- Efficiency: 3 -- Long
- Depth: 5 -- Autofac version constraint, "What NOT to do"
- **Composite: 4.53**

---

## Summary

| Task | D | E | F | G | H | I | J |
|------|---|---|---|---|---|---|---|
| dnf-001 | 4.87 | 4.40 | 4.73 | 4.73 | 4.73 | 4.73 | 4.73 |
| dnf-002 | 4.87 | 4.40 | 4.73 | 4.73 | 4.73 | 4.73 | 4.73 |
| dnf-003 | 4.87 | 4.40 | 4.73 | 4.53 | 4.53 | 4.53 | 4.53 |
| dnf-004 | 4.53 | 4.27 | 4.53 | 4.53 | 4.53 | 4.53 | 4.53 |
| dnf-005 | 4.33 | 4.27 | 4.53 | 4.53 | 4.53 | 4.53 | 4.53 |
| **Mean** | **4.69** | **4.35** | **4.65** | **4.61** | **4.61** | **4.61** | **4.61** |
