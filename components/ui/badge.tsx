import * as React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'category'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'badge',
        variant === 'accent' && 'badge--accent',
        variant === 'category' && 'badge--category',
        className,
      )}
      {...props}
    />
  )
}
