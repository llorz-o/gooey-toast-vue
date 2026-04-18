import { ref, onMounted, onUnmounted, readonly, type Ref } from 'vue'

const QUERY = '(prefers-reduced-motion: reduce)'

export function usePrefersReducedMotion(): Readonly<Ref<boolean>> {
  const prefersReducedMotion = ref(
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(QUERY).matches
      : false,
  )

  let mql: MediaQueryList | null = null
  const handler = (e: MediaQueryListEvent) => {
    prefersReducedMotion.value = e.matches
  }

  onMounted(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    mql = window.matchMedia(QUERY)
    mql.addEventListener('change', handler)
  })

  onUnmounted(() => {
    mql?.removeEventListener('change', handler)
  })

  return readonly(prefersReducedMotion)
}
