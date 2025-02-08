import z from "zod";
import { registerUserSchema } from "./auth.schemas";
import { prisma } from "../../config/prisma";
import dayjs from "dayjs";
import { genSecretKeyUser, hashPasswordSync } from "../../shared/libs/bcrypt";

export async function findUserByEmail(email: string) {
    return await prisma.user.findUnique({
        where: {
           email
       }
   }) 
}


export async function createUser(params: z.infer<typeof registerUserSchema>) {

    const [hashPassword, secretKey] = await Promise.all([
        hashPasswordSync(params.password), 
        genSecretKeyUser()
    ])
        hashPasswordSync(params.password)

    // crear usuario
    return  await prisma.user.create({
        data: {
            email: params.email,
            password: hashPassword,
            firstName: params.firstName,
            lastName: params.lastName,
            userSecret: secretKey,
            birthDate: dayjs(params.birthDate).toDate()
        }
    })


    
}