## Task 1

### Problem: GridView Loading 50,000 Records -- 12-Second Render Time

The root cause is loading the entire dataset into memory and rendering all 50,000 rows as HTML in a single response. This creates pressure at every layer: database query, network transfer, ASP.NET memory allocation, ViewState serialization, and browser DOM rendering.

### Solution: Server-Side Paging with Optimized Data Access

**Step 1: Implement server-side paging at the database level.**

Replace the unbounded query with a paged query using `OFFSET`/`FETCH` (SQL Server 2012+) or `ROW_NUMBER()` for older versions:

```sql
-- SQL Server 2012+
SELECT Id, Name, Status, CreatedDate
FROM Orders
ORDER BY CreatedDate DESC
OFFSET @PageIndex * @PageSize ROWS
FETCH NEXT @PageSize ROWS ONLY;

-- Also retrieve total count (once, or cache it)
SELECT COUNT(*) FROM Orders;
```

**Step 2: Replace the data-binding approach.**

In the code-behind, change from loading everything to loading one page at a time:

```csharp
// Before (problematic)
protected void Page_Load(object sender, EventArgs e)
{
    if (!IsPostBack)
    {
        GridView1.DataSource = GetAllOrders(); // 50,000 rows
        GridView1.DataBind();
    }
}

// After (fixed)
private const int PageSize = 25;

protected void Page_Load(object sender, EventArgs e)
{
    if (!IsPostBack)
    {
        BindGrid(0);
    }
}

private void BindGrid(int pageIndex)
{
    int totalRecords;
    var data = GetOrdersPaged(pageIndex, PageSize, out totalRecords);

    GridView1.VirtualItemCount = totalRecords; // required for custom paging
    GridView1.PageIndex = pageIndex;
    GridView1.DataSource = data;
    GridView1.DataBind();
}
```

**Step 3: Enable custom paging on the GridView.**

```xml
<asp:GridView ID="GridView1" runat="server"
    AllowPaging="True"
    AllowCustomPaging="True"
    PageSize="25"
    OnPageIndexChanging="GridView1_PageIndexChanging"
    EnableViewState="false">
</asp:GridView>
```

Handle the paging event:

```csharp
protected void GridView1_PageIndexChanging(GridViewPageEventArgs e)
{
    BindGrid(e.NewPageIndex);
}
```

**Step 4: Disable or minimize ViewState.**

Setting `EnableViewState="false"` on the GridView prevents serializing all visible row data into the hidden `__VIEWSTATE` field. This alone can cut response size by 50% or more for data-heavy grids.

**Step 5: Additional optimizations to consider.**

- **Output caching** for pages or data that do not change frequently: use `ObjectCache` or `MemoryCache` to cache the paged results for a short TTL (30-60 seconds).
- **Use `SqlDataReader` instead of `DataSet`/`DataTable`** for the paged query to avoid the overhead of in-memory schema metadata.
- **Add database indexes** on the `ORDER BY` columns used in paging queries.
- **Consider an `ObjectDataSource`** with `EnablePaging="True"` if you want declarative paging without manual event handling.

### Expected Result

Page load drops from 12 seconds to under 500ms. Each request fetches only 25 rows instead of 50,000. ViewState shrinks from potentially megabytes to kilobytes.

---

## Task 2

### Problem: WCF Maximum Message Size Quota Exceeded

WCF enforces several size quotas by default, all set conservatively. The error "The maximum message size quota for incoming messages has been exceeded" means the incoming request body exceeds the `maxReceivedMessageSize` default of 65,536 bytes (64 KB).

### Solution: Increase Quotas on Both Client and Service Bindings

**Step 1: Update the service-side binding in Web.config (or App.config).**

All four quota settings must be addressed together, because hitting any one of them produces a different but equally confusing error:

```xml
<system.serviceModel>
  <bindings>
    <basicHttpBinding>
      <binding name="LargeMessageBinding"
               maxReceivedMessageSize="67108864"
               maxBufferSize="67108864"
               maxBufferPoolSize="67108864">
        <readerQuotas
          maxDepth="64"
          maxStringContentLength="67108864"
          maxArrayLength="67108864"
          maxBytesPerRead="65536"
          maxNameTableCharCount="67108864" />
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

The value `67108864` is 64 MB. Set this to whatever ceiling makes sense for your payloads -- do not set it to `int.MaxValue` in production.

**Step 2: Apply the same configuration on the client side.**

The client binding must match or exceed the service binding. In the client's config:

```xml
<system.serviceModel>
  <bindings>
    <basicHttpBinding>
      <binding name="LargeMessageBinding"
               maxReceivedMessageSize="67108864"
               maxBufferSize="67108864">
        <readerQuotas
          maxStringContentLength="67108864"
          maxArrayLength="67108864" />
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

