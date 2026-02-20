#!/usr/bin/env node

/**
 * Production Preparation Script
 * Switches Prisma schema from SQLite to PostgreSQL for production deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing for Production Deployment...\n');

const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
const postgresqlSchemaPath = path.join(process.cwd(), 'prisma', 'schema.postgresql.prisma');

// Check if PostgreSQL schema exists
if (!fs.existsSync(postgresqlSchemaPath)) {
  console.log('❌ PostgreSQL schema template not found!');
  console.log('   Expected: prisma/schema.postgresql.prisma');
  process.exit(1);
}

// Backup current schema
const backupPath = path.join(process.cwd(), 'prisma', 'schema.sqlite.backup.prisma');
if (fs.existsSync(schemaPath)) {
  fs.copyFileSync(schemaPath, backupPath);
  console.log('✅ Backed up current schema to schema.sqlite.backup.prisma');
}

// Copy PostgreSQL schema
fs.copyFileSync(postgresqlSchemaPath, schemaPath);
console.log('✅ Switched to PostgreSQL schema');

console.log('\n📋 Next Steps:');
console.log('   1. Update DATABASE_URL in environment variables');
console.log('   2. Run: npm run db:generate');
console.log('   3. Run: npm run db:migrate:deploy');
console.log('   4. Deploy to AWS');
console.log('\n💡 To revert: cp prisma/schema.sqlite.backup.prisma prisma/schema.prisma');
