"use client";

import { createContext, useContext, useState } from "react";

export type User = {
  name: string;
  role: string;
  email: string;
  shopId: string;
  timer: string;
};

type UserContextValue = {
  user: User;
  setTimer: (time: string) => void;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({
  user: initialUser,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User>(initialUser);

  const setTimer = (time: string) => setUser((u) => ({ ...u, timer: time }));

  return <UserContext.Provider value={{ user, setTimer }}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}
