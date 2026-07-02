'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Search, Sun, Moon, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
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
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', onKeydown)
    return () => document.removeEventListener('keydown', onKeydown)
  }, [])

  const { resolvedTheme, setTheme, mounted } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 glass border-b border-glass-border" aria-label="Main navigation">
        <div className="container-blog h-full flex items-center gap-8">
          <Link
            href="/"
            className="font-semibold text-lg tracking-tight text-foreground hover:text-primary transition-colors shrink-0 no-underline hover:no-underline"
            aria-label="FreeHosts — go to homepage"
          >
            FreeHosts
          </Link>

          <div className="hidden md:flex items-center gap-1" role="list" aria-label="Site sections">
            {NAV_LINKS.map(({ href, label }) => (
              <Button
                key={href}
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href={href} aria-current={pathname.startsWith(href) ? 'page' : undefined} />}
                className={cn(pathname.startsWith(href) && "bg-muted")}
              >
                {label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchOpen(true)}
              aria-label="Search posts (Ctrl+K or Cmd+K)"
              className="hidden sm:inline-flex text-muted-foreground gap-2"
            >
              <Search className="size-3.5" />
              <span>Search</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-1">
                ⌘K
              </kbd>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="sm:hidden"
            >
              <Search className="size-4" />
            </Button>

            {mounted ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              >
                {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>
            ) : (
              <div className="size-8" aria-hidden="true" />
            )}

            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation menu" />}>
                <Menu className="size-4" />
              </SheetTrigger>
              <SheetContent side="right" className="w-72 glass">
                <SheetHeader>
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 mt-6" aria-label="Mobile navigation">
                  {NAV_LINKS.map(({ href, label }) => (
                    <Button
                      key={href}
                      variant="ghost"
                      className={cn(
                        "justify-start text-base h-10",
                        pathname.startsWith(href) && "bg-muted text-foreground"
                      )}
                      nativeButton={false}
                      render={<Link href={href} />}
                    >
                      {label}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    className="justify-start text-base h-10 gap-3"
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  >
                    {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                    {isDark ? 'Light mode' : 'Dark mode'}
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {searchOpen && (
        <SearchDialog
          onClose={() => {
            setSearchOpen(false)
          }}
        />
      )}
    </>
  )
}
