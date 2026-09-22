"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { CgProfile } from "react-icons/cg";
import { FaTrashAlt, FaExclamationTriangle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useState } from "react";
import { deleteUser } from "@/lib/auth/authFunctions";

export default function HeroProfile() {
  const { data: session } = useSession();
  const [password, setPassword] = useState<string>("");
  const [wantDelete, setWantDelete] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleDeleteUserAccount = async () => {
    if (!session?.user?.email) {
      setError("Email utente non disponibile nella sessione.");
      return;
    }

    if (!password.trim()) {
      setError("Inserisci la password per confermare l'eliminazione.");
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      const result = await deleteUser(session.user.email, password);
      if (result.success) {
        await signOut({ callbackUrl: "/auth" });
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Errore durante l'eliminazione:", err);
      setError("Errore durante l'eliminazione del profilo utente.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setWantDelete(false);
    setPassword("");
    setError("");
  };

  return (
    <main className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border-2 border-zinc-900 shadow-[5px_5px_0px_#ea580c] rounded-lg p-6 text-center">
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "Avatar"}
              width={80}
              height={80}
              unoptimized
              className="w-20 h-20 rounded-full border-2 border-zinc-900 object-cover shadow-[2px_2px_0px_#18181b]"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-orange-100 border-2 border-zinc-900 flex items-center justify-center shadow-[2px_2px_0px_#18181b]">
              <CgProfile className="text-4xl text-zinc-700" />
            </div>
          )}
        </div>

        {/* Info */}
        <h1 className="text-xl font-sketch font-bold text-zinc-900">
          {session?.user?.name || "Utente"}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 font-sans mt-0.5">
          {session?.user?.email}
        </p>

        <hr className="sketch-divider my-5" />

        {/* Azioni Principali */}
        {!wantDelete ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/auth" })}
              className="w-full sketch-btn-orange py-2 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiLogOut className="text-base" />
              Esci dall&apos;app
            </button>

            <button
              type="button"
              onClick={() => {
                setWantDelete(true);
                setError("");
                setPassword("");
              }}
              className="w-full sketch-btn-white py-2 text-xs text-red-600 hover:text-red-700 border-red-300 hover:border-red-500 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaTrashAlt className="text-xs" />
              Elimina l&apos;account
            </button>

            <Link
              href="/"
              className="block text-center text-xs font-sketch text-zinc-500 hover:text-zinc-900 uppercase tracking-wider transition-colors pt-1"
            >
              ← Torna alla Home
            </Link>
          </div>
        ) : (
          /* Modulo di Conferma Eliminazione */
          <div className="border-2 border-red-500 bg-red-50/70 rounded-md p-4 text-left shadow-[3px_3px_0px_#ef4444] space-y-3">
            <div className="flex items-center gap-2 text-red-700">
              <FaExclamationTriangle className="text-sm shrink-0" />
              <h2 className="text-xs font-sketch font-bold uppercase tracking-wide">
                Conferma Eliminazione
              </h2>
            </div>

            <p className="text-xs text-zinc-700 leading-snug">
              L&apos;operazione è <strong>irreversibile</strong>. Inserisci la tua password per confermare la cancellazione dell&apos;account:
            </p>

            <div className="space-y-1">
              <label
                htmlFor="delete-password-input"
                className="block text-[11px] font-sketch font-bold uppercase text-zinc-700"
              >
                Password
              </label>
              <input
                id="delete-password-input"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isDeleting && password.trim()) {
                    handleDeleteUserAccount();
                  }
                }}
                disabled={isDeleting}
                placeholder="Inserisci la tua password..."
                className="sketch-input text-xs py-2"
                autoFocus
              />
            </div>

            {error && (
              <div className="p-2 rounded border border-red-400 bg-white text-red-600 text-xs flex items-center gap-1.5 leading-snug">
                <span className="font-bold shrink-0">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                type="button"
                onClick={handleDeleteUserAccount}
                disabled={isDeleting || !password.trim()}
                className="sketch-btn-red text-xs py-2 px-3 flex-1 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <span className="inline-block animate-spin text-xs">⏳</span>
                    <span>Eliminazione...</span>
                  </>
                ) : (
                  <>
                    <FaTrashAlt className="text-xs" />
                    <span>Elimina definitivamente</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="sketch-btn-white text-xs py-2 px-3 flex-1 flex items-center justify-center gap-1 cursor-pointer"
              >
                Ci ho ripensato
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
