"use client";

import { UserContext } from "@/context/user";
import type { Session, User } from "next-auth";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export default function UserContextProvider({
  children,
  session,
}: Readonly<{ children: ReactNode; session: Session | null }>) {
  const [user, setUser] = useState<User | undefined>(session?.user);

  useEffect(() => {
    setUser(session?.user);
  }, [session]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
