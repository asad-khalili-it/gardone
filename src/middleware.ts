import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Admin routes - only for super_admin
    if (pathname.startsWith("/admin") && token?.role !== "super_admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Panel routes - only for store_owner or super_admin
    if (
      pathname.startsWith("/panel") &&
      token?.role !== "store_owner" &&
      token?.role !== "super_admin"
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/panel/:path*"],
};
