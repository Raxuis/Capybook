import axios from "axios";
import {useCallback} from "react";
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
    const {refreshUser} = useUser(userId);

    const createChallenge = useCallback(async (challengeData: z.infer<typeof ChallengeFormSchema>) => {
        console.log("Création du challenge:", challengeData);
        console.log("userId:", userId);
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
    }, [userId]);

    const deleteChallenge = useCallback(async (challengeId: string) => {
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
    }, []);

    return {
        createChallenge,
        deleteChallenge,
    };
}