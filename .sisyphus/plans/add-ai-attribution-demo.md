# Add AI Attribution Notice to Vue Demo Header

## TL;DR

> Add a line in the Vue demo's header section that states "99% of the code was written by AI" with a link to the React version project.
>
> **Location**: `goey-toast-vue/demo/src/App.vue` (after the tech badges)
> **Deliverable**: Visual attribution notice with link to React repo
> **Effort**: Quick

---

## Context

User wants to add visibility that this Vue port was generated primarily by AI, with a direct link to the canonical React implementation for reference.

---

## Work Objectives

### Core Objective
Add an attribution paragraph to the Vue demo's hero section that clearly states the AI authorship and provides a link to the original React version.

### Concrete Deliverables
- [ ] Updated `goey-toast-vue/demo/src/App.vue` with new `ai-attribution` paragraph element
- [ ] Paragraph includes: "✨ 99% of the code was written by AI" text
- [ ] Link to React version: `https://github.com/anl331/goey-toast/tree/main/goey-toast-react`
- [ ] Styled with CSS class `ai-attribution` for visual consistency

### Definition of Done
- Text appears in demo UI under the tech badges
- Link is clickable and opens React repo in new tab
- Text is readable and visually integrated with existing header design

---

## Verification Strategy

### Test Decision
- **Automated tests**: No (UI-only change)
- **Manual verification**: Yes - visual inspection in browser

### QA Policy

**Scenario: Attribution text renders correctly**
- Tool: Playwright
- Preconditions: Demo built and running on localhost
- Steps:
  1. Navigate to `http://localhost:5173` (or deployed demo URL)
  2. Locate the hero section with "gooey-toast Vue" title
  3. Verify the text "✨ 99% of the code was written by AI." is visible below tech badges
  4. Verify link text "React version" is displayed and blue/styled as a link
- Expected Result: Attribution notice clearly visible in the hero section
- Evidence: Screenshot at `.sisyphus/evidence/ai-attribution-render.png`

**Scenario: React version link works**
- Tool: Playwright
- Preconditions: Demo running
- Steps:
  1. On the demo page, click the "React version" link
  2. Verify browser navigates to `https://github.com/anl331/goey-toast/tree/main/goey-toast-react`
  3. Verify link opens in a new tab (not replacing current page)
- Expected Result: Link successfully opens React repo in new tab
- Evidence: Screenshot showing new tab at `.sisyphus/evidence/ai-attribution-link.png`

---

## Execution

### File: goey-toast-vue/demo/src/App.vue

**Current state** (lines 48-52):
```vue
<p class="tech-stack">
  <span class="tech-badge">Vue 3 Composition API</span>
  <span class="tech-badge">@vueuse/motion</span>
  <span class="tech-badge">OpenCode + oh-my-openagent</span>
</p>
```

**Action**: Insert new paragraph after tech-stack (after line 52):
```vue
<p class="ai-attribution">
  <strong>✨ 99% of the code was written by AI.</strong> 
  Check out the original 
  <a href="https://github.com/anl331/goey-toast/tree/main/goey-toast-react" target="_blank" rel="noopener noreferrer">React version</a>
  for the canonical implementation.
</p>
```

### File: goey-toast-vue/demo/src/App.css

**Action**: Add styling for `.ai-attribution` class (append to end of file):
```css
.ai-attribution {
  margin-top: 12px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.ai-attribution a {
  color: #0066cc;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid #0066cc;
}

.ai-attribution a:hover {
  color: #0052a3;
  border-bottom-color: #0052a3;
}

/* Dark mode support */
.project-description[data-theme="dark"] .ai-attribution {
  color: #999;
}

.project-description[data-theme="dark"] .ai-attribution a {
  color: #66b3ff;
  border-bottom-color: #66b3ff;
}

.project-description[data-theme="dark"] .ai-attribution a:hover {
  color: #99ccff;
  border-bottom-color: #99ccff;
}
```

---

## TODOs

