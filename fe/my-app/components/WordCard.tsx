import React, { useRef } from "react";
import SpeakerIcon from "./Icon/SpeakerIcon";

interface WordCardProps {
  word: string;
  pronounce_eng: string;
  meaning: string;
  examples: {
    example_1: { eng: string; kor: string; pronounce: string };
    example_2?: { eng: string; kor: string; pronounce: string };
    example_3?: { eng: string; kor: string; pronounce: string };
  };
}

const WordCard: React.FC<WordCardProps> = ({
  word,
  pronounce_eng,
  meaning,
  examples,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = (src: string) => {
    if (audioRef.current) {
      audioRef.current.src = src;
      audioRef.current.play();
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg text-black p-6 w-full max-w-2xl mx-auto my-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-blue-700">{word}</h2>
        <div className="flex space-x-2"></div>
      </div>
      <div className="mt-2 flex items-center text-xl text-gray-700">
        <SpeakerIcon
          onClick={() => playAudio(`/pronunciation/mp3_list/${word}_word.mp3`)}
        />
        <span className="ml-2">{pronounce_eng}</span>
      </div>
      <p className="mt-4 text-xl">{meaning}</p>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Examples:</h3>
        <table className="w-full mt-2 border-collapse">
          <tbody>
            {examples.example_1 && (
              <tr className="border-t border-gray-200">
                <td className="flex items-center text-blue-600 p-2">
                  <SpeakerIcon
                    onClick={() =>
                      playAudio(`/pronunciation/mp3_list/${word}_example_1.mp3`)
                    }
                  />
                  <span className="ml-2">{examples.example_1.eng}</span>
                </td>
                <td className="p-2">
                  <div className="text-gray-800">
                    <strong>{examples.example_1.kor}</strong>
                  </div>
                  <div className="text-gray-500">
                    {examples.example_1.pronounce}
                  </div>
                </td>
              </tr>
            )}
            {examples.example_2 && (
              <tr className="border-t border-gray-200">
                <td className="flex items-center text-blue-600 p-2">
                  <SpeakerIcon
                    onClick={() =>
                      playAudio(`/pronunciation/mp3_list/${word}_example_2.mp3`)
                    }
                  />
                  <span className="ml-2">{examples.example_2.eng}</span>
                </td>
                <td className="p-2">
                  <div className="text-gray-800">
                    <strong>{examples.example_2.kor}</strong>
                  </div>
                  <div className="text-gray-500">
                    {examples.example_2.pronounce}
                  </div>
                </td>
              </tr>
            )}
            {examples.example_3 && (
              <tr className="border-t border-gray-200">
                <td className="flex items-center text-blue-600 p-2">
                  <SpeakerIcon
                    onClick={() =>
                      playAudio(`/pronunciation/mp3_list/${word}_example_3.mp3`)
                    }
                  />
                  <span className="ml-2">{examples.example_3.eng}</span>
                </td>
                <td className="p-2">
                  <div className="text-gray-800">
                    <strong>{examples.example_3.kor}</strong>
                  </div>
                  <div className="text-gray-500">
                    {examples.example_3.pronounce}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <audio ref={audioRef} />
    </div>
  );
};

export default WordCard;
