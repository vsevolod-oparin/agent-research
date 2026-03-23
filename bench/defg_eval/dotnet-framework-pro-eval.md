# dotnet-framework-pro Evaluation (D/E/F/G/H/I)

## Task 1: dnf-001
**Ground Truth Summary:** Fix GridView loading 50K records. Must mention server-side paging, GridView properties (AllowPaging, PageSize), SQL-level pagination (OFFSET/FETCH or ROW_NUMBER), caching. Must NOT give vague advice or suggest migrating to .NET Core.

### Condition D
- must_mention: 4/4 — server-side paging, AllowPaging/AllowCustomPaging/PageSize, OFFSET/FETCH SQL, caching (HttpRuntime.Cache)
- must_not violations: none
- Completeness: 5 — full code for SQL, GridView markup, code-behind, repository
- Precision: 5 — specific properties, correct implementation pattern
- Actionability: 5 — copy-paste ready code examples
- Structure: 5 — step-by-step with expected result
- Efficiency: 4 — thorough, slightly long
- Depth: 5 — ViewState disable, DB indexes, UpdatePanel consideration, output caching
- **Composite: 4.73**

### Condition E
- must_mention: 4/4 — all covered
- must_not violations: none
- Completeness: 4 — covers main points but less code detail
- Precision: 5 — correct
- Actionability: 4 — markup + code but less complete than D
- Structure: 4 — clean
- Efficiency: 5 — very concise
- Depth: 3 — mentions indexes and ViewState but less exploration
- **Composite: 4.07**

### Condition F
- must_mention: 4/4 — all covered with ObjectDataSource alternative
- must_not violations: none
- Completeness: 5 — ObjectDataSource + direct code-behind approaches
- Precision: 5 — accurate, includes ROW_NUMBER mention
- Actionability: 5 — full code examples with covering index SQL
- Structure: 5 — layered approach, expected results
- Efficiency: 4 — thorough
- Depth: 5 — covering indexes, ObjectDataSource, count caching
- **Composite: 4.73**

### Condition G
- must_mention: 4/4 — all covered
- must_not violations: none
- Completeness: 5 — comprehensive with layered approach
- Precision: 5 — accurate with stored procedure pattern
- Actionability: 5 — full code from SQL to code-behind
- Structure: 5 — layered (5 layers), clear anti-patterns section
- Efficiency: 4 — extensive but well organized
- Depth: 5 — ObjectDataSource, export consideration, anti-async warning
- **Composite: 4.73**

### Condition H
- must_mention: 4/4 — same as G (identical output)
- must_not violations: none
- Completeness: 5 — same as G
- Precision: 5 — same as G
- Actionability: 5 — same as G
- Structure: 5 — same as G
- Efficiency: 4 — same as G
- Depth: 5 — same as G
- **Composite: 4.73**

### Condition I
- must_mention: 4/4 — same as G
- must_not violations: none
- Completeness: 5 — same as G
- Precision: 5 — same as G
- Actionability: 5 — same as G
- Structure: 5 — same as G
- Efficiency: 4 — same as G
- Depth: 5 — same as G
- **Composite: 4.73**

---

## Task 2: dnf-002
**Ground Truth Summary:** WCF max message size. Must mention maxReceivedMessageSize, maxBufferSize/maxBufferPoolSize, specific XML config, streaming transfer mode. Should have before/after config.

### Condition D
- must_mention: 4/4 — maxReceivedMessageSize, maxBufferSize/maxBufferPoolSize, XML config, streaming transferMode
- must_not violations: none
- Completeness: 5 — server + client config, IIS limits, programmatic config
- Precision: 5 — accurate with correct default values
- Actionability: 5 — complete XML configs for both sides
- Structure: 5 — config table, considerations list
- Efficiency: 4 — thorough
- Depth: 5 — IIS requestFiltering, programmatic config, DoS warning
- **Composite: 4.73**

