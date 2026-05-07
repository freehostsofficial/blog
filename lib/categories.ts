import { getAllPosts } from './posts';
import type { Category, Post } from '@/types';

/**
 * Returns a Map of category → post count, sorted by count descending.
 * @returns Map<Category, number>
 */
export function getAllCategories(): Map<string, number> {
  const posts = getAllPosts();
  const catCounts = new Map<string, number>();

  for (const post of posts) {
    catCounts.set(post.category, (catCounts.get(post.category) || 0) + 1);
  }

  return new Map(
    [...catCounts.entries()].sort((a, b) => b[1] - a[1])
  );
}

/**
 * Returns all non-draft posts in the given category, sorted newest first.
 * @param category - The category slug
 * @returns Array of Post objects
 */
export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((post) => post.category === category);
}
