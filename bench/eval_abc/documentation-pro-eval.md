# documentation-pro Evaluation (A/B/C)

## Task 1: dp-001

**Ground Truth Summary:** Must mention: request body schema with types/constraints, all response codes with example bodies, authentication requirement, rate limiting (if applicable), curl example. Structure: standard API doc format, not prose.

### Condition A (bare)
- must_mention coverage: 5/5 -- Schema with types/constraints (yes), all response codes with bodies (201, 400, 401, 409, 500), auth requirement (yes), rate limiting (not applicable but not required), curl example (yes)
- must_not violations: None
- Completeness: 5 -- Full schema including nested shipping_address, all error codes, error handling summary table
- Precision: 5 -- Response bodies are realistic and consistent
- Actionability: 5 -- Curl example is copy-pasteable, error table gives clear actions
- Structure: 5 -- Standard API doc: method, auth, request, response, examples, error summary
- Efficiency: 5 -- No filler, every section earns its place
- Depth: 4 -- Good but no rate limiting mention
- **Composite: 4.87**

### Condition B (v1 agents)
- must_mention coverage: 4/5 -- Schema (yes), response codes (201, 400, 401, 409), auth (yes), rate limiting (no), curl (yes)
- must_not violations: None
- Completeness: 4 -- Missing 500 error and rate limiting mention
- Precision: 5 -- All content accurate
- Actionability: 5 -- Clear curl example, response bodies
- Structure: 5 -- Clean standard API doc format
- Efficiency: 5 -- Concise and well-organized
- Depth: 3 -- Less thorough than A, no error handling summary
- **Composite: 4.40**

### Condition C (v2 agents)
- must_mention coverage: 5/5 -- Schema with types (yes), all response codes (201, 400, 401, 409), auth (yes), rate limiting (yes, explicit section), curl (yes)
- must_not violations: None
- Completeness: 5 -- Includes rate limits section, common validation failure causes
- Precision: 5 -- Response bodies realistic
- Actionability: 5 -- Copy-paste curl, actionable error descriptions
- Structure: 5 -- Standard API doc format with rate limits
- Efficiency: 5 -- Well balanced
- Depth: 5 -- Rate limiting reference, validation causes listed
- **Composite: 5.00**

---

## Task 2: dp-002

**Ground Truth Summary:** Must mention: installation command, verify installation (--version), first example under 1 min, expected output shown, next steps. Must not: start with philosophy before first command. Structure: < 200 words to first working example, code blocks.

### Condition A (bare)
- must_mention coverage: 5/5 -- Install (yes), verify (yes), first example with output (yes), next steps (yes), common commands table (yes)
- must_not violations: None. Starts with prerequisites then install immediately.
- Completeness: 5 -- Installation, verification, example with expected output, config, next steps
- Precision: 5 -- All commands plausible
- Actionability: 5 -- Copy-paste commands, expected output shown
- Structure: 5 -- Gets to first example quickly, code blocks throughout
- Efficiency: 5 -- No fluff, excellent pacing
- Depth: 4 -- Config file documented, multiple formats shown
- **Composite: 4.87**

### Condition B (v1 agents)
- must_mention coverage: 5/5 -- Install (yes), verify (yes), first example (yes), expected output (not shown explicitly, just says "writes JSON to stdout"), next steps (yes)
- must_not violations: None
- Completeness: 4 -- Missing explicit expected output for the first example
- Precision: 5 -- Commands plausible
- Actionability: 4 -- Missing expected output reduces confidence
- Structure: 5 -- Clean format, gets to example quickly
- Efficiency: 5 -- Concise
- Depth: 4 -- Config table, common examples, supported formats
- **Composite: 4.47**

### Condition C (v2 agents)
- must_mention coverage: 5/5 -- Install (yes), verify with --version (yes), first example (yes), expected output (not explicitly shown but mentions conversion), next steps (yes)
- must_not violations: None
- Completeness: 4 -- Missing explicit expected output display
- Precision: 5 -- Commands accurate
- Actionability: 4 -- No shown output for the first command
- Structure: 5 -- Quick start, formats table, config
- Efficiency: 5 -- Well-paced
- Depth: 4 -- Config, formats table, common operations
- **Composite: 4.47**

---

## Task 3: dp-003

**Ground Truth Summary:** Must mention: docstring with args/returns/raises, usage example with real scenario, behavior explanation (exponential backoff 2s, 4s, 8s), fn must be callable with no args, edge case max_attempts=0. Structure: docstring format, example in docstring.

### Condition A (bare)
- must_mention coverage: 4/5 -- Docstring with args/returns/raises (yes), usage examples (yes), backoff explanation with table (yes), zero-arg callable note (yes), max_attempts=0 edge case (no)
- must_not violations: None
- Completeness: 4 -- Missing max_attempts=0 edge case
- Precision: 5 -- Backoff calculation correct (2s, 4s)
- Actionability: 5 -- Multiple real-world examples including functools.partial
- Structure: 5 -- Signature -> description -> parameters table -> returns -> raises -> examples -> notes
- Efficiency: 5 -- Clean reference format
- Depth: 4 -- Jitter note, thread blocking note, but missing edge case
- **Composite: 4.60**

### Condition B (v1 agents)
- must_mention coverage: 4/5 -- Docstring format (yes), usage examples (yes), backoff table (yes), zero-arg callable (yes), max_attempts=0 (no)
- must_not violations: None
- Completeness: 4 -- Missing edge case
- Precision: 5 -- Correct backoff math
- Actionability: 5 -- Examples with specific exception types
- Structure: 5 -- Clean reference doc format
- Efficiency: 5 -- Concise and well-organized
- Depth: 4 -- Jitter note, async note
- **Composite: 4.60**

