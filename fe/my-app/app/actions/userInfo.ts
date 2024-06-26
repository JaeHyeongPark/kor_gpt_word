import { supabase } from "@/lib/supabase/supabase";

export const getAnswers = async (userId: string) => {
  return supabase
    .from("user_answers")
    .select("*")
    .eq("user_id", userId)
    .single();
};
