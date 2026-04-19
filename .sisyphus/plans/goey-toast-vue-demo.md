# goey-toast-vue Demo App

## TL;DR

> **Quick Summary**: Create a simplified functional demo app for `goey-toast-vue` that showcases all toast features through interactive examples and a real-time builder, mirroring the React demo's feature coverage without the marketing/changelog content.
> 
> **Deliverables**:
> - `goey-toast-vue/demo/` — standalone Vite + Vue 3 demo app
> - Examples section with 9 interactive button groups
> - Interactive Builder with real-time Vue code generation
> - Lightweight API docs with try-it buttons
> - Header navigation and responsive layout
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Task 1 (scaffold) → Task 2 (CSS) → Tasks 3-5 (parallel sections) → Task 6 (integration) → Task 7 (QA)

---

## Context

### Original Request
User asked to add a demo app to `goey-toast-vue`, similar to the React package's demo.

### Interview Summary
**Key Discussions**:
- **Scope**: Simplified functional version — Examples + Builder + lightweight Docs. No Changelog page, no Hero marketing, no OG metadata, no Vercel Analytics, no mascot animations.
- **Reference**: React demo at `goey-toast-react/demo/` (~1372 lines App.tsx, ~1579 lines App.css)

**Research Findings**:
- React demo uses `file:..` dependency + Vite alias for local source resolution
- React Builder generates JSX code; Vue version must generate `<template>` syntax
- Vue uses `motion` (not `framer-motion`) as peer dependency
- Vue `description` field takes `VNode` instead of `ReactNode`
- React demo CSS design system (variables, layout, components) is framework-agnostic and can be reused almost entirely

---

## Work Objectives

### Core Objective
Create a working demo app at `goey-toast-vue/demo/` that lets developers interactively explore all `goey-toast-vue` features.

### Concrete Deliverables
- `goey-toast-vue/demo/package.json` — private Vite app with `file:..` dependency
- `goey-toast-vue/demo/vite.config.ts` — Vue plugin + local source alias
- `goey-toast-vue/demo/index.html` — minimal entry point
- `goey-toast-vue/demo/tsconfig*.json` — TypeScript configs
- `goey-toast-vue/demo/src/main.ts` — app mount
- `goey-toast-vue/demo/src/App.vue` — main app shell (header + router-like page switching)
- `goey-toast-vue/demo/src/components/ExamplesSection.vue` — 9 button groups
- `goey-toast-vue/demo/src/components/BuilderSection.vue` — interactive config panel + code gen
- `goey-toast-vue/demo/src/components/DocsSection.vue` — lightweight API reference
- `goey-toast-vue/demo/src/components/AppHeader.vue` — sticky header with nav
- `goey-toast-vue/demo/src/App.css` — design system (ported from React)

### Definition of Done
- [ ] `cd goey-toast-vue/demo && npm install && npm run dev` starts without errors
- [ ] `cd goey-toast-vue/demo && npm run build` succeeds with zero errors
- [ ] All 9 example button groups fire working toasts
- [ ] Builder generates correct Vue template code
- [ ] Docs section renders with try-it buttons that fire toasts

### Must Have
- All 5 toast types (default, success, error, warning, info) demonstrated
- Promise toast examples (success + error outcomes)
- Toast update example
- Action button with successLabel example
- Description (string + VNode) examples
- Interactive Builder with all controls from React version
- Generated code shows Vue syntax (`<GooeyToaster />` + `gooeyToast.xxx()`)
- Progress bar, close button, theme, spring/bounce, preset controls
- `file:..` local dependency for development
- Vite alias to local source when `../src/index.ts` exists
- Pin `vue` and `motion` to local `node_modules` to avoid duplicate instances

### Must NOT Have (Guardrails)
- No Changelog page
- No Hero marketing section (install command, mascot animation, "buy me a coffee")
- No `@vercel/analytics` or OG metadata
- No mascot squish/landing animations
- No shadcn/ui documentation section
- No React-specific patterns (useState, useEffect, JSX)
- No new public API invented for the Vue package
- No modifications to `goey-toast-vue/src/` source files
- No excessive comments or over-documentation in code

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: N/A (demo app, not library)
- **Automated tests**: None (demo app)
- **Framework**: N/A

### QA Policy
Every task includes agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright — Navigate, interact, assert DOM, screenshot
- **Build verification**: Use Bash — `npm run build`, `npm run dev`, typecheck

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — scaffold + CSS):
├── Task 1: Project scaffolding (package.json, vite.config.ts, tsconfig, index.html, main.ts) [quick]
├── Task 2: CSS design system port (App.css from React) [quick]

Wave 2 (After Wave 1 — parallel component development, MAX PARALLEL):
├── Task 3: ExamplesSection.vue — 9 button groups (depends: 1, 2) [unspecified-high]
├── Task 4: BuilderSection.vue — interactive config + Vue code gen (depends: 1, 2) [deep]
├── Task 5: DocsSection.vue — lightweight API reference (depends: 1, 2) [unspecified-high]

Wave 3 (After Wave 2 — integration + polish):
├── Task 6: App.vue shell + AppHeader.vue + wiring (depends: 3, 4, 5) [unspecified-high]
├── Task 7: Build verification + visual QA (depends: 6) [unspecified-high]

