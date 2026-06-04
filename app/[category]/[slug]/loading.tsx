import { Skeleton } from '@/components/ui/skeleton'

export default function PostLoading() {
  return (
    <main id="main-content" aria-busy="true" aria-label="Loading post">
      <div className="container">
        <nav className="breadcrumb" aria-label="Loading breadcrumb">
          <Skeleton variant="text-sm" width="3rem" />
          <span className="breadcrumb-sep" aria-hidden="true">/</span>
          <Skeleton variant="text-sm" width="4rem" />
          <span className="breadcrumb-sep" aria-hidden="true">/</span>
          <Skeleton variant="text-sm" width="6rem" />
        </nav>

        <header className="post-header">
          <div className="post-header-meta">
            <Skeleton variant="badge" width="4rem" />
            <Skeleton variant="badge" width="3rem" />
          </div>
          <Skeleton variant="title" width="85%" style={{ height: '2.25rem', marginTop: 'var(--sp-4)' }} />
          <Skeleton variant="title" width="55%" style={{ height: '2.25rem' }} />
          <Skeleton variant="text" width="70%" style={{ marginTop: 'var(--sp-4)' }} />
          <Skeleton variant="text-sm" width="40%" style={{ marginTop: 'var(--sp-2)' }} />
        </header>

        <Skeleton variant="image" style={{ aspectRatio: '21/9', width: '100%', borderRadius: 'var(--r-lg)', margin: 'var(--sp-8) 0 var(--sp-10)' }} />

        <div className="post-layout">
          <article className="prose" aria-label="Loading post content">
            <Skeleton variant="text" width="100%" style={{ marginBottom: 'var(--sp-3)' }} />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="85%" style={{ marginTop: 'var(--sp-3)' }} />
            <Skeleton variant="text" width="100%" style={{ marginTop: 'var(--sp-3)' }} />
            <Skeleton variant="text" width="60%" style={{ marginTop: 'var(--sp-3)' }} />
            <Skeleton variant="text" width="100%" style={{ marginTop: 'var(--sp-3)' }} />
            <Skeleton variant="text" width="75%" style={{ marginTop: 'var(--sp-3)' }} />
            <Skeleton variant="text" width="40%" style={{ marginTop: 'var(--sp-3)' }} />
          </article>
          <aside className="toc-sidebar" aria-label="Loading table of contents">
            <Skeleton variant="text-sm" width="6rem" style={{ marginBottom: 'var(--sp-3)' }} />
            <Skeleton variant="text-sm" width="80%" style={{ marginLeft: '0' }} />
            <Skeleton variant="text-sm" width="60%" style={{ marginTop: 'var(--sp-2)', marginLeft: 'var(--sp-4)' }} />
            <Skeleton variant="text-sm" width="70%" style={{ marginTop: 'var(--sp-2)' }} />
            <Skeleton variant="text-sm" width="50%" style={{ marginTop: 'var(--sp-2)', marginLeft: 'var(--sp-4)' }} />
          </aside>
        </div>

        <section className="post-authors-section" aria-label="Loading authors">
          <div className="author-card">
            <div className="author-card-header">
              <Skeleton variant="avatar" width="3rem" height="3rem" />
              <div>
                <Skeleton variant="title" width="8rem" style={{ height: '1.25rem' }} />
                <Skeleton variant="text-sm" width="6rem" style={{ marginTop: 'var(--sp-1)' }} />
              </div>
            </div>
            <Skeleton variant="text" width="100%" style={{ marginTop: 'var(--sp-3)' }} />
            <Skeleton variant="text" width="75%" />
          </div>
        </section>

        <aside className="related-section" aria-label="Loading related posts">
          <Skeleton variant="text-sm" width="7rem" style={{ marginBottom: 'var(--sp-4)' }} />
          <div className="grid-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <article key={i} className="post-card post-card--compact">
                <div className="post-card-content">
                  <Skeleton variant="text-sm" width="40%" />
                  <Skeleton variant="title" width="90%" style={{ marginTop: 'var(--sp-1)' }} />
                </div>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </main>
  )
}
