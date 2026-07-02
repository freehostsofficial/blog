import { Skeleton } from '@/components/ui/skeleton'

export default function PostsLoading() {
  return (
    <main id="main-content" aria-busy="true" aria-label="Loading posts">
      <div className="sticky top-14 z-40 glass border-b border-glass-border mb-8">
        <div className="container-blog flex gap-1 py-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="container-blog">
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-4 w-24 mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass rounded-xl overflow-hidden">
              <Skeleton className="aspect-video w-full rounded-none" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
