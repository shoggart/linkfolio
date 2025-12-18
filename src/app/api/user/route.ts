import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'
import { nameSchema, bioSchema, themeSchema, buttonStyleSchema, platformSchema, urlSchema } from '@/lib/validation'

const updateUserSchema = z.object({
  name: nameSchema.optional(),
  bio: bioSchema.optional(),
  theme: themeSchema.optional(),
  buttonStyle: buttonStyleSchema.optional(),
  socialLinks: z.array(z.object({
    platform: platformSchema,
    url: urlSchema,
  })).optional(),
})

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        bio: true,
        avatarUrl: true,
        plan: true,
        theme: true,
        buttonStyle: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        stripeCurrentPeriodEnd: true,
        socialLinks: {
          orderBy: { order: 'asc' }
        },
      }
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateUserSchema.parse(body)

    // Update user
    const updateData: Record<string, unknown> = {}
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.bio !== undefined) updateData.bio = validatedData.bio
    if (validatedData.theme !== undefined) updateData.theme = validatedData.theme
    if (validatedData.buttonStyle !== undefined) updateData.buttonStyle = validatedData.buttonStyle

    const user = await db.user.update({
      where: { id: session.id },
      data: updateData,
    })

    // Update social links if provided
    if (validatedData.socialLinks) {
      // Delete existing social links
      await db.socialLink.deleteMany({
        where: { userId: session.id }
      })

      // Create new social links
      if (validatedData.socialLinks.length > 0) {
        await db.socialLink.createMany({
          data: validatedData.socialLinks.map((link, index) => ({
            userId: session.id,
            platform: link.platform,
            url: link.url,
            order: index,
          }))
        })
      }
    }

    return NextResponse.json({ user })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
