import { DailyRecord } from "@/lib/types";

export const login = async (username: string, password: string) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: username, password }),
    credentials: "include", 
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Login failed");
  }

  return res.json();
};

export const logout = async () => {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include", 
  });

  if (!res.ok) {
    throw new Error("Logout failed");
  }

  return res.json();
};

export const getDailyRecords = async () => {
  const res = await fetch("/api/daily-records", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch daily records");
  return res.json();
};

export const getTodaysRecord = async (date: string): Promise<DailyRecord[]> => {
  const res = await fetch(
    `/api/daily-records/by-date?fromDate=${date}&toDate=${date}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch daily record");
  return res.json();
};
