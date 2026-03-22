## Task 1: GridView Loading 50,000 Records -- Performance Fix

### Problem

A .NET Framework 4.8 Web Forms page loads all 50,000 records into a GridView on page load, resulting in a 12-second render time. This is a classic performance bottleneck caused by fetching and rendering an unreasonably large dataset in a single request.

### Root Causes

1. **No server-side paging** -- all 50,000 rows are fetched from the database and bound to the GridView at once.
2. **ViewState bloat** -- the GridView serializes all 50,000 rows into ViewState, inflating the page payload sent to the browser.
3. **Rendering overhead** -- the browser must parse and lay out 50,000 HTML table rows.

### Solution: Server-Side Paging with Database-Level Filtering

**Step 1: Implement database-level paging.**

Use `OFFSET`/`FETCH` (SQL Server 2012+) or `ROW_NUMBER()` to return only the requested page of data:

```sql
-- SQL Server 2012+ approach
SELECT Id, Name, Status, CreatedDate
FROM Orders
ORDER BY CreatedDate DESC
OFFSET @PageIndex * @PageSize ROWS
FETCH NEXT @PageSize ROWS ONLY;
```

**Step 2: Enable custom paging on the GridView.**

```aspx
<asp:GridView ID="gvOrders" runat="server"
    AllowPaging="True"
    AllowCustomPaging="True"
    PageSize="25"
    OnPageIndexChanging="gvOrders_PageIndexChanging"
    EnableViewState="False">
</asp:GridView>
```

Setting `AllowCustomPaging="True"` tells the GridView that you are managing the total row count yourself, so it will not attempt to page through the full in-memory dataset.

**Step 3: Code-behind implementation.**

```csharp
protected void Page_Load(object sender, EventArgs e)
{
    if (!IsPostBack)
    {
        BindGrid(0);
    }
}

private void BindGrid(int pageIndex)
{
    int pageSize = gvOrders.PageSize;
    int totalRecords = OrderRepository.GetTotalCount();

    gvOrders.VirtualItemCount = totalRecords;
    gvOrders.PageIndex = pageIndex;
    gvOrders.DataSource = OrderRepository.GetPagedOrders(pageIndex, pageSize);
    gvOrders.DataBind();
}

protected void gvOrders_PageIndexChanging(object sender, GridViewPageEventArgs e)
{
    BindGrid(e.NewPageIndex);
}
```

**Step 4: Repository method returning only the requested page.**

```csharp
public static List<Order> GetPagedOrders(int pageIndex, int pageSize)
{
    using (var conn = new SqlConnection(ConfigurationManager.ConnectionStrings["AppDb"].ConnectionString))
    using (var cmd = new SqlCommand("usp_GetPagedOrders", conn))
    {
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Parameters.AddWithValue("@PageIndex", pageIndex);
        cmd.Parameters.AddWithValue("@PageSize", pageSize);
        conn.Open();

        var orders = new List<Order>();
        using (var reader = cmd.ExecuteReader())
        {
            while (reader.Read())
            {
                orders.Add(MapOrder(reader));
            }
        }
        return orders;
    }
}
```

### Additional Optimizations

- **Disable ViewState** on the GridView (`EnableViewState="False"`) since paged data is re-fetched on each postback anyway.
- **Add database indexes** on the columns used in ORDER BY and WHERE clauses.
- **Cache the total count** using `HttpRuntime.Cache` so you do not run `COUNT(*)` on every page change. Invalidate it on data changes.
- **Consider an UpdatePanel** around the GridView if you want to avoid full-page postbacks during paging, though be aware this adds its own overhead.
- **Output caching** at the page or control level if the data does not change frequently: `<%@ OutputCache Duration="60" VaryByParam="page" %>`.

### Expected Result

Page load drops from 12 seconds to under 500 milliseconds. The database returns 25 rows instead of 50,000, ViewState shrinks from megabytes to kilobytes, and the browser renders a small HTML table almost instantly.

---

## Task 2: WCF Maximum Message Size Quota Exceeded

### Problem

The WCF service rejects incoming messages that exceed the default `maxReceivedMessageSize` of 65,536 bytes (64 KB), throwing:

> System.ServiceModel.CommunicationException: The maximum message size quota for incoming messages (65536) has been exceeded.

### Solution

Increase the binding quotas on **both the service (server) and the client** configurations. Both sides must agree on the limits.

**Server-side `web.config` (or `app.config`):**

