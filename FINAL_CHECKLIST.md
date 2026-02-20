# ✅ Final Deployment Checklist

Use this checklist to ensure everything is ready for production deployment.

---

## 📋 Pre-Deployment Checklist

### Environment Setup
- [ ] Node.js 18+ installed
- [ ] npm dependencies installed (`npm install`)
- [ ] `.env` file created with all variables
- [ ] Database configured (SQLite for dev, PostgreSQL for prod)
- [ ] Prisma client generated (`npm run db:generate`)

### Stripe Configuration
- [ ] Stripe account created
- [ ] API keys obtained (test and live)
- [ ] Webhook endpoint configured
- [ ] Webhook signing secret copied
- [ ] Test payment successful

### AWS Setup
- [ ] AWS account created
- [ ] AWS CLI installed and configured
- [ ] Elastic Beanstalk CLI installed (if using EB)
- [ ] RDS PostgreSQL instance created
- [ ] Security groups configured
- [ ] IAM roles set up

### Domain Setup
- [ ] Domain purchased (.com)
- [ ] Route 53 hosted zone created
- [ ] DNS records configured
- [ ] SSL certificate requested
- [ ] SSL certificate validated

---

## 🔧 Configuration Checklist

### Environment Variables
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `NEXTAUTH_SECRET` - 32+ character secret
- [ ] `NEXTAUTH_URL` - Production URL (https://yourdomain.com)
- [ ] `STRIPE_SECRET_KEY` - Stripe live secret key
- [ ] `STRIPE_WEBHOOK_SECRET` - Webhook signing secret
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe live publishable key
- [ ] `NODE_ENV` - Set to "production"

### Database
- [ ] Prisma schema switched to PostgreSQL
- [ ] Database migrations created
- [ ] Migrations deployed to production
- [ ] Database backups configured

### Application
- [ ] Application builds successfully (`npm run build`)
- [ ] All tests pass (if any)
- [ ] No TypeScript errors
- [ ] No linting errors

---

## 🚀 Deployment Steps

### Step 1: Prepare for Production
```bash
# Switch to PostgreSQL schema
node scripts/prepare-production.js

# Verify setup
npm run setup:check

# Build application
npm run build
```

### Step 2: Deploy to AWS
```bash
# Initialize EB (if not done)
eb init invoice-generator --platform node.js --region us-east-1

# Create environment
eb create invoice-generator-env --instance-type t3.small

# Set environment variables
eb setenv DATABASE_URL=... NEXTAUTH_SECRET=... [etc]

# Deploy
eb deploy
```

### Step 3: Configure Domain
- [ ] Update DNS records in Route 53
- [ ] Wait for DNS propagation
- [ ] Verify domain resolves correctly
- [ ] SSL certificate attached

### Step 4: Run Migrations
```bash
# SSH into instance
eb ssh

# Run migrations
DATABASE_URL="..." npx prisma migrate deploy
```

### Step 5: Configure Stripe Webhook
- [ ] Webhook URL: `https://yourdomain.com/api/payments/webhook`
- [ ] Events selected: `checkout.session.completed`, `payment_intent.succeeded`
- [ ] Webhook secret copied to environment variables

---

## 🧪 Testing Checklist

### Functionality Tests
- [ ] User registration works
- [ ] User login works
- [ ] Can create customer
- [ ] Can create invoice
- [ ] Invoice PDF downloads
- [ ] Payment button appears on invoice
- [ ] Stripe checkout opens
- [ ] Test payment succeeds
- [ ] Invoice status updates to "PAID"
- [ ] Payment record created in database

### Security Tests
- [ ] HTTPS enabled and working
- [ ] Environment variables not exposed
- [ ] Authentication required for protected routes
- [ ] Webhook signature verification working
- [ ] Database credentials secure

### Performance Tests
- [ ] Application loads quickly
- [ ] Database queries optimized
- [ ] Images/assets optimized
- [ ] CDN configured (if applicable)

---

## 📊 Monitoring Setup

### CloudWatch
- [ ] Log groups created
- [ ] Log retention configured
- [ ] Alarms set up for errors
- [ ] Alarms set up for high CPU/memory

### Application Monitoring
- [ ] Error tracking configured (optional)
- [ ] Analytics configured (optional)
- [ ] Uptime monitoring (optional)

---

## 🔒 Security Checklist

- [ ] All secrets in environment variables (not in code)
- [ ] `.env` file in `.gitignore`
- [ ] Database not publicly accessible (or properly secured)
- [ ] HTTPS enforced
- [ ] CORS configured correctly
- [ ] Rate limiting configured (optional)
- [ ] Security headers configured
- [ ] Regular backups scheduled

---

## 📝 Post-Deployment

### Immediate Actions
- [ ] Verify application accessible via domain
- [ ] Test complete payment flow
- [ ] Check application logs for errors
- [ ] Verify webhook events received
- [ ] Test invoice creation and management

### Documentation
- [ ] Update deployment documentation
- [ ] Document any custom configurations
- [ ] Create runbook for common issues
- [ ] Document backup/restore procedures

### Monitoring
- [ ] Set up daily monitoring checks
- [ ] Configure alert notifications
- [ ] Review logs regularly
- [ ] Monitor Stripe dashboard

---

## 🐛 Troubleshooting

If something doesn't work:

1. **Check Logs**
   ```bash
   eb logs  # For Elastic Beanstalk
   aws logs tail /ecs/invoice-generator --follow  # For ECS
   ```

2. **Verify Environment Variables**
   ```bash
   eb printenv  # For Elastic Beanstalk
   ```

3. **Check Database Connection**
   - Verify DATABASE_URL is correct
   - Check security groups allow connections
   - Test connection manually

4. **Verify Stripe Webhook**
   - Check webhook URL is correct
   - Verify webhook secret matches
   - Check Stripe dashboard for events

---

## ✅ Success Criteria

Your deployment is successful when:

- ✅ Application accessible at `https://yourdomain.com`
- ✅ Users can register and login
- ✅ Invoices can be created and managed
- ✅ Payments process successfully
- ✅ Invoice status updates automatically
- ✅ PDF generation works
- ✅ All features function correctly
- ✅ No errors in logs
- ✅ SSL certificate valid
- ✅ Database persists data

---

## 📞 Support Resources

- **AWS Support**: https://aws.amazon.com/support
- **Stripe Support**: https://support.stripe.com
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs

---

## 🎉 Ready to Launch!

Once all items are checked, your Invoice Generator is ready for production!

**Next Steps:**
1. Monitor application closely for first 24 hours
2. Test all features thoroughly
3. Set up regular backups
4. Plan for scaling if needed

---

**Last Updated**: $(date)
**Version**: 1.0.0
