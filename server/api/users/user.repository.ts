import z from 'zod';
import {  PrismaClient, User } from '@prisma/client';
import dayjs from 'dayjs';
import { createUserSquemaRepository } from '@api/auth/auth.schemas';
import { pagination } from '@shared/libs/helpers';
import { IRead, IWrite } from '@shared/interfaces';
import { injectable, inject } from 'inversify';
import TYPES from './user.types';
import { searchPaginationParamsSchema } from './user.schemas';
import { userSafeSchema } from './dto/user.dto';
import { updateUserInput } from './dto/input-update.user.dto';
type UserDTO = z.infer<typeof userSafeSchema>;
type UpdateUserInput = z.infer<typeof updateUserInput>;
@injectable()
export class UserRepository
  implements
    IWrite<User, z.infer<typeof createUserSquemaRepository>>,
    IRead<UserDTO>
{
  constructor(@inject(TYPES.databaseConnection) private prisma: PrismaClient) {}

  async update(
    id: string,
    element: Partial<UpdateUserInput>
  ): Promise<User | null> {
    return this.prisma.user.update({
      data: {
        ...element,
        updatedAt: dayjs().toDate(),
      },
      where: {
        id,
      },
    });
  }
  async delete(id: string): Promise<User | null> {
    return this.prisma.user.update({
      data: {
        deletedAt: dayjs().toDate(),
      },
      where: {
        id,
      },
    });
  }

  async getById(id: string) {
    return this.prisma.user.findUnique({
      omit: {
        updatedAt: true,
        deletedAt: true,
        createdAt: true,
      },
      where: { id },
    });
  }

  async createManyUsers(params: z.infer<typeof createUserSquemaRepository>[]) {
    const dataWithBirthdayDate = params.map(({ secretKey, ...user }) => ({
      ...user,
      birthDate: dayjs(user.birthDate).toDate(),
      userSecret: secretKey,
    }));

    return await this.prisma.user.createMany({
      data: dataWithBirthdayDate,
    });
  }
  async findUsersByEmail(emails: string[]) {
    return await this.prisma.user.findMany({
      where: {
        email: {
          in: emails,
        },
      },
    });
  }
  async getByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getAll(params: z.infer<typeof searchPaginationParamsSchema>) {
    const { limit, skip } = pagination(params);

    if (params.search) {
      params.search = `%${params.search.replaceAll(' ', '%%')}%`;
    }

    const where = this.getWhereAllUsers(params);

    return await this.prisma.user.findMany({
      select: {
        id: true,
        lastName: true,
        firstName: true,
        birthDate: true,
        email: true,
        role: true,
      },
      skip,
      take: limit,
      where,
    });
  }

  async countAllUsuarios(params: z.infer<typeof searchPaginationParamsSchema>) {
    const where = this.getWhereAllUsers(params);
    return await this.prisma.user.count({ where });
  }

  getWhereAllUsers(params: z.infer<typeof searchPaginationParamsSchema>) {
    let where = {};
    if (params.search) {
      where = {
        OR: [
          {
            email: {
              contains: params.search,
              mode: 'insensitive',
            },
          },
          {
            firstName: {
              contains: params.search,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: params.search,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    return where;
  }

  async create(params: z.infer<typeof createUserSquemaRepository>) {
    return await this.prisma.user.create({
      data: {
        email: params.email,
        password: params.password,
        firstName: params.firstName,
        lastName: params.lastName,
        userSecret: params.secretKey,
        birthDate: dayjs(params.birthDate).toDate(),
      },
    });
  }
}
