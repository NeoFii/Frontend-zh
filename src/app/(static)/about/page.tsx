import { fetchNewsListFromApi } from '@/lib/api/news'
import AboutClient from './AboutClient'

export default async function About() {
  const language = 'en'
  const { items: newsList } = await fetchNewsListFromApi(1, 20, language)

  return <AboutClient newsList={newsList} />
}
