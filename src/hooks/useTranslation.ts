// 单语言版本 - 仅加载中文（客户端 Hook）
import { createTranslator } from '@/lib/messages'

export function useTranslation(namespace?: string) {
  return createTranslator(namespace)
}
