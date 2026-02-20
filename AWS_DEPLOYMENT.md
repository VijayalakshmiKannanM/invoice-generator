# 🚀 AWS Deployment Guide - Invoice Generator

Complete guide to deploy your Invoice Generator application to AWS with a custom .com domain.

---

## 📋 Prerequisites

- AWS Account
- AWS CLI installed and configured
- Domain name (.com) ready to use
- Stripe account for payments

---

## 🏗️ Deployment Options

### Option 1: AWS Elastic Beanstalk (Easiest)

**Best for**: Quick deployment, managed infrastructure

#### Step 1: Install EB CLI

```bash
# Install Python if not installed
pip install awsebcli

# Verify installation
eb --version
```

#### Step 2: Configure AWS Credentials

```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter region: us-east-1 (or your preferred region)
# Enter output format: json
```

#### Step 3: Initialize Elastic Beanstalk

```bash
cd invoice-generator
eb init invoice-generator --platform node.js --region us-east-1
```

#### Step 4: Create Environment

```bash
eb create invoice-generator-env \
  --instance-type t3.small \
  --envvars NODE_ENV=production
```

#### Step 5: Set Environment Variables

```bash
eb setenv \
  DATABASE_URL="your-postgresql-connection-string" \
  NEXTAUTH_SECRET="your-nextauth-secret" \
  NEXTAUTH_URL="https://your-domain.com" \
  STRIPE_SECRET_KEY="sk_live_..." \
  STRIPE_PUBLISHABLE_KEY="pk_live_..." \
  STRIPE_WEBHOOK_SECRET="whsec_..." \
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
```

#### Step 6: Deploy

```bash
npm run build
eb deploy
```

---

### Option 2: AWS ECS with Fargate (Scalable)

**Best for**: Production workloads, auto-scaling

#### Step 1: Set Up ECR (Elastic Container Registry)

```bash
# Create ECR repository
aws ecr create-repository --repository-name invoice-generator --region us-east-1

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build and push Docker image
docker build -t invoice-generator .
docker tag invoice-generator:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/invoice-generator:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/invoice-generator:latest
```

#### Step 2: Create RDS PostgreSQL Database

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier invoice-generator-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password YOUR_PASSWORD \
  --allocated-storage 20 \
  --region us-east-1
```

#### Step 3: Create ECS Cluster

```bash
# Create cluster
aws ecs create-cluster --cluster-name invoice-generator-cluster --region us-east-1

# Create task definition (use aws-ecs-task-definition.json)
aws ecs register-task-definition --cli-input-json file://aws-ecs-task-definition.json

# Create service
aws ecs create-service \
  --cluster invoice-generator-cluster \
  --service-name invoice-generator-service \
  --task-definition invoice-generator \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

---

### Option 3: AWS Amplify (Serverless)

**Best for**: Next.js applications, CI/CD integration

#### Step 1: Install Amplify CLI

```bash
npm install -g @aws-amplify/cli
amplify configure
```

#### Step 2: Initialize Amplify

```bash
amplify init
# Follow prompts:
# - Project name: invoice-generator
# - Environment: production
# - Default editor: VS Code
# - App type: javascript
# - Framework: react
# - Source directory: src
# - Distribution directory: .next
# - Build command: npm run build
# - Start command: npm start
```

#### Step 3: Add Hosting

```bash
amplify add hosting
# Select: Hosting with Amplify Console
# Select: Manual deployment
```

#### Step 4: Add Environment Variables

In AWS Amplify Console:
1. Go to your app → Environment variables
2. Add:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

#### Step 5: Deploy

```bash
amplify publish
```

---

## 🌐 Setting Up Custom Domain (.com)

### Step 1: Purchase Domain

- AWS Route 53
- Namecheap
- GoDaddy
- Google Domains

### Step 2: Configure DNS

#### For Elastic Beanstalk:

1. **Get your EB environment URL**:
   ```bash
   eb status
   # Copy the CNAME
   ```

2. **Create Route 53 Hosted Zone**:
   ```bash
   aws route53 create-hosted-zone --name yourdomain.com --caller-reference $(date +%s)
   ```

3. **Create CNAME Record**:
   - Type: CNAME
   - Name: www (or @ for root domain)
   - Value: your-eb-environment.elasticbeanstalk.com
   - TTL: 300

4. **Update Name Servers**:
   - Copy nameservers from Route 53
   - Update at your domain registrar

#### For ECS/ALB:

1. **Create Application Load Balancer**:
   ```bash
   aws elbv2 create-load-balancer \
     --name invoice-generator-alb \
     --subnets subnet-xxx subnet-yyy \
     --security-groups sg-xxx
   ```

