"use client";

import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";

interface GitHubButtonProps {
  text?: string;
  className?: string;
}

export default function GitHubButton({
  text = "Continua con GitHub",
  className = "",
}: GitHubButtonProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("github", { callbackUrl: "/" });
    } catch (err) {
      console.error("Errore durante il login con GitHub:", err);
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={isLoading}
      className={`w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white border-2 border-zinc-900 rounded font-sketch font-bold tracking-wider uppercase text-sm sm:text-base shadow-[3px_3px_0px_#18181b] hover:shadow-[4px_4px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#18181b] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      <FaGithub className="text-xl shrink-0" />
      <span>{isLoading ? "Connessione..." : text}</span>
    </button>
  );
}

