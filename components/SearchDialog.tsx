'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { Search, SearchX, Loader2 } from 'lucide-react'
import Fuse from 'fuse.js'
import { Skeleton } from '@/components/ui/skeleton'
import type { SearchEntry } from '@/types'

interface Props {
  onClose: () => void
}

export default function SearchDialog({ onClose }: Props) {
  const [query, setQuery]     = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [entries, setEntries] = useState<SearchEntry[]>([])
  const [loaded, setLoaded]   = useState(false)
  const [error, setError]     = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const inputRef      = useRef<HTMLInputElement>(null)
  const dialogRef     = useRef<HTMLDivElement>(null)
  const resultsRef    = useRef<HTMLDivElement>(null)
  const debounceRef   = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDebouncedQuery(query), 250)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query])

  const fuse = useMemo(
    () => new Fuse(entries, {
      keys: [
        { name: 'title',   weight: 0.5 },
        { name: 'excerpt', weight: 0.3 },
        { name: 'tags',    weight: 0.2 },
      ],
      threshold: 0.35,
      includeScore: true,
      minMatchCharLength: 2,
    }),
    [entries]
  )

  const results = useMemo(() => {
    if (!debouncedQuery.trim() || !loaded) return []
    return fuse.search(debouncedQuery).slice(0, 8).map(r => r.item)
  }, [debouncedQuery, fuse, loaded])

  useEffect(() => {
    const load = () => {
      fetch('/search-index.json')
        .then(r => {
          if (!r.ok) throw new Error('Failed to load search index')
          return r.json()
        })
        .then((data: SearchEntry[]) => {
          setEntries(data)
          setLoaded(true)
        })
        .catch(() => {
          setError(true)
          setLoaded(true)
        })
    }
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(load, { timeout: 500 })
      return () => cancelIdleCallback(id)
    } else {
      load()
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 50)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const focusable = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => !el.closest('[aria-hidden="true"]'))

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }

      if (e.key === 'Tab') {
        const els = focusable()
        if (!els.length) return
        const first = els[0]
        const last  = els[els.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus() }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus() }
        }
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex(i => Math.min(i + 1, results.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(i => Math.max(i - 1, -1))
      }
      if (e.key === 'Enter' && activeIndex >= 0) {
        const item = results[activeIndex]
        if (item) {
          onClose()
          window.location.href = `/${item.category}/${item.slug}`
        }
      }
    }

    document.addEventListener('keydown', onKeydown)
    return () => document.removeEventListener('keydown', onKeydown)
  }, [onClose, results, activeIndex])

  useEffect(() => {
    if (activeIndex < 0) return
    const el = resultsRef.current?.children[activeIndex] as HTMLElement
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  const onOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }, [onClose])

  const isEmpty = debouncedQuery.trim().length > 0 && results.length === 0 && loaded

  return (
    <div
      className="search-overlay"
      onClick={onOverlayClick}
      aria-label="Search overlay"
    >
      <div
        ref={dialogRef}
        className="search-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Search posts"
        aria-describedby="search-instructions"
      >
        <span id="search-instructions" className="sr-only">
          Type to search posts. Use arrow keys to navigate results, Enter to open.
        </span>

        <div className="search-input-row">
          {loaded && !error
            ? <Search size={16} aria-hidden="true" />
            : <Loader2 size={16} aria-hidden="true" className="search-spinner" />
          }
          <label htmlFor="search-input" className="sr-only">Search posts</label>
          <input
            ref={inputRef}
            id="search-input"
            type="search"
            className="search-input"
            placeholder={loaded ? 'Search posts…' : 'Loading…'}
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIndex(-1); }}
            disabled={!loaded}
            autoComplete="off"
            spellCheck={false}
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-activedescendant={activeIndex >= 0 ? `result-${activeIndex}` : undefined}
          />
          <kbd className="search-kbd" aria-label="Escape to close">Esc</kbd>
        </div>

        <div
          id="search-results"
          ref={resultsRef}
          className="search-results"
          role="listbox"
          aria-label="Search results"
        >
          {!loaded && !error && (
            <div className="search-skeletons" aria-busy="true" aria-label="Loading search index">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="search-skeleton-row">
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text-sm" width="35%" style={{ marginTop: '0.35rem' }} />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="search-empty" role="status">
              <SearchX size={20} aria-hidden="true" />
              <p>Could not load search index. Try reloading the page.</p>
            </div>
          )}

          {loaded && !error && !debouncedQuery.trim() && (
            <div className="search-empty" role="status">
              <p>Start typing to search all posts…</p>
            </div>
          )}

          {isEmpty && (
            <div className="search-empty" role="status">
              <SearchX size={20} aria-hidden="true" />
              <p>No results for <strong>&quot;{debouncedQuery}&quot;</strong></p>
            </div>
          )}

          {results.map((entry, i) => (
            <Link
              key={entry.slug}
              id={`result-${i}`}
              href={`/${entry.category}/${entry.slug}`}
              className="search-result-item"
              role="option"
              aria-selected={i === activeIndex}
              onClick={onClose}
              tabIndex={0}
            >
              <div className="search-result-top">
                <span className="badge badge--category">{entry.category}</span>
              </div>
              <div className="search-result-title">{entry.title}</div>
              {entry.excerpt && (
                <div className="search-result-excerpt">{entry.excerpt}</div>
              )}
              <div className="search-result-meta">
                {entry.tags?.slice(0, 3).map(tag => (
                  <span key={tag} className="search-result-tag">#{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <div className="search-footer" aria-hidden="true">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>Esc</kbd> close</span>
          <span style={{ marginLeft: 'auto' }}>
            {loaded && `${entries.length} posts indexed`}
          </span>
        </div>
      </div>
    </div>
  )
}
