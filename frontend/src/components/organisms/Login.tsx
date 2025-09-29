"use client";

import { useState } from "react";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { login } from "@/lib/api";
import { useRouter } from "next/navigation";
import DotGrid from "./DotGrid";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="bg-[#1e1e1e] relative h-screen w-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
            <DotGrid 
            dotSize={4}
            gap={35}
            baseColor="#e0e0e0"
            activeColor="#c0c0c0"
            proximity={100}
            shockRadius={100}
            shockStrength={10}
            resistance={750}
            returnDuration={1.5}
            />
        </div>

        <form
            onSubmit={handleSubmit}
            className="relative p-8 rounded-md shadow-md w-96 h-50 z-10 flex flex-col items-center justify-center bg-[#f0f0f0]"
        >
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
            <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2"
            />
            <Button type="submit" className="mt-4 w-full">
            Login
            </Button>
        </form>
        </div>

  );
}
