<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)

onErrorCaptured((err) => {
  hasError.value = true
  if (import.meta.env.DEV) {
    console.error('[GooeyToast] Rendering error:', err)
  }
  return false
})
</script>

<template>
  <slot v-if="!hasError" />
</template>
