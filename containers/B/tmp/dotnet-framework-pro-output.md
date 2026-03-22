## Task 1: GridView Loading 50,000 Records -- Performance Fix

### Root Cause

Loading 50,000 records into a GridView on every page load means the entire dataset is fetched from the database, serialized into ViewState, and rendered as HTML on every request. This is the single most common Web Forms performance anti-pattern.

### Solution: Server-Side Paging with Custom Data Source

The fix has three layers: (1) paginate at the database level so only ~25 rows are fetched per request, (2) eliminate ViewState bloat, and (3) add optional caching.

#### Step 1: Database-Level Paging (SQL Server)

```sql
-- Stored procedure with offset-fetch paging (SQL Server 2012+)
CREATE PROCEDURE [dbo].[GetOrdersPaged]
    @PageIndex INT,
    @PageSize INT,
    @SortColumn NVARCHAR(50) = 'OrderDate',
    @SortDirection NVARCHAR(4) = 'DESC',
    @TotalCount INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    -- Get total count for pager
    SELECT @TotalCount = COUNT(*) FROM Orders WITH (NOLOCK);

    -- Return only the requested page
    SELECT OrderId, CustomerName, OrderDate, TotalAmount
    FROM Orders WITH (NOLOCK)
    ORDER BY
        CASE WHEN @SortColumn = 'OrderDate' AND @SortDirection = 'DESC' THEN OrderDate END DESC,
        CASE WHEN @SortColumn = 'OrderDate' AND @SortDirection = 'ASC' THEN OrderDate END ASC,
        CASE WHEN @SortColumn = 'OrderId' AND @SortDirection = 'DESC' THEN OrderId END DESC,
        CASE WHEN @SortColumn = 'OrderId' AND @SortDirection = 'ASC' THEN OrderId END ASC
    OFFSET (@PageIndex * @PageSize) ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
```

For SQL Server 2008 and earlier, use the `ROW_NUMBER()` pattern instead:

```sql
;WITH Paged AS (
    SELECT *, ROW_NUMBER() OVER (ORDER BY OrderDate DESC) AS RowNum,
           COUNT(*) OVER() AS TotalCount
    FROM Orders
)
SELECT * FROM Paged
WHERE RowNum BETWEEN (@PageIndex * @PageSize + 1) AND ((@PageIndex + 1) * @PageSize)
```

#### Step 2: Data Access Layer

```csharp
public class OrderRepository
{
    private readonly string _connectionString;

    public OrderRepository(string connectionString)
    {
        _connectionString = connectionString;
    }

    public (DataTable Data, int TotalCount) GetOrdersPaged(
        int pageIndex, int pageSize, string sortColumn, string sortDirection)
    {
        using (var conn = new SqlConnection(_connectionString))
        using (var cmd = new SqlCommand("GetOrdersPaged", conn))
        {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@PageIndex", pageIndex);
            cmd.Parameters.AddWithValue("@PageSize", pageSize);
            cmd.Parameters.AddWithValue("@SortColumn", sortColumn);
            cmd.Parameters.AddWithValue("@SortDirection", sortDirection);

            var totalCountParam = cmd.Parameters.Add("@TotalCount", SqlDbType.Int);
            totalCountParam.Direction = ParameterDirection.Output;

            var dt = new DataTable();
            conn.Open();
            using (var reader = cmd.ExecuteReader())
            {
                dt.Load(reader);
            }

            int totalCount = (int)totalCountParam.Value;
            return (dt, totalCount);
        }
    }
}
```

#### Step 3: Web Forms Page (ASPX)

```aspx
<asp:GridView ID="gvOrders" runat="server"
    AllowPaging="false"
    AllowSorting="true"
    EnableViewState="false"
    AutoGenerateColumns="false"
    OnSorting="gvOrders_Sorting">
    <Columns>
        <asp:BoundField DataField="OrderId" HeaderText="Order ID" SortExpression="OrderId" />
        <asp:BoundField DataField="CustomerName" HeaderText="Customer" />
        <asp:BoundField DataField="OrderDate" HeaderText="Date" SortExpression="OrderDate"
            DataFormatString="{0:yyyy-MM-dd}" />
        <asp:BoundField DataField="TotalAmount" HeaderText="Amount"
            DataFormatString="{0:C}" />
    </Columns>
</asp:GridView>

<!-- Custom pager since we handle paging manually -->
<div class="pager">
    <asp:LinkButton ID="lnkFirst" runat="server" Text="First" OnClick="Page_Changed" CommandArgument="first" />
    <asp:LinkButton ID="lnkPrev" runat="server" Text="Prev" OnClick="Page_Changed" CommandArgument="prev" />
    <asp:Label ID="lblPageInfo" runat="server" />
    <asp:LinkButton ID="lnkNext" runat="server" Text="Next" OnClick="Page_Changed" CommandArgument="next" />
    <asp:LinkButton ID="lnkLast" runat="server" Text="Last" OnClick="Page_Changed" CommandArgument="last" />
</div>
```

