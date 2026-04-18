export const DEFAULT_EXPAND_DUR = 0.6
export const DEFAULT_COLLAPSE_DUR = 0.9
export const SMOOTH_EASE = [0.4, 0, 0.2, 1] as const

// bounce 0.0 = heavily damped (subtle), 0.8 = very bouncy (dramatic)
export function squishSpring(durationSec: number, defaultDur: number, bounce = 0.4) {
  const scale = durationSec / defaultDur
  const stiffness = 200 + bounce * 437.5
  const damping = 24 - bounce * 20
  const mass = 0.7 * scale
  return { type: 'spring' as const, stiffness, damping, mass }
}
