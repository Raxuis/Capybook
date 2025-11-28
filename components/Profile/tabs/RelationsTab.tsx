import React, {memo} from 'react';
import {Users, UserPlus} from "lucide-react";
import {UserProfile} from "@/types/profile";
import Image from "next/image";
import {Link} from "next-view-transitions";

interface RelationsTabProps {
    followers?: UserProfile[];
    following?: UserProfile[];
}

const RelationsTab = memo<RelationsTabProps>(({followers, following}) => {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Section Abonnés */}
            <div className="rounded-lg border bg-white p-4">
                <h2 className="mb-4 flex items-center text-lg font-semibold">
                    <Users size={20} className="mr-2 text-green-600"/>
                    Abonnés ({followers?.length || 0})
                </h2>
                <div className="space-y-3">
                    {followers?.length ? (
                        followers.map((follower) => (
                            <Link key={follower.id}
                                  href={`/profile/${follower.username}`}
                                  className="flex items-center space-x-3 rounded-lg p-2 transition-colors hover:bg-gray-50">
                                <div className="flex size-10 items-center justify-center rounded-full bg-gray-200">
                                    {follower.image ? (
                                        <Image src={follower.image} alt={follower.username}
                                               width={40} height={40}
                                               className="size-full rounded-full"/>
                                    ) : (
                                        <span className="text-lg font-semibold text-gray-600">
                      {(follower.name || follower.username)[0].toUpperCase()}
                    </span>
                                    )}
                                </div>
                                <div>
                                    <div className="font-medium">{follower.name || follower.username}</div>
                                    <div className="text-sm text-gray-500">@{follower.username}</div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="py-4 text-center text-gray-500">
                            Aucun abonné pour le moment
                        </div>
                    )}
                </div>
            </div>

            {/* Section Abonnements */}
            <div className="rounded-lg border bg-white p-4">
                <h2 className="mb-4 flex items-center text-lg font-semibold">
                    <UserPlus size={20} className="mr-2 text-indigo-600"/>
                    Abonnements ({following?.length || 0})
                </h2>
                <div className="space-y-3">
                    {following?.length ? (
                        following.map((followed) => (
                            <Link key={followed.id}
                                  href={`/profile/${followed.username}`}
                                  className="flex items-center space-x-3 rounded-lg p-2 transition-colors hover:bg-gray-50">
                                <div className="flex size-10 items-center justify-center rounded-full bg-gray-200">
                                    {followed.image ? (
                                        <Image src={followed.image} alt={followed.username}
                                               width={40} height={40}
                                               className="size-full rounded-full"/>
                                    ) : (
                                        <span className="text-lg font-semibold text-gray-600">
                      {(followed.name || followed.username)[0].toUpperCase()}
                    </span>
                                    )}
                                </div>
                                <div>
                                    <div className="font-medium">{followed.name || followed.username}</div>
                                    <div className="text-sm text-gray-500">@{followed.username}</div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="py-4 text-center text-gray-500">
                            Aucun abonnement pour le moment
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

RelationsTab.displayName = 'RelationsTab';

export default RelationsTab;
