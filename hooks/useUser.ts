import { fetcher } from "@/utils/fetcher";
import { Prisma } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { useUserStore } from "@/store/useUserStore";

export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    UserBook: { include: { Book: true } },
    UserBookWishlist: { include: { Book: true } },
    BookReview: { include: { Book: true } },
    UserBookNotes: { include: { Book: true } },
    ReadingGoal: true,
    UserBadge: { include: { Badge: true } },
  }
}>;

const SWR_CONFIG = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  revalidateIfStale: true,
  dedupingInterval: 60000,
  keepPreviousData: false
};

export function useUser() {
  const userId = useUserStore((state) => state.userId);
  const swrKey = userId ? `/api/user/${userId}` : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR<UserWithRelations>(
    swrKey,
    fetcher<UserWithRelations>,
    SWR_CONFIG
  );

  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (userId !== undefined) {
      setIsInitializing(false);
    }
  }, [userId]);

  const refreshUser = useCallback(async () => {
    if (swrKey) await mutate();
  }, [mutate, swrKey]);

  return {
    user: data,
    isLoading: isLoading || isInitializing, // Fusion des états de chargement pour une meilleure expérience utilisateur
    isValidating,
    isError: Boolean(error),
    refreshUser,
  };
}
