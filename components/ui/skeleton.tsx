interface SkeletonProps {
  variant?: 'text' | 'title' | 'avatar' | 'image' | 'card' | 'badge' | 'text-sm'
  width?: string
  height?: string
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({ variant = 'text', width, height, className = '', style }: SkeletonProps) {
  const variantClass = variant !== 'text' ? ` skeleton--${variant}` : ''
  const combinedStyle = { ...(width ? { width } : {}), ...(height ? { height } : {}), ...style }
  return (
    <div
      className={`skeleton${variantClass}${className ? ` ${className}` : ''}`}
      style={combinedStyle}
      aria-hidden="true"
    />
  )
}
