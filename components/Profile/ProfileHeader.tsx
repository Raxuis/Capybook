'use client';

import React, {memo, useMemo} from 'react';
import {User, Calendar, PenTool, UserPlus, UserMinus, Loader2} from "lucide-react";
import {Button, buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {generateGradientClasses} from "@/lib/helpers/color";
import {User as UserType, Badge} from "@/types/profile";
import {motion} from "motion/react";

interface ProfileHeaderProps {
    user: UserType;
    isOwner: boolean;
    badges?: Badge[];
    isFollowing?: boolean;
    isFollowingOrUnfollowing: boolean;
    onEditProfile: () => void;
    onFollowToggle: () => void;
}

const ProfileHeader = memo<ProfileHeaderProps>(({
                                                    user,
                                                    isOwner,
                                                    badges,
                                                    isFollowing,
                                                    isFollowingOrUnfollowing,
                                                    onEditProfile,
                                                    onFollowToggle
                                                }) => {
    const memberSince = useMemo(() =>
            new Date(user.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long'
            }),
        [user.createdAt]
    );

    const {headerGradient, headerGradientStyle, avatarGradient, avatarGradientStyle} = useMemo(() =>
            generateGradientClasses(user.favoriteColor),
        [user.favoriteColor]
    );

    const displayName = user.name || user.username;
    const avatarInitial = displayName[0].toUpperCase();

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, ease: "easeOut"}}
            className="bg-card mb-6 overflow-hidden rounded-xl border shadow-lg"
        >
            <motion.div
                initial={{scale: 1.1}}
                animate={{scale: 1}}
                transition={{duration: 0.6, ease: "easeOut"}}
                className={cn("h-20 sm:h-32", headerGradient)}
                style={headerGradientStyle}
            />
            <div className="relative px-4 pb-6 sm:px-6">
                <div className="-mt-12 mb-4 flex flex-col sm:-mt-16 sm:flex-row sm:items-end">
                    <motion.div
                        initial={{scale: 0.8, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        transition={{duration: 0.5, delay: 0.2, ease: "easeOut"}}
                        className="relative self-center sm:self-auto"
                    >
                        <motion.div
                            whileHover={{scale: 1.05}}
                            transition={{duration: 0.2}}
                            className={cn("w-24 h-24 sm:w-28 md:w-32 sm:h-28 md:h-32 rounded-full border-4 border-background shadow-xl flex items-center justify-center", avatarGradient)}
                            style={avatarGradientStyle}
                        >
                            <span className="text-3xl font-bold text-white">
                                {avatarInitial}
                            </span>
                        </motion.div>
                        {badges && badges.length > 0 && (
                            <motion.div
                                initial={{scale: 0}}
                                animate={{scale: 1}}
                                transition={{duration: 0.3, delay: 0.4, type: "spring"}}
                                className="border-background absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-full border-2 bg-yellow-500 text-xs font-semibold text-yellow-950 shadow-md"
                                title={`${badges.length} badges obtenus`}
                            >
                                {badges.length}
                            </motion.div>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.5, delay: 0.3}}
                        className="mt-4 text-center sm:ml-6 sm:mt-0 sm:text-left"
                    >
                        <h1 className="text-foreground text-2xl font-bold md:text-3xl">{displayName}</h1>
                        <div className="text-muted-foreground mt-2 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                            <span className="flex items-center text-sm">
                                <User size={16} className="mr-1.5"/>
                                @{user.username}
                            </span>
                            <span className="flex items-center text-sm">
                                <Calendar size={16} className="mr-1.5"/>
                                Membre depuis {memberSince}
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, x: 20}}
                        animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.5, delay: 0.4}}
                        className="mt-4 text-center max-sm:w-full sm:ml-auto sm:mt-0 sm:text-left"
                    >
                        {isOwner ? (
                            <Button
                                className={cn(buttonVariants({
                                    variant: "default",
                                    size: "sm",
                                }), "px-4 py-2 rounded-md transition-all shadow-md hover:shadow-lg flex items-center mx-auto sm:mx-0")}
                                onClick={onEditProfile}
                            >
                                <PenTool size={16} className="mr-2"/>
                                Modifier le profil
                            </Button>
                        ) : (
                            <Button
                                className={cn(buttonVariants({
                                    size: "sm",
                                }), "px-4 py-2 rounded-md transition-all shadow-md hover:shadow-lg flex items-center mx-auto sm:mx-0")}
                                onClick={onFollowToggle}
                                disabled={isFollowingOrUnfollowing}
                            >
                                {isFollowingOrUnfollowing ? (
                                    <>
                                        <Loader2 className="mr-2 animate-spin" size={16}/>
                                        Chargement...
                                    </>
                                ) : isFollowing ? (
                                    <>
                                        <UserMinus size={16} className="mr-2"/>
                                        Se désabonner
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={16} className="mr-2"/>
                                        S&#39;abonner
                                    </>
                                )}
                            </Button>
                        )}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
});

ProfileHeader.displayName = 'ProfileHeader';

export default ProfileHeader;
