import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Check if demo user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: 'demo@linkfolio.app' }
  })

  if (existingUser) {
    console.log('Demo user already exists. Skipping seed.')
    return
  }

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo1234', 12)

  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@linkfolio.app',
      password: hashedPassword,
      username: 'demouser',
      name: 'Demo User',
      bio: 'Welcome to my LinkFolio! Check out my awesome links below.',
      plan: 'pro', // Give pro plan for demo purposes
      theme: 'ocean',
      socialLinks: {
        create: [
          {
            platform: 'twitter',
            url: 'https://twitter.com/linkfolio',
            order: 0,
          },
          {
            platform: 'instagram',
            url: 'https://instagram.com/linkfolio',
            order: 1,
          },
          {
            platform: 'github',
            url: 'https://github.com/linkfolio',
            order: 2,
          },
        ],
      },
      links: {
        create: [
          {
            title: 'My Portfolio',
            url: 'https://example.com/portfolio',
            isActive: true,
            order: 0,
          },
          {
            title: 'Latest Blog Post',
            url: 'https://example.com/blog',
            isActive: true,
            order: 1,
          },
          {
            title: 'YouTube Channel',
            url: 'https://youtube.com/@example',
            isActive: true,
            order: 2,
          },
          {
            title: 'Online Store',
            url: 'https://example.com/store',
            isActive: true,
            order: 3,
          },
          {
            title: 'Contact Me',
            url: 'https://example.com/contact',
            isActive: false,
            order: 4,
          },
        ],
      },
    },
    include: {
      links: true,
      socialLinks: true,
    },
  })

  console.log('Demo user created:', demoUser.username)

  // Create sample analytics data
  // Profile views - create views over the last 30 days
  const profileViews = []
  const devices = ['desktop', 'mobile', 'tablet']
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge']

  for (let i = 0; i < 30; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    // Create 3-10 views per day
    const viewsPerDay = Math.floor(Math.random() * 8) + 3

    for (let j = 0; j < viewsPerDay; j++) {
      profileViews.push({
        userId: demoUser.id,
        device: devices[Math.floor(Math.random() * devices.length)],
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        createdAt: new Date(date.getTime() + j * 3600000), // Spread throughout the day
      })
    }
  }

  await prisma.profileView.createMany({
    data: profileViews,
  })

  console.log(`Created ${profileViews.length} profile views`)

  // Link clicks - create clicks for each active link
  const activeLinks = demoUser.links.filter(link => link.isActive)
  const linkClicks = []

  for (const link of activeLinks) {
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      // Create 1-5 clicks per day per link
      const clicksPerDay = Math.floor(Math.random() * 5) + 1

      for (let j = 0; j < clicksPerDay; j++) {
        linkClicks.push({
          linkId: link.id,
          userId: demoUser.id,
          device: devices[Math.floor(Math.random() * devices.length)],
          browser: browsers[Math.floor(Math.random() * browsers.length)],
          createdAt: new Date(date.getTime() + j * 3600000),
        })
      }
    }
  }

  await prisma.linkClick.createMany({
    data: linkClicks,
  })

  console.log(`Created ${linkClicks.length} link clicks`)

  console.log('\n✅ Database seeded successfully!')
  console.log('\nDemo user credentials:')
  console.log('Email: demo@linkfolio.app')
  console.log('Password: demo1234')
  console.log(`Profile URL: /demouser`)
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
