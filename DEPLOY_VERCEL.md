# 🚀 Deploy to Vercel - Step by Step Guide

## Method 1: Deploy via Vercel Website (Easiest) ⭐

### Step 1: Sign Up / Login
1. Go to https://vercel.com
2. Click "Sign Up" or "Login"
3. Sign in with GitHub (recommended)

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Click "Import Git Repository"
3. Find and select: `VijayalakshmiKannanM/invoice-generator`
4. Click "Import"

### Step 3: Configure Project
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### Step 4: Set Environment Variables
Before deploying, click "Environment Variables" and add:

```env
DATABASE_URL=your-postgresql-connection-string
NEXTAUTH_SECRET=your-32-character-secret-key
NEXTAUTH_URL=https://your-app.vercel.app
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NODE_ENV=production
```

**Important**: After first deploy, update `NEXTAUTH_URL` with your actual Vercel URL.

### Step 5: Deploy
1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Your app will be live at: `https://your-app.vercel.app`

---

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login
```bash
vercel login
```

### Step 3: Deploy
```bash
cd invoice-generator
vercel
```

Follow prompts:
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No**
- Project name? **invoice-generator**
- Directory? **./**
- Override settings? **No**

### Step 4: Set Environment Variables
```bash
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add NODE_ENV
```

### Step 5: Deploy to Production
```bash
vercel --prod
```

---

## 🗄️ Set Up Database

### Option A: Vercel Postgres (Easiest)

1. In Vercel Dashboard → Your Project → Storage
2. Click "Create Database" → "Postgres"
3. Choose plan (Hobby is free)
4. Copy connection string
5. Add to `DATABASE_URL` environment variable

### Option B: External PostgreSQL

**Supabase (Free)**:
1. Go to https://supabase.com
2. Create account and project
3. Go to Settings → Database
4. Copy connection string
5. Format: `postgresql://postgres:[password]@[host]:5432/postgres`

**Neon (Free)**:
1. Go to https://neon.tech
2. Create account and project
3. Copy connection string
4. Add to `DATABASE_URL`

---

## 🔄 Update Prisma Schema for PostgreSQL

After setting up PostgreSQL database:

1. **Switch Schema**:
   ```bash
   cp prisma/schema.postgresql.prisma prisma/schema.prisma
   ```

2. **Generate Prisma Client**:
   ```bash
   npm run db:generate
   ```

3. **Create Migration**:
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Deploy Migration** (in Vercel):
   - Add build command: `npm run build && npx prisma migrate deploy`
   - Or run manually via Vercel CLI

---

## 💳 Set Up Stripe

### Step 1: Get Stripe Keys
1. Go to https://dashboard.stripe.com
2. Sign up or login
3. Go to Developers → API keys
4. Copy:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

### Step 2: Configure Webhook
1. After deployment, go to Stripe Dashboard → Webhooks
2. Click "Add endpoint"
3. URL: `https://your-app.vercel.app/api/payments/webhook`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy webhook signing secret → `STRIPE_WEBHOOK_SECRET`

---

## ✅ Post-Deployment Checklist

- [ ] Application accessible via Vercel URL
- [ ] Database connected and migrations run
- [ ] Environment variables set
- [ ] Stripe webhook configured
- [ ] Test payment flow works
- [ ] Invoice creation works
- [ ] PDF generation works

---

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors locally

### Database Connection Fails
- Verify `DATABASE_URL` is correct
- Check database is accessible from internet
- Ensure SSL is enabled if required

### Payment Not Working
- Verify Stripe keys are correct
- Check webhook URL is accessible
- Review Stripe dashboard for webhook events

---

## 🎉 Success!

Your Invoice Generator is now live on Vercel!

**Next Steps**:
1. Test all features
2. Configure custom domain (optional)
3. Switch to Stripe live keys when ready
4. Set up monitoring
