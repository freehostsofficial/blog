'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { SearchDialog } from './SearchDialog';

const NAV_ITEMS = [
  { href: '/posts', label: 'All Posts' },
  { href: '/archive', label: 'Archive' },
  { href: '/guides', label: 'Guides' },
  { href: '/tutorials', label: 'Tutorials' },
  { href: '/news', label: 'News' },
  { href: '/opinion', label: 'Opinion' },
  { href: '/community', label: 'Community' },
  { href: '/authors', label: 'Authors' },
  { href: '/tags', label: 'Tags' },
  { href: '/about', label: 'About' },
];

/** Top navigation bar with active indicators, categories, and mobile drawer */
export function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  function isActive(href: string) {
    if (href === '/blog') return pathname === '/blog' || pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <>
      <nav className="nav" id="main-nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <span>FreeHosts</span> Blog
          </Link>

          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <button
              className="nav-link"
              onClick={() => { setSearchOpen(true); setMenuOpen(false); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              aria-label="Search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
            <ThemeToggle />
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            )}
          </button>
        </div>
      </nav>
      {searchOpen && <SearchDialog onClose={() => setSearchOpen(false)} />}
    </>
  );
}
