import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import type { Author } from '@/types'

interface Props {
  author: Author
  postCount?: number
}

export default function AuthorCard({ author, postCount }: Props) {
  const { name, slug, avatar, bio, role } = author

  return (
    <Card className="glass-card-hover border-0 h-full">
      <CardHeader className="flex-row items-center gap-4 pb-3">
        <Avatar className="size-14">
          {avatar ? (
            <AvatarImage src={avatar} alt={name} />
          ) : null}
          <AvatarFallback className="text-sm">{getInitials(name)}</AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <Link href={`/authors/${slug}`} className="font-semibold text-foreground hover:text-primary transition-colors no-underline">
            {name}
          </Link>
          {role && <p className="text-xs text-muted-foreground">{role}</p>}
          {postCount !== undefined && (
            <p className="text-xs text-muted-foreground">{postCount} {postCount === 1 ? 'post' : 'posts'}</p>
          )}
        </div>
      </CardHeader>

      {bio && (
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{bio}</p>
        </CardContent>
      )}
    </Card>
  )
}
