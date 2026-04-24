import { describe, expect, it } from 'vitest'
import { safeJsonParse } from '../safe-json'

describe('safeJsonParse', () => {
  it('converts integers exceeding MAX_SAFE_INTEGER to strings', () => {
    const json = '{"uid": 7284967114850304000, "email": "a@b.com"}'
    const result = safeJsonParse(json) as Record<string, unknown>
    expect(result.uid).toBe('7284967114850304000')
    expect(result.email).toBe('a@b.com')
  })

  it('leaves small integers as numbers', () => {
    const json = '{"status": 200, "count": 42}'
    const result = safeJsonParse(json) as Record<string, unknown>
    expect(result.status).toBe(200)
    expect(result.count).toBe(42)
  })

  it('leaves MAX_SAFE_INTEGER as a number', () => {
    const json = '{"id": 9007199254740991}'
    const result = safeJsonParse(json) as Record<string, unknown>
    expect(result.id).toBe(9007199254740991)
  })

  it('converts MAX_SAFE_INTEGER + 1 to a string', () => {
    const json = '{"id": 9007199254740992}'
    const result = safeJsonParse(json) as Record<string, unknown>
    expect(result.id).toBe('9007199254740992')
  })

  it('does not double-quote already-quoted strings', () => {
    const json = '{"uid": "7284967114850304000"}'
    const result = safeJsonParse(json) as Record<string, unknown>
    expect(result.uid).toBe('7284967114850304000')
  })

  it('handles negative large integers', () => {
    const json = '{"id": -9007199254740992}'
    const result = safeJsonParse(json) as Record<string, unknown>
    expect(result.id).toBe('-9007199254740992')
  })

  it('handles arrays with large integers', () => {
    const json = '{"ids": [7284967114850304000, 7284967114850304001]}'
    const result = safeJsonParse(json) as Record<string, unknown>
    const ids = result.ids as string[]
    expect(ids[0]).toBe('7284967114850304000')
    expect(ids[1]).toBe('7284967114850304001')
  })

  it('handles nested objects', () => {
    const json = '{"data": {"user": {"uid": 7284967114850304000}}}'
    const result = safeJsonParse(json) as { data: { user: { uid: string } } }
    expect(result.data.user.uid).toBe('7284967114850304000')
  })

  it('passes through non-JSON strings unchanged', () => {
    const text = 'not json'
    expect(() => safeJsonParse(text)).toThrow()
  })
})
