import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { verifyAuthAdmin } from './lib/auth';

export async function middleware(req: NextRequest) {
    // Pega o token do usuário
    const tokenAdmin = req.cookies.get('user-token')?.value;

    // Valida se o usuário está autenticado
    let verifyToken;
    if (tokenAdmin) {
        try {
            verifyToken = await verifyAuthAdmin(tokenAdmin);
        } catch (err) {
            console.error(err);
        }
    }


    //verifica se o usuario tem o token
    if (req.nextUrl.pathname.startsWith('/login') && !verifyToken) {
        return NextResponse.next();
    }


    const url = req.url;

    //verifica se o usuario tem permição apartir do token de acessar o dashboard 

    if (url.includes('/login') && verifyToken?.admin === true) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (url.includes('/login') && verifyToken?.admin === false) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (url.includes('/dashboard') && verifyToken?.admin === false) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    //caso não tiver o token, será redirecionado para o login

    if (!verifyToken) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login'],
};
