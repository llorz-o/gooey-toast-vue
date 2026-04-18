# goey-toast-vue Implementation Plan

> Port goey-toast-react to Vue 3 with 100% feature parity.
> Design spec: `docs/superpowers/specs/2026-04-17-goey-toast-vue-design.md`

## Execution Order & Dependencies

```
Phase 1  Scaffolding (package.json, configs)
  │
Phase 2  Pure functions & types (zero deps on Vue)
  │       ├─ types.ts
  │       ├─ presets.ts
  │       ├─ morph.ts
  │       ├─ spring.ts
  │       └─ gooey-styles.ts
  │
Phase 3  State management (Vue reactive, no components)
  │       ├─ context.ts
  │       └─ gooey-toast.ts
  │
Phase 4  Composables
  │       ├─ usePrefersReducedMotion.ts
  │       ├─ useToastTimer.ts
  │       └─ useSwipeToDismiss.ts
  │
Phase 5  Simple components
  │       ├─ icons/ (6 SFC + index.ts)
  │       ├─ AriaLiveAnnouncer.vue
  │       └─ ToastErrorBoundary.vue
  │
Phase 6  ToastContainer.vue (replaces Sonner)
  │
Phase 7  GooeyToast.vue (core — depends on everything above)
  │
Phase 8  GooeyToaster.vue (top-level provider)
  │
Phase 9  Public API (index.ts) + CSS
  │
Phase 10 Tests
  │
Phase 11 Build & verify
```

---

## Phase 1: Project Scaffolding

**Goal**: Create `goey-toast-vue/` with all config files so `npm install` and `npm run build` work (producing an empty output).

### Step 1.1: `goey-toast-vue/package.json`

```json
{
  "name": "goey-toast-vue",
  "version": "0.1.0",
  "description": "A gooey, morphing toast component for Vue 3 with Motion animations",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./styles.css": "./dist/style.css"
  },
  "sideEffects": ["*.css"],
  "files": ["dist"],
  "scripts": {
    "build": "vite build",
    "dev": "vite build --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "vue-tsc --noEmit"
  },
  "peerDependencies": {
    "vue": ">=3.3.0",
    "motion": ">=11.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "@vue/test-utils": "^2.4.0",
    "jsdom": "^28.0.0",
    "motion": "^11.0.0",
    "typescript": "^5.9.0",
    "vite": "^6.0.0",
    "vite-plugin-dts": "^4.0.0",
    "vitest": "^4.0.0",
    "vue": "^3.5.0",
    "vue-tsc": "^2.0.0"
  },
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Step 1.2: `goey-toast-vue/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "rootDir": "src",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "types": ["vitest/globals"],
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "paths": {}
  },
  "include": ["src/**/*.ts", "src/**/*.vue", "env.d.ts"],
  "exclude": ["node_modules", "dist", "src/__tests__"]
}
```

### Step 1.3: `goey-toast-vue/vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [vue(), dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['vue', 'motion'],
      output: { globals: { vue: 'Vue', motion: 'Motion' } },
    },
    sourcemap: true,
    cssCodeSplit: false,
  },
})
```

### Step 1.4: `goey-toast-vue/vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/__tests__/setup.ts'],
  },
})
```

### Step 1.5: `goey-toast-vue/src/__tests__/setup.ts`

Empty file initially. Will add `@testing-library/jest-dom` or custom matchers if needed.

```typescript
// Test setup — add global mocks/matchers here
```

### Step 1.6: Create placeholder `goey-toast-vue/src/index.ts`

```typescript
// Public API — will be populated in Phase 9
export {}
```

### Step 1.7: `goey-toast-vue/env.d.ts`

Vue SFC type shim:

```typescript
/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

**Verification**: `npm install && npm run build` exits 0 (empty lib output).

---

## Phase 2: Pure Functions & Types

**Goal**: Port all framework-agnostic code. These files have zero Vue/React imports.

### Step 2.1: `src/types.ts`

Copy from React `types.ts`. Changes:
- Remove `import type { ReactNode } from 'react'`
- Remove `import type { ExternalToast, ToasterProps } from 'sonner'`
- Replace all `ReactNode` with `VNode | string` (import from `vue`)
- Replace `ToasterProps['position']` with inline union type `'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'`
- Remove `GooeyToasterProps.toastOptions` (Sonner-specific `Partial<ExternalToast>`)
- Remove `GooeyToasterProps.richColors` (Sonner-specific)
- Remove `GooeyToasterProps.expand` (Sonner-specific — our ToastContainer handles this)
- Keep `GooeyToasterProps.visibleToasts` (we implement this ourselves)

