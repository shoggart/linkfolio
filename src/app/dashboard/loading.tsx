import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className="space-y-8 pt-14 lg:pt-0">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-9 w-16" />
              </div>
              <Skeleton className="w-12 h-12 rounded-xl" />
            </div>
            <Skeleton className="h-3 w-32 mt-3" />
          </div>
        ))}
      </div>

      {/* Recent links card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="divide-y divide-gray-100">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-64" />
              </div>
              <Skeleton className="h-5 w-12 ml-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
