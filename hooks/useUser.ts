import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";
import {Prisma} from "@prisma/client";
import {useEffect} from "react";

type UserWithRelations = Prisma.UserGetPayload<{
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

export function useUser(userId?: string) {
    useEffect(() => {
        console.log("🔍 Recherche de l'utilisateur... ");
    })
    const {data, error, isLoading, isValidating} = useSWR<UserWithRelations>(
        `/api/user/${userId || null}`,
        fetcher<UserWithRelations>,
        {revalidateOnFocus: false, revalidateOnReconnect: false}
    );

    return {
        user: data,
        isLoading,
        isValidating,
        isError: !!error,
    };
}
