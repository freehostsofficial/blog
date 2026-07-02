import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

interface Props {
  tags: string[]
  linked?: boolean
}

export default function TagList({ tags, linked = true }: Props) {
  if (!tags?.length) return null
  return (
    <div className="flex flex-wrap gap-2" role="list" aria-label="Post tags">
      {tags.map(tag =>
        linked ? (
          <Link key={tag} href={`/tags/${tag}`} className="no-underline">
            <Badge variant="outline" role="listitem">#{tag}</Badge>
          </Link>
        ) : (
          <Badge key={tag} variant="outline" role="listitem">#{tag}</Badge>
        )
      )}
    </div>
  )
}
