import { PH, morphPath, morphPathCenter, morphPathCenterRaw, morphPathRaw } from '../morph'

describe('morph', () => {
  it('exposes the pill height constant', () => {
    expect(PH).toBe(34)
  })

  it('returns a pill-only path at t=0', () => {
    const path = morphPathRaw(120, 120, 100, 0)

    expect(path).toMatch(/^M 0,/)
    expect(path).not.toContain('L')
  })

  it('returns an expanded blob path at t=1', () => {
    const path = morphPathRaw(120, 120, 200, 1)

    expect(path).toContain('L')
  })

  it('memoizes identical morphPath calls', () => {
    const first = morphPath(120, 120, 200, 1)
    const second = morphPath(120, 120, 200, 1)

    expect(first).toBe(second)
  })

  it('center variant also returns a valid path at t=0', () => {
    const path = morphPathCenterRaw(120, 120, 100, 0)

    expect(path).toMatch(/^M /)
  })

  it('memoizes center variant calls', () => {
    const first = morphPathCenter(120, 120, 200, 1)
    const second = morphPathCenter(120, 120, 200, 1)

    expect(first).toBe(second)
  })
})
