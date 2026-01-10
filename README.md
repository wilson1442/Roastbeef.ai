# RoastBeef.ai

A playful website roasting service that uses AI to roast websites submitted by users.

## Features

- User authentication with email verification
- Token-based usage system
- Stripe payment integration (one-time purchases and subscriptions)
- N8N webhook integration for AI-powered website roasting
- Modern, playful UI design

## Getting Started

### Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Set up MongoDB:**
   - **Local MongoDB:** Install MongoDB locally (see [LOCAL_SETUP.md](LOCAL_SETUP.md))
   - **MongoDB Atlas:** Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/roastbeef
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   # ... see LOCAL_SETUP.md for full list
   ```

4. **Run the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Local Development

For detailed local setup instructions including MongoDB installation, see [LOCAL_SETUP.md](LOCAL_SETUP.md).

## Environment Variables

See [LOCAL_SETUP.md](LOCAL_SETUP.md) for all required environment variables and setup instructions.

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
