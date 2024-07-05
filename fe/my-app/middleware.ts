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
        const { data: userWords, error: userWordsError } = await supabase
          .from("user_words")
          .select("id")
          .eq("user_id", session.user.id)
          .limit(1);

        if (userWordsError) {
          console.error("Error fetching user words:", userWordsError.message);
          return res;
        }

        if (userWords.length > 0) {
          return NextResponse.redirect(new URL("/practice", req.url));
        } else {
          // return NextResponse.redirect(new URL("/countdown", req.url));
          return NextResponse.redirect(new URL("/practice", req.url));
        }
      } else {
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
        return NextResponse.redirect(new URL("/countdown", req.url));
      }
    }

    // Restrict access to /practice if user has no study history
    // if (req.nextUrl.pathname.startsWith("/practice")) {
    //   const { data: userWords, error: userWordsError } = await supabase
    //     .from("user_words")
    //     .select("id")
    //     .eq("user_id", session.user.id)
    //     .limit(1);

    //   if (userWordsError) {
    //     console.error("Error fetching user words:", userWordsError.message);
    //     return res;
    //   }

    //   // if (userWords.length === 0) {
    //   // return NextResponse.redirect(new URL("/practice", req.url));
    //   // }
    // }
  }

  return res;
}

export const config = {
  matcher: ["/", "/login", "/question/:path*", "/practice"],
};
