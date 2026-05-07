import { getAllPosts } from './posts';
import type { Post } from '@/types';

/**
 * Returns a Map of tag → post count, sorted by count descending.
 * Tags are derived entirely from post frontmatter.
 * @returns Map<string, number>
 */
export function getAllTags(): Map<string, number> {
  const posts = getAllPosts();
  const tagCounts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }

  // Sort by count descending
  return new Map(
    [...tagCounts.entries()].sort((a, b) => b[1] - a[1])
  );
}

/**
 * Returns all non-draft posts with the given tag, sorted newest first.
 * @param tag - The tag to filter by (lowercase kebab-case)
 * @returns Array of Post objects
 */
export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}
