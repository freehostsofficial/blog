'use client'

import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function PostErrorPage({ reset }: Props) {
  return (
    <main id="main-content">
      <div className="container" style={{ textAlign: 'center', paddingTop: 'var(--sp-24)', paddingBottom: 'var(--sp-24)' }}>
        <AlertTriangle size={48} style={{ color: 'var(--c-accent)', marginBottom: 'var(--sp-4)' }} aria-hidden="true" />
        <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--sp-3)' }}>Could not load this post</h1>
        <p style={{ color: 'var(--c-text-3)', marginBottom: 'var(--sp-8)', maxWidth: '40ch', marginInline: 'auto' }}>
          Something went wrong while loading this article. Please try again.
        </p>
        <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'center' }}>
          <button onClick={reset} className="btn" type="button">
            Try again
          </button>
          <Link href="/posts" className="btn btn--ghost">
            Browse all posts
          </Link>
        </div>
      </div>
    </main>
  )
}
