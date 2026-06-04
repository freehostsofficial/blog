'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CATEGORY_LABELS, type Category } from '@/types'

const ALL_CATEGORY_SLUGS = ['guides', 'tutorials', 'news', 'opinion', 'community']

interface Props {
  categoryCounts?: Map<string, number>
}

export default function FilterBar({ categoryCounts }: Props) {
  const pathname = usePathname()

  const activeCategory = ALL_CATEGORY_SLUGS.find(slug =>
    pathname === `/${slug}` || pathname.startsWith(`/${slug}/`)
  ) ?? null

  const isAllActive = pathname === '/posts'

  return (
    <div className="filter-bar" role="navigation" aria-label="Filter posts by category">
      <div className="container">
        <div className="filter-bar-inner">
          <Link
            href="/posts"
            className={`filter-tab${isAllActive ? ' is-active' : ''}`}
            aria-current={isAllActive ? 'page' : undefined}
          >
            All posts
          </Link>

          {ALL_CATEGORY_SLUGS.map(slug => {
            const count = categoryCounts?.get(slug) ?? 0
            const isActive = activeCategory === slug
            return (
              <Link
                key={slug}
                href={`/${slug}`}
                className={`filter-tab${isActive ? ' is-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {CATEGORY_LABELS[slug as Category] ?? slug}
                <span className="filter-tab-count" aria-label={`${count} posts`}>
                  {count}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
