import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const defaultCategories = [
  { name: 'JavaScript & React', description: 'Discuss all things frontend, including React, Vue, JS, and CSS.' },
  { name: 'Node.js & Backend', description: 'Server-side development, databases, and APIs.' },
  { name: 'Career & Networking', description: 'Job hunting, interview prep, and networking.' },
  { name: 'General Tech Discussions', description: 'Open topic discussions for emerging tech and general chat.' },
];

async function main() {
  console.log('Counting existing categories...');
  const count = await prisma.category.count();
  if (count === 0) {
    console.log('Seeding default categories...');
    for (const cat of defaultCategories) {
      await prisma.category.create({ data: cat });
    }
    console.log('Seed completed successfully!');
  } else {
    console.log('Categories already exist. Skipping seed.');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
