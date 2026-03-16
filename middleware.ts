import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isAuthenticated = !!req.auth;

    if (isAdminRoute && !isAuthenticated) {
        const signInUrl = new URL("/api/auth/signin", req.nextUrl.origin);
        signInUrl.searchParams.set("callbackUrl", req.nextUrl.href);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/admin/:path*"],
};
