import { Skeleton } from '@/components/ui/skeleton'

export default function PostLoading() {
  return (
    <main id="main-content" aria-busy="true" aria-label="Loading post">
      <div className="container-blog">
        <div className="flex gap-2 text-xs text-muted-foreground mb-6 pt-6">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-4 w-24 mb-4" />
        <Skeleton className="h-10 w-3/4 mb-2" />
        <Skeleton className="h-10 w-1/2 mb-4" />
        <Skeleton className="h-5 w-2/3 mb-2" />
        <Skeleton className="h-4 w-1/3 mb-8" />
        <Skeleton className="aspect-[21/9] w-full rounded-xl mb-10" />
        <div className="space-y-3 max-w-[68ch]">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </main>
  )
}
