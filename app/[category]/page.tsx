import type { Metadata } from 'next';
import { getPostsByCategory } from '@/lib/categories';
import { getAuthorBySlug } from '@/lib/authors';
import { PostCard } from '@/components/PostCard';
import { CATEGORY_LABELS, type Category } from '@/types';
import Link from 'next/link';

const VALID_CATEGORIES: Category[] = ['guides', 'news', 'tutorials', 'opinion', 'community'];

export function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const label = CATEGORY_LABELS[category as Category] || category;
  return {
    title: `${label} Posts`,
    description: `Browse all ${label.toLowerCase()} posts on the blog.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const posts = getPostsByCategory(category);
  const label = CATEGORY_LABELS[category as Category] || category;

  return (
    <div className="section">
      <div className="page-header" style={{ padding: '0 0 1rem' }}>
        <div className="breadcrumb">
          <Link href="/">Home</Link> / <span>{label}</span>
        </div>
        <h1>{label}</h1>
        <div className="count">{posts.length} {posts.length === 1 ? 'post' : 'posts'}</div>
      </div>
      {posts.length === 0 ? (
        <p style={{ color: 'var(--muted)', padding: '2rem 0' }}>No posts in this category yet.</p>
      ) : (
        posts.map((post) => {
          const authors = post.authors.map((s) => getAuthorBySlug(s));
          return <PostCard key={post.slug} post={post} authors={authors} />;
        })
      )}
    </div>
  );
}
