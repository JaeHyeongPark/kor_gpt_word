import React from "react";
import { useRouter } from "next/navigation";
import LogoutIcon from "./Icon/LogoutIcon";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("answers");
    fetch("/auth/logout", { method: "POST" })
      .then(() => router.push("/login"))
      .catch((error) => console.error("Error during logout:", error));
  };

  return (
    <button className="px-4 py-2 rounded" onClick={handleLogout}>
      <LogoutIcon />
    </button>
  );
};

export default LogoutButton;