### Condition C (v2 agents)
- must_mention coverage: 4/5 -- Docstring format (yes), usage examples (yes), backoff table (yes), zero-arg callable (yes), max_attempts=0 (no)
- must_not violations: None
- Completeness: 4 -- Missing edge case, but has design notes section
- Precision: 5 -- Correct math
- Actionability: 5 -- Good examples with functools.partial
- Structure: 5 -- Clean format with backoff schedule table
- Efficiency: 5 -- Well balanced
- Depth: 4 -- Jitter note, no logging note
- **Composite: 4.60**

---

## Task 4: dp-004

**Ground Truth Summary:** Must mention: symptom/cause/fix format for each issue, specific commands to check, config values to adjust, when to escalate. Structure: searchable/scannable, each issue self-contained.

### Condition A (bare)
- must_mention coverage: 4/4 -- Symptom/cause/fix (yes), specific commands (yes), config values (yes), escalation guidance (implicit in resolution steps)
- must_not violations: None
- Completeness: 5 -- All 4 issues covered with multiple causes each, specific commands throughout
- Precision: 5 -- Commands are correct (systemctl, ss, timedatectl, nginx config)
- Actionability: 5 -- Specific commands, config values, and code snippets
- Structure: 5 -- Each issue self-contained with symptom -> causes -> fixes pattern
- Efficiency: 5 -- No filler, scannable format
- Depth: 5 -- Multiple causes per issue (e.g., clock skew, token lifetime, multi-server for #2)
- **Composite: 5.00**

### Condition B (v1 agents)
- must_mention coverage: 4/4 -- Symptom/cause/fix (yes), commands (yes), configs (yes), escalation (implicit)
- must_not violations: None
- Completeness: 5 -- All 4 issues, multiple causes each, Docker Compose coverage
- Precision: 5 -- Commands correct
- Actionability: 5 -- Specific commands and configs
- Structure: 5 -- Clean numbered format, each self-contained
- Efficiency: 5 -- Good density
- Depth: 5 -- Token refresh flow explanation, secret rotation, CDN caching, multipart uploads
- **Composite: 5.00**

### Condition C (v2 agents)
- must_mention coverage: 4/4 -- Symptom/cause/fix (yes), commands (yes), configs (yes), escalation (yes, mentions APM tools)
- must_not violations: None
- Completeness: 5 -- All 4 issues, comprehensive cause lists
- Precision: 5 -- Commands correct
- Actionability: 5 -- Very specific, includes load balancer mention for uploads
- Structure: 5 -- Numbered, self-contained issues
- Efficiency: 5 -- Well-balanced
- Depth: 5 -- Chunked uploads, client-side timeouts, frontend bundle analysis, dual-key verification
- **Composite: 5.00**

---

## Task 5: dp-005

**Ground Truth Summary:** Must mention: categorized sections (Added, Fixed, Deprecated, Breaking), issue/PR references, migration guidance for breaking change, deprecation timeline. Structure: Keep a Changelog format, scannable.

### Condition A (bare)
- must_mention coverage: 4/4 -- Categorized sections (yes: Breaking, Added, Fixed, Deprecated), issue reference #1234 (yes), migration guidance (yes, upgrade notes section), deprecation timeline (yes, "removed in future major release")
- must_not violations: None
- Completeness: 5 -- All items plus upgrade notes section with numbered steps
- Precision: 5 -- Follows Keep a Changelog format
- Actionability: 5 -- Clear migration steps
- Structure: 5 -- Standard changelog format, scannable
- Efficiency: 5 -- Concise with upgrade notes
- Depth: 5 -- Explains the memory leak cause, suggests WebSocket migration
- **Composite: 5.00**

### Condition B (v1 agents)
- must_mention coverage: 4/4 -- Categorized (yes), #1234 reference (yes), migration guidance (yes, deprecation removal version), deprecation timeline (yes, "removed in 3.0.0")
- must_not violations: None
- Completeness: 4 -- All sections present but migration guidance is briefer
- Precision: 5 -- Correct format
- Actionability: 4 -- Migration guidance is shorter than A
- Structure: 5 -- Clean Keep a Changelog format
- Efficiency: 5 -- Concise
- Depth: 4 -- Less detail on the fixes and deprecation timeline
- **Composite: 4.53**

### Condition C (v2 agents)
- must_mention coverage: 4/4 -- Categorized (yes), #1234 reference (yes), migration guidance (yes, mentions migration guide link), deprecation timeline (yes, "removed in 3.0.0")
- must_not violations: None
- Completeness: 4 -- All sections but less detailed upgrade notes than A
- Precision: 5 -- Correct format
- Actionability: 4 -- References migration guide link rather than inline steps
- Structure: 5 -- Keep a Changelog format
- Efficiency: 5 -- Concise
- Depth: 4 -- Mentions internal map cause for memory leak
- **Composite: 4.53**

---

## Summary

| Task | A | B | C |
|------|---|---|---|
| dp-001 | 4.87 | 4.40 | 5.00 |
| dp-002 | 4.87 | 4.47 | 4.47 |
| dp-003 | 4.60 | 4.60 | 4.60 |
| dp-004 | 5.00 | 5.00 | 5.00 |
| dp-005 | 5.00 | 4.53 | 4.53 |
| **Mean** | **4.87** | **4.60** | **4.72** |
| B LIFT (vs A) | -- | -0.27 | -- |
| C LIFT (vs A) | -- | -- | -0.15 |
| C vs B | -- | -- | +0.12 |
