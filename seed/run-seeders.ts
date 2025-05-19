import { spawnSync } from 'child_process';
import { join } from 'path';
import { prisma } from '../server/config/db';
import { existsSync, mkdirSync, readdirSync } from 'fs';

class Seeder {
  static async run() {
    const seedersPath = join(__dirname, '../seed/seeders');
    if (!existsSync(seedersPath)) {
      mkdirSync(seedersPath, { recursive: true });
    }
    const dataSeeders = readdirSync(seedersPath);

    if (dataSeeders.length === 0) {
      console.log(`✅ No hay Seeders por ejecutar`);
      return;
    }

    const arraySeeder = dataSeeders.map((seeder) => seeder.split('.')[0] ?? '');

    const seedersData = await prisma.seedHistory.findMany({
      where: {
        AND: {
          name: {
            in: arraySeeder,
          },
          excuteDateAt: null,
        },
      },
    });
    const seederFullPath = join(seedersPath, `${seedersData[0]?.name}.ts`);
    spawnSync(`pnpm tsx  ${seederFullPath}`, { shell: false });
  }
}

Seeder.run();
