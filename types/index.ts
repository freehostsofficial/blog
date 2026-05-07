/** Frontmatter schema for a blog post MDX file */
export interface PostFrontmatter {
  title: string;
  slug: string;
  date: string;
  updatedAt?: string;
  authors: string[];
  tags: string[];
  category: Category;
  excerpt: string;
  cover?: {
    src: string;
    alt: string;
    credit?: string;
  };
  featured: boolean;
  draft: boolean;
}

/** A fully resolved post with computed fields */
export interface Post extends PostFrontmatter {
  /** Raw MDX content string (body without frontmatter) */
  content: string;
  /** Estimated reading time in minutes */
  readingTime: number;
}

/** Author data loaded from YAML */
export interface Author {
  slug: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  links?: {
    github?: string;
    twitter?: string;
    website?: string;
  };
  joinedDate: string;
}

/** Valid category slugs */
export type Category = 'guides' | 'news' | 'tutorials' | 'opinion' | 'community';

/** Display-friendly category labels */
export const CATEGORY_LABELS: Record<Category, string> = {
  guides: 'Guides',
  news: 'News',
  tutorials: 'Tutorials',
  opinion: 'Opinion',
  community: 'Community',
};

/** Shape of a search index entry */
export interface SearchEntry {
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  category: string;
  authorNames: string[];
  date: string;
}

/** Heading extracted from MDX content for table of contents */
export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}
