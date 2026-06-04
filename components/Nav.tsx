'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { Search, Sun, Moon, Menu, X } from 'lucide-react'
import dynamic from 'next/dynamic'

const SearchDialog = dynamic(() => import('./SearchDialog'), {
  ssr: false,
  loading: () => null,
})

const NAV_LINKS = [
  { href: '/posts',   label: 'Posts'   },
  { href: '/tags',    label: 'Tags'    },
  { href: '/authors', label: 'Authors' },
  { href: '/archive', label: 'Archive' },
  { href: '/about',   label: 'About'   },
]

export default function Nav() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted]         = useState(false)
  const [searchOpen, setSearchOpen]   = useState(false)
  const [menuOpen, setMenuOpen]       = useState(false)
  const searchTriggerRef              = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setMenuOpen(false)
      }
    }
    document.addEventListener('keydown', onKeydown)
    return () => document.removeEventListener('keydown', onKeydown)
  }, [])

  const isDark = resolvedTheme === 'dark'

  return (
    <>
      <nav className="site-nav" aria-label="Main navigation">
        <div className="container nav-inner">

          <Link href="/" className="nav-brand" aria-label="FreeHosts — go to homepage">
            FreeHosts
          </Link>

          <ul className="nav-links" role="list" aria-label="Site sections">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="nav-link"
                  aria-current={pathname.startsWith(href) ? 'page' : undefined}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button
              ref={searchTriggerRef}
              className="nav-search-hint"
              onClick={() => setSearchOpen(true)}
              aria-label="Search posts (Ctrl+K or Cmd+K)"
              aria-keyshortcuts="Control+k Meta+k"
            >
              <Search size={13} aria-hidden="true" />
              <span aria-hidden="true">Search</span>
              <kbd aria-hidden="true">⌘K</kbd>
            </button>

            {mounted ? (
              <button
                className="nav-icon-btn"
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              >
                {isDark
                  ? <Sun  size={16} aria-hidden="true" />
                  : <Moon size={16} aria-hidden="true" />}
              </button>
            ) : (
              <div className="nav-icon-btn" aria-hidden="true" />
            )}

            <button
              className="nav-icon-btn nav-mobile-toggle"
              onClick={() => setMenuOpen(v => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {menuOpen
                ? <X    size={18} aria-hidden="true" />
                : <Menu size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </nav>

      <div
        id="mobile-nav-menu"
        className={`nav-mobile-menu${menuOpen ? ' is-open' : ''}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <nav aria-label="Mobile navigation">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="nav-mobile-link"
              aria-current={pathname.startsWith(href) ? 'page' : undefined}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>

        {mounted && (
          <button
            className="nav-mobile-theme-btn"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            tabIndex={menuOpen ? 0 : -1}
          >
            {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            {isDark ? 'Light mode' : 'Dark mode'}
          </button>
        )}
      </div>

      {searchOpen && (
        <SearchDialog
          onClose={() => {
            setSearchOpen(false)
            requestAnimationFrame(() => searchTriggerRef.current?.focus())
          }}
        />
      )}
    </>
  )
}
