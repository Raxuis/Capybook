import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {format} from "date-fns";
import {fr} from "date-fns/locale";
import {BookOpen, Calendar, Clock, Trash2, Trophy} from "lucide-react";
import {Progress} from "@/components/ui/progress";
import {Button} from "@/components/ui/button";
import {GoalType} from "@prisma/client";
import {memo, useCallback, useState} from "react";
import DeleteChallengeDialog from "@/components/Challenges/DeleteChallenge/DeleteChallengeDialog";
import {useChallengeCrudModalStore} from "@/store/challengeCrudModalStore";
import {Challenge} from "@/types";
import {cn} from "@/lib/utils";

type Props = {
    challenge: Challenge;
    isPast?: boolean;
}

const ChallengeCard = memo(({
                                challenge, isPast
                            }: Props) => {
    const {
        openUpdateDialog,
        setDialogOpen
    } = useChallengeCrudModalStore();

    const progress = Math.min(100, Math.round((challenge.progress / challenge.target) * 100));
    const isCompleted = challenge.progress >= challenge.target;

    const [showDialog, setShowDialog] = useState(false);


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

    return (
        <>
            <Card className={`overflow-hidden relative group ${isCompleted ? 'border-green-500' : ''}`}>
                <div className={cn(
                    "h-1.5",
                    isCompleted ? "bg-green-500" :
                        isPast ? "bg-red-500" :
                            "bg-blue-500"
                )}></div>

                <div
                    onClick={() => {
                        setShowDialog(true);
                    }}
                    className="absolute top-4 right-4 group-hover:opacity-100 opacity-0 transition-opacity duration-200 cursor-pointer">
                    <Trash2 className="size-4 text-destructive"/>
                </div>
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
                        <Progress value={progress} className="h-2 transition-all duration-500 ease-in-out"
                                  indicatorColor={
                                      isCompleted ? 'bg-green-500' : (isPast ? 'bg-red-500' : 'bg-blue-500')
                                  }/>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                    <div className="text-xs text-muted-foreground">
                        Créé le {format(new Date(challenge.createdAt), 'dd/MM/yyyy')}
                    </div>
                    {!isPast && (
                        <Button variant="outline" size="sm" onClick={() => {
                            openUpdateDialog(challenge);
                            setDialogOpen(true);
                        }}
                                className="bg-gradient-to-br from-amber-50 to-orange-50 border-orange-10">
                            Mettre à jour
                        </Button>
                    )}
                </CardFooter>
            </Card>
            <DeleteChallengeDialog
                showDialog={showDialog}
                setShowDialog={setShowDialog}
                challengeId={challenge.id}
            />

        </>
    );
});

export default ChallengeCard;