"use server";

import { AuthFormState } from "./types";

export async function registerUser(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const username = (formData.get("username") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();

  // Validazione di base
  if (!username || !email || !password) {
    return {
      success: false,
      message: "Tutti i campi sono obbligatori.",
    };
  }

  if (password.length < 6) {
    return {
      success: false,
      message: "La password deve contenere almeno 6 caratteri.",
    };
  }

  // Esempio log / elaborazione dati
  console.log("Registrazione completata per:", { username, email });

  return {
    success: true,
    message: `Benvenuto, ${username}! Registrazione completata con successo.`,
  };
}

