import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

const runSeeder = async (seederName: string, seederFunction: Function) => {
  const seedExists = await prisma.seedHistory.findFirst({
    where: { name: seederName },
  });

  if (seedExists) {
    console.log(`${seederName} has already been executed.`);
    return;
  }

  console.log(`Running ${seederName}...`);
  await seederFunction();

  await prisma.seedHistory.create({
    data: {
      name: seederName,
      excuteDateAt: dayjs().format('YYYY-MM-DD hh:mm:ss'),
    },
  });

  console.log(`${seederName} executed successfully.`);
};

// const runAllSeeders = async () => {
//   const seeders = [
//     { name: '001_roles', function: seedRoles },
//     { name: '002_users', function: seedUsers },
//   ];

//   for (const seeder of seeders) {
//     await runSeeder(seeder.name, seeder.function);
//   }

//   console.log('All seeders executed.');
// };

// const runSeeders = async () => {
//   await runAllSeeders();
//   await prisma.$disconnect();
// };

// runSeeders().catch((error) => {
//   console.error(error);
//   prisma.$disconnect();
// });