Wave FINAL (After ALL tasks — 4 parallel reviews, then user okay):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
└── Task F4: Scope fidelity check (deep)
-> Present results -> Get explicit user okay
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | 3, 4, 5, 6 | 1 |
| 2 | — | 3, 4, 5, 6 | 1 |
| 3 | 1, 2 | 6 | 2 |
| 4 | 1, 2 | 6 | 2 |
| 5 | 1, 2 | 6 | 2 |
| 6 | 3, 4, 5 | 7 | 3 |
| 7 | 6 | F1-F4 | 3 |

### Agent Dispatch Summary

- **Wave 1**: 2 tasks — T1 → `quick`, T2 → `quick`
- **Wave 2**: 3 tasks — T3 → `unspecified-high`, T4 → `deep`, T5 → `unspecified-high`
- **Wave 3**: 2 tasks — T6 → `unspecified-high`, T7 → `unspecified-high`
- **FINAL**: 4 tasks — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

- [x] 1. Project Scaffolding

  **What to do**:
  - Create `goey-toast-vue/demo/` directory structure
  - Create `package.json` with:
    - `"name": "demo"`, `"private": true`, `"type": "module"`
    - Scripts: `dev` (vite), `build` (vue-tsc -b && vite build), `preview` (vite preview)
    - Dependencies: `"goey-toast-vue": "file:.."`, `"vue": "^3.5.0"`, `"motion": "^11.0.0"`
    - DevDependencies: `"@vitejs/plugin-vue": "^5.0.0"`, `"typescript": "^5.9.0"`, `"vite": "^6.0.0"`, `"vue-tsc": "^2.0.0"`
  - Create `vite.config.ts`:
    - Import `@vitejs/plugin-vue`
    - Alias `goey-toast-vue` to `../src/index.ts` when it exists (same pattern as React demo)
    - Alias `goey-toast-vue/styles.css` to `../src/gooey-toast.css` when local source exists
    - Pin `vue` and `motion` to `path.resolve(__dirname, 'node_modules/vue')` and `node_modules/motion`
  - Create `index.html`: minimal HTML5 with `<div id="app">`, Google Fonts link (Bricolage Grotesque, DM Sans, JetBrains Mono), `<script type="module" src="/src/main.ts">`
  - Create `tsconfig.json` with project references pattern (same as React demo):
    - `tsconfig.app.json`: target ES2022, strict, `jsx: "preserve"`, include `src`
    - `tsconfig.node.json`: target ES2023, include `vite.config.ts`
  - Create `src/main.ts`: `createApp(App).mount('#app')` with CSS imports
  - Create placeholder `src/App.vue` with `<template><div>Demo loading...</div></template>`

  **Must NOT do**:
  - Do not add `@vercel/analytics` or any tracking
  - Do not add OG metadata or favicon references
  - Do not modify any files in `goey-toast-vue/src/`

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Boilerplate project setup with known patterns
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `playwright`: Not needed for scaffolding

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Tasks 3, 4, 5, 6
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `goey-toast-react/demo/package.json` — Dependency structure, scripts pattern, `file:..` local dependency
  - `goey-toast-react/demo/vite.config.ts` — Local source alias pattern (lines 6-25), pinning deps to local node_modules
  - `goey-toast-react/demo/tsconfig.json` — Project references structure
  - `goey-toast-react/demo/tsconfig.app.json` — Compiler options for app code
  - `goey-toast-react/demo/tsconfig.node.json` — Compiler options for vite config
  - `goey-toast-react/demo/index.html` — Google Fonts link (line 21), minimal structure
  - `goey-toast-react/demo/src/main.tsx` — App mount pattern

  **API/Type References**:
  - `goey-toast-vue/package.json` — Package name `goey-toast-vue`, peer deps `vue >=3.3.0`, `motion >=11.0.0`
  - `goey-toast-vue/src/index.ts` — Public exports: `GooeyToaster`, `gooeyToast`, `animationPresets`, types
  - `goey-toast-vue/vite.config.ts` — Existing library build config (reference, not to modify)

  **WHY Each Reference Matters**:
  - React demo's `package.json` shows the exact `file:..` pattern and scripts to mirror
  - React demo's `vite.config.ts` shows the local source alias trick — Vue version must do the same but with `goey-toast-vue` paths and `vue`/`motion` instead of `react`/`framer-motion`
  - Vue package's `index.ts` is the entry point to alias to
  - `gooey-toast.css` is the stylesheet to alias for `goey-toast-vue/styles.css`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Project installs successfully
    Tool: Bash
    Preconditions: goey-toast-vue package has been built (cd goey-toast-vue && npm run build)
    Steps:
      1. cd goey-toast-vue/demo && npm install
      2. Verify exit code is 0
      3. Verify node_modules/goey-toast-vue is a symlink to ..
    Expected Result: npm install completes without errors
    Failure Indicators: Non-zero exit code, missing peer dependencies warnings
    Evidence: .sisyphus/evidence/task-1-npm-install.txt

  Scenario: Vite dev server starts
    Tool: Bash
    Preconditions: npm install completed
    Steps:
      1. cd goey-toast-vue/demo && timeout 10 npm run dev || true
      2. Check output contains "Local:" URL
    Expected Result: Vite starts and shows local URL
    Failure Indicators: Build errors, missing module errors
    Evidence: .sisyphus/evidence/task-1-dev-server.txt

  Scenario: TypeScript compiles without errors
    Tool: Bash
    Preconditions: npm install completed
    Steps:
      1. cd goey-toast-vue/demo && npx vue-tsc --noEmit
    Expected Result: Exit code 0, no type errors
    Failure Indicators: Type errors in output
    Evidence: .sisyphus/evidence/task-1-typecheck.txt
  ```

  **Commit**: YES (group with Task 2)
  - Message: `feat(demo): scaffold Vue demo app`
  - Files: `goey-toast-vue/demo/package.json`, `goey-toast-vue/demo/vite.config.ts`, `goey-toast-vue/demo/index.html`, `goey-toast-vue/demo/tsconfig*.json`, `goey-toast-vue/demo/src/main.ts`, `goey-toast-vue/demo/src/App.vue`
  - Pre-commit: `cd goey-toast-vue/demo && npm install && npx vue-tsc --noEmit`

- [x] 2. CSS Design System Port

  **What to do**:
  - Create `goey-toast-vue/demo/src/App.css` by copying `goey-toast-react/demo/src/App.css` as the base
  - Remove React-specific sections that won't be used:
    - Changelog page styles (`.page-changelog`, `.changelog-*`) — no changelog in Vue demo
    - Hero mascot animation (`.hero-mascot`, `@keyframes squish`, `.hero-title--landing`, `.hero-mascot--landing`) — no hero section
    - Header mascot styles (`.header-mascot`, `.header--hero-hidden .header-mascot`, `@keyframes mascot-land`) — no mascot
    - Header hero-hidden transform (`.header--hero-hidden .header-logo`, `@keyframes header-text-in`) — no hero intersection observer
  - Keep ALL of these (they're used by Examples + Builder + Docs):
    - CSS variables (`:root`)
    - Scrollbar theme
    - Base body/root styles
    - Site header (`.site-header`, `.header-inner`, `.header-logo`, `.header-nav`, `.nav-link`, `.header-icons`, `.header-icon-link`, mobile menu)
    - Two-column layout (`.two-col`)
    - Examples section (`.examples`, `.examples-header`, `.section`, `.section-label`, `.buttons`, `button`)
    - Builder playground (ALL `.builder-*`, `.type-pills`, `.type-pill`, `.toggle*`, `.slider*`, `.fire-btn`, `.builder-code`, `.code-copy-btn`)
    - Documentation (`.docs`, `.docs-header`, `.doc-section*`, `.inline-code`, `pre`, `code`, `.prop-table`, `.table-scroll`, `.doc-try-buttons`)
    - Footer (`.site-footer`)
    - Responsive breakpoints
  - Create empty `goey-toast-vue/demo/src/index.css` (same as React — empty file)

  **Must NOT do**:
  - Do not redesign the CSS — keep the same visual identity
  - Do not add new CSS frameworks (Tailwind, etc.)
  - Do not remove utility styles that might be used in Docs section

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Mostly copy + targeted removal, no creative CSS work
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Tasks 3, 4, 5, 6
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `goey-toast-react/demo/src/App.css` (full file, 1579 lines) — Source CSS to port. Framework-agnostic design system.
  - `goey-toast-react/demo/src/index.css` — Empty file (just copy pattern)

  **WHY Each Reference Matters**:
  - The React CSS is the entire visual design. It uses zero React-specific constructs (no CSS modules, no styled-components). The variables, classes, and responsive breakpoints work identically in Vue.
  - The sections to REMOVE are identified by class name prefixes that correspond to excluded features (changelog, hero mascot).

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: CSS file exists and has correct structure
    Tool: Bash
    Preconditions: File created
    Steps:
      1. Verify goey-toast-vue/demo/src/App.css exists
      2. grep for ":root" — CSS variables must be present
      3. grep for ".builder-card" — Builder styles must be present
      4. grep for ".doc-section" — Docs styles must be present
      5. grep -c ".page-changelog" — Must return 0 (removed)
      6. grep -c ".hero-mascot" — Must return 0 (removed)
    Expected Result: All kept styles present, all removed styles absent
    Failure Indicators: Missing builder/docs styles, or presence of changelog/mascot styles
    Evidence: .sisyphus/evidence/task-2-css-audit.txt
  ```

  **Commit**: YES (group with Task 1)
  - Message: `feat(demo): scaffold Vue demo app`
  - Files: `goey-toast-vue/demo/src/App.css`, `goey-toast-vue/demo/src/index.css`

