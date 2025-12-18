import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

// Helper function to calculate trend percentage
function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '7')

    const now = new Date()
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

    // For trend comparison, get data from the previous period
    const previousPeriodStart = new Date(startDate.getTime() - days * 24 * 60 * 60 * 1000)

    // Fetch all analytics data for the current period
    const [views, clicks, previousViews, previousClicks] = await Promise.all([
      db.profileView.findMany({
        where: {
          userId: session.id,
          createdAt: { gte: startDate }
        },
        select: { createdAt: true }
      }),
      db.linkClick.findMany({
        where: {
          userId: session.id,
          createdAt: { gte: startDate }
        },
        select: { createdAt: true }
      }),
      // Previous period for trend calculation
      db.profileView.count({
        where: {
          userId: session.id,
          createdAt: { gte: previousPeriodStart, lt: startDate }
        }
      }),
      db.linkClick.count({
        where: {
          userId: session.id,
          createdAt: { gte: previousPeriodStart, lt: startDate }
        }
      })
    ])

    // Group by day
    const dailyData = new Map<string, { views: number; clicks: number }>()

    // Initialize all days in the range with 0 values
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
      const dateKey = formatDate(date)
      dailyData.set(dateKey, { views: 0, clicks: 0 })
    }

    // Aggregate views by day
    views.forEach(view => {
      const dateKey = formatDate(new Date(view.createdAt))
      const current = dailyData.get(dateKey)
      if (current) {
        current.views++
      }
    })

    // Aggregate clicks by day
    clicks.forEach(click => {
      const dateKey = formatDate(new Date(click.createdAt))
      const current = dailyData.get(dateKey)
      if (current) {
        current.clicks++
      }
    })

    // Convert to array and format dates for display
    const chartData = Array.from(dailyData.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => {
        const d = new Date(date)
        const formattedDate = d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })
        return {
          date: formattedDate,
          views: data.views,
          clicks: data.clicks
        }
      })

    // Calculate totals and trends
    const totalViews = views.length
    const totalClicks = clicks.length
    const viewsTrend = calculateTrend(totalViews, previousViews)
    const clicksTrend = calculateTrend(totalClicks, previousClicks)

    // Get top performing links
    const topLinksData = await db.linkClick.groupBy({
      by: ['linkId'],
      where: {
        userId: session.id,
        createdAt: { gte: startDate }
      },
      _count: { linkId: true },
      orderBy: { _count: { linkId: 'desc' } },
      take: 5
    })

    const linkIds = topLinksData.map(l => l.linkId)
    const linkDetails = await db.link.findMany({
      where: { id: { in: linkIds } },
      select: { id: true, title: true, url: true }
    })

    const topLinks = topLinksData.map(data => {
      const link = linkDetails.find(l => l.id === data.linkId)
      return {
        name: link?.title || 'Unknown',
        url: link?.url || '',
        clicks: data._count.linkId
      }
    })

    return NextResponse.json({
      chartData,
      stats: {
        views: totalViews,
        clicks: totalClicks,
        viewsTrend,
        clicksTrend,
        ctr: totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0'
      },
      topLinks
    })

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
