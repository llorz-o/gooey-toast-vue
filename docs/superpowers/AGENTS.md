# DOCS / SUPERPOWERS KNOWLEDGE BASE

## OVERVIEW
Living design, execution-plan, and progress docs for major workstreams. Right now this directory is the canonical documentation surface for the Vue port.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Vue design rationale | `specs/2026-04-17-goey-toast-vue-design.md` | Canonical design decisions |
| Vue execution plan | `plans/2026-04-18-goey-toast-vue-execution-plan.md` | Current implementation baseline |
| Vue progress board | `todos/2026-04-18-goey-toast-vue-todo.md` | Canonical progress tracker |

## CONVENTIONS
- Specs capture decisions; execution plans define order and acceptance criteria; todo docs track live progress.
- If implementation reality changes, update the plan file first so future sessions resume from facts, not assumptions.
- Keep filenames date-prefixed and descriptive.
- This directory documents work; it is not the source of runtime truth. Runtime truth still lives in package source files.

## ANTI-PATTERNS
- Do not leave plans in future tense after code has partially landed; update them to reflect actual status.
- Do not treat session transcript markdown files as substitutes for curated docs here.
- Do not duplicate implementation detail here when the code already proves the behavior; link to the file or summarize the invariant instead.

## COMMANDS
```bash
# no package-local commands here
# read docs before changing large architecture or migration direction
```

## NOTES
- Current critical docs are the Vue execution plan and Vue todo board; they should stay aligned with the actual codebase phase state.
- When shipping a phase, update the todo board first, then refresh the execution plan only if sequencing or acceptance criteria changed.
