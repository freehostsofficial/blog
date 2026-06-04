import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page not found',
}

export default function NotFound() {
  return (
    <main id="main-content">
      <div className="container" style={{ textAlign: 'center', paddingTop: 'var(--sp-24)', paddingBottom: 'var(--sp-24)' }}>
        <h1 style={{ fontSize: 'var(--text-5xl)', marginBottom: 'var(--sp-4)' }}>404</h1>
        <p style={{ fontSize: 'var(--text-lg)', color: 'var(--c-text-2)', marginBottom: 'var(--sp-8)' }}>
          Page not found
        </p>
        <Link href="/" className="btn btn--primary">
          Go home
        </Link>
      </div>
    </main>
  )
}
