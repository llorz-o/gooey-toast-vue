# PROJECT KNOWLEDGE BASE

**Generated:** 2026-04-18
**Commit:** `4788e92`
**Branch:** `main`

## OVERVIEW
Small multi-package repo. `goey-toast-react` is the canonical shipped library/docs/test source; `goey-toast-vue` is an in-progress Vue 3 port with separate build rules; `docs/superpowers` stores design + implementation plans.

## STRUCTURE
```text
./
├── goey-toast-react/      # published React package (`goey-toast`)
├── goey-toast-vue/        # Vue 3 port (`goey-toast-vue`), still incomplete
├── docs/superpowers/      # living specs and implementation plans
├── session-ses_*.md       # archived agent/session transcripts, not source of truth
├── .opencode/             # tooling metadata only
└── .sisyphus/             # agent planning artifacts only
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| React public API | `goey-toast-react/src/index.ts` | Imports CSS, exports `GooeyToaster`, `gooeyToast`, presets, types |
| React runtime behavior | `goey-toast-react/src/gooey-toast.tsx` | Canonical queue/update/promise behavior |
| React UI behavior | `goey-toast-react/src/components/` | `GooeyToast.tsx` + `GooeyToaster.tsx` drive visual/reference behavior |
| React docs/examples | `goey-toast-react/README.md` | Canonical consumer docs |
| React demo flow | `goey-toast-react/demo/` | Separate Vite app with local `file:..` dependency |
| Vue runtime | `goey-toast-vue/src/gooey-toast.ts` | Ported queue/store logic |
| Vue missing pieces | `goey-toast-vue/src/components/GooeyToast.vue`, `goey-toast-vue/src/index.ts` | Core UI still placeholder; public barrel still empty |
| Vue standalone math | `goey-toast-vue/src/morph.ts`, `goey-toast-vue/src/spring.ts` | Cleanest standalone morph/spring utilities |
| Vue port plan | `docs/superpowers/plans/2026-04-18-goey-toast-vue-execution-plan.md` | Current execution baseline |
| Vue port todo | `docs/superpowers/todos/2026-04-18-goey-toast-vue-todo.md` | Current progress tracker |
| Vue design decisions | `docs/superpowers/specs/2026-04-17-goey-toast-vue-design.md` | Canonical design rationale |

## CONVENTIONS
- No root workspace config. Run build/test/typecheck **inside each package**.
- React package is the behavioral source of truth: README + tests define expected API and UX.
- Vue package uses Vite library build; React package uses tsup. Do not assume scripts or output shapes match.
- CSS import is part of the public contract. Consumers must import `goey-toast/styles.css` (React) and Vue package intends the same export pattern.
- TypeScript is strict in both packages. Vue adds `noUnusedLocals` and `noUnusedParameters`.
- React demo aliases `goey-toast` to local source when available; demo behavior depends on package build/link state.

## ANTI-PATTERNS (THIS PROJECT)
- Do not treat session transcript files (`session-ses_*.md`) as canonical repo docs; they are historical context only.
- Do not run root-level `npm` commands expecting a workspace orchestrator; there is no root package.json.
- Do not change public API behavior from Vue files alone without checking React README + tests first.
- Do not remove CSS imports/exports as “cleanup”; styles are marked as side effects and are required for correct rendering.
- Do not build the React demo before the library package is built or locally linked; the demo depends on `file:..` packaging behavior.
- Do not assume `goey-toast-vue/src/index.ts` is authoritative today; it is still placeholder-level and must be treated as unfinished.

## UNIQUE STYLES
- Canonical preset names: `smooth`, `bouncy`, `subtle`, `snappy`.
- Canonical position values: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`.
- Canonical queue overflow values: `drop-oldest`, `drop-newest`.
- Canonical `closeButton` values: `false`, `true`, `top-left`, `top-right`.
- Canonical `bounce` range from docs: `0.05` to `0.8`, default `0.4`.

## COMMANDS
```bash
# React package
cd goey-toast-react && npm ci && npm run build
cd goey-toast-react && npm run test
cd goey-toast-react && npm run typecheck

# React demo
cd goey-toast-react/demo && npm ci && npm run dev
cd goey-toast-react/demo && npm run build

# Vue package
cd goey-toast-vue && npm ci && npm run build
cd goey-toast-vue && npm run test
cd goey-toast-vue && npm run typecheck
```

## NOTES
- Node requirement is `>=18` in both packages.
- React demo deployment/build order is non-standard: build the React library first, then install/build the demo.
- `goey-toast-vue/package.json` exports `./styles.css`, but the source-side CSS/export chain is not finished yet.
- `goey-toast-vue` currently contains committed package install artifacts (`package-lock.json`, and at times `node_modules` may appear locally); treat package boundaries carefully.
- Child knowledge bases live at:
  - `goey-toast-react/AGENTS.md`
  - `goey-toast-vue/AGENTS.md`
  - `goey-toast-react/demo/AGENTS.md`
  - `docs/superpowers/AGENTS.md`
