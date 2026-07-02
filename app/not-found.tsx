import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page not found',
}

export default function NotFound() {
  return (
    <main id="main-content">
      <div className="container-blog text-center py-24">
        <h1 className="text-6xl font-semibold mb-4">404</h1>
        <p className="text-lg text-muted-foreground mb-8">Page not found</p>
        <Button variant="default" nativeButton={false} render={<Link href="/" />}>Go home</Button>
      </div>
    </main>
  )
}
