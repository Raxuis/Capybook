import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { Prisma } from "@prisma/client";

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
    const { data, error, isLoading } = useSWR<UserWithRelations>(
        userId ? `/api/user/${userId}` : null,
        fetcher<UserWithRelations>
    );

    return {
        user: data,
        isLoading,
        isError: !!error,
    };
}