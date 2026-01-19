import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import { isAuthorizedForFinance } from "@/lib/auth/finance-auth-config";

export default auth((req) => {
    const { pathname } = req.nextUrl;

    const isFinanceRoute = pathname.startsWith('/finance') || pathname.startsWith('/api/finance');

    if (isFinanceRoute) {
        if (!req.auth) {
            if (pathname.startsWith('/api/')) {
                return NextResponse.json(
                    { success: false, error: 'Unauthorized' },
                    { status: 401 }
                );
            }

            const signInUrl = new URL('/api/auth/signin', req.url);
            signInUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(signInUrl);
        }

        const email = req.auth.user?.email;
        if (!isAuthorizedForFinance(email)) {
            if (pathname.startsWith('/api/')) {
                return NextResponse.json(
                    { success: false, error: 'Forbidden' },
                    { status: 403 }
                );
            }

            const unauthorizedUrl = new URL('/unauthorized', req.url);
            unauthorizedUrl.searchParams.set('email', email || '');
            unauthorizedUrl.searchParams.set('context', 'finance');
            return NextResponse.redirect(unauthorizedUrl);
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};