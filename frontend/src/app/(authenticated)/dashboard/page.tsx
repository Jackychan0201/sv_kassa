"use client";

import { useUser } from "@/components/providers/user-provider";

export default function DashboardPage() {
  const user = useUser();

  return (
    <>
      <h1 className="text-4xl font-bold mt-8">Welcome, {user.name}!</h1>
      <p className="mb-8">This is your dashboard. Your role is {user.role}</p>
    </>
  );
}
