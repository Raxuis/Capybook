"use client";

import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import React, {memo, useMemo} from "react";
import {useUser} from "@/hooks/useUser";
import {BarChart2, BookOpen} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useSearchParams} from "next/navigation";
import {useTransitionRouter} from "next-view-transitions";

const DashboardHeader = memo(({showStatistics}: { showStatistics: boolean }) => {
    const {user} = useUser();

    const router = useTransitionRouter();
    const searchParams = useSearchParams();

    const toggleView = () => {
        const currentParams = new URLSearchParams(searchParams.toString());
        if (showStatistics) {
            currentParams.delete("view");
        } else {
            currentParams.set("view", "statistics");
        }

        router.replace(`?${currentParams.toString()}`);
    };

    const userInitials = useMemo(() => {
        if (!user?.username) return "";
        return user.username.slice(0, 2).toUpperCase();
    }, [user?.username]);

    if (!user) return null;

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border-2 border-primary">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">{userInitials}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-2xl font-bold">Bonjour {user.username}</h1>
                    <p className="text-muted-foreground">Bienvenue sur votre tableau de bord</p>
                </div>
            </div>
            <Button onClick={toggleView}
                    className="flex items-center gap-2">
                {
                    showStatistics ? (
                        <>
                            <BookOpen className="h-4 w-4"/>
                            <span className="text-sm">Voir la bibliothèque</span>
                        </>
                    ) : (
                        <>
                            <BarChart2 className="h-4 w-4"/>
                            <span className="text-sm">Voir les statistiques</span>
                        </>
                    )
                }
            </Button>
        </div>
    );
});

DashboardHeader.displayName = "DashboardHeader";


export default DashboardHeader;