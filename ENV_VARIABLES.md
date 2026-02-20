# 🔐 Environment Variables Guide

Complete list of environment variables needed for the Invoice Generator application.

---

## 📋 Required Environment Variables

### Database

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
```

**For Local Development (SQLite)**:
```env
DATABASE_URL="file:./prisma/dev.db"
```

**For Production (PostgreSQL)**:
```env
DATABASE_URL="postgresql://admin:password@invoice-db.xxxxx.us-east-1.rds.amazonaws.com:5432/invoicedb"
```

---

### NextAuth Configuration

```env
NEXTAUTH_SECRET="your-32-character-secret-key-minimum"
NEXTAUTH_URL="https://yourdomain.com"
```

**Generate NEXTAUTH_SECRET**:

**Linux/Mac**:
```bash
openssl rand -base64 32
```

**Windows PowerShell**:
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Online Generator**:
- https://randomkeygen.com
- Use "CodeIgniter Encryption Keys"

---

### Stripe Payment Integration

```env
# Server-side (keep secret!)
STRIPE_SECRET_KEY="sk_live_51..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Client-side (public, safe to expose)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_51..."
```

**Get Stripe Keys**:
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Developers → API keys
3. Copy:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

**Get Webhook Secret**:
1. Stripe Dashboard → Developers → Webhooks
2. Create endpoint: `https://yourdomain.com/api/payments/webhook`
3. Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

### Node Environment

```env
NODE_ENV="production"
PORT="3000"
```

---

## 📝 Complete .env Example

### Local Development

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth
NEXTAUTH_SECRET="local-development-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (Test Mode)
STRIPE_SECRET_KEY="sk_test_51..."
STRIPE_WEBHOOK_SECRET="whsec_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51..."

# Node
NODE_ENV="development"
PORT="3000"
```

### Production

```env
# Database
DATABASE_URL="postgresql://admin:password@invoice-db.xxxxx.us-east-1.rds.amazonaws.com:5432/invoicedb"

# NextAuth
NEXTAUTH_SECRET="your-production-secret-32-characters-minimum"
NEXTAUTH_URL="https://yourdomain.com"

# Stripe (Live Mode)
STRIPE_SECRET_KEY="sk_live_51..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_51..."

# Node
NODE_ENV="production"
PORT="3000"
```

---

## 🔒 Security Best Practices

### ✅ DO:

- Use different secrets for development and production
- Store secrets in AWS Secrets Manager or environment variables
- Never commit `.env` files to git
- Rotate secrets regularly
- Use strong, random secrets (32+ characters)

### ❌ DON'T:

- Commit secrets to version control
- Share secrets in chat/email
- Use default or weak secrets
- Expose server-side keys to client

---

## 🚀 Setting Environment Variables

### AWS Elastic Beanstalk

```bash
eb setenv \
  DATABASE_URL="postgresql://..." \
  NEXTAUTH_SECRET="..." \
  NEXTAUTH_URL="https://yourdomain.com" \
  STRIPE_SECRET_KEY="sk_live_..." \
  STRIPE_WEBHOOK_SECRET="whsec_..." \
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..." \
  NODE_ENV="production"
```

### AWS ECS (Task Definition)

```json
{
  "environment": [
    {
      "name": "DATABASE_URL",
      "value": "postgresql://..."
    }
  ],
  "secrets": [
    {
      "name": "NEXTAUTH_SECRET",
      "valueFrom": "arn:aws:secretsmanager:..."
    }
  ]
}
```

### AWS Secrets Manager

```bash
# Create secret
aws secretsmanager create-secret \
  --name invoice-generator/env \
  --secret-string '{
    "DATABASE_URL": "postgresql://...",
    "NEXTAUTH_SECRET": "...",
    "STRIPE_SECRET_KEY": "sk_live_..."
  }'

# Reference in ECS task definition
```

### AWS Amplify

1. Go to App Settings → Environment variables
2. Add each variable:
   - Key: `DATABASE_URL`
   - Value: `postgresql://...`
3. Save

---

## 🧪 Testing Environment Variables

### Check Variables are Loaded

```bash
# In your application
console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Missing');
console.log('Stripe Key:', process.env.STRIPE_SECRET_KEY ? 'Set' : 'Missing');
```

### Verify Stripe Keys

```bash
# Test Stripe connection
curl https://api.stripe.com/v1/charges \
  -u sk_test_...:
```

---

## 📚 Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Stripe API Keys](https://stripe.com/docs/keys)
- [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/)
- [NextAuth Configuration](https://next-auth.js.org/configuration/options)

---

## ✅ Checklist

- [ ] DATABASE_URL configured
- [ ] NEXTAUTH_SECRET generated (32+ chars)
- [ ] NEXTAUTH_URL matches deployment URL
- [ ] STRIPE_SECRET_KEY from Stripe dashboard
- [ ] STRIPE_WEBHOOK_SECRET from webhook endpoint
- [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY configured
- [ ] NODE_ENV set to production
- [ ] All variables set in deployment platform
- [ ] .env file added to .gitignore
- [ ] Secrets stored securely (not in code)

---

Need help? Check deployment guides:
- `AWS_DEPLOYMENT.md` - AWS deployment
- `DOMAIN_SETUP.md` - Domain configuration
