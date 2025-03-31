import {useCallback} from "react";
import z from "zod";
import {CreateChallengeSchema} from "@/utils/zod";
import {useUser} from "@/hooks/useUser";
import {api} from "@/utils/api";

export function useChallenges() {
    const {user, refreshUser} = useUser();

    const createChallenge = useCallback(async (challengeData: z.infer<typeof CreateChallengeSchema>) => {
        if (!user?.id) return;

        try {
            const res = await api.post("/user/challenges", {userId: user.id, ...challengeData});
            await refreshUser();
            return res;
        } catch (error) {
            console.error("Erreur:", error);
            throw new Error("Erreur lors de la création du challenge");
        }
    }, [user, refreshUser]);

    const updateChallenge = useCallback(async (challengeId: string, challengeData: z.infer<typeof CreateChallengeSchema>) => {
        if (!user?.id) return;

        console.log("Updating challenge with ID:", challengeId, "and data:", challengeData);
        console.log("User ID:", user.id);
        console.log("Challenge id:", challengeId);

        try {
            const res = await api.put(`/user/challenges`, {
                userId: user.id,
                challengeId,
                ...challengeData
            });
            await refreshUser();
            return res;
        } catch (error) {
            console.error("Erreur:", error);
            throw new Error("Erreur lors de la mise à jour du challenge");
        }
    }, [user, refreshUser]);

    const deleteChallenge = useCallback(async (challengeId: string) => {
        if (!user?.id) return;

        try {
            await api.delete(`/user/challenges`, {
                data: {userId: user.id, challengeId},
            });
            await refreshUser();
        } catch (error) {
            console.error("Erreur:", error);
            throw new Error("Erreur lors de la suppression du challenge");
        }
    }, [user, refreshUser]);

    const currentChallenges = user?.ReadingGoal?.filter(goal => new Date(goal.deadline) >= new Date()) || [];
    const pastChallenges = user?.ReadingGoal?.filter(goal => new Date(goal.deadline) < new Date()) || [];

    return {
        createChallenge,
        updateChallenge,
        deleteChallenge,
        currentChallenges,
        pastChallenges,
    };
}
