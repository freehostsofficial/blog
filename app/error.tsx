'use client'

import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ reset }: Props) {
  return (
    <main id="main-content">
      <div className="container" style={{ textAlign: 'center', paddingTop: 'var(--sp-24)', paddingBottom: 'var(--sp-24)' }}>
        <AlertTriangle size={48} style={{ color: 'var(--c-accent)', marginBottom: 'var(--sp-4)' }} aria-hidden="true" />
        <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--sp-3)' }}>Something went wrong</h1>
        <p style={{ color: 'var(--c-text-3)', marginBottom: 'var(--sp-8)', maxWidth: '40ch', marginInline: 'auto' }}>
          An unexpected error occurred. Please try again or return to the homepage.
        </p>
        <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'center' }}>
          <button onClick={reset} className="btn" type="button">
            Try again
          </button>
          <Link href="/" className="btn btn--ghost">
            Go home
          </Link>
        </div>
        <p className="error-digest" style={{ marginTop: 'var(--sp-8)', fontSize: 'var(--text-xs)', color: 'var(--c-text-3)' }} />
      </div>
    </main>
  )
}
