'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

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
    <div className="relative size-full">
      {!loaded && <Skeleton className="absolute inset-0 z-1 rounded-none" aria-hidden="true" />}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover transition-opacity duration-300", !loaded && "opacity-0", className)}
        onLoad={onLoad}
      />
    </div>
  )
}
