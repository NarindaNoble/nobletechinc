import { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'NobleTechInc - Transforming Ideas into Digital Excellence',
  description: 'Innovative technology solutions for modern businesses',
  keywords: [
    'web development',
    'mobile apps',
    'cloud solutions',
    'AI',
    'machine learning',
    'cybersecurity',
    'IoT solutions'
  ],
  authors: [{ name: 'NobleTechInc' }],
  creator: 'NobleTechInc',
  publisher: 'NobleTechInc',
  robots: 'index, follow',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nobletechinc.com',
    siteName: 'NobleTechInc',
    title: 'NobleTechInc - Transforming Ideas into Digital Excellence',
    description: 'Innovative technology solutions for modern businesses',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NobleTechInc'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@nobletechinc',
    creator: '@nobletechinc',
    title: 'NobleTechInc - Transforming Ideas into Digital Excellence',
    description: 'Innovative technology solutions for modern businesses',
    images: ['/twitter-image.jpg']
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
  ],
} 