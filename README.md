# 💼 Invoice Generator - Complete SaaS Solution

A full-featured invoice management system with payment processing, built with Next.js, Prisma, and Stripe.

## ✨ Features

- ✅ **Invoice Management** - Create, edit, and manage invoices
- ✅ **Customer Management** - Store and manage customer information
- ✅ **PDF Generation** - Download invoices as PDF
- ✅ **Payment Processing** - Accept payments via Stripe Checkout
- ✅ **Payment Tracking** - Track all payments and payment history
- ✅ **User Authentication** - Secure login and registration
- ✅ **Responsive Design** - Works on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL (for production) or SQLite (for development)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
npm run db:push
npm run db:generate

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see your application.

## 📚 Documentation

### Setup & Deployment
- **[QUICK_START_AWS.md](./QUICK_START_AWS.md)** - Deploy to AWS in 30 minutes
- **[AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md)** - Complete AWS deployment guide
- **[DOMAIN_SETUP.md](./DOMAIN_SETUP.md)** - Configure custom .com domain
- **[PAYMENT_SETUP.md](./PAYMENT_SETUP.md)** - Stripe payment integration
- **[ENV_VARIABLES.md](./ENV_VARIABLES.md)** - Environment variables reference

### Previous Guides
- **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Local development setup
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - General deployment options

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Push schema to database
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio
npm run db:migrate   # Create migration
npm run db:migrate:deploy  # Deploy migrations (production)

# Utilities
npm run setup:check  # Verify setup configuration
npm run lint         # Run ESLint
```

## 🔐 Environment Variables

See **[ENV_VARIABLES.md](./ENV_VARIABLES.md)** for complete list.

**Required:**
- `DATABASE_URL` - Database connection string
- `NEXTAUTH_SECRET` - NextAuth secret key
- `NEXTAUTH_URL` - Application URL

**For Payments:**
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

## 💳 Payment Integration

This application uses Stripe for payment processing. See **[PAYMENT_SETUP.md](./PAYMENT_SETUP.md)** for setup instructions.

### Test Cards

Use these cards in Stripe test mode:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

## ☁️ Deployment

### AWS (Recommended)

Follow **[QUICK_START_AWS.md](./QUICK_START_AWS.md)** for fastest deployment.

**Options:**
- AWS Elastic Beanstalk (easiest)
- AWS ECS/Fargate (scalable)
- AWS Amplify (serverless)

### Other Platforms

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for:
- Vercel
- Railway
- Render
- Docker

## 🌐 Custom Domain

Configure your .com domain following **[DOMAIN_SETUP.md](./DOMAIN_SETUP.md)**.

## 🗄️ Database

### Development (SQLite)
- Uses local SQLite database
- No setup required
- File: `prisma/dev.db`

### Production (PostgreSQL)
- Use AWS RDS or other PostgreSQL provider
- Switch schema: `node scripts/prepare-production.js`
- Run migrations: `npm run db:migrate:deploy`

## 📁 Project Structure

```
invoice-generator/
├── src/
│   ├── app/              # Next.js app router
│   │   ├── api/          # API routes
│   │   │   ├── payments/ # Payment endpoints
│   │   │   └── invoices/ # Invoice endpoints
│   │   └── dashboard/   # Dashboard pages
│   ├── components/       # React components
│   │   ├── payment/      # Payment components
│   │   └── ui/           # UI components
│   └── lib/              # Utilities
├── prisma/
│   ├── schema.prisma     # Database schema (SQLite)
│   └── schema.postgresql.prisma  # PostgreSQL schema
├── scripts/              # Utility scripts
├── AWS_DEPLOYMENT.md     # AWS deployment guide
├── DOMAIN_SETUP.md       # Domain configuration
├── PAYMENT_SETUP.md      # Payment setup guide
└── README.md             # This file
```

## 🧪 Testing Setup

```bash
# Verify setup
npm run setup:check

# Test payment flow locally
# 1. Start dev server: npm run dev
# 2. Create invoice
# 3. Click "Pay Invoice"
# 4. Use Stripe test card
```

## 🐛 Troubleshooting

### Payment Issues
See **[PAYMENT_SETUP.md](./PAYMENT_SETUP.md)** → Troubleshooting

### Deployment Issues
See **[AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md)** → Troubleshooting

### Database Issues
```bash
# Reset database (development)
npm run db:reset

# Regenerate Prisma client
npm run db:generate
```

## 📊 Tech Stack

- **Framework**: Next.js 14
- **Database**: Prisma (SQLite/PostgreSQL)
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **PDF**: PDFKit

## 🔒 Security

- Environment variables for secrets
- Secure password hashing (bcrypt)
- JWT-based authentication
- Stripe webhook signature verification
- HTTPS required for production

## 📝 License

Private - All rights reserved

## 🤝 Support

For issues and questions:
1. Check documentation files
2. Review troubleshooting sections
3. Check application logs

## 🎉 Ready to Deploy?

1. **Quick Start**: Follow **[QUICK_START_AWS.md](./QUICK_START_AWS.md)**
2. **Detailed Guide**: See **[AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md)**
3. **Domain Setup**: Follow **[DOMAIN_SETUP.md](./DOMAIN_SETUP.md)**

---

**Built with ❤️ using Next.js, Prisma, and Stripe**
