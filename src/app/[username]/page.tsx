import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { THEMES, ThemeName, BUTTON_STYLES, ButtonStyleName } from '@/lib/utils'
import { headers } from 'next/headers'
import { ProfileClient } from './profile-client'

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

async function getProfile(username: string) {
  const user = await db.user.findUnique({
    where: { username: username.toLowerCase() },
    include: {
      links: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
      },
      socialLinks: {
        orderBy: { order: 'asc' },
      },
    },
  })

  return user
}

async function trackView(userId: string) {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const referer = headersList.get('referer') || ''

  let device = 'desktop'
  if (/mobile/i.test(userAgent)) device = 'mobile'
  else if (/tablet/i.test(userAgent)) device = 'tablet'

  let browser = 'other'
  if (/chrome/i.test(userAgent)) browser = 'Chrome'
  else if (/firefox/i.test(userAgent)) browser = 'Firefox'
  else if (/safari/i.test(userAgent)) browser = 'Safari'
  else if (/edge/i.test(userAgent)) browser = 'Edge'

  try {
    await db.profileView.create({
      data: {
        userId,
        referrer: referer || null,
        device,
        browser,
      },
    })
  } catch (error) {
    console.error('Failed to track view:', error)
  }
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { username } = await params
  const user = await getProfile(username)

  if (!user) {
    return {
      title: 'Profile Not Found | LinkFolio',
    }
  }

  return {
    title: `${user.name || user.username} | LinkFolio`,
    description: user.bio || `Check out ${user.name || user.username}'s links on LinkFolio`,
    openGraph: {
      title: `${user.name || user.username} | LinkFolio`,
      description: user.bio || `Check out ${user.name || user.username}'s links`,
      type: 'profile',
    },
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  const user = await getProfile(username)

  if (!user) {
    notFound()
  }

  // Track the view
  await trackView(user.id)

  const theme = THEMES[user.theme as ThemeName] || THEMES.default
  const buttonStyle = BUTTON_STYLES[user.buttonStyle as ButtonStyleName] || BUTTON_STYLES.rounded

  return (
    <ProfileClient
      user={{
        id: user.id,
        username: user.username,
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        plan: user.plan,
      }}
      links={user.links}
      socialLinks={user.socialLinks}
      theme={theme}
      themeName={user.theme as ThemeName}
      buttonStyle={buttonStyle}
      buttonStyleName={user.buttonStyle as ButtonStyleName}
    />
  )
}
