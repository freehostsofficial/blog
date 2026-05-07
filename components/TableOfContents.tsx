'use client';

import { useEffect, useState } from 'react';
import type { TocHeading } from '@/types';

interface TableOfContentsProps {
  headings: TocHeading[];
}

/** Sticky sidebar TOC that highlights the active heading on scroll */
export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px' }
    );

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="toc-sidebar" aria-label="Table of contents">
      <h4>On this page</h4>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={`${h.level === 3 ? 'h3' : ''} ${activeId === h.id ? 'active' : ''}`}
        >
          {h.text}
        </a>
      ))}
    </aside>
  );
}
