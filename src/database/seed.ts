import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { seedDatabase } from './seed-database.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

const pool = new Pool({ connectionString });
const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

try {
  await seedDatabase(prisma);
  console.log('Database seeded');
} catch (error) {
  console.error('Database seed failed', error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
  await pool.end();
}
