import { join } from 'path';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import prompts from 'prompts';
import { prisma } from '../server/config/db';
import dayjs from 'dayjs';

async function main() {
  const seederNamePrompt = await prompts({
    type: 'text',
    name: 'seederName',
    message: 'Nombre del seeder:',
    validate: (name) =>
      name.trim() !== '' ? true : 'El nombre no puede estar vacío',
  });
  const seedPath = join(__dirname, '../seed/');

  if (!existsSync(seedPath)) {
    mkdirSync(seedPath, { recursive: true });
  }

  // mkdirSync(basePath, { recursive: true });

  const seederName = `${(+new Date()).toString(12)}-${seederNamePrompt.seederName.trim().toLowerCase()}`;
  const basePath = join(__dirname, '../seed/seeders');
  const fileName = `${seederName}.ts`;
  const filePath = join(basePath, fileName);
  const content = `${getTemplateSeeder(seederName)}`;
  writeFileSync(filePath, content);
  await prisma.seedHistory.create({
    data: {
      name: seederName,
      status: 'PENDING',
    },
  });

  // for (const file of filesToCreate) {
  //   const fileName = `${moduleName}.${file.name}.ts`;
  //   const filePath = join(basePath, fileName);
  //   const content = `${file.content}`;

  //   writeFileSync(filePath, content);
  // }

  console.log(`✅ Seeder "${seederName}" creado en: seed/${seederName}`);
}

function getTemplateSeeder(name: string) {
  return `



  `;
}

main();
