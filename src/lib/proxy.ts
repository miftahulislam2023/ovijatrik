import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function handleProxyRequest(req: NextRequest) {
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    
    if (isAdminRoute) {
        const session = await auth();
        
        if (!session) {
            const signInUrl = new URL("/api/auth/signin", req.nextUrl.origin);
            signInUrl.searchParams.set("callbackUrl", req.nextUrl.href);
            return NextResponse.redirect(signInUrl);
        }
    }

    return NextResponse.next();
}
