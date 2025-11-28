import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {BarChart, BookOpen, Target} from "lucide-react";
import React, {JSX, useMemo} from "react";
import {useChallenges} from "@/hooks/useChallenges";
import {useUser} from "@/hooks/useUser";

type Props = {
    type: "booksRead" | "challengesCompleted" | "inProgress";
};

const ChallengeHeaderInfo = ({type}: Props) => {
    const {user} = useUser();
    const {currentChallenges} = useChallenges();

    // 📌 Optimisation : Utilisation d'une fonction simple
    const getCardClassName = () => {
        const classes: Record<string, string> = {
            booksRead: "bg-gradient-to-br from-blue-50 to-indigo-50 border-indigo-100",
            challengesCompleted: "bg-gradient-to-br from-green-50 to-emerald-50 border-emerald-100",
            inProgress: "bg-gradient-to-br from-yellow-50 to-amber-50 border-amber-100",
        };
        return classes[type] || "";
    };

    const getCardTitle = () => {
        const titles: Record<string, JSX.Element> = {
            booksRead: (
                <CardTitle className="flex items-center text-indigo-700">
                    <BookOpen className="mr-2 size-5"/>
                    Livres lus
                </CardTitle>
            ),
            challengesCompleted: (
                <CardTitle className="flex items-center text-emerald-700">
                    <BarChart className="mr-2 size-5"/>
                    Challenges terminés
                </CardTitle>
            ),
            inProgress: (
                <CardTitle className="flex items-center text-amber-700">
                    <Target className="mr-2 size-5"/>
                    En cours
                </CardTitle>
            ),
        };
        return titles[type] || <></>;
    };

    // 📌 Optimisation : `useMemo` pour éviter les recalculs inutiles
    const inProgressChallengesCount = useMemo(
        () => currentChallenges.filter(goal => goal.progress < goal.target).length || 0,
        [currentChallenges]
    );

    const getCardContent = () => {
        const contents: Record<string, JSX.Element> = {
            booksRead: (
                user && user.UserBook && (
                    <p className="text-3xl font-bold text-indigo-700">
                        {user.UserBook?.filter(book => book.finishedAt).length || 0}
                    </p>
                ) || <p className="text-3xl font-bold text-indigo-700">0</p>
            ),
            challengesCompleted: (
                user && user.ReadingGoal && (
                    <p className="text-3xl font-bold text-emerald-700">
                        {user.ReadingGoal?.filter(goal => goal.progress >= goal.target).length || 0}
                    </p>
                ) || (
                    <p className="text-3xl font-bold text-emerald-700">0</p>
                )
            ),
            inProgress: (
                <p className="text-3xl font-bold text-amber-700">
                    {inProgressChallengesCount}
                </p>
            ),
        };
        return contents[type] || <></>;
    };

    return (
        <Card className={getCardClassName()}>
            <CardHeader className="pb-2">
                {getCardTitle()}
            </CardHeader>
            <CardContent>
                {getCardContent()}
            </CardContent>
        </Card>
    );
};

export default ChallengeHeaderInfo;