Full type list to port:
- `GooeyToastType` — identical
- `GooeyToastTimings` — identical
- `GooeyToastClassNames` — identical
- `GooeyToastAction` — identical
- `GooeyToastData` — `ReactNode` → `VNode | string`
- `GooeyToastOptions` — `ReactNode` → `VNode | string`
- `GooeyPromiseData<T>` — `ReactNode` → `VNode | string`
- `GooeyToastPhase` — identical
- `GooeyToastUpdateOptions` — `ReactNode` → `VNode | string`
- `DismissFilter` — identical
- `GooeyToasterProps` — remove Sonner fields, inline position type
- `ToastPosition` — new exported type alias for the 6-position union

### Step 2.2: `src/presets.ts`

**Direct copy** from React `presets.ts`. Zero changes needed.

```typescript
export interface AnimationPreset {
  bounce: number
  spring: boolean
}

export const animationPresets = {
  smooth: { bounce: 0.1, spring: true },
  bouncy: { bounce: 0.6, spring: true },
  subtle: { bounce: 0.05, spring: true },
  snappy: { bounce: 0.4, spring: true },
} as const satisfies Record<string, AnimationPreset>

export type AnimationPresetName = keyof typeof animationPresets
```

### Step 2.3: `src/morph.ts`

Extract from React `GooeyToast.tsx` lines 221-360. Three exports:
- `memoizePath(fn)` — generic last-result cache
- `morphPath` — memoized `morphPathRaw`
- `morphPathCenter` — memoized `morphPathCenterRaw`
- `PH` constant (= 34)

Also export the raw functions for testing:
- `morphPathRaw(pw, bw, th, t)`
- `morphPathCenterRaw(pw, bw, th, t)`

**Zero changes** to the math. Direct copy.

### Step 2.4: `src/spring.ts`

Extract from React `GooeyToast.tsx` lines 77-86. Exports:
- `squishSpring(durationSec, defaultDur, bounce?)` — returns `{ type: 'spring', stiffness, damping, mass }`
- `DEFAULT_EXPAND_DUR` (= 0.6)
- `DEFAULT_COLLAPSE_DUR` (= 0.9)
- `SMOOTH_EASE` (= [0.4, 0, 0.2, 1])

**Zero changes**. Direct copy.

### Step 2.5: `src/components/gooey-styles.ts`

**Direct copy** from React `gooey-styles.ts`. Zero changes.

**Verification**: `npm run typecheck` passes for Phase 2 files.

---

## Phase 3: State Management

**Goal**: Replace React's module-level variables + pub/sub with Vue reactive primitives.

### Step 3.1: `src/context.ts`

Replace the React version's getter/setter + pub/sub pattern with `reactive`/`ref`:

```typescript
import { reactive, ref } from 'vue'
import type { ToastPosition } from './types'

// Global config — reactive singleton
export const _config = reactive({
  position: 'bottom-right' as ToastPosition,
  dir: 'ltr' as 'ltr' | 'rtl',
  spring: true,
  bounce: undefined as number | undefined,
  theme: 'light' as 'light' | 'dark',
  visibleToasts: 3,
  swipeToDismiss: true,
  closeOnEscape: true,
  maxQueue: Infinity,
  queueOverflow: 'drop-oldest' as 'drop-oldest' | 'drop-newest',
  showProgress: false,
  closeButton: false as boolean | 'top-left' | 'top-right',
})

// Container hover state — watched by GooeyToast instances
export const containerHovered = ref(false)

// ARIA announcements — watched by AriaLiveAnnouncer
export type AriaLivePoliteness = 'polite' | 'assertive'
export interface Announcement {
  message: string
  politeness: AriaLivePoliteness
}
export const _announcement = ref<Announcement | null>(null)

export function announce(message: string, politeness: AriaLivePoliteness = 'polite') {
  // Set to null first to trigger watchers even for identical messages
  _announcement.value = null
  // nextTick or queueMicrotask to ensure the null is observed before the new value
  queueMicrotask(() => {
    _announcement.value = { message, politeness }
  })
}
```

Key difference from React version:
- No getter/setter functions needed — direct property access on `_config`
- No `subscribeContainerHovered()` — components `watch(containerHovered, ...)`
- No `subscribeAnnouncements()` — AriaLiveAnnouncer `watch(_announcement, ...)`
- `announce()` uses null→value pattern to re-trigger watchers for duplicate messages

