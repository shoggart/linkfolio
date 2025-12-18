import Link from 'next/link'
import { Check, ArrowRight, Link2, BarChart3, Palette, Zap, Globe, Shield } from 'lucide-react'

const features = [
  {
    icon: Link2,
    title: 'Unlimited Links',
    description: 'Add as many links as you need. No restrictions on what you can share.',
  },
  {
    icon: BarChart3,
    title: 'Detailed Analytics',
    description: 'Track clicks, views, and visitor locations to understand your audience.',
  },
  {
    icon: Palette,
    title: 'Custom Themes',
    description: 'Choose from beautiful themes or create your own unique style.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for speed. Your page loads instantly everywhere.',
  },
  {
    icon: Globe,
    title: 'Custom Domain',
    description: 'Use your own domain for a professional look.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and never shared with third parties.',
  },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Content Creator',
    image: '👩‍💼',
    quote: 'LinkFolio helped me grow my audience by 300%. The analytics are incredible!',
  },
  {
    name: 'Marcus Johnson',
    role: 'Musician',
    image: '🎸',
    quote: 'Finally, a bio link tool that looks as good as my music sounds.',
  },
  {
    name: 'Emily Park',
    role: 'Entrepreneur',
    image: '👩‍💻',
    quote: 'Clean, professional, and easy to use. Exactly what I needed.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <Link2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">LinkFolio</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition">Testimonials</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900 transition">
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-sm font-medium mb-8">
              <Zap className="w-4 h-4 mr-2" />
              The #1 Link-in-Bio Platform
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              One Link to Share
              <span className="block bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">
                Everything That Matters
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Create a beautiful, customizable link-in-bio page in minutes.
              Share all your important links with one simple URL.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white text-lg font-medium rounded-xl hover:bg-gray-800 transition shadow-lg shadow-gray-900/20"
              >
                Create Your LinkFolio
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="#pricing"
                className="inline-flex items-center justify-center px-8 py-4 bg-gray-100 text-gray-900 text-lg font-medium rounded-xl hover:bg-gray-200 transition"
              >
                View Pricing
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              Free forever. No credit card required.
            </p>
          </div>

          {/* Hero Image/Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
            <div className="bg-gradient-to-br from-primary-100 to-purple-100 rounded-2xl p-8 shadow-2xl max-w-lg mx-auto">
              <div className="bg-white rounded-xl p-6 space-y-4">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full mb-4" />
                  <h3 className="text-lg font-bold text-gray-900">@yourname</h3>
                  <p className="text-gray-500 text-sm">Creator & Entrepreneur</p>
                </div>
                <div className="space-y-3">
                  {['My Website', 'Latest Video', 'Shop My Products'].map((link, i) => (
                    <div key={i} className="bg-gray-900 text-white py-3 px-4 rounded-lg text-center font-medium">
                      {link}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features to help you grow your audience and track your success.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free, upgrade when you need more power.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Free</h3>
                <p className="text-gray-600 mt-2">Perfect for getting started</p>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {['Up to 5 links', 'Basic analytics (7 days)', 'Standard themes', 'LinkFolio branding'].map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className="block w-full py-3 px-4 text-center bg-gray-100 text-gray-900 font-medium rounded-xl hover:bg-gray-200 transition"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                POPULAR
              </div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold">Pro</h3>
                <p className="text-gray-400 mt-2">For creators and professionals</p>
                <div className="mt-6">
                  <span className="text-5xl font-bold">$9</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">or $79/year (save 27%)</p>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  'Unlimited links',
                  'Advanced analytics (1 year)',
                  'Custom themes',
                  'Remove branding',
                  'Priority support',
                  'Custom CSS',
                  'Link scheduling',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="w-5 h-5 text-primary-400 mr-3" />
                    <span className="text-gray-200">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup?plan=pro"
                className="block w-full py-3 px-4 text-center bg-white text-gray-900 font-medium rounded-xl hover:bg-gray-100 transition"
              >
                Start Pro Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Loved by Creators Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of creators who trust LinkFolio for their online presence.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="text-4xl mr-4">{testimonial.image}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Create Your LinkFolio?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Join over 10,000 creators who have already simplified their online presence.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center px-8 py-4 bg-white text-gray-900 text-lg font-medium rounded-xl hover:bg-gray-100 transition"
          >
            Get Started for Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <Link2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">LinkFolio</span>
            </div>
            <div className="flex space-x-8 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} LinkFolio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
