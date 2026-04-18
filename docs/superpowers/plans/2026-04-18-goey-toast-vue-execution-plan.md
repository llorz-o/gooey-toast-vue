# goey-toast-vue 执行计划（当前基线）

> 本文档是当前唯一有效的 Vue 移植执行计划。
> 设计决策以 `docs/superpowers/specs/2026-04-17-goey-toast-vue-design.md` 为准；实现进度以 `docs/superpowers/todos/2026-04-18-goey-toast-vue-todo.md` 为准。

## 1. 目标

将 `goey-toast-react` 完整移植为 `goey-toast-vue`，满足以下约束：

- Vue 3 only（>=3.3）
- 对齐 React 公开 API 与行为
- 保留 CSS 作为公共契约（`styles.css`）
- 使用 `motion` 替代 `framer-motion`
- 不再依赖 Sonner；Vue 侧由本地容器与响应式 store 承担运行时

## 2. 当前真实状态（2026-04-18）

### 已完成

1. 包级脚手架与构建配置已存在
2. 纯函数与类型层已存在：`types.ts`、`presets.ts`、`morph.ts`、`spring.ts`
3. 运行时 store / queue 已存在：`context.ts`、`gooey-toast.ts`
4. composables 已存在：
   - `usePrefersReducedMotion.ts`
   - `useToastTimer.ts`
   - `useSwipeToDismiss.ts`
5. 基础组件已存在：icons、`AriaLiveAnnouncer.vue`、`ToastErrorBoundary.vue`
6. `ToastContainer.vue` 已存在并承担堆叠/hover/高度管理

### 未完成

1. `src/components/GooeyToast.vue` 仍是占位实现
2. `src/components/GooeyToaster.vue` 不存在
3. `src/index.ts` 仍是 `export {}`
4. Vue 侧 CSS 资产与 `styles.css` 导出链未闭合
5. 测试套件基本缺失
6. 尚未完成 publish-ready 验证

## 3. 代码真相来源

实现期间按优先级读取：

1. React 行为真源：
   - `goey-toast-react/README.md`
   - `goey-toast-react/src/__tests__/`
   - `goey-toast-react/src/index.ts`
2. React 参考实现：
   - `goey-toast-react/src/gooey-toast.tsx`
   - `goey-toast-react/src/components/GooeyToast.tsx`
   - `goey-toast-react/src/components/GooeyToaster.tsx`
3. Vue 已落地基础：
   - `goey-toast-vue/src/gooey-toast.ts`
   - `goey-toast-vue/src/components/ToastContainer.vue`
   - `goey-toast-vue/src/morph.ts`
   - `goey-toast-vue/src/spring.ts`

## 4. 剩余执行阶段

### Phase 7 — 实现 `GooeyToast.vue`

**目标**：把占位组件替换为真正的核心 toast UI 与状态机。

**必须交付**：

- pill → blob → pill 的 SVG morph
- mount → expand → display → pre-dismiss → collapse 生命周期
- hover pause 与 hover re-expand
- progress bar
- swipe-to-dismiss
- action button 与 successLabel 回弹
- close button
- timestamp / description / icon / phase 切换
- `heightChange` 上报
- ARIA role 与基础可访问性行为

**完成标准**：

- 组件不再只渲染 `toast.title`
- 能驱动 `ToastContainer.vue` 中的真实高度变化
- 至少覆盖默认、success、error、loading/promise 四类关键状态

### Phase 8 — 新增 `GooeyToaster.vue`

**目标**：补足顶层 provider，建立公共组件入口。

**必须交付**：

- props → `_config` 同步
- 挂载 `ToastContainer`
- 挂载 `AriaLiveAnnouncer`
- Escape dismiss 最新 toast
- 开发态 CSS 检测警告

**完成标准**：

- `<GooeyToaster />` 能独立驱动 Vue 侧 toast 系统
- 全局配置可以通过 props 生效

### Phase 9 — 完成公共导出与 CSS 链路

**目标**：让包出口真实可用。

**必须交付**：

- `src/index.ts` 导出：`GooeyToaster`、`gooeyToast`、`animationPresets`、类型
- 向后兼容别名：`GoeyToaster`、`goeyToast`
- 建立 Vue 侧样式源文件
- 保证 `package.json` 的 `./styles.css` 导出能落到真实构建产物

**完成标准**：

- 消费者可以按 README 形式导入组件与样式
- 样式缺失时开发态警告可用，样式存在时不误报

### Phase 10 — 建立测试基线

**目标**：把 React 的关键行为覆盖迁到 Vue。

**必须交付**：

- `gooey-toast.test.ts`
- `GooeyToast.test.ts`
- `GooeyToaster.test.ts`
- `ToastContainer.test.ts`
- `AriaLiveAnnouncer.test.ts`
- `ToastErrorBoundary.test.ts`
- `morph.test.ts`
- `spring.test.ts`

**最少覆盖行为**：

- 创建 / 更新 / dismiss / dismiss filter / queue overflow
- promise toast loading → success / error
- 组件渲染与 action click
- hover / timer / role / position 的关键行为

### Phase 11 — 验证为可发布状态

**目标**：确认 `goey-toast-vue` 从源码到产物都能成立。

**必须通过**：

- `npm run typecheck`
- `npm run test`
- `npm run build`

**期望产物**：

- `dist/index.js`
- `dist/index.cjs`
- `dist/index.d.ts`
- `dist/style.css`

## 5. 推荐实施顺序

1. 先做 `GooeyToast.vue`，因为它决定容器高度、动画、定时器、手势与视觉主体
2. 再做 `GooeyToaster.vue`，把全局配置和键盘行为接上
3. 然后收口 `src/index.ts` 与 CSS 导出链
4. 最后补测试并跑完整验证

## 6. 风险点与护栏

### 风险点

1. `GooeyToast.vue` 逻辑密度最高，最容易出现“视觉像了但行为不对”
2. `ToastContainer.vue` 已实现，但真实高度/退出节奏还要和核心组件联动验证
3. CSS 导出链看起来简单，但它是公共契约，不能只让本地 dev 能跑

### 护栏

- 不从占位 Vue 文件推断行为，以 React README + tests 为准
- 不删除 `styles.css` 导出
- 不引入新的公开 API 名字
- 不把“能 build”误判为“可发布”

## 7. 完成定义（Definition of Done）

当且仅当以下条件同时满足，Vue 移植才算进入下一里程碑：

1. `GooeyToast.vue` 与 `GooeyToaster.vue` 都已落地
2. `src/index.ts` 与 CSS 入口可被消费者正常导入
3. 关键行为测试已存在且通过
4. `typecheck`、`test`、`build` 全通过
5. `docs/superpowers/todos/2026-04-18-goey-toast-vue-todo.md` 已同步到最新进度
