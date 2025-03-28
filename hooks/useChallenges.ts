import {useCallback} from "react";
import z from "zod";
import {ChallengeFormSchema} from "@/utils/zod";
import {useUser} from "@/hooks/useUser";
import {api} from "@/utils/api";

export function useChallenges(userId?: string) {
    const {user, refreshUser} = useUser(userId);

    const createChallenge = useCallback(async (challengeData: z.infer<typeof ChallengeFormSchema>) => {
        if (!userId) return;

        try {
            const res = await api.post("/user/challenges", {userId, ...challengeData});
            await refreshUser();
            return res;
        } catch (error) {
            console.error("Erreur:", error);
            throw new Error("Erreur lors de la création du challenge");
        }
    }, [userId, refreshUser]);

    const deleteChallenge = useCallback(async (challengeId: string) => {
        if (!userId) return;

        try {
            await api.delete(`/user/challenges`, {
                data: {userId, challengeId},
            });
            await refreshUser();
        } catch (error) {
            console.error("Erreur:", error);
            throw new Error("Erreur lors de la suppression du challenge");
        }
    }, [userId, refreshUser]);

    const currentChallenges = user?.ReadingGoal?.filter(goal => new Date(goal.deadline) >= new Date()) || [];
    const pastChallenges = user?.ReadingGoal?.filter(goal => new Date(goal.deadline) < new Date()) || [];

    return {
        createChallenge,
        deleteChallenge,
        currentChallenges,
        pastChallenges,
    };
}
