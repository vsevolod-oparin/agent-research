## Task 1: GridView Loading 50,000 Records -- Performance Fix

**Root cause:** Loading the entire 50,000-row dataset into memory and rendering it all into HTML with ViewState tracking creates a massive ViewState payload, enormous HTML output, and high memory pressure.

### Fix: Server-Side Paging (highest impact)

Use SQL-level paging so only the current page (25-50 rows) is fetched:

```sql
SELECT Id, Name, Status, CreatedDate
FROM Orders
ORDER BY CreatedDate DESC
OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY;

SELECT COUNT(*) FROM Orders;
```

Configure GridView:

```xml
<asp:GridView ID="GridView1" runat="server"
    EnableViewState="false"
    AllowPaging="true"
    AllowCustomPaging="true"
    PageSize="25" />
```

Handle paging:

```csharp
protected void GridView1_PageIndexChanging(object sender, GridViewPageEventArgs e)
{
    GridView1.PageIndex = e.NewPageIndex;
    BindGrid(e.NewPageIndex, GridView1.PageSize);
}

private void BindGrid(int pageIndex, int pageSize)
{
    int offset = pageIndex * pageSize;
    GridView1.VirtualItemCount = totalRecordCount;
    GridView1.DataSource = currentPageResults;
    GridView1.DataBind();
}
```

**Additional fixes:**
- Disable ViewState on the GridView (if read-only or rebinding on every postback)
- Add database indexes on ORDER BY columns
- Use parameterized queries for page/offset values

**Result:** 12 seconds → under 1 second. HTML shrinks from megabytes to kilobytes.

---

## Task 2: WCF Maximum Message Size Quota Exceeded

Default `maxReceivedMessageSize` is 65,536 bytes (64 KB). Increase on both service and client sides.

**Service-side (web.config):**

```xml
<system.serviceModel>
  <bindings>
    <basicHttpBinding>
      <binding name="LargeMessageBinding"
               maxReceivedMessageSize="67108864"
               maxBufferSize="67108864">
        <readerQuotas maxDepth="128"
                      maxStringContentLength="67108864"
                      maxArrayLength="67108864"
                      maxBytesPerRead="65536"
                      maxNameTableCharCount="67108864" />
      </binding>
    </basicHttpBinding>
  </bindings>
</system.serviceModel>
```

**Client-side:** Mirror the same binding configuration.

**Key points:**
- 67108864 = 64 MB. Set a deliberate upper bound, not `int.MaxValue`.
- `maxBufferSize` must equal `maxReceivedMessageSize` when using `transferMode="Buffered"`.
- For very large payloads (hundreds of MB), switch to `transferMode="Streamed"`.
- The `readerQuotas` section is equally important -- without increasing `maxStringContentLength`, you'll hit a different error.
- If hosted in IIS, also check `<httpRuntime maxRequestLength="65536" />` and IIS `maxAllowedContentLength`.

---

## Task 3: Adding Windows Authentication to a Web Forms App

Since users are in Active Directory, Windows Authentication provides SSO for domain-joined machines.

**Step 1: Configure IIS** -- Disable Anonymous Authentication, Enable Windows Authentication.

**Step 2: web.config**

```xml
<system.web>
  <authentication mode="Windows" />
  <authorization>
    <deny users="?" />
    <allow users="*" />
  </authorization>
</system.web>
```

**Step 3: Role-based authorization using AD groups**

```xml
<location path="Admin">
  <system.web>
    <authorization>
      <allow roles="DOMAIN\AppAdmins" />
      <deny users="*" />
    </authorization>
  </system.web>
</location>
```

```csharp
if (User.IsInRole(@"DOMAIN\AppAdmins"))
{
    pnlAdmin.Visible = true;
}
string username = User.Identity.Name; // DOMAIN\username
```

**Important considerations:**
- Kerberos delegation must be configured for the "double-hop" problem (passing credentials to backend SQL Server)
- For external/non-domain users, add Forms Authentication fallback with LDAP validation, or use ADFS for unified claims-based identity

---

## Task 4: Windows Service OutOfMemoryException -- Diagnosis and Fix

### Phase 1: Diagnose

**1. Add memory telemetry:**

```csharp
private void LogMemoryUsage(object state)
{
    using (Process process = Process.GetCurrentProcess())
    {
        long workingSetMB = process.WorkingSet64 / (1024 * 1024);
        long gcTotalMB = GC.GetTotalMemory(false) / (1024 * 1024);
        EventLog.WriteEntry("MyService",
            $"Memory: WorkingSet={workingSetMB}MB, GCHeap={gcTotalMB}MB",
            EventLogEntryType.Information);
    }
}
```

**2. Capture a dump before crash:**

```
procdump -ma -m 1500 MyService.exe C:\Dumps\
```

Analyze with WinDbg or Visual Studio Diagnostic Tools.

**3. Common MSMQ leak patterns:**

| Leak Source | Fix |
|-------------|-----|
| `MessageQueue` not disposed | Wrap in `using` |
| Event handler subscriptions growing | Unsubscribe when stopping |
| `XmlSerializer` created with multi-param constructor | Cache instances in static dict |
| Unbounded collections | Bound size, process in batches |
| `MessageQueueTransaction` not disposed | `using` or try/finally |

### Phase 2: Fix

Ensure proper disposal of MSMQ objects with `using` blocks around `MessageQueue` and `MessageQueueTransaction`. Cache `XmlSerializer` instances. Implement graceful shutdown.

**Safety net:** Configure Windows Service recovery to restart on failure (Services MMC → Recovery tab).

---

## Task 5: Exposing .NET Framework 4.8 Libraries as REST API

**Recommended: ASP.NET Web API 2** -- create a thin HTTP layer over existing class libraries.

**Option A: New Web API 2 project (recommended)**

1. Add new ASP.NET Web Application (.NET Framework) with Web API template
2. Add project references to existing class libraries
3. Create thin controllers:

```csharp
public class OrdersController : ApiController
{
    private readonly IOrderService _orderService;

    [HttpGet, Route("api/orders/{orderId}")]
    public IHttpActionResult GetOrder(int orderId)
    {
        Order order = _orderService.GetById(orderId);
        if (order == null) return NotFound();
        return Ok(order);
    }

    [HttpPost, Route("api/orders")]
    public IHttpActionResult CreateOrder([FromBody] CreateOrderRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        OrderResult result = _orderService.Create(request);
        return Created($"api/orders/{result.OrderId}", result);
    }
}
```

**Option B: OWIN Self-Host** -- Host inside a Windows Service or console app without IIS.

**Option C: Add Web API to existing Web Forms project** -- Install `Microsoft.AspNet.WebApi` NuGet, add `WebApiConfig.cs`, register in `Global.asax`.

**Cross-cutting concerns:**
- Authentication: OWIN bearer tokens or Windows Authentication
- Swagger: Install `Swashbuckle` NuGet
- Exception handling: Global `ExceptionFilterAttribute`
- CORS: `Microsoft.AspNet.WebApi.Cors`

**Key principle:** Keep controllers thin -- they handle HTTP concerns only. All business logic stays in existing class libraries.
