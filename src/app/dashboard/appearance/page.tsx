'use client'

import { useState, useEffect } from 'react'
import { Check, Loader2, Lock } from 'lucide-react'
import { THEMES, ThemeName, BUTTON_STYLES, ButtonStyleName } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AppearancePage() {
  const [user, setUser] = useState<{ theme: string; plan: string; buttonStyle: string } | null>(null)
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>('default')
  const [selectedButtonStyle, setSelectedButtonStyle] = useState<ButtonStyleName>('rounded')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/user')
      const data = await res.json()
      setUser(data.user)
      setSelectedTheme(data.user?.theme || 'default')
      setSelectedButtonStyle(data.user?.buttonStyle || 'rounded')
    } catch {
      toast.error('Failed to fetch settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: selectedTheme,
          buttonStyle: selectedButtonStyle,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save')
      }

      toast.success('Appearance updated!')
      fetchUser()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  const proThemes: ThemeName[] = ['midnight', 'sunset', 'forest', 'ocean']

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
        <h1 className="text-2xl font-bold text-gray-900">Appearance</h1>
        <p className="mt-1 text-gray-600">Customize how your profile looks</p>
      </div>

      {/* Theme Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(Object.entries(THEMES) as [ThemeName, typeof THEMES[ThemeName]][]).map(([key, theme]) => {
            const isPro = proThemes.includes(key)
            const isLocked = isPro && user?.plan !== 'pro'
            const isSelected = selectedTheme === key

            return (
              <button
                key={key}
                onClick={() => !isLocked && setSelectedTheme(key)}
                disabled={isLocked}
                className={`relative p-4 rounded-xl border-2 transition ${
                  isSelected
                    ? 'border-primary-500 ring-2 ring-primary-100'
                    : 'border-gray-200 hover:border-gray-300'
                } ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {/* Theme Preview */}
                <div className={`h-24 rounded-lg mb-3 ${theme.background}`}>
                  <div className="p-3 space-y-2">
                    <div className={`h-4 w-8 rounded-full mx-auto ${
                      key === 'dark' || key === 'midnight' ? 'bg-white/30' : 'bg-gray-900/20'
                    }`} />
                    <div className={`h-3 rounded ${theme.button} w-full`} />
                    <div className={`h-3 rounded ${theme.button} w-full`} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{theme.name}</span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-primary-500" />
                  )}
                  {isLocked && (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}
                </div>

                {isPro && (
                  <span className="absolute top-2 right-2 text-xs font-medium bg-gradient-to-r from-primary-500 to-purple-500 text-white px-2 py-0.5 rounded-full">
                    PRO
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {user?.plan === 'free' && (
          <p className="mt-4 text-sm text-gray-500">
            Upgrade to Pro to unlock all premium themes.{' '}
            <a href="/dashboard/billing" className="text-primary-600 hover:underline">
              Upgrade now
            </a>
          </p>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving || (selectedTheme === user?.theme && selectedButtonStyle === user?.buttonStyle)}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>

      {/* Button Style Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Button Style</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(Object.entries(BUTTON_STYLES) as [ButtonStyleName, typeof BUTTON_STYLES[ButtonStyleName]][]).map(([key, style]) => {
            const isSelected = selectedButtonStyle === key

            return (
              <button
                key={key}
                onClick={() => setSelectedButtonStyle(key)}
                className={`relative p-4 rounded-xl border-2 transition ${
                  isSelected
                    ? 'border-primary-500 ring-2 ring-primary-100'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Button Style Preview */}
                <div className="mb-3 flex items-center justify-center h-16">
                  <div className={`w-full h-10 bg-gray-900 flex items-center justify-center text-white text-xs font-medium ${style.className}`}>
                    Button
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{style.name}</span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-primary-500" />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
        <div className={`rounded-xl overflow-hidden ${THEMES[selectedTheme].background}`}>
          <div className="p-8 max-w-sm mx-auto">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-full mx-auto mb-3 ${
                selectedTheme === 'dark' || selectedTheme === 'midnight' || selectedTheme === 'neon'
                  ? 'bg-white/20'
                  : 'bg-gray-900'
              }`} />
              <h4 className={`font-bold ${THEMES[selectedTheme].text}`}>Your Name</h4>
              <p className={`text-sm opacity-70 ${THEMES[selectedTheme].text}`}>@username</p>
            </div>
            <div className="space-y-3">
              <div className={`py-3 px-4 text-center font-medium ${THEMES[selectedTheme].button} ${BUTTON_STYLES[selectedButtonStyle].className}`}>
                My Website
              </div>
              <div className={`py-3 px-4 text-center font-medium ${THEMES[selectedTheme].button} ${BUTTON_STYLES[selectedButtonStyle].className}`}>
                Latest Video
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
