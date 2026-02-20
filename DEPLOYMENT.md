# 🚀 Cloud Deployment Guide - Invoice Generator

This guide will help you deploy your Invoice Generator application to the cloud.

## 📋 Prerequisites

- GitHub account (for version control)
- Cloud provider account (Vercel recommended for Next.js)
- Database provider account (for production database)

---

## 🌐 Option 1: Deploy to Vercel (Recommended for Next.js)

Vercel is the easiest and most optimized platform for Next.js applications.

### Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub**:
   ```bash
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

### Step 2: Set Up Production Database

For production, you'll need a PostgreSQL database. Options:

**Option A: Vercel Postgres (Recommended)**
- Go to your Vercel project dashboard
- Navigate to Storage → Create Database → Postgres
- Copy the connection string

**Option B: Other Providers**
- [Supabase](https://supabase.com) (Free tier available)
- [Neon](https://neon.tech) (Free tier available)
- [Railway](https://railway.app) (Free tier available)
- [Render](https://render.com) (Free tier available)

### Step 3: Update Prisma Schema for Production

Update `prisma/schema.prisma` to use PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 4: Deploy to Vercel

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `NEXTAUTH_SECRET`: Generate a random secret (use: `openssl rand -base64 32`)
     - `NEXTAUTH_URL`: Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
   - Click "Deploy"

3. **Or Deploy via CLI**:
   ```bash
   vercel
   ```
   Follow the prompts and add environment variables when asked.

### Step 5: Run Database Migrations

After deployment, run Prisma migrations:

```bash
# Via Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy

# Or via Vercel Dashboard → Settings → Environment Variables
# Then run migrations in a build hook or via Vercel CLI
```

### Step 6: Access Your Application

Your app will be live at: `https://your-app.vercel.app`

---

## 🐳 Option 2: Deploy with Docker

You can deploy the Docker container to any cloud provider that supports Docker.

### Providers Supporting Docker:

- **Railway**: [railway.app](https://railway.app)
- **Render**: [render.com](https://render.com)
- **Fly.io**: [fly.io](https://fly.io)
- **DigitalOcean App Platform**: [digitalocean.com](https://digitalocean.com)
- **AWS ECS/Fargate**: [aws.amazon.com](https://aws.amazon.com)
- **Google Cloud Run**: [cloud.google.com](https://cloud.google.com)

### Deployment Steps:

1. **Update Dockerfile** (if needed):
   - Ensure `next.config.js` has `output: 'standalone'` (already configured)

2. **Set Environment Variables**:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Random secret key
   - `NEXTAUTH_URL`: Your deployment URL

3. **Deploy**:
   - Connect your GitHub repository
   - Configure build settings to use Dockerfile
   - Add environment variables
   - Deploy

---

## 🔧 Option 3: Deploy to Railway

Railway is great for full-stack applications with databases.

### Steps:

1. **Sign up** at [railway.app](https://railway.app)

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL Database**:
   - Click "New" → "Database" → "PostgreSQL"
   - Copy the connection string

4. **Configure Environment Variables**:
   - `DATABASE_URL`: PostgreSQL connection string from Railway
   - `NEXTAUTH_SECRET`: Generate secret (`openssl rand -base64 32`)
   - `NEXTAUTH_URL`: Your Railway app URL

5. **Deploy**:
   - Railway will automatically detect Next.js and deploy
   - Run migrations: Add a build command or run manually

---

## 🔐 Environment Variables for Production

Create these environment variables in your cloud provider:

```env
DATABASE_URL=postgresql://user:password@host:port/database
NEXTAUTH_SECRET=your-super-secret-key-min-32-characters
NEXTAUTH_URL=https://your-app-domain.com
NODE_ENV=production
```

### Generate NEXTAUTH_SECRET:

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Windows (PowerShell):**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Online:**
- Use [randomkeygen.com](https://randomkeygen.com)

---

## 📝 Post-Deployment Checklist

- [ ] Database migrations run successfully
- [ ] Environment variables configured
- [ ] Application accessible via URL
- [ ] User registration/login works
- [ ] Invoice creation works
- [ ] PDF generation works
- [ ] Custom domain configured (optional)

---

## 🐛 Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check if database allows connections from your deployment IP
- Ensure SSL is configured if required

### NextAuth Issues

- Verify `NEXTAUTH_URL` matches your deployment URL exactly
- Ensure `NEXTAUTH_SECRET` is set and is at least 32 characters

### Build Failures

- Check build logs in your cloud provider dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

---

## 🔄 Continuous Deployment

Most cloud providers support automatic deployments:

- **Vercel**: Automatic on git push to main branch
- **Railway**: Automatic on git push
- **Render**: Automatic on git push

Configure in your provider's dashboard settings.

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [NextAuth.js Deployment](https://next-auth.js.org/configuration/options#nextauth_url)

---

## 💡 Tips

1. **Use Environment Variables**: Never commit secrets to git
2. **Database Backups**: Set up regular backups for production database
3. **Monitoring**: Enable error tracking (Sentry, LogRocket, etc.)
4. **Performance**: Use Vercel Analytics or similar for monitoring
5. **SSL**: Most providers include SSL certificates automatically

---

Happy Deploying! 🚀
