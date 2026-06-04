import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
export const metadata: Metadata = {
  title: 'Archive',
  description: 'Browse all posts by date.',
  alternates: { canonical: '/archive' },
}

export default function ArchivePage() {
  const allPosts = getAllPosts().filter(p => p.tags.includes('archive'))

  interface YearGroup {
    year: number
    months: { month: number; posts: Array<{ slug: string; title: string; date: string; category: string }> }[]
  }

  const groups: YearGroup[] = []
  for (const post of allPosts) {
    const d = new Date(post.date)
    const year = d.getFullYear()
    const month = d.getMonth()

    let yearGroup = groups.find(yg => yg.year === year)
    if (!yearGroup) {
      yearGroup = { year, months: [] }
      groups.push(yearGroup)
    }

    const monthGroup = yearGroup.months.find(mg => mg.month === month)
    if (monthGroup) {
      monthGroup.posts.push({ slug: post.slug, title: post.title, date: post.date, category: post.category })
    } else {
      yearGroup.months.push({ month, posts: [{ slug: post.slug, title: post.title, date: post.date, category: post.category }] })
    }
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  return (
    <main id="main-content">
      <div className="container">
        <header className="page-header">
          <h1>Archive</h1>
          <p>{allPosts.length} archived {allPosts.length === 1 ? 'article' : 'articles'}</p>
        </header>

        {allPosts.length === 0 ? (
          <p style={{ textAlign: 'center', padding: 'var(--sp-16) 0', color: 'var(--c-text-3)' }}>
            No archived posts yet.
          </p>
        ) : (
          groups.map(yg => (
            <section key={yg.year} aria-label={`Posts from ${yg.year}`}>
              <h2 className="archive-year">{yg.year}</h2>
              {yg.months.map(mg => (
                <div key={`${yg.year}-${mg.month}`}>
                  <h3 className="archive-month">{monthNames[mg.month]}</h3>
                  {mg.posts.map(post => (
                    <article key={post.slug} className="archive-item">
                      <span className="archive-date">
                        {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                      <Link href={`/${post.category}/${post.slug}`} className="archive-title">
                        {post.title}
                      </Link>
                    </article>
                  ))}
                </div>
              ))}
            </section>
          ))
        )}
      </div>
    </main>
  )
}
