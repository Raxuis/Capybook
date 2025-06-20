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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section Abonnés */}
            <div className="bg-white rounded-lg border p-4">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <Users size={20} className="mr-2 text-green-600"/>
                    Abonnés ({followers?.length || 0})
                </h2>
                <div className="space-y-3">
                    {followers?.length ? (
                        followers.map((follower) => (
                            <Link key={follower.id}
                                  href={`/profile/${follower.username}`}
                                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    {follower.image ? (
                                        <Image src={follower.image} alt={follower.username}
                                               width={40} height={40}
                                               className="w-full h-full rounded-full"/>
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
                        <div className="text-center py-4 text-gray-500">
                            Aucun abonné pour le moment
                        </div>
                    )}
                </div>
            </div>

            {/* Section Abonnements */}
            <div className="bg-white rounded-lg border p-4">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <UserPlus size={20} className="mr-2 text-indigo-600"/>
                    Abonnements ({following?.length || 0})
                </h2>
                <div className="space-y-3">
                    {following?.length ? (
                        following.map((followed) => (
                            <Link key={followed.id}
                                  href={`/profile/${followed.username}`}
                                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    {followed.image ? (
                                        <Image src={followed.image} alt={followed.username}
                                               width={40} height={40}
                                               className="w-full h-full rounded-full"/>
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
                        <div className="text-center py-4 text-gray-500">
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
