"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    timezone: formData.get("timezone") as string,
  };

  const { data: session, error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    console.log("1");
    redirect("/error");
  }

  // user_answers 테이블에 user_id가 session.user.id인 레코드의 timezone 열을 data.timezone으로 업데이트
  await supabase
    .from("user_answers")
    .update({ timezone: data.timezone })
    .eq("user_id", session.user.id);

  const { data: userAnswersDone, error: userAnswersError } = await supabase
    .from("user_answers")
    .select("answers_completed")
    .eq("user_id", session.user.id)
    .single();

  if (userAnswersError || !userAnswersDone) {
    return redirect("/question/1");
  }

  if (userAnswersDone?.answers_completed) {
    return redirect("/countdown");
    // return redirect("/question/1");
  }

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
