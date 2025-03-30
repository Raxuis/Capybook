import {auth} from "@/auth";
import ClientHydration from "@/hydratation/ClientHydratation";
import ChallengesContent from "@/components/Challenges/ChallengesContent";

export const metadata = {
    title: "Livre Track Challenges",
    description: "Mes challenges de lecture",
};

export default async function Challenges() {
    const session = await auth();

    return (
        <ClientHydration userId={session?.user?.id}>
            <ChallengesContent/>
        </ClientHydration>
    );
}