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

watch(politeMessage, (msg, _old, onCleanup) => {
  if (!msg) return
  const t = setTimeout(() => { politeMessage.value = '' }, 7000)
  onCleanup(() => clearTimeout(t))
})

watch(assertiveMessage, (msg, _old, onCleanup) => {
  if (!msg) return
  const t = setTimeout(() => { assertiveMessage.value = '' }, 7000)
  onCleanup(() => clearTimeout(t))
})

const visuallyHidden = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: '0',
} as const
</script>

<template>
  <div role="status" aria-live="polite" aria-atomic="true" :style="visuallyHidden">
    {{ politeMessage }}
  </div>
  <div role="alert" aria-live="assertive" aria-atomic="true" :style="visuallyHidden">
    {{ assertiveMessage }}
  </div>
</template>
