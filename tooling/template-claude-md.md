## Commands

- Dev: `{command}` (port {N})
- Test: `{command}` (single file: `{command} {path}`)
- Lint: `{command}`
- Typecheck: `{command}`
- Build: `{command}`
- DB migrate: `{command}`

## Gotchas

- IMPORTANT: {most critical gotcha — the thing that wastes the most time when Claude gets it wrong}
- IMPORTANT: {second most critical gotcha}
- {other non-obvious facts, one per line}
- {files/dirs that are auto-generated and must never be edited}

## Architecture

- See `{path to architecture doc}` for project structure and patterns
- {only architecture gotchas that prevent mistakes on ANY task, e.g., unprotected routes}

## Standards

{ONLY rules your linter/formatter does NOT enforce.}

- {naming convention linters don't catch}
- {type usage rule} (e.g., no `any`, use `unknown` and narrow)
- {import/export convention} (e.g., named exports only)
- {error handling pattern} (e.g., custom error class, never raw strings)
- {env var handling} (e.g., validated with Zod at startup)

## Before Finishing

- Run `{test command}` — all must pass
- Run `{typecheck command}` — zero errors
- Run `{lint command}` — fix all warnings

## Knowledge

{Optional — for projects large enough to need progressive disclosure.}

| File | Read when |
|------|-----------|
| `{path}` | {working on what} |
| `{path}` | {working on what} |

<!--
QUALITY CHECKS before committing:
- [ ] Under 100 lines?
- [ ] Every line passes "would removing this cause Claude to make mistakes?"
- [ ] No rules that linters/formatters already enforce?
- [ ] No generic advice ("write clean code", "handle errors")?
- [ ] No step-by-step workflows or output templates?
- [ ] Critical constraints at the top (positional attention bias)?
- [ ] Build commands are accurate and tested?
- [ ] Off-limits files/dirs are current?
- [ ] Module-specific rules moved to .claude/rules/ instead?
- [ ] Formatting enforcement moved to hooks instead?

MAINTENANCE: Review when stack, commands, or architecture change.
             Quarterly audit: does every line still prevent real mistakes?
-->