```xml
<system.serviceModel>
  <bindings>
    <basicHttpBinding>
      <binding name="LargeMessageBinding"
               maxReceivedMessageSize="10485760"
               maxBufferSize="10485760"
               maxBufferPoolSize="10485760">
        <readerQuotas maxDepth="64"
                      maxStringContentLength="10485760"
                      maxArrayLength="10485760"
                      maxBytesPerRead="10485760"
                      maxNameTableCharCount="10485760" />
      </binding>
    </basicHttpBinding>
  </bindings>

  <services>
    <service name="MyApp.Services.OrderService">
      <endpoint address=""
                binding="basicHttpBinding"
                bindingConfiguration="LargeMessageBinding"
                contract="MyApp.Services.IOrderService" />
    </service>
  </services>
</system.serviceModel>
```

**Client-side `app.config`:**

```xml
<system.serviceModel>
  <bindings>
    <basicHttpBinding>
      <binding name="LargeMessageBinding"
               maxReceivedMessageSize="10485760"
               maxBufferSize="10485760">
        <readerQuotas maxDepth="64"
                      maxStringContentLength="10485760"
                      maxArrayLength="10485760"
                      maxBytesPerRead="10485760"
                      maxNameTableCharCount="10485760" />
      </binding>
    </basicHttpBinding>
  </bindings>

  <client>
    <endpoint address="http://server/OrderService.svc"
              binding="basicHttpBinding"
              bindingConfiguration="LargeMessageBinding"
              contract="MyApp.Services.IOrderService"
              name="OrderServiceEndpoint" />
  </client>
</system.serviceModel>
```

### Key Configuration Values Explained

| Setting | Default | Purpose |
|---|---|---|
| `maxReceivedMessageSize` | 65536 | Maximum size of an incoming message in bytes |
| `maxBufferSize` | 65536 | Maximum buffer size for buffered messages; must equal `maxReceivedMessageSize` for buffered transfer mode |
| `readerQuotas.maxStringContentLength` | 8192 | Maximum allowed string length in XML content |
| `readerQuotas.maxArrayLength` | 16384 | Maximum allowed array length in serialized data |

### Important Considerations

1. **Set limits to the actual expected maximum, not to `int.MaxValue`.** Setting `maxReceivedMessageSize="2147483647"` opens the service to denial-of-service attacks where a single malicious request consumes all server memory.

2. **For streaming large payloads**, switch the transfer mode instead of raising buffer limits:

```xml
<binding name="StreamedBinding"
         transferMode="Streamed"
         maxReceivedMessageSize="104857600">
</binding>
```

Streamed mode does not buffer the entire message in memory, making it suitable for file uploads and large data transfers.

3. **If using `wsHttpBinding` or `netTcpBinding`**, apply the same attributes to those binding types instead of `basicHttpBinding`.

4. **For programmatic configuration** (useful in self-hosted services):

```csharp
var binding = new BasicHttpBinding();
binding.MaxReceivedMessageSize = 10 * 1024 * 1024; // 10 MB
binding.MaxBufferSize = 10 * 1024 * 1024;
binding.ReaderQuotas.MaxStringContentLength = 10 * 1024 * 1024;
binding.ReaderQuotas.MaxArrayLength = 10 * 1024 * 1024;
```

5. **IIS request limits** may also block large payloads independently of WCF. If you are hosted in IIS, also check:

```xml
<system.web>
  <httpRuntime maxRequestLength="10240" /> <!-- in KB -->
</system.web>
<system.webServer>
  <security>
    <requestFiltering>
      <requestLimits maxAllowedContentLength="10485760" /> <!-- in bytes -->
    </requestFiltering>
  </security>
</system.webServer>
```

---

## Task 3: Adding Windows Authentication to an Existing Web Forms Application

### Problem

An existing Web Forms application has no authentication. Users are managed in Active Directory. We need to add auth without disrupting the existing application structure.

### Approach: Windows Authentication via IIS Integration

Since users are already in Active Directory, Windows Authentication is the most natural and lowest-friction choice for an intranet application. There is no need to build a login page, manage passwords, or deploy a separate identity provider.

### Step 1: Configure IIS

In IIS Manager for the application:

1. Open **Authentication** settings.
2. **Disable** Anonymous Authentication.
3. **Enable** Windows Authentication.

Or via `web.config`:

```xml
<system.webServer>
  <security>
    <authentication>
      <windowsAuthentication enabled="true" />
      <anonymousAuthentication enabled="false" />
    </authentication>
  </security>
</system.webServer>
```