### Condition E
- must_mention: 4/4 — all covered
- must_not violations: none
- Completeness: 4 — covers key points concisely
- Precision: 5 — accurate
- Actionability: 4 — config shown but client side says "mirror same"
- Structure: 4 — key points listed
- Efficiency: 5 — very concise
- Depth: 4 — IIS limits, streaming mention
- **Composite: 4.27**

### Condition F
- must_mention: 4/4 — all covered with both sides
- must_not violations: none
- Completeness: 5 — full client + service config, IIS
- Precision: 5 — accurate with correct defaults
- Actionability: 5 — complete XML
- Structure: 5 — clear sections with key points
- Efficiency: 4 — thorough
- Depth: 5 — readerQuotas explanation, IIS layer, int.MaxValue warning
- **Composite: 4.73**

### Condition G
- must_mention: 4/4 — all covered with quota layers table
- must_not violations: none
- Completeness: 5 — comprehensive with quota layers table
- Precision: 5 — accurate with default values
- Actionability: 5 — full XML configs
- Structure: 5 — excellent quota layers table, verification with WCF tracing
- Efficiency: 4 — detailed
- Depth: 5 — quota layers explanation, streaming, WCF tracing, wsHttpBinding/netTcpBinding
- **Composite: 4.73**

### Condition H
- must_mention: 4/4 — same as G (identical output)
- must_not violations: none
- Completeness: 5 — same as G
- Precision: 5 — same as G
- Actionability: 5 — same as G
- Structure: 5 — same as G
- Efficiency: 4 — same as G
- Depth: 5 — same as G
- **Composite: 4.73**

### Condition I
- must_mention: 4/4 — same as G
- must_not violations: none
- Completeness: 5 — same as G
- Precision: 5 — same as G
- Actionability: 5 — same as G
- Structure: 5 — same as G
- Efficiency: 4 — same as G
- Depth: 5 — same as G
- **Composite: 4.73**

---

## Task 3: dnf-003
**Ground Truth Summary:** Windows Authentication in IIS, web.config mode="Windows", deny anonymous, WindowsPrincipal/WindowsIdentity for role checks. Must NOT suggest OAuth/JWT for intranet AD.

### Condition D
- must_mention: 4/4 — IIS config, authentication mode="Windows", deny users="?", role checks with IsInRole
- must_not violations: none (mentions ADFS only for internet-facing as appropriate caveat)
- Completeness: 5 — IIS steps, web.config, code-behind, base page, public pages
- Precision: 5 — correct implementation
- Actionability: 5 — full code including SecureBasePage
- Structure: 5 — step-by-step (6 steps)
- Efficiency: 4 — thorough
- Depth: 5 — Kerberos vs NTLM, Extended Protection, audit logging, internet caveat
- **Composite: 4.73**

### Condition E
- must_mention: 4/4 — all covered
- must_not violations: none
- Completeness: 4 — covers core points
- Precision: 5 — correct
- Actionability: 4 — config + code but less complete
- Structure: 4 — clean steps
- Efficiency: 5 — concise
- Depth: 3 — Kerberos mention, LDAP fallback mention but brief
- **Composite: 4.07**

### Condition F
- must_mention: 4/4 — all covered with PowerShell IIS commands
- must_not violations: none
- Completeness: 5 — PowerShell IIS config, roleManager, location elements
- Precision: 5 — correct
- Actionability: 5 — detailed config + code
- Structure: 5 — numbered steps with code
- Efficiency: 4 — thorough
- Depth: 5 — roleManager provider, IIS Express config, Intranet zone GPO
- **Composite: 4.73**

