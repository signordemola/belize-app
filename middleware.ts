import { NextRequest, NextResponse } from "next/server";
import { decodeToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session-id")?.value;
  const currentPath = request.nextUrl.pathname.replace(/\/$/, "");

  const publicRoutes = ["/sign-in", "/sign-up", "/verify-otp"];
  const protectedRoutes = ["/admin-panel", "/dashboard"];

  const isPublicRoute = publicRoutes.includes(currentPath);
  const isProtectedRoute = protectedRoutes.some((route) =>
    currentPath.startsWith(route)
  );

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const decoded = session ? await decodeToken(session) : null;

  if (session && decoded?.success) {
    const role = decoded.payload!.role;

    if (isPublicRoute) {
      const redirectPath =
        role === "ADMIN"
          ? "/admin-panel"
          : role === "CUSTOMER"
          ? "/dashboard"
          : "/";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    if (
      (currentPath.startsWith("/admin-panel") && role !== "ADMIN") ||
      (currentPath.startsWith("/dashboard") && role !== "CUSTOMER")
    ) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  if (session && decoded && !decoded.success && isProtectedRoute) {
    const res = NextResponse.redirect(new URL("/sign-in", request.url));
    res.cookies.delete("session-id");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
