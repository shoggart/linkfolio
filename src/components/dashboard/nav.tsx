'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  Link2,
  LayoutDashboard,
  LinkIcon,
  BarChart3,
  Palette,
  Settings,
  CreditCard,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface DashboardNavProps {
  user: {
    id: string
    email: string
    username: string
    name: string | null
    plan: string
  }
}

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Links', href: '/dashboard/links', icon: LinkIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Appearance', href: '/dashboard/appearance', icon: Palette },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
]

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      toast.success('Signed out successfully')
      router.push('/')
      router.refresh()
    } catch {
      toast.error('Failed to sign out')
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
            <Link2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">LinkFolio</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white pt-16">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
            <hr className="my-4" />
            <Link
              href={`/${user.username}`}
              target="_blank"
              className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              <ExternalLink className="w-5 h-5 mr-3" />
              View Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign out
            </button>
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <Link2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">LinkFolio</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <Link
              href={`/${user.username}`}
              target="_blank"
              className="flex items-center justify-center w-full px-4 py-2 mb-3 text-sm font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Profile
            </Link>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.name?.[0] || user.username[0].toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                    {user.name || user.username}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user.plan} Plan</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-red-600 transition"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
