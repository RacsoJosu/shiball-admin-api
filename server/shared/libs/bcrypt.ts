import bcrypt from "bcryptjs"
import crypto from "node:crypto"
const saltRounds = 10



export async function hashPasswordSync( password: string) {
    const salt = await  bcrypt.genSaltSync(saltRounds)   
    return bcrypt.hashSync(password, salt)
    
}

export async function comparePasswordAsync(password:string,passwordHash: string) {
    return bcrypt.compareSync(password, passwordHash)
    
}

export async function genSecretKeyUser() {
    return crypto.randomBytes(32).toString("hex");
}