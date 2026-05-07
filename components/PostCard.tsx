import Link from 'next/link';
import type { Post, Author } from '@/types';
import { AuthorByline } from './AuthorByline';
import { TagList } from './TagList';
import { CATEGORY_LABELS } from '@/types';

interface PostCardProps {
  post: Post;
  authors: Author[];
}

/** Compact row format used in all listing pages — the entire row is a link */
export function PostCard({ post, authors }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  return (
    <Link href={`/${post.category}/${post.slug}`} className="post-row" id={`post-${post.slug}`}>
      <div className="post-row-date">{formattedDate}</div>
      <div className="post-row-divider" />
      <div className="post-row-body">
        <h3 className="post-row-title">{post.title}</h3>
        <p className="post-row-excerpt">{post.excerpt}</p>
        <div className="post-row-meta">
          <div className="byline" style={{ display: 'inline-flex' }}>
            <div className="byline-avatars">
              {authors.map((a) => (
                <img key={a.slug} src={a.avatar} alt={a.name} className="byline-avatar" width={22} height={22} loading="lazy" />
              ))}
            </div>
            <span style={{ fontSize: '0.8rem' }}>
              {authors.map((a) => a.name).join(', ')}
            </span>
          </div>
          <span className="cat-badge">{CATEGORY_LABELS[post.category] || post.category}</span>
          <span>{post.readingTime} min</span>
          <div className="tag-list" style={{ display: 'inline-flex' }}>
            {post.tags.slice(0, 3).map((t) => (
              <span key={t} className="tag-chip">#{t}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
