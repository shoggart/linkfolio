#!/bin/bash

# LinkFolio Vercel Setup Script
# This script helps you deploy to Vercel with minimal manual work

set -e

echo "🚀 LinkFolio Vercel Setup"
echo "========================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel..."
    vercel login
fi

echo ""
echo "📋 Setting up your project..."
echo ""

# Link to Vercel (this creates the project if it doesn't exist)
vercel link

echo ""
echo "🗄️  Now let's set up your database..."
echo ""
echo "Opening Vercel dashboard to create a Postgres database..."
echo ""
echo "Please follow these steps:"
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Select your project"
echo "3. Click 'Storage' tab"
echo "4. Click 'Create Database' → 'Postgres'"
echo "5. Name it 'linkfolio-db' and create it"
echo "6. The DATABASE_URL will be automatically added to your project"
echo ""
read -p "Press Enter once you've created the database..."

echo ""
echo "🔑 Now let's add the remaining environment variables..."
echo ""

# Add AUTH_SECRET
AUTH_SECRET=$(grep AUTH_SECRET .env | cut -d'=' -f2 | tr -d '"')
vercel env add AUTH_SECRET production <<< "$AUTH_SECRET"
echo "✓ AUTH_SECRET added"

# Add NEXT_PUBLIC_APP_URL
echo ""
echo "What will your production URL be?"
echo "Example: https://linkfolio.vercel.app or https://yourdomain.com"
read -p "Enter URL: " PROD_URL
vercel env add NEXT_PUBLIC_APP_URL production <<< "$PROD_URL"
echo "✓ NEXT_PUBLIC_APP_URL added"

echo ""
echo "💳 Stripe Setup (Optional - skip if you want to set up payments later)"
echo ""
read -p "Do you want to configure Stripe now? (y/n): " SETUP_STRIPE

if [[ "$SETUP_STRIPE" == "y" || "$SETUP_STRIPE" == "Y" ]]; then
    echo ""
    echo "Get your Stripe keys from: https://dashboard.stripe.com/apikeys"
    echo ""

    read -p "Enter STRIPE_SECRET_KEY (sk_live_... or sk_test_...): " STRIPE_SECRET
    vercel env add STRIPE_SECRET_KEY production <<< "$STRIPE_SECRET"

    read -p "Enter NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (pk_live_... or pk_test_...): " STRIPE_PUBLIC
    vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production <<< "$STRIPE_PUBLIC"

    echo ""
    echo "For webhooks, you'll need to:"
    echo "1. Deploy first, then go to https://dashboard.stripe.com/webhooks"
    echo "2. Add endpoint: $PROD_URL/api/stripe/webhook"
    echo "3. Select events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted"
    echo "4. Copy the webhook signing secret"
    echo ""
    read -p "Enter STRIPE_WEBHOOK_SECRET (or press Enter to skip): " STRIPE_WEBHOOK
    if [ ! -z "$STRIPE_WEBHOOK" ]; then
        vercel env add STRIPE_WEBHOOK_SECRET production <<< "$STRIPE_WEBHOOK"
    fi

    echo ""
    echo "Create your Pro plan products in Stripe Dashboard → Products"
    echo ""
    read -p "Enter STRIPE_PRO_MONTHLY_PRICE_ID (price_...): " PRICE_MONTHLY
    if [ ! -z "$PRICE_MONTHLY" ]; then
        vercel env add STRIPE_PRO_MONTHLY_PRICE_ID production <<< "$PRICE_MONTHLY"
    fi

    read -p "Enter STRIPE_PRO_YEARLY_PRICE_ID (price_...): " PRICE_YEARLY
    if [ ! -z "$PRICE_YEARLY" ]; then
        vercel env add STRIPE_PRO_YEARLY_PRICE_ID production <<< "$PRICE_YEARLY"
    fi
fi

echo ""
echo "🚀 Ready to deploy!"
echo ""
read -p "Deploy to production now? (y/n): " DO_DEPLOY

if [[ "$DO_DEPLOY" == "y" || "$DO_DEPLOY" == "Y" ]]; then
    vercel --prod
    echo ""
    echo "✅ Deployment complete!"
else
    echo ""
    echo "Run 'vercel --prod' when ready to deploy"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Visit your deployed site"
echo "2. Create an account and test the features"
echo "3. Set up Stripe webhooks if you haven't already"
echo "4. Share your link-in-bio tool with the world!"
