import { signIn } from "next-auth/react";

type AuthResult = { success: true } | { success: false; error: string };

export async function registerUser(
  username: string,
  email: string,
  password: string,
): Promise<AuthResult> {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      return {
        success: true,
      };
    }

    return {
      success: false,
      error: data.message ?? "Registrazione non riuscita...",
    };
  } catch (error) {
    return {
      success: false,
      error: "Registrazione non avvenuta...",
    };
  }
}

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResult> {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      return {
        success: false,
        error: "Credenziali Invalide...",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Errore nella funzione di login in loginUser...",
    };
  }
}

export async function deleteUser(
  email: string,
  password: string,
): Promise<AuthResult> {
  try {
    const result = await fetch("/api/auth/delete", {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (result.ok) {
      return {
        success: true,
      };
    }

    return {
      success: false,
      error: "Credenziali invalide",
    };
  } catch (error) {
    return {
      success: false,
      error: "Errore nella funzione di eliminazione dell'utente",
    };
  }
}