### Step 2: Configure `web.config` Authentication and Authorization

```xml
<system.web>
  <authentication mode="Windows" />

  <authorization>
    <deny users="?" />   <!-- Deny anonymous users -->
    <allow users="*" />  <!-- Allow all authenticated users -->
  </authorization>
</system.web>
```

### Step 3: Access User Identity in Code

Once configured, the authenticated user is available throughout the application:

```csharp
// In any page code-behind or handler
string username = HttpContext.Current.User.Identity.Name;
// Returns "DOMAIN\username"

bool isAuthenticated = HttpContext.Current.User.Identity.IsAuthenticated;
```

### Step 4: Implement Role-Based Authorization Using AD Groups

Map Active Directory groups to application roles for page-level and feature-level access control.

**Restrict specific pages or folders via `web.config`:**

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

**Check roles in code:**

```csharp
if (User.IsInRole(@"DOMAIN\AppAdmins"))
{
    pnlAdminControls.Visible = true;
}
```

### Step 5: Create a Base Page for Common Auth Logic

```csharp
public class SecureBasePage : System.Web.UI.Page
{
    protected override void OnInit(EventArgs e)
    {
        base.OnInit(e);

        if (!User.Identity.IsAuthenticated)
        {
            Response.StatusCode = 401;
            Response.End();
            return;
        }

        // Log access for audit trail
        Logger.Info($"Page accessed: {Request.Url.AbsolutePath} by {User.Identity.Name}");
    }

    protected string CurrentUsername => User.Identity.Name;

    protected bool IsAdmin => User.IsInRole(@"DOMAIN\AppAdmins");
}
```

Have existing pages inherit from `SecureBasePage` instead of `System.Web.UI.Page`.

### Step 6: Handle Pages That Should Remain Public (if any)

If certain pages must remain accessible without authentication:

```xml
<location path="Public/StatusPage.aspx">
  <system.web>
    <authorization>
      <allow users="*" />
    </authorization>
  </system.web>
</location>
```

### Additional Considerations

- **Kerberos vs. NTLM:** Windows Authentication will negotiate Kerberos first (preferred, supports delegation) and fall back to NTLM. Ensure SPNs are registered for the service account if you need Kerberos delegation to back-end services like SQL Server.
- **Extended Protection for Authentication** should be enabled to prevent relay attacks: set in IIS under Windows Authentication advanced settings.
- **Audit logging:** Record `User.Identity.Name` on all sensitive operations for compliance.
- **If the app is internet-facing**, Windows Authentication is generally not appropriate. Consider ADFS with WS-Federation or migrating to a claims-based model instead.

---

## Task 4: Windows Service with OutOfMemoryException Processing MSMQ Messages

### Problem

A .NET Framework 4.8 Windows Service processes MSMQ messages and crashes every few days with `OutOfMemoryException`. This is a classic memory leak pattern in long-running services.

### Diagnosis Strategy

**Step 1: Identify the leak source with memory dumps.**

Capture a dump when memory is high but before the crash:

```
procdump -ma -m 1500 MyService.exe C:\Dumps\
```

This triggers a full dump when private memory exceeds 1,500 MB. Analyze with WinDbg or Visual Studio:

```
# In WinDbg with SOS loaded
!dumpheap -stat
!dumpheap -type System.String -min 1000
!gcroot <address>
```

Look for object types with unexpectedly high counts or total sizes.

**Step 2: Add memory diagnostics to the service.**

```csharp
private static readonly PerformanceCounter PrivateBytesCounter =
    new PerformanceCounter("Process", "Private Bytes", Process.GetCurrentProcess().ProcessName);

private void LogMemoryStatus()
{
    var process = Process.GetCurrentProcess();
    Logger.Info($"Memory - WorkingSet: {process.WorkingSet64 / 1024 / 1024} MB, " +
                $"PrivateBytes: {PrivateBytesCounter.NextValue() / 1024 / 1024:F0} MB, " +
                $"GC Total: {GC.GetTotalMemory(false) / 1024 / 1024} MB, " +
                $"Gen0: {GC.CollectionCount(0)}, Gen1: {GC.CollectionCount(1)}, Gen2: {GC.CollectionCount(2)}");
}
```

Call this method every N messages and on a timer to track memory growth over time.

### Common Causes and Fixes

**Cause 1: Not disposing MSMQ `Message` objects.**

`System.Messaging.Message` implements `IDisposable`. Each message holds an unmanaged `IStream` reference. Failing to dispose leaks native memory, which does not show up in managed heap stats.

