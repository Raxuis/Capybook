import {Layout} from "@/components/Layout";
import {getDailyBookWithDetails} from "@/actions/daily-book";
import {DailyBookHeader} from "./DailyBookHeader";
import {DailyBookContent} from "./DailyBookContent";
import {LoginPrompt} from "./Error/LoginPrompt";
import {ErrorState} from "./Error/ErrorState";

interface User {
    id: string;
    username?: string;
    role: string;
}

interface DailyBookProps {
    user: User | null;
}

export default async function DailyBook({user}: DailyBookProps) {
    if (!user || !user.id) {
        return (
            <Layout>
                <LoginPrompt/>
            </Layout>
        );
    }

    const dailyBook = await getDailyBookWithDetails(user.id);

    if (!dailyBook) {
        return (
            <Layout>
                <ErrorState message="Livre du jour indisponible"/>
            </Layout>
        );
    }

    return (
        <Layout>
            <div
                className="relative mb-20 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 text-gray-800">
                <DailyBookHeader/>
                <DailyBookContent dailyBook={dailyBook}/>
            </div>
        </Layout>
    );
}