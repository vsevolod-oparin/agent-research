# .NET Framework Pro - Task Results

## Task 1: Fix GridView Loading 50K Records (12-Second Render)

### Problem

A .NET Framework 4.8 Web Forms application uses a `GridView` control bound to a dataset of approximately 50,000 records. The page takes 12 seconds to render, creating an unacceptable user experience. The root cause is that all 50K records are fetched from the database, serialized into ViewState, and rendered as HTML on every request.

### Solution: Server-Side Paging with OFFSET/FETCH

The fix is a multi-pronged approach that eliminates the practice of loading all records at once.

**1. Implement SQL Server Paging with OFFSET/FETCH**

Replace the existing query with a paged query that only retrieves the rows needed for the current page:

```sql
SELECT Id, Name, Status, CreatedDate
FROM Orders
ORDER BY CreatedDate DESC
OFFSET @Offset ROWS
FETCH NEXT @PageSize ROWS ONLY;

-- Separate count query (cache this result)
SELECT COUNT(*) FROM Orders WHERE [filter conditions];
```

The `OFFSET/FETCH` syntax (SQL Server 2012+) is the modern approach. For older SQL Server versions, use a `ROW_NUMBER()` CTE pattern instead.

**2. Use ObjectDataSource with Custom Paging**

Configure an `ObjectDataSource` that supports custom (server-side) paging rather than the default UI-level paging:

```xml
<asp:ObjectDataSource ID="odsOrders" runat="server"
    TypeName="MyApp.Data.OrderRepository"
    SelectMethod="GetOrdersPaged"
    SelectCountMethod="GetOrdersCount"
    EnablePaging="True"
    StartRowIndexParameterName="startRowIndex"
    MaximumRowsParameterName="pageSize" />
```

The backing repository methods:

```csharp
public class OrderRepository
{
    public List<Order> GetOrdersPaged(int startRowIndex, int pageSize)
    {
        using (var conn = new SqlConnection(ConfigurationManager.ConnectionStrings["DB"].ConnectionString))
        {
            var cmd = new SqlCommand(@"
                SELECT Id, Name, Status, CreatedDate
                FROM Orders
                ORDER BY CreatedDate DESC
                OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY", conn);
            cmd.Parameters.AddWithValue("@Offset", startRowIndex);
            cmd.Parameters.AddWithValue("@PageSize", pageSize);
            conn.Open();
            // Map results to List<Order>
        }
    }

    public int GetOrdersCount()
    {
        // Return cached count or query COUNT(*)
    }
}
```

**3. Disable ViewState on the GridView**

ViewState serialization of 50K rows is a massive contributor to page size and render time:

```xml
<asp:GridView ID="gvOrders" runat="server"
    DataSourceID="odsOrders"
    AllowPaging="True"
    PageSize="25"
    EnableViewState="False"
    AllowSorting="True">
</asp:GridView>
```

With server-side paging and data rebound on every postback, ViewState is unnecessary for the grid.

**4. Add Database Indexes**

Ensure proper indexes exist for the ORDER BY and WHERE columns used in paging queries:

```sql
CREATE NONCLUSTERED INDEX IX_Orders_CreatedDate
ON Orders (CreatedDate DESC)
INCLUDE (Id, Name, Status);
```

A covering index eliminates key lookups and dramatically speeds up the paged query.

### Expected Results

- Page render drops from 12 seconds to under 500ms
- HTML payload shrinks from several MB to tens of KB
- ViewState overhead eliminated
- Database load reduced by orders of magnitude per request


## Task 2: Fix WCF "Maximum Message Size Quota Exceeded"

### Problem

A WCF service call fails with:

```
System.ServiceModel.CommunicationException:
The maximum message size quota for incoming messages (65536) has been exceeded.
```

This occurs when the service returns a payload larger than the default 64 KB limit, or when the client sends a large request.

### Solution: Increase maxReceivedMessageSize in Binding Configuration

The fix must be applied on **both the service side and the client side**, since each endpoint independently enforces its own quota.

**1. Client-Side Configuration (app.config or web.config)**

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
                      maxBytesPerRead="65536"
                      maxNameTableCharCount="65536" />
      </binding>
    </basicHttpBinding>
  </bindings>
  <client>
    <endpoint address="http://server/MyService.svc"
              binding="basicHttpBinding"
              bindingConfiguration="LargeMessageBinding"
              contract="IMyService" />
  </client>
