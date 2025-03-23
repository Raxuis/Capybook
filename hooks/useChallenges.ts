import useSWR from "swr";
import {useUser} from "@/hooks/useUser";
import axios from "axios";
import {useMemo, useCallback} from "react";
import z from "zod";
import {ChallengeFormSchema} from "@/utils/zod";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export function useChallenges(userId?: string) {
    const {user, isLoading: isUserLoading, refreshUser} = useUser(userId);

    const {data, error, isLoading} = useSWR(
        userId ? `/api/user/${userId}/challenges` : null,
        async (url) => {
            const response = await api.get(url);
            return response.data;
        },
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000, // 1 minute
        }
    );

    const createChallenge = useCallback(async (challengeData: z.infer<typeof ChallengeFormSchema>) => {
        if (!userId) return;
        try {
            const response = await api.post("/user/challenges", {
                userId,
                ...challengeData,
            });
            if (response.status !== 200) {
                throw new Error("Erreur lors de la création du challenge");
            }
            await refreshUser();
        } catch (error) {
            console.error("Erreur:", error);
        }
    }, [userId]);

    const challenges = useMemo(() => data || [], [data]);

    return {
        challenges,
        isLoading,
        isError: Boolean(error),
        isUserLoading,
        createChallenge,
    };
}