#### Step 4: Code-Behind

```csharp
public partial class OrderList : System.Web.UI.Page
{
    private const int PageSize = 25;
    private readonly OrderRepository _repo = new OrderRepository(
        ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString);

    private int CurrentPageIndex
    {
        get { return ViewState["PageIndex"] as int? ?? 0; }
        set { ViewState["PageIndex"] = value; }
    }

    private string SortColumn
    {
        get { return ViewState["SortColumn"] as string ?? "OrderDate"; }
        set { ViewState["SortColumn"] = value; }
    }

    private string SortDirection
    {
        get { return ViewState["SortDirection"] as string ?? "DESC"; }
        set { ViewState["SortDirection"] = value; }
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            BindGrid();
        }
    }

    private void BindGrid()
    {
        var (data, totalCount) = _repo.GetOrdersPaged(
            CurrentPageIndex, PageSize, SortColumn, SortDirection);

        gvOrders.DataSource = data;
        gvOrders.DataBind();

        int totalPages = (int)Math.Ceiling((double)totalCount / PageSize);
        lblPageInfo.Text = $"Page {CurrentPageIndex + 1} of {totalPages} ({totalCount:N0} records)";

        lnkFirst.Enabled = CurrentPageIndex > 0;
        lnkPrev.Enabled = CurrentPageIndex > 0;
        lnkNext.Enabled = CurrentPageIndex < totalPages - 1;
        lnkLast.Enabled = CurrentPageIndex < totalPages - 1;

        ViewState["TotalPages"] = totalPages;
    }

    protected void Page_Changed(object sender, EventArgs e)
    {
        var btn = (LinkButton)sender;
        int totalPages = (int)(ViewState["TotalPages"] ?? 1);

        switch (btn.CommandArgument)
        {
            case "first": CurrentPageIndex = 0; break;
            case "prev": CurrentPageIndex = Math.Max(0, CurrentPageIndex - 1); break;
            case "next": CurrentPageIndex = Math.Min(totalPages - 1, CurrentPageIndex + 1); break;
            case "last": CurrentPageIndex = totalPages - 1; break;
        }

        BindGrid();
    }

    protected void gvOrders_Sorting(object sender, GridViewSortEventArgs e)
    {
        if (SortColumn == e.SortExpression)
            SortDirection = SortDirection == "ASC" ? "DESC" : "ASC";
        else
        {
            SortColumn = e.SortExpression;
            SortDirection = "ASC";
        }

        CurrentPageIndex = 0;
        BindGrid();
    }
}
```

#### Optional: Add Output Caching for Read-Heavy Pages

```csharp
private (DataTable Data, int TotalCount) GetCachedPage(
    int pageIndex, string sortCol, string sortDir)
{
    string cacheKey = $"Orders_{pageIndex}_{sortCol}_{sortDir}";
    var cache = MemoryCache.Default;

    if (cache[cacheKey] is ValueTuple<DataTable, int> cached)
        return cached;

    var result = _repo.GetOrdersPaged(pageIndex, PageSize, sortCol, sortDir);
    cache.Set(cacheKey, result, new CacheItemPolicy
    {
        AbsoluteExpiration = DateTimeOffset.Now.AddMinutes(2)
    });

    return result;
}
```

### Expected Impact

- Page load drops from ~12 seconds to under 500ms
- ViewState size drops from potentially megabytes to a few kilobytes
- Database load drops dramatically (25 rows vs 50,000 per request)
- Memory pressure on the web server is greatly reduced

---

## Task 2: WCF "Maximum Message Size Quota Exceeded" Fix

### Root Cause

WCF bindings have conservative default limits: `maxReceivedMessageSize` defaults to 65,536 bytes (64 KB). Any payload exceeding this triggers the quota exception.

### Solution: Increase Binding Quotas on Both Client and Service

