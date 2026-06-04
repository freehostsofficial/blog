'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { X } from 'lucide-react'

const SHORTCUTS = [
  { key: '?', label: 'Toggle this cheat sheet' },
  { key: '⌘ / Ctrl + K', label: 'Open search' },
  { key: '/', label: 'Focus search' },
  { key: 'Alt + T', label: 'Toggle dark / light mode' },
  { key: 'Alt + H', label: 'Go to Home page' },
  { key: 'Alt + P', label: 'Go to Posts' },
  { key: 'Alt + A', label: 'Go to Archive' },
  { key: 'Alt + S', label: 'Go to Shortcuts page' },
  { key: 'Alt + R', label: 'Go to a random post' },
  { key: 'Esc', label: 'Close modals / dialogs' },
]

export function ShortcutOverlay() {
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
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
        if (e.key === 'Escape' && isOpen) {
          setIsOpen(false)
        }
        return
      }

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault()
        if (!isOpen) previousFocusRef.current = document.activeElement as HTMLElement
        setIsOpen(v => !v)
        return
      }

      if (e.key === 'Escape') {
        if (isOpen) setIsOpen(false)
        return
      }

      if (e.key === '/' && !isOpen) {
        e.preventDefault()
        document.querySelector<HTMLButtonElement>('.nav-search-hint')?.click()
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
          fetch('/search-index.json')
            .then(r => r.json())
            .then(posts => {
              if (!posts.length) return
              const p = posts[Math.floor(Math.random() * posts.length)]
              router.push(`/${p.category}/${p.slug}`)
            })
            .catch(() => {})
        } else if (k === 't') { e.preventDefault(); setTheme(resolvedTheme === 'dark' ? 'light' : 'dark') }
      }
    }
    document.addEventListener('keydown', onKeydown)
    return () => document.removeEventListener('keydown', onKeydown)
  }, [isOpen, router, resolvedTheme, setTheme])

  useEffect(() => {
    if (!isOpen && previousFocusRef.current) {
      previousFocusRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !isOpen) return

    const focusable = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => !el.closest('[aria-hidden="true"]'))

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const els = focusable()
        if (!els.length) return
        const first = els[0]
        const last = els[els.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus() }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus() }
        }
      }
    }

    const els = focusable()
    if (els.length) els[0].focus()

    document.addEventListener('keydown', onKeydown)
    return () => document.removeEventListener('keydown', onKeydown)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="search-overlay" onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}>
      <div
        ref={dialogRef}
        className="shortcut-dialog fade-up"
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard Shortcuts"
      >
        <div className="shortcut-dialog-header">
          <h2 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>Keyboard Shortcuts</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="toast-close"
            style={{ position: 'relative', top: 0, right: 0 }}
            aria-label="Close shortcuts"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="shortcut-dialog-content">
          <ul className="shortcut-list">
            {SHORTCUTS.map(s => (
              <li key={s.key} className="shortcut-item">
                <span className="shortcut-label">{s.label}</span>
                <kbd className="search-kbd">{s.key}</kbd>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
