"use client";
import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {useRouter} from "nextjs-toploader/app";
import useSWR from "swr";
import {formatUsername} from "@/lib/helpers/format";
import {fetcher} from "@/lib/helpers/api";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import EditProfileModal from "@/components/Profile/EditProfile/EditProfileModal";
import {LoadingState, ErrorState} from "@/components/common";
import {SWR_CONFIG} from "@/constants/SWR";
import {ProfileData} from "@/types/profile";
import {useUser} from "@/hooks/useUser";
import {motion, AnimatePresence} from "motion/react";
import ProfileHeader from "./ProfileHeader";
import OverviewTab from "./tabs/OverviewTab";
import BadgesTab from "./tabs/BadgesTab";
import RelationsTab from "./tabs/RelationsTab";
import BooksTab from "./tabs/BooksTab";
import ReviewsTab from "./tabs/ReviewsTab";

const ProfileContent = ({username}: { username: string }) => {
    const router = useRouter();
    const {user: currentUser} = useUser();
    const [isFollowingOrUnfollowing, setIsFollowingOrUnfollowing] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [isModalOpen, setModalOpen] = useState(false);

    const usernameParamFormatted = useMemo(() =>
            username ? formatUsername(username) : null,
        [username]
    );

    const profileUrl = useMemo(() =>
            usernameParamFormatted ? `/api/user/profile/${usernameParamFormatted}` : null,
        [usernameParamFormatted]
    );

    const {data, error, isLoading, mutate} = useSWR<ProfileData>(
        profileUrl,
        fetcher,
        {
            ...SWR_CONFIG,
            revalidateOnFocus: true,
            revalidateOnMount: true,
        }
    );

    useEffect(() => {
        if (!username) {
            router.push('/404');
        }
    }, [username, router]);

    const handleModalClose = useCallback(async (isOpen: boolean) => {
        if (!isOpen) {
            try {
                setTimeout(async () => {
                    await mutate();
                }, 200);
            } catch (error) {
                console.error("Erreur lors de la revalidation:", error);
            }
        }
        setModalOpen(isOpen);
    }, [mutate]);

    const handleFollowToggle = useCallback(async () => {
        if (!usernameParamFormatted || !data) return;

        setIsFollowingOrUnfollowing(true);
        try {
            const response = await fetch(`/api/user/follow/${usernameParamFormatted}`, {
                method: data.isFollowing ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data.isFollowing ? null : JSON.stringify({username: usernameParamFormatted}),
            });

            if (!response.ok) {
                throw new Error('Failed to update follow status');
            }

            await mutate();
        } catch (error) {
            console.error('Error updating follow status:', error);
        } finally {
            setIsFollowingOrUnfollowing(false);
        }
    }, [usernameParamFormatted, data, mutate]);

    const handleTabChange = useCallback((value: string) => {
        setActiveTab(value);
    }, []);

    const handleEditProfile = useCallback(() => {
        setModalOpen(true);
    }, []);

    if (isLoading) {
        return (
            <LoadingState
                message="Chargement des données..."
                className="min-h-screen"
            />
        );
    }

    if (error || !data) {
        return (
            <ErrorState
                title="Impossible de charger le profil"
                message="Veuillez réessayer ultérieurement ou vérifier l'URL."
                onRetry={() => mutate()}
                className="min-h-screen"
            />
        );
    }

    const {user, isOwner, stats, badges, detailedData, followers, following} = data;

    return (
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
            <ProfileHeader
                user={user}
                isOwner={isOwner}
                badges={badges}
                isFollowing={data.isFollowing}
                isFollowingOrUnfollowing={isFollowingOrUnfollowing}
                onEditProfile={handleEditProfile}
                onFollowToggle={handleFollowToggle}
            />

            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: 0.2}}
                className="bg-card mb-32 overflow-hidden rounded-xl border shadow-lg"
            >
                <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <div className="border-border overflow-hidden border-b">
                        <div className="overflow-x-auto overflow-y-hidden">
                            <TabsList className="flex w-max min-w-full bg-transparent p-0">
                                <TabsTrigger
                                    value="overview"
                                    className="data-[state=active]:text-primary data-[state=active]:border-primary min-w-[100px] shrink-0 whitespace-nowrap rounded-none px-2 py-3 text-xs font-medium transition-all data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-6 sm:py-4 sm:text-sm"
                                >
                                    <span className="hidden sm:inline">Vue d&#39;ensemble</span>
                                    <span className="sm:hidden">Aperçu</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="badges"
                                    className="text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-primary min-w-[80px] shrink-0 whitespace-nowrap rounded-none px-2 py-3 text-xs font-medium transition-all data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-6 sm:py-4 sm:text-sm"
                                >
                                    Badges
                                </TabsTrigger>
                                <TabsTrigger
                                    value="relations"
                                    className="text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-primary min-w-[80px] shrink-0 whitespace-nowrap rounded-none px-2 py-3 text-xs font-medium transition-all data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-6 sm:py-4 sm:text-sm"
                                >
                                    Relations
                                </TabsTrigger>
                                {isOwner && detailedData && (
                                    <>
                                        <TabsTrigger
                                            value="books"
                                            className="text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-primary min-w-[80px] shrink-0 whitespace-nowrap rounded-none px-2 py-3 text-xs font-medium transition-all data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-6 sm:py-4 sm:text-sm"
                                        >
                                            Livres
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="reviews"
                                            className="text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-primary min-w-[80px] shrink-0 whitespace-nowrap rounded-none px-2 py-3 text-xs font-medium transition-all data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-6 sm:py-4 sm:text-sm"
                                        >
                                            Avis
                                        </TabsTrigger>
                                    </>
                                )}
                            </TabsList>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <TabsContent value="overview" className="p-4 sm:p-6" key="overview">
                            <motion.div
                                initial={{opacity: 0, x: -20}}
                                animate={{opacity: 1, x: 0}}
                                exit={{opacity: 0, x: 20}}
                                transition={{duration: 0.3}}
                            >
                                <OverviewTab
                                    stats={stats}
                                    badges={badges}
                                    detailedData={detailedData}
                                    isOwner={isOwner}
                                    onTabChange={handleTabChange}
                                />
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="badges" className="p-4 sm:p-6" key="badges">
                            <motion.div
                                initial={{opacity: 0, x: -20}}
                                animate={{opacity: 1, x: 0}}
                                exit={{opacity: 0, x: 20}}
                                transition={{duration: 0.3}}
                            >
                                <BadgesTab badges={badges} isOwner={isOwner}/>
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="relations" className="p-4 sm:p-6" key="relations">
                            <motion.div
                                initial={{opacity: 0, x: -20}}
                                animate={{opacity: 1, x: 0}}
                                exit={{opacity: 0, x: 20}}
                                transition={{duration: 0.3}}
                            >
                                <RelationsTab
                                    followers={followers}
                                    following={following}
                                    isOwner={isOwner}
                                    currentUserId={currentUser?.id}
                                />
                            </motion.div>
                        </TabsContent>

                        {isOwner && detailedData && (
                            <>
                                <TabsContent value="books" className="p-4 sm:p-6" key="books">
                                    <motion.div
                                        initial={{opacity: 0, x: -20}}
                                        animate={{opacity: 1, x: 0}}
                                        exit={{opacity: 0, x: 20}}
                                        transition={{duration: 0.3}}
                                    >
                                        <BooksTab books={detailedData.books}/>
                                    </motion.div>
                                </TabsContent>

                                <TabsContent value="reviews" className="p-4 sm:p-6" key="reviews">
                                    <motion.div
                                        initial={{opacity: 0, x: -20}}
                                        animate={{opacity: 1, x: 0}}
                                        exit={{opacity: 0, x: 20}}
                                        transition={{duration: 0.3}}
                                    >
                                        <ReviewsTab reviews={detailedData.reviews}/>
                                    </motion.div>
                                </TabsContent>
                            </>
                        )}
                    </AnimatePresence>
                </Tabs>
            </motion.div>

            {isOwner && detailedData && (
                <EditProfileModal
                    isOpen={isModalOpen}
                    onOpenChange={handleModalClose}
                    user={{
                        id: detailedData.userId,
                        username: user.username,
                        favoriteColor: user.favoriteColor,
                    }}
                />
            )}
        </div>
    );
};

export default ProfileContent;
