import { jwtVerify } from "jose"

export interface Payload {
    [x: string]: any
    jti: string
    iat: number
    admin: boolean
    idUser: string
}

export function getJwtSecretKey(): string {
    const secret = process.env.JWT_SECRET_KEY

    if (!secret || secret.length === 0) {

        throw new Error('a chave secreta do JWT não está definida')
    }

    return secret
}


export const verifyAuthAdmin = async (token: string) => {
    try {
        const verified = await jwtVerify(token, new TextEncoder().encode(getJwtSecretKey()))
        return verified.payload as Payload
    } catch (error) {

        throw new Error('Seu token é inválido')
    }
}

