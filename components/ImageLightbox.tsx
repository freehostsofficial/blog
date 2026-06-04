'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { X } from 'lucide-react'

export function ImageLightbox() {
  const [activeImage, setActiveImage] = useState<{ src: string, alt: string } | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const close = useCallback(() => {
    setActiveImage(null)
    previousFocusRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG' && target.closest('.prose')) {
        const img = target as HTMLImageElement
        previousFocusRef.current = document.activeElement as HTMLElement
        setActiveImage({ src: img.src, alt: img.alt })
      }
    }
    document.addEventListener('click', handleImageClick)
    return () => document.removeEventListener('click', handleImageClick)
  }, [])

  useEffect(() => {
    if (!activeImage) return
    const overlay = overlayRef.current
    if (!overlay) return

    const focusable = () =>
      Array.from(
        overlay.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
        )
      )

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { close(); return }
      if (e.key === 'Tab') {
        const els = focusable()
        if (!els.length) return
        const first = els[0]
        const last = els[els.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeydown)
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeydown)
      document.body.style.overflow = ''
    }
  }, [activeImage, close])

  if (!activeImage) return null

  return (
    <div
      ref={overlayRef}
      className="lightbox-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) close() }}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      <button
        ref={closeRef}
        className="lightbox-close"
        onClick={close}
        aria-label="Close image viewer"
        autoFocus
      >
        <X size={24} aria-hidden="true" />
      </button>
      <div className="lightbox-content fade-up">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={activeImage.src} alt={activeImage.alt} className="lightbox-image" />
        {activeImage.alt && (
          <p className="lightbox-caption">{activeImage.alt}</p>
        )}
      </div>
    </div>
  )
}
