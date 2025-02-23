import {auth} from "@/auth";
import {NextResponse} from "next/server";

const publicPathRegex = /^(?!\/(api|_next\/static|_next\/image|favicon\.ico|sitemap\.xml|robots\.txt)).*$/;

export default auth(async (req) => {
    const path = req.nextUrl.pathname;
    const user = req.auth?.user;

    if (path.startsWith("/api/"))
        return NextResponse.next();

    if (!publicPathRegex.test(path))
        return NextResponse.next();

    if (user && (path === "/login" || path === "/register"))
        return NextResponse.redirect(new URL("/", req.nextUrl.origin));

    if (!user && path !== "/" && path !== "/login" && path !== "/register")
        return NextResponse.redirect(new URL("/login", req.nextUrl.origin));

    return NextResponse.next();
});
