import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // if user is not signed in and trying to access a protected route redirect the user to /login
  const protectedPaths = ["/question", "/practice"];
  const pathIsProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (!session && pathIsProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (session) {
    // if user is signed in and the current path is / or /login, redirect the user to /question/1
    if (req.nextUrl.pathname === "/" || req.nextUrl.pathname === "/login") {
      const { data: userAnswers, error } = await supabase
        .from("user_answers")
        .select("answers_completed")
        .eq("user_id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching user answers:", error.message);
        return res;
      }

      if (userAnswers?.answers_completed) {
        return NextResponse.redirect(new URL("/practice", req.url));
      } else {
        console.log("user has not completed answers");
        return NextResponse.redirect(new URL("/question/1", req.url));
      }
    }

    // Redirect user from /question/* to /countdown if they have completed the answers
    if (req.nextUrl.pathname.startsWith("/question")) {
      const { data: userAnswers, error } = await supabase
        .from("user_answers")
        .select("answers_completed")
        .eq("user_id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching user answers:", error.message);
        return res;
      }

      if (userAnswers?.answers_completed) {
        return NextResponse.redirect(new URL("/practice", req.url));
      } else {
        console.log("user has not completed answers");
        return NextResponse.redirect(new URL("/question/1", req.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: ["/", "/login", "/question/:path*", "/practice"],
};