**Step 3: If using streaming for very large payloads.**

For payloads over 10-20 MB, switch to streamed transfer mode to avoid loading the entire message into memory:

```xml
<binding name="StreamedBinding"
         transferMode="Streamed"
         maxReceivedMessageSize="268435456"
         maxBufferSize="65536">
</binding>
```

The service contract must use `Stream` as the message body:

```csharp
[ServiceContract]
public interface IFileUploadService
{
    [OperationContract]
    void UploadFile(Stream fileStream);
}
```

With streamed mode, `maxBufferSize` stays small (it only buffers headers), while `maxReceivedMessageSize` governs the total stream length.

**Step 4: Security considerations.**

- Never set quotas to `int.MaxValue` in production. This removes protection against denial-of-service via oversized messages.
- Set quotas to the smallest value that accommodates your largest legitimate payload, plus a reasonable margin (e.g., 2x expected maximum).
- Consider implementing `IDispatchMessageInspector` to log and reject abnormally large requests before they consume resources.
- If using `basicHttpBinding` over the internet, enforce HTTPS via transport security.

**Step 5: If configuring programmatically (no config file access).**

```csharp
var binding = new BasicHttpBinding();
binding.MaxReceivedMessageSize = 67108864;
binding.MaxBufferSize = 67108864;
binding.ReaderQuotas.MaxStringContentLength = 67108864;
binding.ReaderQuotas.MaxArrayLength = 67108864;

var host = new ServiceHost(typeof(MyService));
host.AddServiceEndpoint(typeof(IMyService), binding, "http://localhost:8080/MyService");
host.Open();
```

---

## Task 3

### Problem: Adding Authentication to an Existing Web Forms App with Active Directory Users

### Solution: Windows Authentication with IIS Integration

Since users are already in Active Directory, Windows Authentication is the most natural and lowest-friction approach. It provides single sign-on for domain-joined machines without requiring users to enter credentials again.

**Step 1: Configure IIS.**

In IIS Manager for the application:
- Disable **Anonymous Authentication**.
- Enable **Windows Authentication**.

This can also be set in `Web.config`, but IIS-level settings take precedence:

```xml
<system.webServer>
  <security>
    <authentication>
      <anonymousAuthentication enabled="false" />
      <windowsAuthentication enabled="true" />
    </authentication>
  </security>
</system.webServer>
```

**Step 2: Configure ASP.NET to use Windows Authentication.**

```xml
<system.web>
  <authentication mode="Windows" />
  <authorization>
    <!-- Deny anonymous users globally -->
    <deny users="?" />
  </authorization>
</system.web>
```

**Step 3: Allow anonymous access to specific pages (if needed).**

For pages like a public landing page or health check endpoint, use `<location>` blocks:

```xml
<location path="Public">
  <system.web>
    <authorization>
      <allow users="*" />
    </authorization>
  </system.web>
</location>
```

**Step 4: Implement role-based authorization using AD groups.**

Once Windows Authentication is active, `HttpContext.Current.User` is a `WindowsPrincipal` populated with the user's AD group memberships.

Restrict access to specific pages or folders by AD group:

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
        return;
    }

    lblWelcome.Text = $"Welcome, {User.Identity.Name}";
}
```

**Step 5: Access the user's identity in code.**

```csharp
// Get the current user's domain\username
string username = HttpContext.Current.User.Identity.Name;

// Get the WindowsIdentity for more detail
var windowsIdentity = HttpContext.Current.User.Identity as System.Security.Principal.WindowsIdentity;