2. **Create Target Group**:
   ```bash
   aws elbv2 create-target-group \
     --name invoice-generator-tg \
     --protocol HTTP \
     --port 3000 \
     --vpc-id vpc-xxx \
     --target-type ip
   ```

3. **Create Route 53 Record**:
   - Type: A (Alias)
   - Name: yourdomain.com
   - Alias Target: Your ALB DNS name

#### For Amplify:

1. **In Amplify Console**:
   - Go to App Settings → Domain Management
   - Click "Add domain"
   - Enter your domain name
   - Follow DNS configuration instructions

---

## 🔐 Setting Up Stripe Webhooks

### Step 1: Get Webhook Endpoint URL

- Elastic Beanstalk: `https://yourdomain.com/api/payments/webhook`
- ECS: `https://yourdomain.com/api/payments/webhook`
- Amplify: `https://yourdomain.com/api/payments/webhook`

### Step 2: Configure in Stripe Dashboard

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter your webhook URL
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret
6. Add to environment variables: `STRIPE_WEBHOOK_SECRET`

---

## 🗄️ Database Setup

### Option A: AWS RDS PostgreSQL

```bash
aws rds create-db-instance \
  --db-instance-identifier invoice-generator-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --master-username admin \
  --master-user-password YOUR_SECURE_PASSWORD \
  --allocated-storage 20 \
  --storage-type gp3 \
  --vpc-security-group-ids sg-xxx \
  --db-subnet-group-name default \
  --backup-retention-period 7 \
  --region us-east-1
```

### Option B: AWS RDS Proxy (Recommended for Serverless)

```bash
aws rds create-db-proxy \
  --db-proxy-name invoice-generator-proxy \
  --engine-family POSTGRESQL \
  --auth SecretArn=arn:aws:secretsmanager:... \
  --role-arn arn:aws:iam::ACCOUNT_ID:role/rds-proxy-role \
  --vpc-subnet-ids subnet-xxx subnet-yyy \
  --targets TargetGroupName=invoice-generator-tg
```

### Run Migrations

```bash
# SSH into your instance or use AWS Systems Manager
DATABASE_URL="your-rds-connection-string" npx prisma migrate deploy
```

---

## 📝 Environment Variables Checklist

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# NextAuth
NEXTAUTH_SECRET=your-32-character-secret
NEXTAUTH_URL=https://yourdomain.com

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Node
NODE_ENV=production
PORT=3000
```

---

## 🔒 Security Best Practices

1. **Use AWS Secrets Manager**:
   ```bash
   aws secretsmanager create-secret \
     --name invoice-generator/database-url \
     --secret-string "postgresql://..."
   ```

2. **Enable HTTPS**:
   - Use AWS Certificate Manager (ACM)
   - Request SSL certificate for your domain
   - Attach to ALB or CloudFront

3. **Set Up WAF**:
   - Protect against common attacks
   - Rate limiting
   - IP filtering

4. **Enable CloudWatch Logs**:
   - Monitor application logs
   - Set up alarms

---

## 📊 Monitoring & Logging

### CloudWatch Setup

```bash
# Create log group
aws logs create-log-group --log-group-name /aws/ecs/invoice-generator

# Set retention
aws logs put-retention-policy \
  --log-group-name /aws/ecs/invoice-generator \
  --retention-in-days 30
```

### Set Up Alarms

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name invoice-generator-high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

---

## 🚀 Quick Deploy Script

Use the provided `aws-deploy.sh` script:

```bash
chmod +x aws-deploy.sh
./aws-deploy.sh
```

---

## 🐛 Troubleshooting

### Common Issues:

1. **Database Connection Failed**:
   - Check security groups allow inbound PostgreSQL (5432)
   - Verify DATABASE_URL is correct
   - Check RDS is publicly accessible (or use RDS Proxy)

2. **Webhook Not Working**:
   - Verify webhook URL is accessible
   - Check STRIPE_WEBHOOK_SECRET matches Stripe dashboard
   - Review CloudWatch logs

3. **Domain Not Resolving**:
   - Verify DNS records are correct
   - Check nameservers are updated
   - Wait for DNS propagation (up to 48 hours)

---

## 📚 Additional Resources

- [AWS Elastic Beanstalk Documentation](https://docs.aws.amazon.com/elasticbeanstalk/)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Route 53 Documentation](https://docs.aws.amazon.com/route53/)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)

---

## ✅ Post-Deployment Checklist

- [ ] Application accessible via custom domain
- [ ] HTTPS enabled (SSL certificate)
- [ ] Database migrations run
- [ ] Environment variables configured
- [ ] Stripe webhooks working
- [ ] Payment flow tested
- [ ] Monitoring and alerts set up
- [ ] Backups configured
- [ ] Security groups configured correctly

---

Happy Deploying! 🚀
