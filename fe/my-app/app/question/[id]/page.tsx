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

  // 로컬 스토리지에서 상태를 읽어오자
  useEffect(() => {
    const savedAnswers = localStorage.getItem("answers");
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  const [answers, setAnswers] = useState<{ [key: number]: string | string[] }>(
    {}
  );

  // 상태가 업데이트될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem("answers", JSON.stringify(answers));
  }, [answers]);

  if (!question) return <p>Question not found</p>;

  const handleChoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (question.multiple) {
      setAnswers((prev) => {
        const currentAnswers = (prev[questionId] as string[]) || [];
        if (currentAnswers.includes(value)) {
          return {
            ...prev,
            [questionId]: currentAnswers.filter((answer) => answer !== value),
          };
        } else {
          return { ...prev, [questionId]: [...currentAnswers, value] };
        }
      });
    } else {
      setAnswers({ ...answers, [questionId]: value });
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
      {/* <div onChange={handleChoiceChange}> */}
      {question.choices.map((choice, index) => (
        <label key={index} className="block">
          <input
            type={question.multiple ? "checkbox" : "radio"}
            name={`choice-${questionId}`}
            value={choice}
            className="mr-2"
            checked={
              question.multiple
                ? ((answers[questionId] as string[]) || []).includes(choice)
                : answers[questionId] === choice
            }
            onChange={handleChoiceChange}
          />
          {choice}
        </label>
      ))}
      {/* </div> */}
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
