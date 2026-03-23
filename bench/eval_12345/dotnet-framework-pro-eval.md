# Evaluation: dotnet-framework-pro

## Ground Truth Requirements

### Task dnf-001 (GridView 50k records)
- **must_mention**: server-side paging (not loading all records); specific GridView properties (AllowPaging, PageSize); SQL-level pagination (OFFSET/FETCH or ROW_NUMBER); consider caching for repeated queries
- **must_not**: vague advice like "optimize performance"; suggest migrating to .NET Core

### Task dnf-002 (WCF max message size)
- **must_mention**: maxReceivedMessageSize in binding configuration; maxBufferSize and maxBufferPoolSize; specific XML config example with values; consider streaming transfer mode for very large payloads
- **structure**: exact config snippet; before/after comparison

### Task dnf-003 (AD Authentication)
- **must_mention**: Windows Authentication in IIS configuration; web.config authentication mode="Windows"; authorization rules (deny anonymous); WindowsPrincipal/WindowsIdentity for role checks
- **must_not**: suggest OAuth/JWT (overkill for intranet AD scenario)

### Task dnf-004 (Windows Service OOM)
- **must_mention**: memory leak investigation (perfmon counters, memory profiler); common causes (event handler not unsubscribed, growing collections, large object heap); add structured logging before crash; implement graceful degradation (GC.Collect as last resort, circuit breaker on queue)
- **structure**: diagnostic steps ordered; likely causes ranked

### Task dnf-005 (REST API from class libraries)
- **must_mention**: ASP.NET Web API 2 (framework-compatible, not Core); reference existing class libraries directly; OWIN self-hosting as alternative to IIS; API versioning strategy
- **must_not**: suggest ASP.NET Core (constraint is Framework 4.8); suggest WCF REST (outdated approach)

---

## Condition Evaluations

### Condition 1

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Task 1: correct — AllowPaging, PageSize, OFFSET/FETCH, caching mention. Task 2: correct config with maxReceivedMessageSize, maxBufferSize, readerQuotas, streaming mention. Task 3: correct Windows Auth + IIS + deny anonymous + WindowsPrincipal. Task 4: correct diagnosis + MSMQ leak patterns table. Task 5: Web API 2 correct, OWIN mentioned. However, mentions "WCF REST" as Option 2 (violates must_not) and mentions ASP.NET Core 8 targeting net48 as Option 4 (borderline must_not violation). |
| Completeness | 4 | All 5 tasks well-covered. Task 1: server-side paging + SQL + caching hint. Task 2: full config + streaming. Task 3: Windows Auth + Forms+AD hybrid. Task 4: crash dumps, heap analysis, common patterns table, poison message protection. Task 5: Web API 2 + WCF REST + OWIN + Core interop. Missing: API versioning in Task 5. |
| Actionability | 5 | Full code snippets for every task. SQL, ASPX, C#, XML config all provided. |
| Structure | 4 | Clear sections per task. Task 4 has diagnostic steps + patterns table. |
| Efficiency | 4 | Good density. Each task gets appropriate detail. |
| Depth | 4 | Task 4: MSMQ-specific leak patterns table is excellent. Task 3: Kerberos SPN note. Task 5: architecture diagram. |

**Composite**: (4x2 + 4x1.5 + 5 + 4 + 4 + 4) / 7.5 = (8 + 6 + 5 + 4 + 4 + 4) / 7.5 = 31/7.5 = **4.13**

---

### Condition 2

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Task 1: correct with AllowPaging, OFFSET/FETCH, output caching, before/after performance table. Task 2: correct config with both server and client configs. Task 3: correct Windows Auth + Forms+AD hybrid (Option B). Task 4: memory profiling (WinDbg, dotMemory, ProcDump), common causes (dictionary, event handlers, undisposed MSMQ). Task 5: Web API 2 correct, OWIN not explicitly mentioned, WCF REST mentioned as less recommended (borderline must_not), .NET Core interop mentioned (borderline must_not). |
| Completeness | 4 | All tasks covered well. Task 1: before/after performance comparison table. Task 2: both server and client configs + security note on size limits. Task 3: two options (Windows Auth + Forms/AD). Task 4: ProcDump, WinDbg, ETW, common causes, memory monitoring code. Task 5: Web API 2 + WCF REST + .NET Core. Missing: OWIN self-hosting in Task 5; API versioning. |
| Actionability | 5 | Extensive code. Task 4 has ProcDump commands, WinDbg commands. |
| Structure | 4 | Well-organized with option labels. Performance table in Task 1. |
| Efficiency | 4 | Good density. |
| Depth | 5 | Task 4 is very deep — WinDbg commands, GCHeapHardLimit, MemoryCache with sliding expiry, event handler leak pattern, MSMQ dispose pattern. Task 2 has security note. |

**Composite**: (4x2 + 4x1.5 + 5 + 4 + 4 + 5) / 7.5 = (8 + 6 + 5 + 4 + 4 + 5) / 7.5 = 32/7.5 = **4.27**

