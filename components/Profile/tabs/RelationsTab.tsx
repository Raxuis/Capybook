'use client';

import React, {memo, useState, useCallback, useMemo} from 'react';
import {Users, UserPlus, UserMinus, Loader2, Search} from "lucide-react";
import {UserProfile} from "@/types/profile";
import {Link} from "next-view-transitions";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";
import {useRouter} from "nextjs-toploader/app";

interface RelationsTabProps {
    followers?: UserProfile[];
    following?: UserProfile[];
    isOwner?: boolean;
    currentUserId?: string;
}

const RelationsTab = memo<RelationsTabProps>(({followers = [], following = [], isOwner = false, currentUserId}) => {
    const router = useRouter();
    const [searchFollowers, setSearchFollowers] = useState('');
    const [searchFollowing, setSearchFollowing] = useState('');
    const [loadingFollows, setLoadingFollows] = useState<Set<string>>(new Set());

    // Create a set of following IDs for quick lookup
    const followingIds = useMemo(() => new Set(following.map(f => f.id)), [following]);

    const filteredFollowers = useMemo(() => {
        if (!searchFollowers.trim()) return followers;
        const search = searchFollowers.toLowerCase();
        return followers.filter(user =>
            user.username.toLowerCase().includes(search) ||
            (user.name?.toLowerCase().includes(search) ?? false)
        );
    }, [followers, searchFollowers]);

    const filteredFollowing = useMemo(() => {
        if (!searchFollowing.trim()) return following;
        const search = searchFollowing.toLowerCase();
        return following.filter(user =>
            user.username.toLowerCase().includes(search) ||
            (user.name?.toLowerCase().includes(search) ?? false)
        );
    }, [following, searchFollowing]);

    const handleFollowToggle = useCallback(async (username: string, userId: string, isCurrentlyFollowing: boolean) => {
        if (!currentUserId || loadingFollows.has(userId)) return;

        setLoadingFollows(prev => new Set(prev).add(userId));
        try {
            const response = await fetch(`/api/user/follow/${username}`, {
                method: isCurrentlyFollowing ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: isCurrentlyFollowing ? null : JSON.stringify({username}),
            });

            if (!response.ok) {
                throw new Error('Failed to update follow status');
            }

            // Refresh the page to update the relations
            router.refresh();
        } catch (error) {
            console.error('Error updating follow status:', error);
        } finally {
            setLoadingFollows(prev => {
                const next = new Set(prev);
                next.delete(userId);
                return next;
            });
        }
    }, [currentUserId, loadingFollows, router]);

    const UserCard = ({user, showFollowButton = false}: { user: UserProfile; showFollowButton?: boolean }) => {
        const isFollowingUser = followingIds.has(user.id);
        const isLoading = loadingFollows.has(user.id);
        const displayName = user.name || user.username;
        const initials = displayName.slice(0, 2).toUpperCase();

        return (
            <div className="group flex items-center justify-between rounded-lg border bg-card p-3 transition-all hover:shadow-md sm:p-4">
                <Link
                    href={`/profile/${user.username}`}
                    className="flex min-w-0 flex-1 items-center space-x-3"
                >
                    <Avatar className="size-10 shrink-0 border-2 border-border sm:size-12">
                        <AvatarImage src={user.image || undefined} alt={user.username}/>
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold text-foreground">{displayName}</div>
                        <div className="truncate text-sm text-muted-foreground">@{user.username}</div>
                    </div>
                </Link>
                {showFollowButton && currentUserId && user.id !== currentUserId && (
                    <Button
                        size="sm"
                        variant={isFollowingUser ? "outline" : "default"}
                        className="ml-3 shrink-0"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleFollowToggle(user.username, user.id, isFollowingUser);
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="size-4 animate-spin"/>
                        ) : isFollowingUser ? (
                            <>
                                <UserMinus className="mr-1.5 size-4"/>
                                <span className="hidden sm:inline">Se désabonner</span>
                            </>
                        ) : (
                            <>
                                <UserPlus className="mr-1.5 size-4"/>
                                <span className="hidden sm:inline">S'abonner</span>
                            </>
                        )}
                    </Button>
                )}
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Section Abonnés */}
            <div className="rounded-lg border bg-card p-4 shadow-sm sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="flex items-center text-lg font-semibold sm:text-xl">
                        <div className="mr-2 flex size-8 items-center justify-center rounded-md bg-green-100">
                            <Users size={18} className="text-green-700"/>
                        </div>
                        <span>Abonnés</span>
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            ({followers.length})
                        </span>
                    </h2>
                </div>

                {followers.length > 3 && (
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
                            <Input
                                type="text"
                                placeholder="Rechercher un abonné..."
                                value={searchFollowers}
                                onChange={(e) => setSearchFollowers(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    {filteredFollowers.length > 0 ? (
                        filteredFollowers.map((follower) => (
                            <UserCard key={follower.id} user={follower} showFollowButton={isOwner}/>
                        ))
                    ) : (
                        <div className="py-12 text-center">
                            <div className="mb-4 text-4xl">👥</div>
                            <h3 className="text-lg font-semibold text-foreground">
                                {searchFollowers ? 'Aucun résultat' : 'Aucun abonné'}
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {searchFollowers
                                    ? 'Essayez avec un autre terme de recherche'
                                    : 'Vous n\'avez pas encore d\'abonnés pour le moment'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Section Abonnements */}
            <div className="rounded-lg border bg-card p-4 shadow-sm sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="flex items-center text-lg font-semibold sm:text-xl">
                        <div className="mr-2 flex size-8 items-center justify-center rounded-md bg-indigo-100">
                            <UserPlus size={18} className="text-indigo-700"/>
                        </div>
                        <span>Abonnements</span>
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            ({following.length})
                        </span>
                    </h2>
                </div>

                {following.length > 3 && (
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
                            <Input
                                type="text"
                                placeholder="Rechercher un abonnement..."
                                value={searchFollowing}
                                onChange={(e) => setSearchFollowing(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    {filteredFollowing.length > 0 ? (
                        filteredFollowing.map((followed) => (
                            <UserCard key={followed.id} user={followed} showFollowButton={isOwner}/>
                        ))
                    ) : (
                        <div className="py-12 text-center">
                            <div className="mb-4 text-4xl">🔍</div>
                            <h3 className="text-lg font-semibold text-foreground">
                                {searchFollowing ? 'Aucun résultat' : 'Aucun abonnement'}
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {searchFollowing
                                    ? 'Essayez avec un autre terme de recherche'
                                    : 'Vous ne suivez personne pour le moment'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

RelationsTab.displayName = 'RelationsTab';

export default RelationsTab;
