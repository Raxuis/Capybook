import {NextRequest, NextResponse} from 'next/server'
import {getToken} from "next-auth/jwt";

// 1. Specify protected, admin, and public routes
const protectedRoutes = [
    '/book-shelf',
    '/book-store',
    '/reviews',
    '/challenges',
]
const publicRoutes = [
    '/about',
    '/register',
    '/login'
]
// const adminRoutes = ['/admin-dashboard']

export default async function middleware(req: NextRequest) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname
    const user = await getToken({req, secret: process.env.AUTH_SECRET});
    const isProtectedRoute = protectedRoutes.includes(path)
    const isPublicRoute = publicRoutes.includes(path)

    // 5. Redirect to /login if the user is not authenticated
    if (isProtectedRoute && !user) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    // 6. Redirect to / if the user is not an admin
    // if (isAdminRoute) {
    //   const apiUrl = new URL("/api/user/check-admin", req.nextUrl).toString();
    //   console.log('API URL:', apiUrl);
    //   const response = await fetch(apiUrl);

    //   // Check if the response is OK and JSON
    //   if (!response.ok) {
    //     const text = await response.text(); // Get the response as text
    //     console.error('Error response:', text); // Log the error response
    //     return NextResponse.redirect(new URL('/', req.nextUrl)); // Redirect or handle the error appropriately
    //   }

    //   const result = await response.json();

    //   if (!result.isAdmin) {
    //     return NextResponse.redirect(new URL('/', req.nextUrl));
    //   }
    // }

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
