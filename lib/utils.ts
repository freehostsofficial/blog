import { clsx, type ClassValue } from 'clsx'

/** Merge class names. Uses only clsx — no tailwind-merge needed. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}

/**
 * Get initials from a full name.
 * "Shadow Gaming" → "SG", "Alice" → "AL" (first two chars as fallback)
 */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/)
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

/** Format a date string as "12 Jan 2025" */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** Clamp a number between min and max */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max)
}
