import Link from 'next/link'

interface Props {
  tags: string[]
  linked?: boolean
}

export default function TagList({ tags, linked = true }: Props) {
  if (!tags?.length) return null
  return (
    <div className="tag-list" role="list" aria-label="Post tags">
      {tags.map(tag =>
        linked ? (
          <Link key={tag} href={`/tags/${tag}`} className="badge" role="listitem">
            #{tag}
          </Link>
        ) : (
          <span key={tag} className="badge" role="listitem">#{tag}</span>
        )
      )}
    </div>
  )
}
