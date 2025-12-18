import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'
import { linkTitleSchema, urlSchema } from '@/lib/validation'

const updateLinkSchema = z.object({
  title: linkTitleSchema.optional(),
  url: urlSchema.optional(),
  isActive: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateLinkSchema.parse(body)

    // Verify ownership
    const existingLink = await db.link.findFirst({
      where: { id, userId: session.id }
    })

    if (!existingLink) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    const link = await db.link.update({
      where: { id },
      data: validatedData,
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
    console.error('Error updating link:', error)
    return NextResponse.json({ error: 'Failed to update link' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Verify ownership
    const existingLink = await db.link.findFirst({
      where: { id, userId: session.id }
    })

    if (!existingLink) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    await db.link.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting link:', error)
    return NextResponse.json({ error: 'Failed to delete link' }, { status: 500 })
  }
}