You must configure **both** the service side (server's web.config or app.config) and the client side.

#### Service-Side Configuration (web.config)

```xml
<system.serviceModel>
  <bindings>
    <basicHttpBinding>
      <binding name="LargeMessageBinding"
               maxReceivedMessageSize="67108864"
               maxBufferSize="67108864"
               maxBufferPoolSize="67108864"
               transferMode="Buffered">
        <readerQuotas maxDepth="128"
                      maxStringContentLength="67108864"
                      maxArrayLength="67108864"
                      maxBytesPerRead="65536"
                      maxNameTableCharCount="65536" />
      </binding>
    </basicHttpBinding>
  </bindings>

  <services>
    <service name="MyApp.Services.OrderService"
             behaviorConfiguration="ServiceBehavior">
      <endpoint address=""
                binding="basicHttpBinding"
                bindingConfiguration="LargeMessageBinding"
                contract="MyApp.Services.IOrderService" />
    </service>
  </services>

  <behaviors>
    <serviceBehaviors>
      <behavior name="ServiceBehavior">
        <serviceMetadata httpGetEnabled="true" />
        <serviceDebug includeExceptionDetailInFaults="false" />
        <dataContractSerializer maxItemsInObjectGraph="2147483647" />
      </behavior>
    </serviceBehaviors>
  </behaviors>
</system.serviceModel>
```

#### Client-Side Configuration

```xml
<system.serviceModel>
  <bindings>
    <basicHttpBinding>
      <binding name="LargeMessageBinding"
               maxReceivedMessageSize="67108864"
               maxBufferSize="67108864"
               transferMode="Buffered">
        <readerQuotas maxDepth="128"
                      maxStringContentLength="67108864"
                      maxArrayLength="67108864"
                      maxBytesPerRead="65536"
                      maxNameTableCharCount="65536" />
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

#### For wsHttpBinding (if using message security or sessions)

```xml
<wsHttpBinding>
  <binding name="LargeSecureBinding"
           maxReceivedMessageSize="67108864"
           maxBufferPoolSize="67108864">
    <readerQuotas maxDepth="128"
                  maxStringContentLength="67108864"
                  maxArrayLength="67108864"
                  maxBytesPerRead="65536"
                  maxNameTableCharCount="65536" />
    <security mode="Transport">
      <transport clientCredentialType="Windows" />
    </security>
  </binding>
</wsHttpBinding>
```

#### Streaming for Very Large Payloads (files, large datasets)

If payloads regularly exceed 10-20 MB, switch to streaming instead of increasing buffer sizes indefinitely:

```xml
<basicHttpBinding>
  <binding name="StreamedBinding"
           transferMode="StreamedRequest"
           maxReceivedMessageSize="268435456"
           maxBufferSize="65536">
    <!-- maxBufferSize stays small in streamed mode -->
  </binding>
</basicHttpBinding>
```

The service contract for streaming must use `Stream` parameters:

```csharp
[ServiceContract]
public interface IFileUploadService
{
    [OperationContract]
    UploadResult UploadFile(Stream fileData);
}

[ServiceBehavior(InstanceContextMode = InstanceContextMode.PerCall)]
public class FileUploadService : IFileUploadService
{
    public UploadResult UploadFile(Stream fileData)
    {
        using (var fileStream = File.Create(Path.GetTempFileName()))
        {
            fileData.CopyTo(fileStream);
            return new UploadResult { Success = true, BytesReceived = fileStream.Length };
        }
    }
}
```

#### Programmatic Configuration (for dynamic scenarios)

```csharp
var binding = new BasicHttpBinding
{
    MaxReceivedMessageSize = 67108864,
    MaxBufferSize = 67108864,
    MaxBufferPoolSize = 67108864,
    ReaderQuotas = new System.Xml.XmlDictionaryReaderQuotas
    {
        MaxDepth = 128,
        MaxStringContentLength = 67108864,
        MaxArrayLength = 67108864,
        MaxBytesPerRead = 65536,
        MaxNameTableCharCount = 65536
    }
};

var endpoint = new EndpointAddress("http://server/OrderService.svc");
var client = new OrderServiceClient(binding, endpoint);
```

### Key Points

- Always configure both client AND service -- the error can originate from either side.
- 67108864 bytes = 64 MB. Adjust to your actual maximum expected payload size plus headroom.
- Do not set values to `int.MaxValue` in production -- set them to a reasonable maximum for your use case to prevent denial-of-service.
- If using IIS hosting, also check the `maxRequestLength` in `<httpRuntime>` and `maxAllowedContentLength` in IIS request filtering:

```xml
<system.web>
  <httpRuntime maxRequestLength="65536" /> <!-- KB, so 64MB -->
</system.web>
<system.webServer>
  <security>
    <requestFiltering>
      <requestLimits maxAllowedContentLength="67108864" /> <!-- bytes -->
    </requestFiltering>
  </security>
</system.webServer>
```

---

## Task 3: Adding Windows Authentication to an Existing Web Forms App

### Approach Overview

Since users are already in Active Directory, Windows Authentication is the natural fit. It provides single sign-on (SSO) for intranet users, requires no custom login page, and delegates credential management to Active Directory entirely.

### Step 1: IIS Configuration

Enable Windows Authentication and disable Anonymous Authentication on the IIS site:

**Via IIS Manager:**
1. Select the site
2. Open "Authentication"
3. Enable "Windows Authentication"
4. Disable "Anonymous Authentication"

**Via web.config:**

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

### Step 2: Web.config Authentication Settings

```xml
<system.web>
  <authentication mode="Windows" />

  <!-- Deny unauthenticated users globally -->
  <authorization>
    <deny users="?" />
  </authorization>
</system.web>
```

### Step 3: Role-Based Authorization Using AD Groups

Map AD security groups to application roles for authorization:

```xml
<configuration>
  <system.web>
    <authentication mode="Windows" />
    <authorization>
      <deny users="?" />
    </authorization>

    <roleManager enabled="true"
                 defaultProvider="AspNetWindowsTokenRoleProvider">
      <providers>
        <clear />
        <add name="AspNetWindowsTokenRoleProvider"
             type="System.Web.Security.WindowsTokenRoleProvider"
             applicationName="MyApp" />
      </providers>
    </roleManager>
  </system.web>

  <!-- Restrict admin pages to specific AD group -->
  <location path="Admin">
    <system.web>
      <authorization>
        <allow roles="DOMAIN\AppAdmins" />
        <deny users="*" />
      </authorization>
    </system.web>
  </location>
</configuration>
```

### Step 4: Accessing User Identity in Code

```csharp
public partial class Dashboard : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        // Get the authenticated user's identity
        string username = User.Identity.Name; // e.g., "DOMAIN\jsmith"
        lblWelcome.Text = $"Welcome, {username}";

        // Check AD group membership
        if (User.IsInRole(@"DOMAIN\AppAdmins"))
        {
            pnlAdminTools.Visible = true;
        }

        // Get additional user details from AD
        DisplayUserDetails();
    }

    private void DisplayUserDetails()
    {
        var identity = (WindowsIdentity)User.Identity;

        using (var context = new PrincipalContext(ContextType.Domain))
        using (var principal = UserPrincipal.FindByIdentity(context, identity.Name))
        {
            if (principal != null)
            {
                lblDisplayName.Text = principal.DisplayName;
                lblEmail.Text = principal.EmailAddress;
                lblDepartment.Text = GetExtendedProperty(principal, "department");
            }
        }
    }

    private string GetExtendedProperty(UserPrincipal principal, string propertyName)
    {
        var dirEntry = (DirectoryEntry)principal.GetUnderlyingObject();
        return dirEntry.Properties[propertyName]?.Value?.ToString() ?? string.Empty;
    }
}
```

Requires references to `System.DirectoryServices` and `System.DirectoryServices.AccountManagement`.

### Step 5: Custom Authorization Module (for fine-grained control)

If AD groups alone are not sufficient and you need application-level permissions:

```csharp
public class AppAuthorizationModule : IHttpModule
{
    public void Init(HttpApplication context)
    {
        context.AuthorizeRequest += OnAuthorizeRequest;
    }

