import fs from 'fs';
import path from 'path';
import { getAllPosts } from '../lib/posts';
import { getAllAuthors } from '../lib/authors';
import { getAllTags } from '../lib/tags';
import { SITE_URL } from '../lib/config';

const VALID_CATEGORIES = ['guides', 'news', 'tutorials', 'opinion', 'community'];

function generateSitemap(): string {
  const posts = getAllPosts();
  const authors = getAllAuthors();
  const tags = getAllTags();

  const urls: { loc: string; lastmod?: string }[] = [
    { loc: `${SITE_URL}/`, lastmod: posts[0]?.date },
    { loc: `${SITE_URL}/posts/`, lastmod: posts[0]?.date },
    { loc: `${SITE_URL}/archive/`, lastmod: posts[0]?.date },
    { loc: `${SITE_URL}/authors/` },
    { loc: `${SITE_URL}/tags/` },
    { loc: `${SITE_URL}/about/` },
  ];

  for (const post of posts) {
    urls.push({ loc: `${SITE_URL}/${post.category}/${post.slug}/`, lastmod: post.updatedAt || post.date });
  }

  for (const cat of VALID_CATEGORIES) {
    urls.push({ loc: `${SITE_URL}/${cat}/` });
  }

  for (const author of authors) {
    urls.push({ loc: `${SITE_URL}/authors/${author.slug}/` });
  }

  for (const tag of tags.keys()) {
    urls.push({ loc: `${SITE_URL}/tags/${tag}/` });
  }

  const entries = urls.map((u) => {
    let entry = `  <url>\n    <loc>${u.loc}</loc>`;
    if (u.lastmod) entry += `\n    <lastmod>${u.lastmod}</lastmod>`;
    entry += `\n  </url>`;
    return entry;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

const outDir = path.join(process.cwd(), 'public');
fs.writeFileSync(path.join(outDir, 'sitemap.xml'), generateSitemap(), 'utf-8');
