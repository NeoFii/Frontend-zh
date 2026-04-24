const SHANGHAI_TIME_ZONE = 'Asia/Shanghai'

const dateTimeFormatter = new Intl.DateTimeFormat('zh-CN', {
  timeZone: SHANGHAI_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

function shanghaiParts(date: Date) {
  return Object.fromEntries(dateTimeFormatter.formatToParts(date).map((part) => [part.type, part.value]))
}

export function formatShanghaiDateTime(value: string | Date | null | undefined): string {
  if (!value) return '-'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return dateTimeFormatter.format(date)
}

export function formatShanghaiDateTimeLocalInput(value: Date = new Date()): string {
  const parts = shanghaiParts(value)
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`
}

export function toShanghaiApiDateTime(value: string | Date | null | undefined): string | undefined {
  if (!value) return undefined
  if (value instanceof Date) {
    const local = formatShanghaiDateTimeLocalInput(value)
    return `${local}:00+08:00`
  }
  if (/[zZ]|[+-]\d{2}:\d{2}$/.test(value)) return value
  return `${value.length === 16 ? `${value}:00` : value}+08:00`
}