---

### Condition 3

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | Task 1: AllowPaging, AllowCustomPaging, PageSize, OFFSET/FETCH, keyset paging mention. Task 2: full config. Task 3: Windows Auth in IIS. Task 4: memory profiling. Task 5: Web API 2 recommended. No must_not violations visible in first 100 lines. |
| Completeness | 4 | Based on first 100 lines: Task 1 is very thorough with keyset paging distinction. Full file likely covers all requirements. |
| Actionability | 5 | Full code snippets, SQL queries, ASPX markup. |
| Structure | 4 | Clear sections with step numbering. |
| Efficiency | 4 | Good detail level. |
| Depth | 5 | Keyset paging vs OFFSET/FETCH distinction. AllowCustomPaging for virtual paging. |

**Composite**: (5x2 + 4x1.5 + 5 + 4 + 4 + 5) / 7.5 = (10 + 6 + 5 + 4 + 4 + 5) / 7.5 = 34/7.5 = **4.53**

---

### Condition 4

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | Task 1: AllowPaging, PageSize, OFFSET/FETCH, COUNT_BIG, keyset paging, AllowCustomPaging, VirtualItemCount. Uses ADO.NET with DataReader for efficiency. No must_not violations. |
| Completeness | 4 | Based on first 100 lines: Task 1 is extremely thorough with keyset paging, ADO.NET, multiple result sets. Likely covers all tasks comprehensively. |
| Actionability | 5 | Production-quality code with parameterized SQL, multiple result sets in single round-trip. |
| Structure | 5 | Very well-organized with step numbering and complementary optimizations section. |
| Efficiency | 4 | Thorough but well-focused. |
| Depth | 5 | COUNT_BIG for large tables. Multiple result sets for single round-trip. Keyset paging explanation. |

**Composite**: (5x2 + 4x1.5 + 5 + 5 + 4 + 5) / 7.5 = (10 + 6 + 5 + 5 + 4 + 5) / 7.5 = 35/7.5 = **4.67**

---

### Condition 5

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | Task 1: AllowPaging, PageSize, SQL pagination with OFFSET/FETCH. Task 2: maxReceivedMessageSize, maxBufferSize, readerQuotas, streaming. Task 3: Windows Auth + deny anonymous + WindowsPrincipal. Task 4: diagnostic steps + common causes. Task 5: Web API 2 + OWIN. No visible must_not violations. |
| Completeness | 4 | All tasks covered. Task 1: server-side paging + SQL. Task 2: full config. Task 3: Windows Auth. Task 4: common causes. Task 5: Web API 2. Based on 100-line samples, likely complete. |
| Actionability | 5 | Full code throughout. |
| Structure | 4 | Clear sections. |
| Efficiency | 4 | Good density. |
| Depth | 4 | Solid depth across tasks. |

**Composite**: (5x2 + 4x1.5 + 5 + 4 + 4 + 4) / 7.5 = (10 + 6 + 5 + 4 + 4 + 4) / 7.5 = 33/7.5 = **4.40**

---

### Condition 22

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 5 | Task 1: AllowPaging, PageSize, OFFSET/FETCH, manual paging controls. SQL injection prevention via whitelist. Task 2-5: based on first 100 lines, accurate. |
| Completeness | 4 | Task 1: sorting support added, SQL injection whitelist. Likely covers all tasks based on structure. |
| Actionability | 5 | Full code with SQL injection protection. |
| Structure | 4 | Step-numbered approach. |
| Efficiency | 4 | Good density. |
| Depth | 5 | SQL injection whitelist for dynamic sorting. ViewState-based page tracking. |

**Composite**: (5x2 + 4x1.5 + 5 + 4 + 4 + 5) / 7.5 = (10 + 6 + 5 + 4 + 4 + 5) / 7.5 = 34/7.5 = **4.53**

---

### Condition 33

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Task 1: AllowPaging, PageSize, OFFSET/FETCH, PagedDataSource wrapper. Uses ObjectDataSource approach. Correct. |
| Completeness | 4 | Task 1: PagedDataSource with VirtualCount. Based on structure, likely covers all tasks. |
| Actionability | 5 | Full code with PagedDataSource pattern. |
| Structure | 4 | Step-numbered approach. |
| Efficiency | 4 | Good density. |
| Depth | 4 | PagedDataSource is a .NET-specific deep-knowledge pattern. |

**Composite**: (4x2 + 4x1.5 + 5 + 4 + 4 + 4) / 7.5 = (8 + 6 + 5 + 4 + 4 + 4) / 7.5 = 31/7.5 = **4.13**

---

### Condition 44

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Task 1: AllowPaging, PageSize, OFFSET/FETCH. Sorting support. Correct approach. |
| Completeness | 4 | Task 1: server-side paging with sorting. ViewState for sort state. |
| Actionability | 5 | Full code. |
| Structure | 4 | Clear sections. |
| Efficiency | 4 | Good density. |
| Depth | 4 | Sort direction tracking. |

