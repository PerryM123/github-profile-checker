import { describe, it, expect } from 'vitest'
import { isExternalLink } from '@/app/utils'

describe('isExternalLink', () => {
  it('httpまたはhttpsの場合、trueを返す', () => {
    expect(isExternalLink('http://google.com')).toBe(true)
    expect(isExternalLink('https://google.com')).toBe(true)
  })
  it('httpまたはhttps以外の場合', () => {
    expect(isExternalLink('/profile-page')).toBe(false)
  })
})
