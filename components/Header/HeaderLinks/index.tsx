import React from 'react';
import {motion} from "motion/react";
import {currentUser} from "@/actions/auth/current-user";

type Props = {
    headerElementsLength: number;
    handleSignOut: () => void;
}

const HeaderLinks = async ({headerElementsLength, handleSignOut}: Props) => {
    const user = await currentUser();
    if (!user) {
        return null;
    }
    return (
        user ? (
            <>
                <motion.button
                    onClick={handleSignOut}
                    className="hover:text-primary text-sm font-medium transition-colors"
                    whileHover={{scale: 1.1}}
                    initial={{opacity: 0, x: -20}}
                    animate={{opacity: 1, x: 0}}
                    transition={{duration: 0.3, delay: headerElementsLength * 0.1}}
                >
                    Déconnexion
                </motion.button>
                <motion.a
                    href={`/profile/@${user.username}`}
                    className="hover:text-primary text-sm font-medium transition-colors"
                    whileHover={{scale: 1.1}}
                    initial={{opacity: 0, x: -20}}
                    animate={{opacity: 1, x: 0}}
                    transition={{duration: 0.3, delay: headerElementsLength * 0.1}}
                >
                    Mon profil
                </motion.a>
            </>
        ) : (
            <motion.a
                href="/login"
                className="hover:text-primary text-sm font-medium transition-colors"
                whileHover={{scale: 1.1}}
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.3, delay: headerElementsLength * 0.1}}
            >
                Se connecter
            </motion.a>
        )
    );
};

export default HeaderLinks;
