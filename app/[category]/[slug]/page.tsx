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
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import { CATEGORY_LABELS } from '@/types'
import { SITE_URL, SITE_NAME } from '@/lib/config'
import type { TocHeading } from '@/types'

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
        if (lang && hljs.getLanguage(lang)) return hljs.highlight(code, { language: lang }).value
        return hljs.highlightAuto(code).value
      },
    })
  )

  let html = marked.parse(
    content.replace(/^import\s+.*$/gm, '').replace(/^export\s+.*$/gm, '').trim(),
    { gfm: true, breaks: false }
  ) as string

  html = html
    .replace(/<pre><code class="hljs language-(\w+)">/g, '<pre data-lang="$1"><code class="hljs language-$1">')
    .replace(/<pre><code>/g, '<pre data-lang="text"><code class="hljs">')
    .replace(/<table>/g, '<div class="table-wrapper"><table>')
    .replace(/<\/table>/g, '</table></div>')
    .replace(/<a\s+href="(?!\/)([^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"')

  return html
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ category: post.category, slug: post.slug }))
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
      images: post.cover ? [{ url: post.cover.src, alt: post.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt ?? '',
      images: post.cover ? [post.cover.src] : [],
    },
    alternates: { canonical: url },
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
    .map((p) => ({ post: p, score: p.tags.filter(t => post.tags.includes(t)).length * 3 + (p.category === post.category ? 2 : 0) }))
    .filter((r) => r.score >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.post)

  const html = renderMdxToHtml(post.content)
  const postUrl = `${SITE_URL}/${category}/${slug}`

  const resolvedAuthors = post.authors.map(a => {
    try { const author = getAuthorBySlug(a); return { '@type': 'Person', name: author.name, url: `${SITE_URL}/authors/${a}` } }
    catch { return { '@type': 'Person', name: a } }
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt ?? '',
          datePublished: new Date(post.date).toISOString(),
          dateModified: new Date(post.date).toISOString(),
          author: resolvedAuthors,
          publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
          mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
          url: postUrl,
          ...(post.cover && { image: `${SITE_URL}${post.cover.src}` }),
          keywords: post.tags?.join(', '),
          articleSection: post.category,
        })
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: CATEGORY_LABELS[post.category] ?? post.category, item: `${SITE_URL}/${post.category}` },
            { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
          ],
        })
      }} />
      <ReadingProgress />
      <main id="main-content">
        <div className="container-blog">
          <header className="pt-12 pb-8 border-b border-glass-border mb-8">
            <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
              <Link href="/" className="text-muted-foreground hover:text-foreground no-underline">Home</Link>
              <span className="opacity-40">/</span>
              <Link href={`/${post.category}`} className="text-muted-foreground hover:text-foreground no-underline">
                {CATEGORY_LABELS[post.category]}
              </Link>
              <span className="opacity-40">/</span>
              <span className="text-foreground">{post.title}</span>
            </nav>

            <div className="flex items-center gap-2 flex-wrap mb-4">
              <Link href={`/${post.category}`} className="no-underline">
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{CATEGORY_LABELS[post.category]}</Badge>
              </Link>
              <TagList tags={post.tags} linked={true} />
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight mb-4">{post.title}</h1>

            {post.excerpt && <p className="text-lg text-muted-foreground leading-relaxed max-w-[58ch] mb-6">{post.excerpt}</p>}

            <AuthorByline authors={authors} date={post.date} readingTime={post.readingTime} />
          </header>

          {post.cover && (
            <div className="relative aspect-[21/9] overflow-hidden rounded-xl border border-glass-border mb-8 bg-muted">
              <Image src={post.cover.src} alt={post.cover.alt || `Cover image for ${post.title}`} fill priority sizes="(max-width: 1200px) 100vw, 1200px" className="object-cover" />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_17rem] gap-16 items-start pb-12">
            <div>
              <article className="prose" aria-label="Post content">
                <div dangerouslySetInnerHTML={{ __html: html }} />
              </article>
              <div className="mt-8 pt-6 border-t border-glass-border">
                <ShareButtons url={`/${category}/${slug}`} title={post.title} />
              </div>
            </div>
            <TableOfContents headings={headings} />
          </div>

          <section className="mt-10 pt-8 border-t border-glass-border space-y-4" aria-label="About the authors">
            {authors.map(author => <AuthorCard key={author.slug} author={author} />)}
          </section>

          {related.length > 0 && (
            <aside className="mt-10 pt-8 border-t border-glass-border" aria-label="Related posts">
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-6">Related posts</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map(p => <PostCard key={p.slug} post={p} variant="compact" />)}
              </div>
            </aside>
          )}

          <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 pt-8 border-t border-glass-border pb-16" aria-label="Previous and next posts">
            {prevPost && (
              <Link href={`/${prevPost.category}/${prevPost.slug}`} className="flex flex-col gap-2 p-5 glass rounded-xl glass-card-hover no-underline">
                <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground flex items-center gap-1">
                  <ArrowLeft className="size-3" /> Previous
                </span>
                <span className="font-medium text-foreground leading-snug">{prevPost.title}</span>
              </Link>
            )}
            {nextPost && (
              <Link href={`/${nextPost.category}/${nextPost.slug}`} className="flex flex-col gap-2 p-5 glass rounded-xl glass-card-hover no-underline text-right sm:col-start-2">
                <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground flex items-center gap-1 justify-end">
                  Next <ArrowRight className="size-3" />
                </span>
                <span className="font-medium text-foreground leading-snug">{nextPost.title}</span>
              </Link>
            )}
          </nav>
        </div>
      </main>
      <CodeCopyButton />
    </>
  )
}
