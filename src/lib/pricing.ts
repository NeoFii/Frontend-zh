const MICRO_YUAN = 1_000_000

export function formatFenPerMillionTokens(microYuan?: number | null): string {
  if (microYuan == null) return '待配置'
  return `¥${(microYuan / MICRO_YUAN).toFixed(2)}`
}
