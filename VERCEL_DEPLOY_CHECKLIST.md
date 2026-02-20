# ✅ Vercel Deployment Checklist

Use this checklist while deploying to Vercel.

---

## 🔐 Environment Variables to Add

Copy these to Vercel Dashboard → Settings → Environment Variables:

### Required (Add Before First Deploy)

```env
NEXTAUTH_SECRET=[Generated below - copy it]
NEXTAUTH_URL=https://invoice-generator.vercel.app
NODE_ENV=production
```

**Note**: After first deploy, update `NEXTAUTH_URL` with your actual Vercel URL.

### Database (Add After Setting Up Database)

```env
DATABASE_URL=postgresql://user:password@host:5432/database
```

### Stripe (Add When Ready for Payments)

```env
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
```

---

## 📋 Step-by-Step Checklist

### Pre-Deployment
- [ ] Opened https://vercel.com
- [ ] Logged in with GitHub
- [ ] Generated NEXTAUTH_SECRET (see below)
- [ ] Ready to import repository

### Deployment
- [ ] Clicked "Add New..." → "Project"
- [ ] Found and imported `VijayalakshmiKannanM/invoice-generator`
- [ ] Added environment variables (NEXTAUTH_SECRET, NEXTAUTH_URL, NODE_ENV)
- [ ] Clicked "Deploy"
- [ ] Waited for build to complete (~2-3 minutes)

### Post-Deployment
- [ ] Copied actual Vercel URL from deployment page
- [ ] Updated NEXTAUTH_URL with actual URL
- [ ] Redeployed with updated NEXTAUTH_URL
- [ ] Verified app is accessible

### Database Setup (Next)
- [ ] Set up PostgreSQL database (Vercel Postgres or Supabase)
- [ ] Copied DATABASE_URL
- [ ] Added DATABASE_URL to environment variables
- [ ] Switched Prisma schema to PostgreSQL
- [ ] Ran database migrations
- [ ] Redeployed

### Stripe Setup (Optional - Later)
- [ ] Created Stripe account
- [ ] Got API keys from Stripe dashboard
- [ ] Added Stripe environment variables
- [ ] Configured webhook endpoint
- [ ] Tested payment flow

---

## 🎯 Quick Reference

### Your Repository
- **GitHub**: https://github.com/VijayalakshmiKannanM/invoice-generator
- **Vercel Dashboard**: https://vercel.com/dashboard

### After Deployment
- **Your App URL**: `https://[your-app-name].vercel.app`
- **Update NEXTAUTH_URL**: Settings → Environment Variables → Edit

---

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all files are committed to GitHub
- Verify package.json has all dependencies

### App Not Loading
- Check environment variables are set correctly
- Verify NEXTAUTH_URL matches your actual Vercel URL
- Check deployment logs for errors

### Database Connection Issues
- Verify DATABASE_URL is correct
- Ensure database is accessible from internet
- Check if SSL is required in connection string

---

## ✅ Success Indicators

Your deployment is successful when:
- ✅ App loads at Vercel URL
- ✅ Can access login/register pages
- ✅ No errors in browser console
- ✅ Build completed without errors

---

**Ready to deploy? Follow the steps above!**
