"use client";

import { useState } from "react";
import { Label } from "@/components/atoms/label";
import { Button } from "@/components/atoms/button";
import { useUser } from "@/components/providers/user-provider";
import { EditAccountSheet } from "@/components/organisms/edit-account-sheet";
import { LoadingFallback } from "@/components/molecules/loading-fallback";

export default function AccountPage() {
  const { user } = useUser();

  if (!user) return <LoadingFallback message="Loading..." />;

  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <Label className="text-4xl font-bold mt-8">Account</Label>
      <Label className="text-lg mb-8">Manage your profile and preferences here.</Label>

      <div className="flex flex-col gap-y-4">
        <Label className="text-xl">Name: {user!.name}</Label>
        <Label className="text-xl">Email: {user!.email}</Label>
      </div>

      <div className="flex flex-row mt-10 gap-x-5">
        <Button
          onClick={() => setOpen(true)}
          className="transition text-[#f0f0f0] delay-50 duration-200 ease-in-out hover:-translate-y-0 hover:scale-105 hover:bg-[#414141]"
        >
          Change Account Data
        </Button>
      </div>

      <EditAccountSheet open={open} onOpenChange={setOpen} />
    </div>
  );
}
