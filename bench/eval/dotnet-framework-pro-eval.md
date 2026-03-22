# Agent Evaluation: dotnet-framework-pro

**Date:** 2026-03-22
**Tasks evaluated:** dnf-001, dnf-002
**V1 source:** `.claude/agents/dotnet-framework-pro.md`
**V2 source:** `agents_v2/dotnet-framework-pro-v2.md`

---

## Task dnf-001

**Input:** .NET Framework 4.8 Web Forms app with GridView loading 50,000 records on page load. Page takes 12 seconds to render. How to fix?

**Ground truth requires:** server-side paging, specific GridView properties (AllowPaging, PageSize), SQL-level pagination (OFFSET/FETCH or ROW_NUMBER), caching. Must NOT give vague "optimize performance" or suggest migrating to .NET Core.

---

### BARE Response (dnf-001)

The 12-second render is caused by loading all 50,000 records at once. Here's how to fix it:

**1. Enable Server-Side Paging**
Instead of binding all records to the GridView, fetch only one page at a time. Set `AllowPaging="True"` and `PageSize="25"` on the GridView control. Handle the `PageIndexChanging` event to rebind with the new page index.

**2. Use SQL-Level Pagination**
Don't pull 50k rows from the database. Use SQL Server's `OFFSET/FETCH`:
```sql
SELECT * FROM Orders
ORDER BY OrderId
OFFSET @PageSize * (@PageNumber - 1) ROWS
FETCH NEXT @PageSize ROWS ONLY
```
For older SQL Server versions, use `ROW_NUMBER()` in a CTE.

**3. Add Caching**
If the data doesn't change frequently, cache repeated queries using `HttpRuntime.Cache` or `MemoryCache` with a short TTL (e.g., 5 minutes). Cache the total row count separately to avoid running `COUNT(*)` on every page request.

**4. Reduce ViewState**
With 50k records the ViewState is enormous. Enabling paging fixes this, but also set `EnableViewState="False"` on columns that don't need postback.

**5. Add a Loading Indicator**
While optimizing, add an `UpdatePanel` with `UpdateProgress` so users see feedback during page changes.

These changes should reduce page load from 12 seconds to under 1 second.

---

### V1 Response (dnf-001)

To address the performance issue with your Web Forms GridView, follow this systematic approach:

**Legacy Assessment**
The root cause is loading all 50,000 records into the GridView at once, which impacts both database query time and page render time. This is a common performance bottleneck in enterprise Web Forms applications.

**Implementation Approach**
First, implement server-side paging to load only a subset of records per request. Optimize the data access layer and enhance the overall page performance.

**Performance Optimization**
- Implement paging to reduce data transfer
- Optimize database queries for efficiency
- Add caching for frequently accessed data
- Reduce ViewState size
- Consider connection pooling
- Optimize memory usage

**Architecture Review**
Ensure layered architecture separates data access from presentation. Apply enterprise patterns for scalability. Consider implementing a repository pattern if not already present.

**Security Considerations**
Ensure any query parameters used for pagination are properly parameterized to prevent SQL injection.

**Best Practices**
Follow .NET Framework conventions, implement proper error handling, add logging for performance monitoring, and ensure documentation is updated to reflect the pagination changes.

These improvements will significantly reduce page load time while maintaining backward compatibility with the existing application architecture.

---

### V2 Response (dnf-001)

This is a classic Web Forms performance issue. The GridView is binding all 50,000 rows, which kills render time and bloats ViewState. Here is the fix:

**Step 1: Enable Server-Side Paging on the GridView**
```aspx
<asp:GridView ID="gvRecords" runat="server"
    AllowPaging="True"
    PageSize="25"
    OnPageIndexChanging="gvRecords_PageIndexChanging">
</asp:GridView>
```

**Step 2: Implement SQL-Level Pagination**
Do NOT use the GridView's built-in data source paging (which still loads all rows). Fetch only the current page from SQL Server:
```sql
SELECT Id, Name, CreatedDate
FROM Records
ORDER BY Id
OFFSET @Offset ROWS
FETCH NEXT @PageSize ROWS ONLY;
```
For SQL Server 2008 (pre-2012), use `ROW_NUMBER()`:
```sql
;WITH CTE AS (
    SELECT *, ROW_NUMBER() OVER (ORDER BY Id) AS RowNum FROM Records
)
SELECT * FROM CTE WHERE RowNum BETWEEN @Start AND @End;
```

**Step 3: Set Total Row Count for Pager**
Query `SELECT COUNT(*) FROM Records` once and cache it. Set the GridView's virtual item count via a custom pager or `ObjectDataSource` with `EnablePaging="True"` and `SelectCountMethod`.

