import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'
import { PLANS } from '@/lib/stripe'
import { linkTitleSchema, urlSchema } from '@/lib/validation'

const createLinkSchema = z.object({
  title: linkTitleSchema,
  url: urlSchema,
})

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const links = await db.link.findMany({
      where: { userId: session.id },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { clicks: true }
        }
      }
    })

    return NextResponse.json({ links })
  } catch (error) {
    console.error('Error fetching links:', error)
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createLinkSchema.parse(body)

    // Check link limit for free users
    const user = await db.user.findUnique({
      where: { id: session.id },
      include: { _count: { select: { links: true } } }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const limit = user.plan === 'pro' ? Infinity : PLANS.free.limits.links
    if (user._count.links >= limit) {
      return NextResponse.json(
        { error: `You've reached your limit of ${limit} links. Upgrade to Pro for unlimited links!` },
        { status: 403 }
      )
    }

    // Get the highest order number
    const lastLink = await db.link.findFirst({
      where: { userId: session.id },
      orderBy: { order: 'desc' }
    })

    const link = await db.link.create({
      data: {
        title: validatedData.title,
        url: validatedData.url,
        userId: session.id,
        order: (lastLink?.order ?? -1) + 1,
      },
      include: {
        _count: {
          select: { clicks: true }
        }
      }
    })

    return NextResponse.json({ link })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Error creating link:', error)
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 })
  }
}
