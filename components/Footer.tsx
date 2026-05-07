import Link from 'next/link';
import { SITE_NAME, SITE_DESCRIPTION, PARENT_URL, SOCIAL_LINKS } from '@/lib/config';

/** Two-column footer with site info, explore links, and connect links */
export function Footer() {
  return (
    <footer className="footer" id="site-footer">
      <div className="footer-inner">
        <div className="footer-col">
          <h4>{SITE_NAME}</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>
            {SITE_DESCRIPTION}
          </p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.75rem' }}>
            <a href={PARENT_URL}>← freehosts.space</a>
          </p>
        </div>
        <div className="footer-col">
          <h4>Explore</h4>
          <Link href="/posts">All Posts</Link>
          <Link href="/archive">Archive</Link>
          <Link href="/authors">Authors</Link>
          <Link href="/tags">Tags</Link>
          <Link href="/about">About</Link>
        </div>
        <div className="footer-col">
          <h4>Connect</h4>
          <a href={SOCIAL_LINKS.rss}>RSS Feed</a>
          <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer">Twitter / X</a>
          <a href={PARENT_URL} target="_blank" rel="noopener noreferrer">freehosts.space</a>
        </div>
      </div>
      <div className="footer-copy">
        © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
