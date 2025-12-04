import {MetadataRoute} from 'next'
import {getServerUrl} from '@/utils/get-server-url'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getServerUrl()

  // Static public routes
    return [
      {
          url: baseUrl,
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority: 1.0,
      },
      {
          url: `${baseUrl}/about`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.8,
      },
      {
          url: `${baseUrl}/login`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.5,
      },
      {
          url: `${baseUrl}/register`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.5,
      },
      {
          url: `${baseUrl}/privacy`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
      },
      {
          url: `${baseUrl}/cookies`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
      },
      {
          url: `${baseUrl}/legal`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
      },
      {
          url: `${baseUrl}/terms`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
      },
  ]
}
