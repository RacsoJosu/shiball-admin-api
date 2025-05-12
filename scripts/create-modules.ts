import { join } from 'path';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import prompts from 'prompts';

async function main() {
  const response = await prompts({
    type: 'text',
    name: 'moduleName',
    message: 'Nombre del módulo:',
    validate: (name) =>
      name.trim() !== '' ? true : 'El nombre no puede estar vacío',
  });

  const moduleName = response.moduleName.trim().toLowerCase();
  const basePath = join(__dirname, '../server/api', moduleName);
  const containerPath = join(
    __dirname,
    '../server/api/containers/bindings/bindings.ts'
  );

  if (existsSync(basePath)) {
    console.error(`❌ El módulo "${moduleName}" ya existe.`);
    return;
  }

  const files = [
    { name: 'schemas', content: schemaTemplate(moduleName) },
    { name: 'service', content: serviceTemplate(moduleName) },
    { name: 'controller', content: controllerTemplate(moduleName) },
    { name: 'router', content: routerTemplate(moduleName) },
    { name: 'repository', content: repositoryTemplate(moduleName) },
    { name: 'types', content: typesTemplate(moduleName) },
  ];
  let filesToCreate = [...files];

  const { createAll: confirmCreateAll } = await prompts({
    type: 'confirm',
    name: 'createAll',
    message:
      '¿Quieres crear todos los archivos (schema, service, controller, etc.)?',
    initial: true,
  });

  mkdirSync(basePath, { recursive: true });
  if (!confirmCreateAll) {
    const { filesSelected } = await prompts({
      type: 'multiselect',
      name: 'filesSelected',
      message: '¿Selecciona los archivos que quieres crear?',
      choices: files.map((item) => ({
        title: item.name,
        value: item.name,
        selected: item.name === 'router',
      })),
    });

    const options = new Set(filesSelected);
    filesToCreate = files.filter((file) => options.has(file.name));
  }
  for (const file of filesToCreate) {
    const fileName = `${moduleName}.${file.name}.ts`;
    const filePath = join(basePath, fileName);
    const content = `${file.content}`;

    writeFileSync(filePath, content);
  }

  console.log(`✅ Módulo "${moduleName}" creado en: api/${moduleName}`);
}
function injectBindingsInContainer(containerPath: string, name: string) {
  const content = readFileSync(containerPath, 'utf-8');
  const lines = content.split('\r\n');

  lines.forEach((line) => {
    console.log(line);
  });
}
function toPascalCase(str: string) {
  return str.replace(/(^\w|-\w)/g, (match) =>
    match.replace('-', '').toUpperCase()
  );
}
function schemaTemplate(name: string) {
  const pascal = toPascalCase(name);
  return `
// ${name}.schema.ts
import { z } from 'zod';

export const input${pascal}CreateSchema = z.object({
  id: z.string(),
});
`.trimStart();
}

function serviceTemplate(name: string) {
  const pascal = toPascalCase(name);
  return `
// ${name}.service.ts
import z from 'zod';
import { ${pascal} } from '@prisma/client';
import { ApiError } from '../../middlewares/statusCode';
import { pagination } from '../../shared/libs/helpers';
import { ${pascal}Repository } from './${name}.repository';
import TYPES_${pascal.toUpperCase()} from './${name}.types';
import { inject, injectable } from 'inversify';
@injectable()
export class ${pascal}Service {
constructor(
    @inject(TYPES_${pascal.toUpperCase()}.${pascal}Repository)
    private readonly ${name}Repository: ${pascal}Repository
  ) {}
  async findAll() {
    // Implementación aquí
    return [];
  }
}
`.trimStart();
}

function controllerTemplate(name: string) {
  const pascal = toPascalCase(name);
  return `
// ${name}.controller.ts
import { Request, Response } from 'express';
import { ${pascal}Service } from './${name.toLowerCase()}.service';
import { searchPaginationParamsSchema } from '../../shared/schemas';
import { inject, injectable } from 'inversify';
import TYPES_${pascal.toUpperCase()} from './${name.toLowerCase()}.types';

@injectable()
export class ${pascal}Controller {
  constructor(
    @inject(TYPES_${pascal.toUpperCase()}.${pascal}Service) private readonly ${name.toLowerCase()}Service: ${pascal}Service
  ) {
    console.log('Controller initialized, ${pascal}Service:', !!${name.toLowerCase()}Service);
  }

  async getAll${pascal}(req: Request, res: Response) {
    // implementar get All

    res.status(200).json({
      message: 'Lista de usuarios',
      title: 'Usuarios obtenidos',
      data:null,
    });
  }
}

`.trimStart();
}

