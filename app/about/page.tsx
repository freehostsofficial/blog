import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL } from '@/lib/config'

export const metadata: Metadata = {
  title: 'About',
  description: `Learn about ${SITE_NAME} — a community directory of free web hosting providers.`,
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <main id="main-content">
      <div className="container" style={{ paddingTop: 'var(--sp-16)', paddingBottom: 'var(--sp-24)' }}>
        <h1 style={{ marginBottom: 'var(--sp-8)' }}>About</h1>

        <div className="prose" style={{ maxWidth: 'none' }}>
          <p>
            {SITE_NAME} is a community-driven directory of free web hosting providers.
            We review, compare, and document the best ways to host your projects
            without spending a dime.
          </p>

          <h2>Our mission</h2>
          <p>
            We believe that cost should never be a barrier to learning and creating on the web.
            Whether you are a student building your first site, a developer prototyping an idea,
            or a small team looking to minimize overhead — there are excellent free hosting options
            available.
          </p>

          <h2>What we cover</h2>
          <ul>
            <li><strong>Guides</strong> — Step-by-step tutorials for getting started with various free hosting platforms.</li>
            <li><strong>Comparisons</strong> — Honest, detailed comparisons of features, limits, and performance.</li>
            <li><strong>News</strong> — Updates about new features, policy changes, and industry trends.</li>
            <li><strong>Community</strong> — Spotlights on projects and people building great things on free hosting.</li>
          </ul>

          <h2>Get in touch</h2>
          <p>
            Have a suggestion, correction, or want to contribute? Reach out through our{' '}
            <a href={SITE_URL} target="_blank" rel="noopener noreferrer">main site</a>.
          </p>
        </div>
      </div>
    </main>
  )
}
