import Link from 'next/link'
import { Rss, ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    <footer className="border-t border-glass-border mt-auto">
      <div className="container-blog py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pb-10 border-b border-glass-border">
          <div className="space-y-3">
            <Link
              href="/"
              className="font-semibold text-lg tracking-tight text-foreground no-underline hover:no-underline"
            >
              {SITE_NAME}
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              A community directory of free web hosting providers. News,
              guides, and tutorials for developers who want hosting without
              the price tag.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Explore
            </h3>
            <ul className="flex flex-col gap-2" role="list">
              {EXPLORE_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Button variant="link" size="sm" className="h-auto p-0 text-muted-foreground hover:text-foreground" nativeButton={false} render={<Link href={href} />}>
                    {label}
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Resources
            </h3>
            <ul className="flex flex-col gap-2" role="list">
              {RESOURCE_LINKS.map(({ href, label, external }) => (
                <li key={href}>
                  <Button variant="link" size="sm" className="h-auto p-0 text-muted-foreground hover:text-foreground gap-1.5" nativeButton={false} render={
                    <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} />
                  }>
                    {label === 'RSS Feed' && <Rss className="size-3" />}
                    {label}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4 pt-6 text-xs text-muted-foreground">
          <span>© {year} {SITE_NAME}. All rights reserved.</span>
          <a
            href="#main-content"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground no-underline transition-colors"
            aria-label="Back to top of page"
          >
            Back to top <ArrowUp className="size-3" />
          </a>
        </div>
      </div>
    </footer>
  )
}
