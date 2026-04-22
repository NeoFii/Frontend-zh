import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://eucal.ai'

  return [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/model`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/price`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.6 },
    { url: `${baseUrl}/ecosystem`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/agreement`, lastModified: new Date(), priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), priority: 0.3 },
  ]
}
