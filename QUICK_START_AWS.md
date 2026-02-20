# ⚡ Quick Start - AWS Deployment with Payment & Domain

Get your Invoice Generator live on AWS with payments and custom domain in 30 minutes!

---

## 🎯 What You'll Deploy

- ✅ Invoice Generator application
- ✅ Stripe payment integration
- ✅ Custom .com domain
- ✅ PostgreSQL database
- ✅ SSL certificate

---

## 📋 Prerequisites Checklist

- [ ] AWS account (free tier available)
- [ ] Domain name (.com) purchased
- [ ] Stripe account created
- [ ] AWS CLI installed
- [ ] Git repository ready

---

## 🚀 Step-by-Step Deployment

### Step 1: Install Dependencies (5 min)

```bash
# Install AWS CLI
# Windows: Download from https://aws.amazon.com/cli/
# Mac: brew install awscli

# Install EB CLI
pip install awsebcli

# Verify installations
aws --version
eb --version
```

### Step 2: Configure AWS (2 min)

```bash
aws configure
# Enter AWS Access Key ID
# Enter AWS Secret Access Key
# Region: us-east-1
# Output: json
```

### Step 3: Set Up Stripe (5 min)

1. Go to [stripe.com](https://stripe.com) and sign up
2. Get API keys from [Dashboard](https://dashboard.stripe.com/apikeys)
3. Copy:
   - Publishable key: `pk_test_...`
   - Secret key: `sk_test_...`

### Step 4: Create Database (5 min)

```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier invoice-generator-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password YOUR_SECURE_PASSWORD \
  --allocated-storage 20 \
  --region us-east-1
```

**Wait 5-10 minutes** for database to be created.

### Step 5: Deploy Application (10 min)

```bash
cd invoice-generator

# Initialize Elastic Beanstalk
eb init invoice-generator --platform node.js --region us-east-1

# Create environment
eb create invoice-generator-env --instance-type t3.small

# Set environment variables
eb setenv \
  DATABASE_URL="postgresql://admin:PASSWORD@invoice-generator-db.xxxxx.us-east-1.rds.amazonaws.com:5432/postgres" \
  NEXTAUTH_SECRET="$(openssl rand -base64 32)" \
  NEXTAUTH_URL="https://yourdomain.com" \
  STRIPE_SECRET_KEY="sk_test_..." \
  STRIPE_WEBHOOK_SECRET="whsec_..." \
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..." \
  NODE_ENV="production"

# Build and deploy
npm run build
eb deploy
```

### Step 6: Set Up Domain (5 min)

1. **Get your EB URL**:
   ```bash
   eb status
   # Copy CNAME (e.g., invoice-generator-env.elasticbeanstalk.com)
   ```

2. **Create Route 53 Hosted Zone**:
   ```bash
   aws route53 create-hosted-zone --name yourdomain.com
   ```

3. **Create DNS Record**:
   - Go to Route 53 Console
   - Create CNAME record:
     - Name: www
     - Value: your-eb-environment.elasticbeanstalk.com

4. **Update Nameservers**:
   - Copy nameservers from Route 53
   - Update at your domain registrar

### Step 7: Set Up SSL (5 min)

```bash
# Request certificate
aws acm request-certificate \
  --domain-name yourdomain.com \
  --subject-alternative-names "www.yourdomain.com" \
  --validation-method DNS \
  --region us-east-1

# Add DNS validation records (from ACM console)
# Wait for validation (5-30 minutes)
```

### Step 8: Configure Stripe Webhook (3 min)

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://yourdomain.com/api/payments/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
4. Copy webhook secret
5. Update environment variable:
   ```bash
   eb setenv STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

### Step 9: Run Database Migrations (2 min)

```bash
# SSH into EB instance
eb ssh

# Run migrations
DATABASE_URL="your-database-url" npx prisma migrate deploy
```

---

## ✅ Verification Checklist

- [ ] Application accessible at `https://yourdomain.com`
- [ ] Can register/login
- [ ] Can create invoice
- [ ] Payment button appears on invoice
- [ ] Stripe checkout opens
- [ ] Test payment succeeds
- [ ] Invoice status updates to "PAID"
- [ ] Webhook events received in Stripe dashboard

---

## 🧪 Test Payment

Use Stripe test card:
- **Card**: 4242 4242 4242 4242
- **Expiry**: 12/34
- **CVC**: 123
- **ZIP**: 12345

---

## 📚 Detailed Guides

For more information, see:
- `AWS_DEPLOYMENT.md` - Complete AWS deployment guide
- `DOMAIN_SETUP.md` - Domain configuration details
- `PAYMENT_SETUP.md` - Payment integration guide
- `ENV_VARIABLES.md` - Environment variables reference

---

## 🐛 Common Issues

### Database Connection Failed
- Check security groups allow PostgreSQL (5432)
- Verify DATABASE_URL is correct
- Ensure RDS is in same VPC as EB

### Domain Not Resolving
- Wait 24-48 hours for DNS propagation
- Verify nameservers are updated
- Check DNS records are correct

### Webhook Not Working
- Verify webhook URL is accessible
- Check STRIPE_WEBHOOK_SECRET matches
- Review CloudWatch logs

---

## 💰 Estimated Costs

**AWS Free Tier** (First 12 months):
- EC2: 750 hours/month free
- RDS: 750 hours/month free
- Route 53: $0.50/month per hosted zone
- Data transfer: 1GB/month free

**After Free Tier**:
- EC2 t3.small: ~$15/month
- RDS db.t3.micro: ~$15/month
- Route 53: ~$0.50/month
- **Total**: ~$30-35/month

**Stripe**: 2.9% + $0.30 per transaction (no monthly fees)

---

## 🎉 Success!

Your Invoice Generator is now live with:
- ✅ AWS hosting
- ✅ Custom domain
- ✅ Payment processing
- ✅ SSL certificate

**Next Steps**:
1. Test all features
2. Set up monitoring
3. Configure backups
4. Switch to live Stripe keys when ready

---

Need help? Check the detailed guides or AWS support.
