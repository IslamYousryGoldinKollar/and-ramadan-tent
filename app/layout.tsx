import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { PageTracker } from '@/components/tracking/page-tracker'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'e& Egypt Ramadan Portal',
  description: 'Reserve your seat at the e& Egypt Corporate Ramadan Tent',
  icons: {
    icon: '/eand-logo.svg',
    shortcut: '/eand-logo.svg',
    apple: '/eand-logo.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'e& Ramadan',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <PageTracker />
          {children}
        </Providers>
      </body>
    </html>
  )
}
