import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {getToken} from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const {pathname} = request.nextUrl;
  const userRole = token.role as string | undefined;

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
