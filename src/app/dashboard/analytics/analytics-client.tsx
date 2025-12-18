'use client'

import { useState, useEffect } from 'react'
import { Eye, MousePointer, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { LineChart } from '@/components/analytics/line-chart'
import { BarChart } from '@/components/analytics/bar-chart'
import { formatNumber } from '@/lib/utils'

interface ChartDataPoint {
  date: string
  views: number
  clicks: number
}

interface TopLink {
  name: string
  url: string
  clicks: number
}

interface AnalyticsData {
  chartData: ChartDataPoint[]
  stats: {
    views: number
    clicks: number
    viewsTrend: number
    clicksTrend: number
    ctr: string
  }
  topLinks: TopLink[]
}

const DATE_RANGES = [
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 }
]

export function AnalyticsClient() {
  const [dateRange, setDateRange] = useState(7)
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true)
        const response = await fetch(`/api/analytics?days=${dateRange}`)
        if (!response.ok) throw new Error('Failed to fetch analytics')
        const analyticsData = await response.json()
        setData(analyticsData)
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [dateRange])

  if (loading) {
    return (
      <div className="space-y-8 pt-14 lg:pt-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-gray-600">Track your profile performance</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-8 pt-14 lg:pt-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-gray-600">Track your profile performance</p>
        </div>
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500">Failed to load analytics data</p>
        </div>
      </div>
    )
  }

  const TrendIndicator = ({ value }: { value: number }) => {
    if (value === 0) return null
    const isPositive = value > 0
    return (
      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? (
          <ArrowUpRight className="w-4 h-4" />
        ) : (
          <ArrowDownRight className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">{Math.abs(value)}%</span>
      </div>
    )
  }

  return (
    <div className="space-y-8 pt-14 lg:pt-0">
      {/* Header with Date Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-gray-600">Track your profile performance</p>
        </div>

        <div className="flex gap-2">
          {DATE_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => setDateRange(range.value)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                dateRange === range.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Profile Views</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {formatNumber(data.stats.views)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-500">Last {dateRange} days</p>
            <TrendIndicator value={data.stats.viewsTrend} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Link Clicks</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {formatNumber(data.stats.clicks)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MousePointer className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-500">Last {dateRange} days</p>
            <TrendIndicator value={data.stats.clicksTrend} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Click Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {data.stats.ctr}%
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Clicks per view</p>
        </div>
      </div>

      {/* Line Chart - Views and Clicks Over Time */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Views & Clicks Over Time</h3>
          <p className="text-sm text-gray-600 mt-1">Track your profile activity trends</p>
        </div>
        {data.chartData.length > 0 ? (
          <LineChart data={data.chartData} className="h-80" />
        ) : (
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">No data available for this period</p>
          </div>
        )}
      </div>

      {/* Top Performing Links - Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Links</h3>
          <p className="text-sm text-gray-600 mt-1">Your most clicked links</p>
        </div>
        {data.topLinks.length > 0 ? (
          <BarChart data={data.topLinks} className="h-80" />
        ) : (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <MousePointer className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No clicks recorded yet</p>
              <p className="text-sm text-gray-400 mt-2">Share your profile to start tracking clicks</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
