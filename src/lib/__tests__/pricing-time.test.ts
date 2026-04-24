import { formatFenPerMillionTokens } from '@/lib/pricing'
import {
  formatShanghaiDateTimeLocalInput,
  toShanghaiApiDateTime,
} from '@/lib/time'

describe('pricing and Shanghai time utilities', () => {
  it('formats integer fen per million tokens as yuan without changing the stored value', () => {
    expect(formatFenPerMillionTokens(800)).toBe('¥8.00 / 1M tokens')
    expect(formatFenPerMillionTokens(799)).toBe('¥7.99 / 1M tokens')
    expect(formatFenPerMillionTokens(null)).toBe('待配置')
  })

  it('converts datetime-local values to explicit Shanghai API datetimes', () => {
    expect(toShanghaiApiDateTime('2026-04-24T16:45')).toBe('2026-04-24T16:45:00+08:00')
    expect(toShanghaiApiDateTime('2026-04-24T16:45:30+08:00')).toBe('2026-04-24T16:45:30+08:00')
  })

  it('formats Date values as Shanghai datetime-local inputs', () => {
    expect(formatShanghaiDateTimeLocalInput(new Date('2026-04-24T08:45:30Z'))).toBe('2026-04-24T16:45')
  })
})
