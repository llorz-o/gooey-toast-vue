# goey-toast

**Organic, morphing toast notifications for Vue 3.**

A delightful notification library with gooey blob morph animations that smoothly transition between compact pills and expanded toast messages. Experience a highly tactile, liquid-like feel for your application's feedback system.

**[Live Demo & Documentation](https://gooey-toast-vue-opal.vercel.app)**

---

## Features

- **Liquid Morph Animations** – Smooth transitions between collapsed pills and expanded content with organic SVG morphing.
- **Organic Presets** – Four built-in animation feels: `smooth`, `bouncy`, `subtle`, and `snappy`.
- **Comprehensive Toast Types** – Built-in support for success, error, warning, info, and neutral states.
- **Promise Support** – Loading states that morph seamlessly into success or error results.
- **Smart Stacking** – Automatic height tracking and overflow management with custom strategies.
- **Interactive Elements** – Action buttons with optional success label morphing and hover-to-expand behavior.
- **Flexible Positioning** – Support for 6 screen positions with automatic mirroring for right-side placements.
- **Accessibility First** – ARIA live region support, keyboard shortcuts (Escape), and swipe-to-dismiss on mobile.
- **Deep Customization** – Custom colors, border widths, CSS class overrides, and animation timing control.

## Quick Start

```vue
<script setup>
import { GooeyToaster, gooeyToast } from 'goey-toast-vue'
import 'goey-toast-vue/styles.css'

const showSuccess = () => {
  gooeyToast.success('Saved successfully!')
}
</script>

<template>
  <div>
    <GooeyToaster position="bottom-right" />
    <button @click="showSuccess">Click Me</button>
  </div>
</template>
```

## Installation

This package is currently in development and not yet published to npm. To use it, you can:

1. Clone this repository and link it locally:
```bash
npm link ./goey-toast-vue
```

2. Or add it as a local dependency in your `package.json`:
```json
{
  "dependencies": {
    "goey-toast-vue": "file:./path/to/goey-toast-vue"
  }
}
```

### Requirements

goey-toast-vue requires the following dependencies:

```bash
npm install vue motion
```

| Package | Version    |
| ------- | ---------- |
| vue     | >= 3.3.0   |
| motion  | >= 11.0.0  |

### CSS Import (Required)

```ts
import 'goey-toast-vue/styles.css'
```

Add this import once in your app's entry point. Without it, toasts will appear unstyled.

---

## API Reference

### `gooeyToast` Methods

```ts
gooeyToast(title, options?)              // default (neutral)
gooeyToast.success(title, options?)      // green
gooeyToast.error(title, options?)        // red
gooeyToast.warning(title, options?)      // yellow
gooeyToast.info(title, options?)         // blue
gooeyToast.promise(promise, data)        // loading -> success/error
gooeyToast.update(id, options)           // update an existing toast in-place
gooeyToast.dismiss(idOrFilter?)          // dismiss one, by type, or all toasts
```

### `GooeyToasterProps`

| Prop         | Type                                  | Default          | Description                                   |
| ------------ | ------------------------------------- | ---------------- | --------------------------------------------- |
| `position`   | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'bottom-right'` | Toast position |
| `duration`   | `number`                              | --               | Default display duration in ms                |
| `gap`        | `number`                              | `14`             | Gap between stacked toasts (px)               |
| `offset`     | `number \| string`                    | `'24px'`         | Distance from screen edge                     |
| `theme`      | `'light' \| 'dark'`                   | `'light'`        | Color theme                                   |
| `spring`     | `boolean`                             | `true`           | Enable spring/bounce animations globally      |
| `bounce`     | `number`                              | `0.4`            | Spring intensity: `0.05` (subtle) to `0.8` (dramatic) |
| `preset`     | `AnimationPresetName`                 | --               | Animation preset for all toasts               |
| `closeOnEscape` | `boolean`                          | `true`           | Dismiss most recent toast on Escape key       |
| `closeButton`  | `boolean \| 'top-left' \| 'top-right'` | `false`       | Show close button on hover                    |
| `showProgress` | `boolean`                           | `false`          | Show countdown progress bar on all toasts     |
| `maxQueue`   | `number`                              | `Infinity`       | Maximum queued toasts                         |
| `queueOverflow` | `'drop-oldest' \| 'drop-newest'`   | `'drop-oldest'`  | Queue overflow strategy                       |
| `dir`        | `'ltr' \| 'rtl'`                     | `'ltr'`          | Layout direction                              |
| `swipeToDismiss` | `boolean`                         | `true`           | Enable swipe-to-dismiss on mobile             |

## Documentation

- **[Live Demo](https://gooey-toast-vue-opal.vercel.app)** – Interactive playground and full API reference
- **[Package README](./goey-toast-vue/README.md)** – Detailed Vue usage and configuration
- **[Design Specifications](./docs/superpowers/specs/)** – Deep dive into animation math and design rationale

## Development

To get started with local development:

```bash
cd goey-toast-vue
npm install
npm run build
npm run dev         # Watch mode
npm run test        # Run tests
npm run typecheck   # Type checking
```

## AI Implementation & Attribution

This project is a showcase of AI-driven development. Approximately 95% of the codebase, including the complex SVG morphing math and spring physics animations, was implemented by AI agents (using the OpenCode framework) under human direction.

The human role focused on:
- High-level architectural decisions and API design
- Defining the visual "feel" and animation constraints
- Reviewing critical logic for accessibility and performance
- Framework selection and integration strategy

This approach allowed for rapid prototyping of complex animation logic while maintaining high code quality and consistency.

## Browser Support

goey-toast-vue works in all modern browsers that support:

- ES2020+
- Vue 3 composition API
- CSS animations and transforms
- SVG path animations
- ResizeObserver

## License

[MIT](./LICENSE)