    private void OnAuthorizeRequest(object sender, EventArgs e)
    {
        var app = (HttpApplication)sender;
        var user = app.Context.User;

        if (user == null || !user.Identity.IsAuthenticated)
            return;

        // Augment the principal with application-level roles from database
        string username = user.Identity.Name;
        string[] appRoles = GetApplicationRoles(username);

        var combinedRoles = new List<string>(appRoles);

        // Add Windows group roles
        var windowsIdentity = user.Identity as WindowsIdentity;
        if (windowsIdentity != null)
        {
            foreach (var group in windowsIdentity.Groups)
            {
                try
                {
                    combinedRoles.Add(group.Translate(typeof(NTAccount)).Value);
                }
                catch (IdentityNotMappedException) { }
            }
        }

        var newPrincipal = new GenericPrincipal(user.Identity, combinedRoles.ToArray());
        app.Context.User = newPrincipal;
        Thread.CurrentPrincipal = newPrincipal;
    }

    private string[] GetApplicationRoles(string username)
    {
        using (var conn = new SqlConnection(
            ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString))
        {
            conn.Open();
            using (var cmd = new SqlCommand(
                "SELECT RoleName FROM UserRoles WHERE Username = @Username", conn))
            {
                cmd.Parameters.AddWithValue("@Username", username);
                var roles = new List<string>();
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                        roles.Add(reader.GetString(0));
                }
                return roles.ToArray();
            }
        }
    }

    public void Dispose() { }
}
```

Register in web.config:

```xml
<system.webServer>
  <modules>
    <add name="AppAuthorization"
         type="MyApp.Security.AppAuthorizationModule, MyApp" />
  </modules>