**Step 4: Add Output Caching**
For queries that don't change frequently, cache with `MemoryCache`:
```csharp
var cacheKey = $"records_page_{pageNumber}";
var data = MemoryCache.Default.Get(cacheKey) as DataTable;
if (data == null) {
    data = FetchPage(pageNumber, pageSize);
    MemoryCache.Default.Add(cacheKey, data,
        DateTimeOffset.UtcNow.AddMinutes(5));
}
```

This reduces the query from 50k rows to 25, and render time from 12 seconds to under 500ms.

---

### Scores (dnf-001)

| Dimension | BARE | V1 | V2 |
|-----------|------|-----|-----|
| Completeness | 4 | 2 | 5 |
| Precision | 4 | 1 | 5 |
| Actionability | 4 | 1 | 5 |
| Structure | 4 | 3 | 5 |
| Efficiency | 4 | 2 | 5 |
| Depth | 3 | 2 | 5 |

**Composite:** BARE = (4×2 + 4×1.5 + 4+4+3) / 7.5 = (8+6+11) / 7.5 = **3.33** | V1 = (1×2 + 2×1.5 + 1+3+2+2) / 7.5 = (2+3+8) / 7.5 = **1.73** | V2 = (5×2 + 5×1.5 + 5+5+5) / 7.5 = (10+7.5+15) / 7.5 = **4.33**

**LIFT:** V1 = 1.73 - 3.33 = **-1.60** | V2 = 4.33 - 3.33 = **+1.00**

**Analysis:** V1 is actively harmful -- it turns a good instinct into buzzword soup. The agent instructions are pure adjective lists ("optimize performance", "layered architecture", "enterprise patterns") that dilute rather than sharpen the response. It misses ALL ground truth specifics: no `AllowPaging`, no `PageSize`, no `OFFSET/FETCH`, no concrete SQL. V2's fix patterns table and diagnostic workflow produce a precise, code-complete answer with exact GridView properties, both SQL pagination syntaxes, and caching implementation.

---

## Task dnf-002

**Input:** WCF service throws "The maximum message size quota for incoming messages has been exceeded" when clients send large payloads. How to fix?

**Ground truth requires:** maxReceivedMessageSize in binding config, maxBufferSize and maxBufferPoolSize, specific XML config example with values, streaming transfer mode for very large payloads. Structure: exact config snippet, before/after comparison.

---

### BARE Response (dnf-002)

The error means WCF's default message size limit (65536 bytes) is too small for your payloads. You need to increase the quota in your binding configuration.

**Server-side fix (web.config or app.config):**
```xml
<system.serviceModel>
  <bindings>
    <basicHttpBinding>
      <binding name="LargeMessageBinding"
               maxReceivedMessageSize="67108864"
               maxBufferSize="67108864"
               maxBufferPoolSize="67108864">
        <readerQuotas maxStringContentLength="67108864"
                      maxArrayLength="67108864" />
      </binding>
    </basicHttpBinding>
  </bindings>
  <services>
    <service name="MyApp.MyService">
      <endpoint binding="basicHttpBinding"
                bindingConfiguration="LargeMessageBinding"
                contract="MyApp.IMyService" />
    </service>
  </services>
</system.serviceModel>
```

**Client-side:** The same binding config must be updated on the client. Update the client's app.config or regenerate the service reference.

**For very large payloads (>10MB):** Consider switching to streamed transfer mode instead of buffered:
```xml
<binding name="StreamedBinding"
         transferMode="Streamed"
         maxReceivedMessageSize="268435456" />
```
With streaming, the service contract must use `Stream` as the message body parameter.

**Key values:** 67108864 = 64MB. Adjust based on your actual maximum expected payload. Don't set arbitrarily high values -- size the limit to your real-world maximum plus a reasonable margin.

---

### V1 Response (dnf-002)

To resolve the WCF maximum message size error, follow this enterprise-grade approach:

**Legacy Assessment**
This is a common WCF configuration issue where the default message size quota is insufficient for the payload size required by the application. A thorough assessment of the service architecture is needed.

**Implementation Phase**
Update the WCF binding configuration to increase the message size limits. The key settings to adjust are:
- `maxReceivedMessageSize` -- controls the maximum incoming message size
- `maxBufferSize` -- controls the buffer allocation
- `maxBufferPoolSize` -- manages the buffer pool

Ensure the configuration changes are applied consistently across all environments.

**Security Considerations**
When increasing message sizes, be aware of the security implications. Larger message sizes increase the surface area for denial-of-service attacks. Implement proper input validation and consider rate limiting.

**Performance Optimization**
For very large payloads, consider using streaming transfer mode instead of buffered mode. This improves memory usage and throughput for large data transfers.

**Best Practices**
- Follow .NET Framework conventions for WCF configuration
- Test with representative payload sizes
- Monitor service performance after changes
- Document the configuration changes
- Implement proper error handling for oversized messages
- Ensure logging captures message size metrics

Apply these changes while maintaining backward compatibility with existing service consumers.

---

### V2 Response (dnf-002)

