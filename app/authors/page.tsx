import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllAuthors } from '@/lib/authors';
import { getPostsByAuthor } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Authors',
  description: 'Meet the writers behind the blog — staff writers, editors, and community contributors.',
};

export default function AuthorsIndexPage() {
  const authors = getAllAuthors();
  const authorsWithCounts = authors
    .map((a) => ({ ...a, postCount: getPostsByAuthor(a.slug).length }))
    .sort((a, b) => b.postCount - a.postCount);

  return (
    <div className="section">
      <div className="page-header" style={{ padding: '0 0 1.5rem' }}>
        <h1>Authors</h1>
        <div className="count">{authors.length} contributors</div>
      </div>
      <div className="authors-grid">
        {authorsWithCounts.map((author) => (
          <Link key={author.slug} href={`/authors/${author.slug}`} className="author-grid-card" style={{ textDecoration: 'none', color: 'var(--text)' }}>
            <img src={author.avatar} alt={author.name} width={56} height={56} loading="lazy" style={{ borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem' }}>{author.name}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase' as const }}>{author.role}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                {author.postCount} {author.postCount === 1 ? 'post' : 'posts'} · View posts →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
