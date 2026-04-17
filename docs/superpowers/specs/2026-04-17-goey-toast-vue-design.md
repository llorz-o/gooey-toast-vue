# goey-toast-vue — 设计规格

> 将 goey-toast-react 库完整移植到 Vue 3，保持 100% 功能对等和一致的公开 API。

## 概述

goey-toast-react 是一个基于 Sonner + Framer Motion 的有机形态 toast 通知库，核心视觉特色是 SVG 参数化形变（pill → blob）和弹簧物理动画。本设计将其移植到 Vue 3 生态，使用 Motion (motion.dev) 替代 Framer Motion，从零实现 toast 容器替代 Sonner。

## 技术决策

| 决策 | 选择 | 理由 |
|---|---|---|
| 动画引擎 | Motion (motion.dev) | Framer Motion 的框架无关版，API 几乎相同，迁移成本最低 |
| Toast 管理底层 | 从零实现 | Sonner 是 React 专属；React 版本大量 hack Sonner，自实现反而更干净 |
| Vue 版本 | 仅 Vue 3 (>=3.3) | 使用 Composition API、Teleport、defineProps 泛型等现代特性 |
| 功能范围 | 100% 对等 | 所有 toast 类型、SVG 形变、弹簧物理、队列、无障碍等 |
| API 风格 | 对齐 React 版 | gooeyToast / GooeyToaster 命名一致，零学习成本 |
| 架构方式 | Vue 惯用法重写 | 内部用 Vue 响应式系统，外部 API 保持一致 |

## 包信息

- **包名**: `goey-toast-vue`
- **Peer 依赖**: `vue@>=3.3.0`, `motion@>=11.0.0`
- **构建**: Vite 库模式 + vite-plugin-vue（处理 SFC），输出 ESM + CJS + 类型声明 + CSS
- **测试**: Vitest + @vue/test-utils
- **Node**: >=18.0.0
- **License**: MIT

## 文件结构

```
goey-toast-vue/
├── package.json
├── tsconfig.json
├── vite.config.ts              # Vite 库模式构建
├── vitest.config.ts
├── src/
│   ├── index.ts                # 公开导出
│   ├── types.ts                # TypeScript 类型定义
│   ├── context.ts              # 全局配置（reactive 单例）
│   ├── presets.ts              # 动画预设（smooth/bouncy/subtle/snappy）
│   ├── gooey-toast.ts          # Toast API + 队列管理
│   ├── morph.ts                # SVG 形变纯函数（提取自核心组件）
│   ├── spring.ts               # 弹簧物理参数函数
│   ├── composables/
│   │   ├── usePrefersReducedMotion.ts
│   │   ├── useToastTimer.ts    # 自动关闭计时器（含暂停/恢复）
│   │   └── useSwipeToDismiss.ts # 滑动关闭手势
│   ├── components/
│   │   ├── GooeyToaster.vue    # 顶层 Provider
│   │   ├── GooeyToast.vue      # 核心 toast 组件
│   │   ├── GooeyToast.css      # 样式
│   │   ├── gooey-styles.ts     # 类名映射
│   │   ├── ToastContainer.vue  # Toast 堆叠容器（替代 Sonner）
│   │   ├── AriaLiveAnnouncer.vue
│   │   └── ToastErrorBoundary.vue
│   ├── icons/                  # SVG 图标组件（Vue SFC）
│   │   ├── index.ts
│   │   ├── DefaultIcon.vue
│   │   ├── SuccessIcon.vue
│   │   ├── ErrorIcon.vue
│   │   ├── WarningIcon.vue
│   │   ├── InfoIcon.vue
│   │   └── SpinnerIcon.vue
│   └── __tests__/
│       ├── setup.ts
│       ├── gooey-toast.test.ts
│       ├── GooeyToaster.test.ts
│       ├── GooeyToast.test.ts
│       ├── ToastContainer.test.ts
│       ├── AriaLiveAnnouncer.test.ts
│       ├── ToastErrorBoundary.test.ts
│       ├── usePrefersReducedMotion.test.ts
│       ├── morph.test.ts
│       └── spring.test.ts
└── demo/                       # Vite + Vue 3 示例应用
```

## 架构设计

### 组件层次

