/**
 * 中文文案工具
 * 从 zh.json 中按 key 路径取值，支持参数插值
 * 提取 useTranslation (客户端) 和 getTranslation (服务端) 的共享逻辑
 */

import messages from '@/messages/zh.json'

/** 从嵌套对象中按点分路径取值 */
export function getNestedValue(obj: unknown, keys: string[]): string | undefined {
  let result = obj
  for (const k of keys) {
    if (result == null || typeof result !== 'object') return undefined
    result = (result as Record<string, unknown>)[k]
  }
  return typeof result === 'string' ? result : undefined
}

/** 创建文案查找函数 */
export function createTranslator(namespace?: string) {
  const t = (key: string, params?: Record<string, string | number>): string => {
    const fullKey = namespace ? `${namespace}.${key}` : key
    const value = getNestedValue(messages, fullKey.split('.'))

    // key 不存在时警告（仅开发环境）
    if (value === undefined) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[i18n] Missing translation key: "${fullKey}"`)
      }
      return fullKey // 回退到 key 本身
    }

    // 支持参数插值，如 t('welcome', { name: 'Alice' }) → "Hello, Alice"
    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, k) =>
        params[k] !== undefined ? String(params[k]) : `{${k}}`
      )
    }

    return value
  }

  return { t }
}
