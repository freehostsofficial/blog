'use client'

import { useEffect } from 'react'

export default function CodeCopyButton() {
  useEffect(() => {
    const preBlocks = document.querySelectorAll<HTMLElement>('pre[data-lang]')
    preBlocks.forEach(pre => {
      if (pre.querySelector('.code-copy-btn')) return
      const btn = document.createElement('button')
      btn.className = 'code-copy-btn'
      btn.setAttribute('aria-label', 'Copy code to clipboard')
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>'
      btn.addEventListener('click', async () => {
        const code = pre.querySelector('code')?.innerText ?? pre.innerText
        try { await navigator.clipboard.writeText(code) }
        catch {
          const ta = document.createElement('textarea')
          ta.value = code; ta.style.cssText = 'position:absolute;left:-9999px'
          document.body.appendChild(ta); ta.select()
          document.execCommand('copy'); ta.remove()
        }
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
        btn.classList.add('is-copied')
        btn.setAttribute('aria-label', 'Copied!')
        setTimeout(() => {
          btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>'
          btn.classList.remove('is-copied')
          btn.setAttribute('aria-label', 'Copy code to clipboard')
        }, 2000)
      })
      pre.appendChild(btn)
    })
  }, [])
  return null
}
