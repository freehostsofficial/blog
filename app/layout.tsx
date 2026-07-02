import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from 'sonner'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { SITE_NAME, SITE_URL } from '@/lib/config'
import './globals.css'
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

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
      className={cn(geist.variable, "font-sans")}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="min-h-dvh flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider>
            <a href="#main-content" className="skip-link">
              Skip to content
            </a>
            <Nav />
            <div className="flex-1 pt-14">
              {children}
            </div>
            <Footer />
            <Toaster
              position="bottom-right"
              toastOptions={{
                className: "glass-card",
                duration: 3000,
              }}
            />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
