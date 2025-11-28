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
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <Loader2 className="text-primary mb-2 size-8 animate-spin"/>
                <p className="text-muted-foreground">Chargement des challenges...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <AlertCircle className="text-destructive mb-2 size-8"/>
                <p className="font-medium">Erreur lors du chargement des challenges</p>
                <p className="text-muted-foreground mt-1">Veuillez réessayer ultérieurement</p>
            </div>
        );
    }

    if (!user) return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <AlertCircle className="mb-2 size-8 text-amber-500"/>
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

ChallengesContent.displayName = 'ChallengesContent';

export default ChallengesContent;