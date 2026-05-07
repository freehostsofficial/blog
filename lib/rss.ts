import { getAllPosts } from './posts';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from './config';

/**
 * Generates a valid RSS 2.0 XML string from all non-draft posts.
 * Each item includes title, link, description (excerpt), pubDate, and author.
 * @returns RSS 2.0 XML string
 */
export function generateRssFeed(): string {
  const posts = getAllPosts();

  const items = posts.map((post) => {
    const link = `${SITE_URL}/${post.category}/${post.slug}/`;
    const pubDate = new Date(post.date).toUTCString();

    return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author>${post.authors.join(', ')}</author>
      <category>${post.category}</category>
    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
}
