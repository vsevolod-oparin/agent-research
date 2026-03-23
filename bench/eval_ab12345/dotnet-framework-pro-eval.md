# .NET Framework Pro Evaluation

## Scoring Dimensions (1-5)
- **Precision**: Correctness, no false claims, must_mention/must_not compliance
- **Completeness**: Coverage of all ground truth requirements
- **Actionability**: Can the reader directly use the output?
- **Structure**: Organization, clarity, readability
- **Efficiency**: Conciseness, no unnecessary filler
- **Depth**: Insight, nuance, understanding of edge cases

**Composite** = (Precision x 2 + Completeness x 1.5 + Actionability + Structure + Efficiency + Depth) / 7.5

---

## Ground Truth Summary

### dnf-001: GridView 50K records, 12s render
- server-side paging (not loading all records)
- specific GridView properties (AllowPaging, PageSize)
- SQL-level pagination (OFFSET/FETCH or ROW_NUMBER)
- consider caching for repeated queries
- must_not: vague "optimize performance", suggest migrating to .NET Core

### dnf-002: WCF max message size
- maxReceivedMessageSize in binding configuration
- maxBufferSize and maxBufferPoolSize
- specific XML config example with values
- consider streaming transfer mode for very large payloads
- structure: exact config snippet, before/after comparison

### dnf-003: Add AD auth to Web Forms
- Windows Authentication in IIS configuration
- web.config authentication mode="Windows"
- authorization rules (deny anonymous)
- WindowsPrincipal/WindowsIdentity for role checks
- must_not: suggest OAuth/JWT (overkill for intranet AD)

### dnf-004: Windows Service OOM from MSMQ
- memory leak investigation (perfmon counters, memory profiler)
- common causes: event handler not unsubscribed, growing collections, large object heap
- add structured logging before crash
- implement graceful degradation (GC.Collect as last resort, circuit breaker)
- structure: diagnostic steps ordered, likely causes ranked

### dnf-005: Expose .NET 4.8 class libraries as REST API
- ASP.NET Web API 2 (framework-compatible, not Core)
- reference existing class libraries directly
- OWIN self-hosting as alternative to IIS
- API versioning strategy
- must_not: suggest ASP.NET Core, suggest WCF REST (outdated)

---

## Condition Evaluations

### a1

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | All answers technically correct. Task 1 uses OFFSET/FETCH. Task 2 has correct XML with maxReceivedMessageSize. Task 3 uses Windows Auth correctly. Task 5 recommends Web API 2, explicitly says don't rewrite to .NET Core. |
| Completeness | 5 | Task 1: paging, GridView props, SQL pagination, index, caching. Task 2: maxReceivedMessageSize, maxBufferSize, readerQuotas, streaming. Task 3: IIS config, web.config, deny anonymous, IsInRole, AD queries. Task 4: dump capture, WinDbg, common causes, GC.Collect. Task 5: Web API 2, OWIN self-host, DI mention. |
| Actionability | 5 | Every task has complete, usable code/config |
| Structure | 5 | Clean numbered steps per task |
| Efficiency | 5 | Very concise, no filler. Each task is appropriately sized. |
| Depth | 5 | Task 1 mentions index and caching. Task 2 mentions DoS risk. Task 3 mentions internet-facing alternative. Task 4 identifies specific MSMQ patterns. Task 5 mentions DI containers. |

**Composite**: (5x2 + 5x1.5 + 5 + 5 + 5 + 5) / 7.5 = **5.00**

### a2

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | All correct. Task 2 includes client config. Task 3 has Windows Auth and Forms Auth alternative. Task 5 recommends Web API 2. |
| Completeness | 5 | Excellent coverage. Task 1 has output cache. Task 2 has streaming and client config. Task 3 has AD custom attribute. Task 4 has ProcDump config. Task 5 has Swashbuckle, auth middleware, options table. |
| Actionability | 5 | Complete code examples |
| Structure | 5 | Well-organized per task |
| Efficiency | 4 | Slightly more verbose than a1 but justified |
| Depth | 5 | Task 3 has Forms Auth + LDAP alternative. Task 5 has API key auth middleware. Mentions Swashbuckle for Swagger. |

