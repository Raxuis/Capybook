import {fetcher} from "@/utils/fetcher";
import {Prisma} from "@prisma/client";
import {useCallback} from "react";
import useSWR from "swr";

export type UserWithRelations = Prisma.UserGetPayload<{
    include: {
        UserBook: { include: { Book: true } },
        UserBookWishlist: { include: { Book: true } },
        BookReview: { include: { Book: true } },
        ReadingGoal: true
    }
}>;

const SWR_CONFIG = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
    keepPreviousData: true
};

export function useUser(userId?: string) {
    const swrKey = userId ? `/api/user/${userId}` : null;

    const {data, error, isLoading, isValidating, mutate} = useSWR<UserWithRelations>(
        swrKey,
        fetcher<UserWithRelations>,
        SWR_CONFIG
    );

    const refreshUser = useCallback(async () => {
        if (swrKey) await mutate();
    }, [mutate, swrKey]);

    return {
        user: data,
        isLoading,
        isValidating,
        isError: Boolean(error),
        refreshUser
    };
}
