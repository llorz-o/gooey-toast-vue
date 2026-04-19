<script setup lang="ts">
import { h } from 'vue'
import { gooeyToast } from 'goey-toast-vue'
import type { GooeyToastOptions } from 'goey-toast-vue'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function failAfter(ms: number) {
  return new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Failed')), ms))
}

const DEMO_DEFAULTS = {
  spring: true,
  bounce: 0.3,
  timing: {
    displayDuration: 5000,
  },
} satisfies GooeyToastOptions

function fireDefault() {
  gooeyToast('Notification received', DEMO_DEFAULTS)
}
function fireSuccess() {
  gooeyToast.success('Changes Saved', DEMO_DEFAULTS)
}
function fireError() {
  gooeyToast.error('Something went wrong', DEMO_DEFAULTS)
}
function fireWarning() {
  gooeyToast.warning('Storage is almost full', DEMO_DEFAULTS)
}
function fireInfo() {
  gooeyToast.info('New update available', DEMO_DEFAULTS)
}

function fireWarningDesc() {
  gooeyToast.warning('Your session is about to expire', {
    ...DEMO_DEFAULTS,
    description: "You've been inactive for 25 minutes. Please save your work or your session will end automatically.",
  })
}
function fireErrorDesc() {
  gooeyToast.error('Connection lost', {
    ...DEMO_DEFAULTS,
    description: 'Unable to reach the server. Check your internet connection and try again.',
  })
}

function fireErrorAction() {
  gooeyToast.error('Payment failed', {
    ...DEMO_DEFAULTS,
    description: 'Your card ending in 4242 was declined. Please update your payment method to continue.',
    action: {
      label: 'Update Payment',
      onClick: () => gooeyToast.success('Redirecting...', DEMO_DEFAULTS),
    },
  })
}
function fireActionSuccessPill() {
  gooeyToast.info('Share link ready', {
    ...DEMO_DEFAULTS,
    description: 'Your share link has been generated and is ready to copy.',
    action: {
      label: 'Copy to Clipboard',
      onClick: () => navigator.clipboard.writeText('https://example.com/share/abc123'),
      successLabel: 'Copied!',
    },
  })
}

function fireCustomBody() {
  const row = (label: string, value: string) =>
    h('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '12px' } }, [
      h('span', { style: { color: '#888' } }, label),
      h('span', { style: { fontWeight: 600 } }, value),
    ])

  gooeyToast.success('Deployment complete', {
    ...DEMO_DEFAULTS,
    description: h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '300px' } }, [
      row('Environment', 'Production'),
      row('Branch', 'main @ 3f8a2c1'),
      row('Duration', '2m 14s'),
      h('div', { style: { height: '1px', background: '#e5e5e5' } }),
      h('div', { style: { fontSize: '11px', color: '#888' } }, 'https://my-app.vercel.app'),
    ]),
  })
}

function fireSuccessNoSpring() {
  gooeyToast.success('Changes Saved', { ...DEMO_DEFAULTS, spring: false })
}
function fireErrorDescNoSpring() {
  gooeyToast.error('Connection lost', {
    ...DEMO_DEFAULTS,
    spring: false,
    description: 'Unable to reach the server. Check your internet connection and try again.',
  })
}
function fireActionNoSpring() {
  gooeyToast.info('Share link ready', {
    ...DEMO_DEFAULTS,
    spring: false,
    description: 'Your share link has been generated and is ready to copy.',
    action: {
      label: 'Copy to Clipboard',
      onClick: () => navigator.clipboard.writeText('https://example.com/share/abc123'),
      successLabel: 'Copied!',
    },
  })
}

