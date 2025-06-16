import z from 'zod';
import {
  comparePasswordAsync,
  genSecretKeyUser,
  hashPasswordSync,
} from '../../shared/libs/bcrypt';
import { ApiError } from '../../middlewares/statusCode';
import { signJwtUser } from '../../shared/libs/jwt';
import { User } from '@prisma/client';
import { loginUserSchema, registerUserSchema } from '../auth/auth.schemas';
import { pagination } from '../../shared/libs/helpers';
import { UserRepository } from './user.repository';
import { inject, injectable } from 'inversify';
import TYPES from './user.types';
import { idUSerSchema, searchPaginationParamsSchema } from './user.schemas';
import { updateUserInput } from './dto/input-update.user.dto';
import dayjs from 'dayjs';

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  async getById(params: z.infer<typeof idUSerSchema>) {
    const user = await this.userRepository.getById(params.idUser);
    if (!user) {
      throw new ApiError({
        title: 'El usuario no existe',
        details: `El usuario con id ${params.idUser} no esta registrado.`,
        statusCode: 404,
        success: false,
      });
    }

    const { password, userSecret, ...restData } = user;
    return restData;
  }

  async updateUser(
    params: z.infer<typeof idUSerSchema>,
    body: z.infer<typeof updateUserInput>
  ) {
    const user = await this.userRepository.getById(params.idUser);
    if (!user) {
      throw new ApiError({
        title: 'El usuario no existe',
        details: `El usuario con id ${params.idUser} no esta registrado.`,
        statusCode: 404,
        success: false,
      });
    }

    return this.userRepository.update(params.idUser, {
      ...body,
      birthDate: body.birthDate ?? dayjs(user.birthDate).format('YYYY-MM-DD'),
    });
  }

  async login(params: z.infer<typeof loginUserSchema>) {
    const user = await this.userRepository.getByEmail(params.email);

    if (!user) {
      throw new ApiError({
        title: 'El usuario no existe',
        details: `El usuario con email ${params.email} no esta registrado.`,
        statusCode: 400,
        success: false,
      });
    }

    const isValidatePassword = await comparePasswordAsync(
      params.password,
      user.password
    );

    if (!isValidatePassword) {
      throw new ApiError({
        title: 'Contraseña incorrecta',
        details: `La contraseña que ha ingresado es incorrecta.`,
        statusCode: 400,
        success: false,
      });
    }

    const token = signJwtUser({
      email: user.email,
      id: user.id,
      userSecret: user.userSecret,
      role: '',
    });

    const infoUser = {
      id: user.id,
      email: user.email,
      name: `${user.firstName?.split(' ')[0]} ${user.lastName?.split(' ')[0]}`,
    };

    return {
      infoUser,
      token,
    };
  }

  async addManyUser(users: z.infer<typeof registerUserSchema>[]) {
    const emails = users.map((user) => user.email);

    const usersFound = await this.userRepository.findUsersByEmail(emails);

    const usersFoundMap = usersFound.reduce(
      (acc, user) => {
        acc[user.email] = user;
        return acc;
      },
      {} as Record<string, User>
    );

    const dataUsers = (
      await Promise.all(
        users.map(async (user) => {
          const [hashPassword, secretKey] = await Promise.all([
            hashPasswordSync(user.password),
            genSecretKeyUser(),
          ]);
          if (!usersFoundMap[user.email]) {
            return {
              ...user,
              password: hashPassword,
              secretKey,
            };
          }
          return undefined;
        })
      )
    ).filter((user) => !!user);

    await this.userRepository.createManyUsers(dataUsers);
  }
  async addUser(params: z.infer<typeof registerUserSchema>) {
    const user = await this.userRepository.getByEmail(params.email);

    if (user) {
      throw new ApiError({
        title: 'El usuario ya existe',
        details: `El usuario con email ${params.email} ya existe`,
        statusCode: 400,
        success: false,
      });
    }

    const [hashPassword, secretKey] = await Promise.all([
      hashPasswordSync(params.password),
      genSecretKeyUser(),
    ]);

    return await this.userRepository.create({
      ...params,
      password: hashPassword,
      secretKey: secretKey,
    });
  }

  async getAll(params: z.infer<typeof searchPaginationParamsSchema>) {
    const [total, users] = await Promise.all([
      this.userRepository.countAllUsuarios(params),
      this.userRepository.getAll(params),
    ]);

    const { limit, page } = pagination(params);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getInfoAuthUser(params: { email: string; token?: string }) {
    const user = await this.userRepository.getByEmail(params.email);

    if (!user) {
      throw new ApiError({
        title: 'El usuario no existe',
        details: `El usuario con email ${params.email} no esta registrado.`,
        statusCode: 400,
        success: false,
      });
    }

    let token = null;

    if (!params.token) {
      token = signJwtUser({
        email: user.email,
        id: user.id,
        userSecret: user.userSecret,
        role: '',
      });
    }

    const infoUser = {
      id: user.id,
      email: user.email,
      name: `${user.firstName?.split(' ')[0]} ${user.lastName?.split(' ')[0]}`,

      birthDate: user.birthDate,
      createdAt: user.createdAt,
    };

    return {
      infoUser,
      token: params.token ?? token,
    };
  }
}
