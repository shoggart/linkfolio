'use client'

import { useState } from 'react'
import { Link2, Twitter, Instagram, Youtube, Linkedin, Github, Mail, Music, MessageCircle, Twitch, ExternalLink } from 'lucide-react'
import { THEMES, ThemeName, BUTTON_STYLES, ButtonStyleName } from '@/lib/utils'

interface ProfileClientProps {
  user: {
    id: string
    username: string
    name: string | null
    bio: string | null
    avatarUrl: string | null
    plan: string
  }
  links: Array<{
    id: string
    title: string
    url: string
    thumbnail: string | null
  }>
  socialLinks: Array<{
    id: string
    platform: string
    url: string
  }>
  theme: typeof THEMES[ThemeName]
  themeName: ThemeName
  buttonStyle: typeof BUTTON_STYLES[ButtonStyleName]
  buttonStyleName: ButtonStyleName
}

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  github: Github,
  email: Mail,
  tiktok: Music,
  discord: MessageCircle,
  twitch: Twitch,
}

export function ProfileClient({ user, links, socialLinks, theme, themeName, buttonStyle, buttonStyleName }: ProfileClientProps) {
  const trackClick = async (linkId: string) => {
    try {
      await fetch('/api/analytics/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId, userId: user.id }),
      })
    } catch {
      // Silently fail - don't interrupt user experience
    }
  }

  return (
    <div className={`min-h-screen ${theme.background} py-12 px-4`}>
      <div className="max-w-md mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name || user.username}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-white/50"
            />
          ) : (
            <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold ${
              themeName === 'dark' || themeName === 'midnight'
                ? 'bg-white/20 text-white'
                : 'bg-gray-900 text-white'
            }`}>
              {(user.name || user.username)[0].toUpperCase()}
            </div>
          )}
          <h1 className={`text-2xl font-bold ${theme.text}`}>
            {user.name || `@${user.username}`}
          </h1>
          {user.name && (
            <p className={`${theme.text} opacity-70`}>@{user.username}</p>
          )}
          {user.bio && (
            <p className={`mt-3 ${theme.text} opacity-80 max-w-sm mx-auto`}>
              {user.bio}
            </p>
          )}

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center justify-center gap-3 mt-4">
              {socialLinks.map((social) => {
                const Icon = socialIcons[social.platform] || ExternalLink
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full ${
                      themeName === 'dark' || themeName === 'midnight'
                        ? 'bg-white/10 hover:bg-white/20 text-white'
                        : 'bg-gray-900/10 hover:bg-gray-900/20 text-gray-900'
                    } transition`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          )}
        </div>

        {/* Links */}
        <div className="space-y-3">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick(link.id)}
              className={`block w-full py-4 px-6 text-center font-medium transition transform hover:scale-[1.02] ${theme.button} ${buttonStyle.className}`}
            >
              {link.title}
            </a>
          ))}
        </div>

        {/* Branding (free users) */}
        {user.plan === 'free' && (
          <div className="mt-12 text-center">
            <a
              href="/"
              className={`inline-flex items-center text-sm ${theme.text} opacity-50 hover:opacity-70 transition`}
            >
              <Link2 className="w-4 h-4 mr-1" />
              Made with LinkFolio
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
