import { getInitials } from '@/lib/utils'

interface AvatarProps { name: string; src?: string; size?: 'xs' | 'sm' | 'md' | 'lg' }

export function Avatar({ name, src, size = 'md' }: AvatarProps) {
  /* eslint-disable-next-line @next/next/no-img-element */
  if (src) return <img src={src} alt={name} className={`avatar-${size}`} />
  return <span className={`avatar-${size}`} aria-label={name}>{getInitials(name)}</span>
}
