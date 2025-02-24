import z from "zod";
import { createUserSquemaRepository } from "./auth.schemas";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email }
    });
  }

  async createUser(params: z.infer<typeof createUserSquemaRepository>) {
    return await this.prisma.user.create({
      data: {
        email: params.email,
        password: params.password,
        firstName: params.firstName,
        lastName: params.lastName,
        userSecret: params.secretKey,
        birthDate: dayjs(params.birthDate).toDate()
      }
    });
  }
}