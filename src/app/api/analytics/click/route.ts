import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { headers } from 'next/headers'
import { z } from 'zod'

const clickSchema = z.object({
  linkId: z.string().min(1, 'Link ID is required'),
  userId: z.string().min(1, 'User ID is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = clickSchema.parse(body)

    // Verify the link exists and belongs to the user
    const link = await db.link.findFirst({
      where: {
        id: validatedData.linkId,
        userId: validatedData.userId,
        isActive: true,
      },
    })

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

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

    await db.linkClick.create({
      data: {
        linkId: validatedData.linkId,
        userId: validatedData.userId,
        referrer: referer || null,
        device,
        browser,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Error tracking click:', error)
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 })
  }
}
