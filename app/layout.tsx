import type { Metadata, Viewport } from 'next'
import { GeistSans, GeistMono } from 'geist/font'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'CyberShield - Cyber Awareness Platform',
  description:
    'Learn about cybersecurity threats, malware, and best practices to protect yourself online',
  keywords: [
    'cybersecurity',
    'malware',
    'phishing',
    'awareness',
    'education',
    'online safety',
  ],
  authors: [{ name: 'CyberShield Team' }],
  creator: 'CyberShield',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: defaultUrl,
    title: 'CyberShield - Cyber Awareness Platform',
    description:
      'Learn about cybersecurity threats, malware, and best practices',
    siteName: 'CyberShield',
    images: [
      {
        url: `${defaultUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'CyberShield',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CyberShield - Cyber Awareness Platform',
    description: 'Learn about cybersecurity threats and best practices',
    creator: '@cybershield',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
