/**
 * 密码强度计算工具测试
 */

import { getPasswordStrength } from '@/lib/utils/password'

describe('getPasswordStrength', () => {
  it('空密码应返回零级强度', () => {
    expect(getPasswordStrength('')).toEqual({
      level: 0,
      text: '',
      color: '',
    })
  })

  it('仅小写字母应返回弱强度', () => {
    const result = getPasswordStrength('abcdefgh')
    expect(result.level).toBe(1)
    expect(result.text).toBe('weak')
  })

  it('8位以上包含大小写应返回中等强度', () => {
    const result = getPasswordStrength('Abcdefgh')
    expect(result.level).toBe(2)
    expect(result.text).toBe('fair')
  })

  it('包含数字应增加强度', () => {
    const result = getPasswordStrength('Abcdefgh1')
    expect(result.level).toBe(3)
    expect(result.text).toBe('strong')
  })

  it('包含特殊字符应返回非常强', () => {
    const result = getPasswordStrength('Abcdefgh1!')
    expect(result.level).toBe(4)
    expect(result.text).toBe('veryStrong')
  })

  it('12位以上应额外增加强度', () => {
    const result = getPasswordStrength('Abcdefghijk1!')
    expect(result.level).toBe(4)
  })

  it('仅数字应返回弱强度', () => {
    const result = getPasswordStrength('12345678')
    expect(result.level).toBe(1)
  })

  it('混合大小写数字特殊字符应返回非常强', () => {
    const result = getPasswordStrength('Aa1!Bb2@Cc3#')
    expect(result.level).toBe(4)
  })
})
