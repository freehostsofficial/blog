import type { Metadata } from 'next'
import { DM_Serif_Display, Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import Nav from '@/components/Nav'
import { ShortcutOverlay } from '@/components/ShortcutOverlay'
import Footer from '@/components/Footer'
import { ToastContainer } from '@/components/ui/toast'
import { ImageLightbox } from '@/components/ImageLightbox'
import { SITE_NAME, SITE_URL } from '@/lib/config'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} Blog`,
    template: `%s — ${SITE_NAME} Blog`,
  },
  description: 'Guides, tutorials, and news about free web hosting providers.',
  openGraph: {
    type: 'website',
    siteName: `${SITE_NAME} Blog`,
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    types: { 'application/rss+xml': `${SITE_URL}/rss.xml` },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dmSerif.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <Nav />
          <div className="page-body">
            {children}
          </div>
          <Footer />
          <ToastContainer />
          <ImageLightbox />
          <ShortcutOverlay />
        </ThemeProvider>
      </body>
    </html>
  )
}
