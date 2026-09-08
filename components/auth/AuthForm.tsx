"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { registerUser } from "@/lib/auth/authFunctions";
import { AuthFormState } from "@/lib/auth/types";

// useFormStatus DEVE essere chiamato all'interno di un componente figlio di <form>
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2.5 px-4 font-sketch text-lg tracking-wider uppercase bg-orange-500 hover:bg-orange-600 text-white font-bold border-2 border-zinc-900 rounded shadow-[3px_3px_0px_#18181b] active:translate-y-0.5 active:shadow-[1px_1px_0px_#18181b] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
    >
      {pending ? "Registrazione in corso..." : "Registrati"}
    </button>
  );
}

const initialState: AuthFormState = {
  success: false,
  message: "",
};

export default function AuthForm() {
  // In React 19 si usa useActionState da 'react' (evoluzione di useFormState)
  const [state, formAction] = useActionState(registerUser, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.message && (
        <div
          className={`p-3 rounded border-2 text-sm font-medium ${
            state.success
              ? "bg-teal-50 border-teal-600 text-teal-900"
              : "bg-red-50 border-red-500 text-red-900"
          }`}
        >
          {state.message}
        </div>
      )}

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-sketch font-bold uppercase tracking-wider text-zinc-700 mb-1"
        >
          Nome utente
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          placeholder="mario_rossi"
          className="w-full px-3 py-2 border-2 border-zinc-900 rounded bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-sketch font-bold uppercase tracking-wider text-zinc-700 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="mario@esempio.it"
          className="w-full px-3 py-2 border-2 border-zinc-900 rounded bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-sketch font-bold uppercase tracking-wider text-zinc-700 mb-1"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          className="w-full px-3 py-2 border-2 border-zinc-900 rounded bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <SubmitButton />
    </form>
  );
}

