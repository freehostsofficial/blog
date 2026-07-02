import type { Metadata } from 'next'
import { getAllAuthors } from '@/lib/authors'
import { getAllPosts } from '@/lib/posts'
import AuthorCard from '@/components/AuthorCard'

export const metadata: Metadata = {
  title: 'Authors',
  description: 'Meet the writers behind FreeHosts Blog.',
  alternates: { canonical: '/authors' },
}

export default function AuthorsPage() {
  const authors = getAllAuthors()
  const allPosts = getAllPosts()
  const postCounts = (slug: string) => allPosts.filter(p => p.authors.includes(slug)).length

  return (
    <main id="main-content">
      <div className="container-blog">
        <header className="pb-8 mb-10 border-b border-glass-border pt-12">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Authors</h1>
          <p className="text-muted-foreground">Meet the writers behind the blog</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {authors.map(author => (
            <AuthorCard key={author.slug} author={author} postCount={postCounts(author.slug)} />
          ))}
        </div>
      </div>
    </main>
  )
}
