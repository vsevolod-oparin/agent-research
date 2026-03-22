# dotnet-framework-pro Evaluation (D/E/F/G)

## Task 1: dnf-001

**Ground Truth Summary:** GridView with 50K records, 12s render. Must mention server-side paging, GridView properties (AllowPaging, PageSize), SQL-level pagination (OFFSET/FETCH or ROW_NUMBER), caching. Must NOT give vague advice or suggest migrating to .NET Core.

### Condition D
- must_mention coverage: 4/4 — Server-side paging (yes), AllowPaging/PageSize/AllowCustomPaging (yes), OFFSET/FETCH SQL (yes), caching for count (yes)
- must_not violations: none (no vague advice, no .NET Core suggestion)
- Completeness: 5 — Full implementation including code-behind, repository, SQL, GridView markup
- Precision: 5 — All code examples accurate for Web Forms
- Actionability: 5 — Copy-paste ready code, step-by-step
- Structure: 5 — Steps 1-4, additional optimizations, expected result
- Efficiency: 4 — Thorough but appropriately detailed
- Depth: 5 — ViewState disable, VirtualItemCount, database indexes, output caching, UpdatePanel mention
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 — All covered
- must_not violations: none
- Completeness: 4 — Covers key points but less detailed implementation
- Precision: 5 — Accurate
- Actionability: 4 — SQL and GridView markup but less complete code-behind
- Structure: 4 — Good but briefer
- Efficiency: 5 — Very concise
- Depth: 4 — Mentions indexes, ViewState, parameterized queries
- **Composite: 4.47**

### Condition F
- must_mention coverage: 4/4 — All covered with ObjectDataSource approach
- must_not violations: none
- Completeness: 5 — Full implementation with ObjectDataSource alternative
- Precision: 5 — Accurate, ROW_NUMBER alternative mentioned
- Actionability: 5 — Complete code examples
- Structure: 5 — Numbered steps, expected results
- Efficiency: 4 — Thorough
- Depth: 5 — ObjectDataSource with EnablePaging, covering index SQL, ViewState analysis
- **Composite: 4.87**

### Condition G
- must_mention coverage: 4/4 — All covered
- must_not violations: none
- Completeness: 5 — Full implementation with detailed code
- Precision: 5 — Accurate
- Actionability: 5 — Step-by-step with complete code
- Structure: 5 — Well-organized steps, key details section, additional improvements
- Efficiency: 4 — Detailed
- Depth: 5 — COUNT(*) OVER() mention, CSV export suggestion, ViewState analysis, search/filter UI suggestion
- **Composite: 4.87**

---

## Task 2: dnf-002

**Ground Truth Summary:** WCF max message size. Must mention maxReceivedMessageSize, maxBufferSize, maxBufferPoolSize, specific XML config, streaming transfer mode. Must show before/after.

### Condition D
- must_mention coverage: 4/4 — maxReceivedMessageSize (yes), maxBufferSize/maxBufferPoolSize (yes), XML config (yes, both client and server), streaming transfer mode (yes)
- must_not violations: none
- Completeness: 5 — Both sides config, readerQuotas, IIS limits, programmatic config
- Precision: 5 — Accurate config values and explanations
- Actionability: 5 — Copy-paste XML configs
- Structure: 5 — Config table, considerations section
- Efficiency: 4 — Thorough
- Depth: 5 — IIS httpRuntime/requestFiltering, programmatic config, security warning about int.MaxValue
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 — All covered
- must_not violations: none
- Completeness: 4 — Key points covered, streaming mentioned
- Precision: 5 — Accurate
- Actionability: 4 — XML config present but briefer
- Structure: 4 — Key points format
- Efficiency: 5 — Concise
- Depth: 4 — IIS limits, readerQuotas importance
- **Composite: 4.47**

### Condition F
- must_mention coverage: 4/4 — All covered
- must_not violations: none
- Completeness: 5 — Client and server configs, readerQuotas, IIS limits
- Precision: 5 — Accurate
- Actionability: 5 — Complete XML configs
- Structure: 5 — Well-organized with key points section
- Efficiency: 4 — Good detail level
- Depth: 5 — maxRequestLength vs maxAllowedContentLength units, wsHttpBinding note, int.MaxValue warning
- **Composite: 4.87**

### Condition G
- must_mention coverage: 4/4 — All covered with streaming code example
- must_not violations: none
- Completeness: 5 — Both configs, streaming with Stream parameter, IIS limits
- Precision: 5 — Accurate, includes operation contract for streaming
- Actionability: 5 — Complete configs, streaming example with code
- Structure: 5 — Numbered important details
- Efficiency: 4 — Thorough
- Depth: 5 — Stream operation contract example, maxBufferSize must match explanation, IIS limits with units
- **Composite: 4.87**

