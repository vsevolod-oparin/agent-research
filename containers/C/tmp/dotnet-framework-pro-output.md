## Task 1

### Problem: GridView Loading 50,000 Records Causes 12-Second Page Render

The root cause is loading the entire dataset into memory and rendering 50,000 HTML table rows in a single response. This creates pressure at every layer: database query, network transfer, ASP.NET memory allocation, ViewState serialization, and browser DOM rendering.

### Fix: Server-Side Paging with Data Source Optimization

**Step 1 -- Implement server-side paging at the database level.**

Replace the "SELECT all" query with paged queries using `OFFSET`/`FETCH` (SQL Server 2012+) or `ROW_NUMBER()` for older versions:

```sql
-- SQL Server 2012+
SELECT Id, Name, Status, CreatedDate
FROM Orders
ORDER BY CreatedDate DESC
OFFSET @PageIndex * @PageSize ROWS
FETCH NEXT @PageSize ROWS ONLY;
```

**Step 2 -- Enable GridView paging and wire up the PageIndexChanging event.**

```aspx
<asp:GridView ID="gvOrders" runat="server" AllowPaging="true"
    PageSize="25" OnPageIndexChanging="gvOrders_PageIndexChanging"
    EnableViewState="false">
</asp:GridView>
```

```csharp
protected void Page_Load(object sender, EventArgs e)
{
    if (!IsPostBack)
    {
        BindGrid(0);
    }
}

protected void gvOrders_PageIndexChanging(object sender, GridViewPageEventArgs e)
{
    gvOrders.PageIndex = e.NewPageIndex;
    BindGrid(e.NewPageIndex);
}

private void BindGrid(int pageIndex)
{
    int pageSize = gvOrders.PageSize;
    int totalRecords = OrderRepository.GetTotalCount();

    // Custom pager setup
    gvOrders.VirtualItemCount = totalRecords;

    var data = OrderRepository.GetPagedOrders(pageIndex, pageSize);
    gvOrders.DataSource = data;
    gvOrders.DataBind();
}
```

Note: The built-in GridView pager with `AllowCustomPaging="true"` and `VirtualItemCount` lets you do true server-side paging without fetching all rows.

**Step 3 -- Disable or minimize ViewState.**

ViewState for 50,000 rows generates a massive hidden field. Set `EnableViewState="false"` on the GridView if you rebind on every postback. If ViewState is needed for specific controls, disable it at the GridView level and enable selectively.

**Step 4 -- Add output caching for read-heavy pages.**

```aspx
<%@ OutputCache Duration="60" VaryByParam="page;sort" %>
```

**Step 5 -- Add a covering index on the database.**

Ensure the ORDER BY column has an index that covers the SELECT columns to avoid table scans during paged queries.

**Additional improvements:**

