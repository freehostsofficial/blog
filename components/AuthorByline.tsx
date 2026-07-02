import Link from 'next/link'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { formatDate, getInitials } from '@/lib/utils'
import type { Author } from '@/types'

interface Props {
  authors: Author[]
  date: string
  readingTime: number
}

export default function AuthorByline({ authors, date, readingTime }: Props) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex -space-x-2" aria-hidden="true">
        {authors.slice(0, 3).map(author => (
          <Avatar key={author.slug} className="size-8 ring-2 ring-background">
            {author.avatar ? (
              <AvatarImage src={author.avatar} alt={author.name} />
            ) : null}
            <AvatarFallback className="text-[10px]">{getInitials(author.name)}</AvatarFallback>
          </Avatar>
        ))}
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          {authors.map((a, i) => (
            <span key={a.slug}>
              <Link href={`/authors/${a.slug}`} className="text-foreground hover:text-primary transition-colors no-underline">
                {a.name}
              </Link>
              {i < authors.length - 1 && ', '}
            </span>
          ))}
        </span>
        <span className="mx-1 opacity-40">·</span>
        <time dateTime={date}>{formatDate(date)}</time>
        {readingTime > 0 && (
          <>
            <span className="mx-1 opacity-40">·</span>
            <span>{readingTime} min read</span>
          </>
        )}
      </div>
    </div>
  )
}
