'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { X } from 'lucide-react'

export function ShortcutOverlay() {
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        if (e.key === 'Escape' && isOpen) {
           setIsOpen(false)
        }
        return
      }

      if (e.key === '?') {
        e.preventDefault()
        if (!isOpen) previousFocusRef.current = document.activeElement as HTMLElement
        setIsOpen(v => !v)
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      } else if (!isOpen) {
        const k = e.key.toLowerCase()
        if (k === 'h') router.push('/')
        if (k === 'p') router.push('/posts')
        if (k === 'a') router.push('/archive')
        if (k === 't') setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
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

  const shortcuts = [
    { key: '?', label: 'Toggle this cheat sheet' },
    { key: '⌘ / Ctrl + K', label: 'Open Search' },
    { key: 'T', label: 'Toggle dark/light mode' },
    { key: 'H', label: 'Go to Home page' },
    { key: 'A', label: 'Go to Archive' },
    { key: 'P', label: 'Go to Posts' },
    { key: 'Esc', label: 'Close modals / dialogs' },
  ]

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
            {shortcuts.map(s => (
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
