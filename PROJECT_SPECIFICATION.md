# LinkFolio - Complete Project Specification

> **Purpose**: This document serves as the comprehensive reference for all development work on LinkFolio. Each section is self-contained to allow parallel development by multiple agents.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Directory Structure](#3-directory-structure)
4. [Environment Setup](#4-environment-setup)
5. [Database Schema](#5-database-schema)
6. [Authentication System](#6-authentication-system)
7. [API Routes](#7-api-routes)
8. [Frontend Pages](#8-frontend-pages)
9. [Components](#9-components)
10. [Styling System](#10-styling-system)
11. [Stripe Integration](#11-stripe-integration)
12. [Deployment](#12-deployment)
13. [Testing Requirements](#13-testing-requirements)
14. [Security Checklist](#14-security-checklist)
15. [Performance Optimization](#15-performance-optimization)
16. [Task Breakdown by Agent](#16-task-breakdown-by-agent)

---

## 1. Project Overview

### What is LinkFolio?
A SaaS platform that allows users to create a single page containing all their important links (similar to Linktree). Users get a public profile at `domain.com/username`.

### Core Features
- User registration and authentication
- Dashboard to manage links
- Public profile pages with customizable themes
- Analytics tracking (views, clicks, devices)
- Subscription payments via Stripe
- Social media link integration

### Business Model
| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | 5 links, basic analytics, standard themes, branding |
| Pro | $9/mo or $79/yr | Unlimited links, advanced analytics, premium themes, no branding |

---

## 2. Technology Stack

### Core Technologies
```
Framework:      Next.js 14.0.4 (App Router)
Language:       TypeScript 5.3.3
Styling:        Tailwind CSS 3.4.0
Database:       SQLite (Prisma ORM 5.7.0)
Authentication: Custom JWT (jose 5.2.0)
Payments:       Stripe 14.10.0
```

### Key Dependencies
```json
{
  "dependencies": {
    "@prisma/client": "^5.7.0",
    "@stripe/stripe-js": "^2.2.0",
    "bcryptjs": "^2.4.3",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "framer-motion": "^10.16.16",
    "jose": "^5.2.0",
    "lucide-react": "^0.303.0",
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hot-toast": "^2.4.1",
    "stripe": "^14.10.0",
    "tailwind-merge": "^2.2.0",
    "uuid": "^9.0.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20.10.5",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@types/uuid": "^9.0.7",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "prisma": "^5.7.0",
    "tailwindcss": "^3.4.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  }
}
```

### NPM Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    "postinstall": "prisma generate"
  }
}
```

---

## 3. Directory Structure

```
linkfolio/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeding (to create)
│
├── public/                    # Static assets (to create)
│   ├── favicon.ico
│   ├── og-image.png
│   └── logo.svg
│
├── src/
│   ├── app/
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page (/)
│   │   │
│   │   ├── auth/
│   │   │   ├── signin/
│   │   │   │   └── page.tsx   # Sign in page
│   │   │   └── signup/
│   │   │       └── page.tsx   # Sign up page
│   │   │
│   │   ├── dashboard/
│   │   │   ├── layout.tsx     # Dashboard layout with nav
│   │   │   ├── page.tsx       # Dashboard overview
│   │   │   ├── links/
│   │   │   │   └── page.tsx   # Links management
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx   # Analytics dashboard
│   │   │   ├── appearance/
│   │   │   │   └── page.tsx   # Theme selection
│   │   │   ├── settings/
│   │   │   │   └── page.tsx   # Profile settings
│   │   │   └── billing/
│   │   │       └── page.tsx   # Subscription management
│   │   │
│   │   ├── [username]/
│   │   │   ├── page.tsx       # Public profile (server)
│   │   │   └── profile-client.tsx  # Public profile (client)
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── signin/
│   │       │   │   └── route.ts
│   │       │   ├── signup/
│   │       │   │   └── route.ts
│   │       │   └── signout/
│   │       │       └── route.ts
│   │       │
│   │       ├── user/
│   │       │   └── route.ts   # GET/PATCH user
│   │       │
│   │       ├── links/
│   │       │   ├── route.ts   # GET/POST links
│   │       │   └── [id]/
│   │       │       └── route.ts  # PATCH/DELETE link
│   │       │
│   │       ├── analytics/
│   │       │   └── click/
│   │       │       └── route.ts  # POST click tracking
│   │       │
│   │       └── stripe/
│   │           ├── checkout/
│   │           │   └── route.ts  # Create checkout session
│   │           ├── portal/
│   │           │   └── route.ts  # Customer portal
│   │           └── webhook/
│   │               └── route.ts  # Stripe webhooks
│   │
│   ├── components/
│   │   ├── ui/                # Reusable UI components (to create)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── modal.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── nav.tsx        # Dashboard navigation
│   │   │
│   │   ├── landing/           # Landing page components (to create)
│   │   │   ├── hero.tsx
│   │   │   ├── features.tsx
│   │   │   ├── pricing.tsx
│   │   │   └── testimonials.tsx
│   │   │
│   │   └── profile/           # Profile components (to create)
│   │       ├── link-button.tsx
│   │       └── social-icons.tsx
│   │
│   ├── lib/
│   │   ├── db.ts              # Prisma client singleton
│   │   ├── auth.ts            # Authentication utilities
│   │   ├── stripe.ts          # Stripe utilities
│   │   └── utils.ts           # Helper functions
│   │
│   └── types/                 # TypeScript types (to create)
│       └── index.ts
│
├── .env                       # Environment variables
├── .env.example               # Example env file
├── .gitignore
├── Dockerfile
├── next.config.js
├── next-env.d.ts
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json
├── README.md
├── LAUNCH_GUIDE.md
└── PROJECT_SPECIFICATION.md   # This file
```

---

## 4. Environment Setup

### Required Environment Variables

```bash
# Database
DATABASE_URL="file:./dev.db"

# Authentication
AUTH_SECRET="minimum-32-character-secret-key-here"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Stripe (Required for payments)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_PRO_MONTHLY_PRICE_ID="price_..."
STRIPE_PRO_YEARLY_PRICE_ID="price_..."
```

### Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your values

# 3. Generate Prisma client
npx prisma generate

# 4. Create database and tables
npx prisma db push

# 5. (Optional) Seed database
npm run db:seed

# 6. Start development server
npm run dev

# 7. (Optional) View database
npm run db:studio
```

### Generate Auth Secret

```bash
openssl rand -base64 32
```

---

## 5. Database Schema

### Location
`prisma/schema.prisma`

### Models

#### User
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String    // bcrypt hashed
  name          String?
  username      String    @unique
  bio           String?
  avatarUrl     String?

  // Subscription
  plan          String    @default("free") // "free" | "pro"
  stripeCustomerId     String?   @unique
  stripeSubscriptionId String?   @unique
  stripePriceId        String?
  stripeCurrentPeriodEnd DateTime?

  // Profile Settings
  theme         String    @default("default")
  backgroundColor String  @default("#ffffff")
  buttonStyle   String    @default("rounded")
  fontFamily    String    @default("inter")

  // Relations
  socialLinks   SocialLink[]
  links         Link[]
  profileViews  ProfileView[]
  linkClicks    LinkClick[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

#### SocialLink
```prisma
model SocialLink {
  id        String   @id @default(cuid())
  platform  String   // twitter, instagram, youtube, etc.
  url       String
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  order     Int      @default(0)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Link
```prisma
model Link {
  id          String   @id @default(cuid())
  title       String
  url         String
  thumbnail   String?
  isActive    Boolean  @default(true)
  order       Int      @default(0)

  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  clicks      LinkClick[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### ProfileView
```prisma
model ProfileView {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  referrer  String?
  country   String?
  device    String?  // desktop, mobile, tablet
  browser   String?  // Chrome, Firefox, Safari, etc.

  createdAt DateTime @default(now())
}
```

#### LinkClick
```prisma
model LinkClick {
  id        String   @id @default(cuid())
  linkId    String
  link      Link     @relation(fields: [linkId], references: [id], onDelete: Cascade)

  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  referrer  String?
  country   String?
  device    String?
  browser   String?

  createdAt DateTime @default(now())
}
```

### Database Operations

```typescript
// Import
import { db } from '@/lib/db'

// Create
const user = await db.user.create({
  data: { email, password, username }
})

// Read
const user = await db.user.findUnique({
  where: { id },
  include: { links: true, socialLinks: true }
})

// Update
await db.user.update({
  where: { id },
  data: { name, bio }
})

// Delete
await db.link.delete({ where: { id } })

// Count
const count = await db.link.count({ where: { userId } })

// Aggregation
const clicks = await db.linkClick.groupBy({
  by: ['linkId'],
  _count: true,
  orderBy: { _count: { linkId: 'desc' } }
})
```

---

## 6. Authentication System

### Location
`src/lib/auth.ts`

### JWT Token Structure

```typescript
interface UserSession {
  id: string
  email: string
  username: string
  name: string | null
  plan: string  // "free" | "pro"
}
```

### Functions

#### createToken
```typescript
export async function createToken(user: UserSession): Promise<string>
// Creates JWT token valid for 7 days
// Uses HS256 algorithm
```

#### verifyToken
```typescript
export async function verifyToken(token: string): Promise<UserSession | null>
// Verifies JWT and returns user session or null
```

#### getSession
```typescript
export async function getSession(): Promise<UserSession | null>
// Gets current session from cookies
// Returns null if not authenticated
```

#### hashPassword
```typescript
export async function hashPassword(password: string): Promise<string>
// Uses bcrypt with 12 rounds
```

#### verifyPassword
```typescript
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean>
// Compares password with hash
```

#### signUp
```typescript
export async function signUp(
  email: string,
  password: string,
  username: string,
  name?: string
): Promise<UserSession>
// Creates new user
// Throws if email or username taken
```

#### signIn
```typescript
export async function signIn(
  email: string,
  password: string
): Promise<UserSession>
// Authenticates user
// Throws if invalid credentials
```

### Cookie Configuration

```typescript
{
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7,  // 7 days
  path: '/',
}
```

### Protected Routes Pattern

```typescript
// In page.tsx (Server Component)
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const session = await getSession()
  if (!session) redirect('/auth/signin')

  // ... rest of component
}
```

### API Route Pattern

```typescript
// In route.ts
import { getSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ... rest of handler
}
```

---

## 7. API Routes

### Authentication APIs

#### POST /api/auth/signup
```typescript
// Request
{
  email: string      // Valid email
  password: string   // Min 8 characters
  username: string   // 3-30 chars, lowercase, alphanumeric + underscore
  name?: string      // Optional display name
}

// Response 200
{
  user: {
    id: string
    email: string
    username: string
    name: string | null
    plan: string
  }
}

// Response 400
{ error: "Email already in use" | "Username already taken" | validation error }
```

#### POST /api/auth/signin
```typescript
// Request
{
  email: string
  password: string
}

// Response 200
{
  user: { id, email, username, name, plan }
}

// Response 401
{ error: "Invalid credentials" }
```

#### POST /api/auth/signout
```typescript
// Request: None

// Response 200
{ success: true }
```

### User APIs

#### GET /api/user
```typescript
// Response 200
{
  user: {
    id: string
    email: string
    username: string
    name: string | null
    bio: string | null
    avatarUrl: string | null
    plan: string
    theme: string
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    stripeCurrentPeriodEnd: string | null
    socialLinks: Array<{ id, platform, url }>
  }
}
```

#### PATCH /api/user
```typescript
// Request
{
  name?: string
  bio?: string       // Max 160 chars
  theme?: string
  socialLinks?: Array<{ platform: string, url: string }>
}

// Response 200
{ user: { ... } }
```

### Links APIs

#### GET /api/links
```typescript
// Response 200
{
  links: Array<{
    id: string
    title: string
    url: string
    thumbnail: string | null
    isActive: boolean
    order: number
    _count: { clicks: number }
  }>
}
```

#### POST /api/links
```typescript
// Request
{
  title: string   // Required, max 100 chars
  url: string     // Valid URL
}

// Response 200
{ link: { ... } }

// Response 403
{ error: "You've reached your limit of 5 links. Upgrade to Pro for unlimited links!" }
```

#### PATCH /api/links/[id]
```typescript
// Request
{
  title?: string
  url?: string
  isActive?: boolean
  order?: number
}

// Response 200
{ link: { ... } }

// Response 404
{ error: "Link not found" }
```

#### DELETE /api/links/[id]
```typescript
// Response 200
{ success: true }

// Response 404
{ error: "Link not found" }
```

### Analytics APIs

#### POST /api/analytics/click
```typescript
// Request
{
  linkId: string
  userId: string  // Profile owner's ID
}

// Response 200
{ success: true }
```

### Stripe APIs

#### POST /api/stripe/checkout
```typescript
// Request
{
  billingCycle: "monthly" | "yearly"
}

// Response 200
{ url: string }  // Redirect to Stripe Checkout
```

#### POST /api/stripe/portal
```typescript
// Response 200
{ url: string }  // Redirect to Stripe Customer Portal
```

#### POST /api/stripe/webhook
```typescript
// Handled events:
// - checkout.session.completed
// - customer.subscription.updated
// - customer.subscription.deleted
// - invoice.payment_succeeded
// - invoice.payment_failed

// Response 200
{ received: true }
```

---

## 8. Frontend Pages

### Landing Page (/)
**File**: `src/app/page.tsx`

**Sections**:
1. Navigation (fixed header)
2. Hero section with CTA
3. Features grid (6 features)
4. Pricing comparison
5. Testimonials
6. Final CTA
7. Footer

**Key Elements**:
- Animated gradient backgrounds
- Responsive design (mobile-first)
- Smooth scroll to sections

### Auth Pages

#### Sign In (/auth/signin)
**File**: `src/app/auth/signin/page.tsx`

**Features**:
- Email/password form
- Validation with error messages
- Loading state
- Link to sign up
- Toast notifications

#### Sign Up (/auth/signup)
**File**: `src/app/auth/signup/page.tsx`

**Features**:
- Name, username, email, password fields
- Username validation (lowercase, alphanumeric)
- Password requirements (8+ chars)
- Pro plan indicator from URL param
- Toast notifications

### Dashboard Pages

#### Dashboard Layout
**File**: `src/app/dashboard/layout.tsx`

**Features**:
- Session check with redirect
- Sidebar navigation (desktop)
- Mobile hamburger menu
- User info in sidebar

#### Overview (/dashboard)
**File**: `src/app/dashboard/page.tsx`

**Displays**:
- Welcome message
- Quick action buttons
- Stats cards (views, clicks, links, CTR)
- Recent links list
- Upgrade prompt (free users)

#### Links (/dashboard/links)
**File**: `src/app/dashboard/links/page.tsx`

**Features**:
- Add link form (expandable)
- Links list with:
  - Drag handle (for reordering - to implement)
  - Title and URL
  - Click count
  - Toggle active/inactive
  - Open link
  - Delete link
- Empty state

#### Analytics (/dashboard/analytics)
**File**: `src/app/dashboard/analytics/page.tsx`

**Displays**:
- Views, clicks, CTR cards
- Device breakdown (bar chart)
- Browser breakdown (bar chart)
- Top performing links table

#### Appearance (/dashboard/appearance)
**File**: `src/app/dashboard/appearance/page.tsx`

**Features**:
- Theme grid selector
- Pro badge on premium themes
- Lock icon on unavailable themes
- Live preview panel
- Save button

#### Settings (/dashboard/settings)
**File**: `src/app/dashboard/settings/page.tsx`

**Features**:
- Profile information form
- Social links editor
- Username display (read-only)
- Character count for bio
- Save button

#### Billing (/dashboard/billing)
**File**: `src/app/dashboard/billing/page.tsx`

**Features**:
- Current plan display
- Billing cycle toggle
- Plan comparison cards
- Upgrade button (free users)
- Manage subscription link (pro users)
- FAQ section

### Public Profile (/[username])

#### Server Component
**File**: `src/app/[username]/page.tsx`

**Features**:
- Fetch user profile
- Track page view
- Generate metadata
- Pass data to client component

#### Client Component
**File**: `src/app/[username]/profile-client.tsx`

**Features**:
- Themed background
- Avatar or initial
- Name and username
- Bio text
- Social icons row
- Links list
- Click tracking
- Branding footer (free users)

---

## 9. Components

### Dashboard Navigation
**File**: `src/components/dashboard/nav.tsx`

```typescript
interface DashboardNavProps {
  user: {
    id: string
    email: string
    username: string
    name: string | null
    plan: string
  }
}

// Features:
// - Desktop sidebar (fixed, 72 units wide)
// - Mobile header with hamburger menu
// - Navigation items with icons
// - Active state indication
// - View profile link
// - User avatar and info
// - Sign out button
```

### UI Components (To Create)

#### Button
**File**: `src/components/ui/button.tsx`

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}
```

#### Input
**File**: `src/components/ui/input.tsx`

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}
```

#### Card
**File**: `src/components/ui/card.tsx`

```typescript
interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}
```

#### Modal
**File**: `src/components/ui/modal.tsx`

```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}
```

---

## 10. Styling System

### Tailwind Configuration
**File**: `tailwind.config.ts`

#### Custom Colors
```typescript
colors: {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  }
}
```

#### Custom Animations
```typescript
animation: {
  'gradient': 'gradient 8s linear infinite',
  'float': 'float 6s ease-in-out infinite',
}
```

### Theme System
**File**: `src/lib/utils.ts`

```typescript
export const THEMES = {
  default: {
    name: 'Default',
    background: 'bg-gradient-to-br from-gray-50 to-gray-100',
    card: 'bg-white',
    text: 'text-gray-900',
    button: 'bg-gray-900 hover:bg-gray-800 text-white',
  },
  dark: {
    name: 'Dark',
    background: 'bg-gradient-to-br from-gray-900 to-black',
    card: 'bg-gray-800',
    text: 'text-white',
    button: 'bg-white hover:bg-gray-100 text-gray-900',
  },
  ocean: {
    name: 'Ocean',
    background: 'bg-gradient-to-br from-blue-400 to-cyan-500',
    card: 'bg-white/90 backdrop-blur',
    text: 'text-gray-900',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  sunset: {
    name: 'Sunset',
    background: 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600',
    card: 'bg-white/90 backdrop-blur',
    text: 'text-gray-900',
    button: 'bg-purple-600 hover:bg-purple-700 text-white',
  },
  forest: {
    name: 'Forest',
    background: 'bg-gradient-to-br from-green-400 to-emerald-600',
    card: 'bg-white/90 backdrop-blur',
    text: 'text-gray-900',
    button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  },
  midnight: {
    name: 'Midnight',
    background: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800',
    card: 'bg-white/10 backdrop-blur border border-white/20',
    text: 'text-white',
    button: 'bg-white/20 hover:bg-white/30 text-white border border-white/30',
  },
}

// Pro-only themes
const proThemes = ['midnight', 'sunset', 'forest', 'ocean']
```

### Social Platforms
```typescript
export const SOCIAL_PLATFORMS = [
  { id: 'twitter', name: 'Twitter/X', icon: 'twitter', placeholder: 'https://twitter.com/username' },
  { id: 'instagram', name: 'Instagram', icon: 'instagram', placeholder: 'https://instagram.com/username' },
  { id: 'youtube', name: 'YouTube', icon: 'youtube', placeholder: 'https://youtube.com/@channel' },
  { id: 'tiktok', name: 'TikTok', icon: 'music', placeholder: 'https://tiktok.com/@username' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', placeholder: 'https://linkedin.com/in/username' },
  { id: 'github', name: 'GitHub', icon: 'github', placeholder: 'https://github.com/username' },
  { id: 'twitch', name: 'Twitch', icon: 'twitch', placeholder: 'https://twitch.tv/username' },
  { id: 'discord', name: 'Discord', icon: 'message-circle', placeholder: 'https://discord.gg/invite' },
  { id: 'email', name: 'Email', icon: 'mail', placeholder: 'mailto:you@example.com' },
]
```

### Utility Functions
```typescript
// Class name merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Absolute URL helper
export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${path}`
}

// Number formatter (1000 -> 1K)
export function formatNumber(num: number): string

// Device detection from user agent
export function getDeviceType(userAgent: string): string

// Browser detection from user agent
export function getBrowser(userAgent: string): string
```

---

## 11. Stripe Integration

### Configuration
**File**: `src/lib/stripe.ts`

```typescript
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
  typescript: true,
})
```

### Plan Configuration
```typescript
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
      analytics: 7, // days
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
      analytics: 365, // days
    },
  },
}
```

### Stripe Dashboard Setup

1. **Create Products**:
   - Product: "LinkFolio Pro"
   - Price 1: $9/month (recurring)
   - Price 2: $79/year (recurring)

2. **Get Price IDs**:
   - Copy `price_xxxxx` for monthly
   - Copy `price_xxxxx` for yearly

3. **Configure Webhook**:
   - Endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Events to listen:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

### Webhook Event Handlers

```typescript
// checkout.session.completed
// - Create/update stripeCustomerId
// - Set stripeSubscriptionId
// - Set plan to 'pro'

// customer.subscription.updated
// - Update stripeCurrentPeriodEnd
// - Update plan based on status

// customer.subscription.deleted
// - Set plan to 'free'
// - Clear stripe fields

// invoice.payment_succeeded
// - Update stripeCurrentPeriodEnd

// invoice.payment_failed
// - Log for follow-up
```

---

## 12. Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Configure environment variables
4. Deploy

**Environment Variables for Vercel**:
```
DATABASE_URL=file:./prod.db
AUTH_SECRET=your-production-secret
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_PRO_YEARLY_PRICE_ID=price_...
```

### Docker

```dockerfile
# Build
docker build -t linkfolio .

# Run
docker run -p 3000:3000 \
  -e DATABASE_URL="file:./prod.db" \
  -e AUTH_SECRET="your-secret" \
  linkfolio
```

### Database for Production

For production, consider switching to PostgreSQL:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Use services like:
   - Supabase (free tier)
   - PlanetScale (free tier)
   - Railway
   - Neon

---

## 13. Testing Requirements

### Unit Tests (To Implement)

```typescript
// Auth functions
- hashPassword creates valid hash
- verifyPassword validates correctly
- createToken generates valid JWT
- verifyToken validates and extracts payload
- signUp prevents duplicate emails
- signUp prevents duplicate usernames
- signIn rejects invalid credentials

// API routes
- Unauthenticated requests return 401
- Invalid input returns 400
- Link limit enforced for free users
- Owner can only modify own resources
```

### Integration Tests (To Implement)

```typescript
// User flow
- Sign up → Sign in → Create link → View profile
- Upgrade to Pro → Verify unlimited links
- Cancel subscription → Verify downgrade

// Analytics
- Profile view tracked correctly
- Link click tracked correctly
- Device/browser detected correctly
```

### E2E Tests (To Implement)

```typescript
// Critical paths
- Landing page loads
- User can sign up
- User can sign in
- Dashboard displays correctly
- Links can be created/edited/deleted
- Public profile displays links
- Stripe checkout initiates
```

---

## 14. Security Checklist

### Authentication
- [x] Passwords hashed with bcrypt (12 rounds)
- [x] JWT tokens with expiration
- [x] HTTP-only cookies
- [x] Secure flag in production
- [ ] Rate limiting on auth endpoints
- [ ] Password strength requirements UI
- [ ] Email verification

### API Security
- [x] Session validation on all protected routes
- [x] Owner verification for resource access
- [x] Input validation with Zod
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] Request size limits

### Data Protection
- [x] SQL injection prevented (Prisma)
- [x] XSS prevented (React)
- [ ] CSRF protection
- [ ] Sensitive data encryption at rest
- [ ] Audit logging

### Stripe Security
- [x] Webhook signature verification
- [x] Server-side amount validation
- [ ] Idempotency keys for charges

---

## 15. Performance Optimization

### Current Optimizations
- Next.js App Router (Server Components)
- Static landing page
- Prisma query optimization
- Tailwind CSS (purged in production)

### Recommended Improvements

#### Caching
```typescript
// Add Redis for session caching
// Cache frequently accessed profiles
// Cache analytics data

// Example with unstable_cache
import { unstable_cache } from 'next/cache'

const getCachedProfile = unstable_cache(
  async (username: string) => {
    return db.user.findUnique({ where: { username } })
  },
  ['profile'],
  { revalidate: 60 }
)
```

#### Database
```typescript
// Add indexes
model Link {
  @@index([userId])
  @@index([userId, order])
}

model ProfileView {
  @@index([userId, createdAt])
}

model LinkClick {
  @@index([linkId, createdAt])
  @@index([userId, createdAt])
}
```

#### Images
```typescript
// Use Next.js Image component
import Image from 'next/image'

<Image
  src={avatarUrl}
  width={96}
  height={96}
  alt="Avatar"
  priority
/>
```

---

## 16. Task Breakdown by Agent

### Agent 1: Frontend Polish
**Focus**: UI/UX improvements

**Tasks**:
1. Create reusable UI components in `src/components/ui/`:
   - `button.tsx` - with variants and loading state
   - `input.tsx` - with label and error states
   - `card.tsx` - with padding variants
   - `modal.tsx` - with animations

2. Add loading skeletons to all dashboard pages

3. Implement drag-and-drop link reordering:
   - Use `@dnd-kit/core` library
   - Update order via API on drop

4. Add form validation feedback:
   - Real-time username availability check
   - Password strength indicator
   - Email format validation

5. Create responsive image handling:
   - Avatar upload functionality
   - Image cropping modal
   - Optimized image delivery

**Files to Create/Modify**:
- `src/components/ui/*.tsx`
- `src/app/dashboard/links/page.tsx`
- `src/app/auth/signup/page.tsx`

---

### Agent 2: Backend Enhancements
**Focus**: API and data layer

**Tasks**:
1. Add rate limiting:
   - Install `@upstash/ratelimit`
   - Add to auth endpoints (5 attempts/minute)
   - Add to API endpoints (100 requests/minute)

2. Implement email functionality:
   - Set up Resend or SendGrid
   - Welcome email on signup
   - Password reset flow
   - Subscription confirmation

3. Add database seeding:
   - Create `prisma/seed.ts`
   - Demo user with sample links
   - Sample analytics data

4. Implement link scheduling:
   - Add `scheduleStart` and `scheduleEnd` to Link model
   - Filter active links by schedule
   - Dashboard UI for scheduling

5. Add API for link reordering:
   - `PATCH /api/links/reorder`
   - Accept array of { id, order }

**Files to Create/Modify**:
- `src/lib/rate-limit.ts`
- `src/lib/email.ts`
- `prisma/seed.ts`
- `prisma/schema.prisma`
- `src/app/api/links/reorder/route.ts`

---

### Agent 3: Analytics Enhancement
**Focus**: Data visualization and insights

**Tasks**:
1. Add chart library:
   - Install `recharts` or `chart.js`
   - Create line chart component for views over time
   - Create bar chart for top links

2. Implement date range selector:
   - 7 days, 30 days, 90 days, 1 year
   - Custom date range picker

3. Add geographic data:
   - Detect country from IP (use free API)
   - Display country breakdown
   - Map visualization (optional)

4. Create exportable reports:
   - CSV export of analytics data
   - PDF report generation

5. Add real-time analytics:
   - Live view counter
   - Recent activity feed

**Files to Create/Modify**:
- `src/components/analytics/*.tsx`
- `src/app/dashboard/analytics/page.tsx`
- `src/app/api/analytics/export/route.ts`

---

### Agent 4: Profile Customization
**Focus**: Theme and styling options

**Tasks**:
1. Add more themes:
   - Neon theme
   - Pastel theme
   - Minimal theme
   - Custom color picker (Pro)

2. Implement button styles:
   - Rounded, square, pill options
   - Outline, filled, gradient variants
   - Shadow options

3. Add font selection:
   - 5+ Google Fonts options
   - Preview before saving

4. Create custom CSS editor (Pro):
   - Monaco editor component
   - CSS validation
   - Preview panel

5. Add profile backgrounds:
   - Gradient generator
   - Pattern overlays
   - Image upload (Pro)

**Files to Create/Modify**:
- `src/lib/utils.ts` (extend THEMES)
- `src/app/dashboard/appearance/page.tsx`
- `src/components/appearance/*.tsx`
- `src/app/[username]/profile-client.tsx`

---

### Agent 5: Testing & Quality
**Focus**: Test coverage and code quality

**Tasks**:
1. Set up testing framework:
   - Install Jest and React Testing Library
   - Configure for Next.js
   - Create test utilities

2. Write unit tests:
   - Auth functions
   - Utility functions
   - API route handlers

3. Write component tests:
   - Dashboard nav
   - Link management
   - Profile display

4. Set up E2E testing:
   - Install Playwright
   - Critical user flows
   - CI integration

5. Add code quality tools:
   - ESLint configuration
   - Prettier configuration
   - Husky pre-commit hooks

**Files to Create/Modify**:
- `jest.config.js`
- `playwright.config.ts`
- `src/**/*.test.ts`
- `.eslintrc.json`
- `.prettierrc`

---

### Agent 6: DevOps & Infrastructure
**Focus**: Deployment and monitoring

**Tasks**:
1. Production database setup:
   - PostgreSQL migration guide
   - Connection pooling
   - Backup strategy

2. Set up monitoring:
   - Error tracking (Sentry)
   - Performance monitoring
   - Uptime monitoring

3. Configure CI/CD:
   - GitHub Actions workflow
   - Automated testing
   - Preview deployments

4. Add logging:
   - Structured logging
   - Log aggregation
   - Alert configuration

5. Security hardening:
   - Security headers
   - Content Security Policy
   - Regular dependency updates

**Files to Create/Modify**:
- `.github/workflows/ci.yml`
- `src/lib/logger.ts`
- `next.config.js` (security headers)
- `sentry.client.config.ts`

---

## Quick Reference Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm run start              # Start production server

# Database
npm run db:push            # Push schema to database
npm run db:studio          # Open Prisma Studio
npm run db:seed            # Seed database

# Code Quality
npm run lint               # Run ESLint
npm run test               # Run tests
npm run test:e2e           # Run E2E tests

# Stripe (Development)
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Contact & Support

For questions about this specification, refer to:
- `README.md` - Quick start guide
- `LAUNCH_GUIDE.md` - Business and launch information
- Code comments - Implementation details

---

*Last Updated: December 2024*
*Version: 1.0.0*