### Condition G
- must_mention: 4/4 — all covered with WindowsIdentity cast, Forms Auth alternative
- must_not violations: none (Forms Auth mentioned as alternative for non-intranet, appropriate)
- Completeness: 5 — comprehensive with two approaches
- Precision: 5 — correct, includes WindowsIdentity cast
- Actionability: 5 — full code for both approaches
- Structure: 5 — Approach A/B clearly separated
- Efficiency: 4 — two approaches well justified
- Depth: 5 — WindowsIdentity, DirectoryServices, Forms Auth fallback, security considerations, rollout strategy
- **Composite: 4.73**

### Condition H
- must_mention: 4/4 — same as G (identical output)
- must_not violations: none
- Completeness: 5 — same as G
- Precision: 5 — same as G
- Actionability: 5 — same as G
- Structure: 5 — same as G
- Efficiency: 4 — same as G
- Depth: 5 — same as G
- **Composite: 4.73**

### Condition I
- must_mention: 4/4 — same as G
- must_not violations: none
- Completeness: 5 — same as G
- Precision: 5 — same as G
- Actionability: 5 — same as G
- Structure: 5 — same as G
- Efficiency: 4 — same as G
- Depth: 5 — same as G
- **Composite: 4.73**

---

## Task 4: dnf-004
**Ground Truth Summary:** Memory leak investigation (perfmon, profiler), common causes (event handlers, growing collections, LOH), structured logging, graceful degradation. Diagnostic steps ordered, causes ranked.

### Condition D
- must_mention: 4/4 — procdump/WinDbg, causes (Message not disposed, collections, event handlers, LOH), logging with perfcounters, GC.Collect + service recovery
- must_not violations: none
- Completeness: 5 — comprehensive leak patterns with code fixes
- Precision: 5 — accurate MSMQ-specific patterns
- Actionability: 5 — procdump commands, before/after code, sc failure config
- Structure: 5 — diagnosis then causes with fixes, prevention checklist
- Efficiency: 4 — detailed
- Depth: 5 — ArrayPool, LOH compaction, Environment.FailFast, IStream reference
- **Composite: 4.73**

### Condition E
- must_mention: 4/4 — all covered in table format
- must_not violations: none
- Completeness: 4 — covers key causes but less code
- Precision: 5 — accurate
- Actionability: 4 — procdump, leak table, but fewer code fixes
- Structure: 4 — phase 1/2 with table
- Efficiency: 5 — concise
- Depth: 3 — XmlSerializer cache, good but less detailed
- **Composite: 4.07**

### Condition F
- must_mention: 4/4 — all covered with detailed code
- must_not violations: none
- Completeness: 5 — comprehensive with MemoryCache alternative
- Precision: 5 — accurate
- Actionability: 5 — full code examples for each pattern
- Structure: 5 — telemetry, profiling, causes, action plan
- Efficiency: 4 — detailed
- Depth: 5 — MemoryCache config, perf counters, dotMemory, RecyclableMemoryStream mention
- **Composite: 4.73**

### Condition G
- must_mention: 4/4 — all covered with 5 causes, detailed patterns
- must_not violations: none
- Completeness: 5 — 5 cause patterns, monitoring, fault tolerance
- Precision: 5 — accurate with MSMQ-specific detail
- Actionability: 5 — full code for each pattern, sc failure command
- Structure: 5 — 4 steps with sub-patterns
- Efficiency: 4 — lengthy but high value
- Depth: 5 — XmlSerializer leak, 32-bit check, ArrayPool, dead letter queue, Interlocked counter
- **Composite: 4.73**

### Condition H
- must_mention: 4/4 — same as G (identical output)
- must_not violations: none
- Completeness: 5 — same as G
- Precision: 5 — same as G
- Actionability: 5 — same as G
- Structure: 5 — same as G
- Efficiency: 4 — same as G
- Depth: 5 — same as G
- **Composite: 4.73**

### Condition I
- must_mention: 4/4 — same as G
- must_not violations: none
- Completeness: 5 — same as G
- Precision: 5 — same as G
- Actionability: 5 — same as G
- Structure: 5 — same as G
- Efficiency: 4 — same as G
- Depth: 5 — same as G
- **Composite: 4.73**

