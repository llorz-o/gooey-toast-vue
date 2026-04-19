# Learnings — goey-toast-vue Demo

## Project Context
- Demo app lives at `goey-toast-vue/demo/` (new, not yet created)
- React demo is at `goey-toast-react/demo/` — primary reference
- Vue source CSS: `goey-toast-vue/src/gooey-toast.css` (alias target for `goey-toast-vue/styles.css`)
- Vue entry: `goey-toast-vue/src/index.ts`

## Key Differences: React → Vue
- `@vitejs/plugin-react` → `@vitejs/plugin-vue`
- `tsc -b` → `vue-tsc -b`
- `framer-motion` → `motion`
- `ReactNode` → `VNode | string`
- JSX in description → `h()` function
- Builder code gen: JSX → Vue `<template>` syntax
- React useState hooks → `ref()` + `computed()`
- `import 'goey-toast/styles.css'` → `import 'goey-toast-vue/styles.css'`

## Vite Alias Pattern (from React demo vite.config.ts)
```ts
const localSrc = path.resolve(__dirname, '../src/index.ts')
const localCss = path.resolve(__dirname, '../src/gooey-toast.css')  // Vue CSS filename
const useLocalSource = fs.existsSync(localSrc)

alias: {
  ...(useLocalSource ? {
    'goey-toast-vue/styles.css': localCss,
    'goey-toast-vue': localSrc,
  } : {}),
  vue: path.resolve(__dirname, 'node_modules/vue'),
  motion: path.resolve(__dirname, 'node_modules/motion'),
}
```

## Package Versions (from goey-toast-vue/package.json devDeps)
- vue: `^3.5.0`
- motion: `^11.0.0`
- vite: `^6.0.0`
- vue-tsc: `^2.0.0`
- typescript: `^5.9.0`
- @vitejs/plugin-vue: `^5.0.0`

## API (Public Exports from goey-toast-vue/src/index.ts)
- `GooeyToaster` — Vue component
- `gooeyToast` — function with `.success/.error/.warning/.info/.promise/.dismiss/.update`
- `animationPresets` — preset configs

## CSS Note
- React demo CSS is ~1579 lines, framework-agnostic (no CSS modules, no styled-components)
- Safe to copy almost entirely to Vue demo
- Sections to REMOVE: `.page-changelog`, `.hero-mascot`, `@keyframes squish`, `.header-mascot`, `@keyframes mascot-land`, `.header--hero-hidden .header-logo`, `@keyframes header-text-in`

## Demo Scaffolding Verification
- `goey-toast-vue/demo` installs cleanly with `npm install` using the local `file:..` package link.
- `node_modules/goey-toast-vue` resolves to the parent package directory via symlink.
- Vite dev/build works with local aliases for `goey-toast-vue`, `vue`, and `motion`.

## 2026-04-18
- 将 React demo 的全局 CSS 迁移到 Vue demo 时，只删除 mascot / changelog / hero 相关区段，其余布局、表格、按钮、响应式断点都保持不变。
- `gooey-spin` 之外的 hero/header 动画都应从 Vue demo 版中移除，以避免引入不存在的页面行为。

## 2026-04-19
- Vue demo `App.css` no longer contains any `.hero`, `.hero-badge`, `.install-wrapper`, or `.copy-btn` selectors; only non-hero layout/docs styles remain.

## ExamplesSection.vue (2026-04-19)
- Vue `h()` works directly as `description` VNode — no wrapper needed
- SVG attributes in Vue use kebab-case (`stroke-width`) not camelCase
- `satisfies GooeyToastOptions` works in Vue SFC `<script setup lang="ts">`
- `gooeyToast.promise` spread with `...DEMO_DEFAULTS` works since `GooeyPromiseData` shares timing/spring/bounce fields
- `failAfter` needs explicit `Promise<never>` return type for proper TS inference

## BuilderSection.vue (2026-04-19)
- Builder state ports React useState defaults to Vue refs and emits toaster-facing config via `update:config` watcher for position/theme/progress/escape/close button.
- Generated builder code should use Vue template/prop syntax (`show-progress`, `close-button`, `:close-on-escape=\"false\"`) while toast option snippets remain plain JS object syntax.
- Range inputs in Vue SFCs need explicit numeric coercion via `@input` for number refs; string-oriented `v-model` on sliders will drift types.
- Preset buttons should sync spring/bounce from `animationPresets`, and any manual spring/bounce change should clear the active preset.

## Task 7 — Build Verification + Visual QA (2026-04-19)

### Build Results
- Library build (`goey-toast-vue`): Clean, exits 0
- Demo install: Clean, exits 0
- Demo build: Failed initially due to `navigator` globals in vue-tsc template

### Fix Applied
- **DocsSection.vue line 132**: `navigator.clipboard.writeText(...)` in template `@click` handler causes vue-tsc error because Vue templates don't expose DOM globals directly
- **Fix**: Added `clipboardWrite()` helper function in `<script setup>` that wraps `navigator.clipboard.writeText()`, then called it from the template
- Note: The tsconfig.app.json already had `"lib": ["ES2022", "DOM", "DOM.Iterable"]` — the issue is Vue template type-checking scope, not missing lib config

### Visual QA Results
- All 9 example button groups render and fire toasts ✅
- Builder controls (position, type, presets, sliders) update live code snippet ✅
- Docs section renders all 10 sections (01-10) with try-it buttons ✅
- Mobile menu works at 375px width (hamburger → dropdown) ✅
- Port 5173 was in use; Vite auto-selected 5174

### Screenshots
Saved 9 screenshots to `.sisyphus/evidence/task7/`

## BuilderSection.vue update (2026-04-19)
- Generated builder code should emit a full Vue SFC snippet with `<template>` and `<script setup lang="ts">` blocks, not just the raw toast call.
- Keep the existing toaster prop builder and toast option builder intact; only wrap them in the snippet skeleton.
- The demo-facing example should always include the `<button @click="showToast">Show Toast</button>` trigger and `function showToast()` wrapper.
