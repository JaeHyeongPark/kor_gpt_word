"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    timezone: formData.get("timezone") as string,
  };

  const { data: session, error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    redirect("/error");
  }

  // Update user's timezone in user_answers table
  await supabase
    .from("user_answers")
    .update({ timezone: data.timezone })
    .eq("user_id", session.user.id);

  const { data: userAnswersDone, error: userAnswersError } = await supabase
    .from("user_answers")
    .select("answers_completed")
    .eq("user_id", session.user.id)
    .single();

  if (userAnswersDone?.answers_completed) {
    // Check user_words to determine if user should be redirected to /practice or /countdown

    return redirect("/practice");
  }

  revalidatePath("/", "layout");
  redirect("/question/1");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

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