```
App
└── GooeyToaster (props: position, theme, spring, ...)
    ├── ToastContainer (Teleport to body)
    │   └── <li v-for="toast in activeToasts">
    │       └── ToastErrorBoundary
    │           └── GooeyToast (核心组件)
    │               ├── SVG <path> (形变动画)
    │               ├── Header (图标 + 标题 + 关闭按钮)
    │               ├── Body (描述 + 操作按钮)
    │               ├── Progress Bar
    │               └── Timestamp
    └── AriaLiveAnnouncer
```

### 数据流

```
用户调用 gooeyToast('Hello')
  → gooey-toast.ts: createGooeyToast()
    → 检查 _activeIds.size < visibleToasts?
      → 是: push 到 _toasts (reactive ref)
      → 否: push 到 _queue
    → announce() 触发 ARIA 播报
  → ToastContainer (watch _toasts) 自动渲染新 <li>
    → GooeyToast onMounted: 测量尺寸、触发登场弹性
    → 展开: morphT 0→1 动画、body 淡入
    → 自动关闭: useToastTimer 倒计时
    → 关闭: morphT 1→0 动画、弹性
    → emit('dismiss', id)
      → gooey-toast.ts: dismissGooeyToast(id)
        → 从 _toasts 移除
        → _onToastDismissed → processQueue
```

### ToastContainer.vue — 替代 Sonner

**定位**: `<ol>` 用 `position: fixed`，根据 position prop 设置 `top/bottom/left/right`。

**堆叠**: 每个 `<li>` 用 CSS `translate3d(0, offset, 0)` 定位。`offset` 根据前面所有 toast 的实际高度 + gap 计算。高度通过 GooeyToast 的 `heightChange` 事件实时更新。

**Hover 行为**: `mouseenter/mouseleave` 设置 `containerHovered` ref。hover 时所有 toast 恢复原始位置和 scale（展开），非 hover 时后方 toast 缩小并折叠。

**堆叠 scale 效果**: 非 hover 时，第 i 个 toast 的 scale = `1 - i * 0.05`，translateY 增加偏移模拟深度。

### GooeyToast.vue — 核心组件

**SVG 形变**: 使用 `morph.ts` 中的纯函数生成 SVG path。`animate()` 驱动 `morphT` 从 0→1（展开）或 1→0（收起），每帧调用 `flush()` 直接操作 DOM。

**状态机**:
1. Mount → pill only (morphT=0)
2. Expand delay (330ms) → showBody=true → morphT: 0→1
3. Display → 等待 auto-dismiss 计时器
4. Pre-dismiss → dismissing=true → morphT: 1→0
5. Post-collapse → emit dismiss

**动画控制器**: Motion `animate()` 返回 `AnimationControls`，存为局部变量（非 ref）。每次新动画前 `.stop()` 旧控制器。

**弹性效果**: `squishSpring()` 用 `bounce` 值（0-0.8）映射到弹簧的 stiffness 和 damping 参数。三种变体: mount、expand、collapse。

**Hover 重展开**: 若 toast 正在收起或已收起，hover 时停止收起动画，重新驱动 morphT 到 1。

### 状态管理

用 Vue `reactive`/`ref` 替代 React 版的模块级变量 + pub/sub:

```typescript
// 全局配置
export const _config = reactive<GlobalConfig>({ ... })

// Toast 列表
export const _toasts = ref<ToastData[]>([])

// 容器 hover
export const containerHovered = ref(false)

// ARIA 播报
export const _announcements = ref<{ message: string; politeness: string } | null>(null)
```

Vue 的响应式系统使得任何组件都可以直接 `watch()` 这些状态，无需手动订阅/取消订阅。

### Composables

**usePrefersReducedMotion**: `matchMedia('(prefers-reduced-motion: reduce)')` 监听，返回 `readonly ref<boolean>`。

**useToastTimer**: 封装自动关闭计时器逻辑。接收 `duration`、`onTimeout` 回调。暴露 `start()`、`pause()`、`resume()`、`reset()`。内部用 `remainingTime` 和 `timerStart` 追踪暂停/恢复。

**useSwipeToDismiss**: 封装 `pointerdown/pointermove/pointerup` 手势。返回 `{ deltaX, opacity, swiping }`。位移超阈值时调用 `onDismiss` 回调。

### 公开 API

