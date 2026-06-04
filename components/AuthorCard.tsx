import Image from 'next/image'
import Link from 'next/link'
import { getInitials } from '@/lib/utils'
import type { Author } from '@/types'

interface Props {
  author: Author
  postCount?: number
}

export default function AuthorCard({ author, postCount }: Props) {
  const { name, slug, avatar, bio, role } = author

  return (
    <article className="author-card">
      <div className="author-card-header">
        <div className="avatar-lg">
          {avatar
            ? <Image src={avatar} alt={name} width={72} height={72} />
            : <span aria-hidden="true">{getInitials(name)}</span>
          }
        </div>

        <div>
          <Link href={`/authors/${slug}`} className="author-card-name">{name}</Link>
          {role && <p className="author-card-role">{role}</p>}
          {postCount !== undefined && (
            <p className="author-card-post-count">
              {postCount} {postCount === 1 ? 'post' : 'posts'}
            </p>
          )}
        </div>
      </div>

      {bio && <p className="author-card-bio">{bio}</p>}
    </article>
  )
}
