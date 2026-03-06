import { fetchNewsListFromApi } from '@/lib/api/news'
import AboutClient from './AboutClient'

// 将 locale 转换为后端 API 需要的 language 参数
// Next.js locale: "zh", "en" -> 后端 language: "zh", "en"
function getLanguageFromLocale(locale: string): string {
  // 处理 locale 变体，如 zh-CN -> zh
  const lang = locale.split('-')[0]
  return lang === 'zh' ? 'zh' : lang === 'en' ? 'en' : 'zh'
}

export default async function About({ params }: { params: { locale: string } }) {
  const language = getLanguageFromLocale(params.locale)
  const { items: newsList } = await fetchNewsListFromApi(1, 20, language)

  return <AboutClient newsList={newsList} />
}
