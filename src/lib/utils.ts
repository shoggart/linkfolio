import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${path}`
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function getDeviceType(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'mobile'
  if (/tablet/i.test(userAgent)) return 'tablet'
  return 'desktop'
}

export function getBrowser(userAgent: string): string {
  if (/chrome/i.test(userAgent)) return 'Chrome'
  if (/firefox/i.test(userAgent)) return 'Firefox'
  if (/safari/i.test(userAgent)) return 'Safari'
  if (/edge/i.test(userAgent)) return 'Edge'
  return 'Other'
}

export const THEMES = {
  default: {
    name: 'Default',
    background: 'bg-gradient-to-br from-gray-50 to-gray-100',
    card: 'bg-white',
    text: 'text-gray-900',
    button: 'bg-gray-900 hover:bg-gray-800 text-white',
  },
  dark: {
    name: 'Dark',
    background: 'bg-gradient-to-br from-gray-900 to-black',
    card: 'bg-gray-800',
    text: 'text-white',
    button: 'bg-white hover:bg-gray-100 text-gray-900',
  },
  ocean: {
    name: 'Ocean',
    background: 'bg-gradient-to-br from-blue-400 to-cyan-500',
    card: 'bg-white/90 backdrop-blur',
    text: 'text-gray-900',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  sunset: {
    name: 'Sunset',
    background: 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600',
    card: 'bg-white/90 backdrop-blur',
    text: 'text-gray-900',
    button: 'bg-purple-600 hover:bg-purple-700 text-white',
  },
  forest: {
    name: 'Forest',
    background: 'bg-gradient-to-br from-green-400 to-emerald-600',
    card: 'bg-white/90 backdrop-blur',
    text: 'text-gray-900',
    button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  },
  midnight: {
    name: 'Midnight',
    background: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800',
    card: 'bg-white/10 backdrop-blur border border-white/20',
    text: 'text-white',
    button: 'bg-white/20 hover:bg-white/30 text-white border border-white/30',
  },
  neon: {
    name: 'Neon',
    background: 'bg-gradient-to-br from-gray-900 via-black to-gray-900',
    card: 'bg-black/40 backdrop-blur border border-cyan-500/30',
    text: 'text-white',
    button: 'bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white shadow-lg shadow-cyan-500/50',
  },
  minimal: {
    name: 'Minimal',
    background: 'bg-white',
    card: 'bg-white',
    text: 'text-black',
    button: 'bg-black hover:bg-gray-800 text-white',
  },
  pastel: {
    name: 'Pastel',
    background: 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200',
    card: 'bg-white/80 backdrop-blur',
    text: 'text-gray-800',
    button: 'bg-gradient-to-r from-pink-300 to-purple-300 hover:from-pink-400 hover:to-purple-400 text-gray-800',
  },
}

export type ThemeName = keyof typeof THEMES

export const BUTTON_STYLES = {
  rounded: {
    name: 'Rounded',
    className: 'rounded-xl',
  },
  square: {
    name: 'Square',
    className: 'rounded-none',
  },
  pill: {
    name: 'Pill',
    className: 'rounded-full',
  },
  outline: {
    name: 'Outline',
    className: 'rounded-xl border-2',
  },
}

export type ButtonStyleName = keyof typeof BUTTON_STYLES

export const SOCIAL_PLATFORMS = [
  { id: 'twitter', name: 'Twitter/X', icon: 'twitter', placeholder: 'https://twitter.com/username' },
  { id: 'instagram', name: 'Instagram', icon: 'instagram', placeholder: 'https://instagram.com/username' },
  { id: 'youtube', name: 'YouTube', icon: 'youtube', placeholder: 'https://youtube.com/@channel' },
  { id: 'tiktok', name: 'TikTok', icon: 'music', placeholder: 'https://tiktok.com/@username' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', placeholder: 'https://linkedin.com/in/username' },
  { id: 'github', name: 'GitHub', icon: 'github', placeholder: 'https://github.com/username' },
  { id: 'twitch', name: 'Twitch', icon: 'twitch', placeholder: 'https://twitch.tv/username' },
  { id: 'discord', name: 'Discord', icon: 'message-circle', placeholder: 'https://discord.gg/invite' },
  { id: 'email', name: 'Email', icon: 'mail', placeholder: 'mailto:you@example.com' },
]