### Step 3.2: `src/gooey-toast.ts`

The most complex state file. Port from React `gooey-toast.tsx` (502 lines).

Key architectural changes:
1. **No Sonner dependency** — `toast.custom()` / `toast.dismiss()` replaced by reactive array
2. **No React components** — `GooeyToastWrapper` / `PromiseToastWrapper` are not needed; ToastContainer renders directly from the reactive toast list
3. **Toast lifecycle managed by reactive data**, not Sonner unmount

Data structures:

```typescript
import { ref, type Ref } from 'vue'

export interface InternalToast {
  id: string | number
  title: string
  type: GooeyToastType
  phase: GooeyToastPhase
  description?: VNode | string
  action?: GooeyToastAction
  icon?: VNode | string
  duration?: number
  classNames?: GooeyToastClassNames
  fillColor?: string
  borderColor?: string
  borderWidth?: number
  timing?: GooeyToastTimings
  preset?: AnimationPresetName
  spring?: boolean
  bounce?: number
  showProgress?: boolean
  showTimestamp?: boolean
  // Promise-specific
  _promise?: Promise<unknown>
  _promiseData?: GooeyPromiseData<unknown>
  // Callbacks
  _onDismiss?: (id: string | number) => void
  _onAutoClose?: (id: string | number) => void
}

// Active toasts visible on screen
export const _toasts: Ref<InternalToast[]> = ref([])

// Queue for overflow
const _queue: Array<{ id: string | number; type: GooeyToastType; toast: InternalToast }> = []

// Track manual vs auto dismiss
const _autoCloseFlags = new Set<string | number>()
const _manualDismissFlags = new Set<string | number>()
```

Functions to port (with changes noted):

- `createGooeyToast(title, type, options)` — Instead of `toast.custom()`, push to `_toasts.value`. Queue logic same as React.
- `dismissGooeyToast(idOrFilter?)` — Instead of `toast.dismiss()`, splice from `_toasts.value`. Type-filter and dismiss-all logic same as React.
- `updateGooeyToast(id, options)` — Find toast in `_toasts.value` by id, mutate fields directly (Vue reactivity picks up changes). No listener registry needed.
- `_processQueue()` — Same logic, but `create` callback pushes to `_toasts.value`.
- `_enqueue(entry)` — Same logic.
- `_onToastDismissed(id)` — Remove from `_toasts.value`, invoke callbacks, process queue.
- `_markAutoClose(id)` — Same.
- `_resetQueue()` — Same (clear `_toasts.value`, `_queue`, flags).
- `_getMostRecentActiveId()` — Return `_toasts.value[_toasts.value.length - 1]?.id`.

Promise toast handling:
- Instead of `PromiseToastWrapper` component, the `gooeyToast.promise()` function creates an `InternalToast` with `phase: 'loading'` and `_promise` / `_promiseData` fields.
- A `promise.then().catch()` chain updates the toast in `_toasts.value` when it resolves/rejects — mutating `title`, `phase`, `description`, `action` directly.

ARIA announcements:
- Call `announce()` from `context.ts` in `createGooeyToast()` and `updateGooeyToast()`.
- `buildAnnouncementMessage()` and `getAnnouncePoliteness()` — direct copy.

Public API shape — identical to React:

```typescript
export const gooeyToast = Object.assign(
  (title: string, options?: GooeyToastOptions) => createGooeyToast(title, 'default', options),
  {
    success: (title, options?) => createGooeyToast(title, 'success', options),
    error: (title, options?) => createGooeyToast(title, 'error', options),
    warning: (title, options?) => createGooeyToast(title, 'warning', options),
    info: (title, options?) => createGooeyToast(title, 'info', options),
    promise: <T,>(promise: Promise<T>, data: GooeyPromiseData<T>) => { ... },
    dismiss: dismissGooeyToast,
    update: updateGooeyToast,
  }
)
```

**Verification**: Unit tests for queue logic, dismiss filters, promise state transitions (Phase 10).

---

## Phase 4: Composables

### Step 4.1: `src/composables/usePrefersReducedMotion.ts`

Port from React `usePrefersReducedMotion.ts`:

