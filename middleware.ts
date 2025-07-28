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

// Pour plus tard, au cas où je souhaite ajouter des routes API publiques
const publicApiRoutes: string[] = [
    '/api/public',
]

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname
    const user = await getToken({req, secret: process.env.AUTH_SECRET})

    const isProtectedRoute = protectedRoutes.includes(path)
    const isPublicRoute = publicRoutes.includes(path)
    const isAdminRoute = path.startsWith('/admin')
    const isApiRoute = path.startsWith('/api/')

    // Protection of API routes
    if (isApiRoute) {
        const isPublicApiRoute = publicApiRoutes.some(route =>
            path.startsWith(route)
        )

        if (!isPublicApiRoute && !user) {
            return NextResponse.json(
                {error: 'Non autorisé - Authentication requise'},
                {status: 401}
            )
        }

        // Validation for admin routes
        if (path.startsWith('/api/admin/')) {
            if (!user) {
                return NextResponse.json(
                    {error: 'Non autorisé - Authentication requise'},
                    {status: 401}
                )
            }
            if (user.role !== 'ADMIN') {
                return NextResponse.json(
                    {error: 'Accès interdit - Droits administrateur requis'},
                    {status: 403}
                )
            }
        }
    }

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