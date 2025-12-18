import { Skeleton } from '@/components/ui/skeleton'

export default function AppearanceLoading() {
  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Theme selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <Skeleton className="h-6 w-40 mb-6" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="relative border-2 border-gray-200 rounded-lg p-4 cursor-pointer"
            >
              <Skeleton className="h-24 w-full mb-3 rounded" />
              <Skeleton className="h-5 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="border-2 border-gray-200 rounded-lg p-8 space-y-4">
          <Skeleton className="h-24 w-24 rounded-full mx-auto" />
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
          <div className="space-y-2 max-w-sm mx-auto pt-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* Save button */}
      <Skeleton className="h-10 w-32" />
    </div>
  )
}