</system.serviceModel>
```

**2. Service-Side Configuration (web.config)**

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
                      maxBytesPerRead="65536"
                      maxNameTableCharCount="65536" />
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

**3. Also Check readerQuotas**

The `readerQuotas` element controls the complexity of XML payloads. Even if `maxReceivedMessageSize` is large enough, the call will fail if `maxStringContentLength` or `maxArrayLength` is too small for the data being deserialized. Set these proportionally to the expected payload.

**4. IIS httpRuntime maxRequestLength**

If the service is hosted in IIS and receives large uploads, the IIS layer rejects requests before WCF sees them:

```xml
<system.web>
  <httpRuntime maxRequestLength="10240" executionTimeout="120" />
</system.web>
<system.webServer>
  <security>
    <requestFiltering>
      <requestLimits maxAllowedContentLength="10485760" />
    </requestFiltering>
  </security>
</system.webServer>
```

Note: `maxRequestLength` is in KB, while `maxAllowedContentLength` is in bytes.

### Key Points

- The error message tells you the current limit (65536 bytes = 64 KB), which is the WCF default
- `maxReceivedMessageSize` controls the incoming message envelope size
- `readerQuotas` controls XML reader limits within the message
- IIS request filtering is an independent layer that must also be configured
- For `wsHttpBinding` or `netTcpBinding`, apply the same attributes to the appropriate binding section
- Set values to a reasonable maximum, not `int.MaxValue`, to protect against abuse


## Task 3: Add Windows Authentication to Existing Web Forms App

### Problem

An existing .NET Framework 4.8 Web Forms application currently allows anonymous access. It needs to be updated to require Windows Authentication (Active Directory) so that users are automatically identified by their domain credentials and access can be controlled by AD group membership.

### Solution

**1. Configure IIS**

In IIS Manager for the application:

- **Enable** Windows Authentication
- **Disable** Anonymous Authentication

Via PowerShell:

```powershell
Set-WebConfigurationProperty -Filter "/system.webServer/security/authentication/windowsAuthentication" `
    -Name "enabled" -Value "True" -PSPath "IIS:\Sites\MySite\MyApp"
Set-WebConfigurationProperty -Filter "/system.webServer/security/authentication/anonymousAuthentication" `
    -Name "enabled" -Value "False" -PSPath "IIS:\Sites\MySite\MyApp"
```

**2. Configure web.config Authentication and Authorization**

```xml
<system.web>
  <authentication mode="Windows" />
  <authorization>
    <deny users="?" />  <!-- Deny anonymous users -->
  </authorization>
</system.web>
```

The `<deny users="?" />` rule ensures that unauthenticated requests receive a 401 challenge, which browsers handle transparently for domain-joined machines.

**3. Use User.Identity.Name and User.IsInRole**

In code-behind, access the authenticated user's identity:

```csharp
protected void Page_Load(object sender, EventArgs e)
{
    string username = User.Identity.Name;  // e.g., "DOMAIN\jsmith"
    lblWelcome.Text = $"Welcome, {username}";

    if (User.IsInRole(@"DOMAIN\IT-Admins"))
    {
        pnlAdminTools.Visible = true;
    }
}
```

Enable role-based checks against AD groups by ensuring the `<roleManager>` uses the `AspNetWindowsTokenRoleProvider`:

```xml
<system.web>
  <roleManager enabled="true"
               defaultProvider="AspNetWindowsTokenRoleProvider" />
</system.web>
```

**4. Add Location Elements for Granular Access Control**

Use `<location>` elements in web.config to restrict specific pages or folders to certain AD groups while leaving others broadly accessible:

```xml
<!-- Public area (all authenticated users) -->
<location path="Default.aspx">
  <system.web>
    <authorization>
      <allow users="*" />
    </authorization>
  </system.web>
</location>

<!-- Admin area restricted to IT-Admins group -->
<location path="Admin">
  <system.web>
    <authorization>
      <allow roles="DOMAIN\IT-Admins" />
      <deny users="*" />
    </authorization>
  </system.web>
</location>

<!-- Reports restricted to Managers and Analysts -->
<location path="Reports">
  <system.web>
    <authorization>
      <allow roles="DOMAIN\Managers,DOMAIN\Analysts" />
      <deny users="*" />
    </authorization>
  </system.web>
</location>
```

Rules are evaluated top-to-bottom; the first match wins. Always place `<allow>` before `<deny>` within a section.

### Additional Considerations

- For intranet sites, add the site URL to the Local Intranet zone in IE/Edge Group Policy so that credentials pass automatically without a prompt
- If using Kerberos (preferred over NTLM), ensure SPNs are registered correctly for the application pool identity
- For IIS Express during development, enable Windows Auth in `.vs/config/applicationhost.config`


## Task 4: Diagnose Windows Service OOM Processing MSMQ

### Problem

A .NET Framework Windows Service that reads messages from MSMQ and processes them experiences an out-of-memory (OOM) crash after running for several hours or days. The memory footprint grows steadily until the process is terminated by the OS.

### Solution: Systematic Diagnosis and Common Fixes

**1. Add Memory Telemetry**

Before fixing, instrument the service to track memory usage over time:

```csharp
private static readonly PerformanceCounter _workingSet =
    new PerformanceCounter("Process", "Working Set", Process.GetCurrentProcess().ProcessName);
