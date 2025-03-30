"use client";

import {memo} from "react";
import {AlertCircle, Loader2} from "lucide-react";
import {DashboardLayout} from "@/components/Layout";
import ChallengeHeader from "@/components/Challenges/ChallengeHeader/ChallengeHeader";
import ChallengeTabs from "@/components/Challenges/ChallengeTabs/ChallengeTabs";
import {useUser} from "@/hooks/useUser";

const ChallengesContent = memo(() => {
    const {user, isError, isLoading, isValidating} = useUser();

    if ((isLoading || isValidating) && !user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2"/>
                <p className="text-muted-foreground">Chargement des challenges...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <AlertCircle className="h-8 w-8 text-destructive mb-2"/>
                <p className="font-medium">Erreur lors du chargement des challenges</p>
                <p className="text-muted-foreground mt-1">Veuillez réessayer ultérieurement</p>
            </div>
        );
    }

    if (!user) return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <AlertCircle className="h-8 w-8 text-amber-500 mb-2"/>
            <p className="font-medium">Utilisateur non trouvé</p>
        </div>
    );

    return (
        <DashboardLayout>
            <ChallengeHeader/>
            <ChallengeTabs/>
        </DashboardLayout>
    );
});

export default ChallengesContent;