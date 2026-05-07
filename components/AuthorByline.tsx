import Link from 'next/link';
import type { Author } from '@/types';

interface AuthorBylineProps {
  authors: Author[];
  date: string;
  readingTime: number;
  /** When false, author names are plain text (use inside clickable cards to avoid nested <a>) */
  linked?: boolean;
}

/** Inline byline with overlapping avatars, linked names, date, and reading time */
export function AuthorByline({ authors, date, readingTime, linked = true }: AuthorBylineProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="byline">
      <div className="byline-avatars">
        {authors.map((author) => (
          <img
            key={author.slug}
            src={author.avatar}
            alt={author.name}
            className="byline-avatar"
            width={28}
            height={28}
            loading="lazy"
          />
        ))}
      </div>
      <span>
        {authors.map((author, i) => (
          <span key={author.slug}>
            {i > 0 && <span className="byline-sep">, </span>}
            {linked ? (
              <Link href={`/authors/${author.slug}`} className="byline-name">
                {author.name}
              </Link>
            ) : (
              <span className="byline-name">{author.name}</span>
            )}
          </span>
        ))}
      </span>
      <span className="byline-sep">·</span>
      <time dateTime={date}>{formattedDate}</time>
      <span className="byline-sep">·</span>
      <span>{readingTime} min read</span>
    </div>
  );
}
