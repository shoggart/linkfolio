import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Eye, MousePointer, LinkIcon, TrendingUp, ArrowRight, Plus } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

async function getStats(userId: string) {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [totalViews, totalClicks, linkCount, recentViews, recentClicks] = await Promise.all([
    db.profileView.count({ where: { userId } }),
    db.linkClick.count({ where: { userId } }),
    db.link.count({ where: { userId } }),
    db.profileView.count({
      where: { userId, createdAt: { gte: sevenDaysAgo } }
    }),
    db.linkClick.count({
      where: { userId, createdAt: { gte: sevenDaysAgo } }
    }),
  ])

  return {
    totalViews,
    totalClicks,
    linkCount,
    recentViews,
    recentClicks,
    ctr: totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0',
  }
}

async function getRecentLinks(userId: string) {
  return db.link.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      _count: {
        select: { clicks: true }
      }
    }
  })
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/auth/signin')

  const [stats, recentLinks] = await Promise.all([
    getStats(session.id),
    getRecentLinks(session.id),
  ])

  return (
    <div className="space-y-8 pt-14 lg:pt-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session.name?.split(' ')[0] || session.username}!
        </h1>
        <p className="mt-1 text-gray-600">
          Here's what's happening with your LinkFolio
        </p>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard/links"
          className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Link
        </Link>
        <Link
          href={`/${session.username}`}
          target="_blank"
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
        >
          View My Profile
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Views</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {formatNumber(stats.totalViews)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            <span className="text-green-600 font-medium">+{stats.recentViews}</span> in last 7 days
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Clicks</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {formatNumber(stats.totalClicks)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MousePointer className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            <span className="text-green-600 font-medium">+{stats.recentClicks}</span> in last 7 days
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Links</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.linkCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <LinkIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            {session.plan === 'free' ? `${5 - stats.linkCount} remaining on free plan` : 'Unlimited on Pro'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Click Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.ctr}%
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Clicks per profile view
          </p>
        </div>
      </div>

      {/* Recent links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Links</h2>
          <Link
            href="/dashboard/links"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentLinks.length === 0 ? (
            <div className="p-12 text-center">
              <LinkIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No links yet</h3>
              <p className="text-gray-500 mb-4">
                Create your first link to get started
              </p>
              <Link
                href="/dashboard/links"
                className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Link
              </Link>
            </div>
          ) : (
            recentLinks.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{link.title}</p>
                  <p className="text-sm text-gray-500 truncate">{link.url}</p>
                </div>
                <div className="ml-4 flex items-center text-sm text-gray-500">
                  <MousePointer className="w-4 h-4 mr-1" />
                  {link._count.clicks}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upgrade prompt for free users */}
      {session.plan === 'free' && (
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Upgrade to Pro</h3>
              <p className="text-primary-100 mt-1">
                Get unlimited links, advanced analytics, and custom themes
              </p>
            </div>
            <Link
              href="/dashboard/billing"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition whitespace-nowrap"
            >
              Upgrade Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
