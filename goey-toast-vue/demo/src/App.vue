<script setup lang="ts">
import { ref } from 'vue'
import { GooeyToaster } from 'goey-toast-vue'
import 'goey-toast-vue/styles.css'
import './App.css'
import AppHeader from './components/AppHeader.vue'
import ExamplesSection from './components/ExamplesSection.vue'
import BuilderSection from './components/BuilderSection.vue'
import DocsSection from './components/DocsSection.vue'
import type { GooeyToasterProps } from 'goey-toast-vue'

type BuilderCloseButton = false | true | 'top-left' | 'top-right'

const toasterConfig = ref<{
  position: GooeyToasterProps['position']
  theme: NonNullable<GooeyToasterProps['theme']>
  showProgress: boolean
  closeOnEscape: boolean
  closeButton: BuilderCloseButton
}>({
  position: 'top-left',
  theme: 'light',
  showProgress: false,
  closeOnEscape: true,
  closeButton: false,
})

function onBuilderConfigUpdate(config: typeof toasterConfig.value) {
  toasterConfig.value = config
}
</script>

<template>
  <GooeyToaster
    :position="toasterConfig.position"
    :theme="toasterConfig.theme"
    :show-progress="toasterConfig.showProgress"
    :close-on-escape="toasterConfig.closeOnEscape"
    :close-button="toasterConfig.closeButton"
  />
  <AppHeader />
  <div class="project-description">
    <div class="description-container">
      <h2>gooey-toast Vue</h2>
      <p class="description-text">
        Vue 3 port of morphing toast notifications. Organic blob animations, promise tracking, and full customization out of the box.
      </p>
      <p class="tech-stack">
        <span class="tech-badge">Vue 3 Composition API</span>
        <span class="tech-badge">@vueuse/motion</span>
        <span class="tech-badge">OpenCode + oh-my-openagent</span>
      </p>
      <p class="ai-attribution">
        <strong>✨ 99% of the code was written by AI.</strong>
        Check out the original
        <a href="https://github.com/anl331/goey-toast" target="_blank" rel="noopener noreferrer">React version</a>
        for the canonical implementation.
      </p>
    </div>
  </div>
  <div class="two-col" id="examples">
    <ExamplesSection />
    <BuilderSection @update:config="onBuilderConfigUpdate" />
  </div>
  <DocsSection />
  <footer class="site-footer">
    <p>
      Also check out
      <a href="https://gooey-search-tabs.vercel.app" target="_blank" rel="noopener noreferrer">gooey-search-tabs</a>
      — a morphing search bar with animated tabs for React.
    </p>
  </footer>
</template>
