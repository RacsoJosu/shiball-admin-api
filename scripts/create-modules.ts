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
  mkdirSync(basePath, { recursive: true });
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

export const create${pascal}SquemaRepository = z.object({
  id: z.string(),
});


export const ${name}SafeSchema = create${pascal}SquemaRepository
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
import { ${name}SafeSchema, create${pascal}SquemaRepository } from './${name}.schemas';
import { IRead, IWrite } from '../../shared/interfaces';
import { pagination } from '../../shared/libs/helpers';
import { searchPaginationParamsSchema } from '../../shared/schemas';
type ${pascal}DTO = z.infer<typeof ${name}SafeSchema>;
@injectable()
export class ${pascal}Repository
  implements
    IWrite<${pascal}, z.infer<typeof create${pascal}SquemaRepository>>,
    IRead<${pascal}DTO>
{
  constructor(
    @inject(TYPES_COMMON.databaseConnection) private readonly prisma: PrismaClient
  ) {}

  create(element: { id: string }): Promise<{
    name: string;
    id: bigint;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  } | null> {
    throw new Error('Method not implemented.');
  }
  update(
    id: string,
    element: Partial<{ id: string }>
  ): Promise<{
    name: string;
    id: bigint;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  } | null> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<{
    name: string;
    id: bigint;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  } | null> {
    throw new Error('Method not implemented.');
  }
  getAll({
    search,
    limit,
    page,
  }: {
    search?: string;
    limit?: number;
    page?: number;
  }): Promise<Partial<{ id: string }>[]> {
    throw new Error('Method not implemented.');
  }
  getById(id: string): Promise<{ id: string } | null> {
    throw new Error('Method not implemented.');
  }
  getByEmail(email: string): Promise<{ id: string } | null> {
    throw new Error('Method not implemented.');
  }

}



`.trimStart();
}

main();
