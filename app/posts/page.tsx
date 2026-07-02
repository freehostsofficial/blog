import PostsClient from './PostsClient'
import { getAllPosts } from '@/lib/posts'
import { getAllCategories } from '@/lib/categories'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Posts',
  description: 'Browse all guides, tutorials, and news about free web hosting.',
  alternates: { canonical: '/posts' },
}

export default function PostsPage() {
  const allPosts   = getAllPosts()
  const categories = getAllCategories()
  const categoryCounts = Object.fromEntries(categories)
  return <PostsClient allPosts={allPosts} categoryCounts={categoryCounts} />
}
