import { Skeleton } from '@/components/ui/skeleton'

export default function RootLoading() {
  return (
    <main id="main-content" aria-busy="true" aria-label="Loading page content">
      <div className="container home-featured">
        <div className="post-card post-card--featured">
          <div className="post-card-content">
            <Skeleton variant="badge" />
            <Skeleton variant="title" width="75%" style={{ marginTop: 'var(--sp-4)' }} />
            <Skeleton variant="text" width="55%" style={{ marginTop: 'var(--sp-2)' }} />
            <Skeleton variant="text-sm" width="40%" style={{ marginTop: 'var(--sp-1)' }} />
          </div>
          <Skeleton variant="image" style={{ width: '40%', aspectRatio: '4/3', flexShrink: 0 }} />
        </div>
      </div>

      <div className="container">
        <Skeleton variant="badge" width="4rem" />
      </div>

      <section className="container" aria-label="Loading latest posts">
        <div className="post-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <article key={i} className="post-card">
              <Skeleton variant="image" />
              <div className="post-card-content">
                <Skeleton variant="text-sm" width="30%" />
                <Skeleton variant="title" width="90%" style={{ marginTop: 'var(--sp-2)' }} />
                <Skeleton variant="text" width="100%" style={{ marginTop: 'var(--sp-2)' }} />
                <Skeleton variant="text" width="65%" />
              </div>
            </article>
          ))}
        </div>
        <div style={{ textAlign: 'center', padding: 'var(--sp-8) 0' }}>
          <Skeleton variant="badge" width="8rem" />
        </div>
      </section>

      <section className="container home-categories">
        <Skeleton variant="badge" width="7rem" style={{ marginBottom: 'var(--sp-4)' }} />
        <nav aria-label="Loading categories" style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="badge" width={`${3 + (i % 3)}rem`} />
          ))}
        </nav>
      </section>
    </main>
  )
}
