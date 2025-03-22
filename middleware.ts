import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";

const publicPathRegex = /^(?!\/(api|_next\/static|_next\/image|favicon\.ico|sitemap\.xml|robots\.txt)).*$/;

export async function middleware(req: NextRequest) {
    const user = await getToken({req, secret: process.env.AUTH_SECRET});
    const path = req.nextUrl.pathname;
    console.log("user", user);

    if (path.startsWith("/api/"))
        return NextResponse.next();

    if (!publicPathRegex.test(path))
        return NextResponse.next();

    if (user && (path === "/login" || path === "/register"))
        return NextResponse.redirect(new URL("/", req.nextUrl.origin));

    if (!user && path !== "/" && path !== "/about" && path !== "/login" && path !== "/register")
        return NextResponse.redirect(new URL("/login", req.nextUrl.origin));

    return NextResponse.next();
}
