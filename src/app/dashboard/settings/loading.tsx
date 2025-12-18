import { Skeleton } from '@/components/ui/skeleton'

export default function SettingsLoading() {
  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Profile information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="space-y-4">
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-11 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-11 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-3 w-24 mt-1" />
          </div>
        </div>
      </div>

      {/* Social links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-11 flex-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <Skeleton className="h-10 w-32" />
    </div>
  )
}
