// fe/my-app/app/component/QuestionLayout.tsx
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface QuestionLayoutProps {
  children: React.ReactNode;
  question: string;
  questionType: "text" | "multiple";
  choices?: string[];
  currentQuestion: number;
}

const QuestionLayout: React.FC<QuestionLayoutProps> = ({
  children,
  question,
  questionType,
  choices = [],
  currentQuestion,
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <header className="py-4 bg-blue-500 text-white text-center">
        <h1 className="text-2xl">Questionnaire</h1>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-xl bg-white p-8 rounded shadow">
          <h2 className="text-xl mb-4">{question}</h2>
          {questionType === "multiple" ? (
            <div className="space-y-2">
              {choices.map((choice, index) => (
                <label key={index} className="block">
                  <input
                    type="radio"
                    name="choice"
                    value={choice}
                    className="mr-2"
                  />
                  {choice}
                </label>
              ))}
            </div>
          ) : (
            <div>{children}</div>
          )}
        </div>
      </main>
      <footer className="py-4 flex justify-between items-center">
        {currentQuestion > 1 && (
          <button
            onClick={() =>
              router.push(`/question/question${currentQuestion - 1}`)
            }
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Previous
          </button>
        )}
        {currentQuestion < 4 && (
          <button
            onClick={() =>
              router.push(`/question/question${currentQuestion + 1}`)
            }
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        )}
      </footer>
    </div>
  );
};

export default QuestionLayout;
