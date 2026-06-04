'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'

interface Props {
  src: string
  alt: string
  priority?: boolean
  sizes?: string
  className?: string
}

export default function ImageWithSkeleton({ src, alt, priority, sizes, className }: Props) {
  const [loaded, setLoaded] = useState(false)

  const onLoad = useCallback(() => setLoaded(true), [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {!loaded && (
        <div
          className="skeleton skeleton--image"
          style={{ position: 'absolute', inset: 0, zIndex: 1, borderRadius: 0 }}
          aria-hidden="true"
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        style={{
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
        onLoad={onLoad}
        className={className}
      />
    </div>
  )
}
