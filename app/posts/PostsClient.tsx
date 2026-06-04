'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import PostCard from '@/components/PostCard'
import FilterBar from '@/components/FilterBar'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
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
      <div className="container">
        <header className="page-header">
          <h1>All Posts</h1>
          <p>{allPosts.length} articles</p>
        </header>

        <div className="post-grid">
          {pagePosts.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        {totalPages > 1 && (
          <nav className="pagination" aria-label="Posts pagination">
            <Link
              href={currentPage > 1 ? `/posts?page=${currentPage - 1}` : '#'}
              className={`pagination-btn${currentPage <= 1 ? ' is-disabled' : ''}`}
              aria-disabled={currentPage <= 1}
              aria-label="Previous page"
            >
              <ArrowLeft size={16} /> Previous
            </Link>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <Link
                key={p}
                href={`/posts?page=${p}`}
                className={`pagination-btn${p === currentPage ? ' is-active' : ''}`}
                aria-current={p === currentPage ? 'page' : undefined}
                aria-label={`Page ${p}`}
              >
                {p}
              </Link>
            ))}

            <Link
              href={currentPage < totalPages ? `/posts?page=${currentPage + 1}` : '#'}
              className={`pagination-btn${currentPage >= totalPages ? ' is-disabled' : ''}`}
              aria-disabled={currentPage >= totalPages}
              aria-label="Next page"
            >
              Next <ArrowRight size={16} />
            </Link>
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
        <div className="container" style={{ paddingTop: 'var(--sp-16)', textAlign: 'center', color: 'var(--c-text-3)' }}>
          Loading posts...
        </div>
      </main>
    }>
      <PostsContent {...props} />
    </Suspense>
  )
}
