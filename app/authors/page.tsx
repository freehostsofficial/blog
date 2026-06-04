import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllAuthors } from '@/lib/authors'
import { getAllPosts } from '@/lib/posts'
import { getInitials } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Authors',
  description: 'Meet the writers behind FreeHosts Blog.',
  alternates: { canonical: '/authors' },
}

export default function AuthorsPage() {
  const authors = getAllAuthors()
  const allPosts = getAllPosts()

  function postCount(slug: string) {
    return allPosts.filter(p => p.authors.includes(slug)).length
  }

  return (
    <main id="main-content">
      <div className="container">
        <header className="page-header">
          <h1>Authors</h1>
          <p>Meet the writers behind the blog</p>
        </header>

        <div className="grid-3">
          {authors.map(author => (
            <article key={author.slug} className="author-card">
              <div className="author-card-header">
                <div className="avatar-lg">
                  {author.avatar
                    ? <Image src={author.avatar} alt={author.name} width={72} height={72} />
                    : <span>{getInitials(author.name)}</span>
                  }
                </div>
                <div>
                  <Link href={`/authors/${author.slug}`} className="author-card-name">{author.name}</Link>
                  <p className="author-card-role">{author.role}</p>
                  <p className="author-card-post-count">{postCount(author.slug)} posts</p>
                </div>
              </div>
              <p className="author-card-bio">{author.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
