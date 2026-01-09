# RoastBeef.ai

A playful website roasting service that uses AI to roast websites submitted by users.

## Features

- User authentication with email verification
- Token-based usage system
- Stripe payment integration (one-time purchases and subscriptions)
- N8N webhook integration for AI-powered website roasting
- Modern, playful UI design

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your actual values
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

See `.env.local.example` for all required environment variables.

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- MongoDB with Mongoose
- NextAuth.js for authentication
- Stripe for payments
- Resend for email
- Tailwind CSS for styling

## Deployment

This project is configured for deployment on Vercel. Make sure to set all environment variables in your Vercel project settings.
