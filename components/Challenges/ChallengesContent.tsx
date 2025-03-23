"use client";

import {useCallback, useState} from "react";
import {useUser} from "@/hooks/useUser";
import {AlertCircle, Loader2, BookOpen, Calendar, Clock, Plus, Trophy, BarChart, Target} from "lucide-react";
import {format} from "date-fns";
import {fr} from "date-fns/locale";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {GoalType} from "@prisma/client";
import CreateChallengeDialog from "@/components/Challenges/CreateChallenge/CreateChallengeDialog";

type Challenge = {
    id: string;
    type: GoalType;
    progress: number;
    target: number;
    deadline: Date;
    createdAt: Date;
};

interface ChallengeCardProps {
    challenge: Challenge;
    isPast?: boolean;
}

const ChallengesContent = ({userId}: { userId?: string }) => {
    const {user, isError, isValidating, isLoading} = useUser(userId);
    const [activeTab, setActiveTab] = useState("current");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const getChallengeIcon = useCallback((type: GoalType) => {
        switch (type) {
            case 'BOOKS':
                return <BookOpen className="h-6 w-6 text-indigo-500"/>;
            case 'PAGES':
                return <Calendar className="h-6 w-6 text-emerald-500"/>;
            case 'TIME':
                return <Clock className="h-6 w-6 text-amber-500"/>;
            default:
                return <Trophy className="h-6 w-6 text-primary"/>;
        }
    }, []);

    const getChallengeTypeText = useCallback((type: GoalType) => {
        switch (type) {
            case 'BOOKS':
                return "livres";
            case 'PAGES':
                return "pages";
            case 'TIME':
                return "minutes";
            default:
                return "unités";
        }
    }, []);

    if ((isLoading || isValidating) && !user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2"/>
                <p className="text-muted-foreground">Chargement des challenges...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <AlertCircle className="h-8 w-8 text-destructive mb-2"/>
                <p className="font-medium">Erreur lors du chargement des challenges</p>
                <p className="text-muted-foreground mt-1">Veuillez réessayer ultérieurement</p>
            </div>
        );
    }

    if (!user) return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <AlertCircle className="h-8 w-8 text-amber-500 mb-2"/>
            <p className="font-medium">Utilisateur non trouvé</p>
        </div>
    );

    const currentChallenges = user.ReadingGoal?.filter(goal =>
        new Date(goal.deadline) >= new Date()
    ) || [];

    const pastChallenges = user.ReadingGoal?.filter(goal =>
        new Date(goal.deadline) < new Date()
    ) || [];


    const ChallengeCard = ({challenge, isPast = false}: ChallengeCardProps) => {
        const progress = Math.min(100, Math.round((challenge.progress / challenge.target) * 100));
        const isCompleted = challenge.progress >= challenge.target;

        return (
            <Card className={`overflow-hidden ${isCompleted ? 'border-green-500' : ''}`}>
                <div className={`h-1 ${isCompleted ? 'bg-green-500' : 'bg-primary'}`}></div>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center space-x-3">
                        {getChallengeIcon(challenge.type)}
                        <div>
                            <CardTitle className="text-lg">
                                {challenge.target} {getChallengeTypeText(challenge.type)}
                            </CardTitle>
                            <CardDescription>
                                {isPast ? 'Terminé' : 'À compléter'} d'ici{' '}
                                {format(new Date(challenge.deadline), 'dd MMMM yyyy', {locale: fr})}
                            </CardDescription>
                        </div>
                    </div>
                    {isCompleted && <Trophy className="h-6 w-6 text-yellow-500"/>}
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Progression: {challenge.progress}/{challenge.target}</span>
                            <span className="font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2"/>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                    <div className="text-xs text-muted-foreground">
                        Créé le {format(new Date(challenge.createdAt), 'dd/MM/yyyy')}
                    </div>
                    {!isPast && (
                        <Button variant="outline" size="sm">
                            Mettre à jour
                        </Button>
                    )}
                </CardFooter>
            </Card>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Mes challenges de lecture</h1>
                <CreateChallengeDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} user={user}/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-indigo-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-indigo-700">
                            <BookOpen className="h-5 w-5 mr-2"/>
                            Livres lus
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-indigo-700">
                            {user.UserBook?.filter(book => book.finishedAt).length || 0}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-emerald-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-emerald-700">
                            <BarChart className="h-5 w-5 mr-2"/>
                            Challenges terminés
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-emerald-700">
                            {user.ReadingGoal?.filter(goal => goal.progress >= goal.target).length || 0}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-orange-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-amber-700">
                            <Target className="h-5 w-5 mr-2"/>
                            En cours
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-amber-700">
                            {currentChallenges.filter(goal => goal.progress < goal.target).length || 0}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                    <TabsTrigger value="current" className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2"/>
                        En cours ({currentChallenges.length})
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="flex items-center">
                        <Trophy className="h-4 w-4 mr-2"/>
                        Terminés ({pastChallenges.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="current">
                    {currentChallenges.length === 0 ? (
                        <div
                            className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-lg border border-dashed">
                            <BookOpen className="h-12 w-12 text-muted-foreground mb-3"/>
                            <h3 className="text-lg font-medium mb-1">Pas de challenge en cours</h3>
                            <p className="text-muted-foreground max-w-md mb-4">
                                Créez votre premier challenge de lecture pour commencer à suivre votre progression.
                            </p>
                            <Button onClick={() => setIsDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2"/>
                                Créer un challenge
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {currentChallenges.map((challenge) => (
                                <ChallengeCard key={challenge.id} challenge={challenge}/>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="completed">
                    {pastChallenges.length === 0 ? (
                        <div
                            className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-lg border border-dashed">
                            <Trophy className="h-12 w-12 text-muted-foreground mb-3"/>
                            <h3 className="text-lg font-medium mb-1">Pas encore de challenge terminé</h3>
                            <p className="text-muted-foreground max-w-md">
                                Une fois que vous aurez complété vos challenges ou que leur date limite sera passée, ils
                                apparaîtront ici.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {pastChallenges.map((challenge) => (
                                <ChallengeCard key={challenge.id} challenge={challenge} isPast={true}/>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ChallengesContent;