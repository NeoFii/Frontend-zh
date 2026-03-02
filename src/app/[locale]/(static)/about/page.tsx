import { getAllNews } from '@/lib/cms'
import AboutClient from './AboutClient'

export default function About({ params }: { params: { locale: string } }) {
  const newsList = getAllNews(params.locale)

  return <AboutClient newsList={newsList} />
}
