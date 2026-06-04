import { Skeleton } from '@/components/ui/skeleton'

export default function PostsLoading() {
  return (
    <main id="main-content" aria-busy="true" aria-label="Loading posts">
      <div className="filter-bar" role="navigation" aria-label="Filter posts by category">
        <div className="container">
          <div className="filter-bar-inner">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="badge" width="5rem" style={{ height: '2.25rem' }} />
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        <header className="page-header">
          <Skeleton variant="title" width="10rem" />
          <Skeleton variant="text-sm" width="5rem" style={{ marginTop: 'var(--sp-2)' }} />
        </header>

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
      </div>
    </main>
  )
}
