import bcrypt from "bcryptjs"
import crypto from "node:crypto"
const saltRounds = 10



export async function hashPasswordSync( password: string) {
    const salt = await  bcrypt.genSalt(saltRounds)   
    return await bcrypt.hash(password, salt)
    
}

export async function comparePasswordAsync(password:string,passwordHash: string) {
    return await bcrypt.compare(password, passwordHash)
    
}

export async function genSecretKeyUser() {
    return crypto.randomBytes(32).toString("hex");
}