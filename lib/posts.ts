import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Post, PostFrontmatter } from '@/types';
import { calculateReadingTime } from './readingTime';
import { getAuthorBySlug } from './authors';

const postsDir = path.join(process.cwd(), 'content', 'posts');

/**
 * Reads a single MDX file and returns a Post with frontmatter + computed fields.
 * Validates author references at build time.
 */
function parsePostFile(filename: string): Post {
  const filePath = path.join(postsDir, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const frontmatter = data as PostFrontmatter;

  // Validate author references — will throw if any are missing
  for (const authorSlug of frontmatter.authors) {
    getAuthorBySlug(authorSlug);
  }

  return {
    ...frontmatter,
    content,
    readingTime: calculateReadingTime(content),
  };
}

/**
 * Returns all non-draft posts sorted newest first.
 * @returns Array of Post objects
 */
export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDir)) return [];

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.mdx'));

  return files
    .map((file) => parsePostFile(file))
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Returns a single post by its slug with its MDX source string.
 * @param slug - The post slug from frontmatter
 * @returns The Post or undefined if not found
 */
export function getPostBySlug(slug: string): Post | undefined {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug);
}

/**
 * Returns the post marked featured: true, or the most recent post as a fallback.
 * @returns A single featured Post
 */
export function getFeaturedPost(): Post | undefined {
  const posts = getAllPosts();
  return posts.find((p) => p.featured) || posts[0];
}

/**
 * Returns all non-draft posts where the given author slug appears in the authors array.
 * @param authorSlug - The author's slug
 * @returns Array of Post objects
 */
export function getPostsByAuthor(authorSlug: string): Post[] {
  return getAllPosts().filter((post) => post.authors.includes(authorSlug));
}
