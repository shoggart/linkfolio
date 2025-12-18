'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check, Loader2, Sparkles, CreditCard, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import { PLANS } from '@/lib/stripe'

interface UserData {
  plan: string
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  stripeCurrentPeriodEnd: string | null
}

function BillingContent() {
  const searchParams = useSearchParams()
  const upgrade = searchParams.get('upgrade')

  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    if (upgrade === 'true') {
      toast('Ready to upgrade? Choose your plan below!', { icon: '🚀' })
    }
  }, [upgrade])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/user')
      const data = await res.json()
      setUser(data.user)
    } catch {
      toast.error('Failed to fetch billing info')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgrade = async () => {
    setIsUpgrading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billingCycle }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      window.location.href = data.url
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to start checkout')
    } finally {
      setIsUpgrading(false)
    }
  }

  const handleManageBilling = async () => {
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to open billing portal')
      }

      window.location.href = data.url
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to open billing portal')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  const isPro = user?.plan === 'pro'

  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isPro ? 'bg-gradient-to-br from-primary-500 to-purple-500' : 'bg-gray-100'
            }`}>
              {isPro ? (
                <Sparkles className="w-6 h-6 text-white" />
              ) : (
                <CreditCard className="w-6 h-6 text-gray-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {isPro ? 'Pro Plan' : 'Free Plan'}
              </h3>
              <p className="text-sm text-gray-500">
                {isPro
                  ? 'You have access to all premium features'
                  : 'Upgrade to unlock premium features'}
              </p>
            </div>
          </div>
          {isPro && user.stripeCurrentPeriodEnd && (
            <div className="text-right">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                Renews {new Date(user.stripeCurrentPeriodEnd).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>

        {isPro && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={handleManageBilling}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Manage subscription →
            </button>
          </div>
        )}
      </div>

      {/* Upgrade Section (for free users) */}
      {!isPro && (
        <>
          {/* Billing Cycle Toggle */}
          <div className="flex justify-center">
            <div className="bg-gray-100 p-1 rounded-lg inline-flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
                <span className="ml-1 text-xs text-green-600 font-semibold">Save 27%</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">Free</h3>
                <p className="text-gray-500 mt-1">Current plan</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {PLANS.free.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                disabled
                className="w-full py-3 px-4 bg-gray-100 text-gray-500 font-medium rounded-xl cursor-not-allowed"
              >
                Current Plan
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white relative">
              <div className="absolute top-4 right-4 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                RECOMMENDED
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold">Pro</h3>
                <p className="text-gray-400 mt-1">For serious creators</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    ${billingCycle === 'monthly' ? PLANS.pro.monthlyPrice : Math.round(PLANS.pro.yearlyPrice / 12)}
                  </span>
                  <span className="text-gray-400">/month</span>
                </div>
                {billingCycle === 'yearly' && (
                  <p className="text-sm text-gray-400 mt-1">
                    Billed ${PLANS.pro.yearlyPrice}/year
                  </p>
                )}
              </div>
              <ul className="space-y-3 mb-6">
                {PLANS.pro.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-primary-400 mr-2 flex-shrink-0" />
                    <span className="text-gray-200">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="w-full py-3 px-4 bg-white text-gray-900 font-medium rounded-xl hover:bg-gray-100 transition disabled:opacity-50"
              >
                {isUpgrading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  `Upgrade to Pro`
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* FAQ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900">Can I cancel anytime?</h4>
            <p className="text-sm text-gray-500 mt-1">
              Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">What payment methods do you accept?</h4>
            <p className="text-sm text-gray-500 mt-1">
              We accept all major credit cards through Stripe, including Visa, Mastercard, and American Express.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">What happens to my links if I downgrade?</h4>
            <p className="text-sm text-gray-500 mt-1">
              Your links will remain active, but you'll lose access to premium features. If you have more than 5 links, you won't be able to add new ones until you're back under the limit.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BillingPage() {
  return (
    <div className="pt-14 lg:pt-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="mt-1 text-gray-600">Manage your subscription</p>
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      }>
        <BillingContent />
      </Suspense>
    </div>
  )
}
