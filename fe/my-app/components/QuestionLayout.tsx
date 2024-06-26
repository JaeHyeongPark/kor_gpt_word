// fe/my-app/app/component/QuestionLayout.tsx
import React from "react";
import { useRouter } from "next/navigation";
import BackIcon from "@/components/BackIcon";
import { SubmitButton } from "@/app/login/submit-button";
// import { logout } from "@/app/login/actions";

interface QuestionLayoutProps {
  children: React.ReactNode;
  question: string;
  currentQuestion: number;
}

const QuestionLayout: React.FC<QuestionLayoutProps> = ({
  children,
  question,
  currentQuestion,
}) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("answers");
    fetch("/auth/logout", { method: "POST" })
      .then(() => router.push("/login"))
      .catch((error) => console.error("Error during logout:", error));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4 w-full">
      <header className="py-4 text-black text-center flex justify-between items-center">
        {currentQuestion > 1 && (
          <button
            onClick={() => router.push(`/question/${currentQuestion - 1}`)}
            className="flex items-center bg-transparent px-4 py-2"
          >
            <BackIcon />
          </button>
        )}
        <div className="w-20"></div>
        <div>
          <form action="/auth/logout" method="post">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleLogout}
            >
              logout
            </button>
          </form>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full md:w-4/5 lg:w-3/5 max-w-xl bg-white p-8 rounded shadow">
          <h2 className="text-xl text-black mb-4">{question}</h2>
          {children}
        </div>
      </main>
    </div>
  );
};

export default QuestionLayout;
