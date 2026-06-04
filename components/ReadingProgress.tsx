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
      
      if (totalScrollable <= 0) {
        setProgress(100)
        return
      }
      
      let percentage = (scrollPosition / totalScrollable) * 100
      percentage = Math.max(0, Math.min(100, percentage))
      
      setProgress(percentage)
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    // Initial check
    updateProgress()
    // Check after images might have loaded
    setTimeout(updateProgress, 500)
    
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div 
      className="reading-progress-container"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '4px',
        backgroundColor: 'transparent',
        zIndex: 100,
      }}
    >
      <div 
        className="reading-progress-bar"
        style={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: 'var(--c-accent)',
          transition: 'width 100ms ease-out',
        }}
      />
    </div>
  )
}
