# Vue Demo App Project Description Enhancement

## TL;DR

> **Quick Summary**: Add a descriptive project introduction section to the Vue demo's App.vue to match React demo's UI style and clearly communicate this is a Vue 3 implementation using OpenCode + oh-my-openagent.
>
> **Deliverables**:
> - Updated `goey-toast-vue/demo/src/App.vue` with project description section between AppHeader and examples
> - Matching CSS styling in `goey-toast-vue/demo/src/App.css` for consistency with React demo
> - Descriptive text highlighting Vue 3, @vueuse/motion, OpenCode + oh-my-openagent
>
> **Estimated Effort**: Quick
> **Parallel Execution**: NO - single file changes
> **Critical Path**: Task 1 → Task 2 (optional CSS refinement)

---

## Context

### Original Request
Add Vue project-related description in the `<!-- project description -->` comment section of `goey-toast-vue/demo/src/App.vue`, using OpenCode + oh-my-openagent approach, maintaining UI consistency with the React demo.

### Current State
- React demo (`goey-toast-react/demo/src/App.tsx`) has a well-structured hero section with project title and description
- Vue demo (`goey-toast-vue/demo/src/App.vue`) has a placeholder `<!-- project description -->` comment at line 42
- Both demos should maintain visual/structural parity where applicable

### Design Baseline
React demo uses:
- **Hero Structure**: Badge → Title → Description → Tech stack mentions
- **Styling**: Semantic HTML sections with class-based styling
- **Content**: Clear value prop + tech foundation statement

---

## Work Objectives

### Core Objective
Replace the `<!-- project description -->` comment in Vue App.vue with a descriptive content block that:
1. Introduces gooey-toast Vue as a Vue 3 port
2. Highlights key tech: Vue 3 Composition API, @vueuse/motion, OpenCode + oh-my-openagent
3. Maintains structural/visual consistency with React demo
4. Uses semantic HTML and existing CSS class patterns

### Concrete Deliverables
- Vue App.vue: Project description section rendered between AppHeader and examples
- Vue App.css: Styling for new description block (if needed)
- Visual consistency: Should feel like sibling implementation of React demo

### Definition of Done
- [x] Vue App.vue has project description replacing the comment placeholder
- [x] Project description text mentions Vue 3, @vueuse/motion, and OpenCode + oh-my-openagent
- [x] Styling applied; description renders with appropriate spacing/typography
- [x] **Verification**: Run dev server, visually inspect description placement and styling

### Must Have
- Clear, concise Vue project introduction (1-2 sentences)
- Tech stack badges: Vue 3 Composition API, @vueuse/motion, OpenCode + oh-my-openagent
- Matching design language with React demo's hero section

### Must NOT Have (Guardrails)
- Don't change AppHeader or other component boundaries
- Don't alter examples/builder section layout
- Don't remove or break DocsSection
- Don't add excessive markup; keep it semantic and minimal
- Don't deviate significantly from React demo's design patterns

---

## Verification Strategy

### Test Infrastructure
- Vue demo uses Vite dev server; no automated UI tests required for this style task
- Manual visual verification via `npm run dev`

### QA Policy
**No automated tests required for this UI enhancement.**
Verification is visual: run dev server, inspect rendering, confirm styling matches expectations.

---

## Execution Strategy

### Single Task (Sequential)