private static readonly PerformanceCounter _gen2Collections =
    new PerformanceCounter(".NET CLR Memory", "# Gen 2 Collections", Process.GetCurrentProcess().ProcessName);

private void LogMemoryMetrics()
{
    var proc = Process.GetCurrentProcess();
    _logger.Info($"WorkingSet={proc.WorkingSet64 / 1024 / 1024}MB, " +
                 $"GC.TotalMemory={GC.GetTotalMemory(false) / 1024 / 1024}MB, " +
                 $"Gen0={GC.CollectionCount(0)}, Gen1={GC.CollectionCount(1)}, Gen2={GC.CollectionCount(2)}");
}
```

Log these metrics on a timer (every 30-60 seconds) and after each batch of messages.

**2. Profile with dotMemory or WinDbg**

- **JetBrains dotMemory**: Attach to the running service, take snapshots at intervals, and compare object retention. Look for growing collections, event handler chains, and undisposed objects.
- **WinDbg + SOS**: For production environments where you cannot install profiling tools, capture a dump and analyze:

```
.loadby sos clr
!dumpheap -stat          // Show object counts by type
!dumpheap -type MessageQueue  // Find lingering MessageQueue objects
!gcroot <address>        // Trace what holds a specific object in memory
!finalizequeue           // Check for objects stuck in finalizer queue
```

**3. Common Causes and Fixes**

**Not Disposing MessageQueue and Message Objects**

This is the most common cause. `MessageQueue` and `Message` both implement `IDisposable` and hold unmanaged resources:

```csharp
// BAD - leaks memory
var queue = new MessageQueue(@".\Private$\MyQueue");
var msg = queue.Receive(TimeSpan.FromSeconds(5));
var body = msg.Body;
// Neither queue nor msg is disposed

// GOOD - proper disposal
using (var queue = new MessageQueue(@".\Private$\MyQueue"))
{
    using (var msg = queue.Receive(TimeSpan.FromSeconds(5)))
    {
        var body = msg.Body;
        ProcessMessage(body);
    }
}
```

**Event Handler Accumulation**

Subscribing to `MessageQueue.ReceiveCompleted` in a loop without unsubscribing creates a chain of delegates that pins objects in memory:

```csharp
// BAD - subscribes on every iteration
while (_running)
{
    _queue.ReceiveCompleted += OnReceiveCompleted; // Leak!
    _queue.BeginReceive();
}

// GOOD - subscribe once
_queue.ReceiveCompleted += OnReceiveCompleted;
while (_running)
{
    _queue.BeginReceive();
    _waitHandle.WaitOne();
}
```

**Large Object Heap (LOH) Fragmentation**

Processing large messages (>85 KB) allocates on the LOH, which is not compacted by default. Over time, fragmentation leads to OOM even with available total memory:

```csharp
// Enable LOH compaction (available in .NET 4.5.1+)
GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce;
GC.Collect();
```

Also consider using `ArrayPool<byte>.Shared` or `RecyclableMemoryStream` for large buffer reuse.

**Unbounded Collections**

In-memory caches, dictionaries tracking processed message IDs, or retry queues that grow without eviction:

```csharp
// BAD - unbounded dictionary
private Dictionary<Guid, ProcessingResult> _cache = new();

// GOOD - use MemoryCache with expiration
private static readonly MemoryCache _cache = new MemoryCache("ProcessingCache");

public void CacheResult(Guid messageId, ProcessingResult result)
{
    var policy = new CacheItemPolicy
    {
        AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(30),
        SlidingExpiration = TimeSpan.Zero
    };
    _cache.Set(messageId.ToString(), result, policy);
}
```

Configure `MemoryCache` with a memory limit in app.config:

```xml
<system.runtime.caching>
  <memoryCache>
    <namedCaches>
      <add name="ProcessingCache"
           cacheMemoryLimitMegabytes="256"
           pollingInterval="00:02:00" />
    </namedCaches>
  </memoryCache>