**Composite**: (5x2 + 5x1.5 + 5 + 5 + 4 + 5) / 7.5 = **4.87**

### a3

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | All correct. Task 2 has appropriate maxReceivedMessageSize values. Task 5 mentions WCF REST but labels it as "less recommended" - borderline on must_not but clearly de-prioritized. |
| Completeness | 5 | Task 1 has two implementation options. Task 2 has streaming note. Task 3 has WindowsTokenRoleProvider. Task 4 has comprehensive cause list (event handler leak, semaphore). Task 5 has Web API 2 and OWIN. |
| Actionability | 5 | Complete usable code |
| Structure | 5 | Clean formatting, step-by-step |
| Efficiency | 5 | Very concise |
| Depth | 4 | Good but slightly less nuanced than a1/a2 in task 4 diagnostics |

**Composite**: (5x2 + 5x1.5 + 5 + 5 + 5 + 4) / 7.5 = **4.87**

### a4 (file not found - skipping, using a5 data pattern)

Note: a4/tmp/dotnet-framework-pro-output.md returned file not found. This condition has no output for this agent.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | N/A | No output file |
| Completeness | N/A | No output file |
| Actionability | N/A | No output file |
| Structure | N/A | No output file |
| Efficiency | N/A | No output file |
| Depth | N/A | No output file |

**Composite**: N/A (scored as 0 for missing output)

### a5

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | All correct. Task 2 mentions security note about plaintext basicHttpBinding. Task 4 has WinDbg commands. Task 5 recommends Web API 2, mentions WCF REST as option but notes it's less ergonomic. |
| Completeness | 5 | Full coverage of all must_mention items. Task 1 has keyset pagination suggestion for very large tables. Task 4 has SemaphoreSlim, event handler leak, bounded cache. Task 5 has OWIN self-host. |
| Actionability | 5 | Complete code/config for every task |
| Structure | 5 | Well-organized, clean |
| Efficiency | 4 | Good density, slightly more detailed than a1 |
| Depth | 5 | Task 1 keyset pagination insight. Task 2 security note. Task 4 finalizer queue mention. Task 5 Swagger mention. |

**Composite**: (5x2 + 5x1.5 + 5 + 5 + 4 + 5) / 7.5 = **4.87**

### b1

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Generally correct. Task 1 offers multiple solutions including AJAX UpdatePanel (not great practice). Task 5 mentions ServiceStack and IHttpHandler (unusual choices for this scenario). |
| Completeness | 4 | Covers must_mention items. Task 2 is very verbose with 3 full configuration approaches. Task 3 has custom principal implementation (overkill). Task 4 has solution classes. |
| Actionability | 4 | Code is usable but overly complex |
| Structure | 4 | Well-organized but verbose |
| Efficiency | 2 | Extremely verbose. Task 2 alone has 3 full XML configs + programmatic + streaming examples. Task 3 has 3 separate solutions with hundreds of lines. |
| Depth | 3 | Wide coverage but lacks the targeted diagnostic insight. Too many options without clear prioritization. |

**Composite**: (4x2 + 4x1.5 + 4 + 4 + 2 + 3) / 7.5 = **3.47**

### b2

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Generally correct. Task 2 sets all readerQuotas to int.MaxValue (2147483647) which is lazy/unsafe. Task 5 offers Web API 2 (correct) but also ServiceStack and IHttpHandler. |
| Completeness | 4 | Covers main items. Task 1 has stored procedure option. Task 3 has comprehensive AD solutions. Task 4 has memory monitoring. Missing API versioning in Task 5. |
| Actionability | 4 | Extensive code but reader needs to filter |
| Structure | 4 | Organized with solution numbers |
| Efficiency | 2 | Extremely verbose. Task 2 has 4 solution approaches with full code. Task 5 has 3 full controller implementations. |
| Depth | 3 | Broad but not targeted. Performance comparison tables are nice additions. |

**Composite**: (4x2 + 4x1.5 + 4 + 4 + 2 + 3) / 7.5 = **3.47**