- Add search/filter controls so users never need to browse all 50,000 rows.
- If sorting is needed, implement server-side sorting (not GridView's default client-side sort which requires all data).
- Consider `SqlDataReader` over `DataSet`/`DataTable` for the data access layer to reduce memory allocation.
- For very high traffic, add application-level caching with `MemoryCache` for frequently accessed pages.

**Expected result:** Page load drops from 12 seconds to under 500ms. Each request fetches only 25 rows instead of 50,000.

---

## Task 2

### Problem: WCF Maximum Message Size Quota Exceeded

WCF enforces message size limits by default: `maxReceivedMessageSize` is 65,536 bytes (64 KB) and `maxBufferSize` matches it. When clients send payloads exceeding this, the service rejects the message before processing.

### Fix: Increase Quotas in Binding Configuration (Both Client and Service)

**Service-side `web.config` or `app.config`:**

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
  <services>
    <service name="MyNamespace.MyService">
      <endpoint address=""
                binding="basicHttpBinding"
                bindingConfiguration="LargeMessageBinding"
                contract="MyNamespace.IMyService" />
    </service>
  </services>
</system.serviceModel>
```

**Client-side configuration must match:**

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
  <client>
    <endpoint address="http://server/MyService.svc"
              binding="basicHttpBinding"
              bindingConfiguration="LargeMessageBinding"
              contract="MyNamespace.IMyService" />
  </client>
</system.serviceModel>
```

**Key values explained:**

| Setting | Default | Purpose |
|---------|---------|---------|
| `maxReceivedMessageSize` | 65536 | Maximum size of incoming message in bytes |
| `maxBufferSize` | 65536 | Maximum buffer size for buffered transfers |
| `maxBufferPoolSize` | 524288 | Maximum size of the buffer pool |
| `maxStringContentLength` | 8192 | Maximum string length in reader quotas |
| `maxArrayLength` | 16384 | Maximum array length in reader quotas |

**Important considerations:**

1. **Set values to what you actually need, not `int.MaxValue`.** Setting `maxReceivedMessageSize="2147483647"` is a common but dangerous pattern -- it removes the denial-of-service protection entirely. Calculate your maximum expected payload and add a reasonable margin (e.g., 2x).

2. **If using streaming transfer mode** for very large payloads (files over 10 MB), switch from buffered to streamed:

```xml
<binding name="StreamedBinding"
         transferMode="Streamed"
         maxReceivedMessageSize="104857600">
```

With streaming, only `maxReceivedMessageSize` matters (not `maxBufferSize`), and memory consumption stays low regardless of message size.

3. **If using `wsHttpBinding`** instead of `basicHttpBinding`, the same attributes apply but the binding element name differs.

4. **For programmatic configuration** (no config file):

```csharp
var binding = new BasicHttpBinding();
binding.MaxReceivedMessageSize = 10 * 1024 * 1024; // 10 MB
binding.MaxBufferSize = 10 * 1024 * 1024;
binding.ReaderQuotas.MaxStringContentLength = 10 * 1024 * 1024;
binding.ReaderQuotas.MaxArrayLength = 10 * 1024 * 1024;
```

5. **If behind IIS**, also check `maxRequestLength` in `system.web` and `maxAllowedContentLength` in `system.webServer`:

```xml
<system.web>
  <httpRuntime maxRequestLength="10240" /> <!-- KB -->
</system.web>
<system.webServer>
  <security>
    <requestFiltering>
      <requestLimits maxAllowedContentLength="10485760" /> <!-- bytes -->
    </requestFiltering>
  </security>
</system.webServer>
```

---

## Task 3

### Problem: Adding Authentication to an Existing Web Forms App with Active Directory Users

### Approach: Windows Authentication via IIS with ASP.NET Authorization

Since users are already in Active Directory, Windows Authentication is the most natural fit. It provides single sign-on for intranet users without requiring a separate login page or credential store.

**Step 1 -- Enable Windows Authentication in IIS.**

In IIS Manager for the application:
- Disable Anonymous Authentication.
- Enable Windows Authentication.

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

**Step 2 -- Configure ASP.NET to use Windows Authentication.**

```xml
<system.web>
  <authentication mode="Windows" />
  <authorization>
    <deny users="?" /> <!-- Deny anonymous users -->
  </authorization>
</system.web>
```

**Step 3 -- Implement role-based authorization using AD groups.**

Restrict specific pages or folders:

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

In code-behind, check roles programmatically:

```csharp
protected void Page_Load(object sender, EventArgs e)
{
    if (!User.IsInRole(@"DOMAIN\AppAdmins"))
    {
        Response.Redirect("~/AccessDenied.aspx");
    }

    lblUser.Text = User.Identity.Name; // DOMAIN\username
}
```

**Step 4 -- If you need finer-grained roles beyond AD groups, add ASP.NET Role Provider.**

Create a custom `RoleProvider` or use `WindowsTokenRoleProvider` (maps AD groups to roles automatically):

```xml
<system.web>
  <roleManager enabled="true"
               defaultProvider="WindowsProvider">
    <providers>
      <add name="WindowsProvider"
           type="System.Web.Security.WindowsTokenRoleProvider" />
    </providers>
  </roleManager>
</system.web>
```

**Step 5 -- For mixed environments (intranet + external users), consider Forms Authentication with AD validation.**

If some users access the app from outside the domain (no Kerberos/NTLM), use Forms Authentication but validate credentials against AD:

```csharp
using System.DirectoryServices.AccountManagement;

public bool ValidateUser(string username, string password)
{
    using (var context = new PrincipalContext(ContextType.Domain, "yourdomain.com"))
    {
        return context.ValidateCredentials(username, password);
    }
}
```

With a login page:

```xml
<system.web>
  <authentication mode="Forms">
    <forms loginUrl="~/Login.aspx" timeout="30" />
  </authentication>
</system.web>
```

**Step 6 -- Secure the deployment.**

- Enable HTTPS (mandatory -- Windows Authentication sends credentials on every request).
- Set `requireSSL="true"` on forms cookies if using Forms Authentication.
- Configure `<machineKey>` explicitly if running in a web farm.
- Enable audit logging for authentication events.

**Decision guide:**

| Scenario | Recommended approach |
|----------|---------------------|
| All users on domain, intranet only | Windows Authentication (Steps 1-3) |
| Need app-specific roles beyond AD groups | Windows Auth + custom RoleProvider (Step 4) |
| Mix of internal and external users | Forms Auth + AD validation (Step 5) |
| Cloud/hybrid with Azure AD | OWIN + OpenID Connect middleware |

---

## Task 4

### Problem: Windows Service Processing MSMQ Messages Crashes with OutOfMemoryException

This is almost always a memory leak. The service processes messages continuously, and each iteration leaks a small amount of memory until the process exhausts its address space (2 GB for 32-bit, or available system RAM for 64-bit).

### Diagnosis

**Step 1 -- Identify the leak pattern with Performance Counters.**

Add monitoring before attempting code fixes. In the service, log memory metrics periodically:

```csharp
private Timer _diagnosticTimer;

protected override void OnStart(string[] args)
{
    _diagnosticTimer = new Timer(LogDiagnostics, null,
        TimeSpan.Zero, TimeSpan.FromMinutes(5));
    // ... start message processing
}

private void LogDiagnostics(object state)
{
    var process = Process.GetCurrentProcess();
    Logger.Info($"Memory: WorkingSet={process.WorkingSet64 / 1024 / 1024}MB, " +
                $"PrivateBytes={process.PrivateMemorySize64 / 1024 / 1024}MB, " +
                $"GC.TotalMemory={GC.GetTotalMemory(false) / 1024 / 1024}MB, " +
                $"Gen0={GC.CollectionCount(0)}, Gen1={GC.CollectionCount(1)}, " +
                $"Gen2={GC.CollectionCount(2)}, " +
                $"Threads={process.Threads.Count}, " +
                $"Handles={process.HandleCount}");
}
```

If `PrivateBytes` grows but `GC.TotalMemory` stays flat, the leak is in unmanaged resources (handles, native memory). If both grow, the leak is in managed objects.

**Step 2 -- Take a memory dump and analyze with WinDbg or dotMemory.**

```cmd
procdump -ma -m 1500 MyService.exe  # Dump when memory exceeds 1500 MB
```

In WinDbg with SOS:
```
.loadby sos clr
!dumpheap -stat          # Shows object counts by type
!dumpheap -type System.Byte[]  # If byte arrays dominate
!gcroot <address>        # Find what holds a leaked object
```

**Step 3 -- Check the most common MSMQ leak sources.**

### Common Causes and Fixes

**Cause 1: MessageQueue or Message objects not disposed.**

This is the number one cause. `System.Messaging.Message` implements `IDisposable` and holds unmanaged resources. If you call `Receive()` or `Peek()` without disposing the returned `Message`, you leak memory every iteration.

```csharp
// BROKEN -- leaks on every message
while (_running)
{
    Message msg = _queue.Receive(TimeSpan.FromSeconds(30));
    string body = msg.Body.ToString();
    ProcessMessage(body);
    // msg never disposed -- native resources leak
}

// FIXED
while (_running)
{
    try
    {
        using (Message msg = _queue.Receive(TimeSpan.FromSeconds(30)))
        {
            msg.Formatter = new XmlMessageFormatter(new[] { typeof(string) });
            string body = (string)msg.Body;
            ProcessMessage(body);
        }
    }
    catch (MessageQueueException ex) when (ex.MessageQueueErrorCode ==
        MessageQueueErrorCode.IOTimeout)
    {
        // Normal timeout, no message available
        continue;
    }
}
```

**Cause 2: Event handler accumulation.**

If you subscribe to `MessageQueue.ReceiveCompleted` or `PeekCompleted` inside a loop, handlers accumulate:

```csharp
// BROKEN -- adds a new handler on every call
private void StartListening()
{
    _queue.ReceiveCompleted += OnReceiveCompleted; // Accumulates!
    _queue.BeginReceive();
}

private void OnReceiveCompleted(object sender, ReceiveCompletedEventArgs e)
{
    Message msg = _queue.EndReceive(e.AsyncResult);
    ProcessMessage(msg);
    msg.Dispose();
    StartListening(); // Adds ANOTHER handler
}

// FIXED -- subscribe once in initialization
protected override void OnStart(string[] args)
{
    _queue.ReceiveCompleted += OnReceiveCompleted; // Once only
    _queue.BeginReceive();
}

private void OnReceiveCompleted(object sender, ReceiveCompletedEventArgs e)
{
    using (Message msg = _queue.EndReceive(e.AsyncResult))
    {
        ProcessMessage(msg);
    }
    _queue.BeginReceive(); // No re-subscribe
}
```

**Cause 3: Large Object Heap fragmentation.**

If messages contain large payloads (over 85 KB), their deserialized bodies go on the LOH, which does not compact by default. Over days, fragmentation causes OOM even with available physical memory.

```csharp
// Enable LOH compaction periodically (requires .NET 4.5.1+)
GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce;
GC.Collect();
```

**Cause 4: Unbounded in-memory collections.**

If the service queues messages in a `List<T>` or `ConcurrentQueue<T>` for batch processing but consumption is slower than production, the collection grows without bound.

```csharp
// FIXED -- use BlockingCollection with a bounded capacity
private readonly BlockingCollection<WorkItem> _workQueue =
    new BlockingCollection<WorkItem>(boundedCapacity: 1000);
```

**Cause 5: Database connections not disposed.**

If message processing opens `SqlConnection` or `SqlCommand` objects without `using` blocks, connection pool exhaustion and handle leaks follow.

**Step 4 -- Add a safety valve.**

While fixing the root cause, add a self-monitoring watchdog:

```csharp
private void CheckMemoryPressure()
{
    var process = Process.GetCurrentProcess();
    long memoryMB = process.PrivateMemorySize64 / 1024 / 1024;

    if (memoryMB > 1500) // Threshold
    {
        Logger.Warn($"Memory at {memoryMB}MB -- initiating graceful restart");
        // Stop accepting new messages, finish current, restart
        this.Stop();
        Environment.Exit(1); // Service recovery settings will restart it
    }
}
```

Configure Windows Service Recovery in `services.msc`: set "First failure" and "Second failure" to "Restart the Service" with a 1-minute delay.

---

## Task 5

### Problem: Exposing Existing .NET Framework 4.8 Class Libraries as REST API

### Options Ranked by Effort and Risk

**Option 1 (Recommended): ASP.NET Web API 2 hosted in IIS alongside existing code.**

This is the lowest-risk, most natural path. ASP.NET Web API 2 runs on .NET Framework 4.8, references your existing class libraries directly, and deploys to IIS.

Setup:

1. Create a new ASP.NET Web API project targeting .NET Framework 4.8.
2. Add project references to your existing class libraries.
3. Create thin controller classes that delegate to your business logic.

```csharp
// NuGet: Microsoft.AspNet.WebApi
// In App_Start/WebApiConfig.cs
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

        // Remove XML formatter if JSON-only
        config.Formatters.Remove(config.Formatters.XmlFormatter);
    }
}
```

```csharp
// Thin controller wrapping existing business logic
public class OrdersController : ApiController
{
    private readonly IOrderService _orderService;

    public OrdersController()
    {
        // Use your existing DI or instantiate directly
        _orderService = new OrderService();
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

        var result = _orderService.Create(request);
        return CreatedAtRoute("DefaultApi",
            new { controller = "Orders", id = result.Id }, result);
    }
}
```

**Advantages:** No rewrite. Direct project references to existing libraries. Same deployment model (IIS). Full .NET Framework compatibility. Can coexist with Web Forms in the same application if needed.

**Option 2: OWIN Self-Hosted Web API (no IIS dependency).**

If you need the API to run inside a Windows Service or console application:

```csharp
// NuGet: Microsoft.AspNet.WebApi.OwinSelfHost
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
class Program
{
    static void Main()
    {
        string baseAddress = "http://localhost:9000/";
        using (WebApp.Start<Startup>(url: baseAddress))
        {
            Console.WriteLine($"API running at {baseAddress}");
            Console.ReadLine();
        }
    }
}
```

**Advantages:** No IIS required. Runs anywhere. Good for microservice-style deployment. Same controller code as Option 1.

**Option 3: Add Web API to an existing Web Forms project (hybrid).**

If you already have a Web Forms application and want to add API endpoints to it without a separate project:

```csharp
// In Global.asax.cs
protected void Application_Start(object sender, EventArgs e)
{
    GlobalConfiguration.Configure(WebApiConfig.Register);
    // Existing Web Forms routes continue to work
}
```

Add controllers to the same project. Web Forms pages and API endpoints coexist under the same IIS application.

**Option 4: WCF REST endpoints (if you already have WCF).**

If you already have WCF services, you can add REST endpoints using `WebHttpBinding` without creating new projects:

```csharp
[ServiceContract]
public interface IOrderService
{
    [OperationContract]
    [WebGet(UriTemplate = "/orders/{id}", ResponseFormat = WebMessageFormat.Json)]
    Order GetOrder(string id);

    [OperationContract]
    [WebInvoke(Method = "POST", UriTemplate = "/orders",
        RequestFormat = WebMessageFormat.Json,
        ResponseFormat = WebMessageFormat.Json)]
    Order CreateOrder(CreateOrderRequest request);
}
```

**Not recommended for new work** -- WCF REST is cumbersome compared to Web API, but it is an option if you want to minimize the number of hosting technologies.

**Option 5: API Gateway or Facade pattern for gradual migration.**

If you plan to eventually move to .NET 8+, create the Web API 2 layer now (Option 1) as a facade, then later replace the implementation behind the controllers:

```
[Clients] --> [ASP.NET Web API 2 on .NET 4.8] --> [Existing Class Libraries]
                     |
                     v  (future)
            [ASP.NET Core on .NET 8] --> [Migrated Libraries]
```

**Decision matrix:**

| Factor | Web API 2 (IIS) | OWIN Self-Host | Hybrid Web Forms | WCF REST |
|--------|-----------------|----------------|------------------|----------|
| Setup effort | Low | Low | Lowest | Medium |
| IIS required | Yes | No | Yes (existing) | Yes |
| Coexists with Web Forms | Separate app | Separate process | Same app | Separate |
| Modern REST conventions | Yes | Yes | Yes | Awkward |
| Swagger/OpenAPI support | Yes (Swashbuckle) | Yes (Swashbuckle) | Yes | Limited |
| Migration path to .NET 8 | Clean | Clean | Tangled | Difficult |

**Recommendation:** Start with Option 1 (ASP.NET Web API 2 in IIS). Add Swashbuckle for Swagger documentation. Keep controllers thin -- they should only map HTTP concerns to your existing business logic. This gives you a clean REST API today and a straightforward migration path when you are ready to move to .NET 8+.