```typescript
import { ref, onMounted, onUnmounted, readonly, type DeepReadonly, type Ref } from 'vue'

const QUERY = '(prefers-reduced-motion: reduce)'

export function usePrefersReducedMotion(): Readonly<Ref<boolean>> {
  const prefersReducedMotion = ref(
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(QUERY).matches
      : false
  )

  let mql: MediaQueryList | null = null
  const handler = (e: MediaQueryListEvent) => {
    prefersReducedMotion.value = e.matches
  }

  onMounted(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    mql = window.matchMedia(QUERY)
    mql.addEventListener('change', handler)
  })

  onUnmounted(() => {
    mql?.removeEventListener('change', handler)
  })

  return readonly(prefersReducedMotion)
}
```

### Step 4.2: `src/composables/useToastTimer.ts`

New composable — extracts the pre-dismiss timer logic from React `GooeyToast.tsx` lines 818-862.

```typescript
interface UseToastTimerOptions {
  duration: number           // total display duration ms
  expandDelayMs: number      // morph expand delay ms
  collapseMs: number         // morph collapse duration ms
  paused: Ref<boolean>       // containerHovered || toastHovered
  enabled: Ref<boolean>      // showBody && !actionSuccess && !dismissing
  onTimeout: () => void      // triggers pre-dismiss collapse
}

interface UseToastTimerReturn {
  progressDuration: Readonly<Ref<number>>  // for CSS progress bar
  restart: () => void                       // reset timer on re-expand
}
```

Internal state:
- `remainingRef` — tracks remaining ms when paused
- `timerStartRef` — timestamp when current timer started
- Uses `watch()` on `paused` and `enabled` to start/pause/resume

### Step 4.3: `src/composables/useSwipeToDismiss.ts`

Extract swipe logic from React `GooeyToast.tsx` lines 1100-1154.

```typescript
interface UseSwipeToDismissOptions {
  enabled: () => boolean     // reads _config.swipeToDismiss
  threshold?: number         // default 100
  onDismiss: () => void
}

interface UseSwipeToDismissReturn {
  offsetX: Readonly<Ref<number>>
  opacity: Readonly<Ref<number>>
  swiping: Readonly<Ref<boolean>>
  onPointerDown: (e: PointerEvent) => void
  onPointerMove: (e: PointerEvent) => void
  onPointerUp: () => void
}
```

Uses pointer events (not touch events) for broader compatibility.

**Verification**: Unit tests for each composable (Phase 10).

---

## Phase 5: Simple Components

### Step 5.1: Icons (`src/icons/`)

6 Vue SFC files + `index.ts`. Each icon is a thin wrapper around the same SVG from React.

Example — `SuccessIcon.vue`:
```vue
<script setup lang="ts">
withDefaults(defineProps<{ size?: number; class?: string }>(), { size: 20 })
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :class="$props.class"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </svg>
</template>
```

Files to create:
- `DefaultIcon.vue` — copy SVG paths from React `DefaultIcon.tsx`
- `SuccessIcon.vue` — as above
- `ErrorIcon.vue` — copy SVG paths from React `ErrorIcon.tsx`
- `WarningIcon.vue` — copy SVG paths from React `WarningIcon.tsx`
- `InfoIcon.vue` — copy SVG paths from React `InfoIcon.tsx`
- `SpinnerIcon.vue` — copy SVG paths from React `SpinnerIcon.tsx`
- `index.ts` — re-export all icons

### Step 5.2: `src/components/AriaLiveAnnouncer.vue`

Port from React `AriaLiveAnnouncer.tsx`. Uses `watch()` on `_announcement` from context.

```vue
<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { _announcement, type Announcement } from '../context'

const politeMessage = ref('')
const assertiveMessage = ref('')

watch(_announcement, (ann: Announcement | null) => {
  if (!ann) return
  if (ann.politeness === 'assertive') {
    assertiveMessage.value = ''
    nextTick(() => { assertiveMessage.value = ann.message })
  } else {
    politeMessage.value = ''
    nextTick(() => { politeMessage.value = ann.message })
  }
})

// Clear after 7 seconds
watch(politeMessage, (msg) => {
  if (!msg) return
  const t = setTimeout(() => { politeMessage.value = '' }, 7000)
  // Cleanup not needed for setTimeout in watch — component unmount handles it
})
watch(assertiveMessage, (msg) => {
  if (!msg) return
  const t = setTimeout(() => { assertiveMessage.value = '' }, 7000)
})
</script>

<template>
  <div role="status" aria-live="polite" aria-atomic="true"
    :style="{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }">
    {{ politeMessage }}
  </div>
  <div role="alert" aria-live="assertive" aria-atomic="true"
    :style="{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }">
    {{ assertiveMessage }}
  </div>
</template>
```

### Step 5.3: `src/components/ToastErrorBoundary.vue`

