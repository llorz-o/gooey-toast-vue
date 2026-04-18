# GOEY-TOAST-VUE KNOWLEDGE BASE

## OVERVIEW
Vue 3 port of `goey-toast`. Separate package, separate build chain, still incomplete. Use React package docs/tests as behavioral reference; use this package for actual Vue implementation work.

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Build/test scripts | `package.json` | Vite build, Vitest, `vue-tsc` |
| Library build | `vite.config.ts` | Entry is `src/index.ts`; externals are `vue`, `motion` |
| Current public barrel | `src/index.ts` | Still placeholder (`export {}`) |
| Runtime store / queue | `src/gooey-toast.ts` | Most advanced Vue-side logic |
| Shared reactive config | `src/context.ts` | Container hover and ARIA signaling live here |
| Toast container | `src/components/ToastContainer.vue` | Replaces Sonner stack behavior |
| Core toast UI | `src/components/GooeyToast.vue` | Still placeholder-level; main remaining implementation target |
| Standalone animation math | `src/morph.ts`, `src/spring.ts`, `src/presets.ts` | Best standalone versions of morph/spring helpers |
| Port plan | `../docs/superpowers/plans/2026-04-18-goey-toast-vue-execution-plan.md` | Current execution baseline |
| Port todo | `../docs/superpowers/todos/2026-04-18-goey-toast-vue-todo.md` | Current progress tracker |
| Design spec | `../docs/superpowers/specs/2026-04-17-goey-toast-vue-design.md` | Canonical design decisions |

## CONVENTIONS
- Build with Vite library mode; `vite-plugin-dts` provides types.
- `src/index.ts` should eventually become the real public export barrel; today it is not trustworthy.
- Vue uses `motion` instead of `framer-motion`, and replaces Sonner with local reactive/container logic.
- Tests should live under `src/__tests__/`; Vitest config is ready, but setup/tests are mostly missing.
- For expected API shape and UX parity, consult React README + React tests before changing Vue behavior.

## ANTI-PATTERNS
- Do not assume the package is publish-ready just because `dist/` exists; verify `src/index.ts`, CSS export, provider component, tests, and build outputs first.
- Do not invent new public API names on the Vue side; match React naming (`gooeyToast`, `GooeyToaster`) unless the plan explicitly says otherwise.
- Do not copy behavior from unfinished Vue placeholders; use React package tests/docs as the behavior source of truth.
- Do not remove `./styles.css` export from package.json without resolving the source-side CSS pipeline.

## UNIQUE STYLES
- `morph.ts` and `spring.ts` are the cleanest standalone versions of the animation helpers in this repo.
- `ToastContainer.vue` is the bespoke replacement for Sonner; it owns stacking, height tracking, and hover expansion.
- The current implementation resume point is Phase 7 of the Vue plan: finish `GooeyToast.vue`, then add `GooeyToaster.vue`, then wire `src/index.ts` and CSS.

## COMMANDS
```bash
cd goey-toast-vue && npm ci
cd goey-toast-vue && npm run build
cd goey-toast-vue && npm run dev
cd goey-toast-vue && npm run test
cd goey-toast-vue && npm run test:watch
cd goey-toast-vue && npm run typecheck
```

## NOTES
- `npm run dev` is `vite build --watch`, not a Vite dev server.
- Package exports promise `./styles.css`, but the CSS chain is not fully wired yet.
- `src/__tests__/setup.ts` exists but is empty; Vue-side behavioral test coverage is still missing.
- If morph/spring logic changes here, compare with React inlined copies or, better, extract shared utilities to avoid drift.
