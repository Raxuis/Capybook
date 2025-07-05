import {Layout} from "@/components/Layout";

const DailyBook = () => {
    return (
        <Layout>
            <div className="flex flex-col p-4">
                <h1 className="text-2xl font-bold mb-4">Livre du jour</h1>
                <p className="text-muted-foreground mb-6">
                    Bienvenue dans la toute dernière fonctionnalité de Capybook : le livre du jour !
                    Chaque jour, nous vous proposons un livre différent à découvrir, lire et surtout à apprécier.
                </p>
            </div>
        </Layout>
    );
};

export default DailyBook;