// Query AD for additional attributes (email, display name, etc.)
using (var context = new PrincipalContext(ContextType.Domain))
{
    var user = UserPrincipal.FindByIdentity(context, username);
    if (user != null)
    {
        string email = user.EmailAddress;
        string displayName = user.DisplayName;
    }
}
```

The `System.DirectoryServices.AccountManagement` namespace (add reference to `System.DirectoryServices.AccountManagement.dll`) provides the `PrincipalContext` and `UserPrincipal` classes used above.

**Step 6: Handle the case where users are NOT on domain-joined machines.**

If some users access the application from non-domain machines or over the internet, Windows Authentication will show a browser login prompt (NTLM challenge). This works but is not a great user experience.

For mixed scenarios, consider **Forms Authentication with AD validation** as an alternative:

```xml
<authentication mode="Forms">
  <forms loginUrl="~/Login.aspx" timeout="480" />
</authentication>
```

Then validate credentials against AD in the login page:

```csharp
protected void btnLogin_Click(object sender, EventArgs e)
{
    using (var context = new PrincipalContext(ContextType.Domain, "yourdomain.com"))
    {
        bool isValid = context.ValidateCredentials(txtUsername.Text, txtPassword.Text);
        if (isValid)
        {
            FormsAuthentication.RedirectFromLoginPage(txtUsername.Text, false);
        }
        else
        {
            lblError.Text = "Invalid credentials.";
        }
    }
}
```

**Recommendation:** Use Windows Authentication if all users are on domain-joined machines accessing the app on the intranet. Use Forms Authentication with AD validation if any users are external or on non-domain devices. Both approaches leverage the existing Active Directory -- no separate user store required.

---

## Task 4

### Problem: Windows Service Crashes with OutOfMemoryException While Processing MSMQ Messages

This is almost always a memory leak. The service accumulates objects over days until it exhausts its address space (2 GB for 32-bit, or available system memory for 64-bit). Common causes in MSMQ-processing services are specific and well-understood.

### Diagnosis

**Step 1: Confirm 32-bit vs 64-bit.**

A 32-bit process hits the 2 GB virtual address limit much faster. Check the project properties -- if **Platform target** is set to `x86` or `Any CPU` with **Prefer 32-bit** checked, switch to `x64` or uncheck Prefer 32-bit. This buys time but does not fix the underlying leak.

**Step 2: Capture a memory dump when memory is high (before the crash).**

Use `procdump` from Sysinternals to capture a dump when private bytes exceed a threshold:

```
procdump -ma -m 1500 MyService.exe C:\dumps\
```

This captures a full dump when the process exceeds 1500 MB. Analyze the dump with WinDbg or Visual Studio:

```
.loadby sos clr
!dumpheap -stat
```

The output shows which object types consume the most memory. Look for unexpectedly large counts of specific types.

**Step 3: Add performance counter monitoring.**

Add logging for key counters at regular intervals inside the service:

```csharp
private PerformanceCounter _privateBytes;
private PerformanceCounter _gen2Collections;
private Timer _diagnosticTimer;

protected override void OnStart(string[] args)
{
    _privateBytes = new PerformanceCounter("Process", "Private Bytes",
        Process.GetCurrentProcess().ProcessName);
    _gen2Collections = new PerformanceCounter(".NET CLR Memory",
        "# Gen 2 Collections", Process.GetCurrentProcess().ProcessName);

    _diagnosticTimer = new Timer(LogDiagnostics, null,
        TimeSpan.Zero, TimeSpan.FromMinutes(5));

    // ... start message processing
}

private void LogDiagnostics(object state)
{
    var mb = _privateBytes.NextValue() / (1024 * 1024);
    var gen2 = _gen2Collections.NextValue();
    _logger.Info($"Memory: {mb:F0} MB | Gen2 collections: {gen2}");
}
```

If memory grows monotonically across log entries, you have a confirmed leak.

### Common Causes and Fixes

**Cause 1: MessageQueue instances not disposed.**

This is the single most common cause. Each `MessageQueue` instance holds unmanaged handles. If created per-message or per-batch without disposal, they leak:

```csharp
// WRONG -- leaks handles and memory
void ProcessNext()
{
    var queue = new MessageQueue(@".\Private$\MyQueue");
    var msg = queue.Receive(TimeSpan.FromSeconds(30));
    ProcessMessage(msg);
    // queue never disposed
}

// CORRECT -- create once, reuse
private MessageQueue _queue;

protected override void OnStart(string[] args)
{
    _queue = new MessageQueue(@".\Private$\MyQueue");
    _queue.Formatter = new XmlMessageFormatter(new[] { typeof(string) });
}

