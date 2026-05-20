import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {auth} from "@/features/auth/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const {pathname} = request.nextUrl;
  const userRole = session.user.role;

  if (pathname.startsWith("/dashboard/shipper") && userRole !== "shipper") {
    return NextResponse.redirect(new URL("/dashboard/carrier", request.url));
  }

  if (pathname.startsWith("/dashboard/carrier") && userRole !== "carrier") {
    return NextResponse.redirect(new URL("/dashboard/shipper", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