This is a standard WCF quota error. The default `maxReceivedMessageSize` is 65536 bytes (64KB). The fix is in the binding configuration on both server and client.

**Before (default -- causes the error):**
```xml
<basicHttpBinding>
  <binding name="MyBinding" />
  <!-- maxReceivedMessageSize defaults to 65536 -->
</basicHttpBinding>
```

**After (fix):**
```xml
<system.serviceModel>
  <bindings>
    <basicHttpBinding>
      <binding name="MyBinding"
               maxReceivedMessageSize="52428800"
               maxBufferSize="52428800"
               maxBufferPoolSize="52428800">
        <readerQuotas maxDepth="32"
                      maxStringContentLength="8388608"
                      maxArrayLength="16384"
                      maxBytesPerRead="4096"
                      maxNameTableCharCount="16384" />
      </binding>
    </basicHttpBinding>
  </bindings>
</system.serviceModel>
```
Values above set `maxReceivedMessageSize` to 50MB. Adjust to your actual maximum payload + margin.

**Critical: update BOTH sides.** The client's `app.config` (or generated `ServiceReferences.ClientConfig`) must also have the increased limits, or you'll get the same error in the other direction.

**For very large payloads (streaming):**
If payloads regularly exceed ~50MB, switch to streamed transfer:
```xml
<binding name="StreamedBinding"
         transferMode="StreamedRequest"
         maxReceivedMessageSize="209715200" />
```
The service contract parameter must be `Stream`, and you lose some WCF features (message-level security, reliable sessions).

This maps directly to the fix patterns table: WCF `413 Request Entity Too Large` / default message size limits -> increase `maxReceivedMessageSize` and `maxBufferSize` in binding config.

---

### Scores (dnf-002)

| Dimension | BARE | V1 | V2 |
|-----------|------|-----|-----|
| Completeness | 5 | 2 | 5 |
| Precision | 4 | 2 | 5 |
| Actionability | 5 | 1 | 5 |
| Structure | 4 | 3 | 5 |
| Efficiency | 4 | 2 | 5 |
| Depth | 4 | 2 | 5 |

**Composite:** BARE = (4×2 + 5×1.5 + 5+4+4) / 7.5 = (8+7.5+13) / 7.5 = **3.80** | V1 = (2×2 + 2×1.5 + 1+3+2+2) / 7.5 = (4+3+8) / 7.5 = **2.00** | V2 = (5×2 + 5×1.5 + 5+5+5) / 7.5 = (10+7.5+15) / 7.5 = **4.33**

**LIFT:** V1 = 2.00 - 3.80 = **-1.80** | V2 = 4.33 - 3.80 = **+0.53**

**Analysis:** V1 again degrades output. It names the right config properties but provides NO XML snippet -- the single most important deliverable for this task. Instead it pads with "enterprise-grade approach", "security considerations", and "best practices" bullet points that add no value. V2 delivers the exact before/after XML config the ground truth demands, includes `readerQuotas`, explains both-sides requirement, and covers streaming with trade-off notes.

---

## Summary

| Task | Metric | BARE | V1 | V2 |
|------|--------|------|-----|-----|
| dnf-001 | Composite | 3.33 | 1.73 | 4.33 |
| dnf-001 | LIFT | -- | -1.60 | +1.00 |
| dnf-002 | Composite | 3.80 | 2.00 | 4.33 |
| dnf-002 | LIFT | -- | -1.80 | +0.53 |
| **Average** | **Composite** | **3.57** | **1.87** | **4.33** |
| **Average** | **LIFT** | **--** | **-1.70** | **+0.77** |

### Key Findings

1. **V1 is actively harmful (LIFT -1.70).** The v1 agent file is composed entirely of generic adjective lists ("performance optimized", "security hardened", "enterprise patterns") with zero concrete technical content. When the model follows these instructions, it replaces specific technical knowledge with buzzword padding. Both responses lack code snippets, exact property names, and config syntax that the ground truth demands.

2. **V2 delivers substantial improvement (LIFT +0.77).** The Common Fix Patterns table, Technology Decision Table, and Anti-Patterns list give the model concrete anchors. The WCF message size error appears verbatim in the fix patterns table, which directly produced the correct before/after XML. The anti-pattern "Do NOT suggest .NET Core migration" prevented the most common failure mode.

3. **BARE performs surprisingly well (3.57).** The base model already has strong .NET Framework knowledge. V1's negative lift proves that vague instructions don't just fail to help -- they actively displace the model's existing domain knowledge with filler content.

4. **V2's structural advantages:**
   - Fix patterns table maps symptoms to solutions (model can pattern-match)
   - Anti-patterns list prevents common wrong answers
   - Diagnostic workflow provides sequential reasoning structure
   - Technology decision table disambiguates "use this, not that"

**Verdict:** V1 should be replaced. V2 transforms a harmful agent into a consistently beneficial one, with a delta of +2.47 composite points between versions.
