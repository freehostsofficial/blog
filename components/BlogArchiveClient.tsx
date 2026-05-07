'use client';

import { useState, useMemo } from 'react';
import { PostCard } from '@/components/PostCard';
import type { Post, Author } from '@/types';
import { POSTS_PER_PAGE } from '@/lib/config';

interface BlogArchiveClientProps {
  posts: Post[];
  allTags: string[];
  authorsMap: Record<string, Author>;
}

/** Client component for tag filtering, sorting, and numbered pagination */
export function BlogArchiveClient({ posts, allTags, authorsMap }: BlogArchiveClientProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let list = activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts;
    if (sortAsc) list = [...list].reverse();
    return list;
  }, [posts, activeTag, sortAsc]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const visible = filtered.slice(start, start + POSTS_PER_PAGE);

  function goToPage(page: number) {
    setCurrentPage(page);
    window.scrollTo({ top: 0 });
  }

  return (
    <>
      <div className="filter-row">
        <div className="filter-chips">
          <button
            className={`filter-chip ${!activeTag ? 'active' : ''}`}
            onClick={() => { setActiveTag(null); setCurrentPage(1); }}
          >
            All
          </button>
          {allTags.slice(0, 15).map((tag) => (
            <button
              key={tag}
              className={`filter-chip ${activeTag === tag ? 'active' : ''}`}
              onClick={() => { setActiveTag(tag); setCurrentPage(1); }}
            >
              #{tag}
            </button>
          ))}
        </div>
        <button className="sort-toggle" onClick={() => setSortAsc(!sortAsc)}>
          {sortAsc ? '↑ Oldest' : '↓ Newest'}
        </button>
      </div>

      {visible.length === 0 ? (
        <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--muted)' }}>
          <p>No posts tagged &ldquo;{activeTag}&rdquo; yet.</p>
          <button
            onClick={() => setActiveTag(null)}
            style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
          >
            Clear filter →
          </button>
        </div>
      ) : (
        <>
          {visible.map((post) => {
            const authors = post.authors.map((s) => authorsMap[s]).filter(Boolean);
            return <PostCard key={post.slug} post={post} authors={authors} />;
          })}

          {/* Numbered Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Prev
              </button>

              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first, last, current, and neighbors
                  if (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  ) {
                    return (
                      <button
                        key={page}
                        className={`pagination-num ${page === currentPage ? 'active' : ''}`}
                        onClick={() => goToPage(page)}
                      >
                        {page}
                      </button>
                    );
                  }
                  if (page === 2 && currentPage > 3) {
                    return <span key={page} className="pagination-dots">…</span>;
                  }
                  if (page === totalPages - 1 && currentPage < totalPages - 2) {
                    return <span key={page} className="pagination-dots">…</span>;
                  }
                  return null;
                })}
              </div>

              <button
                className="pagination-btn"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}

          <div style={{
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--muted)',
            marginTop: '0.75rem',
          }}>
            Page {currentPage} of {totalPages} · {filtered.length} posts
          </div>
        </>
      )}
    </>
  );
}
