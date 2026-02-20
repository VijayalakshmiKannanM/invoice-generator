# Vercel Deployment Script for Windows PowerShell
# Run this script to deploy your Invoice Generator to Vercel

Write-Host "🚀 Vercel Deployment Script" -ForegroundColor Cyan
Write-Host ""

# Check if vercel is installed
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI installed: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

Write-Host ""
Write-Host "📋 Deployment Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Step 1: Login to Vercel"
Write-Host "  You'll be prompted to login via browser"
Write-Host ""
Write-Host "Step 2: Deploy to Vercel"
Write-Host "  Follow the prompts to deploy"
Write-Host ""
Write-Host "Step 3: Set Environment Variables"
Write-Host "  After deployment, add these in Vercel Dashboard:"
Write-Host "  - DATABASE_URL"
Write-Host "  - NEXTAUTH_SECRET"
Write-Host "  - NEXTAUTH_URL"
Write-Host "  - STRIPE_SECRET_KEY"
Write-Host "  - STRIPE_WEBHOOK_SECRET"
Write-Host "  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
Write-Host ""

$proceed = Read-Host "Ready to deploy? (Y/N)"

if ($proceed -eq "Y" -or $proceed -eq "y") {
    Write-Host ""
    Write-Host "🔐 Logging in to Vercel..." -ForegroundColor Cyan
    vercel login
    
    Write-Host ""
    Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan
    Write-Host "Follow the prompts:" -ForegroundColor Yellow
    Write-Host "  - Set up and deploy? Yes"
    Write-Host "  - Which scope? Your account"
    Write-Host "  - Link to existing project? No"
    Write-Host "  - Project name? invoice-generator (or press Enter)"
    Write-Host "  - Directory? ./ (press Enter)"
    Write-Host ""
    
    vercel
    
    Write-Host ""
    Write-Host "✅ Deployment initiated!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Go to Vercel Dashboard: https://vercel.com/dashboard"
    Write-Host "2. Select your project"
    Write-Host "3. Go to Settings → Environment Variables"
    Write-Host "4. Add all required environment variables"
    Write-Host "5. Redeploy: vercel --prod"
    Write-Host ""
    Write-Host "📖 See DEPLOY_VERCEL.md for detailed instructions"
} else {
    Write-Host ""
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
    Write-Host "Run this script again when ready, or see DEPLOY_VERCEL.md for manual steps"
}
