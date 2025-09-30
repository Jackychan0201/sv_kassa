"use client";

import Link from "next/link";
import { Label } from "../atoms/label";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../atoms/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../atoms/dropdown-menu";
import { ChevronUp } from "lucide-react";
import { logout } from "@/lib/api";
import { useRouter } from "next/navigation";

interface SVSidebarProps {
  user: { name: string };
}

export function SVSidebar({user}: SVSidebarProps) {
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
    <Sidebar className="w-40 border-black text-[#f0f0f0]" >
        <SidebarHeader className="bg-[#292929] font-bold">Navigation</SidebarHeader>
        <SidebarContent className="bg-[#292929]">
            <SidebarMenu>
                <SidebarMenuItem key="dashboard">
                    <SidebarMenuButton className="hover:bg-[#969696]" asChild>
                        <Link href="/dashboard">
                            <Label>Dashboard</Label>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem key="statistics">
                    <SidebarMenuButton className="hover:bg-[#969696]" asChild>
                        <Link href="/statistics">
                            <Label>Statistics</Label>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem key="settings">
                    <SidebarMenuButton className="hover:bg-[#969696]" asChild>
                        <Link href="/settings">
                            <Label>Settings</Label>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="bg-[#292929]">
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="hover:bg-[#969696]" asChild>
                            <SidebarMenuButton>
                                <Label>{user.name}</Label>
                                <ChevronUp className="ml-auto" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                        side="top"
                        className="w-[--radix-popper-anchor-width] bg-[#969696]">
                            <DropdownMenuItem asChild>
                                <Link href="/account">
                                    <Label>Account</Label>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                    <Label onClick={handleLogout}>Logout</Label>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}