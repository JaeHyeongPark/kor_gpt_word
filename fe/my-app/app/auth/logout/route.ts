import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = createClient();

  await supabase.auth.signOut();

  return NextResponse.redirect(`${requestUrl.origin}/login`, { status: 301 });
}
export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = createClient();

  await supabase.auth.signOut();

  return NextResponse.redirect(`${requestUrl.origin}/login`, { status: 301 });
}
