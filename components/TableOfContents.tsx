'use client'

import { useState, useEffect } from 'react'
import { List } from 'lucide-react'
import { useInView } from '@/lib/useInView'
import type { TocHeading } from '@/types'

interface Props {
  headings: TocHeading[]
}

export default function TableOfContents({ headings }: Props) {
  const [activeId, setActiveId] = useState<string>('')
  const { ref: tocRef, isInView } = useInView<HTMLDivElement>({ threshold: 0 })

  useEffect(() => {
    if (!headings.length) return

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      }
    )

    headings.forEach(h => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (!headings.length) return null

  const tocList = (
    <ol className="toc-list" role="list">
      {headings.map(h => (
        <li
          key={h.id}
          className={`toc-item toc-item--h${h.level}${activeId === h.id ? ' is-active' : ''}`}
        >
          <a href={`#${h.id}`} aria-current={activeId === h.id ? 'location' : undefined}>
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  )

  return (
    <>
      <aside ref={tocRef} className={`toc-sidebar${isInView ? '' : ''}`} aria-label="Table of contents">
        <p className="toc-title">On this page</p>
        {tocList}
      </aside>

      <details className="toc-accordion">
        <summary>
          <List size={14} aria-hidden="true" />
          On this page
          <span className="toc-accordion-chevron" aria-hidden="true">↓</span>
        </summary>
        <div className="toc-accordion-body">
          {tocList}
        </div>
      </details>
    </>
  )
}
