import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPosts, getFeaturedPost } from '@/lib/posts';
import { getAuthorBySlug } from '@/lib/authors';
import { getAllCategories } from '@/lib/categories';
import { AuthorByline } from '@/components/AuthorByline';
import { CATEGORY_LABELS, type Category } from '@/types';
import { SITE_DESCRIPTION } from '@/lib/config';

export const metadata: Metadata = {
  title: 'FreeHosts Blog — Free Hosting Guides & News',
  description: SITE_DESCRIPTION,
};

export default function HomePage() {
  const featured = getFeaturedPost();
  const allPosts = getAllPosts();
  const recentPosts = allPosts.filter((p) => p.slug !== featured?.slug);
  const categories = getAllCategories();

  if (!featured) {
    return (
      <div className="section">
        <h1 className="section-heading">No posts yet</h1>
        <p style={{ color: 'var(--muted)' }}>Add MDX files to /content/posts/ to get started.</p>
      </div>
    );
  }

  const featuredAuthors = featured.authors.map((s) => getAuthorBySlug(s));

  // Split recent posts: first 2 for featured grid, rest for list
  const gridPosts = recentPosts.slice(0, 2);
  const listPosts = recentPosts.slice(2, 8);

  return (
    <>
      {/* ─── Hero Feature ─── */}
      <section className="home-hero">
        {featured.cover && (
          <img src={featured.cover.src} alt={featured.cover.alt} className="home-hero-bg" />
        )}
        <div className="home-hero-overlay" />
        <div className="home-hero-body">
          <span className="home-hero-label">Featured</span>
          <h1 className="home-hero-title">
            <Link href={`/${featured.category}/${featured.slug}`}>
              {featured.title}
            </Link>
          </h1>
          <p className="home-hero-excerpt">{featured.excerpt}</p>
          <AuthorByline authors={featuredAuthors} date={featured.date} readingTime={featured.readingTime} />
          <Link href={`/${featured.category}/${featured.slug}`} className="home-hero-cta">
            Read article →
          </Link>
        </div>
      </section>

      {/* ─── Two-Up Cards ─── */}
      <section className="section">
        <div className="home-section-header">
          <h2 className="home-section-title">Latest</h2>
          <Link href="/posts" className="home-section-link">View all posts →</Link>
        </div>
        <div className="home-duo">
          {gridPosts.map((post) => {
            const authors = post.authors.map((s) => getAuthorBySlug(s));
            return (
              <Link key={post.slug} href={`/${post.category}/${post.slug}`} className="home-card">
                {post.cover && (
                  <div className="home-card-img">
                    <img src={post.cover.src} alt={post.cover.alt} loading="lazy" />
                  </div>
                )}
                <div className="home-card-body">
                  <span className="cat-badge">{CATEGORY_LABELS[post.category]}</span>
                  <h3 className="home-card-title">{post.title}</h3>
                  <p className="home-card-excerpt">{post.excerpt}</p>
                  <AuthorByline authors={authors} date={post.date} readingTime={post.readingTime} linked={false} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── Category Strip ─── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="home-section-header">
          <h2 className="home-section-title">Browse</h2>
        </div>
        <div className="home-cats">
          {(['guides', 'tutorials', 'news', 'opinion', 'community'] as Category[]).map((cat) => (
            <Link key={cat} href={`/${cat}`} className="home-cat-pill">
              <span className="home-cat-count">{categories.get(cat) || 0}</span>
              <span className="home-cat-label">{CATEGORY_LABELS[cat]}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Compact List ─── */}
      {listPosts.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="home-section-header">
            <h2 className="home-section-title">More Posts</h2>
            <Link href="/archive" className="home-section-link">Full archive →</Link>
          </div>
          <div className="home-list">
            {listPosts.map((post) => {
              const d = new Date(post.date);
              const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              return (
                <Link key={post.slug} href={`/${post.category}/${post.slug}`} className="home-list-item">
                  <span className="home-list-date">{dateStr}</span>
                  <span className="home-list-title">{post.title}</span>
                  <span className="home-list-cat">{CATEGORY_LABELS[post.category]}</span>
                  <span className="home-list-time">{post.readingTime} min</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
