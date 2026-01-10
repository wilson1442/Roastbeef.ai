# Local Development Setup

## Prerequisites

- Node.js 20+ installed
- MongoDB installed locally (or use MongoDB Atlas)

## MongoDB Local Setup

### Option 1: Install MongoDB Locally

**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer
3. MongoDB will install as a Windows service and start automatically
4. Default connection: `mongodb://localhost:27017`

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Option 2: Use MongoDB Atlas (Cloud)

1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

## Project Setup

1. **Clone and install:**
```bash
git clone <your-repo-url>
cd roast
npm install
```

2. **Set up environment variables:**

Create a `.env.local` file in the root directory:

```env
# MongoDB - Use local MongoDB
MONGODB_URI=mongodb://localhost:27017/roastbeef

# Or use MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/roastbeef

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# Stripe (use test keys for development)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# N8N (your N8N webhook URL)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/roast

# Email (Resend)
EMAIL_FROM=noreply@roastbeef.ai
RESEND_API_KEY=re_your_resend_api_key

# Optional: For cron endpoint security
CRON_SECRET=your-random-secret
```

**Generate NEXTAUTH_SECRET:**
```bash
# Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString()))

# macOS/Linux
openssl rand -base64 32
```

3. **Start MongoDB (if running locally):**

**Windows:**
- MongoDB should be running as a service automatically
- Check: Open Services (services.msc) and look for "MongoDB"

**macOS/Linux:**
```bash
# Check if MongoDB is running
mongosh --eval "db.version()"

# If not running, start it:
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## Verifying MongoDB Connection

You can verify MongoDB is working by:

1. **Using MongoDB Compass (GUI):**
   - Download from [mongodb.com/products/compass](https://www.mongodb.com/products/compass)
   - Connect to `mongodb://localhost:27017`

2. **Using mongosh (CLI):**
```bash
mongosh
> use roastbeef
> db.users.find()
```

3. **Check the app logs:**
   - When you start the app, it should connect to MongoDB
   - Try signing up a user - it should create a record in MongoDB

## Troubleshooting

**MongoDB connection errors:**
- Make sure MongoDB is running: `mongosh --eval "db.version()"`
- Check the MONGODB_URI in `.env.local` is correct
- For local MongoDB, use: `mongodb://localhost:27017/roastbeef`
- Make sure no firewall is blocking port 27017

**Port already in use:**
- MongoDB might already be running
- Check: `netstat -an | findstr 27017` (Windows) or `lsof -i :27017` (macOS/Linux)

**Database not found:**
- MongoDB will create the database automatically on first use
- No need to create it manually
