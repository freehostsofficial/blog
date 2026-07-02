'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
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
    <div className="sticky top-14 z-40 glass border-b border-glass-border mb-8" role="navigation" aria-label="Filter posts by category">
      <div className="container-blog">
        <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-none">
          <Button
            variant={isAllActive ? "default" : "ghost"}
            size="sm"
            nativeButton={false}
            render={<Link href="/posts" aria-current={isAllActive ? 'page' : undefined} />}
            className="shrink-0"
          >
            All posts
          </Button>

          {ALL_CATEGORY_SLUGS.map(slug => {
            const count = categoryCounts?.get(slug) ?? 0
            const isActive = activeCategory === slug
            return (
              <Button
                key={slug}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                nativeButton={false}
                render={<Link href={`/${slug}`} aria-current={isActive ? 'page' : undefined} />}
                className="shrink-0 gap-1"
              >
                {CATEGORY_LABELS[slug as Category] ?? slug}
                {count > 0 && (
                  <span className="text-xs opacity-60">({count})</span>
                )}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
