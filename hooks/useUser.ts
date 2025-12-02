import { fetcher } from "@/lib/helpers/api";
import { Prisma } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { useUserStore } from "@/store/useUserStore";

/**
 * Extended user type with all relations
 */
export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    UserBook: { include: { Book: true } };
    UserBookWishlist: { include: { Book: true } };
    BookReview: {
      include: {
        Book: true;
        SpecificFriend: true;
      };
    };
    UserBookNotes: { include: { Book: true } };
    ReadingGoal: true;
    UserBadge: { include: { Badge: true } };
    lentBooks: {
      include: {
        book: true;
        borrower: true;
      };
    };
    borrowedBooks: {
      include: {
        book: true;
        lender: true;
        borrower: true;
      };
    };
  };
}>;

/**
 * SWR configuration for user data
 */
const SWR_CONFIG = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  revalidateIfStale: true,
  dedupingInterval: 60000,
  keepPreviousData: false,
} as const;

/**
 * Hook return type
 */
export interface UseUserReturn {
  user: UserWithRelations | undefined;
  isLoading: boolean;
  isValidating: boolean;
  isError: boolean;
  refreshUser: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage current user data
 *
 * @returns User data, loading states, and refresh function
 *
 * @example
 * ```tsx
 * const { user, isLoading, refreshUser } = useUser();
 *
 * if (isLoading) return <Loading />;
 * if (!user) return <LoginPrompt />;
 *
 * return <div>Hello {user.username}</div>;
 * ```
 */
export function useUser(): UseUserReturn {
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
    if (swrKey) {
      await mutate();
    }
  }, [mutate, swrKey]);

  return {
    user: data,
    isLoading: isLoading || isInitializing,
    isValidating,
    isError: Boolean(error),
    refreshUser,
  };
}
