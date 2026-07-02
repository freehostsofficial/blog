'use client'

import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function PostErrorPage({ reset }: Props) {
  return (
    <main id="main-content">
      <div className="container-blog text-center py-24">
        <AlertTriangle className="size-10 mx-auto mb-4 text-primary" aria-hidden="true" />
        <h1 className="text-3xl font-semibold mb-3">Could not load this post</h1>
        <p className="text-muted-foreground mb-8 max-w-[40ch] mx-auto">
          Something went wrong while loading this article. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="default">Try again</Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/posts" />}>Browse all posts</Button>
        </div>
      </div>
    </main>
  )
}
