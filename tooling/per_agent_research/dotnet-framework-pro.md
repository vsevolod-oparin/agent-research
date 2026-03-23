# dotnet-framework-pro: Per-Agent Research Report

**Eval scores:** v4 = 4.73, v3 = 4.73 (tied), v1 = 4.62, bare = 4.65. Agent instructions add only +0.08 over bare.

---

## 1. Competitive Landscape

- **Microsoft Agent Framework (Preview):** New .NET agent framework built on Semantic Kernel + AutoGen + Microsoft.Extensions.AI. Targets modern .NET, not Framework 4.8. Irrelevant to our agent's task but shows where Microsoft's investment is going.
- **Legacy modernization tools are booming:**
  - **vFunction:** Architecture-level analysis for .NET monolith-to-microservices. Analyzes runtime behavior.
  - **GAPVelocity AI:** Hybrid deterministic + generative AI for VB6/PowerBuilder/WinForms to .NET/Blazor migration. AST-based for logic preservation.
  - **IBM Watsonx Code Assistant:** Enterprise COBOL/Java/RPG modernization. Less .NET Framework specific.
  - **Kodesage:** Code understanding platform for legacy systems. Chat-based Q&A over repositories.
  - **OpenLegacy:** Non-intrusive API wrapping of mainframe/legacy systems.
  - **LEGMOD (Sanciti AI):** Full lifecycle legacy modernization with agent orchestration.
- **Key gap:** None of these tools focus specifically on MAINTAINING .NET Framework 4.8 apps. They all want to migrate AWAY from it. Our agent fills a unique niche: being excellent at working WITHIN Framework 4.8 constraints.
- **AI assistants (Claude, ChatGPT, Copilot)** have strong .NET knowledge but tend to suggest .NET 6+/8+ patterns by default. The anti-pattern of suggesting Core/modern .NET is well-known in the community.

## 2. Known Failure Modes / Chokepoints

- **LLM default bias toward modern .NET:** The #1 failure mode. Models naturally suggest .NET 8, EF Core, minimal APIs, etc. The agent MUST aggressively constrain to Framework 4.8.
- **Assembly binding hell:** `Could not load file or assembly` with binding redirects is the most common and most painful issue. Requires understanding NuGet version resolution, `packages.config` vs `PackageReference`, and multi-project solutions.
- **Web.config complexity:** Multiple transform layers (Debug/Release/per-environment), inheritance from machine.config, and the sheer size of config files. Easy to miss conflicting settings.
- **WCF configuration:** Notoriously complex binding configurations, quota limits, security settings. Many possible combinations.
- **ViewState issues in Web Forms:** Large ViewState, MAC validation across load balancers, postback lifecycle confusion. Deep ASP.NET knowledge required.
- **NuGet + packages.config:** Legacy NuGet format with hint paths in `.csproj`. Moving packages, changing versions, or restoring on different machines frequently breaks builds.
- **IIS/hosting-specific issues:** Application pool recycling, authentication modes, handler mappings -- can't be diagnosed from code alone.
- **Thread pool starvation:** Sync-over-async patterns in ASP.NET, `Task.Result` / `.Wait()` calls. Subtle and devastating.

## 3. What Would Make This Agent Best-in-Class

- **Stronger "stay in Framework 4.8" guardrails:** Current v4 has one anti-pattern line about not suggesting Core. This should be more prominent and include specific package substitutions (e.g., "use Newtonsoft.Json not System.Text.Json", "use EF6 not EF Core", "use Web API 2 not minimal APIs").
- **Binding redirect troubleshooting protocol:** Step-by-step process: check `packages.config` versions, compare to `<bindingRedirect>` in config, verify all projects reference compatible versions, use `fuslogvw` (Fusion Log Viewer) for diagnosis.
- **Config file audit checklist:** security settings, connection string protection, custom errors, debug mode, compilation settings, HTTP handlers/modules.
- **NuGet restoration workflow:** `packages.config` restore vs `PackageReference` restore, hint path issues, multi-targeting.
- **Web Forms lifecycle knowledge:** Page lifecycle events, control tree timing, ViewState loading -- critical for debugging postback issues.
- **Legacy pattern recognition:** DataSet/DataTable patterns, Enterprise Library usage, Unity container (old IoC), WCF service hosts -- patterns specific to Framework-era codebases.

## 4. Main Bottleneck

**The low delta over bare (+0.08) is the critical signal.** This means the current agent instructions add almost no value over what the base model already knows.

Likely causes:
- **Model already knows .NET Framework 4.8 well.** It's extensively represented in training data. The agent instructions are largely redundant with built-in knowledge.
- **The instructions are too generic.** The current v4 reads like a competent overview but doesn't add non-obvious expertise. The fix patterns table maps to common Stack Overflow answers the model already knows.
- **Missing: deep, non-obvious expertise.** The agent needs to encode knowledge that ISN'T in the top 10 Google results -- subtle interactions, gotchas specific to 4.8 (not 4.7 or earlier), version-specific quirks.
- **Missing: procedural workflows.** The diagnostic workflow (step 1-6) is good conceptually but each step needs more depth on WHAT to look for and HOW to fix it.

**The bottleneck is prompt differentiation from base model knowledge.** The agent needs to provide expertise the model doesn't already have, or structure the model's reasoning in ways it wouldn't do unprompted.

## 5. What Winning Setups Look Like

- **Hard constraint enforcement:** Start every response by confirming the target framework version. Refuse to suggest incompatible packages/patterns.
- **Diagnostic-first approach:** Read `.csproj` and config files BEFORE suggesting fixes. Understand the project type, NuGet format, target framework, and deployment model.
- **Package compatibility awareness:** Maintain awareness of which NuGet package versions are the LAST to support Framework 4.8 (e.g., specific Newtonsoft.Json versions, specific Autofac versions).
- **Config-code-dependency triangle:** Most Framework 4.8 issues involve the interaction between config files, code, and NuGet packages. Agent should always check all three.
- **Gradual modernization patterns:** Know how to introduce modern patterns (async/await, DI) incrementally within Framework 4.8 constraints, without breaking existing patterns.
- **Enterprise context awareness:** Framework 4.8 apps are in enterprises with change management, multi-environment deployments, and load balancers. Agent should consider operational context.

## Summary: Key Improvement Opportunities

1. **Differentiate from base model knowledge.** Add non-obvious gotchas, version-specific quirks, and subtle interactions the model won't know by default.
2. **Add specific package version compatibility info** (last versions supporting Framework 4.8 for popular packages).
3. **Expand binding redirect troubleshooting** into a detailed procedural workflow.
4. **Add sync-over-async detection patterns** -- `Task.Result`, `.Wait()`, `GetAwaiter().GetResult()` in ASP.NET request pipeline.
5. **Add IIS configuration awareness** -- common app pool settings, authentication modes, handler mappings that affect behavior.
6. **Add Enterprise Library / Unity / older IoC container patterns** that are common in Framework-era codebases.
7. **Consider whether this agent category has a ceiling** -- the +0.08 delta suggests Framework 4.8 may be a domain where the base model is already near-optimal, and instruction improvement has diminishing returns.
