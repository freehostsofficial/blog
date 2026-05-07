import type { Metadata } from 'next';
import { getAllTags, getPostsByTag } from '@/lib/tags';
import { getAuthorBySlug } from '@/lib/authors';
import { PostCard } from '@/components/PostCard';

export function generateStaticParams() {
  const tags = getAllTags();
  return [...tags.keys()].map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag}`,
    description: `All posts tagged with #${tag}.`,
  };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  return (
    <div className="section">
      <div className="page-header" style={{ padding: '0 0 1rem' }}>
        <div className="breadcrumb">
          <a href="/tags">Tags</a> / <span>#{tag}</span>
        </div>
        <h1>#{tag}</h1>
        <div className="count">{posts.length} {posts.length === 1 ? 'post' : 'posts'}</div>
      </div>
      {posts.map((post) => {
        const authors = post.authors.map((s) => getAuthorBySlug(s));
        return <PostCard key={post.slug} post={post} authors={authors} />;
      })}
    </div>
  );
}
