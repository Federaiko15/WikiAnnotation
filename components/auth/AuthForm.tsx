"use client";

import { useState } from "react";
import { loginUser, registerUser } from "@/lib/auth/authFunctions";
import { useRouter } from "next/navigation";
import GitHubButton from "@/components/auth/GitHubButton";

export default function AuthForm() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [register, setRegister] = useState<boolean>(true);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (register) {
      if (!username.trim() || !password || !email.trim()) {
        setError("Tutti i campi sono necessari!");
        return;
      }
      setIsLoading(true);
      try {
        const response = await registerUser(
          username.trim(),
          email.trim(),
          password,
        );
        if (response.success) {
          setRegister(false);
        } else {
          setError(response.error);
        }
      } catch {
        setError("Errore imprevisto durante la registrazione.");
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!email.trim() || !password) {
        setError("Tutti i campi sono necessari!");
        return;
      }
      const response = await loginUser(email.trim(), password);
      if (response.success) {
        router.replace("/");
      } else {
        setError(response.error);
        return;
      }
    }
  };

  const toggleFunction = () => {
    setRegister((prev) => !prev);
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {register && (
        <div>
          <label
            htmlFor="username"
            className="block text-xs sm:text-sm font-sketch font-bold uppercase tracking-wider text-zinc-800 mb-1"
          >
            Nome utente
          </label>

          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="es. mario_rossi"
            className="w-full px-3.5 py-2.5 border-2 border-zinc-900 rounded bg-white text-zinc-900 text-sm placeholder:text-zinc-400 placeholder:italic shadow-[2px_2px_0px_#18181b] focus:outline-none focus:border-zinc-900 focus:ring-2 focus:ring-orange-400 focus:shadow-[3px_3px_0px_#ea580c] transition-all"
          />
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-xs sm:text-sm font-sketch font-bold uppercase tracking-wider text-zinc-800 mb-1"
        >
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="mario@esempio.it"
          className="w-full px-3.5 py-2.5 border-2 border-zinc-900 rounded bg-white text-zinc-900 text-sm placeholder:text-zinc-400 placeholder:italic shadow-[2px_2px_0px_#18181b] focus:outline-none focus:border-zinc-900 focus:ring-2 focus:ring-orange-400 focus:shadow-[3px_3px_0px_#ea580c] transition-all"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs sm:text-sm font-sketch font-bold uppercase tracking-wider text-zinc-800 mb-1"
        >
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-3.5 py-2.5 border-2 border-zinc-900 rounded bg-white text-zinc-900 text-sm placeholder:text-zinc-400 placeholder:italic shadow-[2px_2px_0px_#18181b] focus:outline-none focus:border-zinc-900 focus:ring-2 focus:ring-orange-400 focus:shadow-[3px_3px_0px_#ea580c] transition-all"
        />
      </div>

      {error && (
        <div className="p-2.5 border-2 border-red-600 bg-red-50 text-red-700 text-xs sm:text-sm rounded font-sketch font-bold shadow-[2px_2px_0px_#ef4444] flex items-center gap-2">
          <span className="text-base leading-none">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full sketch-btn-orange py-2.5 text-base flex items-center justify-center gap-2 mt-2 cursor-pointer transition-all"
      >
        {isLoading ? (
          <span>Elaborazione...</span>
        ) : (
          <>
            <span>{register ? "Registrati" : "Accedi"}</span>
            <span aria-hidden="true" className="font-sans font-bold">
              →
            </span>
          </>
        )}
      </button>

      <div className="relative my-4 flex items-center justify-center">
        <div className="w-full border-t-2 border-dashed border-zinc-200" />
        <span className="absolute bg-white px-2.5 font-sketch text-xs text-zinc-400 uppercase tracking-wider">
          oppure
        </span>
      </div>

      <GitHubButton
        text={register ? "Registrati con GitHub" : "Accedi con GitHub"}
      />

      <div className="pt-2">
        <button
          type="button"
          onClick={toggleFunction}
          className="w-full sketch-btn-white py-2 text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {register ? (
            <span>
              Hai già un account?{" "}
              <strong className="text-orange-600 underline decoration-2">
                Accedi
              </strong>
            </span>
          ) : (
            <span>
              Non hai un account?{" "}
              <strong className="text-orange-600 underline decoration-2">
                Registrati
              </strong>
            </span>
          )}
        </button>
      </div>
    </form>
  );
}
