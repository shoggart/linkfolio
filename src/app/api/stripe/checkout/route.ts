import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { absoluteUrl } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { billingCycle } = await request.json()

    // Validate billing cycle
    if (!billingCycle || (billingCycle !== 'monthly' && billingCycle !== 'yearly')) {
      return NextResponse.json({ error: 'Invalid billing cycle' }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { id: session.id }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Determine price ID based on billing cycle
    const priceId = billingCycle === 'yearly'
      ? process.env.STRIPE_PRO_YEARLY_PRICE_ID
      : process.env.STRIPE_PRO_MONTHLY_PRICE_ID

    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe price IDs not configured' },
        { status: 500 }
      )
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: user.stripeCustomerId ? undefined : user.email,
      customer: user.stripeCustomerId || undefined,
      client_reference_id: user.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: absoluteUrl('/dashboard/billing?success=true'),
      cancel_url: absoluteUrl('/dashboard/billing?canceled=true'),
      metadata: {
        userId: user.id,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
