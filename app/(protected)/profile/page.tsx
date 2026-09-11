"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { CgProfile } from "react-icons/cg";

export default function HeroProfile() {
  const { data: session } = useSession();

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

        {/* Azioni */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/auth" })}
            className="w-full sketch-btn-orange py-2 text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            Esci dall&apos;app
          </button>

          <Link
            href="/"
            className="block text-center text-xs font-sketch text-zinc-500 hover:text-zinc-900 uppercase tracking-wider transition-colors"
          >
            ← Torna alla Home
          </Link>
        </div>
      </div>
    </main>
  );
}

