"use client";

import { logout } from "@/lib/api";
import { useRouter } from "next/navigation";

interface DashboardClientProps {
  user: { name: string };
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.name}</p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-md"
      >
        Logout
      </button>
    </div>
  );
}
