import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const PLANS = {
  free: {
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    features: [
      'Up to 5 links',
      'Basic analytics',
      'Standard themes',
      'LinkFolio branding',
    ],
    limits: {
      links: 5,
      analytics: 7, // days of analytics
    },
  },
  pro: {
    name: 'Pro',
    description: 'For creators and professionals',
    monthlyPrice: 9,
    yearlyPrice: 79,
    features: [
      'Unlimited links',
      'Advanced analytics',
      'Custom themes',
      'Remove branding',
      'Priority support',
      'Custom CSS',
      'Link scheduling',
    ],
    limits: {
      links: Infinity,
      analytics: 365, // days of analytics
    },
  },
}

export async function createCheckoutSession(
  userId: string,
  email: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    client_reference_id: userId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
  })

  return session
}

export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}
