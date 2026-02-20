# 🔐 Environment Variables Template

Copy these variables to your Vercel/Railway/AWS dashboard:

## Required Variables

```env
# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/database

# NextAuth
NEXTAUTH_SECRET=your-32-character-secret-key-minimum
NEXTAUTH_URL=https://your-app.vercel.app

# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...

# Node
NODE_ENV=production
```

## How to Get Values

### DATABASE_URL
**Vercel Postgres:**
1. Vercel Dashboard → Storage → Create Database → Postgres
2. Copy connection string

**Supabase (Free):**
1. Go to https://supabase.com
2. Create project
3. Settings → Database → Connection string

**Neon (Free):**
1. Go to https://neon.tech
2. Create project
3. Copy connection string

### NEXTAUTH_SECRET
Generate using PowerShell:
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

Or use online: https://randomkeygen.com

### NEXTAUTH_URL
- First deploy: `https://your-app.vercel.app` (get from Vercel after first deploy)
- Update after deployment with actual URL

### Stripe Keys
1. Go to https://dashboard.stripe.com
2. Sign up/login
3. Developers → API keys
4. Copy:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`
5. Webhooks → Add endpoint → Copy secret → `STRIPE_WEBHOOK_SECRET`

---

## Quick Setup Commands

### Generate NEXTAUTH_SECRET (PowerShell)
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### Test Database Connection
```bash
# Install PostgreSQL client (if needed)
# Test connection string works
```

---

## After Deployment

1. **Update NEXTAUTH_URL** with your actual Vercel URL
2. **Configure Stripe Webhook**:
   - URL: `https://your-app.vercel.app/api/payments/webhook`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`
3. **Run Database Migrations**:
   ```bash
   npx prisma migrate deploy
   ```
