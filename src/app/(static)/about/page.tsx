import { fetchNewsListFromApi } from '@/lib/api/news'
import AboutClient from './AboutClient'

export default async function About() {
  const { items: newsList } = await fetchNewsListFromApi(1, 20)

  return <AboutClient newsList={newsList} />
}
