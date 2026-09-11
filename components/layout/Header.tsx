"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { CgProfile } from "react-icons/cg";

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Nasconde l'header nella pagina di autenticazione
  if (pathname?.startsWith("/auth")) {
    return null;
  }

  return (
    <header className="header-container">
      <div className="header-wrapper">
        <Link
          href="/"
          className="inline-block transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <div className="sketchnote-title-box-sm px-3 py-1 text-base sm:text-lg">
            WikiAnnotation
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <span className="sketch-badge-orange hidden sm:inline-flex">
            ✦ AI Sketchnote
          </span>
          <span className="text-xs font-sketch uppercase tracking-wider text-zinc-500">
            Appunti Visivi Didattici
          </span>
          {!pathname?.startsWith("/profile") && (
            <Link
              href="/profile"
              className="flex items-center gap-1.5 sketch-btn-white py-1 px-2.5 text-xs"
            >
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={20}
                  height={20}
                  unoptimized
                  className="rounded-full"
                />
              ) : (
                <CgProfile className="text-base" />
              )}
              <span>Profile</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
