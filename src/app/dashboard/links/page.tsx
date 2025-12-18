'use client'

import { useState, useEffect } from 'react'
import { Plus, GripVertical, Trash2, ExternalLink, Loader2, ToggleLeft, ToggleRight } from 'lucide-react'
import toast from 'react-hot-toast'

interface Link {
  id: string
  title: string
  url: string
  isActive: boolean
  order: number
  _count: {
    clicks: number
  }
}

export default function LinksPage() {
  const [links, setLinks] = useState<Link[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newLink, setNewLink] = useState({ title: '', url: '' })
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links')
      const data = await res.json()
      setLinks(data.links || [])
    } catch {
      toast.error('Failed to fetch links')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLink.title || !newLink.url) return

    setIsAdding(true)
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLink),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to add link')
      }

      toast.success('Link added!')
      setNewLink({ title: '', url: '' })
      setShowAddForm(false)
      fetchLinks()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add link')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return

    try {
      const res = await fetch(`/api/links/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Link deleted')
      fetchLinks()
    } catch {
      toast.error('Failed to delete link')
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/links/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })
      if (!res.ok) throw new Error('Failed to update')
      fetchLinks()
    } catch {
      toast.error('Failed to update link')
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
    <div className="space-y-6 pt-14 lg:pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Links</h1>
          <p className="mt-1 text-gray-600">Manage your bio links</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Link
        </button>
      </div>

      {/* Add link form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Link</h3>
          <form onSubmit={handleAddLink} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={newLink.title}
                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="My Website"
                required
              />
            </div>
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                type="url"
                id="url"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://example.com"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isAdding}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition text-sm font-medium"
              >
                {isAdding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Add Link'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Links list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {links.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No links yet</h3>
            <p className="text-gray-500 mb-4">
              Add your first link to get started
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Link
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {links.map((link) => (
              <div
                key={link.id}
                className={`flex items-center gap-4 p-4 ${!link.isActive ? 'opacity-50' : ''}`}
              >
                <div className="cursor-move text-gray-400 hover:text-gray-600">
                  <GripVertical className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{link.title}</h4>
                  <p className="text-sm text-gray-500 truncate">{link.url}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{link._count.clicks} clicks</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(link.id, link.isActive)}
                    className={`p-2 rounded-lg transition ${
                      link.isActive
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={link.isActive ? 'Disable link' : 'Enable link'}
                  >
                    {link.isActive ? (
                      <ToggleRight className="w-5 h-5" />
                    ) : (
                      <ToggleLeft className="w-5 h-5" />
                    )}
                  </button>

                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    title="Open link"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>

                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete link"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
