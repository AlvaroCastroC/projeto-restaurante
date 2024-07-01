import { jwtVerify } from "jose"


interface UserJwtPayloadAdmin {
    [x: string]: any
    jti: string
    iat: number
    email: string
}
interface UserJwtPayloadClient {
    [x: string]: any
    jti: string
    iat: number
    email: string
}

export function getJwtSecretKeyAdmin(): string {
    const secret = process.env.JWT_SECRET_KEY_ADMIN

    if (!secret || secret.length === 0) {

        throw new Error('a chave secreta do JWT não está definida')
    }

    return secret
}



export const verifyAuthAdmin = async (token: string) => {
    try {
        const verified = await jwtVerify(token, new TextEncoder().encode(getJwtSecretKeyAdmin()))
        return verified.payload as UserJwtPayloadAdmin
    } catch (error) {

        throw new Error('Seu token é inválido')
    }
}


export function getJwtSecretKeyClient(): string {
    const secret = process.env.JWT_SECRET_KEY_CLIENT

    if (!secret || secret.length === 0) {

        throw new Error('a chave secreta do JWT não está definida')
    }

    return secret
}
export const verifyAuthClient = async (token: string) => {
    try {
        const verified = await jwtVerify(token, new TextEncoder().encode(getJwtSecretKeyClient()))
        return verified.payload as UserJwtPayloadClient
    } catch (error) {

        throw new Error('Seu token é inválido')

    }
}