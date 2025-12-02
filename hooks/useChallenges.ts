import { useCallback, useMemo } from "react";
import { z } from "zod";
import { CreateChallengeSchema } from "@/lib/validators";
import { useUser } from "@/hooks/useUser";
import { api } from "@/lib/helpers/api";
import type { ReadingGoal } from "@prisma/client";

/**
 * Challenge data type
 */
export type ChallengeData = z.infer<typeof CreateChallengeSchema>;

/**
 * Hook return type
 */
export interface UseChallengesReturn {
  createChallenge: (challengeData: ChallengeData) => Promise<unknown> | undefined;
  updateChallenge: (challengeId: string, challengeData: ChallengeData) => Promise<unknown> | undefined;
  deleteChallenge: (challengeId: string) => Promise<void>;
  currentChallenges: ReadingGoal[];
  pastChallenges: ReadingGoal[];
}

/**
 * Custom hook for managing reading challenges/goals
 *
 * Provides functions to create, update, and delete challenges,
 * as well as computed lists of current and past challenges.
 *
 * @returns Challenge management functions and challenge lists
 *
 * @example
 * ```tsx
 * const { createChallenge, currentChallenges, deleteChallenge } = useChallenges();
 *
 * const handleCreate = async () => {
 *   await createChallenge({
 *     type: "BOOKS",
 *     target: 50,
 *     deadline: new Date("2024-12-31")
 *   });
 * };
 * ```
 */
export function useChallenges(): UseChallengesReturn {
  const { user, refreshUser } = useUser();

  const createChallenge = useCallback(
    async (challengeData: ChallengeData) => {
      if (!user?.id) return;

      const res = await api.post("/user/challenges", {
        userId: user.id,
        ...challengeData,
      });
      await refreshUser();
      return res;
    },
    [user, refreshUser]
  );

  const updateChallenge = useCallback(
    async (challengeId: string, challengeData: ChallengeData) => {
      if (!user?.id) return;

      const res = await api.put(`/user/challenges`, {
        userId: user.id,
        challengeId,
        ...challengeData,
      });
      await refreshUser();
      return res;
    },
    [user, refreshUser]
  );

  const deleteChallenge = useCallback(
    async (challengeId: string) => {
      if (!user?.id) return;

      try {
        await api.delete(`/user/challenges`, {
          data: { userId: user.id, challengeId },
        });
        await refreshUser();
      } catch (error) {
        console.error("Erreur:", error);
        throw new Error("Erreur lors de la suppression du challenge");
      }
    },
    [user, refreshUser]
  );

  const currentChallenges = useMemo(() => {
    if (!user?.ReadingGoal) return [];
    const now = new Date();
    return user.ReadingGoal.filter(
      (goal) => new Date(goal.deadline) >= now && !goal.completedAt
    );
  }, [user?.ReadingGoal]);

  const pastChallenges = useMemo(() => {
    if (!user?.ReadingGoal) return [];
    const now = new Date();
    return user.ReadingGoal.filter(
      (goal) => new Date(goal.deadline) < now || goal.completedAt
    );
  }, [user?.ReadingGoal]);

  return {
    createChallenge,
    updateChallenge,
    deleteChallenge,
    currentChallenges,
    pastChallenges,
  };
}
