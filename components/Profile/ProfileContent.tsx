"use client";
import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {useRouter} from "nextjs-toploader/app";
import useSWR from "swr";
import {formatUsername} from "@/utils/format";
import {fetcher} from "@/utils/fetcher";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Loader2} from "lucide-react";
import EditProfileModal from "@/components/Profile/EditProfile/EditProfileModal";
import {SWR_CONFIG} from "@/constants/SWR";
import {ProfileData} from "@/types/profile";
import ProfileHeader from "./ProfileHeader";
import OverviewTab from "./tabs/OverviewTab";
import BadgesTab from "./tabs/BadgesTab";
import RelationsTab from "./tabs/RelationsTab";
import BooksTab from "./tabs/BooksTab";
import ReviewsTab from "./tabs/ReviewsTab";

const ProfileContent = ({username}: { username: string }) => {
    const router = useRouter();
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
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <Loader2 className="text-primary mb-2 size-8 animate-spin"/>
                <p className="text-muted-foreground">Chargement des données...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm">
                <h3 className="font-semibold">Impossible de charger le profil</h3>
                <p className="text-sm">Veuillez réessayer ultérieurement ou vérifier l&#39;URL.</p>
            </div>
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

            <div className="mb-32 overflow-hidden rounded-xl bg-white shadow-md">
                <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <div className="overflow-hidden border-b">
                        <div className="overflow-x-auto overflow-y-hidden">
                            <TabsList className="flex w-max min-w-full bg-transparent p-0">
                                <TabsTrigger
                                    value="overview"
                                    className="min-w-[100px] shrink-0 whitespace-nowrap rounded-none px-2 py-3 text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-6 sm:py-4 sm:text-sm"
                                >
                                    <span className="hidden sm:inline">Vue d&#39;ensemble</span>
                                    <span className="sm:hidden">Aperçu</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="badges"
                                    className="min-w-[80px] shrink-0 whitespace-nowrap rounded-none px-2 py-3 text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-6 sm:py-4 sm:text-sm"
                                >
                                    Badges
                                </TabsTrigger>
                                <TabsTrigger
                                    value="relations"
                                    className="min-w-[80px] shrink-0 whitespace-nowrap rounded-none px-2 py-3 text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-6 sm:py-4 sm:text-sm"
                                >
                                    Relations
                                </TabsTrigger>
                                {isOwner && detailedData && (
                                    <>
                                        <TabsTrigger
                                            value="books"
                                            className="min-w-[80px] shrink-0 whitespace-nowrap rounded-none px-2 py-3 text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-6 sm:py-4 sm:text-sm"
                                        >
                                            Livres
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="reviews"
                                            className="min-w-[80px] shrink-0 whitespace-nowrap rounded-none px-2 py-3 text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-6 sm:py-4 sm:text-sm"
                                        >
                                            Avis
                                        </TabsTrigger>
                                    </>
                                )}
                            </TabsList>
                        </div>
                    </div>

                    <TabsContent value="overview" className="p-4 sm:p-6">
                        <OverviewTab
                            stats={stats}
                            badges={badges}
                            detailedData={detailedData}
                            isOwner={isOwner}
                            onTabChange={handleTabChange}
                        />
                    </TabsContent>

                    <TabsContent value="badges" className="p-4 sm:p-6">
                        <BadgesTab badges={badges} isOwner={isOwner}/>
                    </TabsContent>

                    <TabsContent value="relations" className="p-4 sm:p-6">
                        <RelationsTab followers={followers} following={following}/>
                    </TabsContent>

                    {isOwner && detailedData && (
                        <>
                            <TabsContent value="books" className="p-4 sm:p-6">
                                <BooksTab books={detailedData.books}/>
                            </TabsContent>

                            <TabsContent value="reviews" className="p-4 sm:p-6">
                                <ReviewsTab reviews={detailedData.reviews}/>
                            </TabsContent>
                        </>
                    )}
                </Tabs>
            </div>

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