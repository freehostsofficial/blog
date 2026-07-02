'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, SearchX, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Fuse from 'fuse.js'

interface Props {
  onClose: () => void
}

export default function SearchDialog({ onClose }: Props) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [entries, setEntries] = useState<SearchEntry[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 250)
    return () => clearTimeout(timer)
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
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        fetch('/search-index.json')
          .then(r => r.json())
          .then((data: SearchEntry[]) => {
            setEntries(data)
            setLoaded(true)
          })
          .catch(() => { setError(true); setLoaded(true) })
      }, { timeout: 500 })
    } else {
      fetch('/search-index.json')
        .then(r => r.json())
        .then((data: SearchEntry[]) => {
          setEntries(data)
          setLoaded(true)
        })
        .catch(() => { setError(true); setLoaded(true) })
    }
  }, [])

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && results.length > 0) {
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
  }, [results, activeIndex, onClose])

  useEffect(() => {
    const el = resultsRef.current?.children[activeIndex] as HTMLElement
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  const handleSelect = useCallback((category: string, slug: string) => {
    onClose()
    window.location.href = `/${category}/${slug}`
  }, [onClose])

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 glass overflow-hidden" showCloseButton={false}>
        <DialogHeader className="sr-only">
          <DialogTitle>Search posts</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 px-4 py-3 border-b border-glass-border">
          {loaded && !error
            ? <Search className="size-4 text-muted-foreground shrink-0" />
            : <Loader2 className="size-4 text-muted-foreground shrink-0 animate-spin" />
          }
          <input
            ref={inputRef}
            type="search"
            className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
            placeholder={loaded ? 'Search posts…' : 'Loading…'}
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIndex(-1) }}
            disabled={!loaded}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            Esc
          </kbd>
        </div>

        <div ref={resultsRef} className="max-h-80 overflow-y-auto" role="listbox" aria-label="Search results">
          {!loaded && !error && (
            <div className="p-4 space-y-3" aria-busy="true">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-4 w-3/5" />
                  <Skeleton className="h-3 w-2/5" />
                </div>
              ))}
            </div>
          )}

          {loaded && !error && !debouncedQuery.trim() && (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Start typing to search all posts…
            </div>
          )}

          {error && (
            <div className="py-10 text-center text-sm text-destructive">
              Could not load search index. Try again.
            </div>
          )}

          {loaded && !error && debouncedQuery.trim() && results.length === 0 && (
            <div className="py-10 text-center text-sm text-muted-foreground space-y-1">
              <SearchX className="size-5 mx-auto mb-2" />
              <p>No results for <strong className="text-foreground">&ldquo;{debouncedQuery}&rdquo;</strong></p>
            </div>
          )}

          {results.map((entry, i) => (
            <button
              key={entry.slug}
              id={`result-${i}`}
              className={cn(
                "w-full text-left px-4 py-3 border-b border-glass-border last:border-0 transition-colors",
                i === activeIndex ? "bg-accent" : "hover:bg-accent/50"
              )}
              role="option"
              aria-selected={i === activeIndex}
              onClick={() => handleSelect(entry.category, entry.slug)}
            >
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{entry.category}</Badge>
              </div>
              <div className="text-sm font-medium text-foreground">{entry.title}</div>
              {entry.excerpt && (
                <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{entry.excerpt}</div>
              )}
              {entry.tags?.length > 0 && (
                <div className="flex gap-2 mt-1">
                  {entry.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] text-muted-foreground">#{tag}</span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-4 px-4 py-2 border-t border-glass-border text-[10px] text-muted-foreground">
          <span><kbd className="inline-flex h-4 items-center rounded border bg-muted px-1 font-mono text-[9px]">↑↓</kbd> navigate</span>
          <span><kbd className="inline-flex h-4 items-center rounded border bg-muted px-1 font-mono text-[9px]">↵</kbd> open</span>
          <span><kbd className="inline-flex h-4 items-center rounded border bg-muted px-1 font-mono text-[9px]">Esc</kbd> close</span>
          <span className="ml-auto">{loaded && `${entries.length} posts indexed`}</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
