import { getAllNews } from '@/lib/cms'
import AboutClient from './AboutClient'

export default function About() {
  const newsList = getAllNews()

  return <AboutClient newsList={newsList} />
}