Bad:
```csharp
while (true)
{
    Message msg = queue.Receive(TimeSpan.FromSeconds(30));
    string body = msg.Body.ToString();
    ProcessMessage(body);
    // msg never disposed -- native memory leaks
}
```

Fixed:
```csharp
while (_running)
{
    try
    {
        using (Message msg = queue.Receive(TimeSpan.FromSeconds(30)))
        {
            string body = msg.Body.ToString();
            ProcessMessage(body);
        }
    }
    catch (MessageQueueException ex) when (ex.MessageQueueErrorCode == MessageQueueErrorCode.IOTimeout)
    {
        // No message available within timeout, continue polling
    }
}
```

**Cause 2: Accumulating data in collections that are never cleared.**

```csharp
// Bad -- list grows forever
private readonly List<ProcessedResult> _results = new List<ProcessedResult>();

void ProcessMessage(string body)
{
    var result = DoWork(body);
    _results.Add(result); // Never cleared
}
```

Fix: Flush or discard accumulated data periodically. If you need to batch, process and clear the batch:

```csharp
private readonly List<ProcessedResult> _batch = new List<ProcessedResult>();
private const int BatchSize = 100;

void ProcessMessage(string body)
{
    var result = DoWork(body);
    _batch.Add(result);

    if (_batch.Count >= BatchSize)
    {
        PersistBatch(_batch);
        _batch.Clear();
    }
}
```

**Cause 3: Event handler subscriptions that are never removed.**

```csharp
// Each message creates a handler that pins the processor in memory
queue.ReceiveCompleted += OnReceiveCompleted;
// If this runs repeatedly without unsubscribing, handlers accumulate
```

Fix: Subscribe once during initialization, not in a loop.

**Cause 4: Large Object Heap fragmentation.**

If the service allocates many large byte arrays (over 85,000 bytes) for message bodies, LOH fragmentation can cause OOM even when free memory exists.

Fix: Use `ArrayPool<byte>` to reuse large buffers:

```csharp
var pool = ArrayPool<byte>.Shared;
byte[] buffer = pool.Rent(requiredSize);
try
{
    // Use buffer
}
finally
{
    pool.Return(buffer);
}
```

### Add Resilience to the Service

**Implement a memory pressure watchdog:**

```csharp
private void CheckMemoryPressure()
{
    var process = Process.GetCurrentProcess();
    long memoryMb = process.PrivateMemorySize64 / (1024 * 1024);

    if (memoryMb > 1500) // Threshold in MB
    {
        Logger.Warn($"Memory pressure detected: {memoryMb} MB. Triggering GC and pausing processing.");
        GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce;
        GC.Collect(2, GCCollectionMode.Forced, true, true);

        if (process.PrivateMemorySize64 / (1024 * 1024) > 1800)
        {
            Logger.Error("Memory still critical after GC. Requesting service restart.");
            Environment.FailFast("Controlled restart due to memory pressure.");
            // Configure Windows Service Recovery to restart automatically
        }
    }
}
```

**Configure Windows Service Recovery in the service installer or via `sc.exe`:**

```
sc failure MyService reset=86400 actions=restart/60000/restart/60000/restart/120000
```

This restarts the service after 60 seconds on the first two failures and after 120 seconds on the third.

### Prevention Checklist

- Wrap all `Message` objects in `using` statements.
- Wrap all `MessageQueue` objects in `using` or dispose on service stop.
- Audit every class-level collection for unbounded growth.
- Use `ArrayPool<byte>` for large allocations.
- Add performance counters or structured logging to track memory over time.
- Set up alerting on the `Process\Private Bytes` performance counter for the service.
- Run the service under a memory-profiler (dotMemory, ANTS) in a staging environment to catch leaks before production.

---

## Task 5: Exposing Existing .NET Framework 4.8 Class Libraries as a REST API

### Problem

Business logic lives in .NET Framework 4.8 class libraries. We want to expose it as a REST API without rewriting the logic.

### Option 1: ASP.NET Web API 2 (Recommended for Most Cases)

This is the most straightforward path. ASP.NET Web API 2 runs on .NET Framework 4.8, references your existing class libraries directly, and produces a clean REST API.

**Setup:**

1. Create a new ASP.NET Web API project (or add Web API to an existing project via NuGet).
2. Add project references to your existing class libraries.
3. Create thin controller classes that delegate to the existing business logic.

```
Install-Package Microsoft.AspNet.WebApi
Install-Package Microsoft.AspNet.WebApi.WebHost
```

