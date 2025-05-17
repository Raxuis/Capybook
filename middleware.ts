import {NextRequest, NextResponse} from 'next/server'
import {getToken} from "next-auth/jwt";

// 1. Specify protected, admin, and public routes
const protectedRoutes = [
    '/book-shelf',
    '/book-store',
    '/reviews',
    '/challenges',
    '/statistics'
]
const publicRoutes = [
    '/about',
    '/register',
    '/login'
]
const adminRoutes = ['/admin']

export default async function middleware(req: NextRequest) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname
    const user = await getToken({req, secret: process.env.AUTH_SECRET});
    const isProtectedRoute = protectedRoutes.includes(path)
    const isPublicRoute = publicRoutes.includes(path)
    const isAdminRoute = adminRoutes.includes(path)

    // 5. Redirect to /login if the user is not authenticated
    if (isProtectedRoute && !user) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    // 6. Redirect to / if the user is not an admin
    if (isAdminRoute) {
        console.log('Admin route', user)
        if (!user) {
            return NextResponse.redirect(new URL('/login', req.nextUrl))
        }

        if (!user.role || user.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', req.nextUrl));
        }
    }

    // 7. Redirect to / if the user is authenticated
    if (
        isPublicRoute &&
        user &&
        !req.nextUrl.pathname.startsWith('/about')
    ) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }

    return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