---

## Task 5: dnf-005
**Ground Truth Summary:** ASP.NET Web API 2, reference existing class libraries, OWIN self-hosting alternative, API versioning. Must NOT suggest ASP.NET Core or WCF REST.

### Condition D
- must_mention: 3/4 — Web API 2, direct references, OWIN self-host. Does NOT mention API versioning strategy.
- must_not violations: partially — mentions WCF REST as Option 4 but does note it as "not recommended for new work". This is borderline.
- Completeness: 4 — comprehensive options but missing versioning
- Precision: 4 — mostly correct, WCF REST inclusion is questionable per must_not
- Actionability: 5 — full code for Web API + OWIN + Web Forms integration
- Structure: 5 — 4 options clearly presented with pros/cons
- Efficiency: 4 — detailed
- Depth: 4 — multiple hosting options, route config, serialization
- **Composite: 4.20**

### Condition E
- must_mention: 3/4 — Web API 2, references, OWIN. No versioning.
- must_not violations: none
- Completeness: 4 — three options covered
- Precision: 5 — correct, no WCF REST
- Actionability: 4 — code + cross-cutting concerns list
- Structure: 4 — options listed
- Efficiency: 5 — concise
- Depth: 3 — mentions Swagger, CORS but brief
- **Composite: 4.00**

### Condition F
- must_mention: 3/4 — Web API 2, references, OWIN. No versioning explicitly.
- must_not violations: none (explicitly says do not use WCF REST)
- Completeness: 4 — three options with comparison table
- Precision: 5 — correct, anti-patterns listed
- Actionability: 5 — full code, comparison table
- Structure: 5 — excellent comparison table
- Efficiency: 4 — well organized
- Depth: 4 — DI, Swagger, CORS, exception handler, comparison table
- **Composite: 4.33**

### Condition G
- must_mention: 4/4 — Web API 2, references, OWIN, versioning mentioned in cross-cutting
- must_not violations: none (explicitly warns against WCF REST and ASP.NET Core)
- Completeness: 5 — all points including versioning
- Precision: 5 — correct with explicit anti-patterns
- Actionability: 5 — full code, DI setup, WebApiConfig
- Structure: 5 — three options + cross-cutting + anti-patterns
- Efficiency: 4 — detailed
- Depth: 5 — versioning, Swagger, CORS, ExceptionFilter, DI, serialization config, anti-patterns
- **Composite: 4.73**

### Condition H
- must_mention: 4/4 — same as G (identical output)
- must_not violations: none
- Completeness: 5 — same as G
- Precision: 5 — same as G
- Actionability: 5 — same as G
- Structure: 5 — same as G
- Efficiency: 4 — same as G
- Depth: 5 — same as G
- **Composite: 4.73**

### Condition I
- must_mention: 4/4 — same as G
- must_not violations: none
- Completeness: 5 — same as G
- Precision: 5 — same as G
- Actionability: 5 — same as G
- Structure: 5 — same as G
- Efficiency: 4 — same as G
- Depth: 5 — same as G
- **Composite: 4.73**

---

## Summary

| Task | D | E | F | G | H | I |
|------|---|---|---|---|---|---|
| dnf-001 | 4.73 | 4.07 | 4.73 | 4.73 | 4.73 | 4.73 |
| dnf-002 | 4.73 | 4.27 | 4.73 | 4.73 | 4.73 | 4.73 |
| dnf-003 | 4.73 | 4.07 | 4.73 | 4.73 | 4.73 | 4.73 |
| dnf-004 | 4.73 | 4.07 | 4.73 | 4.73 | 4.73 | 4.73 |
| dnf-005 | 4.20 | 4.00 | 4.33 | 4.73 | 4.73 | 4.73 |
| **Mean** | **4.62** | **4.10** | **4.65** | **4.73** | **4.73** | **4.73** |
