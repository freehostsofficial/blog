'use client'

import { useState, useEffect } from 'react'
import { List } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { TocHeading } from '@/types'

interface Props {
  headings: TocHeading[]
}

export default function TableOfContents({ headings }: Props) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (!headings.length) return
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )
    headings.forEach(h => { const el = document.getElementById(h.id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [headings])

  if (!headings.length) return null

  const tocList = (
    <div className="flex flex-col">
      {headings.map(h => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={cn(
            "block text-xs py-1.5 px-3 border-l-2 transition-all rounded-r-sm no-underline",
            h.level === 3 ? "pl-7" : "",
            activeId === h.id
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50"
          )}
          aria-current={activeId === h.id ? 'location' : undefined}
        >
          {h.text}
        </a>
      ))}
    </div>
  )

  return (
    <>
      <aside className="hidden lg:block sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto scrollbar-none" aria-label="Table of contents">
        <div className="glass rounded-xl p-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
            On this page
          </p>
          <ScrollArea className="max-h-[60dvh]">
            {tocList}
          </ScrollArea>
        </div>
      </aside>

      <details className="lg:hidden glass rounded-xl overflow-hidden mb-6 group">
        <summary className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground cursor-pointer list-none">
          <List className="size-3.5" />
          On this page
          <span className="ml-auto transition-transform group-open:rotate-180 text-xs opacity-50">↓</span>
        </summary>
        <div className="px-3 pb-3 border-t border-glass-border pt-2">
          {tocList}
        </div>
      </details>
    </>
  )
}
