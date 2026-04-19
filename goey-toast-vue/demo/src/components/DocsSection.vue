<script setup lang="ts">
import { gooeyToast } from 'goey-toast-vue'
import type { GooeyToastOptions } from 'goey-toast-vue'

const DEMO_DEFAULTS = {
  spring: true,
  bounce: 0.3,
  timing: {
    displayDuration: 5000,
  },
} satisfies GooeyToastOptions

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function failAfter(ms: number) {
  return new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Failed')), ms))
}

function clipboardWrite(text: string) {
  navigator.clipboard.writeText(text)
}
</script>

<template>
  <div class="docs" id="docs">
    <div class="docs-header">
      <h2>Documentation</h2>
      <p>Everything you need to add morphing toast notifications to your Vue app.</p>
    </div>

    <!-- 01 Quick Start -->
    <div class="doc-section">
      <div class="doc-section-label">
        <div class="doc-number">01</div>
        <h3>Quick Start</h3>
      </div>
      <div class="doc-section-content">
        <p>
          Add the <span class="inline-code">GooeyToaster</span> component and call
          <span class="inline-code">gooeyToast</span> from anywhere.
        </p>
        <pre><code>{{ `<script setup>
import { GooeyToaster, gooeyToast } from 'goey-toast-vue'
import 'goey-toast-vue/styles.css'
<\/script>

<template>
  <GooeyToaster position="bottom-right" />
  <button @click="gooeyToast.success('Saved!')">
    Save
  </button>
</template>` }}</code></pre>
        <p>
          Requires <span class="inline-code">vue</span> and
          <span class="inline-code">motion</span> as peer dependencies.
        </p>
      </div>
    </div>

    <!-- 02 Toast Types -->
    <div class="doc-section">
      <div class="doc-section-label">
        <div class="doc-number">02</div>
        <h3>Toast Types</h3>
      </div>
      <div class="doc-section-content">
        <pre><code>{{ `gooeyToast('Hello')                    // default (neutral)
gooeyToast.success('Saved!')           // green
gooeyToast.error('Failed')             // red
gooeyToast.warning('Careful')          // yellow
gooeyToast.info('FYI')                 // blue` }}</code></pre>
        <div class="doc-try-buttons">
          <button @click="gooeyToast('Notification received', DEMO_DEFAULTS)">Default</button>
          <button @click="gooeyToast.success('Changes Saved', DEMO_DEFAULTS)">Success</button>
          <button @click="gooeyToast.error('Something went wrong', DEMO_DEFAULTS)">Error</button>
          <button @click="gooeyToast.warning('Storage is almost full', DEMO_DEFAULTS)">Warning</button>
          <button @click="gooeyToast.info('New update available', DEMO_DEFAULTS)">Info</button>
        </div>
      </div>
    </div>

    <!-- 03 Description -->
    <div class="doc-section">
      <div class="doc-section-label">
        <div class="doc-number">03</div>
        <h3>Description</h3>
      </div>
      <div class="doc-section-content">
        <p>
          Pass a string or any <span class="inline-code">VNode</span> as the
          description to expand the toast into a blob.
        </p>
        <pre><code>{{ `gooeyToast.error('Payment failed', {
  description: 'Your card was declined.',
})

// VNode as body (using h())
import { h } from 'vue'

gooeyToast.success('Deployed', {
  description: h('div', [
    h('strong', 'Production'),
    h('span', ' main @ 3f8a2c1'),
  ]),
})` }}</code></pre>
        <div class="doc-try-buttons">
          <button @click="gooeyToast.warning('Your session is about to expire', { ...DEMO_DEFAULTS, description: 'You\'ve been inactive for 25 minutes. Please save your work or your session will end automatically.' })">Warning + Description</button>
          <button @click="gooeyToast.error('Connection lost', { ...DEMO_DEFAULTS, description: 'Unable to reach the server. Check your internet connection and try again.' })">Error + Description</button>
        </div>
      </div>
    </div>

    <!-- 04 Action Button -->
    <div class="doc-section">
      <div class="doc-section-label">
        <div class="doc-number">04</div>
        <h3>Action Button</h3>
      </div>
      <div class="doc-section-content">
        <p>
          Add <span class="inline-code">successLabel</span> for a pill morph-back
          animation on click.
        </p>
        <pre><code>{{ `gooeyToast.info('Share link ready', {
  description: 'Your link has been generated.',
  action: {
    label: 'Copy to Clipboard',
    onClick: () => navigator.clipboard.writeText(url),
    successLabel: 'Copied!',   // optional morph-back
  },
})` }}</code></pre>
        <div class="doc-try-buttons">
          <button @click="gooeyToast.error('Payment failed', { ...DEMO_DEFAULTS, description: 'Your card ending in 4242 was declined. Please update your payment method to continue.', action: { label: 'Update Payment', onClick: () => gooeyToast.success('Redirecting...', DEMO_DEFAULTS) } })">Error + Action</button>
          <button @click="gooeyToast.info('Share link ready', { ...DEMO_DEFAULTS, description: 'Your share link has been generated and is ready to copy.', action: { label: 'Copy to Clipboard', onClick: () => clipboardWrite('https://example.com/share/abc123'), successLabel: 'Copied!' } })">Action + Success Pill</button>
        </div>
      </div>
    </div>

    <!-- 05 Promise Toasts -->
    <div class="doc-section">
      <div class="doc-section-label">
        <div class="doc-number">05</div>
        <h3>Promise Toasts</h3>
      </div>
      <div class="doc-section-content">
        <p>
          Automatically transitions from loading to success/error when the promise resolves.
        </p>
        <pre><code>{{ `gooeyToast.promise(saveData(), {
  loading: 'Saving...',
  success: 'Changes saved',
  error: 'Something went wrong',
  description: {
    success: 'All changes have been synced.',
    error: 'Please try again later.',
  },
  action: {
    error: {
      label: 'Retry',
      onClick: () => retry(),
    },
  },
})` }}</code></pre>
        <div class="doc-try-buttons">
          <button @click="gooeyToast.promise(sleep(2000), { ...DEMO_DEFAULTS, loading: 'Saving...', success: 'Changes Saved', error: 'Something went wrong' })">Promise + Success (pill)</button>
          <button @click="gooeyToast.promise(failAfter(2000), { ...DEMO_DEFAULTS, loading: 'Saving...', success: 'Changes Saved', error: 'Something went wrong' })">Promise + Error (pill)</button>
          <button @click="gooeyToast.promise(sleep(2000), { ...DEMO_DEFAULTS, loading: 'Processing...', success: 'All done!', error: 'Failed', description: { success: 'Your data has been processed and saved successfully.' } })">Promise + Success (expanded)</button>
        </div>
      </div>
    </div>

    <!-- 06 Toaster Props -->
    <div class="doc-section">
      <div class="doc-section-label">
        <div class="doc-number">06</div>
        <h3>Toaster Props</h3>
      </div>
      <div class="doc-section-content">
        <p>
          6 positions supported. Right-side positions auto-mirror the blob horizontally.
          Center positions use a symmetric morph where the body grows outward from the pill.
        </p>
        <pre><code>{{ `<GooeyToaster position="top-center" />` }}</code></pre>
        <div class="table-scroll">
          <table class="prop-table">
            <thead>
              <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
            </thead>
            <tbody>
              <tr><td>position</td><td>string</td><td>'bottom-right'</td><td>6 positions: top-left, top-center, top-right, bottom-left, bottom-center, bottom-right</td></tr>
              <tr><td>duration</td><td>number</td><td>—</td><td>Default display duration (ms)</td></tr>
              <tr><td>gap</td><td>number</td><td>14</td><td>Gap between stacked toasts</td></tr>
              <tr><td>offset</td><td>number | string</td><td>'24px'</td><td>Distance from screen edge</td></tr>
              <tr><td>theme</td><td>'light' | 'dark'</td><td>'light'</td><td>Color theme</td></tr>
              <tr><td>spring</td><td>boolean</td><td>true</td><td>Enable spring/bounce animations globally</td></tr>
              <tr><td>bounce</td><td>number</td><td>0.4</td><td>Spring intensity: 0.05 (subtle) to 0.8 (dramatic)</td></tr>
              <tr><td>closeOnEscape</td><td>boolean</td><td>true</td><td>Dismiss most recent toast on Escape key press</td></tr>
              <tr><td>showProgress</td><td>boolean</td><td>false</td><td>Show countdown progress bar on all toasts</td></tr>
              <tr><td>maxQueue</td><td>number</td><td>Infinity</td><td>Maximum number of toasts in the waiting queue</td></tr>
              <tr><td>queueOverflow</td><td>'drop-oldest' | 'drop-newest'</td><td>'drop-oldest'</td><td>Behavior when queue exceeds maxQueue</td></tr>
              <tr><td>swipeToDismiss</td><td>boolean</td><td>true</td><td>Enable swipe-to-dismiss touch gestures on mobile</td></tr>
              <tr><td>preset</td><td>AnimationPresetName</td><td>—</td><td>Named animation preset (smooth, bouncy, subtle, snappy)</td></tr>
              <tr><td>closeButton</td><td>boolean | 'top-left' | 'top-right'</td><td>false</td><td>Show close button on hover</td></tr>
              <tr><td>dir</td><td>'ltr' | 'rtl'</td><td>'ltr'</td><td>Layout direction</td></tr>
              <tr><td>visibleToasts</td><td>number</td><td>—</td><td>Maximum number of visible toasts at once</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 07 Options -->
    <div class="doc-section">
      <div class="doc-section-label">
        <div class="doc-number">07</div>
        <h3>Options</h3>
      </div>
      <div class="doc-section-content">
        <div class="table-scroll">
          <table class="prop-table">
            <thead>
              <tr><th>Option</th><th>Type</th><th>Description</th></tr>
            </thead>
            <tbody>
              <tr><td>description</td><td>VNode | string</td><td>Body content (string or component)</td></tr>
              <tr><td>action</td><td>GooeyToastAction</td><td>Action button config</td></tr>
              <tr><td>icon</td><td>VNode | string</td><td>Custom icon override</td></tr>
              <tr><td>duration</td><td>number</td><td>Display duration in ms</td></tr>
              <tr><td>id</td><td>string | number</td><td>Unique toast identifier</td></tr>
              <tr><td>classNames</td><td>GooeyToastClassNames</td><td>CSS class overrides</td></tr>
              <tr><td>fillColor</td><td>string</td><td>Background color of the blob</td></tr>
              <tr><td>borderColor</td><td>string</td><td>Border color of the blob</td></tr>
              <tr><td>borderWidth</td><td>number</td><td>Border width in px (default 1.5)</td></tr>
              <tr><td>timing</td><td>GooeyToastTimings</td><td>Animation timing overrides</td></tr>
              <tr><td>spring</td><td>boolean</td><td>Enable spring/bounce animations (default true)</td></tr>
              <tr><td>bounce</td><td>number</td><td>Spring intensity: 0.05 (subtle) to 0.8 (dramatic), default 0.4</td></tr>
              <tr><td>showProgress</td><td>boolean</td><td>Show countdown progress bar on this toast</td></tr>
              <tr><td>preset</td><td>AnimationPresetName</td><td>Named animation preset (smooth, bouncy, subtle, snappy)</td></tr>
              <tr><td>showTimestamp</td><td>boolean</td><td>Show/hide timestamp in toast header</td></tr>
              <tr><td>onDismiss</td><td>(id: string | number) =&gt; void</td><td>Callback fired when toast is dismissed (any reason)</td></tr>
              <tr><td>onAutoClose</td><td>(id: string | number) =&gt; void</td><td>Callback fired only when toast auto-closes (timer)</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 08 Methods -->
    <div class="doc-section">
      <div class="doc-section-label">
        <div class="doc-number">08</div>
        <h3>Methods</h3>
      </div>
      <div class="doc-section-content">
        <p>
          Beyond the basic <span class="inline-code">gooeyToast()</span> and type methods,
          the following methods are available for managing toasts programmatically.
        </p>
        <div class="table-scroll">
          <table class="prop-table">
            <thead>
              <tr><th>Method</th><th>Signature</th><th>Description</th></tr>
            </thead>
            <tbody>
              <tr><td>gooeyToast.dismiss</td><td>(id?: string | number) =&gt; void</td><td>Dismiss a specific toast by ID, or all toasts if no ID</td></tr>
              <tr><td>gooeyToast.dismiss</td><td>(filter: DismissFilter) =&gt; void</td><td>Dismiss all toasts matching a type filter</td></tr>
              <tr><td>gooeyToast.update</td><td>(id, options: GooeyToastUpdateOptions) =&gt; void</td><td>Update an active toast's title, description, type, or action in place</td></tr>
            </tbody>
          </table>
        </div>
        <h4 style="margin-top: 20px; font-size: 13px">DismissFilter</h4>
        <pre><code>{{ `interface DismissFilter {
  type: GooeyToastType | GooeyToastType[]
}

// Dismiss all error toasts
gooeyToast.dismiss({ type: 'error' })

// Dismiss all error and warning toasts
gooeyToast.dismiss({ type: ['error', 'warning'] })` }}</code></pre>
        <h4 style="margin-top: 20px; font-size: 13px">GooeyToastUpdateOptions</h4>
        <pre><code>{{ `interface GooeyToastUpdateOptions {
  title?: string
  description?: VNode | string
  type?: GooeyToastType
  action?: GooeyToastAction
  icon?: VNode | string | null
}

// Update a toast in place
const id = gooeyToast.success('Uploading...')
gooeyToast.update(id, {
  title: 'Upload complete!',
  type: 'success',
  description: 'File has been processed.',
})` }}</code></pre>
      </div>
    </div>

    <!-- 09 Custom Styling -->
    <div class="doc-section">
      <div class="doc-section-label">
        <div class="doc-number">09</div>
        <h3>Custom Styling</h3>
      </div>
      <div class="doc-section-content">
        <p>
          Override styles for any part of the toast with
          <span class="inline-code">classNames</span>.
        </p>
        <pre><code>{{ `gooeyToast.success('Styled!', {
  fillColor: '#1a1a2e',
  borderColor: '#333',
  borderWidth: 2,
  classNames: {
    wrapper: 'my-wrapper',
    title: 'my-title',
    description: 'my-desc',
    actionButton: 'my-btn',
  },
})` }}</code></pre>
        <div class="doc-try-buttons">
          <button @click="gooeyToast.success('Styled!', { ...DEMO_DEFAULTS, fillColor: '#1a1a2e', borderColor: '#333', borderWidth: 2, description: 'Custom fill and border styling.' })">Try Custom Style</button>
        </div>
        <div class="table-scroll">
          <table class="prop-table">
            <thead>
              <tr><th>Key</th><th>Target</th></tr>
            </thead>
            <tbody>
              <tr><td>wrapper</td><td>Outer container</td></tr>
              <tr><td>content</td><td>Content area</td></tr>
              <tr><td>header</td><td>Icon + title row</td></tr>
              <tr><td>title</td><td>Title text</td></tr>
              <tr><td>icon</td><td>Icon wrapper</td></tr>
              <tr><td>description</td><td>Body text</td></tr>
              <tr><td>actionWrapper</td><td>Button container</td></tr>
              <tr><td>actionButton</td><td>Action button</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 10 Spring Animation -->
    <div class="doc-section">
      <div class="doc-section-label">
        <div class="doc-number">10</div>
        <h3>Spring Animation</h3>
      </div>
      <div class="doc-section-content">
        <p>
          Disable the spring/bounce effect for a cleaner, more subtle animation style.
          Set per-toast or globally on the Toaster.
        </p>
        <pre><code>{{ `// Per-toast
gooeyToast.success('Saved', {
  description: 'Your changes have been synced.',
  spring: false,
})

// Global default
<GooeyToaster :spring="false" />` }}</code></pre>
        <p>
          When <span class="inline-code">spring</span> is
          <span class="inline-code">false</span>, all spring-based animations
          (landing squish, blob morph, pill resize, header squish) use smooth
          ease-in-out curves instead. Error shake still works regardless.
          Per-toast values override the global setting.
        </p>
        <div class="doc-try-buttons">
          <button @click="gooeyToast.success('Smooth save', { ...DEMO_DEFAULTS, spring: false })">No Spring (pill)</button>
          <button @click="gooeyToast.warning('Storage warning', { ...DEMO_DEFAULTS, spring: false, description: 'You are using 95% of your available storage.' })">No Spring (expanded)</button>
          <button @click="gooeyToast.success('Bouncy save', { ...DEMO_DEFAULTS, spring: true })">With Spring (compare)</button>
        </div>
      </div>
    </div>
  </div>
</template>
