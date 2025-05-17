import {SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/admin/sidebar/app-sidebar";
import {DashboardLayout} from "@/components/Layout";
import {Toaster} from "@/components/ui/toaster";
import {ReactNode} from "react";
import Header from "@/components/Header";

export default function AdminLayout({
                                        children,
                                    }: Readonly<{
    children: ReactNode;
}>) {
    return (
        <SidebarProvider className="flex flex-col">
            <AppSidebar/>
            <DashboardLayout>
                <Header isAdmin/>
                {children}
            </DashboardLayout>
            <Toaster/>
        </SidebarProvider>
    );
}