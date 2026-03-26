import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/authorization";

export async function handleProxyRequest(req: NextRequest) {
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

    if (isAdminRoute) {
        const session = await auth();

        if (!session?.user?.id) {
            const signInUrl = new URL("/join-us", req.nextUrl.origin);
            signInUrl.searchParams.set("callbackUrl", req.nextUrl.href);
            return NextResponse.redirect(signInUrl);
    }

        if (!isAdminRole(session.user.role)) {
            return NextResponse.redirect(new URL("/", req.nextUrl.origin));
        }
    }

    return NextResponse.next();
}
