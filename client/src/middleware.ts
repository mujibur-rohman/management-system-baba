import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("_accessToken");

  if (request.nextUrl.pathname === "/auth") {
    if (accessToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (request.nextUrl.pathname === "/") {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/auth/:path*", "/:path*"],
};