</system.runtime.caching>
```

### Recommended Action Plan

1. Add memory telemetry immediately to establish baseline and growth rate
2. Take memory snapshots with dotMemory to identify the dominant retained types
3. Audit all `MessageQueue` and `Message` usage for missing `Dispose()` calls
4. Check for event handler subscribe/unsubscribe imbalance
5. Replace unbounded dictionaries with `MemoryCache` using expiration policies
6. Enable LOH compaction if large allocations are detected
7. Set up alerting on Working Set thresholds so you catch growth before OOM


## Task 5: Expose .NET Framework 4.8 Class Libraries as REST API Without Rewriting

### Problem

An organization has significant business logic in .NET Framework 4.8 class libraries (DLLs). They need to expose this functionality as a REST API for consumption by modern clients (SPAs, mobile apps, partner integrations) without rewriting the libraries.

### Solution: Three Approaches

### Option A: ASP.NET Web API 2 (New Project Referencing Existing Libraries)

This is the cleanest and most recommended approach. Create a new ASP.NET Web API 2 project that references the existing class library DLLs:

```
Solution
  +-- MyApp.BusinessLogic (existing class library)
  +-- MyApp.DataAccess (existing class library)
  +-- MyApp.WebApi (new Web API 2 project)
        References: MyApp.BusinessLogic, MyApp.DataAccess
```

Controller example wrapping existing logic:

```csharp
[RoutePrefix("api/orders")]
public class OrdersController : ApiController
{
    private readonly OrderService _orderService; // From existing class library

    public OrdersController()
    {
        _orderService = new OrderService(); // Or use DI with Unity/Autofac
    }

    [HttpGet, Route("")]
    public IHttpActionResult GetOrders([FromUri] int page = 1, [FromUri] int pageSize = 25)
    {
        var orders = _orderService.GetOrders(page, pageSize);
        return Ok(orders);
    }

    [HttpPost, Route("")]
    public IHttpActionResult CreateOrder([FromBody] CreateOrderRequest request)
    {
        var result = _orderService.CreateOrder(request.CustomerId, request.Items);
        if (!result.Success)
            return BadRequest(result.ErrorMessage);
        return CreatedAtRoute("GetOrder", new { id = result.OrderId }, result);
    }
}
```

**Pros**: Full IIS hosting features, familiar deployment model, separation of API concerns from business logic, full middleware pipeline (authentication, CORS, logging, exception handling).

**Cons**: Requires IIS hosting, new project to maintain.

### Option B: OWIN Self-Host (Inside Existing Windows Service)

If the business logic already runs inside a Windows Service and you want to add an HTTP endpoint without IIS:

```
Install-Package Microsoft.AspNet.WebApi.OwinSelfHost
```

```csharp
public class ApiService : ServiceBase
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

public class Startup
{
    public void Configuration(IAppBuilder appBuilder)
    {
        var config = new HttpConfiguration();
        config.MapHttpAttributeRoutes();
        config.Routes.MapHttpRoute("DefaultApi", "api/{controller}/{id}",
            new { id = RouteParameter.Optional });

        // Add JSON formatting, CORS, etc.
        config.Formatters.Remove(config.Formatters.XmlFormatter);
        appBuilder.UseCors(CorsOptions.AllowAll);
        appBuilder.UseWebApi(config);
    }
}
```

**Pros**: No IIS dependency, runs inside the same process as existing service logic, simple deployment (single executable), direct access to in-memory state.

**Cons**: Must handle HTTPS/certificates manually, no IIS features (request filtering, application pools, health monitoring), less suitable for public-facing APIs.

### Option C: Add Web API to Existing Web Forms Project

If there is already an ASP.NET Web Forms application, Web API can be added alongside it in the same project:

```
Install-Package Microsoft.AspNet.WebApi
```

In `Global.asax.cs`:

```csharp
protected void Application_Start(object sender, EventArgs e)
{
    GlobalConfiguration.Configure(WebApiConfig.Register);
}
```

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
    }
}
```

Web Forms pages and Web API controllers coexist in the same application. Routes starting with `api/` go to Web API; everything else routes to Web Forms pages.

**Pros**: No new project needed, shared authentication and session state, single deployment unit, incremental modernization path.

**Cons**: Mixes concerns in one project, harder to independently scale or version the API.

### Choosing the Right Approach

| Criteria | Web API 2 (New Project) | OWIN Self-Host | Add to Web Forms |
|---|---|---|---|
| Clean separation | Best | Good | Mixed |
| No IIS needed | No | Yes | No |
| Existing Windows Service | Not ideal | Best | Not applicable |
| Existing Web Forms app | Good | Overkill | Best |
| Public-facing API | Best | Caution | Acceptable |
| Deployment complexity | Medium | Low | Low |

All three approaches reference the existing class libraries directly, so no business logic rewrite is needed. The API layer is a thin adapter that translates HTTP requests into calls to existing classes and returns the results as JSON.
