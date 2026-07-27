import { NextRequest, NextResponse } from "next/server";
import { WEBSITE_LOGIN, WEBSITE_DASHBOARD, WEBSITE_REGISTER } from "./routes/WebsiteRoute";

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const hasToken = request.cookies.has('token');

    const publicRoutes = ['/', WEBSITE_LOGIN, WEBSITE_REGISTER];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!hasToken && !isPublicRoute) {
        return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
    }

    if (hasToken && isPublicRoute && pathname !== '/') {
        return NextResponse.redirect(new URL(WEBSITE_DASHBOARD, request.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/dashboard/:path*',
        '/login',
        '/register',
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};