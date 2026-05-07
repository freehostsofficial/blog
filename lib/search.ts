import { getAllPosts } from './posts';
import { getAuthorBySlug } from './authors';
import type { SearchEntry } from '@/types';

/**
 * Generates a flat JSON array of search entries for all non-draft posts.
 * Written to /public/search-index.json during postbuild.
 * Designed to stay under 50 KB for a 200-post site.
 * @returns Array of SearchEntry objects
 */
export function generateSearchIndex(): SearchEntry[] {
  const posts = getAllPosts();

  return posts.map((post) => ({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    tags: post.tags,
    category: post.category,
    authorNames: post.authors.map((slug) => {
      try {
        return getAuthorBySlug(slug).name;
      } catch {
        return slug;
      }
    }),
    date: post.date,
  }));
}
