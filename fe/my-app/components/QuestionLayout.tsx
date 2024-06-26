import React from "react";
import { useRouter } from "next/navigation";
import BackIcon from "./Icon/BackIcon";
import LogoutIcon from "./Icon/LogoutIcon";

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
        <div className="text-center">
          <form action="/auth/logout" method="post">
            <button className="px-4 py-2 rounded" onClick={handleLogout}>
              <LogoutIcon />
            </button>
          </form>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center">
        <div className="w-full h-full bg-white p-8 rounded shadow">
          <h2 className="text-3xl text-black mb-4">{question}</h2>
          {children}
        </div>
      </main>
    </div>
  );
};

export default QuestionLayout;