protected override void OnStop()
{
    _queue?.Dispose();
}
```

**Cause 2: Message body not read or message not disposed.**

`System.Messaging.Message` implements `IDisposable`. The body stream holds unmanaged resources:

```csharp
// WRONG
var msg = _queue.Receive(TimeSpan.FromSeconds(30));
var body = (string)msg.Body;
// msg never disposed -- BodyStream leaks

// CORRECT
using (var msg = _queue.Receive(TimeSpan.FromSeconds(30)))
{
    var body = (string)msg.Body;
    ProcessMessage(body);
}
```

**Cause 3: Event handler accumulation.**

If using `MessageQueue.ReceiveCompleted` for async receive, and re-subscribing the event handler each time without unsubscribing, delegates accumulate:

```csharp
// WRONG -- subscribes a new handler on every completion
void OnReceiveCompleted(object sender, ReceiveCompletedEventArgs e)
{
    var msg = _queue.EndReceive(e.AsyncResult);
    ProcessMessage(msg);

    _queue.ReceiveCompleted += OnReceiveCompleted; // LEAK: adds another handler
    _queue.BeginReceive();
}

// CORRECT -- subscribe once in OnStart, just call BeginReceive in the handler
protected override void OnStart(string[] args)
{
    _queue.ReceiveCompleted += OnReceiveCompleted; // subscribe once
    _queue.BeginReceive();
}

void OnReceiveCompleted(object sender, ReceiveCompletedEventArgs e)
{
    using (var msg = _queue.EndReceive(e.AsyncResult))
    {
        ProcessMessage(msg);
    }
    _queue.BeginReceive(); // no re-subscribe
}
```

**Cause 4: Large object heap fragmentation from large message bodies.**

If messages contain large payloads (over 85 KB), they are allocated on the Large Object Heap. The LOH is not compacted by default in .NET Framework 4.8 (though it can be). Over days, this leads to address space fragmentation.

Mitigation:

```csharp
// Enable LOH compaction (call periodically or after processing large batches)
System.Runtime.GCSettings.LargeObjectHeapCompactionMode =
    System.Runtime.GCLargeObjectHeapCompactionMode.CompactOnce;
GC.Collect();
```

**Cause 5: Unmanaged resources from XML deserialization.**

`XmlSerializer` generates dynamic assemblies. If you create new `XmlSerializer` instances with non-default constructors, each one generates a new assembly that is never unloaded:

```csharp
// WRONG -- leaks assemblies
var serializer = new XmlSerializer(typeof(MyType), new XmlRootAttribute("Custom"));

// CORRECT -- cache serializers
private static readonly ConcurrentDictionary<Type, XmlSerializer> _serializers = new();

private XmlSerializer GetSerializer(Type type)
{
    return _serializers.GetOrAdd(type, t => new XmlSerializer(t));
}
```

### Preventive Measures

Add a self-recovery mechanism as a safety net while you fix the root cause:

```csharp
private void LogDiagnostics(object state)
{
    var currentMemoryMB = Process.GetCurrentProcess().PrivateMemorySize64 / (1024 * 1024);
    _logger.Info($"Memory: {currentMemoryMB} MB");

    if (currentMemoryMB > 1500)
    {
        _logger.Warn("Memory threshold exceeded. Requesting graceful restart.");
        // Set the service recovery options in the Service Control Manager
        // to restart the service on failure, then:
        Environment.Exit(1);
    }
}
```

Configure service recovery in SCM (or via `sc.exe`):

```
sc failure MyService reset= 86400 actions= restart/60000/restart/60000/restart/60000
```

This restarts the service after 60 seconds on failure, resetting the failure count after 24 hours.

---

## Task 5

### Problem: Exposing Existing .NET Framework 4.8 Class Libraries as a REST API

### Options, Ranked by Practicality

---

### Option 1: ASP.NET Web API 2 (Recommended)

This is the most natural and well-supported approach for .NET Framework 4.8. ASP.NET Web API 2 is designed specifically for building REST APIs on .NET Framework and integrates seamlessly with existing class libraries.

**Setup:**

1. Create a new ASP.NET Web API project (or add Web API to an existing Web Forms project).
2. Reference your existing class libraries.
3. Create thin controller classes that delegate to your business logic:

```csharp
public class OrdersController : ApiController
{
    private readonly IOrderService _orderService;

