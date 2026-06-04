import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getAllAuthors, getAuthorBySlug } from '@/lib/authors'
import { getPostsByAuthor } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import { SITE_URL } from '@/lib/config'

export function generateStaticParams() {
  return getAllAuthors().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const author = getAuthorBySlug(slug)
    return {
      title: author.name,
      description: `Posts by ${author.name} — ${author.role}`,
      alternates: { canonical: `${SITE_URL}/authors/${slug}` },
    }
  } catch {
    return { title: 'Author Not Found' }
  }
}

export default async function AuthorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let author
  try { author = getAuthorBySlug(slug) } catch { notFound() }

  const posts = getPostsByAuthor(slug)

  return (
    <main id="main-content">
      <div className="container">
        <header className="page-header">
          <div className="author-card-header">
            <div className="avatar-lg">
              {author.avatar
                ? <Image src={author.avatar} alt={author.name} width={72} height={72} />
                : <span>{author.name.slice(0, 2).toUpperCase()}</span>
              }
            </div>
            <div>
              <h1>{author.name}</h1>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--c-text-3)' }}>{author.role}</p>
              <div className="author-card-links" style={{ marginTop: 'var(--sp-3)' }}>
                {author.links?.github && (
                  <a href={`https://github.com/${author.links.github}`} target="_blank" rel="noopener noreferrer"
                     className="author-social-link">GitHub</a>
                )}
                {author.links?.twitter && (
                  <a href={`https://twitter.com/${author.links.twitter}`} target="_blank" rel="noopener noreferrer"
                     className="author-social-link">Twitter</a>
                )}
                {author.links?.website && (
                  <a href={author.links.website} target="_blank" rel="noopener noreferrer"
                     className="author-social-link">Website</a>
                )}
              </div>
            </div>
          </div>
        </header>

        {author.bio && (
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--c-text-2)', lineHeight: 1.7, maxWidth: '65ch', marginBottom: 'var(--sp-8)' }}>
            {author.bio}
          </p>
        )}

        <h2 className="home-section-label">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} published
        </h2>

        <div className="post-grid">
          {posts.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </main>
  )
}
