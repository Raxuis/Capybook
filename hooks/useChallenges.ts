import axios from "axios";
import {useCallback, useMemo} from "react";
import z from "zod";
import {ChallengeFormSchema} from "@/utils/zod";
import {useUser} from "@/hooks/useUser";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export function useChallenges(userId?: string) {
    const {user, refreshUser} = useUser(userId);

    const createChallenge = useCallback(async (challengeData: z.infer<typeof ChallengeFormSchema>) => {
        if (!userId) return;

        try {
            const response = await api.post("/user/challenges", {
                userId,
                ...challengeData,
            });
            await refreshUser();
            return response;
        } catch (error) {
            console.error("Erreur:", error);
            throw new Error("Erreur lors de la création du challenge");
        }
    }, [userId, refreshUser]);

    const deleteChallenge = useCallback(async (challengeId: string) => {
        if (!userId) return;

        try {
            await api.delete(`/user/challenges`, {
                data: {
                    userId,
                    challengeId,
                },
            });
            await refreshUser();
            return true;
        } catch (error) {
            console.error("Erreur:", error);
            throw new Error("Erreur lors de la suppression du challenge");
        }
    }, [userId, refreshUser]);

    const currentChallenges = useMemo(() => {
        return user?.ReadingGoal?.filter(goal => new Date(goal.deadline) >= new Date()) || [];
    }, [user]);

    const pastChallenges = useMemo(() => {
        return user?.ReadingGoal?.filter(goal => new Date(goal.deadline) < new Date()) || [];
    }, [user]);

    return {
        createChallenge,
        deleteChallenge,
        currentChallenges,
        pastChallenges,
    };
}
