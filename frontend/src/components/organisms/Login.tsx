"use client";

import { useState } from "react";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { login } from "@/lib/api";
import { useRouter } from "next/navigation";
import DotGrid from "./DotGrid";
import { Label } from "@radix-ui/react-label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/molecules/card";
import { toast } from "sonner";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      const error = err.message.split(",");
      toast.error(error[0]);
    }
  };

  return (
    <div className="bg-[#1e1e1e] relative h-screen w-screen flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <DotGrid
          dotSize={4}
          gap={35}
          baseColor="#666666"
          activeColor="#e0e0e0"
          proximity={100}
          shockRadius={100}
          shockStrength={10}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      <Card className="relative z-10 w-96 shadow-lg border-2 border-[#333333]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-[#212121]">Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button type="submit" className="w-full" onClick={handleSubmit}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
