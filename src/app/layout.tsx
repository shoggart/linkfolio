import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LinkFolio - Your Digital Business Card',
  description: 'Create a beautiful link-in-bio page in minutes. Share all your important links with one simple URL.',
  keywords: ['link in bio', 'linktree alternative', 'bio links', 'social media links'],
  openGraph: {
    title: 'LinkFolio - Your Digital Business Card',
    description: 'Create a beautiful link-in-bio page in minutes.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
