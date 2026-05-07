import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts';
import { getAllAuthors } from '@/lib/authors';
import { getAllTags } from '@/lib/tags';
import { BlogArchiveClient } from '@/components/BlogArchiveClient';
import type { Author } from '@/types';

export const metadata: Metadata = {
  title: 'All Posts',
  description: 'Browse every post on the blog — guides, news, tutorials, opinions, and community spotlights about free hosting.',
};

export default function BlogArchivePage() {
  const posts = getAllPosts();
  const tags = getAllTags();
  const authors = getAllAuthors();

  const authorsMap: Record<string, Author> = {};
  for (const a of authors) authorsMap[a.slug] = a;

  return (
    <div className="section">
      <div className="page-header" style={{ padding: '0 0 1rem' }}>
        <h1>The Blog</h1>
        <div className="count">{posts.length} posts published</div>
      </div>
      <BlogArchiveClient
        posts={posts}
        allTags={[...tags.keys()]}
        authorsMap={authorsMap}
      />
    </div>
  );
}
