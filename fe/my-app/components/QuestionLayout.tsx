// fe/my-app/app/component/QuestionLayout.tsx
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface QuestionLayoutProps {
  children: React.ReactNode;
  question: string;
  //   questionType: "text" | "multiple";
  currentQuestion: number;
}

const QuestionLayout: React.FC<QuestionLayoutProps> = ({
  children,
  question,
  currentQuestion,
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <header className="py-4 bg-blue-500 text-white text-center flex justify-between">
        {currentQuestion > 1 && (
          <button
            onClick={() => router.push(`/question/${currentQuestion - 1}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Back
          </button>
        )}
        <div className="w-20"></div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-xl bg-white p-8 rounded shadow">
          <h2 className="text-xl mb-4">{question}</h2>
          {children}
        </div>
      </main>
    </div>
  );
};

export default QuestionLayout;
