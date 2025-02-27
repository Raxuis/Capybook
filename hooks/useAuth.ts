import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {userStore} from "@/store/userStore";

export const useAuth = () => {
    const { data: session } = useSession();
    const isAuthenticated = userStore((state) => state.isAuthenticated);
    const setAuthenticated = userStore((state) => state.setAuthenticated);

    useEffect(() => {
        if (session) {
            setAuthenticated(true);
        } else {
            setAuthenticated(false);
        }
    }, [session, setAuthenticated]);

    return {
        isAuthenticated,
        setAuthenticated,
    };
};