Port from React `ToastErrorBoundary.tsx`. Uses `onErrorCaptured()`.

```vue
<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)

onErrorCaptured((err) => {
  hasError.value = true
  if (import.meta.env.DEV) {
    console.error('[GooeyToast] Rendering error:', err)
  }
  return false // prevent propagation
})
</script>

<template>
  <slot v-if="!hasError" />
</template>
```

Note: React version renders `null` on error; Vue version renders nothing (empty template).

**Verification**: Component mount tests in Phase 10.

---

## Phase 6: ToastContainer.vue

**Goal**: New component that replaces Sonner's `<Toaster>`. Manages toast positioning, stacking, hover expansion.

### Key responsibilities:
1. `<Teleport to="body">` — render fixed-position `<ol>` outside component tree
2. Render `<li v-for="toast in _toasts">` wrapping `<ToastErrorBoundary><GooeyToast /></ToastErrorBoundary>`
3. Compute stacking offsets: each toast's `translateY` = sum of heights of all newer toasts + gaps
4. Handle hover expand/collapse: `@mouseenter`/`@mouseleave` on `<ol>` sets `containerHovered`
5. Stack scale effect: non-hovered toasts behind front get `scale(1 - i * 0.05)`

### Props:
```typescript
interface ToastContainerProps {
  position: ToastPosition
  gap: number
  offset: number | string
  theme: 'light' | 'dark'
  dir: 'ltr' | 'rtl'
}
```

### Implementation details:

**Positioning**: CSS `position: fixed`. Position prop maps to CSS:
- `bottom-right` → `bottom: {offset}; right: {offset}`
- `top-center` → `top: {offset}; left: 50%; transform: translateX(-50%)`
- etc.

**Height tracking**: Each `<GooeyToast>` emits `heightChange(id, height)`. ToastContainer maintains a `Map<id, number>` of current heights. On change, recompute offsets for all toasts.

**Stacking offsets**: `<li>` gets `style.transform = translate3d(0, ${offset}px, 0)`. For bottom positions, offset is negative (toasts stack upward). For top positions, offset is positive.

**Hover behavior**:
- `@mouseenter` on `<ol>`: set `containerHovered.value = true`, remove scale/translate compression
- `@mouseleave` on `<ol>`: set `containerHovered.value = false`, apply scale/translate compression

**Scale effect** (non-hovered):
```
toast[0] (front/newest): scale(1), offset 0
toast[1]: scale(0.95), offset = height[0] + gap (compressed)
toast[2]: scale(0.90), offset = height[0] + height[1] + 2*gap (compressed)
```
When hovered: all toasts scale(1), offset = actual cumulative heights + gaps.

**Transition**: `<li>` gets CSS `transition: transform 0.3s ease, opacity 0.3s ease`.

**Toast removal**: When a toast is dismissed, it's removed from `_toasts` reactively. Vue's `<TransitionGroup>` or manual animation handles the exit.

**Verification**: Stacking offset calculation tests + visual demo.

---

## Phase 7: GooeyToast.vue (Core Component)

**Goal**: Port the 1350-line React `GooeyToast.tsx` to a Vue SFC.

This is the most complex step. The component manages:
- SVG morph animation (pill → blob → pill)
- Spring physics squish effects
- State machine (mount → expand → display → pre-dismiss → collapse)
- Error shake animation
- Hover re-expand
- Close button
- Progress bar
- Swipe-to-dismiss
- Action button with success morph-back

### Architecture decisions:

1. **Animation controllers** stored as plain variables (not refs) — same as React's `useRef` pattern. Avoids triggering reactivity on animation internals.

2. **`flush()` function** — direct DOM manipulation for SVG path and content constraints. Same approach as React — avoids reactive overhead on 60fps updates.

3. **`measure()` function** — reads DOM dimensions. Called via `onMounted`, `ResizeObserver`, and `watch` on props that affect layout.

4. **State machine** implemented via `watch()` on computed `isExpanded`:
   - `isExpanded` true → delay → `showBody = true` → morph 0→1
   - `isExpanded` false → morph 1→0 → `showBody = false`

5. **Timer logic** → `useToastTimer` composable

6. **Swipe logic** → `useSwipeToDismiss` composable

### Props (mirrors React `GooeyToastProps`):

```typescript
interface GooeyToastProps {
  toast: InternalToast    // full toast data from gooey-toast.ts
  toastId: string | number
}
```

### Emits:

