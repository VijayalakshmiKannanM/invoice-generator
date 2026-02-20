# 🚀 Deploy Now - Step by Step Guide

## Option 1: Deploy to Vercel (Easiest - 10 minutes) ⭐ Recommended

Vercel is the easiest way to deploy Next.js applications. No AWS CLI needed!

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
cd invoice-generator
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No**
- Project name? **invoice-generator** (or press Enter)
- Directory? **./** (press Enter)
- Override settings? **No**

### Step 4: Set Environment Variables

After first deploy, go to Vercel Dashboard:
1. Go to your project → Settings → Environment Variables
2. Add these variables:

```env
DATABASE_URL=your-postgresql-connection-string
NEXTAUTH_SECRET=your-secret-key-32-chars-minimum
NEXTAUTH_URL=https://your-app.vercel.app
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NODE_ENV=production
```

### Step 5: Set Up Database

**Option A: Vercel Postgres (Easiest)**
1. In Vercel Dashboard → Storage → Create Database → Postgres
2. Copy connection string
3. Update `DATABASE_URL` environment variable

**Option B: External PostgreSQL**
- Use Supabase (free): https://supabase.com
- Use Neon (free): https://neon.tech
- Use Railway (free): https://railway.app

### Step 6: Update Prisma Schema for PostgreSQL

```bash
# Copy PostgreSQL schema
cp prisma/schema.postgresql.prisma prisma/schema.prisma

# Generate Prisma client
npm run db:generate
```

### Step 7: Run Migrations

```bash
# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy
```

### Step 8: Redeploy

```bash
vercel --prod
```

**Done!** Your app is live at `https://your-app.vercel.app`

---

## Option 2: Deploy to AWS (More Setup Required)

### Prerequisites Installation

#### Install AWS CLI (Windows)

1. **Download AWS CLI**:
   - Go to: https://awscli.amazonaws.com/AWSCLIV2.msi
   - Download and install

2. **Verify Installation**:
   ```bash
   aws --version
   ```

3. **Configure AWS**:
   ```bash
   aws configure
   ```
   - Enter AWS Access Key ID
   - Enter AWS Secret Access Key
   - Region: `us-east-1`
   - Output format: `json`

#### Install Elastic Beanstalk CLI

1. **Install Python** (if not installed):
   - Download: https://www.python.org/downloads/
   - Check "Add Python to PATH" during installation

2. **Install EB CLI**:
   ```bash
   pip install awsebcli
   ```

3. **Verify Installation**:
   ```bash
   eb --version
   ```

### Deploy to AWS

```bash
cd invoice-generator

# Initialize EB
eb init invoice-generator --platform node.js --region us-east-1

# Create environment
eb create invoice-generator-env --instance-type t3.small

# Set environment variables
eb setenv \
  DATABASE_URL="postgresql://..." \
  NEXTAUTH_SECRET="your-secret" \
  NEXTAUTH_URL="https://yourdomain.com" \
  STRIPE_SECRET_KEY="sk_test_..." \
  STRIPE_WEBHOOK_SECRET="whsec_..." \
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..." \
  NODE_ENV="production"

# Build and deploy
npm run build
eb deploy
```

---

## Option 3: Deploy to Railway (Easy Alternative)

### Step 1: Sign Up

1. Go to: https://railway.app
2. Sign up with GitHub

### Step 2: Create Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository

### Step 3: Add PostgreSQL

1. Click "New" → "Database" → "PostgreSQL"
2. Copy connection string

### Step 4: Set Environment Variables

In Railway dashboard → Variables:
```env
DATABASE_URL=postgresql://... (from Railway)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-app.railway.app
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NODE_ENV=production
```

### Step 5: Deploy

Railway will automatically detect Next.js and deploy!

---

## 🎯 Quick Comparison

| Platform | Setup Time | Difficulty | Cost |
|----------|------------|------------|------|
| **Vercel** | 10 min | ⭐ Easy | Free tier available |
| **Railway** | 15 min | ⭐⭐ Medium | Free tier available |
| **AWS** | 30+ min | ⭐⭐⭐ Hard | ~$30/month |

---

## 💡 Recommendation

**Start with Vercel** - It's the fastest and easiest for Next.js apps!

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Set environment variables in dashboard
4. Done!

---

## 📝 Next Steps After Deployment

1. **Set up Stripe Webhook**:
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://your-app-url/api/payments/webhook`
   - Copy webhook secret
   - Update environment variable

2. **Configure Domain** (Optional):
   - Add custom domain in Vercel/Railway dashboard
   - Update DNS records
   - Update `NEXTAUTH_URL` environment variable

3. **Test Payment Flow**:
   - Create an invoice
   - Click "Pay Invoice"
   - Use test card: `4242 4242 4242 4242`

---

## 🐛 Troubleshooting

### Vercel Deployment Issues

- **Build fails**: Check build logs in Vercel dashboard
- **Database connection fails**: Verify `DATABASE_URL` is correct
- **Environment variables not working**: Ensure they're set in Vercel dashboard

### AWS Deployment Issues

- **EB CLI not found**: Make sure Python is installed and in PATH
- **AWS CLI not found**: Install AWS CLI from official website
- **Permission denied**: Check AWS credentials are configured

---

## ✅ Success!

Once deployed, your app will be live and ready to accept payments!