function firePromiseSuccessPill() {
  gooeyToast.promise(sleep(2000), {
    ...DEMO_DEFAULTS,
    loading: 'Saving...',
    success: 'Changes Saved',
    error: 'Something went wrong',
  })
}
function firePromiseErrorPill() {
  gooeyToast.promise(failAfter(2000), {
    ...DEMO_DEFAULTS,
    loading: 'Saving...',
    success: 'Changes Saved',
    error: 'Something went wrong',
  })
}
function firePromiseErrorExpanded() {
  gooeyToast.promise(failAfter(2000), {
    ...DEMO_DEFAULTS,
    loading: 'Uploading file...',
    success: 'Upload complete',
    error: 'Upload failed',
    description: {
      error: "You've used 95% of your available storage. Please upgrade and plan to continue.",
    },
    action: {
      error: {
        label: 'Action Button',
        onClick: () => gooeyToast.info('Retrying...', DEMO_DEFAULTS),
      },
    },
  })
}
function firePromiseSuccessExpanded() {
  gooeyToast.promise(sleep(2000), {
    ...DEMO_DEFAULTS,
    loading: 'Processing...',
    success: 'All done!',
    error: 'Failed',
    description: {
      success: 'Your data has been processed and saved successfully.',
    },
  })
}

function fireUpdateToast() {
  const spinIcon = h('svg', {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2.5',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    style: { animation: 'gooey-spin 1s linear infinite' },
  }, [
    h('path', { d: 'M21 12a9 9 0 1 1-6.22-8.56' }),
  ])
  const id = gooeyToast('Uploading...', { ...DEMO_DEFAULTS, icon: spinIcon })
  setTimeout(() => {
    gooeyToast.update(id, {
      title: 'Upload complete!',
      type: 'success',
      icon: null,
      description: 'Your file has been uploaded and processed.',
    })
  }, 2000)
}

function fireProgressBar() {
  gooeyToast.info('Downloading update...', {
    ...DEMO_DEFAULTS,
    description: 'This may take a moment.',
    showProgress: true,
  })
}

function fireCallback() {
  gooeyToast.info('Watch me disappear', {
    ...DEMO_DEFAULTS,
    onDismiss: () => {
      gooeyToast.success('Previous toast dismissed!', DEMO_DEFAULTS)
    },
  })
}
</script>

<template>
  <div class="examples">
    <div class="examples-header">
      <h2>Examples</h2>
      <span>Click to preview</span>
    </div>

    <div class="section">
      <div class="section-label">Toast Types</div>
      <div class="buttons">
        <button @click="fireDefault">Default</button>
        <button @click="fireSuccess">Success</button>
        <button @click="fireError">Error</button>
        <button @click="fireWarning">Warning</button>
        <button @click="fireInfo">Info</button>
      </div>
    </div>

    <div class="section">
      <div class="section-label">With Description</div>
      <div class="buttons">
        <button @click="fireWarningDesc">Warning + Description</button>
        <button @click="fireErrorDesc">Error + Description</button>
      </div>
    </div>

    <div class="section">
      <div class="section-label">With Action Button</div>
      <div class="buttons">
        <button @click="fireErrorAction">Error + Action</button>
        <button @click="fireActionSuccessPill">Action + Success Pill</button>
      </div>
    </div>

    <div class="section">
      <div class="section-label">Custom Component Body</div>
      <div class="buttons">
        <button @click="fireCustomBody">VNode Description</button>
      </div>
    </div>

    <div class="section">
      <div class="section-label">No Spring (Smooth Easing)</div>
      <div class="buttons">
        <button @click="fireSuccessNoSpring">Success (no spring)</button>
        <button @click="fireErrorDescNoSpring">Error + Desc (no spring)</button>
        <button @click="fireActionNoSpring">Action (no spring)</button>
      </div>
    </div>

    <div class="section">
      <div class="section-label">Promise (Morph Animation)</div>
      <div class="buttons">
        <button @click="firePromiseSuccessPill">Promise + Success (pill)</button>
        <button @click="firePromiseErrorPill">Promise + Error (pill)</button>
        <button @click="firePromiseErrorExpanded">Promise + Error (expanded)</button>
        <button @click="firePromiseSuccessExpanded">Promise + Success (expanded)</button>
      </div>
    </div>

    <div class="section">
      <div class="section-label">Update Toast</div>
      <div class="buttons">
        <button @click="fireUpdateToast">Update Toast</button>
      </div>
    </div>

    <div class="section">
      <div class="section-label">Progress Bar</div>
      <div class="buttons">
        <button @click="fireProgressBar">Progress Bar</button>
      </div>
    </div>

    <div class="section">
      <div class="section-label">Callbacks</div>
      <div class="buttons">
        <button @click="fireCallback">With Callback</button>
      </div>
    </div>
  </div>
</template>
