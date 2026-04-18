# goey-toast-vue TODO（当前进度）

> 这是当前唯一有效的进度面板。勾选状态代表仓库真实状态，而不是计划状态。

## 进度概览

- 已完成阶段：9 / 11
- 当前主线：质量收口与测试
- 当前最大阻塞：无（核心实现已落地，等待测试覆盖）

## A. 已完成

- [x] A1. 建好 Vue 包脚手架与构建配置
- [x] A2. 完成类型、预设、morph、spring 等纯函数层
- [x] A3. 完成响应式 store / queue / dismiss / update / promise 逻辑
- [x] A4. 完成 composables：reduced motion / timer / swipe
- [x] A5. 完成 icons、ARIA announcer、error boundary
- [x] A6. 完成 `ToastContainer.vue` 的基础堆叠容器

## B. 核心实现（已全部完成）

### B1. 核心 toast 组件 ✅

- [x] B1.1 用真实实现替换 `src/components/GooeyToast.vue`
- [x] B1.2 接入 morph 动画与 expand/collapse 状态机
- [x] B1.3 接入 hover pause / hover re-expand
- [x] B1.4 接入 progress bar / timestamp / close button
- [x] B1.5 接入 swipe dismiss / action successLabel
- [x] B1.6 接入高度上报与无障碍角色

### B2. 顶层 provider ✅

- [x] B2.1 新增 `src/components/GooeyToaster.vue`
- [x] B2.2 props 同步到 `_config`
- [x] B2.3 挂载 `ToastContainer` 与 `AriaLiveAnnouncer`
- [x] B2.4 接入 Escape dismiss 与 CSS 缺失警告

### B3. 公共导出与样式契约 ✅

- [x] B3.1 补全 `src/index.ts` 导出
- [x] B3.2 建立 Vue 侧 CSS 源文件（`src/gooey-toast.css`）
- [x] B3.3 打通 `./styles.css` 构建产物（`dist/style.css`）
- [x] B3.4 保留兼容别名 `GoeyToaster` / `goeyToast`

## C. 质量与发布前收口

### C1. 测试

- [x] C1.1 queue / dismiss / update / promise 测试
- [x] C1.2 `GooeyToast` 组件测试
- [x] C1.3 `GooeyToaster` 组件测试
- [x] C1.4 `ToastContainer` 组件测试
- [x] C1.5 `AriaLiveAnnouncer` / `ToastErrorBoundary` 测试
- [x] C1.6 `morph` / `spring` 纯函数测试

### C2. 验证

- [x] C2.1 `npm run typecheck` ✅
- [x] C2.2 `npm run test`
- [x] C2.3 `npm run build` ✅
- [x] C2.4 确认 `dist/index.js` / `index.cjs` / `index.d.ts` / `style.css` ✅

## D. 当前结论

- 核心实现已全部落地（B1 + B2 + B3 完成）
- 下一步：补充测试覆盖（C1），然后完成最终验证（C2）
- 已知问题：`useToastTimer.ts` 的 hover re-expand 后 timer 重启 bug（B1 遗留，C 阶段修复）
