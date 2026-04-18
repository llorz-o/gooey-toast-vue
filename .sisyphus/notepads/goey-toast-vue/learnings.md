## 2026-04-18
- `src/index.ts` 需要用 `import GooeyToaster from './components/GooeyToaster.vue'` 再导出，直接 `export { GooeyToaster } from ...` 会被 `vue-tsc` / `vite-plugin-dts` 判定为不存在的命名导出。
- 只要在入口引入 `./gooey-toast.css`，并在 CSS 中定义 `:root { --gooey-toast: 1; }`，`GooeyToaster.vue` 的开发期样式存在性检测就会通过。
- `vite.config.ts` 已经启用 `cssCodeSplit: false`，因此入口 CSS 会被合并进 `dist/goey-toast-vue.css`。
- 新增 `src/__tests__/morph.test.ts` 与 `src/__tests__/spring.test.ts`，用 Vitest globals 直接覆盖纯函数导出与关键边界值；`npm run test -- --reporter=verbose` 通过。