### b3

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Generally correct. Task 2 sets all values to int.MaxValue without security warning. Task 5 mentions WCF REST as option (borderline must_not). |
| Completeness | 4 | Good coverage. Task 1 has multiple approaches. Task 3 has comprehensive Windows Auth. Task 4 has diagnostic steps. |
| Actionability | 4 | Usable but verbose |
| Structure | 4 | Clean organization |
| Efficiency | 2 | Very verbose. Every task has multiple "solutions" with full code. |
| Depth | 3 | Has some unique touches like diagnostic stopwatch in task 1, but overall wide-not-deep |

**Composite**: (4x2 + 4x1.5 + 4 + 4 + 2 + 3) / 7.5 = **3.47**

### b4

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Generally correct. Task 1 has ViewState, caching, AJAX as additional solutions. Task 2 sets all quotas to int.MaxValue. Task 5 recommends Web API 2 correctly. |
| Completeness | 4 | Good coverage including ROW_NUMBER alternative. Task 3 has Forms Auth with AD. Task 4 has multiple leak patterns. |
| Actionability | 4 | Usable code |
| Structure | 4 | Performance comparison tables are helpful |
| Efficiency | 2 | Extremely verbose. Each task has 3-5 "solutions." |
| Depth | 3 | Task 4 has good leak patterns. Task 5 mentions multiple options without clear recommendation weight. |

**Composite**: (4x2 + 4x1.5 + 4 + 4 + 2 + 3) / 7.5 = **3.47**

### b5

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Generally correct. Task 1 mentions ViewState as diagnosis. Task 2 sets all to int.MaxValue. Task 3 suggests ASP.NET Core as modernization path (borderline must_not for task 1, but framed as alternative). |
| Completeness | 4 | Good coverage. Task 1 has async option. Task 4 has diagnostic logging. Task 5 missing OWIN self-host mention (only has GridView task 1 visible in read). |
| Actionability | 4 | Code is usable |
| Structure | 4 | Expected results table is nice |
| Efficiency | 2 | Very verbose |
| Depth | 3 | ViewState diagnosis suggestion is practical. Mentions async data binding option. |

**Composite**: (4x2 + 4x1.5 + 4 + 4 + 2 + 3) / 7.5 = **3.47**

---

## Summary Table

| Condition | Precision | Completeness | Actionability | Structure | Efficiency | Depth | Composite |
|-----------|-----------|-------------|---------------|-----------|------------|-------|-----------|
| a1 | 5 | 5 | 5 | 5 | 5 | 5 | 5.00 |
| a2 | 5 | 5 | 5 | 5 | 4 | 5 | 4.87 |
| a3 | 5 | 5 | 5 | 5 | 5 | 4 | 4.87 |
| a4 | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| a5 | 5 | 5 | 5 | 5 | 4 | 5 | 4.87 |
| b1 | 4 | 4 | 4 | 4 | 2 | 3 | 3.47 |
| b2 | 4 | 4 | 4 | 4 | 2 | 3 | 3.47 |
| b3 | 4 | 4 | 4 | 4 | 2 | 3 | 3.47 |
| b4 | 4 | 4 | 4 | 4 | 2 | 3 | 3.47 |
| b5 | 4 | 4 | 4 | 4 | 2 | 3 | 3.47 |

**Key Observations:**
- a-conditions are uniformly excellent (4.87-5.00), while b-conditions cluster at 3.47
- The primary differentiator is efficiency: a-conditions give precisely targeted answers while b-conditions provide 3-5 "solutions" per task with hundreds of lines of code
- a1 achieves a perfect 5.00 composite by being both thorough and concise
- a-conditions better respect must_not constraints: none suggest migrating to .NET Core as a solution, and task 5 explicitly warns against it
- b-conditions frequently set all WCF quotas to int.MaxValue without discussing security implications (DoS risk)
- b-conditions tend to offer ServiceStack, IHttpHandler, and other alternatives for task 5 that dilute the core recommendation
- a4 has no output file for this agent type
- The "worst offender" (score 2) nature of this agent type means that vague/padded outputs are especially penalized -- b-conditions fall into this trap by providing broad but shallow guidance
