import axios from "axios";
import {useCallback} from "react";
import z from "zod";
import {ChallengeFormSchema} from "@/utils/zod";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export function useChallenges(userId?: string) {
    // const {user, isLoading: isUserLoading, refreshUser} = useUser(userId);

    const createChallenge = useCallback(async (challengeData: z.infer<typeof ChallengeFormSchema>) => {
        console.log("Création du challenge:", challengeData);
        console.log("userId:", userId);
        if (!userId) return;

        try {
            return await api.post("/user/challenges", {
                userId,
                ...challengeData,
            });
        } catch (error) {
            console.error("Erreur:", error);
            throw new Error("Erreur lors de la création du challenge");
        }
    }, [userId]);

    return {
        createChallenge,
    };
}