import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { getAuthorBySlug } from '@/lib/authors'
import AuthorByline from '@/components/AuthorByline'
import AuthorCard from '@/components/AuthorCard'
import TagList from '@/components/TagList'
import TableOfContents from '@/components/TableOfContents'
import CodeCopyButton from '@/components/CodeCopyButton'
import PostCard from '@/components/PostCard'
import { ReadingProgress } from '@/components/ReadingProgress'
import { ShareButtons } from '@/components/ShareButtons'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import { CATEGORY_LABELS } from '@/types'
import { SITE_URL, SITE_NAME } from '@/lib/config'
import type { TocHeading } from '@/types'
import { ArrowLeft, ArrowRight } from 'lucide-react'

function extractHeadings(content: string): TocHeading[] {
  const headings: TocHeading[] = []
  const regex = /^(#{2,3})\s+(.+)$/gm
  let match
  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length as 2 | 3
    const text = match[2].trim()
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
    headings.push({ id, text, level })
  }
  return headings
}

function renderMdxToHtml(content: string): string {
  const marked = new Marked(
    markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code: string, lang: string) {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value
        }
        return hljs.highlightAuto(code).value
      },
    })
  )

  const cleaned = content
    .replace(/^import\s+.*$/gm, '')
    .replace(/^export\s+.*$/gm, '')
    .trim()

  const html = marked.parse(cleaned, {
    gfm: true,
    breaks: false,
  }) as string

  let result = html.replace(
    /<pre><code class="hljs language-(\w+)">/g,
    '<pre data-lang="$1"><code class="hljs language-$1">'
  )
  result = result.replace(
    /<pre><code>/g,
    '<pre data-lang="text"><code class="hljs">'
  )

  result = result.replace(
    /<(h[23])>(.*?)<\/\1>/g,
    (_, tag, text) => {
      const plainText = new DOMParser().parseFromString(text, 'text/html').body.textContent ?? ''
      const id = plainText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
      return `<${tag} id="${id}">${text}</${tag}>`
    }
  )

  result = result.replace(
    /<table>/g,
    '<div class="table-wrapper"><table>'
  )
  result = result.replace(
    /<\/table>/g,
    '</table></div>'
  )

  result = result.replace(
    /<a\s+href="(?!\/)([^"]+)"/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer"'
  )

  return result
}

export function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    category: post.category,
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { slug, category } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Post not found' }

  const url = `${SITE_URL}/${category}/${slug}`
  const authors = post.authors.map(a => {
    try { return { name: getAuthorBySlug(a).name } } catch { return { name: a } }
  })

  return {
    title: post.title,
    description: post.excerpt ?? '',
    authors,
    keywords: post.tags,
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.excerpt ?? '',
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: authors.map(a => a.name),
      tags: post.tags,
      images: post.cover
        ? [{ url: post.cover.src, alt: post.title }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt ?? '',
      images: post.cover ? [post.cover.src] : [],
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function PostPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { slug, category } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const authors = post.authors.map((s) => getAuthorBySlug(s))
  const headings = extractHeadings(post.content)
  const allPosts = getAllPosts()
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug)
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null

  const related = allPosts
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      const sharedTags = p.tags.filter((t) => post.tags.includes(t)).length
      const sameCategory = p.category === post.category ? 2 : 0
      return { post: p, score: sharedTags * 3 + sameCategory }
    })
    .filter((r) => r.score >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.post)

  const html = renderMdxToHtml(post.content)

  const postUrl = `${SITE_URL}/${category}/${slug}`
  const resolvedAuthors = post.authors.map(a => {
    try {
      const author = getAuthorBySlug(a)
      return { '@type': 'Person', name: author.name, url: `${SITE_URL}/authors/${a}` }
    } catch {
      return { '@type': 'Person', name: a }
    }
  })

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt ?? '',
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    author: resolvedAuthors,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    url: postUrl,
    ...(post.cover && { image: `${SITE_URL}${post.cover.src}` }),
    keywords: post.tags?.join(', '),
    articleSection: post.category,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: CATEGORY_LABELS[post.category] ?? post.category, item: `${SITE_URL}/${post.category}` },
      { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ReadingProgress />

      <main id="main-content">
        <div className="container">
          <header className="post-header">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span className="breadcrumb-sep" aria-hidden="true">/</span>
              <Link href={`/${post.category}`}>{CATEGORY_LABELS[post.category]}</Link>
              <span className="breadcrumb-sep" aria-hidden="true">/</span>
              <span aria-current="page">{post.title}</span>
            </nav>

            <div className="post-header-meta">
              <Link href={`/${post.category}`} className="badge badge--category">
                {CATEGORY_LABELS[post.category]}
              </Link>
              <TagList tags={post.tags} linked={true} />
            </div>

            <h1 className="post-title">{post.title}</h1>

            {post.excerpt && (
              <p className="post-excerpt">{post.excerpt}</p>
            )}

            <AuthorByline
              authors={authors}
              date={post.date}
              readingTime={post.readingTime}
            />
          </header>

          {post.cover && (
            <div className="post-cover">
              <Image
                src={post.cover.src}
                alt={post.cover.alt || `Cover image for ${post.title}`}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}

          <div className="post-layout">
            <div className="post-content-container">
              <article className="prose" aria-label="Post content">
                <div dangerouslySetInnerHTML={{ __html: html }} />
              </article>
              <ShareButtons url={`/${category}/${slug}`} title={post.title} />
            </div>
            <TableOfContents headings={headings} />
          </div>

          <section className="post-authors-section" aria-label="About the authors">
            {authors.map(author => (
              <AuthorCard key={author.slug} author={author} />
            ))}
          </section>

          {related.length > 0 && (
            <aside className="related-section" aria-label="Related posts">
              <p className="related-section-title">Related posts</p>
              <div className="grid-3">
                {related.map(p => <PostCard key={p.slug} post={p} variant="compact" />)}
              </div>
            </aside>
          )}

          <nav className="post-nav" aria-label="Previous and next posts">
            {prevPost && (
              <Link href={`/${prevPost.category}/${prevPost.slug}`}
                    className="post-nav-link">
                <span className="post-nav-label"><ArrowLeft size={16} /> Previous</span>
                <span className="post-nav-title">{prevPost.title}</span>
              </Link>
            )}
            {nextPost && (
              <Link href={`/${nextPost.category}/${nextPost.slug}`}
                    className="post-nav-link post-nav-link--next">
                <span className="post-nav-label">Next <ArrowRight size={16} /></span>
                <span className="post-nav-title">{nextPost.title}</span>
              </Link>
            )}
          </nav>
        </div>
      </main>

      <CodeCopyButton />
    </>
  )
}
