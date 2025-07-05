import {Layout} from "@/components/Layout";
import {getDailyBookWithDetails} from "@/actions/daily-book";
import DailyBookCard from "@/components/DailyBook/DailyBookCard";

export default async function DailyBook({user}: {
    user: {
        id: string;
        username?: string;
        role: string;
    } | null;
}) {
    if (!user || !user.id) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center h-full">
                    <h1 className="text-2xl font-bold mb-4">Veuillez vous connecter</h1>
                    <p className="text-muted-foreground">Pour accéder au livre du jour, veuillez vous connecter.</p>
                </div>
            </Layout>
        );
    }

    const dailyBook = await getDailyBookWithDetails(user.id);

    if (!dailyBook) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center h-full">
                    <h1 className="text-2xl font-bold mb-4">Livre du jour indisponible</h1>
                    <p className="text-muted-foreground">Aucun livre du jour n&#39;est disponible pour le moment.</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="flex flex-col p-4">
                <h1 className="text-2xl font-bold mb-4">Livre du jour</h1>
                <p className="text-muted-foreground mb-6">
                    Bienvenue dans la toute dernière fonctionnalité de Capybook : le livre du jour !
                    Chaque jour, nous vous proposons un livre différent à découvrir, lire et surtout à apprécier.
                </p>
            </div>

            <DailyBookCard dailyBook={dailyBook}/>
        </Layout>
    );
};