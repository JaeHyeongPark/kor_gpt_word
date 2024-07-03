"use client";

import WordCard from "@/components/WordCard";
import React, { useState, useEffect } from "react";
import LogoutButton from "@/components/LogoutButton";

const PracticePage: React.FC = () => {
  const [wordCards, setWordCards] = useState<JSX.Element[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWords = async () => {
      const response = await fetch("/api/recommend-words", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.words) {
        const cards = data.words.map((word: any, index: number) => (
          <WordCard
            key={index}
            word={word.word}
            pronounce_eng={word.pronounce_eng}
            meaning={word.meaning}
            examples={word.examples}
          />
        ));
        setWordCards(cards);
      }

      setLoading(false);
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
        {loading ? <p>Loading...</p> : wordCards}
      </main>
    </div>
  );
};

export default PracticePage;
