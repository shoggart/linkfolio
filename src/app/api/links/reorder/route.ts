import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const reorderSchema = z.object({
  links: z.array(
    z.object({
      id: z.string().min(1, 'Link ID is required'),
      order: z.number().int().min(0, 'Order must be a non-negative integer'),
    })
  ).min(1, 'At least one link is required'),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = reorderSchema.parse(body)

    // Verify all links belong to the user
    const linkIds = validatedData.links.map(link => link.id)
    const userLinks = await db.link.findMany({
      where: {
        id: { in: linkIds },
        userId: session.id,
      },
      select: { id: true },
    })

    // Check if all provided link IDs exist and belong to the user
    if (userLinks.length !== linkIds.length) {
      return NextResponse.json(
        { error: 'One or more links not found or do not belong to you' },
        { status: 404 }
      )
    }

    // Update all link orders in a transaction
    await db.$transaction(
      validatedData.links.map(({ id, order }) =>
        db.link.update({
          where: { id },
          data: { order },
        })
      )
    )

    // Fetch updated links to return
    const updatedLinks = await db.link.findMany({
      where: { userId: session.id },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { clicks: true },
        },
      },
    })

    return NextResponse.json({ links: updatedLinks })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Error reordering links:', error)
    return NextResponse.json(
      { error: 'Failed to reorder links' },
      { status: 500 }
    )
  }
}
