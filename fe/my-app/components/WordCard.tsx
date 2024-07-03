import React from "react";
import SpeakerIcon from "./Icon/SpeakerIcon";

interface WordCardProps {
  word: string;
  pronounce_eng: string;
  meaning: string;
  examples: {
    example_1: { eng: string; kor: string };
    example_2?: { eng: string; kor: string };
    example_3?: { eng: string; kor: string };
  };
}

const WordCard: React.FC<WordCardProps> = ({
  word,
  pronounce_eng,
  meaning,
  examples,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl mx-auto my-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-blue-700">{word}</h2>
        <div className="flex space-x-2">
          <button className="text-gray-500 hover:text-gray-700">
            <i className="fab fa-twitter"></i>
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <i className="fab fa-facebook"></i>
          </button>
        </div>
      </div>
      <div className="mt-2 flex items-center text-xl text-gray-700">
        <SpeakerIcon />
        <span className="ml-2">{pronounce_eng}</span>
      </div>
      <p className="mt-4 text-xl">{meaning}</p>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Examples:</h3>
        <ul className="list-disc list-inside mt-2">
          {examples.example_1 && (
            <li>
              <strong>{examples.example_1.eng}</strong> -{" "}
              {examples.example_1.kor}
            </li>
          )}
          {examples.example_2 && (
            <li>
              <strong>{examples.example_2.eng}</strong> -{" "}
              {examples.example_2.kor}
            </li>
          )}
          {examples.example_3 && (
            <li>
              <strong>{examples.example_3.eng}</strong> -{" "}
              {examples.example_3.kor}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default WordCard;
