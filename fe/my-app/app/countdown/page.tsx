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

      const { data: userAnswers, error: userAnswersError } = await supabase
        .from("user_answers")
        .select("answers, timezone, first_learning_time")
        .eq("user_id", user.id)
        .single();

      if (userAnswersError) {
        console.error("Error fetching user answers:", userAnswersError.message);
        return;
      }

      if (!userAnswers) {
        // If no answers found, redirect to the first question
        router.push("/question/1");
        return;
      }

      const practiceTime = userAnswers.answers[5]; // Access the answer to question 5
      const userTimezone = userAnswers.timezone;
      const firstLearningTime = userAnswers.first_learning_time;

      // Fetch or set first learning time
      if (!firstLearningTime) {
        await updateFirstLearningTime(user.id, practiceTime, userTimezone);
      }

      calculateTimeLeft(practiceTime, userTimezone, firstLearningTime);
    };

    const updateFirstLearningTime = async (
      userId: string,
      practiceTime: number,
      userTimezone: string
    ) => {
      const practiceTimeMap: { [key: string]: number } = {
        1: 7, // 7AM
        2: 9, // 9AM
        3: 13, // 1PM
        4: 18, // 6PM
        5: 21, // 9PM
      };

      const practiceHour = practiceTimeMap[practiceTime];
      if (practiceHour === undefined) {
        console.error("Invalid practice time selected.");
        return;
      }

      const now = new Date();
      const nowInUserTimezone = new Date(
        now.toLocaleString("en-US", { timeZone: userTimezone })
      );

      const practiceDateTime = new Date(nowInUserTimezone);
      practiceDateTime.setHours(practiceHour, 0, 0, 0);

      if (practiceDateTime < nowInUserTimezone) {
        practiceDateTime.setDate(practiceDateTime.getDate() + 1);
      }

      await supabase
        .from("user_answers")
        .update({ first_learning_time: practiceDateTime.toISOString() })
        .eq("user_id", userId);
    };

    const calculateTimeLeft = async (
      practiceTime: number,
      userTimezone: string,
      firstLearningTime: string
    ) => {
      const now = new Date();
      const nowInUserTimezone = new Date(
        now.toLocaleString("en-US", { timeZone: userTimezone })
      );

      const firstLearningDateTime = new Date(firstLearningTime);

      if (firstLearningDateTime <= nowInUserTimezone) {
        // If it's past the first learning time, redirect to /practice
        redirectToPractice();
        return;
      }

      const timeDiff =
        firstLearningDateTime.getTime() - nowInUserTimezone.getTime();
      const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);

      setTimeLeft(`${hours} hours and ${minutes} minutes`);
    };

    const redirectToPractice = () => {
      router.push("/practice");
    };

    fetchUserAnswers();
  }, [router, supabase]);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-white p-4">
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
