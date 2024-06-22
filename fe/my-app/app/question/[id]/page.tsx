"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import QuestionLayout from "@/components/QuestionLayout";
import { supabase } from "@/lib/supabase";

const questions = [
  {
    id: 1,
    question: "여러분의 한국어는 어떠한가요?",
    choices: [
      { choice_id: 1, text: "Beginner" },
      { choice_id: 2, text: "Intermediate" },
      { choice_id: 3, text: "Advanced" },
      { choice_id: 4, text: "Native" },
    ],
  },
  {
    id: 2,
    question: "어떤 주제에 관심이 가나요?",
    choices: [
      { choice_id: 1, text: "Travel" },
      { choice_id: 2, text: "Food" },
      { choice_id: 3, text: "Culture" },
      { choice_id: 4, text: "Technology" },
    ],
  },
  {
    id: 3,
    question: "목표가 어떻게 되나요? (해당항목 모두 선택)",
    choices: [
      { choice_id: 1, text: "Speaking" },
      { choice_id: 2, text: "Listening" },
      { choice_id: 3, text: "Reading" },
      { choice_id: 4, text: "Writing" },
    ],
    multiple: true,
  },
  {
    id: 4,
    question: "나이가 어떻게 되나요?",
    choices: [
      { choice_id: 1, text: "Under 18" },
      { choice_id: 2, text: "18-25" },
      { choice_id: 3, text: "26-35" },
      { choice_id: 4, text: "36-45" },
      { choice_id: 5, text: "46+" },
    ],
  },
];

const QuestionPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const questionId = parseInt(id, 10);
  const question = questions.find((q) => q.id === questionId);

  const [answers, setAnswers] = useState<{ [key: number]: number | number[] }>(
    {}
  );

  // 컴포넌트가 마운트될 때 로컬 스토리지에서 상태를 읽어오는 로직
  useEffect(() => {
    const savedAnswers = localStorage.getItem("answers");
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []); // 빈 배열을 종속성으로 추가하여 컴포넌트가 처음 렌더링될 때 한 번만 실행

  if (!question) return <p>Question not found</p>;

  const handleChoiceChange = (choiceId: number) => {
    setAnswers((prev) => {
      const updatedAnswers = { ...prev };
      if (question.multiple) {
        const currentAnswers = (updatedAnswers[questionId] as number[]) || [];
        if (currentAnswers.includes(choiceId)) {
          updatedAnswers[questionId] = currentAnswers.filter(
            (id) => id !== choiceId
          );
        } else {
          updatedAnswers[questionId] = [...currentAnswers, choiceId];
        }
      } else {
        updatedAnswers[questionId] = choiceId;
      }
      localStorage.setItem("answers", JSON.stringify(updatedAnswers));
      return updatedAnswers;
    });
  };

  const handleSubmit = async () => {
    if (questionId < questions.length) {
      router.push(`/question/${questionId + 1}`);
    } else {
      console.log("Completed", answers);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User is not authenticated");
        return;
      }

      const savedAnswers = JSON.parse(localStorage.getItem("answers") || "{}");

      const insertData = {
        user_id: user.id,
        answers: savedAnswers,
      };

      const { error } = await supabase
        .from("user_answers")
        .insert([insertData]);
      if (error) {
        console.error("Error saving answers:", error.message);
      } else {
        console.log("Answers saved successfully");
        localStorage.removeItem("answers"); // 저장 후 로컬 스토리지에서 제거
        router.push("/completed");
      }
    }
  };

  return (
    <QuestionLayout question={question.question} currentQuestion={questionId}>
      {question.choices.map((choice) => {
        const isSelected = question.multiple
          ? ((answers[questionId] as number[]) || []).includes(choice.choice_id)
          : answers[questionId] === choice.choice_id;
        return (
          <div key={choice.choice_id} className="space-y-2">
            <button
              type="button"
              className={`py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-full border ${
                isSelected
                  ? "bg-blue-600 text-white"
                  : "bg-white border-gray-300 text-gray-700"
              } hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none`}
              onClick={() => handleChoiceChange(choice.choice_id)}
            >
              {choice.text}
            </button>
          </div>
        );
      })}
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