- [x] 1. Update App.vue with attribution paragraph
  
  **What to do**:
  - Edit `goey-toast-vue/demo/src/App.vue`
  - After the `<p class="tech-stack">` element (line 52), insert the new `<p class="ai-attribution">` paragraph
  - Include link to `https://github.com/anl331/goey-toast/tree/main/goey-toast-react`
  - Ensure `target="_blank"` and `rel="noopener noreferrer"` for safe external linking

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required - straightforward HTML/Vue template edit

  **Parallelization**: Not applicable (single task)

  **References**:
  - `goey-toast-vue/demo/src/App.vue` (lines 42-54): Current header structure
  - `goey-toast-vue/demo/src/App.css`: Where to add corresponding styles

  **Acceptance Criteria**:
  - [ ] File edits complete without breaking Vue syntax
  - [ ] New paragraph renders without console errors
  - [ ] Link URL is correct and opens in new tab

  **QA Scenarios**:
  ```
  Scenario: Attribution text and link visible in demo
    Tool: Playwright
    Preconditions: Run `cd goey-toast-vue/demo && npm run dev`
    Steps:
      1. Open browser to http://localhost:5173
      2. Scroll to hero section (should be immediately visible)
      3. Verify text "✨ 99% of the code was written by AI." appears
      4. Verify "React version" link is visible and styled
    Expected Result: Both text and link clearly visible under tech badges
    Evidence: .sisyphus/evidence/task-1-attribution-visible.png

  Scenario: React version link works correctly
    Tool: Playwright
    Preconditions: Demo page loaded with attribution visible
    Steps:
      1. Click on "React version" link
      2. Wait 1 second for page to load
      3. Verify URL changed to github.com React repo
      4. Verify link opened in new tab
    Expected Result: New tab opens at https://github.com/anl331/goey-toast/tree/main/goey-toast-react
    Evidence: .sisyphus/evidence/task-1-link-works.png
  ```

- [x] 2. Add CSS styling for attribution paragraph
  
  **What to do**:
  - Edit `goey-toast-vue/demo/src/App.css`
  - Append `.ai-attribution` class styling
  - Include link hover states
  - Consider dark mode support (if demo has dark theme toggle)
  - Ensure text is readable but not too prominent (secondary information)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: None required - basic CSS styling

  **Parallelization**: Can run after Task 1 (depends on paragraph existing)

  **References**:
  - `goey-toast-vue/demo/src/App.css` (end of file): Where to add styles
  - `.tech-stack` existing styles: Reference for sizing/spacing

  **Acceptance Criteria**:
  - [ ] CSS class `.ai-attribution` defined with appropriate styling
  - [ ] Link styling includes hover effects
  - [ ] Text size/color matches design aesthetic
  - [ ] Styling applies correctly without layout shift

  **QA Scenarios**:
  ```
  Scenario: Attribution styling matches existing design
    Tool: Playwright
    Preconditions: Both Vue and CSS changes deployed
    Steps:
      1. Load demo page
      2. Inspect attribution paragraph font size (should be ~14px)
      3. Verify text color is gray (#666) in light mode
      4. Inspect link styling (should be blue #0066cc)
      5. Hover over link, verify color change to #0052a3
    Expected Result: Styling is polished and consistent with tech-stack styling
    Evidence: .sisyphus/evidence/task-2-styling-correct.png

  Scenario: Link hover state works
    Tool: Playwright
    Preconditions: Demo loaded
    Steps:
      1. Move mouse to "React version" link
      2. Verify link color changes on hover
      3. Verify underline/border styling updates
    Expected Result: Link has clear visual feedback on hover
    Evidence: .sisyphus/evidence/task-2-link-hover.png
  ```

---

## Final Verification Wave

- [ ] F1. **Visual QA** — `unspecified-high` + `playwright`
  - Verify attribution text and link render correctly in hero section
  - Verify link opens React repo in new tab
  - Check responsive behavior on mobile viewport
  - Verify styling matches existing design language

- [ ] F2. **Build Verification** — `quick`
  - Run `npm run build` in demo directory
  - Confirm build succeeds without warnings
  - Verify dist output includes updated HTML

---

## Success Criteria

### Visual Checklist
- [ ] "✨ 99% of the code was written by AI." text is visible in hero section
- [ ] "React version" link is clickable and styled appropriately
- [ ] Link opens correct GitHub URL in new tab
- [ ] Attribution notice is visually integrated with tech badges

### Functional Checklist
- [ ] Vue template syntax is valid (no console errors)
- [ ] Link href is correct: `https://github.com/anl331/goey-toast/tree/main/goey-toast-react`
- [ ] Link attributes correct: `target="_blank" rel="noopener noreferrer"`
- [ ] Styling is responsive and looks good on mobile

---

## Commit Strategy

**Commit Message**:
```
docs(demo): add AI attribution notice with React version link
```

**Files**:
- `goey-toast-vue/demo/src/App.vue`
- `goey-toast-vue/demo/src/App.css`

**Pre-commit Check**:
```bash
cd goey-toast-vue/demo && npm run build
```