</system.webServer>
```

### Step 6: Audit Logging

```csharp
// Global.asax
protected void Application_AuthenticateRequest(object sender, EventArgs e)
{
    if (Request.IsAuthenticated)
    {
        var logger = LogManager.GetCurrentClassLogger();
        logger.Info("Authenticated access: User={User}, Path={Path}, IP={IP}",
            User.Identity.Name,
            Request.Path,
            Request.UserHostAddress);
    }
}
```

### Deployment Checklist

1. Ensure Kerberos delegation is configured if the app accesses backend resources (SQL Server, file shares) on behalf of the user.
2. Set SPNs (Service Principal Names) on the application pool identity if using Kerberos.
3. Test with both IE/Edge (which send credentials automatically) and Chrome/Firefox (which may require intranet zone configuration).
4. For users outside the domain or accessing over VPN, consider fallback to NTLM.

---

## Task 4: Diagnosing and Fixing OutOfMemoryException in a Windows Service Processing MSMQ

### Diagnosis Strategy

#### Step 1: Identify the Leak Pattern

Add memory diagnostics to the service to narrow down the source:

```csharp
public class MemoryDiagnostics
{
    private static readonly ILog Log = LogManager.GetLogger(typeof(MemoryDiagnostics));
    private Timer _diagnosticTimer;

    public void Start()
    {
        _diagnosticTimer = new Timer(LogMemoryState, null, TimeSpan.Zero, TimeSpan.FromMinutes(5));
    }

    private void LogMemoryState(object state)
    {
        var process = Process.GetCurrentProcess();

        Log.Info($"MEMORY DIAG | " +
            $"WorkingSet={process.WorkingSet64 / 1024 / 1024}MB | " +
            $"PrivateBytes={process.PrivateMemorySize64 / 1024 / 1024}MB | " +
            $"GC.Gen0={GC.CollectionCount(0)} | " +
            $"GC.Gen1={GC.CollectionCount(1)} | " +
            $"GC.Gen2={GC.CollectionCount(2)} | " +
            $"GC.TotalMemory={GC.GetTotalMemory(false) / 1024 / 1024}MB | " +
            $"ThreadCount={process.Threads.Count} | " +
            $"HandleCount={process.HandleCount}");
    }

    public void Stop()
    {
        _diagnosticTimer?.Dispose();
    }
}
```

If WorkingSet grows continuously and never drops, you have a managed or unmanaged leak. If HandleCount grows, you have handle leaks (common with undisposed objects).

#### Step 2: Capture a Dump for Analysis

Set up automatic dump capture when memory crosses a threshold using procdump from Sysinternals:

```
procdump -m 1500 -ma MyService.exe C:\Dumps\
```

This captures a full dump when the process exceeds 1500 MB. Analyze with WinDbg or Visual Studio:

```
# In WinDbg with SOS loaded
!dumpheap -stat    # Shows object counts by type
!gcroot <address>  # Trace what keeps a specific object alive
```

### Common MSMQ Memory Leak Patterns and Fixes

#### Problem 1: Not Disposing MessageQueue or Message Objects

This is the most common cause. `MessageQueue` and `Message` objects hold unmanaged resources.

**Bad -- leaks Message and body stream:**
```csharp
while (true)
{
    var queue = new MessageQueue(@".\Private$\orders");
    var msg = queue.Receive(TimeSpan.FromSeconds(30));
    var order = (Order)msg.Body;
    ProcessOrder(order);
}
```

**Fixed:**
```csharp
public class OrderProcessorService : ServiceBase
{
    private MessageQueue _queue;
    private CancellationTokenSource _cts;
    private Task _processingTask;

    protected override void OnStart(string[] args)
    {
        _cts = new CancellationTokenSource();

        _queue = new MessageQueue(@".\Private$\orders")
        {
            Formatter = new XmlMessageFormatter(new[] { typeof(Order) })
        };

        _processingTask = Task.Run(() => ProcessMessages(_cts.Token));
    }

