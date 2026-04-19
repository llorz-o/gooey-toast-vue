<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { animationPresets, gooeyToast } from 'goey-toast-vue'
import type { AnimationPresetName, GooeyToastOptions, GooeyToasterProps } from 'goey-toast-vue'

type BuilderToastType = 'default' | 'success' | 'error' | 'warning' | 'info'
type BuilderCloseButton = false | true | 'top-left' | 'top-right'

const POSITIONS: GooeyToasterProps['position'][] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]

const TOAST_TYPES: BuilderToastType[] = ['default', 'success', 'error', 'warning', 'info']
const PRESET_NAMES = Object.keys(animationPresets) as AnimationPresetName[]
const CLOSE_BUTTON_POSITIONS: Extract<BuilderCloseButton, 'top-left' | 'top-right'>[] = ['top-left', 'top-right']
const THEMES: NonNullable<GooeyToasterProps['theme']>[] = ['light', 'dark']

const emit = defineEmits<{
  'update:config': [config: {
    position: GooeyToasterProps['position']
    theme: NonNullable<GooeyToasterProps['theme']>
    showProgress: boolean
    closeOnEscape: boolean
    closeButton: BuilderCloseButton
  }]
}>()

const bPosition = ref<GooeyToasterProps['position']>('top-left')
const bType = ref<BuilderToastType>('success')
const bTitle = ref('Changes saved')
const bHasDesc = ref(true)
const bDesc = ref('Your changes have been saved and synced successfully.')
const bHasAction = ref(false)
const bActionLabel = ref('Undo')
const bFillColor = ref('#ffffff')
const bHasBorder = ref(false)
const bBorderColor = ref('#E0E0E0')
const bBorderWidth = ref(1.5)
const bDisplayDuration = ref(4000)
const bSpring = ref(true)
const bBounce = ref(0.4)
const bPreset = ref<AnimationPresetName | null>(null)
const bTheme = ref<'light' | 'dark'>('light')
const bShowProgress = ref(false)
const bCloseOnEscape = ref(true)
const bShowTimestamp = ref(true)
const bCloseButton = ref<BuilderCloseButton>(false)
const copied = ref(false)

let copiedTimer: ReturnType<typeof setTimeout> | undefined

function dataActive(active: boolean) {
  return active ? 'true' : undefined
}

