import {auth} from "@/auth";

export default auth(async (req) => {
    const user = req.auth?.user;

    if (user && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register")) {
        const newUrl = new URL("/", req.nextUrl.origin);
        return Response.redirect(newUrl);
    }

    if (!user && req.nextUrl.pathname !== "/" && req.nextUrl.pathname !== "/login" && req.nextUrl.pathname !== "/register") {
        const newUrl = new URL("/login", req.nextUrl.origin);
        return Response.redirect(newUrl);
    }
});
