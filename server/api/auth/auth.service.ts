import z from 'zod';
import { loginUserSchema, registerUserSchema } from './auth.schemas';
import {
  comparePasswordAsync,
  genSecretKeyUser,
  hashPasswordSync,
} from '../../shared/libs/bcrypt';
import { UserRepository } from './auth.repository';
import { ApiError } from '../../middlewares/statusCode';
import { signJwtUser } from '../../shared/libs/jwt';

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async login(params: z.infer<typeof loginUserSchema>) {
    const user = await this.userRepository.findUserByEmail(params.email);

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
      role: user.role,
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

  async addUser(params: z.infer<typeof registerUserSchema>) {
    const user = await this.userRepository.findUserByEmail(params.email);

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

    return await this.userRepository.createUser({
      ...params,
      password: hashPassword,
      secretKey: secretKey,
    });
  }

  async getInfoAuthUser(params: { email: string; token?: string }) {
    const user = await this.userRepository.findUserByEmail(params.email);

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
      token = await signJwtUser({
        email: user.email,
        id: user.id,
        userSecret: user.userSecret,
        role: user.role,
      });
    }

    const infoUser = {
      id: user.id,
      email: user.email,
      name: `${user.firstName?.split(' ')[0]} ${user.lastName?.split(' ')[0]}`,
    };

    return {
      infoUser,
      token: params.token ? params.token : token
    };
  }
}
