import { Skeleton } from '@/components/ui/skeleton'

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Stats cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-10 w-20 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Device breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <Skeleton className="h-6 w-40 mb-6" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Browser breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <Skeleton className="h-6 w-40 mb-6" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top links table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">
                  <Skeleton className="h-4 w-12" />
                </th>
                <th className="px-6 py-3 text-left">
                  <Skeleton className="h-4 w-16" />
                </th>
                <th className="px-6 py-3 text-left">
                  <Skeleton className="h-4 w-20" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-48" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-12" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-16" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
