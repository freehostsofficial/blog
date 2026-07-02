import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllAuthors, getAuthorBySlug } from '@/lib/authors'
import { getPostsByAuthor } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { SITE_URL } from '@/lib/config'
import { getInitials } from '@/lib/utils'

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
      <div className="container-blog">
        <header className="pb-8 mb-10 border-b border-glass-border pt-12">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="size-16">
              {author.avatar ? <AvatarImage src={author.avatar} alt={author.name} /> : null}
              <AvatarFallback className="text-lg">{getInitials(author.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">{author.name}</h1>
              <p className="text-sm text-muted-foreground">{author.role}</p>
              <div className="flex gap-3 mt-2">
                {author.links?.github && (
                  <Button variant="ghost" size="xs" nativeButton={false} render={<a href={`https://github.com/${author.links.github}`} target="_blank" rel="noopener noreferrer" />}>
                    GitHub
                  </Button>
                )}
                {author.links?.twitter && (
                  <Button variant="ghost" size="xs" nativeButton={false} render={<a href={`https://twitter.com/${author.links.twitter}`} target="_blank" rel="noopener noreferrer" />}>
                    Twitter
                  </Button>
                )}
                {author.links?.website && (
                  <Button variant="ghost" size="xs" nativeButton={false} render={<a href={author.links.website} target="_blank" rel="noopener noreferrer" />}>
                    Website
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {author.bio && (
          <p className="text-base text-muted-foreground leading-relaxed max-w-[65ch] mb-8">{author.bio}</p>
        )}

        <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-6">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} published
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
          {posts.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </main>
  )
}
