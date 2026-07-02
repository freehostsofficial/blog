'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { CATEGORY_LABELS } from '@/types'
import { formatDate, getInitials } from '@/lib/utils'
import Image from 'next/image'
import type { Post } from '@/types'

interface Props {
  post: Post
  variant?: 'default' | 'featured' | 'compact'
}

export default function PostCard({ post, variant = 'default' }: Props) {
  const router = useRouter()
  const {
    title, slug, category, excerpt, cover, authors, date, tags, readingTime,
  } = post

  const href = `/${category}/${slug}`
  const categoryLabel = CATEGORY_LABELS[category] ?? category
  const coverSrc = cover?.src
  const dateStr = typeof date === 'string' ? date : (date as Date).toISOString().split('T')[0]

  if (variant === 'compact') {
    return (
      <Link href={href} className="block no-underline group animate-in">
        <Card className="glass-card-hover border-0">
          <CardContent className="px-5 py-4 flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{categoryLabel}</Badge>
              <time dateTime={dateStr}>{formatDate(dateStr)}</time>
            </div>
            <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
              {title}
            </span>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <div className="block group animate-in cursor-pointer" onClick={() => router.push(href)} role="link" tabIndex={0} onKeyDown={e => { if (e.key === 'Enter') router.push(href) }}>
      <Card className={cn(
        "glass-card-hover h-full border-0 overflow-hidden",
        variant === 'featured' && "md:grid md:grid-cols-2"
      )}>
        {coverSrc && (
          <div className={cn(
            "relative overflow-hidden",
            variant === 'featured' ? "aspect-video md:aspect-auto" : "aspect-video"
          )}>
            <Image
              src={coverSrc}
              alt={cover?.alt ?? `Cover image for ${title}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={variant === 'featured' ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 640px) 100vw, 50vw'}
            />
          </div>
        )}

        <div className="flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Link href={`/${category}`} className="no-underline">
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{categoryLabel}</Badge>
              </Link>
              <time dateTime={dateStr} className="text-xs text-muted-foreground">{formatDate(dateStr)}</time>
              {readingTime > 0 && (
                <span className="text-xs text-muted-foreground">{readingTime} min read</span>
              )}
            </div>
            <h2 className="text-lg font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
              {title}
            </h2>
          </CardHeader>

          {excerpt && (
            <CardContent className="pb-3">
              <p className="text-sm text-muted-foreground line-clamp-2">{excerpt}</p>
            </CardContent>
          )}

          {((authors?.length ?? 0) > 0 || (tags?.length ?? 0) > 0) && (
            <CardFooter className="mt-auto pt-3 flex items-center gap-2 flex-wrap">
              {authors?.slice(0, 2).map(authorSlug => (
                <Avatar key={authorSlug} className="size-6">
                  <AvatarFallback className="text-[9px]">{getInitials(authorSlug.replace(/-/g, ' '))}</AvatarFallback>
                </Avatar>
              ))}
              {tags?.slice(0, 2).map(tag => (
                <Link key={tag} href={`/tags/${tag}`}>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">#{tag}</Badge>
                </Link>
              ))}
            </CardFooter>
          )}
        </div>
      </Card>
    </div>
  )
}

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}
