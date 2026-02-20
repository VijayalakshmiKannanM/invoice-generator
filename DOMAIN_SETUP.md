# 🌐 Domain Setup Guide - .com Domain Configuration

Complete guide to connect your custom .com domain to your deployed application.

---

## 📋 Prerequisites

- Domain name purchased (.com)
- AWS account
- Application deployed to AWS

---

## 🛒 Step 1: Purchase Domain

### Option A: AWS Route 53 (Recommended)

1. Go to [Route 53 Console](https://console.aws.amazon.com/route53/)
2. Click "Registered domains" → "Register domain"
3. Search for your desired .com domain
4. Add to cart and complete purchase
5. **Cost**: ~$12-15/year

### Option B: External Registrar

Popular registrars:
- **Namecheap**: https://www.namecheap.com
- **GoDaddy**: https://www.godaddy.com
- **Google Domains**: https://domains.google
- **Cloudflare**: https://www.cloudflare.com/products/registrar/

**Note**: You can transfer domain to Route 53 later if needed.

---

## 🔧 Step 2: Configure DNS

### For AWS Elastic Beanstalk

#### Method 1: Route 53 Hosted Zone

1. **Create Hosted Zone**:
   ```bash
   aws route53 create-hosted-zone \
     --name yourdomain.com \
     --caller-reference $(date +%s)
   ```

2. **Get Your EB Environment URL**:
   ```bash
   eb status
   # Copy the CNAME (e.g., invoice-generator-env.elasticbeanstalk.com)
   ```

3. **Create CNAME Record**:
   ```bash
   aws route53 change-resource-record-sets \
     --hosted-zone-id Z1234567890ABC \
     --change-batch '{
       "Changes": [{
         "Action": "CREATE",
         "ResourceRecordSet": {
           "Name": "www.yourdomain.com",
           "Type": "CNAME",
           "TTL": 300,
           "ResourceRecords": [{"Value": "invoice-generator-env.elasticbeanstalk.com"}]
         }
       }]
     }'
   ```

4. **Create Root Domain Record** (if using Route 53):
   ```bash
   # Create A record alias pointing to EB environment
   aws route53 change-resource-record-sets \
     --hosted-zone-id Z1234567890ABC \
     --change-batch '{
       "Changes": [{
         "Action": "CREATE",
         "ResourceRecordSet": {
           "Name": "yourdomain.com",
           "Type": "A",
           "AliasTarget": {
             "DNSName": "invoice-generator-env.elasticbeanstalk.com",
             "EvaluateTargetHealth": false,
             "HostedZoneId": "Z3AADJGX6KTTL2"
           }
         }
       }]
     }'
   ```

#### Method 2: External DNS Provider

If using external registrar (Namecheap, GoDaddy, etc.):

1. **Get EB Environment URL**:
   ```bash
   eb status
   ```

2. **Add DNS Records**:
   - **Type**: CNAME
   - **Host**: www (or @ for root domain)
   - **Value**: your-eb-environment.elasticbeanstalk.com
   - **TTL**: 300 (5 minutes)

3. **For Root Domain** (if registrar supports):
   - Some registrars require A record
   - Use AWS Route 53 nameservers for root domain support

---

### For AWS ECS/Application Load Balancer

1. **Get ALB DNS Name**:
   ```bash
   aws elbv2 describe-load-balancers \
     --names invoice-generator-alb \
     --query 'LoadBalancers[0].DNSName' \
     --output text
   ```

2. **Get ALB Hosted Zone ID**:
   ```bash
   aws elbv2 describe-load-balancers \
     --names invoice-generator-alb \
     --query 'LoadBalancers[0].CanonicalHostedZoneId' \
     --output text
   ```

3. **Create Route 53 A Record (Alias)**:
   ```bash
   aws route53 change-resource-record-sets \
     --hosted-zone-id Z1234567890ABC \
     --change-batch '{
       "Changes": [{
         "Action": "CREATE",
         "ResourceRecordSet": {
           "Name": "yourdomain.com",
           "Type": "A",
           "AliasTarget": {
             "DNSName": "your-alb-dns-name.us-east-1.elb.amazonaws.com",
             "EvaluateTargetHealth": false,
             "HostedZoneId": "Z35SXDOTRQ7X7K"
           }
         }
       }]
     }'
   ```

---

### For AWS Amplify

1. **In Amplify Console**:
   - Go to your app → App Settings → Domain Management
   - Click "Add domain"
   - Enter: `yourdomain.com`
   - Click "Configure domain"

2. **Add Subdomain** (optional):
   - Click "Add subdomain"
   - Enter: `www`
   - Amplify will auto-configure

3. **Update DNS**:
   - Copy the nameservers or CNAME records shown
   - Update at your domain registrar

---

## 🔒 Step 3: Set Up SSL Certificate

### Using AWS Certificate Manager (ACM)

1. **Request Certificate**:
   ```bash
   aws acm request-certificate \
     --domain-name yourdomain.com \
     --subject-alternative-names "www.yourdomain.com" \
     --validation-method DNS \
     --region us-east-1
   ```

2. **Get Validation Records**:
   ```bash
   aws acm describe-certificate \
     --certificate-arn arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/CERT_ID \
     --query 'Certificate.DomainValidationOptions'
   ```

3. **Add DNS Validation Records**:
   - Add CNAME records to your hosted zone
   - Wait for validation (usually 5-30 minutes)

4. **Attach to Load Balancer**:
   ```bash
   aws elbv2 modify-listener \
     --listener-arn arn:aws:elasticloadbalancing:... \
     --certificates CertificateArn=arn:aws:acm:... \
     --protocol HTTPS \
     --port 443
   ```

### For Elastic Beanstalk

1. **Request Certificate** (same as above)
2. **Configure HTTPS in EB**:
   ```bash
   eb setenv \
     AWS_EB_ENABLE_HTTPS=true \
     AWS_EB_CERTIFICATE_ARN=arn:aws:acm:...
   ```

---

## 🔄 Step 4: Update Application Configuration

### Update Environment Variables

```bash
# For Elastic Beanstalk
eb setenv NEXTAUTH_URL=https://yourdomain.com

# For ECS
aws ecs update-service \
  --cluster invoice-generator-cluster \
  --service invoice-generator-service \
  --task-definition invoice-generator \
  --force-new-deployment

# Update task definition with new environment variables
```

### Update Stripe Webhook URL

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Edit your webhook endpoint
3. Update URL to: `https://yourdomain.com/api/payments/webhook`
4. Save changes

---

## ✅ Step 5: Verify Setup

### Check DNS Propagation

```bash
# Check A record
dig yourdomain.com +short

# Check CNAME
dig www.yourdomain.com +short

# Online tools:
# - https://dnschecker.org
# - https://www.whatsmydns.net
```

### Test HTTPS

```bash
# Test SSL certificate
curl -I https://yourdomain.com

# Check certificate details
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

### Verify Application

1. Open browser: `https://yourdomain.com`
2. Check if application loads
3. Test payment flow
4. Verify webhooks are working

---

## 🎯 Common DNS Record Types

### A Record (IPv4)
```
Type: A
Name: @ (or yourdomain.com)
Value: IP_ADDRESS
TTL: 300
```

### CNAME Record
```
Type: CNAME
Name: www
Value: target-domain.com
TTL: 300
```

### AAAA Record (IPv6)
```
Type: AAAA
Name: @
Value: IPv6_ADDRESS
TTL: 300
```

---

## 🐛 Troubleshooting

### Domain Not Resolving

1. **Check DNS Records**:
   ```bash
   dig yourdomain.com
   nslookup yourdomain.com
   ```

2. **Verify Nameservers**:
   - Ensure nameservers match Route 53 (if using Route 53)
   - Wait 24-48 hours for propagation

3. **Check Registrar Settings**:
   - Ensure domain is unlocked
   - Verify nameservers are correct

### SSL Certificate Issues

1. **Validation Failed**:
   - Verify DNS validation records are correct
   - Wait for DNS propagation
   - Re-request certificate if needed

2. **Certificate Not Attached**:
   - Verify certificate is in same region as ALB
   - Check listener configuration

### Application Not Loading

1. **Check Security Groups**:
   - Ensure HTTPS (443) is allowed
   - Verify HTTP (80) redirects to HTTPS

2. **Check Application Logs**:
   ```bash
   # Elastic Beanstalk
   eb logs

   # ECS
   aws logs tail /ecs/invoice-generator --follow
   ```

---

## 📝 DNS Configuration Examples

### Namecheap DNS Settings

```
Type: CNAME Record
Host: www
Value: your-eb-environment.elasticbeanstalk.com
TTL: Automatic
```

### GoDaddy DNS Settings

```
Type: CNAME
Name: www
Value: your-eb-environment.elasticbeanstalk.com
TTL: 600 seconds
```

### Cloudflare DNS Settings

```
Type: CNAME
Name: www
Target: your-eb-environment.elasticbeanstalk.com
Proxy: DNS only (gray cloud)
TTL: Auto
```

---

## 🔐 Security Recommendations

1. **Enable HTTPS Redirect**:
   - Configure ALB listener rules
   - Redirect HTTP (80) → HTTPS (443)

2. **Use HSTS Headers**:
   ```javascript
   // In next.config.js
   headers: async () => [
     {
       source: '/:path*',
       headers: [
         {
           key: 'Strict-Transport-Security',
           value: 'max-age=31536000; includeSubDomains',
         },
       ],
     },
   ],
   ```

3. **Enable DNSSEC**:
   - Provides additional security
   - Available in Route 53

---

## 📊 Monitoring Domain Health

### Set Up Route 53 Health Checks

```bash
aws route53 create-health-check \
  --caller-reference $(date +%s) \
  --health-check-config '{
    "Type": "HTTPS",
    "ResourcePath": "/",
    "FullyQualifiedDomainName": "yourdomain.com",
    "Port": 443,
    "RequestInterval": 30
  }'
```

---

## ✅ Final Checklist

- [ ] Domain purchased
- [ ] DNS records configured
- [ ] Nameservers updated (if using external registrar)
- [ ] SSL certificate requested and validated
- [ ] Certificate attached to load balancer
- [ ] HTTPS redirect configured
- [ ] NEXTAUTH_URL updated
- [ ] Stripe webhook URL updated
- [ ] Application accessible via domain
- [ ] Payment flow tested
- [ ] Monitoring set up

---

## 🎉 Success!

Your application should now be accessible at:
- **https://yourdomain.com**
- **https://www.yourdomain.com**

---

## 📚 Additional Resources

- [Route 53 Documentation](https://docs.aws.amazon.com/route53/)
- [AWS Certificate Manager Guide](https://docs.aws.amazon.com/acm/)
- [DNS Best Practices](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-best-practices.html)

---

Need help? Check the troubleshooting section or AWS support.
