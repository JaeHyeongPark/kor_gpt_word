import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // if user is signed in and the current path is / redirect the user to /question/1
  if (
    session &&
    (req.nextUrl.pathname === "/" || req.nextUrl.pathname === "/login")
  ) {
    return NextResponse.redirect(new URL("/question/1", req.url));
  }

  // if user is not signed in and trying to access a protected route redirect the user to /login
  const protectedPaths = ["/question"];
  const pathIsProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (!session && pathIsProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/", "/login", "/question/:path*"],
};
