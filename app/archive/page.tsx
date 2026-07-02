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
    let yg = groups.find(g => g.year === year)
    if (!yg) { yg = { year, months: [] }; groups.push(yg) }
    const mg = yg.months.find(m => m.month === month)
    if (mg) { mg.posts.push({ slug: post.slug, title: post.title, date: post.date, category: post.category }) }
    else { yg.months.push({ month, posts: [{ slug: post.slug, title: post.title, date: post.date, category: post.category }] }) }
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  return (
    <main id="main-content">
      <div className="container-blog">
        <header className="pb-8 mb-10 border-b border-glass-border pt-12">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Archive</h1>
          <p className="text-muted-foreground">{allPosts.length} archived {allPosts.length === 1 ? 'article' : 'articles'}</p>
        </header>

        {allPosts.length === 0 ? (
          <p className="text-center py-16 text-muted-foreground">No archived posts yet.</p>
        ) : (
          groups.map(yg => (
            <section key={yg.year} aria-label={`Posts from ${yg.year}`}>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-6 mt-10 italic">{yg.year}</h2>
              {yg.months.map(mg => (
                <div key={`${yg.year}-${mg.month}`}>
                  <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3 mt-6">{monthNames[mg.month]}</h3>
                  {mg.posts.map(post => (
                    <article key={post.slug} className="grid grid-cols-[5rem_1fr] gap-3 items-baseline py-2 px-2 -mx-2 border-b border-glass-border rounded-sm hover:bg-accent/30 transition-colors">
                      <span className="text-xs text-muted-foreground font-mono">
                        {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                      <Link href={`/${post.category}/${post.slug}`} className="text-sm text-foreground hover:text-primary transition-colors no-underline">
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