---

## Task 3: dnf-003

**Ground Truth Summary:** Windows Auth for Web Forms with AD users. Must mention Windows Auth in IIS, web.config mode="Windows", deny anonymous, WindowsPrincipal/WindowsIdentity for role checks. Must NOT suggest OAuth/JWT.

### Condition D
- must_mention coverage: 4/4 — IIS Windows Auth (yes), web.config mode="Windows" (yes), deny users="?" (yes), User.IsInRole for AD groups (yes, uses WindowsIdentity implicitly)
- must_not violations: none (no OAuth/JWT suggestion, mentions ADFS only for internet-facing alternative)
- Completeness: 5 — Six steps covering full implementation
- Precision: 5 — Accurate for .NET Framework 4.8
- Actionability: 5 — Complete code, XML configs, base page class
- Structure: 5 — Step-by-step, additional considerations
- Efficiency: 4 — Thorough
- Depth: 5 — SecureBasePage pattern, Kerberos vs NTLM, Extended Protection, public pages exception, internet-facing note
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 — All covered
- must_not violations: none
- Completeness: 4 — Core steps covered, role-based auth with location elements
- Precision: 5 — Accurate
- Actionability: 4 — Config and code examples
- Structure: 4 — Steps, considerations
- Efficiency: 5 — Concise
- Depth: 3 — Kerberos delegation mention, ADFS fallback, but less detail
- **Composite: 4.20**

### Condition F
- must_mention coverage: 4/4 — All covered with PowerShell config
- must_not violations: none
- Completeness: 5 — IIS config, web.config, code, role manager, location elements
- Precision: 5 — Accurate, roleManager config is a good addition
- Actionability: 5 — PowerShell commands, XML configs, code
- Structure: 5 — Numbered steps
- Efficiency: 4 — Detailed
- Depth: 4 — IIS Express dev note, Local Intranet zone, SPN for Kerberos
- **Composite: 4.73**

### Condition G
- must_mention coverage: 4/4 — All covered with WindowsIdentity cast
- must_not violations: none (mentions Forms Auth with AD only as internet-facing alternative)
- Completeness: 5 — Full implementation including AD attribute lookup
- Precision: 5 — Accurate, includes DirectoryServices.AccountManagement
- Actionability: 5 — Complete code including login page for external users
- Structure: 5 — Numbered steps
- Efficiency: 3 — Most verbose, includes Forms Auth fallback which adds length
- Depth: 5 — AD attribute lookup (DisplayName, Email), Forms Auth with LDAP validation, requireSSL, machineKey for load balancing, account lockout handling
- **Composite: 4.60**

---

## Task 4: dnf-004

**Ground Truth Summary:** Windows Service OOM with MSMQ. Must mention memory leak investigation (perfmon, profiler), common causes (event handlers, growing collections, LOH), structured logging, graceful degradation. Should have ordered diagnostic steps and ranked causes.

### Condition D
- must_mention coverage: 4/4 — Memory profiling/procdump (yes), common causes: event handlers/collections/LOH (yes), structured logging/memory diagnostics (yes), graceful degradation: GC.Collect + service recovery (yes)
- must_not violations: none
- Completeness: 5 — Four common causes with before/after code, prevention checklist
- Precision: 5 — Accurate MSMQ-specific advice (Message IDisposable, unmanaged IStream)
- Actionability: 5 — procdump commands, WinDbg commands, code fixes, sc failure command
- Structure: 5 — Diagnosis strategy then causes, prevention checklist
- Efficiency: 4 — Thorough
- Depth: 5 — MSMQ Message.IDisposable with unmanaged stream detail, ArrayPool for LOH, memory pressure watchdog with LOH compaction, FailFast for controlled restart
- **Composite: 4.87**

### Condition E
- must_mention coverage: 4/4 — All covered in table format
- must_not violations: none
- Completeness: 4 — Covers causes, diagnosis, fixes in compact form
- Precision: 5 — Accurate
- Actionability: 4 — Code and commands, but table format less detailed
- Structure: 4 — Two-phase approach (diagnose/fix), table of common causes
- Efficiency: 5 — Very concise
- Depth: 3 — XmlSerializer cache mention unique, but less detail on each cause
- **Composite: 4.20**

