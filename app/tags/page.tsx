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
      <div className="container">
        <header className="page-header">
          <h1>Tags</h1>
          <p>{tags.size} topics</p>
        </header>

        <div className="tag-cloud">
          {Array.from(tags.entries()).map(([tag, count]) => {
            const size = 0.85 + (count / maxCount) * 0.65
            return (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                style={{ fontSize: `${size}rem` }}
              >
                #{tag}
                <span className="tag-count">{count}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
