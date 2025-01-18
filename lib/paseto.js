import { secret } from "./secret.js"
import { V3 } from "paseto"
import crypto from 'crypto'

const secretAuth = crypto.createHash('sha256').update(secret.secret).digest('base64').slice(0, 32)

export const generateToken = async (payload) => {
    if (payload.exp && typeof payload.exp !== 'string') {
        payload.exp = new Date(payload.exp).toISOString()
    }
    return await V3.encrypt(payload, secretAuth)
}

export const verifyToken = async (token) => {
    const decrypted = await V3.decrypt(token, secretAuth)
    if (decrypted.exp) {
        decrypted.exp = new Date(decrypted.exp).getTime()
    }
    return decrypted
}
