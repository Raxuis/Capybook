import AdminDashboard from "@/components/admin/dashboard";
import {redirect} from "next/navigation";
import {getAll} from "@/actions/admin/stats";
import {currentUser} from "@/actions/auth/current-user";

export default async function AdminDashboardPage() {
    const user = await currentUser();

    if (!user || user.role !== "ADMIN") {
        redirect("/auth/signin?callbackUrl=/admin/dashboard");
    }

    const initialStats = await getAll("month");

    if (!initialStats) {
        return (
            <div className="flex h-full w-full items-center justify-center p-8">
                <div className="rounded-lg bg-destructive/10 p-6 text-center">
                    <h2 className="mb-2 text-xl font-semibold text-destructive">
                        Erreur de chargement
                    </h2>
                    <p>Impossible de charger les données du tableau de bord.</p>
                </div>
            </div>
        );
    }

    return <AdminDashboard initialStats={initialStats}/>;
}