```typescript
defineEmits<{
  dismiss: [id: string | number]
  heightChange: [id: string | number, height: number]
}>()
```

### Key implementation mapping (React → Vue):

| React | Vue |
|---|---|
| `useState(x)` | `ref(x)` |
| `useRef(x)` | `let x = y` (non-reactive) or `ref(x)` if template needs it |
| `useEffect(() => { ... }, [deps])` | `watch([deps], () => { ... })` or `watchEffect()` |
| `useLayoutEffect` | `onMounted` + `watch({ flush: 'pre' })` |
| `useCallback(fn, [deps])` | plain function (Vue doesn't re-create closures) |
| `useMemo(fn, [deps])` | `computed(fn)` |
| `AnimatePresence` + `motion.div` | `<Transition>` + manual opacity/transform |
| `animate(from, to, opts)` | `animate(from, to, opts)` from `motion` package (same API) |
| `sonnerToast.dismiss(id)` | `emit('dismiss', id)` |
| `subscribeContainerHovered(cb)` | `watch(containerHovered, cb)` |

### Section-by-section port:

**7a. Template refs & non-reactive state:**
- `wrapperRef`, `pathRef`, `headerRef`, `contentRef` → `useTemplateRef<HTMLDivElement>()` or `ref<HTMLElement | null>(null)`
- `morphTRef`, `aDims`, `dimsRef`, `expandedDimsRef` → plain `let` variables (non-reactive, only used in imperative animation code)
- Animation controllers (`morphCtrl`, `pillResizeCtrl`, etc.) → plain `let` variables

**7b. Reactive state:**
- `showBody`, `dismissing`, `hovered`, `actionSuccess`, `progressKey` → `ref()`
- `dims` (triggers effects) → `ref({ pw: 0, bw: 0, th: 0 })`

**7c. Computed:**
- `effectiveTitle`, `effectivePhase`, `effectiveDescription`, `effectiveAction` → `computed()`
- `isExpanded`, `isLoading`, `hasDescription`, `hasAction` → `computed()`
- `isRight`, `isCenter` → `computed()` reading from `_config`
- `useSpring`, `bounceVal`, `showProgress` → `computed()` merging props + presets + config

**7d. `flush()` and `measure()`:**
Direct copy from React. These are plain functions that read refs and write to DOM. No React/Vue dependency.

**7e. Morph animation (Phase 2 in React):**
`watch(showBody, (val) => { ... })` — drives morph 0→1 on true, 1→0 on false. Uses `animate()` from `motion` package.

**7f. Pre-dismiss timer:**
Delegate to `useToastTimer` composable.

**7g. Re-expand on hover:**
`watch([hovered, containerHovered], ...)` — if dismissing and now hovered, stop collapse, re-expand.

**7h. Error shake:**
`watch(() => props.toast.phase, (newPhase, oldPhase) => { ... })` — trigger shake animation on error transition.

**7i. Landing squish:**
`triggerLandingSquish()` — same imperative function, called from morph watchers.

**7j. Header elastic squish:**
`watch([showBody, dismissing, actionSuccess], ...)` — squish header during expand/collapse.

**7k. Icon transition:**
Replace `<AnimatePresence mode="wait"><motion.div>` with `<Transition mode="out-in">` using CSS opacity/scale.

**7l. Body content (description, action, timestamp):**
Replace `<AnimatePresence>` + `<motion.div>` with `<Transition>` components for fade-in/out.

**7m. Dismiss from container:**
Instead of `sonnerToast.dismiss(toastId)`, emit `dismiss` event. ToastContainer handles removal from `_toasts`.

**7n. Height reporting:**
On mount and after dimension changes, emit `heightChange` so ToastContainer can update stacking.

**Verification**: Component renders correctly, morph animations work, dismiss lifecycle completes.

---

## Phase 8: GooeyToaster.vue

**Goal**: Top-level provider component. Syncs props to `_config`, renders `<ToastContainer>` + `<AriaLiveAnnouncer>`.

### Props:
All `GooeyToasterProps` fields (same as React minus Sonner-specific ones).

### Implementation:

```vue
<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'
import { _config } from '../context'
import { gooeyToast, _getMostRecentActiveId } from '../gooey-toast'
import { animationPresets } from '../presets'
import type { GooeyToasterProps } from '../types'
import ToastContainer from './ToastContainer.vue'
import AriaLiveAnnouncer from './AriaLiveAnnouncer.vue'

const props = withDefaults(defineProps<GooeyToasterProps>(), {
  position: 'bottom-right',
  gap: 14,
  offset: '24px',
  theme: 'light',
  visibleToasts: 3,
  swipeToDismiss: true,
  closeOnEscape: true,
  maxQueue: Infinity,
  queueOverflow: 'drop-oldest',
  showProgress: false,
  closeButton: false,
  dir: 'ltr',
})

// Sync all props to reactive config
watch(() => props.position, (v) => { _config.position = v }, { immediate: true })
watch(() => props.dir, (v) => { _config.dir = v ?? 'ltr' }, { immediate: true })
watch(() => props.theme, (v) => { _config.theme = v }, { immediate: true })
// ... etc for all config fields

// Resolve spring/bounce from preset
const resolvedSpring = computed(() => props.spring ?? (props.preset ? animationPresets[props.preset]?.spring : undefined) ?? true)
const resolvedBounce = computed(() => props.bounce ?? (props.preset ? animationPresets[props.preset]?.bounce : undefined))

watch(resolvedSpring, (v) => { _config.spring = v }, { immediate: true })
watch(resolvedBounce, (v) => { _config.bounce = v }, { immediate: true })

// Escape key handler
onMounted(() => {
  const handler = (e: KeyboardEvent) => {
    if (!_config.closeOnEscape) return
    if (e.key === 'Escape') {
      const id = _getMostRecentActiveId()
      if (id != null) gooeyToast.dismiss(id)
    }
  }
  document.addEventListener('keydown', handler)
  onUnmounted(() => document.removeEventListener('keydown', handler))
})

// CSS detection warning (dev only)
onMounted(() => {
  if (import.meta.env.DEV) {
    const el = document.createElement('div')
    el.setAttribute('data-gooey-toast-css', '')
    el.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none'
    document.body.appendChild(el)
    const value = getComputedStyle(el).getPropertyValue('--gooey-toast')
    document.body.removeChild(el)
    if (!value) {
      console.warn('[gooey-toast] Styles not found. Import CSS:\n\n  import "goey-toast-vue/styles.css";\n')
    }
  }
})
</script>

<template>
  <ToastContainer
    :position="props.position"
    :gap="props.gap"
    :offset="props.offset"
    :theme="props.theme"
    :dir="props.dir ?? 'ltr'"
  />
  <AriaLiveAnnouncer />
</template>
```

**Verification**: Props sync to `_config`, Escape key dismisses toasts, CSS detection works.

---

## Phase 9: Public API + CSS

### Step 9.1: `src/index.ts`

```typescript
import './components/GooeyToast.css'

export { default as GooeyToaster } from './components/GooeyToaster.vue'
export { gooeyToast } from './gooey-toast'
export { animationPresets } from './presets'
export type { AnimationPreset, AnimationPresetName } from './presets'
export type {
  GooeyToastOptions,
  GooeyPromiseData,
  GooeyToasterProps,
  GooeyToastAction,
  GooeyToastClassNames,
  GooeyToastTimings,
  GooeyToastUpdateOptions,
  DismissFilter,
  ToastPosition,
} from './types'

// Backward-compatible aliases
export { default as GoeyToaster } from './components/GooeyToaster.vue'
export { gooeyToast as goeyToast } from './gooey-toast'
```

### Step 9.2: `src/components/GooeyToast.css`

Copy from React `GooeyToast.css`. Changes:
- **Remove** all Sonner-specific selectors:
  - `[data-sonner-toast]` rules (lines 12-18, 37-39)
  - `[data-sonner-toaster]` rules (lines 21-27)
  - `[data-x-position="center"]` rules
  - `[data-expanded="true"]` transition override
- **Add** ToastContainer positioning styles:

```css
/* Toast container — fixed position overlay */
.gooey-toast-container {
  position: fixed;
  z-index: 999999;
  pointer-events: none;
  list-style: none;
  margin: 0;
  padding: 0;
}

.gooey-toast-container > li {
  pointer-events: auto;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.3s ease;
}
```

- **Keep** everything else unchanged (wrapper, content, header, title colors, description, action buttons, progress bar, dark mode, close button, spinner)

**Verification**: CSS loads with `--gooey-toast: 1` detection marker intact.

---

## Phase 10: Tests

### Test file mapping (React → Vue):

| React test | Vue test | Notes |
|---|---|---|
| `gooey-toast.test.tsx` | `gooey-toast.test.ts` | No JSX — tests pure functions + reactive state |
| `GooeyToast.test.tsx` | `GooeyToast.test.ts` | Uses `@vue/test-utils` mount |
| `GooeyToaster.test.tsx` | `GooeyToaster.test.ts` | Uses `@vue/test-utils` mount |
| `AriaLiveAnnouncer.test.tsx` | `AriaLiveAnnouncer.test.ts` | Watch-based |
| `ToastErrorBoundary.test.tsx` | `ToastErrorBoundary.test.ts` | onErrorCaptured |
| `usePrefersReducedMotion.test.tsx` | `usePrefersReducedMotion.test.ts` | Composable test |
| — | `morph.test.ts` | **New** — pure function tests |
| — | `spring.test.ts` | **New** — pure function tests |
| — | `ToastContainer.test.ts` | **New** — stacking, positioning |

### Test approach:

**Pure function tests** (`morph.test.ts`, `spring.test.ts`):
- Test morph path at t=0 (pill), t=1 (full blob), intermediate values
- Test center morph path symmetry
- Test memoizePath caching
- Test squishSpring parameter ranges
- Snapshot SVG path strings for regression

**State management tests** (`gooey-toast.test.ts`):
- `createGooeyToast()` adds to `_toasts`
- Queue: 4th toast goes to queue when `visibleToasts=3`
- `dismissGooeyToast(id)` removes by ID
- `dismissGooeyToast({ type: 'error' })` removes by type filter
- `dismissGooeyToast()` clears all
- `updateGooeyToast()` mutates in-place
- Promise toast: loading → success transition
- Promise toast: loading → error transition
- Callbacks: `onDismiss` called on dismiss
- Callbacks: `onAutoClose` called on auto-dismiss, NOT on manual dismiss

**Component tests** (using `@vue/test-utils`):
- Mock `motion`'s `animate()` to return `{ stop: () => {} }`
- Mount with minimal props, verify renders
- Verify ARIA roles (status vs alert based on type)
- Verify description renders when provided
- Verify action button triggers callback

**Verification**: `npm run test` passes all tests.

---

## Phase 11: Build & Verify

### Step 11.1: Build

```bash
cd goey-toast-vue && npm run build
```

Verify output:
- `dist/index.js` (ESM)
- `dist/index.cjs` (CJS)
- `dist/index.d.ts` (types)
- `dist/style.css` (styles)

### Step 11.2: Type check

```bash
npm run typecheck
```

Must exit 0 with no errors.

### Step 11.3: Tests

```bash
npm run test
```

All tests pass.

### Step 11.4: Demo app (optional)

Create `goey-toast-vue/demo/` with a minimal Vite + Vue 3 app that imports the library and shows all toast types. This is for manual visual verification.

---

## Critical Implementation Notes

### What can be directly copied (zero changes):
- `presets.ts`
- `gooey-styles.ts`
- SVG morph math (`morphPathRaw`, `morphPathCenterRaw`)
- Spring physics (`squishSpring`)
- `SMOOTH_EASE`, `PH`, `DEFAULT_DISPLAY_DURATION`
- Icon SVG paths
- All CSS class names and most CSS rules
- `buildAnnouncementMessage()`, `getAnnouncePoliteness()`

### What requires architectural rewrite:
- `gooey-toast.ts` — completely different lifecycle (no Sonner, no React components)
- `ToastContainer.vue` — entirely new (replaces Sonner)
- `GooeyToast.vue` — same logic, different framework primitives
- `GooeyToaster.vue` — much simpler (no Sonner `<Toaster>`, no MutationObserver hacks)
- `context.ts` — reactive() replaces getter/setter/pub-sub pattern

### What is eliminated entirely:
- All `syncSonnerHeights()` code — not needed without Sonner
- `registerSonnerObserver()` — not needed without Sonner
- `GooeyToastWrapper` / `PromiseToastWrapper` React components — replaced by reactive data
- React StrictMode double-mount guards
- Sonner's `toast.custom()` / `toast.dismiss()` calls
- `toastOptions`, `richColors`, `expand` props (Sonner-specific)

### Risk areas:
1. **Animation timing parity** — Motion's `animate()` API should be identical to Framer Motion's standalone version, but verify spring parameter interpretation matches.
2. **ToastContainer stacking** — The most novel code (replaces Sonner). Needs careful height tracking and offset calculation.
3. **GooeyToast.vue complexity** — 1350 lines of animation logic. Port section by section, verify each animation works before moving to the next.
4. **Icon cross-fade** — `<Transition mode="out-in">` may not perfectly match `<AnimatePresence mode="wait">` timing. May need manual transition hooks.
