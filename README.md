# LinkFolio

A modern link-in-bio platform built with Next.js 14, TypeScript, Tailwind CSS, and Stripe.

## Features

- User authentication (email/password)
- Create and manage bio links
- Beautiful public profile pages
- Multiple themes (Free + Pro)
- Analytics dashboard
- Stripe subscription payments
- Mobile-responsive design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Auth**: Custom JWT-based auth
- **Payments**: Stripe

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Initialize database
npm run db:push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

```bash
DATABASE_URL="file:./dev.db"
AUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_PRO_MONTHLY_PRICE_ID="price_..."
STRIPE_PRO_YEARLY_PRICE_ID="price_..."
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
docker build -t linkfolio .
docker run -p 3000:3000 linkfolio
```

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   ├── auth/          # Auth pages
│   ├── dashboard/     # Dashboard pages
│   └── [username]/    # Public profiles
├── components/        # React components
├── lib/              # Utilities
└── types/            # TypeScript types
```

## Database

Using SQLite by default. To switch to PostgreSQL:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `DATABASE_URL` to your PostgreSQL connection string

3. Run `npm run db:push`

## License

MIT
