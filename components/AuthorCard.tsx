import Link from 'next/link';
import type { Author } from '@/types';

interface AuthorCardProps {
  author: Author;
}

/** Large author card shown at bottom of posts and on author pages */
export function AuthorCard({ author }: AuthorCardProps) {
  return (
    <div className="author-card">
      <img
        src={author.avatar}
        alt={author.name}
        className="author-card-avatar"
        width={80}
        height={80}
        loading="lazy"
      />
      <div>
        <h3 className="author-card-name">
          <Link href={`/authors/${author.slug}`}>{author.name}</Link>
        </h3>
        <div className="author-card-role">{author.role}</div>
        <p className="author-card-bio">{author.bio}</p>
        <div className="author-card-links">
          {author.links?.github && (
            <a href={author.links.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          )}
          {author.links?.twitter && (
            <a href={author.links.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>
          )}
          {author.links?.website && (
            <a href={author.links.website} target="_blank" rel="noopener noreferrer">Website</a>
          )}
        </div>
      </div>
    </div>
  );
}
