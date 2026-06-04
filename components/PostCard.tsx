import Link from 'next/link'
import ImageWithSkeleton from '@/components/ImageWithSkeleton'
import { CATEGORY_LABELS } from '@/types'
import { formatDate, getInitials } from '@/lib/utils'
import type { Post } from '@/types'

interface Props {
  post: Post
  variant?: 'default' | 'featured' | 'compact'
}

export default function PostCard({ post, variant = 'default' }: Props) {
  const {
    title, slug, category, excerpt, cover, authors, date, tags, readingTime,
  } = post

  const href = `/${category}/${slug}`
  const categoryLabel = CATEGORY_LABELS[category] ?? category

  if (variant === 'compact') {
    return (
      <article className="post-card post-card--compact">
        <div className="post-card-content">
          <div className="post-card-meta">
            <span className="badge badge--category">{categoryLabel}</span>
            <time className="badge badge--reading-time" dateTime={date}>
              {formatDate(date)}
            </time>
          </div>
          <Link href={href} className="post-card-title">
            {title}
          </Link>
        </div>
      </article>
    )
  }

  const coverSrc = cover?.src

  return (
    <article className={`post-card${variant === 'featured' ? ' post-card--featured' : ''}`}>
      {coverSrc && (
        <div className="post-card-image">
          <ImageWithSkeleton
            src={coverSrc}
            alt={cover?.alt ?? `Cover image for ${title}`}
            sizes={
              variant === 'featured'
                ? '(max-width: 768px) 100vw, 40vw'
                : '(max-width: 640px) 100vw, 50vw'
            }
            priority={variant === 'featured'}
          />
        </div>
      )}

      <div className="post-card-content">
        <div className="post-card-meta">
          <Link href={`/${category}`} className="badge badge--category" tabIndex={-1} aria-hidden="true">
            {categoryLabel}
          </Link>
          <time className="badge badge--reading-time" dateTime={date}>
            {formatDate(date)}
          </time>
          {readingTime > 0 && (
            <span className="badge badge--reading-time">{readingTime} min read</span>
          )}
        </div>

        <Link href={href} className="post-card-title">
          <h2 className="post-card-title-text">{title}</h2>
        </Link>

        {excerpt && (
          <p className="post-card-excerpt">{excerpt}</p>
        )}

        <div className="post-card-footer">
          <div className="post-card-authors">
            {authors?.slice(0, 2).map(authorSlug => (
              <span key={authorSlug} className="avatar-xs" aria-label={authorSlug} title={authorSlug}>
                {getInitials(authorSlug.replace(/-/g, ' '))}
              </span>
            ))}
            <span className="post-card-author-name">
              {authors?.join(', ').replace(/-/g, ' ')}
            </span>
          </div>
          {tags?.slice(0, 2).map(tag => (
            <Link key={tag} href={`/tags/${tag}`} className="badge" tabIndex={-1} aria-hidden="true">
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </article>
  )
}
