import React from "react";

interface WordCardProps {
  word: string;
  definition: string;
  example: string;
}

const WordCard: React.FC<WordCardProps> = ({ word, definition, example }) => {
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
      <p className="mt-4 text-xl">{definition}</p>
      <p className="mt-4 italic text-gray-600">{example}</p>

      <div className="flex justify-between items-center mt-4"></div>
    </div>
  );
};

export default WordCard;
