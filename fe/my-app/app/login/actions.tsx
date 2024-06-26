"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getAnswers } from "../actions/userInfo";

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: session, error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    redirect("/error");
  }

  // if (session) {
  //   const { data: userAnswers, error } = await getAnswers(session.user.id);

  //   if (error) {
  //     console.error("Error fetching user answers:", error.message);
  //   } else if (userAnswers) {
  //     localStorage.setItem("answers", JSON.stringify(userAnswers.answers));
  //   }

  //   revalidatePath("/", "layout");
  //   redirect("/question/1");
  // }

  revalidatePath("/", "layout");
  redirect("/question/1");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

// export async function logout() {
//   const supabase = createClient();
//   // check user's logged in
//   const {
//     data: { user },
//     error,
//   } = await supabase.auth.getUser();

//   if (user) {
//     await supabase.auth.signOut();
//   }
//   revalidatePath("/", "layout");
//   redirect("/");
// }
