import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {BookOpen, Calendar, Plus, Trophy} from "lucide-react";
import {Button} from "@/components/ui/button";
import ChallengeCard from "@/components/Challenges/ChallengeCard";
import {useChallenges} from "@/hooks/useChallenges";
import {useMemo, useState} from "react";
import {useChallengeCrudModalStore} from "@/store/challengeCrudModalStore";

const ChallengeTabs = () => {
    const {currentChallenges, pastChallenges} = useChallenges();
    const {setDialogOpen} = useChallengeCrudModalStore();
    const [activeTab, setActiveTab] = useState("current");

    return (
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
                        <Button onClick={() => setDialogOpen(true)}>
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
    );
};

export default ChallengeTabs;
