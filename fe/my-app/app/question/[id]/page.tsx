"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import QuestionLayout from "@/components/QuestionLayout";

const questions = [
  {
    id: 1,
    question: "여러분의 한국어는 어떠한가요?",
    choices: ["Beginner", "Intermediate", "Advanced", "Native"],
  },
  {
    id: 2,
    question: "어떤 주제에 관심이 가나요?",
    choices: ["Travel", "Food", "Culture", "Technology"],
  },
  {
    id: 3,
    question: "목표가 어떻게 되나요? (해당항목 모두 선택)",
    choices: ["Speaking", "Listening", "Reading", "Writing"],
    multiple: true,
  },
  {
    id: 4,
    question: "나이가 어떻게 되나요?",
    choices: ["Under 18", "18-25", "26-35", "36-45", "46+"],
  },
];

const QuestionPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const questionId = parseInt(id, 10);
  const question = questions.find((q) => q.id === questionId);

  const [answers, setAnswers] = useState<{ [key: number]: string | string[] }>(
    {}
  );

  // 로컬 스토리지에서 상태를 읽어오자
  useEffect(() => {
    const savedAnswers = localStorage.getItem("answers");
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  // 상태가 업데이트될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem("answers", JSON.stringify(answers));
  }, [answers]);

  if (!question) return <p>Question not found</p>;

  const handleChoiceChange = (choice: string) => {
    if (question.multiple) {
      setAnswers((prev) => {
        const currentAnswers = (prev[questionId] as string[]) || [];
        if (currentAnswers.includes(choice)) {
          return {
            ...prev,
            [questionId]: currentAnswers.filter((answer) => answer !== choice),
          };
        } else {
          return { ...prev, [questionId]: [...currentAnswers, choice] };
        }
      });
    } else {
      setAnswers({ ...answers, [questionId]: choice });
    }
  };

  const handleSubmit = () => {
    if (questionId < questions.length) {
      router.push(`/question/${questionId + 1}`);
    } else {
      console.log("Completed", answers);
    }
  };

  return (
    <QuestionLayout question={question.question} currentQuestion={questionId}>
      <div className="space-y-2">
        {question.choices.map((choice, index) => {
          const isSelected = question.multiple
            ? ((answers[questionId] as string[]) || []).includes(choice)
            : answers[questionId] === choice;
          return (
            <button
              key={index}
              type="button"
              className={`block w-full py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-full border ${
                isSelected
                  ? "bg-blue-600 text-white"
                  : "bg-white border-gray-300 text-gray-700"
              } hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none`}
              onClick={() => handleChoiceChange(choice)}
            >
              {choice}
            </button>
          );
        })}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Next
      </button>
    </QuestionLayout>
  );
};

export default QuestionPage;
