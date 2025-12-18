'use client'

import { useState, Suspense, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Link2, Loader2, Check, X, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

// Password strength calculation
function calculatePasswordStrength(password: string): {
  score: number
  label: string
  color: string
  bgColor: string
} {
  if (!password) {
    return { score: 0, label: 'Enter a password', color: 'text-gray-500', bgColor: 'bg-gray-200' }
  }

  let score = 0

  // Length check
  if (password.length >= 8) score++
  if (password.length >= 12) score++

  // Character variety checks
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (score <= 2) {
    return { score: 1, label: 'Weak', color: 'text-red-600', bgColor: 'bg-red-500' }
  } else if (score <= 4) {
    return { score: 2, label: 'Fair', color: 'text-orange-600', bgColor: 'bg-orange-500' }
  } else if (score <= 5) {
    return { score: 3, label: 'Good', color: 'text-yellow-600', bgColor: 'bg-yellow-500' }
  } else {
    return { score: 4, label: 'Strong', color: 'text-green-600', bgColor: 'bg-green-500' }
  }
}

// Email validation
function isValidEmail(email: string): boolean {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
  })
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      toast.success('Account created successfully!')

      if (plan === 'pro') {
        router.push('/dashboard/billing?upgrade=true')
      } else {
        router.push('/dashboard')
      }
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setFormData({ ...formData, username: value })
  }

  // Calculate password strength
  const passwordStrength = useMemo(
    () => calculatePasswordStrength(formData.password),
    [formData.password]
  )

  // Email validation state
  const emailIsValid = useMemo(
    () => isValidEmail(formData.email),
    [formData.email]
  )

  const showEmailValidation = emailTouched && formData.email.length > 0
  const showPasswordStrength = passwordTouched && formData.password.length > 0

  return (
    <>
      {plan === 'pro' && (
        <div className="mb-6 p-4 bg-primary-50 rounded-lg">
          <div className="flex items-center text-primary-700 font-medium mb-2">
            <Check className="w-5 h-5 mr-2" />
            Pro Plan Selected
          </div>
          <p className="text-sm text-primary-600">
            You'll be able to upgrade after creating your account.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full name
          </label>
          <div className="mt-1">
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <div className="mt-1">
            <div className="flex rounded-lg shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                linkfolio.com/
              </span>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleUsernameChange}
                className="flex-1 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-r-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="yourname"
              />
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Only lowercase letters, numbers, and underscores
          </p>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1 relative">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onBlur={() => setEmailTouched(true)}
              className={`appearance-none block w-full px-3 py-3 pr-10 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                showEmailValidation
                  ? emailIsValid
                    ? 'border-green-500'
                    : 'border-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="you@example.com"
            />
            {showEmailValidation && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {emailIsValid ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
            )}
          </div>
          {showEmailValidation && !emailIsValid && (
            <p className="mt-1 text-sm text-red-600">
              Please enter a valid email address
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              onFocus={() => setPasswordTouched(true)}
              className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="••••••••"
            />
          </div>

          {showPasswordStrength && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">
                  Password strength:
                </span>
                <span className={`text-xs font-medium ${passwordStrength.color}`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${passwordStrength.bgColor} transition-all duration-300`}
                  style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Use 8+ characters with a mix of letters, numbers & symbols
              </p>
            </div>
          )}

          {!showPasswordStrength && (
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 8 characters
            </p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Create account'
            )}
          </button>
        </div>
      </form>

      <p className="mt-6 text-xs text-center text-gray-500">
        By creating an account, you agree to our{' '}
        <a href="#" className="text-primary-600 hover:text-primary-500">Terms of Service</a>
        {' '}and{' '}
        <a href="#" className="text-primary-600 hover:text-primary-500">Privacy Policy</a>
      </p>
    </>
  )
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
            <Link2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">LinkFolio</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Create your LinkFolio
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/signin" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10">
          <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-lg" />}>
            <SignUpForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
