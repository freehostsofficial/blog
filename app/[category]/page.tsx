import type { Metadata } from 'next'
import { getPostsByCategory, getAllCategories } from '@/lib/categories'
import PostCard from '@/components/PostCard'
import FilterBar from '@/components/FilterBar'
import { CATEGORY_LABELS, type Category } from '@/types'

const VALID_CATEGORIES: Category[] = ['guides', 'news', 'tutorials', 'opinion', 'community']

export function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params
  const label = CATEGORY_LABELS[category as Category] || category
  const posts = getPostsByCategory(category)
  return {
    title: label,
    description: `Browse all ${posts.length} ${label.toLowerCase()} posts on FreeHosts.`,
    alternates: { canonical: `/${category}` },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const posts = getPostsByCategory(category)
  const categories = getAllCategories()
  const label = CATEGORY_LABELS[category as Category] || category

  return (
    <main id="main-content">
      <FilterBar categoryCounts={categories} />
      <div className="container">
        <header className="page-header">
          <h1>{label}</h1>
          <p>{posts.length} {posts.length === 1 ? 'post' : 'posts'}</p>
        </header>

        {posts.length === 0 ? (
          <p className="container" style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--c-text-3)' }}>
            No posts in this category yet.
          </p>
        ) : (
          <div className="post-grid">
            {posts.map(post => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
