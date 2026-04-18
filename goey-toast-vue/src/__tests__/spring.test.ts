import { DEFAULT_COLLAPSE_DUR, DEFAULT_EXPAND_DUR, squishSpring } from '../spring'

describe('spring', () => {
  it('returns a spring config with scaled mass', () => {
    expect(squishSpring(0.6, 0.6)).toEqual(
      expect.objectContaining({
        type: 'spring',
        mass: 0.7,
      }),
    )
  })

  it('maps bounce=0 to max damping', () => {
    expect(squishSpring(0.6, 0.6, 0).damping).toBe(24)
  })

  it('maps bounce=0.8 to max stiffness', () => {
    expect(squishSpring(0.6, 0.6, 0.8).stiffness).toBe(550)
  })

  it('maps bounce=0.8 to min damping', () => {
    expect(squishSpring(0.6, 0.6, 0.8).damping).toBe(8)
  })

  it('scales mass with duration ratio', () => {
    expect(squishSpring(1.2, 0.6).mass).toBe(1.4)
  })

  it('exports the default durations', () => {
    expect(DEFAULT_EXPAND_DUR).toBe(0.6)
    expect(DEFAULT_COLLAPSE_DUR).toBe(0.9)
  })
})
