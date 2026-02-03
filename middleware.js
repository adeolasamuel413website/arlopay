import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;

  // New cookies for verification steps
  const personalInfo = request.cookies.get("personalInfo")?.value;
  const kycVerify = request.cookies.get("kycVerify")?.value;

  const { pathname } = request.nextUrl;

  // Allow access to all registration steps
  if (pathname.startsWith("/auth/register")) {
    return NextResponse.next();
  }

  // Allow access to step verification pages
  // if (pathname.startsWith("/auth/step-verification")) {
  //   return NextResponse.next();
  // }

  if (
    // pathname === "/auth/login" ||
    pathname.startsWith("/auth/login/two-fa-verification-page") ||
    pathname.startsWith("/auth/step-verification")
  ) {
    return NextResponse.next();
  }

  // Allow access to login page even if token exists
  // if (pathname === "/auth/login") {
  //   return NextResponse.next();
  // }

  // Redirect logged-in users away from other auth pages
  if (token && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // List of protected routes
  const protectedPaths = ["/dashboard", "/profile", "/settings"];

  // If user is NOT logged in -> redirect to login
  if (!token && protectedPaths.some((path) => pathname.startsWith(path))) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ==============================
  // NEW KYC + PERSONAL INFO BLOCK
  // ==============================

  const needsVerification =
    protectedPaths.some((path) => pathname.startsWith(path)) &&
    (personalInfo !== "true" || kycVerify !== "true");

  if (token && needsVerification) {
    // User logged in BUT missing verification steps
    return NextResponse.redirect(
      new URL("/auth/step-verification/success-status", request.url)
    );
  }

  return NextResponse.next();
}

// Run middleware for auth and protected routes
export const config = {
  matcher: ["/auth/login", "/dashboard/:path*", "/auth/:path*"],
};
