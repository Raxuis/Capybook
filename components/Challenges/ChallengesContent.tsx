"use client";

import {useState} from "react";
import {useUser} from "@/hooks/useUser";
import {AlertCircle, Loader2, BookOpen, Calendar, Plus, Trophy, BarChart, Target} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import CreateChallengeDialog from "@/components/Challenges/CreateChallenge/CreateChallengeDialog";
import {DashboardLayout} from "@/components/Layout";
import ChallengeCard from "@/components/Challenges/ChallengeCard";

const ChallengesContent = ({userId}: { userId?: string }) => {
    const {user, isError, isValidating, isLoading} = useUser(userId);
    const [activeTab, setActiveTab] = useState("current");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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

    return (
        <DashboardLayout>
            <div className="flex sm:justify-between sm:items-center mb-4 max-sm:flex-col items-start w-full">
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
                                <ChallengeCard
                                    key={challenge.id}
                                    challenge={challenge}
                                    userId={userId}
                                />
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
                                Une fois que vous aurez complété vos challenges ou que leur date limite sera passée,
                                ils
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
        </DashboardLayout>
    );
};

export default ChallengesContent;