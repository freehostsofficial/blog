import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllTags } from '@/lib/tags'

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Browse all tags used on FreeHosts Blog.',
  alternates: { canonical: '/tags' },
}

export default function TagsPage() {
  const tags = getAllTags()
  const maxCount = Math.max(...tags.values(), 1)

  return (
    <main id="main-content">
      <div className="container-blog">
        <header className="pb-8 mb-10 border-b border-glass-border pt-12">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Tags</h1>
          <p className="text-muted-foreground">{tags.size} topics</p>
        </header>

        <div className="flex flex-wrap gap-3">
          {Array.from(tags.entries()).map(([tag, count]) => {
            const size = 0.85 + (count / maxCount) * 0.65
            return (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="inline-flex items-baseline gap-1 px-3 py-2 glass rounded-full text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-white/10 transition-all no-underline"
                style={{ fontSize: `${size}rem` }}
              >
                #{tag}
                <span className="text-xs opacity-60">{count}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
