const LARGE_INT_RE = /([:,[\s])(-?\d{16,})(?=\s*[,}\]])/g

function quoteLargeIntegers(jsonText: string): string {
  return jsonText.replace(LARGE_INT_RE, (match, prefix: string, digits: string) => {
    const abs = digits.startsWith('-') ? digits.slice(1) : digits
    if (abs.length > 16 || (abs.length === 16 && abs > '9007199254740991')) {
      return `${prefix}"${digits}"`
    }
    return match
  })
}

export function safeJsonParse(text: string): unknown {
  return JSON.parse(quoteLargeIntegers(text))
}