- [x] 3. ExamplesSection.vue — Interactive Example Buttons

  **What to do**:
  - Create `goey-toast-vue/demo/src/components/ExamplesSection.vue`
  - Port ALL 9 example groups from React demo `App.tsx` lines 516-651:
    1. **Toast Types**: 5 buttons (Default, Success, Error, Warning, Info) calling `gooeyToast()`, `gooeyToast.success()`, etc.
    2. **With Description**: 2 buttons (Warning + Description, Error + Description) with string descriptions
    3. **With Action Button**: 2 buttons (Error + Action, Action + Success Pill) with `action.successLabel`
    4. **Custom Component Body**: 1 button firing `gooeyToast.success()` with VNode description (deployment details table)
    5. **No Spring (Smooth Easing)**: 3 buttons with `spring: false`
    6. **Promise (Morph Animation)**: 4 buttons — promise+success pill, promise+error pill, promise+error expanded, promise+success expanded
    7. **Update Toast**: 1 button that creates a toast with spinner icon, then calls `gooeyToast.update()` after 2s
    8. **Progress Bar**: 1 button with `showProgress: true`
    9. **Callbacks**: 1 button with `onDismiss` that fires a follow-up toast
  - Use shared `DEMO_DEFAULTS` constant: `{ spring: true, bounce: 0.3, timing: { displayDuration: 5000 } }`
  - For the **Custom Component Body** example, use Vue's `h()` function to create VNode description:
    ```ts
    import { h } from 'vue'
    // Then in the click handler:
    description: h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '300px' } }, [
      h('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '12px' } }, [
        h('span', { style: { color: '#888' } }, 'Environment'),
        h('span', { style: { fontWeight: 600 } }, 'Production'),
      ]),
      // ... same structure as React version
    ])
    ```
  - For the **Update Toast** spinner icon, use an inline SVG string or `h()` VNode with CSS animation `gooey-spin`
  - Helper functions: `sleep(ms)` and `failAfter(ms)` — same as React demo

  **Must NOT do**:
  - Do not use React-specific patterns (JSX, useState)
  - Do not add examples not present in the React demo
  - Do not skip any of the 9 example groups

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Multiple interactive patterns to port, VNode adaptation needed
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 5)
  - **Blocks**: Task 6
  - **Blocked By**: Tasks 1, 2

  **References**:

  **Pattern References**:
  - `goey-toast-react/demo/src/App.tsx:516-651` — All 9 example groups with exact toast configurations, titles, descriptions, action labels
  - `goey-toast-react/demo/src/App.tsx:90-100` — `DEMO_DEFAULTS`, `TOAST_TYPES`, `POSITIONS`, `PRESET_NAMES` constants
  - `goey-toast-react/demo/src/App.tsx:11-17` — `sleep()` and `failAfter()` helper functions
  - `goey-toast-react/demo/src/App.tsx:560-583` — Custom ReactNode description pattern (deployment details) — must be adapted to Vue VNode

  **API/Type References**:
  - `goey-toast-vue/src/index.ts` — Public API: `gooeyToast`, `animationPresets`
  - `goey-toast-vue/src/types.ts` — `GooeyToastOptions`, `GooeyToasterProps`, `AnimationPresetName`
  - `goey-toast-vue/src/gooey-toast.ts` — `gooeyToast` function signatures (`.success`, `.error`, `.warning`, `.info`, `.promise`, `.update`, `.dismiss`)

  **WHY Each Reference Matters**:
  - React App.tsx lines 516-651 contain the EXACT toast configurations (titles, descriptions, action configs) to replicate
  - The VNode adaptation for Custom Component Body is the only non-trivial change — Vue uses `h()` instead of JSX
  - The `gooeyToast` API is identical between React and Vue, so method calls translate 1:1

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: All 9 example groups render buttons
    Tool: Playwright
    Preconditions: Dev server running at localhost
    Steps:
      1. Navigate to demo page
      2. Scroll to Examples section
      3. Count button groups by .section class
      4. Verify each group has correct label: "Toast Types", "With Description", "With Action Button", "Custom Component Body", "No Spring (Smooth Easing)", "Promise (Morph Animation)", "Update Toast", "Progress Bar", "Callbacks"
    Expected Result: 9 section groups with correct labels, each containing buttons
    Failure Indicators: Missing sections, wrong labels, no buttons
    Evidence: .sisyphus/evidence/task-3-examples-render.png

  Scenario: Toast Types buttons fire correct toasts
    Tool: Playwright
    Preconditions: Dev server running, GooeyToaster rendered
    Steps:
      1. Click "Default" button
      2. Wait 500ms, verify toast appears with text "Notification received"
      3. Click "Success" button
      4. Wait 500ms, verify toast appears with text "Changes Saved"
      5. Click "Error" button
      6. Wait 500ms, verify toast appears with text "Something went wrong"
    Expected Result: Each button fires a toast with the correct title
    Failure Indicators: No toast appears, wrong toast text
    Evidence: .sisyphus/evidence/task-3-toast-types.png

  Scenario: Promise toast transitions correctly
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Click "Promise + Success (pill)" button
      2. Verify toast shows "Saving..." text initially
      3. Wait 2500ms
      4. Verify toast transitions to show "Changes Saved"
    Expected Result: Toast transitions from loading to success state
    Failure Indicators: Toast stays in loading state, no transition
    Evidence: .sisyphus/evidence/task-3-promise-toast.png
  ```

  **Commit**: YES (group with Tasks 4, 5)
  - Message: `feat(demo): add examples, builder, and docs sections`
  - Files: `goey-toast-vue/demo/src/components/ExamplesSection.vue`

- [x] 4. BuilderSection.vue — Interactive Configuration Panel

  **What to do**:
  - Create `goey-toast-vue/demo/src/components/BuilderSection.vue`
  - Port the full interactive builder from React demo `App.tsx` lines 654-956
  - **Reactive state** (Vue `ref()` equivalents of React's useState):
    - `bPosition`: `ref<GooeyToasterProps['position']>('top-left')`
    - `bType`: `ref<ToastType>('success')`
    - `bTitle`: `ref('Changes saved')`
    - `bHasDesc`: `ref(true)`, `bDesc`: `ref('Your changes have been saved and synced successfully.')`
    - `bHasAction`: `ref(false)`, `bActionLabel`: `ref('Undo')`
    - `bFillColor`: `ref('#ffffff')`, `bHasBorder`: `ref(false)`, `bBorderColor`: `ref('#E0E0E0')`, `bBorderWidth`: `ref(1.5)`
    - `bDisplayDuration`: `ref(4000)`
    - `bSpring`: `ref(true)`, `bBounce`: `ref(0.4)`
    - `bPreset`: `ref<AnimationPresetName | null>(null)`
    - `bTheme`: `ref<'light' | 'dark'>('light')`
    - `bShowProgress`: `ref(false)`, `bCloseOnEscape`: `ref(true)`, `bShowTimestamp`: `ref(true)`
    - `bCloseButton`: `ref<boolean | 'top-left' | 'top-right'>(false)`
  - **Builder controls** (all same as React):
    - Position: 6 pill buttons
    - Type: 5 pill buttons (default, success, error, warning, info)
    - Title: text input
    - Description: toggle + textarea
    - Action Button: toggle + text input
    - Style: fill color picker + border toggle with color picker + width slider
    - Timing: display duration slider (1000-20000ms)
    - Animation Preset: 4 pill buttons (smooth, bouncy, subtle, snappy) — toggleable
    - Spring Effect: toggle + bounce slider (0.05-0.8)
    - Theme: light/dark pills
    - Show Progress: toggle
    - Close on Escape: toggle
    - Show Timestamp: toggle
    - Close Button: toggle + position pills (top-left, top-right)
    - Fire Toast button
  - **`fireBuilderToast()` function**: Build `GooeyToastOptions` from state and call appropriate `gooeyToast[type]()` — same logic as React `App.tsx:174-199`
  - **`generatedCode` computed**: Generate Vue template code (NOT React JSX):
    ```
    <GooeyToaster position="top-left" />

    gooeyToast.success('Changes saved', {
      description: 'Your changes have been saved...',
      bounce: 0.3,
    })
    ```
    Key difference from React: `<GooeyToaster>` uses same syntax but props should match Vue conventions. The generated code is just a string showing usage — not actual Vue template compilation.
  - **Code copy button**: Same `useCopy` pattern adapted to Vue composable or inline ref+setTimeout
  - **Emit toaster config**: The Builder needs to communicate its `bPosition`, `bTheme`, `bShowProgress`, `bCloseOnEscape`, `bCloseButton` to the parent App.vue so the `<GooeyToaster>` component can be configured. Use `defineEmits` or `v-model` pattern. Alternative: expose these via a shared reactive object.

  **Must NOT do**:
  - Do not generate React JSX in the code output — must be Vue-compatible syntax
  - Do not add builder controls not present in the React version
  - Do not use external state management (Pinia, Vuex)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Complex stateful component with many reactive variables, computed code generation, and parent communication. The code generation logic is the most intricate part.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 5)
  - **Blocks**: Task 6
  - **Blocked By**: Tasks 1, 2

  **References**:

  **Pattern References**:
  - `goey-toast-react/demo/src/App.tsx:133-153` — All builder state variables (useState declarations)
  - `goey-toast-react/demo/src/App.tsx:174-199` — `fireBuilderToast()` function logic
  - `goey-toast-react/demo/src/App.tsx:201-249` — `generatedCode` computation (the code string builder)
  - `goey-toast-react/demo/src/App.tsx:654-956` — Full builder template/JSX (all controls, pills, toggles, sliders, fire button, code block)
  - `goey-toast-react/demo/src/App.tsx:80-88` — `useCopy` hook (copy to clipboard with timeout reset)

  **API/Type References**:
  - `goey-toast-vue/src/types.ts` — `GooeyToasterProps`, `GooeyToastOptions`, `AnimationPresetName`
  - `goey-toast-vue/src/presets.ts` — `animationPresets` object (used when selecting a preset to sync spring/bounce values)

  **WHY Each Reference Matters**:
  - React lines 133-153 define ALL state variables — must be translated to `ref()` 1:1
  - React lines 201-249 contain the code generation algorithm — the most complex logic to port. Must change output from JSX to Vue template syntax
  - React lines 654-956 are the actual template — CSS classes and data attributes (`data-type`, `data-active`) can be reused directly since they're in App.css
  - The `animationPresets` import is used in the preset pill click handler to sync spring/bounce values

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: All builder controls render
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to Builder section
      2. Verify Position pills: 6 buttons (top-left through bottom-right)
      3. Verify Type pills: 5 buttons
      4. Verify Title input field exists
      5. Verify Description toggle exists
      6. Verify Action Button toggle exists
      7. Verify Fill Color picker exists
      8. Verify Display Duration slider exists
      9. Verify Animation Preset pills: 4 buttons
      10. Verify Spring Effect toggle + bounce slider
      11. Verify Theme pills: 2 buttons (light, dark)
      12. Verify Show Progress toggle
      13. Verify Close on Escape toggle
      14. Verify Show Timestamp toggle
      15. Verify Close Button toggle
      16. Verify Fire Toast button with class .fire-btn
    Expected Result: All 15+ controls rendered correctly
    Failure Indicators: Missing controls, wrong labels
    Evidence: .sisyphus/evidence/task-4-builder-controls.png

  Scenario: Fire Toast button triggers correct toast
    Tool: Playwright
    Preconditions: Dev server running, builder at default state
    Steps:
      1. Click Fire Toast button (selector: .fire-btn)
      2. Wait 500ms
      3. Verify a success toast appears with title "Changes saved"
    Expected Result: Toast fires with builder-configured options
    Failure Indicators: No toast, wrong type, wrong title
    Evidence: .sisyphus/evidence/task-4-fire-toast.png

  Scenario: Generated code updates reactively
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Find the code block in .builder-code pre
      2. Verify it contains 'gooeyToast.success'
      3. Click the "error" type pill
      4. Verify code block now contains 'gooeyToast.error'
      5. Toggle Description off
      6. Verify code block no longer contains 'description:'
    Expected Result: Code block updates in real-time as controls change
    Failure Indicators: Code doesn't update, shows stale values
    Evidence: .sisyphus/evidence/task-4-code-gen.png

  Scenario: Code shows Vue syntax, not React
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Read the generated code from .builder-code pre
      2. Verify it contains '<GooeyToaster' (Vue component syntax)
      3. Verify it does NOT contain 'React' or 'jsx' or 'className'
    Expected Result: Generated code is valid Vue usage
    Failure Indicators: React JSX patterns in output
    Evidence: .sisyphus/evidence/task-4-vue-syntax.txt
  ```

  **Commit**: YES (group with Tasks 3, 5)
  - Message: `feat(demo): add examples, builder, and docs sections`
  - Files: `goey-toast-vue/demo/src/components/BuilderSection.vue`

