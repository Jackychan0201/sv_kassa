import Link from "next/link";
import { Label } from "../atoms/label";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../atoms/sidebar";

export function SVSidebar() {
  return (
    <Sidebar>
        <SidebarHeader>Navigation</SidebarHeader>
        <SidebarContent>
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
    </Sidebar>
  )
}