    public OrdersController()
    {
        // Use your existing service classes directly
        _orderService = new OrderService(); // or resolve via DI container
    }

    [HttpGet]
    [Route("api/orders/{id}")]
    public IHttpActionResult GetOrder(int id)
    {
        var order = _orderService.GetOrderById(id);
        if (order == null)
            return NotFound();

        return Ok(order);
    }

    [HttpPost]
    [Route("api/orders")]
    public IHttpActionResult CreateOrder(OrderRequest request)
    {
        var result = _orderService.CreateOrder(request);
        return Created($"api/orders/{result.Id}", result);
    }
}
```

4. Configure in `Global.asax.cs` or a startup class:

```csharp
GlobalConfiguration.Configure(config =>
{
    config.MapHttpAttributeRoutes();

    config.Formatters.JsonFormatter.SerializerSettings =
        new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver(),
            NullValueHandling = NullValueHandling.Ignore
        };

    // Remove XML formatter if you only want JSON
    config.Formatters.Remove(config.Formatters.XmlFormatter);
});
```

**Advantages:** Full framework support, attribute routing, content negotiation, model validation, built-in dependency injection support (with Unity, Autofac, or other containers), runs in IIS alongside existing Web Forms pages.

**When to use:** This should be the default choice unless you have a specific reason to use another option.

---

### Option 2: OWIN Self-Host with Web API

If you need the API to run outside of IIS (for example, inside a Windows Service or console application), use OWIN self-hosting:

```csharp
// Install: Microsoft.AspNet.WebApi.OwinSelfHost

public class Startup
{
    public void Configuration(IAppBuilder app)
    {
        var config = new HttpConfiguration();
        config.MapHttpAttributeRoutes();
        app.UseWebApi(config);
    }
}

// Host it anywhere:
class Program
{
    static void Main()
    {
        using (WebApp.Start<Startup>("http://localhost:9000"))
        {
            Console.WriteLine("API running on port 9000");
            Console.ReadLine();
        }
    }
}
```

**When to use:** When you cannot use IIS, or when you want to host the API inside an existing Windows Service alongside other processing.

---

### Option 3: Add a REST Facade to an Existing WCF Service

If you already have WCF services exposing your business logic, you can add REST endpoints to them without creating a separate Web API project:

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
    Order CreateOrder(OrderRequest request);
}
```

Add a `webHttpBinding` endpoint:

```xml
<service name="MyNamespace.OrderService">
  <!-- Existing SOAP endpoint -->
  <endpoint address="soap" binding="basicHttpBinding" contract="MyNamespace.IOrderService" />
  <!-- New REST endpoint -->
  <endpoint address="rest" binding="webHttpBinding"
            behaviorConfiguration="restBehavior"
            contract="MyNamespace.IOrderService" />
</service>

<endpointBehaviors>
  <behavior name="restBehavior">
    <webHttp defaultOutgoingResponseFormat="Json" />
  </behavior>
</endpointBehaviors>
```

**When to use:** When you already have WCF services and want to add REST without introducing another framework. This approach is limited in flexibility compared to Web API (no attribute routing, weaker content negotiation, manual JSON handling).

---

### Option 4: API Gateway / Reverse Proxy in Front of Existing Services

If you want to avoid modifying the existing .NET Framework code entirely, place an API gateway in front:

- **YARP (Yet Another Reverse Proxy)** running on .NET 6/8 as a thin reverse proxy that translates REST calls into calls to your existing services.
- **Azure API Management** or **Kong** as a managed gateway.

The gateway handles REST conventions, authentication, rate limiting, and transforms requests into whatever protocol your backend expects.

**When to use:** When you cannot modify the existing codebase, or as part of a gradual migration strategy where the gateway eventually routes to new microservices.

---

### Recommendation

**Use ASP.NET Web API 2** (Option 1) for most scenarios. It is the standard approach for .NET Framework 4.8, has excellent tooling, and lets you reference your existing class libraries directly. The controllers are thin facades -- your business logic stays in the class libraries unchanged. Add dependency injection (e.g., Autofac with `Autofac.WebApi2`) to manage service lifetimes properly, and use action filters for cross-cutting concerns like logging, error handling, and authentication.
