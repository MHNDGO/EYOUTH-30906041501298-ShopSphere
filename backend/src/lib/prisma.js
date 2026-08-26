const { PrismaClient } = require('@prisma/client');

// In serverless environments (Vercel), each cold start would otherwise create a new
// PrismaClient and a new DB connection. Caching on `global` lets warm invocations reuse
// the same client/connection instead of exhausting Supabase's connection limit.
const globalForPrisma = global;

const prisma = globalForPrisma.__prisma || new PrismaClient();
globalForPrisma.__prisma = prisma;

module.exports = prisma;