### Condition F
- must_mention coverage: 4/4 — All covered with detailed cause patterns
- must_not violations: none
- Completeness: 5 — Performance counters, WinDbg, four causes, MemoryCache solution
- Precision: 5 — Accurate
- Actionability: 5 — WinDbg commands, before/after code, MemoryCache config XML
- Structure: 5 — Telemetry, profiling, causes, action plan
- Efficiency: 4 — Detailed
- Depth: 5 — WinDbg finalizequeue, MemoryCache with XML config, event handler accumulation pattern, LOH compaction, RecyclableMemoryStream mention
- **Composite: 4.87**

### Condition G
- must_mention coverage: 4/4 — All covered with five patterns
- must_not violations: none
- Completeness: 5 — Five leak patterns, diagnosis, fault tolerance
- Precision: 5 — Accurate
- Actionability: 5 — procdump, complete fix code for each pattern, sc failure command
- Structure: 5 — Steps 1-4 ordered, patterns A-E
- Efficiency: 3 — Most verbose of the four
- Depth: 5 — Message.BodyStream leak (unmanaged), MessageQueueException IOTimeout pattern, poison/dead-letter queue mention, XmlMessageFormatter setup, five distinct patterns identified
- **Composite: 4.60**

---

## Task 5: dnf-005

**Ground Truth Summary:** Expose .NET Framework 4.8 class libraries as REST API. Must mention ASP.NET Web API 2 (not Core), reference existing libraries directly, OWIN self-hosting, API versioning. Must NOT suggest ASP.NET Core or WCF REST.

### Condition D
- must_mention coverage: 3/4 — Web API 2 (yes), reference existing libraries (yes), OWIN self-hosting (yes). Missing explicit API versioning strategy.
- must_not violations: borderline — mentions WCF REST as Option 4 but explicitly says "Not recommended for new work" and calls it "awkward, limited." This is informational, not a recommendation.
- Completeness: 4 — Three main options plus WCF REST for context
- Precision: 4 — WCF REST mention is questionable per must_not
- Actionability: 5 — Complete code for controllers, OWIN self-host, route config
- Structure: 5 — Options clearly compared with pros/cons
- Efficiency: 4 — Thorough
- Depth: 5 — OWIN self-host in Windows Service, adding to existing Web Forms project, JSON formatting config
- **Composite: 4.47**

### Condition E
- must_mention coverage: 3/4 — Web API 2 (yes), reference libraries (yes), OWIN self-hosting (yes). Missing API versioning.
- must_not violations: none
- Completeness: 4 — Three options with cross-cutting concerns
- Precision: 5 — Accurate
- Actionability: 4 — Code examples, NuGet packages
- Structure: 4 — Options with cross-cutting section
- Efficiency: 5 — Concise
- Depth: 3 — Swagger, CORS, exception handling mentioned but brief
- **Composite: 4.20**

### Condition F
- must_mention coverage: 3/4 — Web API 2 (yes), reference libraries (yes), OWIN self-host (yes). Missing API versioning.
- must_not violations: none
- Completeness: 5 — Three options with comparison table
- Precision: 5 — Accurate
- Actionability: 5 — Complete code, NuGet packages, OWIN setup
- Structure: 5 — Comparison table is excellent
- Efficiency: 4 — Detailed
- Depth: 5 — Solution structure diagram, DI with Unity/Autofac, CamelCase JSON, comparison table with criteria
- **Composite: 4.73**

### Condition G
- must_mention coverage: 3/4 — Web API 2 (yes), reference libraries (yes), OWIN self-host (yes). Missing API versioning.
- must_not violations: none (explicitly says not to use WCF REST for new APIs)
- Completeness: 5 — Full implementation with DI, serialization, CORS, exception handling
- Precision: 5 — Accurate, "What NOT to do" section is valuable
- Actionability: 5 — Step 1-7 with complete code, NuGet packages
- Structure: 5 — Seven numbered steps, hosting options table
- Efficiency: 3 — Most verbose, extensive code examples
- Depth: 5 — Unity DI, GlobalExceptionHandler, CORS config, EF6/Dapper note, DTO recommendation, "What NOT to do" section
- **Composite: 4.60**

---

## Summary

| Task | D | E | F | G |
|------|---|---|---|---|
| dnf-001 | 4.87 | 4.47 | 4.87 | 4.87 |
| dnf-002 | 4.87 | 4.47 | 4.87 | 4.87 |
| dnf-003 | 4.87 | 4.20 | 4.73 | 4.60 |
| dnf-004 | 4.87 | 4.20 | 4.87 | 4.60 |
| dnf-005 | 4.47 | 4.20 | 4.73 | 4.60 |
| **Mean** | **4.79** | **4.31** | **4.81** | **4.71** |