```typescript
// 组件
export { default as GooeyToaster } from './components/GooeyToaster.vue'

// Toast 函数
export { gooeyToast } from './gooey-toast'

// 预设
export { animationPresets } from './presets'

// 类型
export type {
  AnimationPreset, AnimationPresetName,
  GooeyToastOptions, GooeyPromiseData, GooeyToasterProps,
  GooeyToastAction, GooeyToastClassNames, GooeyToastTimings,
  GooeyToastUpdateOptions, DismissFilter,
}

// 向后兼容别名
export { default as GoeyToaster } from './components/GooeyToaster.vue'
export { gooeyToast as goeyToast } from './gooey-toast'
```

### 类型定义

直接复用 React 版的类型定义，移除 React 特有类型（ReactNode → VNode | string，FC → 无需）。

GooeyToasterProps 中去掉 Sonner 特有的 `toastOptions`、`richColors` 等，保留所有实际使用的配置。

### CSS 样式

直接复用 `GooeyToast.css`，仅需微调：
- 移除依赖 Sonner 的 CSS 变量（`--initial-height`、`--offset`）
- 新增 ToastContainer 的定位/堆叠样式
- 其余（颜色、动画、深色模式）完全复用

### 无障碍支持

- AriaLiveAnnouncer: 两个 visually-hidden div（polite/assertive），与 React 版逻辑一致
- Toast role: success/info 用 `role="status"`，error/warning 用 `role="alert"`
- 错误边界: `onErrorCaptured()` 生命周期钩子，渲染 fallback UI

### 错误边界

Vue 没有 React 的 Error Boundary class 组件，使用 `onErrorCaptured()` 实现：

```vue
<!-- ToastErrorBoundary.vue -->
<script setup>
const hasError = ref(false)
onErrorCaptured((err) => {
  hasError.value = true
  console.error('[GooeyToast] Error:', err)
  return false  // 阻止向上传播
})
</script>
<template>
  <slot v-if="!hasError" />
  <div v-else class="gooey-error-fallback">Toast Error</div>
</template>
```

## 可直接复用的代码（约 40%）

| 文件 | 来源 | 修改程度 |
|---|---|---|
| morph.ts | GooeyToast.tsx 提取 | 无修改 |
| spring.ts | GooeyToast.tsx 提取 | 无修改 |
| presets.ts | presets.ts | 无修改 |
| types.ts | types.ts | 移除 ReactNode，改用 VNode/string |
| GooeyToast.css | GooeyToast.css | 微调（移除 Sonner CSS 变量） |
| gooey-styles.ts | gooey-styles.ts | 无修改 |
| 队列逻辑 | gooey-toast.tsx | 核心逻辑复用，接口层重写 |
| 图标 SVG path | icons/*.tsx | SVG 数据复用，组件格式改为 .vue |

## 需要重写的代码（约 60%）

| 文件 | 复杂度 | 说明 |
|---|---|---|
| GooeyToast.vue | 高 | 最复杂的组件，需将 React hooks/effects 转为 Vue composables/watchers |
| ToastContainer.vue | 中高 | 全新组件，替代 Sonner 的堆叠/定位 |
| GooeyToaster.vue | 中 | 配置同步、键盘事件、hover 检测 |
| gooey-toast.ts | 中 | 去除 Sonner/React 依赖，改用 reactive store |
| context.ts | 低 | 变量转为 reactive/ref |
| 6 个 Icon.vue | 低 | JSX → SFC 模板 |
| composables | 中 | 新的 composable 封装 |
| 测试套件 | 中 | @testing-library/react → @vue/test-utils |

## 构建配置

使用 Vite 库模式（而非 tsup）处理 .vue SFC：

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [vue(), dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
    },
    rollupOptions: {
      external: ['vue', 'motion'],
      output: { globals: { vue: 'Vue', motion: 'Motion' } }
    },
    sourcemap: true
  }
})
```

## 测试策略

| 测试类别 | 工具 | 覆盖 |
|---|---|---|
| 纯函数 | Vitest | morph.ts, spring.ts, 队列逻辑 |
| 组件 | Vitest + @vue/test-utils | 渲染、事件、生命周期 |
| Composables | Vitest + @vue/test-utils | 计时器、手势、媒体查询 |
| 集成 | Vitest | Toast API → 组件渲染完整流程 |
