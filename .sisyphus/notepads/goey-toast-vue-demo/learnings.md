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
