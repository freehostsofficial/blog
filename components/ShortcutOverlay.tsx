'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Kbd } from '@/components/ui/kbd'

const SHORTCUTS = [
  { key: '?', label: 'Toggle this cheat sheet' },
  { key: '⌘K / Ctrl+K', label: 'Open search' },
  { key: '/', label: 'Focus search' },
  { key: 'Alt+T', label: 'Toggle dark / light mode' },
  { key: 'Alt+H', label: 'Go to Home page' },
  { key: 'Alt+P', label: 'Go to Posts' },
  { key: 'Alt+A', label: 'Go to Archive' },
  { key: 'Alt+S', label: 'Go to Shortcuts page' },
  { key: 'Alt+R', label: 'Go to a random post' },
  { key: 'Esc', label: 'Close modals / dialogs' },
]

export function ShortcutOverlay() {
  const [isOpen, setIsOpen] = useState(false)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      const isInputFocused =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable

      if (isInputFocused) {
        if (e.key === 'Escape' && isOpen) setIsOpen(false)
        return
      }

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault()
        if (!isOpen) previousFocusRef.current = document.activeElement as HTMLElement
        setIsOpen(v => !v)
        return
      }

      if (e.key === 'Escape') { if (isOpen) setIsOpen(false); return }
      if (e.key === '/' && !isOpen) {
        e.preventDefault()
        document.querySelector<HTMLButtonElement>('[aria-label="Search posts"]')?.click()
        return
      }

      if (!isOpen && e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        const k = e.key.toLowerCase()
        if (k === 'p') { e.preventDefault(); router.push('/posts') }
        else if (k === 'h') { e.preventDefault(); router.push('/') }
        else if (k === 'a') { e.preventDefault(); router.push('/archive') }
        else if (k === 's') { e.preventDefault(); router.push('/shortcuts') }
        else if (k === 'r') {
          e.preventDefault()
          fetch('/search-index.json').then(r => r.json()).then(posts => {
            if (!posts.length) return
            const p = posts[Math.floor(Math.random() * posts.length)]
            router.push(`/${p.category}/${p.slug}`)
          }).catch(() => {})
        } else if (k === 't') { e.preventDefault(); setTheme(resolvedTheme === 'dark' ? 'light' : 'dark') }
      }
    }
    document.addEventListener('keydown', onKeydown)
    return () => document.removeEventListener('keydown', onKeydown)
  }, [isOpen, router, resolvedTheme, setTheme])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) setIsOpen(false) }}>
      <DialogContent className="sm:max-w-lg glass">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">Shortcut</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SHORTCUTS.map(s => (
              <TableRow key={s.key}>
                <TableCell><Kbd>{s.key}</Kbd></TableCell>
                <TableCell className="text-muted-foreground">{s.label}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}
