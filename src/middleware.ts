import { NextRequest, NextResponse } from "next/server";
import { verifyAuthAdmin, verifyAuthClient } from "./lib/auth";

export async function middleware(req: NextRequest) {
    // pegará o token do usuario

    const tokenAdmin = req.cookies.get('user-Token-admin')?.value
    const tokenClient = req.cookies.get('user-Token-client')?.value

    // validará se o usuario ta autenticado
    const verifyTokenAdmin = tokenAdmin && (await verifyAuthAdmin(tokenAdmin).catch((err) => {
        console.error(err.message)
    }))


    // validará se o usuario ta autenticado
    const verifyTokenClient = tokenClient && (await verifyAuthClient(tokenClient).catch((err) => {
        console.error(err.message)
    }))


    if (req.nextUrl.pathname.startsWith('/login') && !verifyTokenAdmin) {
        return
    }



    const url = req.url

    if (url.includes('/login') && verifyTokenAdmin) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    if (url.includes('/booking')) {
        if (verifyTokenClient) {
            console.log(verifyTokenClient)
            return NextResponse.next()

        } else {
            return NextResponse.redirect(new URL('/login', req.url))

        }
    }

    if (!verifyTokenAdmin) {
        return NextResponse.redirect(new URL('/login', req.url))
    }


}


export const config = {
    matcher: ['/dashboard/:path*', '/login', '/booking',],
}


