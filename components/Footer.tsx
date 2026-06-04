import Link from 'next/link'
import { Rss, ArrowUp } from 'lucide-react'
import { SITE_NAME } from '@/lib/config'

const EXPLORE_LINKS = [
  { href: '/posts',   label: 'All Posts'  },
  { href: '/tags',    label: 'Tags'       },
  { href: '/authors', label: 'Authors'    },
  { href: '/archive', label: 'Archive'    },
  { href: '/about',   label: 'About'      },
]

const RESOURCE_LINKS = [
  { href: '/rss.xml',          label: 'RSS Feed',     external: true  },
  { href: '/sitemap.xml',      label: 'Sitemap',      external: true  },
  { href: 'https://freehosts.space', label: 'Directory', external: true },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">

          <div className="footer-col">
            <Link href="/" className="footer-brand">{SITE_NAME}</Link>
            <p className="footer-desc">
              A community directory of free web hosting providers. News,
              guides, and tutorials for developers who want hosting without
              the price tag.
            </p>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Explore</h3>
            <ul className="footer-links" role="list">
              {EXPLORE_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Resources</h3>
            <ul className="footer-links" role="list">
              {RESOURCE_LINKS.map(({ href, label, external }) => (
                <li key={href}>
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {label === 'RSS Feed' && <Rss size={12} aria-hidden="true" />}
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} {SITE_NAME}. All rights reserved.</span>
          <a href="#main-content" className="back-to-top" aria-label="Back to top of page" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Back to top <ArrowUp size={14} />
          </a>
        </div>
      </div>
    </footer>
  )
}
