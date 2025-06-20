import React, {memo, useMemo} from 'react';
import {User, Calendar, PenTool, UserPlus, UserMinus, Loader2} from "lucide-react";
import {Button, buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {generateGradientClasses} from "@/utils/color";
import {User as UserType, Badge} from "@/types/profile";

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
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className={`${headerGradient} h-20 sm:h-32`} style={headerGradientStyle}></div>
            <div className="relative px-4 sm:px-6 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end -mt-12 sm:-mt-16 mb-4">
                    <div className="relative self-center sm:self-auto">
                        <div
                            className={`w-24 h-24 sm:w-28 md:w-32 sm:h-28 md:h-32 rounded-full border-4 border-white shadow-lg ${avatarGradient} flex items-center justify-center`}
                            style={avatarGradientStyle}
                        >
                            <span className="text-3xl font-bold text-white">
                                {avatarInitial}
                            </span>
                        </div>
                        {badges && badges.length > 0 && (
                            <div
                                className="absolute -bottom-2 -right-2 bg-yellow-400 text-xs text-yellow-900 font-semibold rounded-full w-8 h-8 flex items-center justify-center border-2 border-white"
                                title={`${badges.length} badges obtenus`}
                            >
                                {badges.length}
                            </div>
                        )}
                    </div>

                    <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                        <h1 className="text-2xl md:text-3xl font-bold">{displayName}</h1>
                        <div
                            className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-gray-600">
                            <span className="flex items-center text-sm">
                                <User size={16} className="mr-1"/>
                                @{user.username}
                            </span>
                            <span className="flex items-center text-sm">
                                <Calendar size={16} className="mr-1"/>
                                Membre depuis {memberSince}
                            </span>
                        </div>
                    </div>

                    <div className="max-sm:w-full sm:ml-auto mt-4 sm:mt-0 text-center sm:text-left">
                        {isOwner ? (
                            <Button
                                className={cn(buttonVariants({
                                    variant: "default",
                                    size: "sm",
                                }), "px-4 py-2 rounded-md transition-colors shadow-md flex items-center mx-auto sm:mx-0")}
                                onClick={onEditProfile}
                            >
                                <PenTool size={16} className="mr-2"/>
                                Modifier le profil
                            </Button>
                        ) : (
                            <Button
                                className={cn(buttonVariants({
                                    size: "sm",
                                }), "px-4 py-2 rounded-md transition-colors shadow-md flex items-center mx-auto sm:mx-0")}
                                onClick={onFollowToggle}
                                disabled={isFollowingOrUnfollowing}
                            >
                                {isFollowingOrUnfollowing ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={16}/>
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
                    </div>
                </div>
            </div>
        </div>
    );
});

ProfileHeader.displayName = 'ProfileHeader';

export default ProfileHeader;