import Link from 'next/link'
import PostCard from '@/components/PostCard'
import AuthorByline from '@/components/AuthorByline'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getAllPosts, getFeaturedPost } from '@/lib/posts'
import { getAuthorBySlug } from '@/lib/authors'
import { getAllCategories } from '@/lib/categories'
import { CATEGORY_LABELS, type Category } from '@/types'
import { SITE_NAME, SITE_URL } from '@/lib/config'

export default function HomePage() {
  const featured = getFeaturedPost()
  const allPosts  = getAllPosts()
  const latest    = allPosts.filter(p => p.slug !== featured?.slug).slice(0, 6)
  const categories = getAllCategories()
  const featuredAuthors = featured ? featured.authors.map(slug => getAuthorBySlug(slug)) : []

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${SITE_NAME} Blog`,
    url: SITE_URL,
    description: 'Guides, tutorials, and news about free web hosting providers.',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/posts?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />

      {featured && (
        <section className="relative min-h-[70vh] flex items-end overflow-hidden mb-10 animate-in">
          {featured.cover && (
            <img src={featured.cover.src} alt={featured.cover.alt} className="absolute inset-0 size-full object-cover z-0" />
          )}
          <div className="absolute inset-0 z-1 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          <div className="relative z-2 w-full container-blog pb-10 pt-16">
            <Badge className="mb-3 text-[10px]">Featured</Badge>
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight text-white max-w-[18ch] mb-3">
              <Link href={`/${featured.category}/${featured.slug}`} className="text-white hover:underline no-underline">
                {featured.title}
              </Link>
            </h1>
            <p className="text-lg text-white/80 max-w-[48ch] mb-4">{featured.excerpt}</p>
            <AuthorByline authors={featuredAuthors} date={featured.date} readingTime={featured.readingTime} />
            <Button variant="default" size="sm" className="mt-4" nativeButton={false} render={<Link href={`/${featured.category}/${featured.slug}`} />}>
              Read article →
            </Button>
          </div>
        </section>
      )}

        <section className="container-blog" aria-label="Latest posts">
        <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-6 animate-in">Latest</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-1">
          {latest.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        <div className="text-center py-8">
          <Button variant="outline" nativeButton={false} render={<Link href="/posts" />}>
            View all posts →
          </Button>
        </div>
      </section>

      <section className="container-blog pb-20" aria-labelledby="browse-heading">
        <h2 id="browse-heading" className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-6 pt-6 animate-in">
          Browse by topic
        </h2>
        <nav className="flex flex-wrap gap-2" aria-label="Post categories">
          {Array.from(categories.entries()).map(([slug, count]) => (
            <Link key={slug} href={`/${slug}`} className="no-underline">
              <Badge variant="secondary" className="text-sm px-3 py-1.5 gap-1">
                {CATEGORY_LABELS[slug as Category] ?? slug}
                <span className="text-xs opacity-60">({count})</span>
              </Badge>
            </Link>
          ))}
        </nav>
      </section>
    </main>
  )
}
