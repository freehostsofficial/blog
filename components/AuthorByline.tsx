import Link from 'next/link'
import Image from 'next/image'
import { formatDate, getInitials } from '@/lib/utils'
import type { Author } from '@/types'

interface Props {
  authors: Author[]
  date: string
  readingTime: number
}

export default function AuthorByline({ authors, date, readingTime }: Props) {
  return (
    <div className="author-byline">
      <div className="author-byline-avatars" aria-hidden="true">
        {authors.slice(0, 3).map(author => (
          <span key={author.slug} className="avatar-xs" title={author.name}>
            {author.avatar
              ? <Image src={author.avatar} alt={author.name} width={24} height={24} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : getInitials(author.name)
            }
          </span>
        ))}
      </div>

      <div className="author-byline-text">
        <span className="author-byline-names">
          {authors.map((a, i) => (
            <span key={a.slug}>
              <Link href={`/authors/${a.slug}`}>{a.name}</Link>
              {i < authors.length - 1 && ', '}
            </span>
          ))}
        </span>
        <span className="author-byline-dot" aria-hidden="true"> · </span>
        <time dateTime={date}>{formatDate(date)}</time>
        {readingTime > 0 && (
          <>
            <span className="author-byline-dot" aria-hidden="true"> · </span>
            <span>{readingTime} min read</span>
          </>
        )}
      </div>
    </div>
  )
}
