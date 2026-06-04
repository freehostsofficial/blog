import Link from 'next/link'
import PostCard from '@/components/PostCard'
import { getAllPosts, getFeaturedPost } from '@/lib/posts'
import { getAllCategories } from '@/lib/categories'
import { CATEGORY_LABELS, type Category } from '@/types'
import { SITE_NAME, SITE_URL } from '@/lib/config'

export default function HomePage() {
  const featured = getFeaturedPost()
  const allPosts  = getAllPosts()
  const latest    = allPosts.filter(p => p.slug !== featured?.slug).slice(0, 6)
  const categories = getAllCategories()

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {featured && (
        <section className="container home-featured" aria-label="Featured post">
          <PostCard post={featured} variant="featured" />
        </section>
      )}

      <div className="container">
        <div className="home-section-label">Latest</div>
      </div>

      <section className="container" aria-label="Latest posts">
        <div className="post-grid">
          {latest.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        <div className="home-view-all">
          <Link href="/posts" className="btn">View all posts →</Link>
        </div>
      </section>

      <section className="container home-categories" aria-labelledby="browse-heading">
        <h2 id="browse-heading" className="home-section-label">Browse by topic</h2>
        <nav aria-label="Post categories">
          {Array.from(categories.entries()).map(([slug, count]) => (
            <Link key={slug} href={`/${slug}`} className="badge badge--category home-category-pill">
              {CATEGORY_LABELS[slug as Category] ?? slug}
              <span className="tag-count" aria-label={`${count} posts`}>{count}</span>
            </Link>
          ))}
        </nav>
      </section>
    </main>
  )
}
