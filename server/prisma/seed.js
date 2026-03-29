import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create Users
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('password123', salt);

  const users = [
    { username: 'john_doe', firstname: 'John', lastname: 'Doe', email: 'john@example.com', password },
    { username: 'jane_smith', firstname: 'Jane', lastname: 'Smith', email: 'jane@example.com', password },
    { username: 'abebe_b', firstname: 'Abebe', lastname: 'Bikila', email: 'abebe@example.com', password },
    { username: 'sara_t', firstname: 'Sara', lastname: 'Tadesse', email: 'sara@example.com', password },
    { username: 'mike_r', firstname: 'Mike', lastname: 'Ross', email: 'mike@example.com', password },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  const allUsers = await prisma.user.findMany();
  console.log(`Created ${allUsers.length} users`);

  // Create Questions
  const questions = [
    { title: 'How to use React 19?', description: 'I am trying to use the new features in React 19 but I am stuck.', tag: 'React', userid: allUsers[0].userid },
    { title: 'Prisma vs TypeORM', description: 'Which one is better for a large scale Express application?', tag: 'Database', userid: allUsers[1].userid },
    { title: 'Node.js Performance Tuning', description: 'What are the best practices for tuning Node.js performance?', tag: 'NodeJS', userid: allUsers[2].userid },
    { title: 'CSS Grid vs Flexbox', description: 'When should I use Grid over Flexbox for layout?', tag: 'CSS', userid: allUsers[3].userid },
    { title: 'JWT Authentication best practices', description: 'What are the security considerations for JWT?', tag: 'Security', userid: allUsers[4].userid },
  ];

  for (const q of questions) {
    await prisma.question.create({
      data: q,
    });
  }

  const allQuestions = await prisma.question.findMany();
  console.log(`Created ${allQuestions.length} questions`);

  // Create Answers
  const answers = [
    { answer: 'React 19 introduces several new hooks like useActionState and useFormStatus.', userid: allUsers[1].userid, questionid: allQuestions[0].questionid },
    { answer: 'Prisma is generally easier to use and more modern, but TypeORM has been around longer.', userid: allUsers[0].userid, questionid: allQuestions[1].questionid },
    { answer: 'Always use the latest stable version of Node.js and monitor memory usage.', userid: allUsers[3].userid, questionid: allQuestions[2].questionid },
    { answer: 'Use Flexbox for 1D layouts and Grid for 2D layouts.', userid: allUsers[2].userid, questionid: allQuestions[3].questionid },
    { answer: 'Store tokens in HttpOnly cookies to prevent XSS attacks.', userid: allUsers[0].userid, questionid: allQuestions[4].questionid },
  ];

  for (const a of answers) {
    await prisma.answer.create({
      data: a,
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
