import jwt from "jsonwebtoken"

const SECRET_KEY = process.env.JWT_SECRET_KEY

type SignUserJwt = {
    id: string,
    email: string,
    userSecret: string
}

export function signJwtUser(user: SignUserJwt ) {
    return jwt.sign({
        id: user.id,
        email: user.email
    }, SECRET_KEY + user.userSecret, { expiresIn: "24h" })
}
