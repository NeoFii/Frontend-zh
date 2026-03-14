import { getTokenExpiryTimestamp, isTokenExpiringSoonAt } from '@/lib/token'

describe('token helpers', () => {
  it('subtracts the refresh buffer from token expiry timestamps', () => {
    expect(getTokenExpiryTimestamp(120, 1000)).toBe(91000)
  })

  it('treats missing expiry timestamps as expiring soon', () => {
    expect(isTokenExpiringSoonAt(null, 1000)).toBe(true)
  })

  it('detects tokens that are still valid', () => {
    expect(isTokenExpiringSoonAt(5000, 1000)).toBe(false)
  })

  it('detects expired tokens', () => {
    expect(isTokenExpiringSoonAt(5000, 5000)).toBe(true)
  })
})
