import {NextRequest, NextResponse} from 'next/server'
import {getToken} from 'next-auth/jwt'

const protectedRoutes = [
    '/book-shelf',
    '/book-store',
    '/reviews',
    '/challenges',
    '/statistics',
    '/profile',
    '/private-review',
    '/daily-book'
]

const publicRoutes = ['/about', '/register', '/login']

export default async function middleware(req: NextRequest) {
    console.log("Middleware running for", req);
    const path = req.nextUrl.pathname
    const user = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie: process.env.NODE_ENV === 'production',
    })
    console.log("user in middleware", user)
    console.log("secret", process.env.NEXTAUTH_SECRET);

    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    const isPublicRoute = publicRoutes.includes(path)
    const isAdminRoute = path.startsWith('/admin')

    // Redirect to /login if the user is not authenticated
    if (isProtectedRoute && !user) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    // Redirect to / if the user is not an admin
    if (isAdminRoute) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', req.nextUrl))
        }

        if (user.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', req.nextUrl))
        }
    }

    // Redirect authenticated users away from public routes
    if (
        isPublicRoute &&
        user &&
        !req.nextUrl.pathname.startsWith('/about')
    ) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|.*\\.png$).*)'],
}