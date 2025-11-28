import {SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/admin/sidebar/app-sidebar";
import {DashboardLayout} from "@/components/Layout";
import {Toaster} from "@/components/ui/toaster";
import {ReactNode} from "react";
import Header from "@/components/Header";
import {currentUser} from "@/actions/auth/current-user";
import {redirect} from "next/navigation";

export default async function AdminLayout({
                                        children,
                                    }: Readonly<{
    children: ReactNode;
}>) {
    const user = await currentUser();

    if (!user || user.role !== "ADMIN") {
        redirect("/auth/signin?callbackUrl=/admin");
    }
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