import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/app/_lib/server/auth"; 

export async function middleware(request: NextRequest) {
  const session = await auth();

  // 1 If user not signed in, redirect to /signin
  if (!session?.user) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const { pathname } = request.nextUrl;
  const userRole = session.user.role;

  // 2 Role-based route restriction
  if (pathname.startsWith("/dashboard/shipper") && userRole !== "shipper") {
    return NextResponse.redirect(new URL("/dashboard/carrier", request.url));
  }

  if (pathname.startsWith("/dashboard/carrier") && userRole !== "carrier") {
    return NextResponse.redirect(new URL("/dashboard/shipper", request.url));
  }

  // Allow the request if everything checks out
  return NextResponse.next();
}

// 3 Apply middleware to dashboard routes only
export const config = {
  matcher: ["/dashboard/:path*"],
};
