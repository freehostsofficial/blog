import { Skeleton } from '@/components/ui/skeleton'

export default function RootLoading() {
  return (
    <main id="main-content" aria-busy="true" aria-label="Loading page content">
      <section className="relative min-h-[70vh] flex items-end overflow-hidden mb-10">
        <div className="w-full container-blog pb-10 pt-16">
          <Skeleton className="h-6 w-16 rounded-full mb-3" />
          <Skeleton className="h-12 w-3/4 mb-3" />
          <Skeleton className="h-5 w-1/2 mb-4" />
          <Skeleton className="h-4 w-1/4 mb-4" />
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
      </section>

      <div className="container-blog">
        <Skeleton className="h-4 w-16 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass rounded-xl overflow-hidden">
              <Skeleton className="aspect-video w-full rounded-none" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
        <div className="text-center py-8">
          <Skeleton className="h-8 w-36 rounded-lg mx-auto" />
        </div>
      </div>
    </main>
  )
}
