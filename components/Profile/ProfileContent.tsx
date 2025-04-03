"use client";
import React from 'react';
import { useRouter } from "nextjs-toploader/app";
import useSWR from "swr";
import {formatUrlParam, formatUsername} from "@/utils/format";
import { fetcher } from "@/utils/fetcher";

type ProfileData = {
    user: {
        id: string;
        username: string;
        name: string | null;
        image: string | null;
        createdAt: string;
    };
    isOwner: boolean;
    stats?: {
        totalBooksRead: number;
        totalReviews: number;
    };
    badges?: Array<{
        id: string;
        name: string;
        description: string;
        icon: string;
        earnedAt: string;
    }>;
};

const ProfileContent = ({ username }: { username: string }) => {
    const router = useRouter();
    const usernameParamFormatted = username ? formatUsername(username) : null;

    const { data, error, isLoading } = useSWR<ProfileData>(
        usernameParamFormatted ? `/api/user/profile/${usernameParamFormatted}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            onError: (err) => {
                console.error('Error fetching profile:', err);
                if (err.status === 404) {
                    router.push('/404');
                }
            }
        }
    );

    // Redirect if username is empty
    React.useEffect(() => {
        if (!username) {
            router.push('/404');
        }
    }, [username, router]);

    if (isLoading) {
        return <div>Loading profile...</div>;
    }

    if (error || !data) {
        return <div>Failed to load profile</div>;
    }

    const { user, isOwner, stats, badges } = data;

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4 mb-6">
                    {user.image ? (
                        <img
                            src={user.image}
                            alt={`${user.username}'s profile`}
                            className="w-16 h-16 rounded-full"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-500">
                {user.name?.[0] || user.username[0].toUpperCase()}
              </span>
                        </div>
                    )}

                    <div>
                        <h1 className="text-2xl font-bold">{user.name || user.username}</h1>
                        <p className="text-gray-500">@{user.username}</p>
                    </div>

                    {isOwner && (
                        <button className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                            Edit Profile
                        </button>
                    )}
                </div>

                {/* Stats Section */}
                {stats && (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-md text-center">
                            <div className="text-2xl font-bold">{stats.totalBooksRead}</div>
                            <div className="text-sm text-gray-500">Books Read</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md text-center">
                            <div className="text-2xl font-bold">{stats.totalReviews}</div>
                            <div className="text-sm text-gray-500">Reviews</div>
                        </div>
                    </div>
                )}

                {/* Badges Section */}
                {badges && badges.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-3">Badges</h2>
                        <div className="flex flex-wrap gap-3">
                            {badges.map(badge => (
                                <div
                                    key={badge.id}
                                    className="flex flex-col items-center bg-gray-50 p-3 rounded-md"
                                    title={badge.description}
                                >
                                    <div className="text-3xl mb-1">{badge.icon}</div>
                                    <div className="text-sm font-medium">{badge.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ProfileContent;