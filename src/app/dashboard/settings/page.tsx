'use client'

import { useState, useEffect } from 'react'
import { Loader2, Save, User, Link2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { SOCIAL_PLATFORMS } from '@/lib/utils'

interface UserData {
  name: string
  bio: string
  username: string
  email: string
  socialLinks: Array<{ id: string; platform: string; url: string }>
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
  })
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/user')
      const data = await res.json()
      setUser(data.user)
      setFormData({
        name: data.user?.name || '',
        bio: data.user?.bio || '',
      })

      // Convert social links array to object
      const linksObj: Record<string, string> = {}
      data.user?.socialLinks?.forEach((link: { platform: string; url: string }) => {
        linksObj[link.platform] = link.url
      })
      setSocialLinks(linksObj)
    } catch {
      toast.error('Failed to fetch settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Convert social links object to array
      const socialLinksArray = Object.entries(socialLinks)
        .filter(([_, url]) => url.trim())
        .map(([platform, url]) => ({ platform, url }))

      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          socialLinks: socialLinksArray,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save')
      }

      toast.success('Settings saved!')
      fetchUser()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 pt-14 lg:pt-0">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-8 pt-14 lg:pt-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-600">Manage your profile settings</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
            <p className="text-sm text-gray-500">Update your profile details</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="Your display name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="Tell visitors about yourself"
              maxLength={160}
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.bio.length}/160 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="flex rounded-lg shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                linkfolio.com/
              </span>
              <input
                type="text"
                value={user?.username || ''}
                disabled
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg bg-gray-50 text-gray-500"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Username cannot be changed
            </p>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Link2 className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Social Links</h3>
            <p className="text-sm text-gray-500">Add social media icons to your profile</p>
          </div>
        </div>

        <div className="space-y-4">
          {SOCIAL_PLATFORMS.map((platform) => (
            <div key={platform.id}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {platform.name}
              </label>
              <input
                type="url"
                value={socialLinks[platform.id] || ''}
                onChange={(e) => setSocialLinks({ ...socialLinks, [platform.id]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder={platform.placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition font-medium"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Changes
        </button>
      </div>
    </div>
  )
}
