# 💳 Payment Integration Setup Guide

Complete guide to set up Stripe payment processing for your Invoice Generator.

---

## 📋 Prerequisites

- Stripe account (free to sign up)
- Application deployed or running locally
- Domain name (for production webhooks)

---

## 🔑 Step 1: Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Sign up for a free account
3. Complete business verification (required for live payments)

---

## 🔐 Step 2: Get Stripe API Keys

### Test Mode (Development)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

### Live Mode (Production)

1. Toggle to **Live mode** in Stripe Dashboard
2. Go to [API Keys](https://dashboard.stripe.com/apikeys)
3. Copy:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

**⚠️ Important**: Never expose your secret key in client-side code!

---

## 🔗 Step 3: Set Up Webhooks

### For Local Development

1. Install Stripe CLI:
   ```bash
   # Mac
   brew install stripe/stripe-cli/stripe

   # Windows
   # Download from https://github.com/stripe/stripe-cli/releases
   ```

2. Login to Stripe CLI:
   ```bash
   stripe login
   ```

3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/payments/webhook
   ```

4. Copy the webhook signing secret:
   ```
   > Ready! Your webhook signing secret is whsec_... (^C to quit)
   ```

5. Add to `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### For Production

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)

2. Click **"Add endpoint"**

3. Enter endpoint URL:
   ```
   https://yourdomain.com/api/payments/webhook
   ```

4. Select events to listen to:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`

5. Click **"Add endpoint"**

6. Copy the **Signing secret**:
   ```
   whsec_...
   ```

7. Add to production environment variables:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

---

## ⚙️ Step 4: Configure Environment Variables

### Local Development (.env)

```env
# Stripe Test Keys
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
```

### Production (AWS/Cloud)

```env
# Stripe Live Keys
STRIPE_SECRET_KEY=sk_live_51...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51...
```

---

## 🧪 Step 5: Test Payment Flow

### Test Cards (Stripe Test Mode)

Use these test card numbers:

**Successful Payment**:
```
Card: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

**Declined Payment**:
```
Card: 4000 0000 0000 0002
```

**Requires Authentication**:
```
Card: 4000 0025 0000 3155
```

### Test Flow

1. Create an invoice
2. Go to invoice detail page
3. Click "Pay Invoice" button
4. Enter test card details
5. Complete payment
6. Verify invoice status changes to "PAID"

---

## 🔍 Step 6: Verify Webhook Integration

### Check Webhook Logs

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click on your webhook endpoint
3. View **"Recent events"**
4. Check for successful deliveries

### Test Webhook Locally

```bash
# Trigger test event
stripe trigger checkout.session.completed
```

### Check Application Logs

```bash
# Elastic Beanstalk
eb logs

# ECS
aws logs tail /ecs/invoice-generator --follow
```

---

## 🐛 Troubleshooting

### Payment Button Not Working

**Issue**: Button doesn't redirect to Stripe

**Solutions**:
- Check `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- Verify API route `/api/payments/create-intent` is accessible
- Check browser console for errors

### Webhook Not Receiving Events

**Issue**: Payments complete but invoice status doesn't update

**Solutions**:
1. Verify webhook URL is correct
2. Check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
3. Verify webhook endpoint is publicly accessible
4. Check application logs for errors

### Payment Succeeds But Invoice Not Updated

**Issue**: Payment goes through but invoice stays "SENT"

**Solutions**:
- Verify webhook is configured correctly
- Check webhook events are being received
- Review application logs for webhook processing errors
- Ensure database connection is working

### SSL Certificate Issues

**Issue**: Webhook fails due to SSL errors

**Solutions**:
- Ensure your domain has valid SSL certificate
- Use HTTPS (not HTTP) for webhook URL
- Check certificate is not expired

---

## 🔒 Security Best Practices

### ✅ DO:

- Use environment variables for all secrets
- Keep secret keys secure (never commit to git)
- Use test mode for development
- Verify webhook signatures
- Use HTTPS for webhook endpoints
- Monitor webhook logs regularly

### ❌ DON'T:

- Expose secret keys in client-side code
- Use production keys in development
- Skip webhook signature verification
- Use HTTP for webhook endpoints
- Commit `.env` files to version control

---

## 📊 Monitoring Payments

### Stripe Dashboard

- View all payments: [Payments](https://dashboard.stripe.com/payments)
- View webhook events: [Webhooks](https://dashboard.stripe.com/webhooks)
- View customers: [Customers](https://dashboard.stripe.com/customers)

### Application Logs

Monitor your application logs for:
- Payment intent creation
- Webhook processing
- Payment status updates
- Error messages

---

## 💰 Pricing & Fees

### Stripe Fees

- **Online payments**: 2.9% + $0.30 per transaction
- **International cards**: Additional 1% fee
- **No monthly fees**
- **No setup fees**

### Test Mode

- All test transactions are free
- No charges in test mode
- Use test cards for development

---

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout Guide](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Testing Guide](https://stripe.com/docs/testing)

---

## ✅ Checklist

- [ ] Stripe account created
- [ ] API keys obtained (test and live)
- [ ] Webhook endpoint configured
- [ ] Webhook signing secret copied
- [ ] Environment variables set
- [ ] Test payment successful
- [ ] Webhook receiving events
- [ ] Invoice status updates correctly
- [ ] Production keys configured (when ready)
- [ ] SSL certificate installed (for production)

---

## 🎉 You're Ready!

Your payment integration is set up! Customers can now pay invoices directly through Stripe.

---

Need help? Check:
- `AWS_DEPLOYMENT.md` - Deployment guide
- `DOMAIN_SETUP.md` - Domain configuration
- `ENV_VARIABLES.md` - Environment variables
