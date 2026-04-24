export function formatFenPerMillionTokens(fen?: number | null): string {
  if (fen == null) return '待配置'
  return `¥${(fen / 100).toFixed(2)} / 1M tokens`
}