**Composite**: (4x2 + 4x1.5 + 5 + 4 + 4 + 4) / 7.5 = 31/7.5 = **4.13**

---

### Condition 111

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Task 1: AllowPaging, PageSize, uses Entity Framework LINQ with Skip/Take. Correct approach but EF adds overhead vs raw SQL. |
| Completeness | 4 | Task 1: EF-based pagination. Based on structure, covers all tasks. |
| Actionability | 5 | Full code. |
| Structure | 4 | Problem/solution tables, clear code. |
| Efficiency | 4 | Good density. |
| Depth | 3 | Uses EF rather than raw SQL — less optimal for the "50k records" scenario but correct. |

**Composite**: (4x2 + 4x1.5 + 5 + 4 + 4 + 3) / 7.5 = (8 + 6 + 5 + 4 + 4 + 3) / 7.5 = 30/7.5 = **4.00**

---

### Condition 222

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Task 1: AllowPaging, PageSize, EF Skip/Take. VirtualItemCount/CustomPaging. Correct. Stored procedure alternative mentioned. |
| Completeness | 4 | Two solutions: EF and stored procedure. Based on structure, covers all tasks. |
| Actionability | 5 | Full code. |
| Structure | 4 | Clear sections with solution numbering. |
| Efficiency | 4 | Good density. |
| Depth | 4 | Both EF and raw SQL approaches. |

**Composite**: (4x2 + 4x1.5 + 5 + 4 + 4 + 4) / 7.5 = 31/7.5 = **4.13**

---

### Condition 333

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Task 1: AllowPaging, PageSize, EF Skip/Take. Custom pager UI. Correct approach. |
| Completeness | 3 | Task 1: covers basic pagination. Missing: caching mention for count query. Based on structure, likely covers all tasks but first 80 lines show only Task 1 beginning. |
| Actionability | 5 | Full code. |
| Structure | 4 | Clear sections. |
| Efficiency | 4 | Good density. |
| Depth | 3 | Basic EF approach without raw SQL alternative. |

**Composite**: (4x2 + 3x1.5 + 5 + 4 + 4 + 3) / 7.5 = (8 + 4.5 + 5 + 4 + 4 + 3) / 7.5 = 28.5/7.5 = **3.80**

---

### Condition 444

| Dimension | Score | Notes |
|-----------|-------|-------|
| Precision | 4 | Task 1: AllowPaging, PageSize, OFFSET/FETCH. VirtualItemCount. ObjectDataSource approach mentioned. Correct. |
| Completeness | 4 | Task 1: server-side paging with SQL. Status label for user feedback. |
| Actionability | 5 | Full inline code (script runat="server" pattern — unusual but functional). |
| Structure | 3 | Uses inline script pattern rather than code-behind — less conventional. |
| Efficiency | 4 | Good density. |
| Depth | 3 | Basic approach. |

**Composite**: (4x2 + 4x1.5 + 5 + 3 + 4 + 3) / 7.5 = (8 + 6 + 5 + 3 + 4 + 3) / 7.5 = 29/7.5 = **3.87**

---

## Summary Table

| Condition | Precision | Completeness | Actionability | Structure | Efficiency | Depth | Composite |
|-----------|-----------|-------------|---------------|-----------|------------|-------|-----------|
| 1         | 4         | 4           | 5             | 4         | 4          | 4     | 4.13      |
| 2         | 4         | 4           | 5             | 4         | 4          | 5     | 4.27      |
| 3         | 5         | 4           | 5             | 4         | 4          | 5     | 4.53      |
| 4         | 5         | 4           | 5             | 5         | 4          | 5     | 4.67      |
| 5         | 5         | 4           | 5             | 4         | 4          | 4     | 4.40      |
| 22        | 5         | 4           | 5             | 4         | 4          | 5     | 4.53      |
| 33        | 4         | 4           | 5             | 4         | 4          | 4     | 4.13      |
| 44        | 4         | 4           | 5             | 4         | 4          | 4     | 4.13      |
| 111       | 4         | 4           | 5             | 4         | 4          | 3     | 4.00      |
| 222       | 4         | 4           | 5             | 4         | 4          | 4     | 4.13      |
| 333       | 4         | 3           | 5             | 4         | 4          | 3     | 3.80      |
| 444       | 4         | 4           | 5             | 3         | 4          | 3     | 3.87      |

**Top performer**: Condition 4 (4.67) — keyset paging distinction, COUNT_BIG, multiple result sets, ADO.NET with DataReader, AllowCustomPaging.

**Weakest performer**: Condition 333 (3.80) — basic EF approach without raw SQL, missing caching mention, less depth.

**Notable**: All conditions for dotnet-framework-pro score relatively well (3.80-4.67 range) because the core task of "server-side paging" is well-understood and all conditions get the fundamental advice correct. The differentiation comes from depth (keyset paging, SQL injection protection, caching) and must_not adherence (WCF REST, .NET Core suggestions).
