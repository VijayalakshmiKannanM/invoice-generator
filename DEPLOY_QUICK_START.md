# ⚡ Quick Deployment Guide

## 🚀 Deploy to Vercel (Fastest - 5 minutes)

### Prerequisites
- GitHub account
- Vercel account (free)

### Steps:

1. **Push code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Ready for deployment"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Create Vercel Postgres Database**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Create new project → Import your GitHub repo
   - Go to Storage → Create Database → Postgres
   - Copy the connection string

3. **Update Prisma Schema**:
   Change `prisma/schema.prisma` datasource to:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

4. **Set Environment Variables in Vercel**:
   - Go to Project Settings → Environment Variables
   - Add:
     - `DATABASE_URL`: Your Vercel Postgres connection string
     - `NEXTAUTH_SECRET`: Run `openssl rand -base64 32` (or use online generator)
     - `NEXTAUTH_URL`: Will be `https://your-app.vercel.app` (set after first deploy)

5. **Deploy**:
   - Vercel will auto-deploy on git push
   - Or click "Deploy" in dashboard

6. **Run Database Migrations**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Pull environment variables
   vercel env pull .env.local
   
   # Run migrations
   npx prisma migrate deploy
   ```

7. **Update NEXTAUTH_URL**:
   - After first deploy, update `NEXTAUTH_URL` in Vercel to your actual URL
   - Redeploy

**Done!** Your app is live at `https://your-app.vercel.app`

---

## 🐳 Deploy with Docker to Railway (Alternative)

1. **Sign up** at [railway.app](https://railway.app)

2. **Create Project**:
   - New Project → Deploy from GitHub
   - Select your repo

3. **Add PostgreSQL**:
   - New → Database → PostgreSQL
   - Copy connection string

4. **Set Environment Variables**:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Random secret (32+ chars)
   - `NEXTAUTH_URL`: Your Railway URL

5. **Deploy**:
   - Railway auto-detects Dockerfile
   - Deploys automatically

**Done!** Your app is live on Railway.

---

## 🔑 Generate Secrets

**NEXTAUTH_SECRET** (32+ characters):

**Mac/Linux:**
```bash
openssl rand -base64 32
```

**Windows PowerShell:**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Online:**
- Visit [randomkeygen.com](https://randomkeygen.com) → CodeIgniter Encryption Keys

---

## ✅ Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Can register new user
- [ ] Can login
- [ ] Can create invoice
- [ ] PDF downloads work
- [ ] Database persists data

---

Need help? Check `DEPLOYMENT.md` for detailed instructions.
