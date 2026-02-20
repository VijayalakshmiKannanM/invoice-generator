#!/usr/bin/env node

/**
 * Setup Verification Script
 * Checks if all required environment variables and configurations are set
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Invoice Generator Setup...\n');

let hasErrors = false;
let hasWarnings = false;

// Check .env file
const envPath = path.join(process.cwd(), '.env');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('⚠️  Warning: .env file not found');
  console.log('   Create .env file with required variables\n');
  hasWarnings = true;
} else {
  console.log('✅ .env file exists');
  
  // Read and check env variables
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const requiredVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ];
  
  const optionalVars = [
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  ];
  
  console.log('\n📋 Required Environment Variables:');
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`   ✅ ${varName}`);
    } else {
      console.log(`   ❌ ${varName} - MISSING`);
      hasErrors = true;
    }
  });
  
  console.log('\n💳 Payment Variables (Optional):');
  optionalVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`   ✅ ${varName}`);
    } else {
      console.log(`   ⚠️  ${varName} - Not set (payment features won't work)`);
      hasWarnings = true;
    }
  });
}

// Check Prisma schema
const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
const schemaExists = fs.existsSync(schemaPath);

if (schemaExists) {
  console.log('\n✅ Prisma schema exists');
  
  const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
  
  if (schemaContent.includes('model Payment')) {
    console.log('   ✅ Payment model found');
  } else {
    console.log('   ❌ Payment model missing');
    hasErrors = true;
  }
  
  if (schemaContent.includes('stripePaymentIntentId')) {
    console.log('   ✅ Stripe payment tracking configured');
  } else {
    console.log('   ❌ Stripe payment tracking not configured');
    hasErrors = true;
  }
} else {
  console.log('\n❌ Prisma schema not found');
  hasErrors = true;
}

// Check payment API routes
const paymentRoutes = [
  'src/app/api/payments/create-intent/route.ts',
  'src/app/api/payments/webhook/route.ts',
];

console.log('\n🔌 Payment API Routes:');
paymentRoutes.forEach(route => {
  const routePath = path.join(process.cwd(), route);
  if (fs.existsSync(routePath)) {
    console.log(`   ✅ ${route}`);
  } else {
    console.log(`   ❌ ${route} - MISSING`);
    hasErrors = true;
  }
});

// Check payment component
const paymentComponent = path.join(process.cwd(), 'src/components/payment/PaymentButton.tsx');
if (fs.existsSync(paymentComponent)) {
  console.log('\n✅ PaymentButton component exists');
} else {
  console.log('\n❌ PaymentButton component missing');
  hasErrors = true;
}

// Check node_modules
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('\n✅ node_modules exists');
  
  // Check Stripe packages
  const stripePath = path.join(nodeModulesPath, 'stripe');
  const stripeJsPath = path.join(nodeModulesPath, '@stripe', 'stripe-js');
  
  if (fs.existsSync(stripePath)) {
    console.log('   ✅ stripe package installed');
  } else {
    console.log('   ❌ stripe package missing - run: npm install');
    hasErrors = true;
  }
  
  if (fs.existsSync(stripeJsPath)) {
    console.log('   ✅ @stripe/stripe-js package installed');
  } else {
    console.log('   ❌ @stripe/stripe-js package missing - run: npm install');
    hasErrors = true;
  }
} else {
  console.log('\n❌ node_modules not found - run: npm install');
  hasErrors = true;
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Setup incomplete - Please fix the errors above');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Setup complete with warnings - Check above for details');
  process.exit(0);
} else {
  console.log('✅ Setup looks good! Ready to deploy.');
  console.log('\n📚 Next steps:');
  console.log('   1. Set up Stripe account and get API keys');
  console.log('   2. Configure webhook endpoint');
  console.log('   3. Deploy to AWS (see AWS_DEPLOYMENT.md)');
  console.log('   4. Set up domain (see DOMAIN_SETUP.md)');
  process.exit(0);
}
