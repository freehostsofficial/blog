import type { Metadata } from 'next'
import { getAllTags, getPostsByTag } from '@/lib/tags'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
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
      <div className="container-blog pt-12">
        <Button variant="ghost" size="sm" className="mb-6" nativeButton={false} render={<Link href="/tags" />}><ArrowLeft className="size-3.5" /> Back to all tags</Button>
        <header className="pb-8 mb-10 border-b border-glass-border">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">#{tag}</h1>
          <p className="text-muted-foreground">{posts.length} {posts.length === 1 ? 'post' : 'posts'}</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </main>
  )
}
