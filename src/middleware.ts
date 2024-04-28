import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "./lib/auth";

export async function middleware(req: NextRequest) {
    // pegará o token do usuario

    const token = req.cookies.get('user-Token')?.value

    // validará se o usuario ta autenticado
    const verifyToken = token && (await verifyAuth(token).catch((err) => {
        console.error(err.message)
    }))

    if (req.nextUrl.pathname.startsWith('/login') && !verifyToken) {
        return
    }

    const url = req.url

    if (url.includes('/login') && verifyToken) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    if (!verifyToken) {
        return NextResponse.redirect(new URL('/login', req.url))
    }
}

export const config = {
    matcher: ['/dashboard/:path*', '/login'],
}