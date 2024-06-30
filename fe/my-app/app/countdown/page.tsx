"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

const CountdownPage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUserAnswers = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/login");
        return;
      }

      const { data: userAnswers, error } = await supabase
        .from("user_answers")
        .select("answers, timezone")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user answers:", error.message);
        return;
      }

      if (!userAnswers) {
        // If no answers found, redirect to the first question
        router.push("/question/1");
        return;
      }

      if (userAnswers) {
        // userAnswers is the object looks like { 5: "1", timezone: "America/New_York" }
        const practiceTime = userAnswers.answers[5]; // Access the answer to question 5
        const userTimezone = userAnswers.timezone;

        // Calculate time left
        calculateTimeLeft(practiceTime, userTimezone);
      }
    };

    const calculateTimeLeft = (practiceTime: number, userTimezone: string) => {
      const practiceTimeMap: { [key: string]: number } = {
        1: 7, // 7AM
        2: 9, // 9AM
        3: 13, // 1PM
        4: 18, // 6PM
        5: 21, // 9PM
      };

      const now = new Date();
      const nowInUserTimezone = new Date(
        now.toLocaleString("en-US", { timeZone: userTimezone })
      );

      const practiceHour = practiceTimeMap[practiceTime];
      if (practiceHour === undefined) {
        console.error("Invalid practice time selected.");
        setTimeLeft("Invalid practice time selected.");
        return;
      }

      const practiceDateTime = new Date(nowInUserTimezone);
      practiceDateTime.setHours(practiceHour, 0, 0, 0);

      if (practiceDateTime < nowInUserTimezone) {
        practiceDateTime.setDate(practiceDateTime.getDate() + 1);
      }

      const timeDiff = practiceDateTime.getTime() - nowInUserTimezone.getTime();
      const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);

      setTimeLeft(`${hours} hours and ${minutes} minutes`);
    };

    fetchUserAnswers();
  }, [router, supabase]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <header className="py-4 text-black text-center flex justify-between items-center w-full max-w-4xl">
        <div className="w-20"></div>
        <div className="text-center">
          <LogoutButton />
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center w-full max-w-4xl bg-white p-8 rounded shadow">
        <h1 className="text-4xl text-black font-bold">
          Time left until your next practice:
        </h1>
        <p className="text-2xl text-black">{timeLeft}</p>
      </main>
    </div>
  );
};

export default CountdownPage;
