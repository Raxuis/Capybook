"use client";

import {memo} from "react";
import {DashboardLayout} from "@/components/Layout";
import ChallengeHeader from "@/components/Challenges/ChallengeHeader/ChallengeHeader";
import ChallengeTabs from "@/components/Challenges/ChallengeTabs/ChallengeTabs";
import {useUser} from "@/hooks/useUser";
import {LoadingState, ErrorState} from "@/components/common";

const ChallengesContent = memo(() => {
    const {user, isError, isLoading, isValidating} = useUser();

    if ((isLoading || isValidating) && !user) {
        return (
            <LoadingState
                message="Chargement des challenges..."
                className="min-h-screen"
            />
        );
    }

    if (isError) {
        return (
            <ErrorState
                title="Erreur lors du chargement des challenges"
                message="Veuillez réessayer ultérieurement"
                onRetry={() => window.location.reload()}
                className="min-h-screen"
            />
        );
    }

    if (!user) {
        return (
            <ErrorState
                title="Utilisateur non trouvé"
                message="Impossible de charger les informations utilisateur"
                variant="warning"
                className="min-h-screen"
            />
        );
    }

    return (
        <DashboardLayout>
            <ChallengeHeader/>
            <ChallengeTabs/>
        </DashboardLayout>
    );
});

ChallengesContent.displayName = 'ChallengesContent';

export default ChallengesContent;