- [x] 5. DocsSection.vue — Lightweight API Reference

  **What to do**:
  - Create `goey-toast-vue/demo/src/components/DocsSection.vue`
  - Port a SUBSET of the React demo docs (not all 12 sections). Include these:
    1. **Quick Start** (section 01): Show Vue usage with `<script setup>` syntax:
       ```vue
       <script setup>
       import { GooeyToaster, gooeyToast } from 'goey-toast-vue'
       import 'goey-toast-vue/styles.css'
       </script>
       <template>
         <GooeyToaster position="bottom-right" />
         <button @click="gooeyToast.success('Saved!')">Save</button>
       </template>
       ```
    2. **Toast Types** (section 02): Code examples + try-it buttons for all 5 types
    3. **Description** (section 03): String + VNode examples
    4. **Action Button** (section 04): With successLabel example + try-it buttons
    5. **Promise Toasts** (section 05): Code example + try-it buttons
    6. **Toaster Props** (section 06): Full props table (same as React section 08)
    7. **Options** (section 07): Full options table (same as React section 09)
    8. **Methods** (section 08): dismiss, update, DismissFilter — code examples
    9. **Custom Styling** (section 09): fillColor, borderColor, classNames example + try-it button
    10. **Spring Animation** (section 10): spring: false example + try-it buttons
  - SKIP these React-only sections:
    - shadcn/ui (section 02 in React) — not applicable to Vue
    - Timings table (section 07 in React) — redundant with Options table
  - All try-it buttons should call `gooeyToast.*()` with `DEMO_DEFAULTS` spread
  - Use the same CSS classes as React (`.docs`, `.docs-header`, `.doc-section`, `.doc-section-label`, `.doc-section-content`, `.doc-number`, `.inline-code`, `.prop-table`, `.table-scroll`, `.doc-try-buttons`)
  - Code examples should show Vue syntax, not React JSX
  - Where React docs say `ReactNode`, Vue docs should say `VNode | string`
  - Import `DEMO_DEFAULTS` and helpers (`sleep`, `failAfter`) from a shared constants file, or define locally

  **Must NOT do**:
  - Do not include shadcn/ui section
  - Do not show React import paths or JSX syntax in code examples
  - Do not add documentation sections not in the React demo

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Heavy template work with tables, code blocks, and try-it buttons
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 4)
  - **Blocks**: Task 6
  - **Blocked By**: Tasks 1, 2

  **References**:

  **Pattern References**:
  - `goey-toast-react/demo/src/App.tsx:961-1356` — Full docs section (all 12 subsections) — port 10 of them
  - `goey-toast-react/demo/src/App.tsx:967-994` — Quick Start section (adapt to Vue syntax)
  - `goey-toast-react/demo/src/App.tsx:1160-1228` — Toaster Props and Options tables (reuse column structure, adapt types)
  - `goey-toast-react/demo/src/App.tsx:1230-1276` — Methods section (dismiss, update, DismissFilter)

  **API/Type References**:
  - `goey-toast-vue/src/types.ts` — All type definitions for accurate docs tables
  - `goey-toast-vue/src/index.ts` — Exact import paths to show in Quick Start

  **WHY Each Reference Matters**:
  - React docs lines define the exact content, table columns, and code examples to adapt
  - Vue types.ts is needed to ensure prop/option tables are accurate for the Vue package
  - Quick Start must show the correct Vue import path (`goey-toast-vue`) and `<script setup>` pattern

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: All 10 doc sections render
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Scroll to Docs section
      2. Count .doc-section elements
      3. Verify section numbers 01 through 10 exist
      4. Verify Quick Start section contains '<script setup>'
      5. Verify no section mentions 'shadcn' or 'React'
    Expected Result: 10 documentation sections rendered with Vue-specific content
    Failure Indicators: Missing sections, React-specific content
    Evidence: .sisyphus/evidence/task-5-docs-render.png

  Scenario: Try-it buttons fire toasts
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Find .doc-try-buttons in Toast Types section
      2. Click "Success" try-it button
      3. Wait 500ms, verify toast appears
    Expected Result: Try-it buttons fire working toasts
    Failure Indicators: Buttons don't work, no toast appears
    Evidence: .sisyphus/evidence/task-5-docs-try-buttons.png

  Scenario: Props and Options tables render correctly
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Find .prop-table elements
      2. Verify at least 2 tables exist (Toaster Props + Options)
      3. Verify "position" prop is listed in Toaster Props table
      4. Verify "description" option is listed in Options table
    Expected Result: Both tables render with correct data
    Failure Indicators: Missing tables, empty cells, wrong prop names
    Evidence: .sisyphus/evidence/task-5-docs-tables.png
  ```

  **Commit**: YES (group with Tasks 3, 4)
  - Message: `feat(demo): add examples, builder, and docs sections`
  - Files: `goey-toast-vue/demo/src/components/DocsSection.vue`

- [x] 6. App Shell + Header + Wiring

  **What to do**:
  - Create `goey-toast-vue/demo/src/components/AppHeader.vue`:
    - Sticky header with logo text "gooey-toast-vue" (no mascot, no gradient animation)
    - Nav links: Examples, Builder, Docs (scroll-to-section via `document.getElementById().scrollIntoView()`)
    - GitHub icon link → `https://github.com/anl331/goey-toast` (or appropriate Vue repo URL)
    - npm icon link → `https://www.npmjs.com/package/goey-toast-vue`
    - Mobile menu (hamburger) with same toggle pattern as React
    - Use same CSS classes: `.site-header`, `.header-inner`, `.header-logo`, `.header-nav`, `.nav-link`, `.header-icons`, `.header-icon-link`, `.mobile-menu-btn`, `.mobile-menu`, `.mobile-menu-link`
    - SVG icon components: GithubIcon, NpmIcon, MenuIcon, CloseIcon — define inline in the component or as small child components
  - Update `goey-toast-vue/demo/src/App.vue`:
    - Import and render: `AppHeader`, `ExamplesSection`, `BuilderSection`, `DocsSection`
    - Import `GooeyToaster` from `goey-toast-vue` and `'goey-toast-vue/styles.css'`
    - Import `./App.css`
    - Place `<GooeyToaster>` at root level with dynamic props from Builder
    - Communication pattern between Builder → App → GooeyToaster:
      - Option A (recommended): Builder emits config changes, App passes them as props to GooeyToaster
      - Option B: Shared reactive object (provide/inject)
      - Choose the simpler option — likely `defineEmits` with `@update:config` pattern
    - Two-column layout: Examples (left, sticky) + Builder (right) in a `.two-col` div, with `id="examples"` and `id="builder"` for scroll-to
    - Docs section below the two-col area with `id="docs"`
    - Footer: Simple text with link to gooey-search-tabs (same as React)
  - Wire scroll-to navigation:
    - Header nav buttons call `scrollTo(id)` which does `document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })`
  - Mobile menu toggle: `ref(false)` for `mobileMenuOpen`

  **Must NOT do**:
  - No mascot image/animation
  - No hero section
  - No intersection observer for hero visibility
  - No changelog page routing
  - No `@vercel/analytics`

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Integration task wiring multiple components together with cross-component communication
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (sequential, depends on all Wave 2 outputs)
  - **Blocks**: Task 7
  - **Blocked By**: Tasks 3, 4, 5

  **References**:

  **Pattern References**:
  - `goey-toast-react/demo/src/App.tsx:251-309` — Header/nav structure, mobile menu toggle, scrollTo function
  - `goey-toast-react/demo/src/App.tsx:19-68` — SVG icon components (GithubIcon, NpmIcon, CopyIcon, MenuIcon, CloseIcon)
  - `goey-toast-react/demo/src/App.tsx:251-261` — GooeyToaster placement with dynamic builder props
  - `goey-toast-react/demo/src/App.tsx:513-958` — Two-column layout structure (examples left, builder right)
  - `goey-toast-react/demo/src/App.tsx:1360-1368` — Footer markup

  **API/Type References**:
  - `goey-toast-vue/src/index.ts` — `GooeyToaster` component import
  - `goey-toast-vue/src/types.ts` — `GooeyToasterProps` for typing the config object

  **WHY Each Reference Matters**:
  - React lines 251-309 define the header structure and scroll behavior — CSS classes must match exactly for styling to work
  - React lines 251-261 show how GooeyToaster receives dynamic props from builder state — Vue version needs same wiring
  - SVG icons are small inline components that can be copied directly into Vue SFC

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Full app renders with all sections
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to localhost
      2. Verify header exists with "gooey-toast-vue" text
      3. Verify Examples section exists
      4. Verify Builder section exists
      5. Verify Docs section exists
      6. Verify footer exists
    Expected Result: Complete page with header, examples, builder, docs, footer
    Failure Indicators: Missing sections, blank page, import errors
    Evidence: .sisyphus/evidence/task-6-full-app.png

  Scenario: Nav scroll-to works
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Click "Docs" nav link in header
      2. Wait 500ms
      3. Verify Docs section is in viewport (scrolled to)
    Expected Result: Page smoothly scrolls to Docs section
    Failure Indicators: No scroll, wrong section
    Evidence: .sisyphus/evidence/task-6-nav-scroll.png

  Scenario: Builder config flows to GooeyToaster
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. In Builder, click "dark" theme pill
      2. Fire a toast via Fire Toast button
      3. Verify the toast renders with dark theme styling
      4. In Builder, click "bottom-left" position pill
      5. Fire another toast
      6. Verify toast appears in bottom-left area
    Expected Result: GooeyToaster respects builder configuration changes
    Failure Indicators: Toast ignores builder settings
    Evidence: .sisyphus/evidence/task-6-config-flow.png

  Scenario: Mobile menu toggles
    Tool: Playwright
    Preconditions: Dev server running, viewport set to 375x667
    Steps:
      1. Verify .mobile-menu-btn is visible
      2. Click hamburger button
      3. Verify .mobile-menu is visible with nav links
      4. Click hamburger button again
      5. Verify .mobile-menu is hidden
    Expected Result: Mobile menu toggles on hamburger click
    Failure Indicators: Menu doesn't appear, links missing
    Evidence: .sisyphus/evidence/task-6-mobile-menu.png
  ```

  **Commit**: YES
  - Message: `feat(demo): wire app shell and header navigation`
  - Files: `goey-toast-vue/demo/src/App.vue`, `goey-toast-vue/demo/src/components/AppHeader.vue`

- [x] 7. Build Verification + Visual QA

  **What to do**:
  - Run full build pipeline:
    1. `cd goey-toast-vue && npm run build` (ensure library is built first)
    2. `cd goey-toast-vue/demo && npm install`
    3. `cd goey-toast-vue/demo && npm run build` (production build)
  - Run typecheck: `cd goey-toast-vue/demo && npx vue-tsc --noEmit`
  - Start dev server and perform visual QA:
    1. All example buttons fire correct toasts
    2. Builder controls all work (change each one, verify code updates)
    3. Fire toast from builder with various configurations
    4. Docs sections render with tables and code blocks
    5. Try-it buttons in docs work
    6. Responsive layout at 375px, 640px, 840px viewpoints
    7. Mobile menu works
  - Fix any build errors, type errors, or visual issues found
  - Save evidence screenshots

  **Must NOT do**:
  - Do not modify source files in `goey-toast-vue/src/`
  - Do not add test files (this is a demo, not a test suite)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Comprehensive verification requiring build tools + browser automation
  - **Skills**: [`playwright`]
    - `playwright`: Needed for browser-based visual QA, responsive testing, and interaction verification

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (after Task 6)
  - **Blocks**: F1-F4
  - **Blocked By**: Task 6

  **References**:

  **Pattern References**:
  - `goey-toast-react/demo/package.json:7` — Build script pattern: `tsc -b && vite build` (Vue equivalent: `vue-tsc -b && vite build`)

  **WHY Each Reference Matters**:
  - React demo build script shows the expected build pipeline. Vue version uses `vue-tsc` instead of `tsc`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Production build succeeds
    Tool: Bash
    Preconditions: Library built, demo npm installed
    Steps:
      1. cd goey-toast-vue/demo && npm run build
      2. Verify exit code is 0
      3. Verify dist/ directory exists with index.html
    Expected Result: Build completes without errors
    Failure Indicators: Non-zero exit code, missing dist/
    Evidence: .sisyphus/evidence/task-7-prod-build.txt

  Scenario: TypeScript compiles cleanly
    Tool: Bash
    Preconditions: Demo npm installed
    Steps:
      1. cd goey-toast-vue/demo && npx vue-tsc --noEmit
      2. Verify exit code is 0
    Expected Result: Zero type errors
    Failure Indicators: Type errors in output
    Evidence: .sisyphus/evidence/task-7-typecheck.txt

  Scenario: Full interactive QA
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Screenshot full page at 1280px width
      2. Click each of the 5 Toast Type buttons, verify toasts appear
      3. Click "Promise + Success (pill)" button, wait 2.5s, verify transition
      4. In Builder: change type to "error", change position to "bottom-center", fire toast
      5. Verify generated code contains 'gooeyToast.error' and 'position="bottom-center"'
      6. Scroll to Docs, click a try-it button, verify toast
      7. Set viewport to 375x667, screenshot, verify mobile layout
      8. Click hamburger menu, screenshot
    Expected Result: All interactions work correctly at all breakpoints
    Failure Indicators: Missing toasts, broken layout, non-responsive
    Evidence: .sisyphus/evidence/task-7-full-qa-desktop.png, .sisyphus/evidence/task-7-full-qa-mobile.png
  ```

  **Commit**: YES (if fixes were needed)
  - Message: `fix(demo): resolve build and visual issues`
  - Files: any files that needed fixes
  - Pre-commit: `cd goey-toast-vue/demo && npm run build`

