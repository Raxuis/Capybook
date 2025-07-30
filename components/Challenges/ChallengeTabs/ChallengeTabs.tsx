import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {BookOpen, Calendar, Plus, Trophy} from "lucide-react";
import {Button} from "@/components/ui/button";
import ChallengeCard from "@/components/Challenges/ChallengeCard";
import {useChallenges} from "@/hooks/useChallenges";
import {useState} from "react";
import {useChallengeCrudModalStore} from "@/store/challengeCrudModalStore";

const ChallengeTabs = () => {
    const {currentChallenges, pastChallenges} = useChallenges();
    const {
        openCreateDialog,
    } = useChallengeCrudModalStore();
    const [activeTab, setActiveTab] = useState("current");

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
                <TabsTrigger value="current" className="flex items-center">
                    <Calendar className="mr-2 size-4"/>
                    En cours ({currentChallenges.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex items-center">
                    <Trophy className="mr-2 size-4"/>
                    Terminés ({pastChallenges.length})
                </TabsTrigger>
            </TabsList>

            <TabsContent value="current">
                {currentChallenges.length === 0 ? (
                    <div
                        className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-gray-50 py-12 text-center">
                        <BookOpen className="text-muted-foreground mb-3 size-12"/>
                        <h3 className="mb-1 text-lg font-medium">Pas de challenge en cours</h3>
                        <p className="text-muted-foreground mb-4 max-w-md">
                            Créez votre premier challenge de lecture pour commencer à suivre votre progression.
                        </p>
                        <Button onClick={() => openCreateDialog()}>
                            <Plus className="mr-2 size-4"/>
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
                        className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-gray-50 py-12 text-center">
                        <Trophy className="text-muted-foreground mb-3 size-12"/>
                        <h3 className="mb-1 text-lg font-medium">Pas encore de challenge terminé</h3>
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
    );
};

export default ChallengeTabs;
