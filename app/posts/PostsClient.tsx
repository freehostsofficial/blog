'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import PostCard from '@/components/PostCard'
import FilterBar from '@/components/FilterBar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { POSTS_PER_PAGE } from '@/lib/config'
import type { Post } from '@/types'

interface Props {
  allPosts: Post[]
  categoryCounts: Record<string, number>
}

function PostsContent({ allPosts, categoryCounts }: Props) {
  const searchParams = useSearchParams()
  const pageParam = searchParams.get('page')
  const currentPage = pageParam ? Math.max(1, parseInt(pageParam, 10) || 1) : 1
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE)
  const pagePosts = allPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)
  const categories = new Map(Object.entries(categoryCounts))

  return (
    <main id="main-content">
      <FilterBar categoryCounts={categories} />
      <div className="container-blog">
        <header className="pb-8 mb-10 border-b border-glass-border">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">All Posts</h1>
          <p className="text-muted-foreground">{allPosts.length} articles</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pagePosts.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-2 py-8" aria-label="Posts pagination">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              nativeButton={false}
              render={<Link href={currentPage > 1 ? `/posts?page=${currentPage - 1}` : '#'} aria-label="Previous page" />}
            >
              <ArrowLeft className="size-3.5" /> Previous
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <Button
                key={p}
                variant={p === currentPage ? "default" : "outline"}
                size="sm"
                nativeButton={false}
                render={<Link href={`/posts?page=${p}`} aria-current={p === currentPage ? 'page' : undefined} aria-label={`Page ${p}`} />}
              >
                {p}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              nativeButton={false}
              render={<Link href={currentPage < totalPages ? `/posts?page=${currentPage + 1}` : '#'} aria-label="Next page" />}
            >
              Next <ArrowRight className="size-3.5" />
            </Button>
          </nav>
        )}
      </div>
    </main>
  )
}

export default function PostsClient(props: Props) {
  return (
    <Suspense fallback={
      <main id="main-content">
        <div className="container-blog py-16 text-center text-muted-foreground">Loading posts...</div>
      </main>
    }>
      <PostsContent {...props} />
    </Suspense>
  )
}
