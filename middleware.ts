import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production" || !!process.env.VERCEL
  });
  const { pathname } = req.nextUrl;

  // Define public paths
  const isPublicPath =
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/contact" ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/refund" ||
    pathname.startsWith("/courses") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/uploadthing") ||
    /\.(png|jpg|jpeg|gif|svg|ico|webp|css|js|woff2?|json)$/i.test(pathname);

  // If no session exists
  if (!token) {
    // If they are attempting to access a protected route, redirect to /login
    if (!isPublicPath) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // If session exists, retrieve role
  const role = token.role as string;

  // If logged in and visiting the root path or login/register, redirect to their respective dashboard
  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
    if (role === "TEACHER") return NextResponse.redirect(new URL("/teacher", req.url));
    if (role === "STUDENT") return NextResponse.redirect(new URL("/student", req.url));
  }

  // Admin route protection
  if (pathname.startsWith("/admin")) {
    if (role !== "ADMIN") {
      if (role === "TEACHER") return NextResponse.redirect(new URL("/teacher", req.url));
      return NextResponse.redirect(new URL("/student", req.url));
    }
  }

  // Teacher route protection
  if (pathname.startsWith("/teacher")) {
    if (role !== "TEACHER") {
      if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
      return NextResponse.redirect(new URL("/student", req.url));
    }
  }

  // Student route protection (student dashboard, enroll, learn)
  const isStudentRoute =
    pathname.startsWith("/student") ||
    pathname.startsWith("/enroll") ||
    pathname.startsWith("/learn");

  if (isStudentRoute) {
    if (role !== "STUDENT") {
      if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
      return NextResponse.redirect(new URL("/teacher", req.url));
    }
  }

  return NextResponse.next();
}

// Config to specify matching paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
