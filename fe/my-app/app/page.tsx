import { supabase, supabaseAdmin } from "@/lib/supabase";
import Image from "next/image";

export default function Home() {
  const setNewView = async () => {
    const { data, error } = await supabase.from("countries").insert({
      name: "Brazil",
    });
    if (data) {
      console.log(data);
    } else {
      console.log(error);
    }
  };

  setNewView();

  return <div>Hello</div>;
}
