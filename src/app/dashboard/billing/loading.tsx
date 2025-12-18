import { Skeleton } from '@/components/ui/skeleton'

export default function BillingLoading() {
  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Current plan */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-8 w-24 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Billing cycle toggle */}
      <div className="flex justify-center">
        <Skeleton className="h-12 w-64 rounded-full" />
      </div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6"
          >
            <Skeleton className="h-6 w-20 mb-2" />
            <Skeleton className="h-10 w-32 mb-4" />
            <Skeleton className="h-4 w-full mb-6" />
            <div className="space-y-3 mb-6">
              {[...Array(5)].map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <Skeleton className="h-5 w-64 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
