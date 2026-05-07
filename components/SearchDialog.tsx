'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { SearchEntry } from '@/types';

interface SearchDialogProps {
  onClose: () => void;
}

/** Client-only search modal. Loads search-index.json on first open, uses fuse.js */
export function SearchDialog({ onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [allEntries, setAllEntries] = useState<SearchEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/search-index.json')
      .then((r) => r.json())
      .then((data: SearchEntry[]) => { setAllEntries(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const search = useCallback((q: string) => {
    setQuery(q);
    if (!q.trim()) { setResults([]); return; }
    const lower = q.toLowerCase();
    const filtered = allEntries.filter(
      (e) =>
        e.title.toLowerCase().includes(lower) ||
        e.excerpt.toLowerCase().includes(lower) ||
        e.tags.some((t) => t.includes(lower))
    );
    setResults(filtered.slice(0, 8));
  }, [allEntries]);

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-dialog" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          className="search-input"
          type="text"
          placeholder={loaded ? 'Search posts…' : 'Loading…'}
          value={query}
          onChange={(e) => search(e.target.value)}
          disabled={!loaded}
        />
        <div className="search-results">
          {results.length > 0 ? results.map((r) => (
            <a key={r.slug} href={`/${r.category}/${r.slug}/`} className="search-result">
              <div className="search-result-title">{r.title}</div>
              <div className="search-result-excerpt">{r.excerpt.slice(0, 100)}…</div>
            </a>
          )) : query.trim() ? (
            <div className="search-empty">No results for &ldquo;{query}&rdquo;</div>
          ) : (
            <div className="search-empty">Type to search posts</div>
          )}
        </div>
      </div>
    </div>
  );
}