**Controller example:**

```csharp
public class OrdersController : ApiController
{
    private readonly IOrderService _orderService;

    public OrdersController()
    {
        // Use your existing service classes directly
        _orderService = new OrderService(new OrderRepository());
    }

    [HttpGet]
    [Route("api/orders/{id}")]
    public IHttpActionResult GetOrder(int id)
    {
        var order = _orderService.GetById(id);
        if (order == null)
            return NotFound();

        return Ok(order);
    }

    [HttpPost]
    [Route("api/orders")]
    public IHttpActionResult CreateOrder([FromBody] CreateOrderRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = _orderService.CreateOrder(request);
        return CreatedAtRoute("DefaultApi", new { id = result.Id }, result);
    }
}
```

**Register routes in `Global.asax` or `WebApiConfig.cs`:**

```csharp
public static class WebApiConfig
{
    public static void Register(HttpConfiguration config)
    {
        config.MapHttpAttributeRoutes();

        config.Routes.MapHttpRoute(
            name: "DefaultApi",
            routeTemplate: "api/{controller}/{id}",
            defaults: new { id = RouteParameter.Optional }
        );

        config.Formatters.JsonFormatter.SerializerSettings.ContractResolver =
            new CamelCasePropertyNamesContractResolver();

        config.Formatters.Remove(config.Formatters.XmlFormatter);
    }
}
```

**Pros:** Native .NET Framework support, direct project references, no serialization boundary, full debugging, mature ecosystem.

**Cons:** Tied to .NET Framework 4.8 and IIS on Windows.

### Option 2: OWIN Self-Host (No IIS Required)

If you want to run the API outside of IIS (for example, inside an existing Windows Service), use OWIN self-hosting:

```
Install-Package Microsoft.AspNet.WebApi.OwinSelfHost
```

```csharp
public class Startup
{
    public void Configuration(IAppBuilder app)
    {
        var config = new HttpConfiguration();
        WebApiConfig.Register(config);
        app.UseWebApi(config);
    }
}

// In your Windows Service or console app
public class ApiHostService : ServiceBase
{
    private IDisposable _webApp;

    protected override void OnStart(string[] args)
    {
        string baseAddress = "http://+:9000/";
        _webApp = WebApp.Start<Startup>(baseAddress);
    }

    protected override void OnStop()
    {
        _webApp?.Dispose();
    }
}
```

**Pros:** Can run alongside existing Windows Services, no IIS dependency, lightweight.

**Cons:** You manage hosting, TLS termination, and process lifetime yourself.

### Option 3: Add Web API to an Existing Web Forms Project

If the Web Forms application already exists and references the class libraries, you can add Web API directly to the same project:

1. Install the `Microsoft.AspNet.WebApi.WebHost` NuGet package.
2. Add `WebApiConfig.Register(GlobalConfiguration.Configuration)` in `Application_Start` in `Global.asax.cs`.
3. Add controller classes under an `Api/` folder.

Web Forms pages and API endpoints coexist under the same IIS application. This avoids deploying a separate service.

**Pros:** No new deployment artifact, shared session/cache if needed, simplest infrastructure change.

**Cons:** Couples the API lifecycle to the Web Forms app.

### Option 4: Facade via WCF REST (If WCF Is Already in Place)

If you already have WCF infrastructure, you can expose REST endpoints using `WebHttpBinding`:

```csharp
[ServiceContract]
public interface IOrderRestService
{
    [OperationContract]
    [WebGet(UriTemplate = "/orders/{id}", ResponseFormat = WebMessageFormat.Json)]
    Order GetOrder(string id);
}
```

```xml
<endpoint address=""
          binding="webHttpBinding"
          contract="IOrderRestService"
          behaviorConfiguration="webBehavior" />
```

**Pros:** Reuses existing WCF hosting and operational tooling.

**Cons:** WCF REST is awkward, limited content negotiation, poor tooling compared to Web API. Not recommended for new work.

### Recommendation

**Use Option 1 (ASP.NET Web API 2)** as the default choice. It gives you a clean REST API with minimal code, direct access to your existing class libraries, and a clear path toward eventual migration to ASP.NET Core if that becomes a goal. The controllers are thin wrappers -- typically 5-15 lines per action -- so the effort is proportional to the number of endpoints, not the complexity of the business logic.

If you already have a Web Forms application referencing those libraries, Option 3 (adding Web API to the existing project) is the fastest path to production with the least infrastructure change.
