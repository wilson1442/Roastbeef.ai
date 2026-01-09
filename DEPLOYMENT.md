# Deployment Guide for RoastBeef.ai

## Prerequisites

1. GitHub account
2. Vercel account
3. MongoDB Atlas account (or MongoDB instance)
4. Stripe account
5. Resend account (for emails)
6. N8N instance with webhook configured

## Step 1: Create GitHub Repository

1. Initialize git repository:
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub
3. Push your code:
```bash
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

## Step 2: Set Up MongoDB Atlas

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for Vercel)
5. Get your connection string (MONGODB_URI)

## Step 3: Set Up Stripe

1. Create a Stripe account
2. Get your API keys from the dashboard:
   - Secret key (STRIPE_SECRET_KEY)
   - Publishable key (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
3. Create a webhook endpoint:
   - URL: `https://your-domain.vercel.app/api/payments/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
4. Get your webhook secret (STRIPE_WEBHOOK_SECRET)

## Step 4: Set Up Resend (Email)

1. Create a Resend account
2. Verify your domain (or use the default)
3. Get your API key (RESEND_API_KEY)
4. Set EMAIL_FROM (e.g., noreply@roastbeef.ai)

## Step 5: Set Up N8N

1. Configure your N8N workflow to:
   - Accept POST requests at your webhook URL
   - Expect JSON with: `{ url: string, roastId: string }`
   - Process the URL and return results
   - Call back to: `https://your-domain.vercel.app/api/n8n/webhook`
   - With JSON: `{ roastId: string, result: string, status?: 'completed' | 'failed' }`

2. Get your N8N webhook URL (N8N_WEBHOOK_URL)

## Step 6: Deploy to Vercel

1. Import your GitHub repository in Vercel
2. Configure environment variables in Vercel dashboard:

```
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://your-domain.vercel.app
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/roast
EMAIL_FROM=noreply@roastbeef.ai
RESEND_API_KEY=re_...
CRON_SECRET=<optional-secret-for-cron-endpoint>
```

3. Deploy!

## Step 7: Configure Vercel Cron Job

1. In Vercel dashboard, go to your project settings
2. Navigate to "Cron Jobs"
3. Add a new cron job:
   - Path: `/api/tokens/grant-monthly`
   - Schedule: `0 0 * * *` (daily at midnight UTC)
   - Or use the vercel.json configuration (already included)

## Step 8: Test Your Deployment

1. Test signup flow
2. Verify email verification works
3. Test token purchase
4. Test subscription
5. Test roast submission
6. Verify N8N integration

## Troubleshooting

- **Email not sending**: Check Resend API key and domain verification
- **Stripe webhook failing**: Verify webhook secret and endpoint URL
- **N8N not receiving requests**: Check N8N_WEBHOOK_URL environment variable
- **Database connection issues**: Verify MONGODB_URI and IP whitelist
- **Authentication issues**: Check NEXTAUTH_SECRET and NEXTAUTH_URL