    private void ProcessMessages(CancellationToken token)
    {
        while (!token.IsCancellationRequested)
        {
            Message msg = null;
            try
            {
                msg = _queue.Receive(TimeSpan.FromSeconds(10));
                var order = (Order)msg.Body;
                ProcessOrder(order);
            }
            catch (MessageQueueException mqEx) when (mqEx.MessageQueueErrorCode ==
                MessageQueueErrorCode.IOTimeout)
            {
                // Normal timeout, no messages available
                continue;
            }
            catch (Exception ex)
            {
                Log.Error("Error processing message", ex);
            }
            finally
            {
                // CRITICAL: Always dispose the message and its body stream
                if (msg != null)
                {
                    msg.BodyStream?.Dispose();
                    msg.Dispose();
                }
            }
        }
    }

    protected override void OnStop()
    {
        _cts?.Cancel();
        _processingTask?.Wait(TimeSpan.FromSeconds(30));
        _queue?.Dispose();
        _cts?.Dispose();
    }
}
```

#### Problem 2: Event-Based Receiving Without Cleanup

Using `ReceiveCompleted` events can accumulate if handlers throw exceptions that prevent re-entering the receive loop properly.

**Fixed event-based approach:**
```csharp
public class EventDrivenProcessor : ServiceBase
{
    private MessageQueue _queue;

    protected override void OnStart(string[] args)
    {
        _queue = new MessageQueue(@".\Private$\orders")
        {
            Formatter = new XmlMessageFormatter(new[] { typeof(Order) })
        };

        _queue.ReceiveCompleted += Queue_ReceiveCompleted;
        _queue.BeginReceive();
    }

    private void Queue_ReceiveCompleted(object sender, ReceiveCompletedEventArgs e)
    {
        Message msg = null;
        try
        {
            msg = _queue.EndReceive(e.AsyncResult);
            var order = (Order)msg.Body;
            ProcessOrder(order);
        }
        catch (Exception ex)
        {
            Log.Error("Error processing message", ex);
        }
        finally
        {
            msg?.BodyStream?.Dispose();
            msg?.Dispose();

            // Always restart the receive loop, even after errors
            try
            {
                if (_queue != null)
                    _queue.BeginReceive();
            }
            catch (ObjectDisposedException)
            {
                // Service is shutting down
            }
        }
    }

    protected override void OnStop()
    {
        var q = _queue;
        _queue = null;
        q?.Close();
        q?.Dispose();
    }
}
```

#### Problem 3: Accumulating Data In-Memory (Caches, Collections, Logging Buffers)

```csharp
// BAD: Static collection that grows forever
private static readonly List<ProcessedOrder> _processedOrders = new List<ProcessedOrder>();

// FIXED: Use a bounded collection or clear periodically
private static readonly ConcurrentQueue<ProcessedOrder> _recentOrders =
    new ConcurrentQueue<ProcessedOrder>();
private const int MaxRecentOrders = 1000;

private void TrackProcessed(ProcessedOrder order)
{
    _recentOrders.Enqueue(order);
    while (_recentOrders.Count > MaxRecentOrders)
        _recentOrders.TryDequeue(out _);
}
```

#### Problem 4: Large Object Heap Fragmentation

Processing large messages can fragment the LOH over time, leading to OOM even with available memory:

```csharp
// Call periodically (e.g., every hour) or when memory pressure is detected
private void CompactLOHIfNeeded()
{
    var process = Process.GetCurrentProcess();
    long privateMB = process.PrivateMemorySize64 / 1024 / 1024;

    if (privateMB > 1000) // Over 1GB
    {
        Log.Warn($"Memory high ({privateMB}MB), requesting LOH compaction");
        GCSettings.LargeObjectHeapCompactionMode =
            GCLargeObjectHeapCompactionMode.CompactOnce;
        GC.Collect();
    }
}
```

### Self-Recovery: Auto-Restart Configuration

As a safety net while you investigate, configure Windows to restart the service on failure:

```
sc failure MyService reset= 86400 actions= restart/60000/restart/60000/restart/300000
```

This restarts the service after 60 seconds on the first two failures and after 5 minutes on subsequent failures, resetting the counter daily.

### Prevention Going Forward

Add a memory watchdog that triggers graceful shutdown before OOM kills the process:

```csharp
public class MemoryWatchdog
{
    private readonly long _thresholdBytes;
    private readonly Action _onThresholdExceeded;
    private Timer _timer;

    public MemoryWatchdog(long thresholdMB, Action onThresholdExceeded)
    {
        _thresholdBytes = thresholdMB * 1024 * 1024;
        _onThresholdExceeded = onThresholdExceeded;
    }

