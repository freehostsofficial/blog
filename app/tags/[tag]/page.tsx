import type { Metadata } from 'next'
import { getAllTags, getPostsByTag } from '@/lib/tags'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import { SITE_URL } from '@/lib/config'

export function generateStaticParams() {
  const tags = getAllTags()
  return [...tags.keys()].map((tag) => ({ tag }))
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params
  return {
    title: `#${tag}`,
    description: `All posts tagged with #${tag}.`,
    alternates: { canonical: `${SITE_URL}/tags/${tag}` },
  }
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params
  const posts = getPostsByTag(tag)

  return (
    <main id="main-content">
      <div className="container" style={{ paddingTop: 'var(--sp-12)' }}>
        <Link href="/tags" className="btn btn--ghost btn--sm" style={{ marginBottom: 'var(--sp-6)' }}>
          ← Back to all tags
        </Link>
        <header className="page-header">
          <h1>#{tag}</h1>
          <p>{posts.length} {posts.length === 1 ? 'post' : 'posts'}</p>
        </header>

        <div className="post-grid">
          {posts.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </main>
  )
}
