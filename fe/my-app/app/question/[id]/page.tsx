"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import QuestionLayout from "@/components/QuestionLayout";
import { createClient } from "@/utils/supabase/client";

const questions = [
  {
    id: 1,
    question: "Your Korean level?",
    choices: [
      { choice_id: 1, text: "I don't know at all" },
      { choice_id: 2, text: "I know a little" },
      { choice_id: 3, text: "I know quite a bit" },
    ],
  },
  {
    id: 2,
    question: "Favorite topics?",
    choices: [
      { choice_id: 1, text: "Travel" },
      { choice_id: 2, text: "Daily Life" },
      { choice_id: 3, text: "Culture" },
      { choice_id: 4, text: "Family and Relationships" },
      { choice_id: 5, text: "Greetings and Basic Expressions" },
      { choice_id: 6, text: "Technology" },
    ],
  },
  {
    id: 3,
    question: "Learning goals? (Check all that apply)",
    choices: [
      { choice_id: 1, text: "Master the basics" },
      { choice_id: 2, text: "Talk to native speakers" },
      { choice_id: 3, text: "Watch movies in Korean" },
      { choice_id: 4, text: "Learn about Korean culture" },
      { choice_id: 5, text: "Get top scores on TOPIK" },
    ],
    multiple: true,
  },
  {
    id: 4,
    question: "Age range?",
    choices: [
      { choice_id: 1, text: "Under 18" },
      { choice_id: 2, text: "18-25" },
      { choice_id: 3, text: "26-35" },
      { choice_id: 4, text: "36-45" },
      { choice_id: 5, text: "46+" },
    ],
  },
  {
    id: 5,
    question: "When would you like to practice?",
    choices: [
      { choice_id: 1, text: "7AM" },
      { choice_id: 2, text: "9AM" },
      { choice_id: 3, text: "1PM" },
      { choice_id: 4, text: "6PM" },
      { choice_id: 5, text: "9PM" },
    ],
  },
];

const getTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

const QuestionPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const questionId = parseInt(id, 10);
  const question = questions.find((q) => q.id === questionId);
  const supabase = createClient();

  const [answers, setAnswers] = useState<{ [key: number]: number | number[] }>(
    {}
  );
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  // 컴포넌트가 마운트될 때 로컬 스토리지에서 상태를 읽어오는 로직
  useEffect(() => {
    const savedAnswers = localStorage.getItem("answers");
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []); // 빈 배열을 종속성으로 추가하여 컴포넌트가 처음 렌더링될 때 한 번만 실행

  // 현재 질문에 대한 응답 상태를 확인하여 버튼 비활성화 상태를 업데이트
  useEffect(() => {
    const currentAnswer = answers[questionId];
    if (question?.multiple) {
      setIsSubmitDisabled(
        !Array.isArray(currentAnswer) || currentAnswer.length === 0
      );
    } else {
      setIsSubmitDisabled(currentAnswer === undefined);
    }
  }, [answers, questionId, question]);

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
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User is not authenticated");
        console.log("userError:", userError, "user:", user);
        return;
      }

      const savedAnswers = JSON.parse(localStorage.getItem("answers") || "{}");

      const insertData = {
        user_id: user.id,
        answers: savedAnswers,
        timezone: getTimezone(),
        answers_completed: true,
      };

      const { error } = await supabase
        .from("user_answers")
        .insert([insertData]);
      if (error) {
        console.error("Error saving answers:", error.message);
      } else {
        console.log("Answers saved successfully");
        localStorage.removeItem("answers"); // 저장 후 로컬 스토리지에서 제거
        router.push("/countdown");
      }
    }
  };

  return (
    <QuestionLayout question={question.question} currentQuestion={questionId}>
      <div className="flex flex-col space-y-2">
        {question.choices.map((choice) => {
          const isSelected = question.multiple
            ? ((answers[questionId] as number[]) || []).includes(
                choice.choice_id
              )
            : answers[questionId] === choice.choice_id;
          return (
            <div key={choice.choice_id}>
              <button
                type="button"
                className={`w-full py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-full border ${
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
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className={`mt-4 text-white px-4 py-2 rounded 
            ${isSubmitDisabled ? "bg-gray-500" : "bg-blue-500"} `}
          disabled={isSubmitDisabled}
        >
          Next
        </button>
      </div>
    </QuestionLayout>
  );
};

export default QuestionPage;
