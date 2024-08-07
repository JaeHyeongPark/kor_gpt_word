"use client";

import Link from "next/link";
import { SubmitButton } from "@/app/login/submit-button";
import { login, signup } from "@/app/login/actions";
import { useEffect, useState } from "react";

export default function LoginForm({
  searchParams,
}: {
  searchParams?: { message: string };
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    darkModeMediaQuery.addEventListener("change", handleChange);

    return () => {
      darkModeMediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </Link>

      <form
        className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        onSubmit={(e) => {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const timezoneInput = document.createElement("input");
          timezoneInput.type = "hidden";
          timezoneInput.name = "timezone";
          timezoneInput.value = tz;
          e.currentTarget.appendChild(timezoneInput);
        }}
      >
        <div className="flex justify-center mb-4">
          <div
            className="relative w-full max-w-sm"
            style={{ aspectRatio: "4 / 1" }}
          >
            <img
              src={
                isDarkMode
                  ? "/icons/main_title_white.svg"
                  : "/icons/main_title_black.svg"
              }
              alt="Service Logo"
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        </div>
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
        <SubmitButton
          formAction={login}
          className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Signing In..."
        >
          Sign In
        </SubmitButton>
        <SubmitButton
          formAction={signup}
          className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
          pendingText="Signing Up..."
        >
          Sign Up
        </SubmitButton>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
