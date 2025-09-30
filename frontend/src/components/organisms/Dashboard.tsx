"use client";

import DotGrid from "./DotGrid";
import { SVSidebar } from "../molecules/sv-sidebar";
import { SidebarProvider } from "../atoms/sidebar";


interface DashboardProps {
  user: { name: string };
}

export default function Dashboard({ user }: DashboardProps) {
  return (
  <div className="bg-[#1e1e1e] relative h-screen">
    <SidebarProvider defaultOpen={true}>
    <SVSidebar user={user}/>
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

    <div className="relative z-10 flex flex-col mx-auto items-center justify-center text-[#f0f0f0]">
      <h1 className="text-4xl font-bold mt-8">Welcome, {user.name}!</h1>
      <p className="mb-8">This is your dashboard.</p>
    </div>
      </SidebarProvider>
  </div>
  );
}