- [x] 1. Add Project Description Section to Vue App.vue

  **What to do**:
  - Open `goey-toast-vue/demo/src/App.vue`
  - Locate the `<!-- project description -->` comment (line 42)
  - Replace comment with a new `<div class="project-description">` block containing:
    - Container div with class `description-container`
    - `<h2>` title: "gooey-toast Vue"
    - `<p>` description: "Vue 3 port of morphing toast notifications. Organic blob animations, promise tracking, and full customization out of the box."
    - `<p>` tech stack mention with inline tech badges for: Vue 3 Composition API, @vueuse/motion, OpenCode + oh-my-openagent
  - Structure matches React demo pattern (see React App.tsx hero section as reference)

  **References** (existing code to match):
  - **React Demo Structure**: `goey-toast-react/demo/src/App.tsx:488-510` (hero section pattern)
    - Hero uses: `.hero`, `.hero-badge`, `<h1>`, `<p className="hero-description">`, inline tech descriptions
    - Copy the semantic structure (heading, description, tech mentions), adapt to Vue inline styles if needed
  - **Vue Component Pattern**: `goey-toast-vue/demo/src/components/AppHeader.vue`
    - Reference existing Vue component styling and class naming conventions
  - **Existing Vue App.css**: `goey-toast-vue/demo/src/App.css`
    - Check for existing classes and color schemes to extend styling

  **Recommended Agent Profile**:
  > This is a straightforward UI template task with clear reference material.
  - **Category**: `visual-engineering`
    - Reason: UI structure and CSS styling alignment required; needs design consistency verification between React and Vue
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Ensures visual consistency across frameworks, semantic HTML structure, and responsive design patterns
  - **Skills Evaluated but Omitted**:
    - `git-master`: Not needed; no complex git operations or history exploration required

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Single sequential task
  - **Blocks**: None
  - **Blocked By**: None (can start immediately)

  **References** (CRITICAL - Executor's Guide):

  > The executor has NO context from this plan. These references are their ONLY guide to understand scope and style.

  **React Demo Reference** (style/structure to match):
  - `goey-toast-react/demo/src/App.tsx:488-510` - Hero section markup
    - Study the nested div structure, h1 title formatting, description paragraphs
    - Note how tech/framework info is presented inline with semantic styling
  - `goey-toast-react/demo/src/App.css` (search for `.hero`, `.hero-description`)
    - Existing CSS classes used by hero section; Vue version should use similar semantic class names

  **Vue Demo References** (Vue 3 component conventions):
  - `goey-toast-vue/demo/src/components/AppHeader.vue` - Vue component structure
    - Shows how Vue 3 + Vite projects structure components and apply CSS classes
  - `goey-toast-vue/demo/src/App.vue` - Current App structure
    - Confirms class naming patterns and component composition flow

  **Why These References Matter**:
  - **React App.tsx hero (lines 488-510)**: Executor needs to see the exact markup structure and CSS class pattern to ensure Vue version has visual parity
  - **App.css**: Shows what CSS classes already exist; new description block should extend or reuse existing patterns rather than invent new ones
  - **Vue AppHeader.vue**: Demonstrates Vue 3 + CSS class patterns in this specific project; ensures consistency with existing Vue demo code

  **Acceptance Criteria**:

  > **AGENT-EXECUTABLE VERIFICATION ONLY** - No human action permitted.
  > This is a visual/style task; verification is rendering correctness, not functional code.

  - [x] File modified: `goey-toast-vue/demo/src/App.vue` (line 42 comment replaced with project description markup)
  - [x] Project description section renders in dev server output without syntax errors
  - [x] Visual verification: npm run dev opens dev server and description displays between AppHeader and examples section
  - [x] CSS styling applied; description block has appropriate typography and spacing (matching React hero pattern)
  - [x] Tech badges visible: Vue 3 Composition API, @vueuse/motion, OpenCode + oh-my-openagent

  **QA Scenarios**:

  > **This is NOT optional. A task without QA scenarios WILL BE REJECTED.**

  ```
  Scenario: Project description renders with correct layout and typography
    Tool: Chrome DevTools / Playwright
    Preconditions: Vue demo built/dev server running at localhost:5173
    Steps:
      1. Run: cd goey-toast-vue/demo && npm run dev
      2. Open browser to http://localhost:5173
      3. Inspect page: locate div.project-description between AppHeader and #examples section
      4. Verify h2 text reads "gooey-toast Vue"
      5. Verify description paragraph appears below title
      6. Verify tech badges (Vue 3 Composition API, @vueuse/motion, OpenCode + oh-my-openagent) visible inline
    Expected Result: 
      - Project description section visually distinct from hero/examples
      - Typography consistent with React demo's hero section
      - All text content renders without truncation
      - Tech badges styled as inline elements with appropriate spacing
    Failure Indicators: 
      - Missing section between AppHeader and examples
      - Text content truncated or misaligned
      - Tech badges not visible or malformed CSS
      - Console errors related to markup structure
    Evidence: Screenshot via Playwright showing full page layout with description section highlighted

  Scenario: CSS styling applied correctly and matches design intent
    Tool: Chrome DevTools CSS Inspector
    Preconditions: Page from previous scenario loaded
    Steps:
      1. Right-click on project description title (h2)
      2. Inspect element; review computed CSS
      3. Verify font-size, color, spacing, margin values
      4. Compare against React App.css hero styles (use browser side-by-side)
      5. Inspect description paragraph and tech badges for consistent styling
    Expected Result:
      - Heading (h2) styled with appropriate font-weight and size (20-24px typical)
      - Paragraph text readable (contrast ratio ≥4.5:1)
      - Vertical spacing between elements (12-16px gaps)
      - Tech badges styled inline with visual distinction (e.g., background, border, padding)
      - No overflow or text wrapping issues
    Failure Indicators:
      - Font sizes too small (< 14px for body text)
      - Poor color contrast (< 4.5:1)
      - Excessive whitespace or cramped layout
      - Tech badges look broken or unstyled
    Evidence: Screenshot of CSS inspector panel showing applied styles
  ```

  **Commit**: YES (single file + optional CSS)
  - **Message**: `chore(vue-demo): add project description section to App.vue`
  - **Files**: `goey-toast-vue/demo/src/App.vue`, (optional: `goey-toast-vue/demo/src/App.css` if CSS added)
  - **Pre-commit**: None (no tests for style-only changes)

---

## Final Verification Wave

No formal review needed for this small style enhancement.
**Verification**: Manual visual inspection during development.

---

## Commit Strategy

- **Single commit**: `chore(vue-demo): add project description section to App.vue`
  - Modified: `goey-toast-vue/demo/src/App.vue` (replace comment with HTML block)
  - Modified (if needed): `goey-toast-vue/demo/src/App.css` (add styling)

---

## Success Criteria

### Verification Commands
```bash
cd goey-toast-vue/demo && npm run dev
# Open http://localhost:5173 and visually inspect project description section
```

### Final Checklist
- [x] Project description section visible between AppHeader and #examples
- [x] Heading reads "gooey-toast Vue"
- [x] Description text mentions Vue 3, promise tracking, customization
- [x] Tech stack mentions visible: Vue 3 Composition API, @vueuse/motion, OpenCode + oh-my-openagent
- [x] Styling consistent with React demo hero section
- [x] No console errors or rendering issues
- [x] Git commit created with proper message
