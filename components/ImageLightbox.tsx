'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export function ImageLightbox() {
  const [activeImage, setActiveImage] = useState<{ src: string; alt: string } | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const close = useCallback(() => {
    setActiveImage(null)
    previousFocusRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG' && target.closest('.prose')) {
        previousFocusRef.current = document.activeElement as HTMLElement
        const img = target as HTMLImageElement
        setActiveImage({ src: img.src, alt: img.alt })
      }
    }
    document.addEventListener('click', handleImageClick)
    return () => document.removeEventListener('click', handleImageClick)
  }, [])

  return (
    <Dialog open={!!activeImage} onOpenChange={(open) => { if (!open) close() }}>
      <DialogContent className="sm:max-w-[90vw] p-0 glass overflow-hidden border-0" showCloseButton={false}>
        <DialogTitle className="sr-only">{activeImage?.alt || 'Image viewer'}</DialogTitle>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10"
          onClick={close}
          aria-label="Close image viewer"
        >
          <X className="size-4" />
        </Button>
        {activeImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={activeImage.src} alt={activeImage.alt} className="w-full h-auto max-h-[85vh] object-contain" />
        )}
      </DialogContent>
    </Dialog>
  )
}
