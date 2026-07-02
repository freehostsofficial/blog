'use client'

import { useEffect, useState } from 'react'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const article = document.querySelector('article')
      if (!article) return
      const { top, height } = article.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const scrollPosition = -top
      const totalScrollable = height - windowHeight
      if (totalScrollable <= 0) { setProgress(100); return }
      setProgress(Math.max(0, Math.min(100, (scrollPosition / totalScrollable) * 100)))
    }
    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()
    setTimeout(updateProgress, 500)
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[100]" aria-hidden="true">
        <div
          className="h-full transition-[width] duration-100 ease-out reading-progress-bar"
          style={{ width: `${progress}%`, backgroundColor: 'var(--primary, oklch(0.92 0.18 160))' }}
      />
    </div>
  )
}
