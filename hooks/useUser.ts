import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { Prisma } from "@prisma/client";

type User = Prisma.UserGetPayload<object>;

export function useUser(userId?: string) {
    const { data, error, isLoading } = useSWR<User>(
        userId ? `/api/user/${userId}` : null,
        fetcher<User>
    );

    return {
        user: data,
        isLoading,
        isError: !!error,
    };
}