function quoteString(value: string) {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`
}

function fireBuilderToast() {
  const options: GooeyToastOptions = {}

  if (bHasDesc.value && bDesc.value) options.description = bDesc.value
  if (bHasAction.value && bActionLabel.value) {
    options.action = {
      label: bActionLabel.value,
      onClick: () => {},
      successLabel: 'Done!',
    }
  }
  if (bFillColor.value !== '#ffffff') options.fillColor = bFillColor.value
  if (bHasBorder.value && bBorderColor.value) {
    options.borderColor = bBorderColor.value
    options.borderWidth = bBorderWidth.value
  }
  if (bDisplayDuration.value !== 4000) {
    options.timing = { displayDuration: bDisplayDuration.value }
  }
  if (bPreset.value) {
    options.preset = bPreset.value
  } else {
    if (!bSpring.value) options.spring = false
    options.bounce = bBounce.value
  }
  if (bShowProgress.value) options.showProgress = true
  if (!bShowTimestamp.value) options.showTimestamp = false

  if (bType.value === 'default') {
    gooeyToast(bTitle.value, options)
    return
  }

  const toastMethod = gooeyToast[bType.value]
  toastMethod(bTitle.value, options)
}

function togglePreset(preset: AnimationPresetName) {
  if (bPreset.value === preset) {
    bPreset.value = null
    return
  }

  bPreset.value = preset
  const config = animationPresets[preset]
  bSpring.value = config.spring
  bBounce.value = config.bounce
}

function toggleSpring() {
  bSpring.value = !bSpring.value
  bPreset.value = null
}

function updateBounce(value: number) {
  bBounce.value = value
  bPreset.value = null
}

async function copyCode() {
  await navigator.clipboard.writeText(generatedCode.value)
  copied.value = true
  if (copiedTimer) clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => {
    copied.value = false
  }, 1500)
}

const generatedCode = computed(() => {
  const lines: string[] = []
  const hasFill = bFillColor.value !== '#ffffff'
  const hasBorder = bHasBorder.value && !!bBorderColor.value
  const hasPreset = bPreset.value != null
  const hasSpringOff = !hasPreset && !bSpring.value
  const hasBounce = !hasPreset && bBounce.value !== 0.4
  const hasOpts =
    (bHasDesc.value && !!bDesc.value) ||
    (bHasAction.value && !!bActionLabel.value) ||
    hasFill ||
    hasBorder ||
    hasPreset ||
    hasSpringOff ||
    hasBounce ||
    bShowProgress.value ||
    !bShowTimestamp.value ||
    bDisplayDuration.value !== 4000
  const call = bType.value === 'default' ? 'gooeyToast' : `gooeyToast.${bType.value}`

  const toasterProps = [`position="${bPosition.value}"`]
  if (bTheme.value !== 'light') toasterProps.push(`theme="${bTheme.value}"`)
  if (bShowProgress.value) toasterProps.push('show-progress')
  if (!bCloseOnEscape.value) toasterProps.push(':close-on-escape="false"')
  if (bCloseButton.value === true) toasterProps.push('close-button')
  else if (bCloseButton.value === 'top-left') toasterProps.push('close-button="top-left"')
  else if (bCloseButton.value === 'top-right') toasterProps.push('close-button="top-right"')

  lines.push('<template>')
  lines.push(`  <GooeyToaster ${toasterProps.join(' ')} />`)
  lines.push('  <button @click="showToast">Show Toast</button>')
  lines.push('</template>')
  lines.push('')
  lines.push('<script setup lang="ts">')
  lines.push("import { GooeyToaster, gooeyToast } from 'goey-toast-vue'")
  lines.push('')

  if (!hasOpts) {
    lines.push('function showToast() {')
    lines.push(`  ${call}(${quoteString(bTitle.value)})`)
    lines.push('}')
    lines.push('</scr' + 'ipt>')
    return lines.join('\n')
  }

  lines.push('function showToast() {')
  lines.push(`  ${call}(${quoteString(bTitle.value)}, {`)
  if (bHasDesc.value && bDesc.value) lines.push(`  description: ${quoteString(bDesc.value)},`)
  if (bHasAction.value && bActionLabel.value) {
    lines.push('  action: {')
    lines.push(`    label: ${quoteString(bActionLabel.value)},`)
    lines.push('    onClick: () => {},')
    lines.push(`    successLabel: ${quoteString('Done!')},`)
    lines.push('  },')
  }
  if (hasFill) lines.push(`  fillColor: ${quoteString(bFillColor.value)},`)
  if (hasBorder) {
    lines.push(`  borderColor: ${quoteString(bBorderColor.value)},`)
    lines.push(`  borderWidth: ${bBorderWidth.value},`)
  }
  if (hasPreset) lines.push(`  preset: ${quoteString(bPreset.value!)},`)
  if (hasSpringOff) lines.push('  spring: false,')
  if (hasBounce) lines.push(`  bounce: ${bBounce.value},`)
  if (bShowProgress.value) lines.push('  showProgress: true,')
  if (!bShowTimestamp.value) lines.push('  showTimestamp: false,')
  if (bDisplayDuration.value !== 4000) {
    lines.push('  timing: {')
    lines.push(`    displayDuration: ${bDisplayDuration.value},`)
    lines.push('  },')
  }
  lines.push('})')
  lines.push('}')
  lines.push('</scr' + 'ipt>')

  return lines.join('\n')
})

watch([bPosition, bTheme, bShowProgress, bCloseOnEscape, bCloseButton], () => {
  emit('update:config', {
    position: bPosition.value,
    theme: bTheme.value,
    showProgress: bShowProgress.value,
    closeOnEscape: bCloseOnEscape.value,
    closeButton: bCloseButton.value,
  })
}, { immediate: true })

onBeforeUnmount(() => {
  if (copiedTimer) clearTimeout(copiedTimer)
})
</script>

<template>
  <div class="builder" id="builder">
    <div class="builder-header">
      <h2>Builder</h2>
      <p>Design and test your toast in real time.</p>
    </div>

    <div class="builder-card builder-controls">
      <div class="builder-row builder-group">
        <div class="builder-label builder-group-label">Position</div>
        <div class="type-pills position-pills">
          <button
            v-for="position in POSITIONS"
            :key="position"
            type="button"
            class="type-pill"
            data-type="position"
            :data-active="dataActive(bPosition === position)"
            @click="bPosition = position"
          >
            {{ position }}
          </button>
        </div>
      </div>

      <div class="builder-row builder-group">
        <div class="builder-label builder-group-label">Type</div>
        <div class="type-pills">
          <button
            v-for="type in TOAST_TYPES"
            :key="type"
            type="button"
            class="type-pill"
            :data-type="type"
            :data-active="dataActive(bType === type)"
            @click="bType = type"
          >
            {{ type }}
          </button>
        </div>
      </div>

      <div class="builder-row builder-group">
        <div class="builder-label builder-group-label">Title</div>
        <input
          v-model="bTitle"
          class="builder-input"
          placeholder="Toast title..."
        />
      </div>

      <div class="builder-row builder-group">
        <div class="toggle-row">
          <span class="toggle-row-label">Description</span>
          <button
            type="button"
            class="toggle toggle-switch"
            :data-on="dataActive(bHasDesc)"
            @click="bHasDesc = !bHasDesc"
          >
            <div class="toggle-knob toggle-thumb" />
          </button>
        </div>
        <textarea
          v-if="bHasDesc"
          v-model="bDesc"
          class="builder-input"
          style="margin-top: 10px"
          placeholder="Description text..."
        />
      </div>

      <div class="builder-row builder-group">
        <div class="toggle-row">
          <span class="toggle-row-label">Action Button</span>
          <button
            type="button"
            class="toggle toggle-switch"
            :data-on="dataActive(bHasAction)"
            @click="bHasAction = !bHasAction"
          >
            <div class="toggle-knob toggle-thumb" />
          </button>
        </div>
        <input
          v-if="bHasAction"
          v-model="bActionLabel"
          class="builder-input"
          style="margin-top: 10px"
          placeholder="Button label..."
        />
      </div>

      <div class="builder-row builder-group">
        <div class="builder-label builder-group-label">Style</div>
        <div class="style-controls">
          <div class="color-row">
            <span class="color-row-label">Fill Color</span>
            <div class="color-picker-group">
              <input
                v-model="bFillColor"
                type="color"
                class="color-input"
              />
              <input
                v-model="bFillColor"
                class="builder-input color-hex"
                placeholder="#ffffff"
              />
            </div>
          </div>

          <div class="border-section">
            <div class="toggle-row">
              <span class="toggle-row-label">Border</span>
              <button
                type="button"
                class="toggle toggle-switch"
                :data-on="dataActive(bHasBorder)"
                @click="bHasBorder = !bHasBorder"
              >
                <div class="toggle-knob toggle-thumb" />
              </button>
            </div>

            <div v-if="bHasBorder" class="border-controls">
              <div class="color-row">
                <span class="color-row-label">Color</span>
                <div class="color-picker-group">
                  <input
                    v-model="bBorderColor"
                    type="color"
                    class="color-input"
                  />
                  <input
                    v-model="bBorderColor"
                    class="builder-input color-hex"
                    placeholder="#E0E0E0"
                  />
                </div>
              </div>

              <div class="slider-item">
                <div class="slider-item-header">
                  <span class="slider-item-label">Width</span>
                  <span class="slider-item-value slider-value">{{ bBorderWidth }}px</span>
                </div>
                <input
                  :value="bBorderWidth"
                  type="range"
                  class="slider"
                  min="0.5"
                  max="4"
                  step="0.5"
                  @input="bBorderWidth = Number(($event.target as HTMLInputElement).value)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="builder-row builder-group">
        <div class="builder-label builder-group-label">Timing</div>
        <div class="slider-group">
          <div class="slider-item">
            <div class="slider-item-header">
              <span class="slider-item-label">Display Duration</span>
              <span class="slider-item-value slider-value">{{ (bDisplayDuration / 1000).toFixed(1) }}s</span>
            </div>
            <input
              :value="bDisplayDuration"
              type="range"
              class="slider"
              min="1000"
              max="20000"
              step="500"
              @input="bDisplayDuration = Number(($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
      </div>

      <div class="builder-row builder-group">
        <div class="builder-label builder-group-label">Animation Preset</div>
        <div class="type-pills">
          <button
            v-for="preset in PRESET_NAMES"
            :key="preset"
            type="button"
            class="type-pill"
            data-type="position"
            :data-active="dataActive(bPreset === preset)"
            @click="togglePreset(preset)"
          >
            {{ preset }}
          </button>
        </div>
      </div>

      <div class="builder-row builder-group">
        <div class="builder-label builder-group-label">Spring Effect</div>
        <div class="slider-group">
          <div class="slider-item">
            <div class="slider-item-header">
              <span class="slider-item-label">{{ bSpring ? `Bounce: ${bBounce.toFixed(2)}` : 'Off' }}</span>
              <button
                type="button"
                class="toggle toggle-switch"
                :data-on="dataActive(bSpring)"
                style="transform: scale(0.85)"
                @click="toggleSpring"
              >
                <div class="toggle-knob toggle-thumb" />
              </button>
            </div>
            <input
              v-if="bSpring"
              :value="bBounce"
              type="range"
              class="slider"
              min="0.05"
              max="0.8"
              step="0.05"
              @input="updateBounce(Number(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>
      </div>

      <div class="builder-row builder-group">
        <div class="builder-label builder-group-label">Theme</div>
        <div class="type-pills">
          <button
            v-for="theme in THEMES"
            :key="theme"
            type="button"
            class="type-pill"
            data-type="position"
            :data-active="dataActive(bTheme === theme)"
            @click="bTheme = theme"
          >
            {{ theme }}
          </button>
        </div>
      </div>

      <div class="builder-row builder-group">
        <div class="toggle-row">
          <span class="toggle-row-label">Show Progress</span>
          <button
            type="button"
            class="toggle toggle-switch"
            :data-on="dataActive(bShowProgress)"
            @click="bShowProgress = !bShowProgress"
          >
            <div class="toggle-knob toggle-thumb" />
          </button>
        </div>
      </div>

      <div class="builder-row builder-group">
        <div class="toggle-row">
          <span class="toggle-row-label">Close on Escape</span>
          <button
            type="button"
            class="toggle toggle-switch"
            :data-on="dataActive(bCloseOnEscape)"
            @click="bCloseOnEscape = !bCloseOnEscape"
          >
            <div class="toggle-knob toggle-thumb" />
          </button>
        </div>
      </div>

      <div class="builder-row builder-group">
        <div class="toggle-row">
          <span class="toggle-row-label">Show Timestamp</span>
          <button
            type="button"
            class="toggle toggle-switch"
            :data-on="dataActive(bShowTimestamp)"
            @click="bShowTimestamp = !bShowTimestamp"
          >
            <div class="toggle-knob toggle-thumb" />
          </button>
        </div>
      </div>

      <div class="builder-row builder-group">
        <div class="toggle-row">
          <span class="toggle-row-label">Close Button</span>
          <button
            type="button"
            class="toggle toggle-switch"
            :data-on="dataActive(bCloseButton !== false)"
            @click="bCloseButton = bCloseButton === false ? 'top-left' : false"
          >
            <div class="toggle-knob toggle-thumb" />
          </button>
        </div>
      </div>

      <div v-if="bCloseButton !== false" class="builder-row builder-group">
        <div class="builder-label builder-group-label">Close Button Position</div>
        <div class="type-pills">
          <button
            v-for="position in CLOSE_BUTTON_POSITIONS"
            :key="position"
            type="button"
            class="type-pill"
            data-type="position"
            :data-active="dataActive(bCloseButton === position)"
            @click="bCloseButton = position"
          >
            {{ position }}
          </button>
        </div>
      </div>

      <div class="builder-row builder-group">
        <button type="button" class="fire-btn" @click="fireBuilderToast">
          Fire Toast
        </button>
      </div>

      <div class="builder-code">
        <button type="button" class="code-copy-btn" @click="copyCode">
          {{ copied ? 'Copied!' : 'Copy' }}
        </button>
        <pre><code>{{ generatedCode }}</code></pre>
      </div>
    </div>
  </div>
</template>
