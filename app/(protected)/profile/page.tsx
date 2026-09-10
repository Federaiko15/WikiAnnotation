"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

export default function HeroProfile() {
  const { data: session } = useSession();
  return (
    <div>
      <span>{session?.user?.name} </span>
      <span>{session?.user?.email}</span>
      <button onClick={() => signOut({ callbackUrl: "/auth" })}>
        Esci dall'app
      </button>
    </div>
  );
}
