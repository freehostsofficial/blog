'use client';

import { useEffect } from 'react';

/** Adds copy buttons to all <pre> code blocks on the page */
export function CodeCopyButton() {
  useEffect(() => {
    const blocks = document.querySelectorAll('pre[data-lang]');
    blocks.forEach((el) => {
      const pre = el as HTMLElement;
      if (pre.querySelector('.copy-btn')) return; // already added

      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.setAttribute('aria-label', 'Copy code to clipboard');

      btn.addEventListener('click', async () => {
        const code = pre.querySelector('code');
        if (!code) return;
        try {
          await navigator.clipboard.writeText(code.textContent || '');
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        } catch {
          btn.textContent = 'Failed';
          setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
        }
      });

      pre.style.position = 'relative';
      pre.appendChild(btn);
    });
  }, []);

  return null;
}