---

## Final Verification Wave

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `npm run build` in demo dir. Review all files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names. Verify TypeScript strict compliance via `vue-tsc --noEmit` (in demo context).
  Output: `Build [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start dev server. Navigate to demo. Click EVERY example button — verify toast appears. Test Builder: change each control, fire toast, verify generated code updates. Test Docs try-it buttons. Test responsive layout. Save screenshots to `.sisyphus/evidence/final-qa/`.
  Output: `Examples [N/N pass] | Builder [N/N controls] | Docs [N/N] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  Verify no Changelog page, no Hero marketing, no @vercel/analytics, no mascot animations, no OG metadata. Verify no modifications to `goey-toast-vue/src/`. Check all files are within `goey-toast-vue/demo/`. Flag any scope creep.
  Output: `Scope [CLEAN/N issues] | Source Untouched [YES/NO] | VERDICT`

---

## Commit Strategy

- **Wave 1**: `feat(demo): scaffold Vue demo app` — package.json, vite.config.ts, tsconfig, index.html, main.ts, App.css
- **Wave 2**: `feat(demo): add examples, builder, and docs sections` — ExamplesSection.vue, BuilderSection.vue, DocsSection.vue
- **Wave 3**: `feat(demo): wire app shell and header navigation` — App.vue, AppHeader.vue

---

## Success Criteria

### Verification Commands
```bash
cd goey-toast-vue/demo && npm install      # Expected: installs without errors
cd goey-toast-vue/demo && npm run build     # Expected: builds successfully
cd goey-toast-vue/demo && npm run dev       # Expected: starts dev server on localhost
```

### Final Checklist
- [ ] All "Must Have" features present and working
- [ ] All "Must NOT Have" items absent
- [ ] Build passes with zero errors
- [ ] All 9 example groups fire toasts correctly
- [ ] Builder generates valid Vue code
- [ ] Responsive layout works on mobile breakpoints
