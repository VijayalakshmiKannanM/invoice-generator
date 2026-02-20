#!/bin/bash

# AWS Deployment Script for Invoice Generator
# This script deploys the application to AWS Elastic Beanstalk

set -e

echo "🚀 Starting AWS Deployment..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if EB CLI is installed
if ! command -v eb &> /dev/null; then
    echo "❌ Elastic Beanstalk CLI is not installed."
    echo "Install it with: pip install awsebcli"
    exit 1
fi

# Build the application
echo "📦 Building application..."
npm run build

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npm run db:generate

# Initialize EB if not already done
if [ ! -d ".elasticbeanstalk" ]; then
    echo "🔧 Initializing Elastic Beanstalk..."
    eb init invoice-generator --platform node.js --region us-east-1
fi

# Create environment if it doesn't exist
if ! eb list | grep -q "invoice-generator-env"; then
    echo "🌱 Creating Elastic Beanstalk environment..."
    eb create invoice-generator-env \
        --instance-type t3.small \
        --envvars NODE_ENV=production
fi

# Deploy
echo "🚀 Deploying to AWS..."
eb deploy

echo "✅ Deployment complete!"
echo "🌐 Your application URL:"
eb status | grep "CNAME"
