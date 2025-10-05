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
  setName: (name: string) => void;
  setEmail: (email: string) => void;
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
  const setName = (name: string) => setUser((u) => ({ ...u, name }));
  const setEmail = (email: string) => setUser((u) => ({ ...u, email }));

  return (
    <UserContext.Provider value={{ user, setTimer, setName, setEmail }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}
