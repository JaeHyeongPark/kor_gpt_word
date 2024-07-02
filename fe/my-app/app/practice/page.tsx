"use client";

import WordCard from "@/components/WordCard";
import React, { useState, useEffect } from "react";
import LogoutButton from "@/components/LogoutButton";
import { supabase } from "@/lib/supabase/supabase";

interface PracticePageProps {
  iterations: number;
}

const PracticePage: React.FC<PracticePageProps> = ({ iterations = 2 }) => {
  const [wordCards, setWordCards] = React.useState<JSX.Element[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWords = async () => {
      const { data, error } = await supabase.from("words").select("*");

      if (error) {
        console.error("Error fetching words:", error.message);
        setLoading(false);
        return;
      }

      if (data) {
        console.log("Fetched words data:", data);
        const cards = data.map((word, index) => (
          <WordCard
            key={index}
            word={word.word}
            definition={word.definition}
            example={word.example}
          />
        ));
        setWordCards(cards);
        setLoading(false);
      } else {
        console.log("No data found in words table.");
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-white p-4">
      <header className="py-4 text-black text-center flex justify-between items-center w-full max-w-4xl">
        <div className="w-20"></div>
        <div className="text-center">
          <LogoutButton />
        </div>
      </header>
      <main className="flex flex-col items-center justify-center w-full bg-white p-8 rounded shadow">
        {loading ? <p>Loading</p> : wordCards}
      </main>
    </div>
  );
};

export default PracticePage;
