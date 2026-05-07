import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { getAuthorBySlug } from '@/lib/authors';
import { CATEGORY_LABELS } from '@/types';

export const metadata: Metadata = {
  title: 'Archive',
  description: 'Browse all posts by year and month — a complete chronological archive.',
};

export default function ArchivePage() {
  const allPosts = getAllPosts();
  const posts = allPosts.filter((p) => p.tags.includes('archive'));

  // Group posts by year → month
  const archive = new Map<number, Map<string, typeof posts>>();
  for (const post of posts) {
    const d = new Date(post.date);
    const year = d.getFullYear();
    const month = d.toLocaleDateString('en-US', { month: 'long' });

    if (!archive.has(year)) archive.set(year, new Map());
    const yearMap = archive.get(year)!;
    if (!yearMap.has(month)) yearMap.set(month, []);
    yearMap.get(month)!.push(post);
  }

  return (
    <div className="section">
      <div className="page-header" style={{ padding: '0 0 1.5rem' }}>
        <h1>Archive</h1>
        <div className="count">{posts.length} posts published</div>
      </div>

      {[...archive.entries()].map(([year, months]) => (
        <div key={year} style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--accent)' }}>{year}</h2>
          {[...months.entries()].map(([month, monthPosts]) => (
            <div key={month} style={{ marginBottom: '1.5rem' }}>
              <h3 style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.08em',
                color: 'var(--muted)',
                marginBottom: '0.75rem',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--border)',
              }}>
                {month} ({monthPosts.length})
              </h3>
              {monthPosts.map((post) => {
                const day = new Date(post.date).getDate();
                const authors = post.authors.map((s) => {
                  try { return getAuthorBySlug(s).name; } catch { return s; }
                });
                return (
                  <Link
                    key={post.slug}
                    href={`/${post.category}/${post.slug}`}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'baseline',
                      padding: '0.5rem 0',
                      textDecoration: 'none',
                      color: 'var(--text)',
                      borderBottom: '1px solid transparent',
                      transition: 'border-color 0.15s',
                    }}
                    className="archive-row"
                  >
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      color: 'var(--muted)',
                      flexShrink: 0,
                      width: '2rem',
                      textAlign: 'right',
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {day}
                    </span>
                    <span style={{ flex: 1 }}>
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: '1.05rem',
                      }}>
                        {post.title}
                      </span>
                      <span style={{
                        display: 'inline-flex',
                        gap: '0.5rem',
                        marginLeft: '0.75rem',
                        alignItems: 'center',
                      }}>
                        <span className="cat-badge" style={{ fontSize: '0.6rem' }}>
                          {CATEGORY_LABELS[post.category]}
                        </span>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          color: 'var(--muted)',
                        }}>
                          {post.readingTime} min · {authors.join(', ')}
                        </span>
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
