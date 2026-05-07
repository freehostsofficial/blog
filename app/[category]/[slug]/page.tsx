import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { getAuthorBySlug } from '@/lib/authors';
import { AuthorByline } from '@/components/AuthorByline';
import { AuthorCard } from '@/components/AuthorCard';
import { TagList } from '@/components/TagList';
import { ReadingProgress } from '@/components/ReadingProgress';
import { TableOfContents } from '@/components/TableOfContents';
import { CodeCopyButton } from '@/components/CodeCopyButton';
import { CATEGORY_LABELS } from '@/types';
import { SITE_URL } from '@/lib/config';
import type { TocHeading } from '@/types';

/** Extract h2/h3 headings from MDX content for TOC */
function extractHeadings(content: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const regex = /^(#{2,3})\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length as 2 | 3;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    headings.push({ id, text, level });
  }
  return headings;
}

/** Render markdown to HTML using marked + highlight.js */
function renderMdxToHtml(content: string): string {
  const { Marked } = require('marked');
  const { markedHighlight } = require('marked-highlight');
  const hljs = require('highlight.js');

  const marked = new Marked(
    markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code: string, lang: string) {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
      },
    })
  );

  // Strip MDX-specific import/export lines
  const cleaned = content
    .replace(/^import\s+.*$/gm, '')
    .replace(/^export\s+.*$/gm, '')
    .trim();

  const html = marked.parse(cleaned, {
    gfm: true,
    breaks: false,
  }) as string;

  // Add data-lang attribute for language labels + copy buttons
  let result = html.replace(
    /<pre><code class="hljs language-(\w+)">/g,
    '<pre data-lang="$1"><code class="hljs language-$1">'
  );
  // Handle code blocks without language class
  result = result.replace(
    /<pre><code>/g,
    '<pre data-lang="text"><code class="hljs">'
  );

  // Add IDs to h2/h3 for TOC linking
  return result.replace(
    /<(h[23])>(.*?)<\/\1>/g,
    (_, tag, text) => {
      const plainText = text.replace(/<[^>]*>/g, '');
      const id = plainText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      return `<${tag} id="${id}">${text}</${tag}>`;
    }
  );
}

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    category: post.category,
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `${SITE_URL}/${post.category}/${post.slug}/`,
      images: post.cover ? [{ url: post.cover.src }] : [],
    },
    twitter: { card: 'summary_large_image' },
    alternates: { canonical: `${SITE_URL}/${post.category}/${post.slug}/` },
  };
}

export default async function PostPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { slug, category } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const authors = post.authors.map((s) => getAuthorBySlug(s));
  const headings = extractHeadings(post.content);
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  // Related posts: shared tags + same category, with minimum relevance
  // Exclude very common tags that match everything
  const BROAD_TAGS = new Set(['free-hosting', 'getting-started']);
  const specificTags = post.tags.filter((t) => !BROAD_TAGS.has(t));

  const related = allPosts
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      const sharedSpecific = p.tags.filter((t) => specificTags.includes(t)).length;
      const sharedBroad = p.tags.filter((t) => BROAD_TAGS.has(t) && post.tags.includes(t)).length;
      const sameCategory = p.category === post.category ? 2 : 0;
      return {
        post: p,
        score: sharedSpecific * 3 + sharedBroad + sameCategory,
      };
    })
    .filter((r) => r.score >= 2) // Only show truly relevant posts
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.post);

  // Same category recommendations (excluding current and related)
  const relatedSlugs = new Set([post.slug, ...related.map((r) => r.slug)]);
  const categoryPosts = allPosts
    .filter((p) => p.category === post.category && !relatedSlugs.has(p.slug))
    .slice(0, 3);

  const html = renderMdxToHtml(post.content);

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    author: authors.map((a) => ({ '@type': 'Person', name: a.name, url: `${SITE_URL}/authors/${a.slug}/` })),
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    image: post.cover?.src,
    description: post.excerpt,
  };

  return (
    <>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Post Header */}
      <header className="post-header">
        <div className="post-header-inner">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / <Link href={`/${post.category}`}>{CATEGORY_LABELS[post.category]}</Link> / <span>{post.title}</span>
          </div>
          <span className="cat-badge">{CATEGORY_LABELS[post.category]}</span>
          <h1>{post.title}</h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem', margin: '0 0 1rem' }}>{post.excerpt}</p>
          <AuthorByline authors={authors} date={post.date} readingTime={post.readingTime} />
          {post.updatedAt && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
              Updated on {new Date(post.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          )}
          <div style={{ marginTop: '0.75rem' }}>
            <TagList tags={post.tags} />
          </div>
        </div>
      </header>

      {/* Cover image */}
      {post.cover && (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' }}>
          <img src={post.cover.src} alt={post.cover.alt} className="post-cover" width={900} height={480} />
          {post.cover.credit && <p className="post-cover-credit">{post.cover.credit}</p>}
        </div>
      )}

      {/* Post layout with TOC */}
      <div className="post-layout">
        <div className="toc-desktop" style={{ display: 'block' }}>
          <TableOfContents headings={headings} />
        </div>
        <div>
          {/* Article body */}
          <article className="prose" dangerouslySetInnerHTML={{ __html: html }} />
          <CodeCopyButton />

          {/* Author cards */}
          <div className="prose" style={{ paddingTop: 0 }}>
            <div className="section-label">Written by</div>
            {authors.map((author) => (
              <AuthorCard key={author.slug} author={author} />
            ))}
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <div className="prose" style={{ paddingTop: 0 }}>
              <div className="section-label">Recommended</div>
              <div className="related-posts">
                {related.map((r) => (
                  <Link key={r.slug} href={`/${r.category}/${r.slug}`} className="related-card">
                    <span className="cat-badge">{CATEGORY_LABELS[r.category]}</span>
                    <h4>{r.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: '0.25rem 0 0' }}>{r.excerpt.slice(0, 80)}…</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{r.readingTime} min read</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* More from this category */}
          {categoryPosts.length > 0 && (
            <div className="prose" style={{ paddingTop: 0 }}>
              <div className="section-label">More in {CATEGORY_LABELS[post.category]}</div>
              <div className="related-posts">
                {categoryPosts.map((r) => (
                  <Link key={r.slug} href={`/${r.category}/${r.slug}`} className="related-card">
                    <h4>{r.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{r.readingTime} min read</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Prev/Next nav */}
          <div className="prose" style={{ paddingTop: 0 }}>
            <div className="post-nav">
              {prevPost ? (
                <Link href={`/${prevPost.category}/${prevPost.slug}`}>
                  <div className="post-nav-label">← Previous</div>
                  <div className="post-nav-title">{prevPost.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginTop: '0.15rem' }}>{CATEGORY_LABELS[prevPost.category]}</div>
                </Link>
              ) : <div />}
              {nextPost ? (
                <Link href={`/${nextPost.category}/${nextPost.slug}`} style={{ textAlign: 'right' }}>
                  <div className="post-nav-label">Next →</div>
                  <div className="post-nav-title">{nextPost.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginTop: '0.15rem' }}>{CATEGORY_LABELS[nextPost.category]}</div>
                </Link>
              ) : <div />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
