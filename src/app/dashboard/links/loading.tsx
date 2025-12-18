import { Skeleton } from '@/components/ui/skeleton'

export default function LinksLoading() {
  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>

      {/* Add link form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-4">
          <div>
            <Skeleton className="h-4 w-12 mb-2" />
            <Skeleton className="h-11 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-12 mb-2" />
            <Skeleton className="h-11 w-full" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Links list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <Skeleton className="h-6 w-28" />
        </div>
        <div className="divide-y divide-gray-100">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-48" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </div>
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
