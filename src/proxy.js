import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { nanoid } from "nanoid";

export async function proxy(req) {
    const res = NextResponse.next();


    // Visitor ID Cookie Set
    const visitorCookie = req.cookies.get("visitorId");

    if (!visitorCookie?.value) {
        const newVisitorId = nanoid();
        const isProd = process.env.NODE_ENV === "production";

        res.cookies.set("visitorId", newVisitorId, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            maxAge: 60 * 60 * 24 * 365,
            path: "/",
        });
    }

    //  Admin Authentication Check

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    console.log('token from middleware', token)

    // Admin dashboard route protection
    if (pathname.startsWith("/admin-dashboard")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        if (token.role !== "admin") {
            return NextResponse.redirect(new URL("/forbidden", req.url));
        }
    }

    // API (admin) route protection
    if (pathname.startsWith("/api/admin")) {
        if (!token || token.role !== "admin") {
            return NextResponse.json(
                { success: false, message: "Forbidden: Admin access only" },
                { status: 403 }
            );
        }
    }

    return res;
}

export const config = {
    matcher: [
        "/:path*",
        "/admin-dashboard/:path*",
        "/api/admin/:path*",
    ],
};
