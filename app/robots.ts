import { MetadataRoute } from 'next'
import { getServerUrl } from '@/utils/get-server-url'

const disallowPaths = [
  '/api/',
  '/admin/',
  '/book-shelf/',
  '/book-store/',
  '/reviews/',
  '/challenges/',
  '/profile/',
  '/private-review/',
  '/daily-book/',
  '/_next/',
  '/offline/',
];

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getServerUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowPaths,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: disallowPaths,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: disallowPaths,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
