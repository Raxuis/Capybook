import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";
import {Prisma} from "@prisma/client";
import {useMemo} from "react";

export type UserWithRelations = Prisma.UserGetPayload<{
    include: {
        UserBook: {
            include: {
                Book: true
            }
        },
        UserBookWishlist: {
            include: {
                Book: true
            }
        },
        BookReview: {
            include: {
                Book: true
            }
        }
    }
}>;

const SWR_CONFIG = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
    keepPreviousData: true
};

export function useUser(userId?: string) {
    const swrKey = useMemo(() =>
            userId ? `/api/user/${userId}` : null,
        [userId]);

    const {data, error, isLoading, isValidating, mutate} = useSWR<UserWithRelations>(
        swrKey,
        fetcher<UserWithRelations>,
        SWR_CONFIG
    );

    const refreshUser = useMemo(() => async () => {
        if (swrKey) await mutate();
    }, [mutate, swrKey]);

    return useMemo(() => ({
        user: data,
        isLoading,
        isValidating,
        isError: Boolean(error),
        refreshUser
    }), [data, error, isLoading, isValidating, refreshUser]);
}