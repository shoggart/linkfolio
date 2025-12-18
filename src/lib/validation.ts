import { z } from 'zod'

/**
 * Sanitizes a string by removing leading/trailing whitespace
 * and preventing XSS attacks by escaping HTML characters
 */
export function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/[<>]/g, (char) => {
      switch (char) {
        case '<': return '&lt;'
        case '>': return '&gt;'
        default: return char
      }
    })
}

/**
 * Enhanced URL validation with protocol and domain checks
 */
export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .refine(
    (url) => {
      try {
        const parsed = new URL(url)
        // Only allow http and https protocols to prevent javascript: and data: URIs
        return parsed.protocol === 'http:' || parsed.protocol === 'https:'
      } catch {
        return false
      }
    },
    { message: 'URL must use http or https protocol' }
  )
  .transform(sanitizeString)

/**
 * Enhanced string validation with sanitization
 */
export const sanitizedString = (options?: {
  min?: number
  max?: number
  message?: string
}) => {
  let schema = z.string()

  if (options?.min) {
    schema = schema.min(options.min, options.message || `Must be at least ${options.min} characters`)
  }

  if (options?.max) {
    schema = schema.max(options.max, options.message || `Must be at most ${options.max} characters`)
  }

  return schema.transform(sanitizeString)
}

/**
 * Reserved usernames that cannot be used
 */
const RESERVED_USERNAMES = [
  'admin', 'api', 'www', 'app', 'dashboard', 'auth', 'login', 'signup',
  'signin', 'signout', 'settings', 'analytics', 'billing', 'links',
  'about', 'contact', 'help', 'support', 'terms', 'privacy', 'security'
]

/**
 * Username validation with strict pattern matching and reserved names check
 */
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be at most 30 characters')
  .regex(
    /^[a-z0-9_]+$/,
    'Username can only contain lowercase letters, numbers, and underscores'
  )
  .transform((val) => val.toLowerCase().trim())
  .refine(
    (username) => !RESERVED_USERNAMES.includes(username),
    { message: 'This username is reserved' }
  )

/**
 * Email validation with sanitization
 */
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .transform((val) => val.toLowerCase().trim())

/**
 * Theme validation - only allow predefined themes
 */
export const themeSchema = z.enum([
  'default',
  'dark',
  'ocean',
  'sunset',
  'forest',
  'midnight',
  'neon',
  'minimal',
  'pastel',
])

/**
 * Button style validation - only allow predefined button styles
 */
export const buttonStyleSchema = z.enum([
  'rounded',
  'square',
  'pill',
  'outline',
])

/**
 * Platform validation - only allow predefined social platforms
 */
export const platformSchema = z.enum([
  'twitter',
  'instagram',
  'youtube',
  'tiktok',
  'linkedin',
  'github',
  'twitch',
  'discord',
  'email',
])

/**
 * Validates and sanitizes link title
 */
export const linkTitleSchema = sanitizedString({
  min: 1,
  max: 100,
  message: 'Title is required and must be at most 100 characters',
})

/**
 * Validates and sanitizes bio text
 */
export const bioSchema = sanitizedString({
  max: 160,
  message: 'Bio must be at most 160 characters',
})

/**
 * Validates and sanitizes name
 */
export const nameSchema = sanitizedString({
  max: 100,
  message: 'Name must be at most 100 characters',
})

/**
 * Password validation with strength requirements
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  )