    public void Start()
    {
        _timer = new Timer(_ =>
        {
            if (Process.GetCurrentProcess().PrivateMemorySize64 > _thresholdBytes)
            {
                Log.Fatal($"Memory threshold exceeded. Requesting graceful shutdown.");
                _onThresholdExceeded();
            }
        }, null, TimeSpan.FromMinutes(1), TimeSpan.FromMinutes(1));
    }
}

// In service OnStart:
var watchdog = new MemoryWatchdog(1500, () => this.Stop());
watchdog.Start();
```

---

## Task 5: Exposing .NET Framework 4.8 Class Libraries as a REST API

### Recommended Approach: ASP.NET Web API 2 (OWIN Self-Host or IIS-Hosted)

ASP.NET Web API 2 runs on .NET Framework 4.8, integrates directly with your existing class libraries with zero rewrite, and is the purpose-built REST framework for this scenario.

### Option A: IIS-Hosted Web API (Recommended for Most Cases)

#### Step 1: Create a New Web API Project

Create a new ASP.NET Web API project and reference your existing class libraries directly.

**NuGet packages needed:**
```
Microsoft.AspNet.WebApi
Microsoft.AspNet.WebApi.WebHost
Newtonsoft.Json
```

#### Step 2: Wire Up Your Existing Business Logic

Suppose your existing class library has:

```csharp
// Existing library: MyApp.Business.dll
namespace MyApp.Business
{
    public class OrderService
    {
        private readonly IOrderRepository _repo;

        public OrderService(IOrderRepository repo)
        {
            _repo = repo;
        }

        public Order GetOrder(int orderId) { ... }
        public IEnumerable<Order> SearchOrders(OrderSearchCriteria criteria) { ... }
        public OrderResult CreateOrder(OrderRequest request) { ... }
        public void CancelOrder(int orderId, string reason) { ... }
    }
}
```

Create a thin API controller that delegates to it:

```csharp
[RoutePrefix("api/orders")]
public class OrdersController : ApiController
{
    private readonly OrderService _orderService;

    public OrdersController(OrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet]
    [Route("{id:int}")]
    public IHttpActionResult GetOrder(int id)
    {
        try
        {
            var order = _orderService.GetOrder(id);
            if (order == null)
                return NotFound();

            return Ok(order);
        }
        catch (BusinessException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet]
    [Route("search")]
    public IHttpActionResult SearchOrders([FromUri] OrderSearchCriteria criteria)
    {
        var results = _orderService.SearchOrders(criteria);
        return Ok(results);
    }

    [HttpPost]
    [Route("")]
    public IHttpActionResult CreateOrder([FromBody] OrderRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = _orderService.CreateOrder(request);
        return CreatedAtRoute("DefaultApi",
            new { id = result.OrderId }, result);
    }

    [HttpPost]
    [Route("{id:int}/cancel")]
    public IHttpActionResult CancelOrder(int id, [FromBody] CancelRequest request)
    {
        try
        {
            _orderService.CancelOrder(id, request.Reason);
            return Ok();
        }
        catch (NotFoundException)
        {
            return NotFound();
        }
    }
}
```

#### Step 3: Configure Web API with DI

Use Unity, Autofac, or any DI container you already use. Example with Unity:

```
Install-Package Unity.WebAPI
```

```csharp
// App_Start/WebApiConfig.cs
public static class WebApiConfig
{
    public static void Register(HttpConfiguration config)
    {
        // DI container
        var container = new UnityContainer();
        container.RegisterType<IOrderRepository, SqlOrderRepository>(
            new HierarchicalLifetimeManager());
        container.RegisterType<OrderService>();
        config.DependencyResolver = new UnityDependencyResolver(container);

        // Attribute routing
        config.MapHttpAttributeRoutes();

        // Convention-based routing as fallback
        config.Routes.MapHttpRoute(
            name: "DefaultApi",
            routeTemplate: "api/{controller}/{id}",
            defaults: new { id = RouteParameter.Optional }
        );

        // JSON formatting
        config.Formatters.Remove(config.Formatters.XmlFormatter);
        config.Formatters.JsonFormatter.SerializerSettings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver(),
            DateTimeZoneHandling = DateTimeZoneHandling.Utc,
            NullValueHandling = NullValueHandling.Ignore
        };
    }
}