function typesTemplate(name: string) {
  const pascal = toPascalCase(name);
  return `
// ${name}.types.ts
const TYPES_${pascal.toUpperCase()} = {
  ${pascal}Controller: Symbol.for('${pascal}Controller'),
  ${pascal}Service: Symbol.for('${pascal}Service'),
  ${pascal}Repository: Symbol.for('${pascal}Repository'),
  databaseConnection: Symbol.for('DataBaseConnection')
};

export default TYPES_${pascal.toUpperCase()};
`.trimStart();
}

function routerTemplate(name: string) {
  const pascal = toPascalCase(name);
  return `
// ${name}.router.ts
import express from 'express';
import { ${pascal}Controller } from './${name}.controller';
import TYPES_${pascal.toUpperCase()} from './${name}.types';
import container from '../containers/container';
import { authGuard } from '../../middlewares/auth';

const ${name}Controller = container.get<${pascal}Controller>(TYPES_${pascal.toUpperCase()}.${pascal}Controller);
const router = express.Router();

router.get('/', authGuard, ${name}Controller.getAll${pascal}.bind(${name}Controller));

export default router;
`.trimStart();
}

function repositoryTemplate(name: string) {
  const pascal = toPascalCase(name);
  return `
// ${name}.repository.ts

import z from 'zod';
import { PrismaClient, ${pascal} } from '@prisma/client';
import { injectable, inject } from 'inversify';
import TYPES_COMMON from '../../types/common.types';
import { input${pascal}CreateSchema } from './${name}.schemas';
import { IRead, IWrite } from '../../shared/interfaces';
import { pagination } from '../../shared/libs/helpers';
import { searchPaginationParamsSchema } from '../../shared/schemas';
import dayjs from 'dayjs';

type ${pascal}DTO = z.infer<typeof input${pascal}CreateSchema>;
type ${pascal}UpdateInput = Partial<${pascal}DTO>;
@injectable()
export class ${pascal}Repository
  implements
    IWrite<${pascal}, ${pascal}DTO,${pascal}["id"]>,
    IRead<${pascal}DTO, ${pascal}["id"]>
{
  constructor(
    @inject(TYPES_COMMON.databaseConnection) private readonly prisma: PrismaClient
  ) {}

  async create(element:${pascal}DTO): Promise<${pascal} | null> {
    return this.prisma.${name}.create({data: { ...element, createdAt: dayjs().toDate(),updatedAt: dayjs().toDate(), },})
  }
  async update(
    id: ${pascal}["id"],
    element:${pascal}UpdateInput
  ): Promise<${pascal} | null> {
    return this.prisma.${name}.update({
          data: {
            ...element,
            updatedAt: dayjs().toDate(),
          },
          where: {
            id,
          },
        });
  }
  async delete(id: ${pascal}["id"]): Promise<${pascal} | null> {
     return this.prisma.${name}.update({
          data: {
            deletedAt: dayjs().toDate(),
          },
          where: {
            id,
          },
        });
  }

  async getAll(params: z.infer<typeof searchPaginationParamsSchema>) {
      const { limit: take, skip } = pagination(params);

      if (params.search) {
        params.search = %{params.search.replaceAll(' ', '%%')}%;
      }

      const where = this.getWhereAll${pascal}(params);
      return this.prisma.${name}.findMany({
        take,
        skip,
        where,
      });
    }

   async countAll${pascal}(params: z.infer<typeof searchPaginationParamsSchema>) {
      const where = this.getWhereAll${pascal}(params);
      return await this.prisma.${name}.count({ where });
    }

     getWhereAll${pascal}(params: z.infer<typeof searchPaginationParamsSchema>) {
        let where = {};
        if (params.search) {
          where = {
            OR: [
              {
                id: {
                  contains: params.search,
                  mode: 'insensitive',
                },
              }
            ],
          };
        }

        return where;
      }
  async getById(id: ${pascal}["id"]) {
    return this.prisma.${name}.findUnique({
      omit: {
        updatedAt: true,
        deletedAt: true,
        createdAt: true,
      },
      where: { id },
    });
  }


}



`.trimStart();
}

main();
