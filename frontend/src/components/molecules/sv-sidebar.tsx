import Link from "next/link";
import { Label } from "../atoms/label";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../atoms/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../atoms/dropdown-menu";
import { ChevronUp } from "lucide-react";

export function SVSidebar() {
  return (
    <Sidebar className="w-40 border-black text-[#f0f0f0]" >
        <SidebarHeader className="bg-[#292929] font-bold">Navigation</SidebarHeader>
        <SidebarContent className="bg-[#292929]">
            <SidebarMenu>
                <SidebarMenuItem key="dashboard">
                    <SidebarMenuButton asChild>
                        <Link href="/dashboard">
                            <Label>Dashboard</Label>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem key="statistics">
                    <SidebarMenuButton asChild>
                        <Link href="/dashboard">
                            <Label>Statistics</Label>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem key="settings">
                    <SidebarMenuButton asChild>
                        <Link href="/dashboard">
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
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton>
                                <Label>Username</Label>
                                <ChevronUp className="ml-auto" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                        side="top"
                        className="w-[--radix-popper-anchor-width]">
                            <DropdownMenuItem>
                                <Link href="/account">
                                    <Label>Account</Label>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href="/logout">
                                    <Label>Logout</Label>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}