// Global.asax.cs
protected void Application_Start()
{
    GlobalConfiguration.Configure(WebApiConfig.Register);
}
```

#### Step 4: Add Cross-Cutting Concerns

**Exception handling:**

```csharp
public class GlobalExceptionHandler : ExceptionHandler
{
    public override void Handle(ExceptionHandlerContext context)
    {
        var exception = context.Exception;
        var request = context.Request;

        Log.Error($"Unhandled exception on {request.Method} {request.RequestUri}", exception);

        var response = new HttpResponseMessage(HttpStatusCode.InternalServerError)
        {
            Content = new StringContent(JsonConvert.SerializeObject(new
            {
                error = "An internal error occurred.",
                correlationId = Trace.CorrelationManager.ActivityId.ToString()
            })),
            ReasonPhrase = "Internal Server Error"
        };
        response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

        context.Result = new ResponseMessageResult(response);
    }
}

// In WebApiConfig.Register:
config.Services.Replace(typeof(IExceptionHandler), new GlobalExceptionHandler());
```

**API key authentication (simple approach):**

```csharp
public class ApiKeyAuthHandler : DelegatingHandler
{
    private readonly string _validApiKey;

    public ApiKeyAuthHandler()
    {
        _validApiKey = ConfigurationManager.AppSettings["ApiKey"];
    }

    protected override Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request, CancellationToken cancellationToken)
    {
        if (!request.Headers.TryGetValues("X-Api-Key", out var values)
            || values.First() != _validApiKey)
        {
            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.Unauthorized)
            {
                Content = new StringContent("{\"error\":\"Invalid or missing API key\"}")
            });
        }

        return base.SendAsync(request, cancellationToken);
    }
}

// Register in WebApiConfig:
config.MessageHandlers.Add(new ApiKeyAuthHandler());
```

### Option B: OWIN Self-Hosted (No IIS Dependency)

If you want to host the API inside an existing Windows Service or console app:

```
Install-Package Microsoft.AspNet.WebApi.OwinSelfHost
Install-Package Microsoft.Owin.Hosting
```

```csharp
public class Startup
{
    public void Configuration(IAppBuilder appBuilder)
    {
        var config = new HttpConfiguration();
        WebApiConfig.Register(config); // Same config as above
        appBuilder.UseWebApi(config);
    }
}

// In your Windows Service OnStart:
private IDisposable _webApp;

protected override void OnStart(string[] args)
{
    string baseAddress = ConfigurationManager.AppSettings["ApiBaseAddress"]
        ?? "http://+:9000/";

    _webApp = WebApp.Start<Startup>(baseAddress);
    Log.Info($"Web API started on {baseAddress}");
}

protected override void OnStop()
{
    _webApp?.Dispose();
}
```

This is particularly useful when you want to add an API to an existing Windows Service without deploying a separate IIS application.

### Option C: Facade Pattern for Complex Libraries

If your business logic was not designed for web use (long-running operations, thread-unsafe code, etc.), add a facade layer:

```csharp
public class OrderApiFacade
{
    private readonly OrderService _orderService;
    private readonly IMapper _mapper; // AutoMapper

    public OrderApiFacade(OrderService orderService, IMapper mapper)
    {
        _orderService = orderService;
        _mapper = mapper;
    }

    public OrderDto GetOrder(int id)
    {
        var order = _orderService.GetOrder(id);
        return _mapper.Map<OrderDto>(order); // Map internal model to API DTO
    }

    public PagedResult<OrderSummaryDto> SearchOrders(OrderSearchRequest request)
    {
        var criteria = _mapper.Map<OrderSearchCriteria>(request);
        var results = _orderService.SearchOrders(criteria);

        return new PagedResult<OrderSummaryDto>
        {
            Items = _mapper.Map<List<OrderSummaryDto>>(results),
            TotalCount = results.TotalCount,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }
}
```

### Decision Matrix

| Factor | Web API (IIS) | Web API (OWIN Self-Host) | WCF REST |
|--------|--------------|--------------------------|----------|
| Setup complexity | Low | Low | Medium |
| IIS dependency | Yes | No | Optional |
| Hosting in Windows Service | No | Yes | Yes |
| Swagger/OpenAPI support | Yes (Swashbuckle) | Yes (Swashbuckle) | Manual |
| Content negotiation | Built-in | Built-in | Limited |
| Future .NET Core migration | Easy | Easy | Hard |
| Enterprise auth (Windows) | Built-in | Manual | Built-in |

**Recommendation:** Use ASP.NET Web API 2 hosted in IIS (Option A) unless you have a specific reason to self-host. Add Swashbuckle for automatic Swagger documentation:

```
Install-Package Swashbuckle
```

This generates interactive API documentation at `/swagger` with zero additional code, which greatly helps consumers of your new API.
