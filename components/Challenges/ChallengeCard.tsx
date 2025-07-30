import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {format} from "date-fns";
import {fr} from "date-fns/locale";
import {BookOpen, Clock, FileText, Trash2, Trophy, MoreVertical} from "lucide-react";
import {Progress} from "@/components/ui/progress";
import {Button} from "@/components/ui/button";
import {GoalType} from "@prisma/client";
import {memo, useCallback, useState} from "react";
import DeleteChallengeDialog from "@/components/Challenges/DeleteChallenge/DeleteChallengeDialog";
import {useChallengeCrudModalStore} from "@/store/challengeCrudModalStore";
import {Challenge} from "@/types";
import {cn} from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
                return <FileText className="h-6 w-6 text-emerald-500"/>;
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
            <Card className={cn(
                "overflow-hidden relative transition-all duration-200 shadow-sm hover:shadow-md",
                isCompleted ? 'border-green-500 bg-green-50/30' : '',
                isPast ? 'border-red-300 bg-red-50/30' : 'border-blue-200 bg-blue-50/20',
                "active:scale-[0.98] touch-manipulation"
            )}>
                {/* Indicateur de statut plus visible */}
                <div className={cn(
                    "h-2",
                    isCompleted ? "bg-gradient-to-r from-green-400 to-green-500" :
                        isPast ? "bg-gradient-to-r from-red-400 to-red-500" :
                            "bg-gradient-to-r from-blue-400 to-blue-500"
                )}></div>

                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                                {getChallengeIcon(challenge.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    {challenge.target} {getChallengeTypeText(challenge.type)}
                                </CardTitle>
                                <CardDescription className="text-sm text-gray-600 mt-1">
                                    {isPast ? 'Terminé' : 'À compléter'} d&#39;ici le{' '}
                                    <span className="font-medium">
                                        {format(new Date(challenge.deadline), 'dd MMMM yyyy', {locale: fr})}
                                    </span>
                                </CardDescription>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 flex-shrink-0">
                            {isCompleted && (
                                <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full">
                                    <Trophy className="h-4 w-4 text-yellow-600"/>
                                </div>
                            )}

                            {!isPast && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 hover:bg-gray-100 focus:bg-gray-100"
                                        >
                                            <MoreVertical className="h-4 w-4 text-gray-500"/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                        <DropdownMenuItem
                                            onClick={() => {
                                                openUpdateDialog(challenge);
                                                setDialogOpen(true);
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <FileText className="mr-2 h-4 w-4"/>
                                            Mettre à jour
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setShowDialog(true)}
                                            className="cursor-pointer text-red-600 focus:text-red-600 hover:text-white"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4"/>
                                            Supprimer
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pb-4">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">
                                Progression: <span className="font-medium text-gray-900">{challenge.progress}</span>
                                <span className="text-gray-400">/{challenge.target}</span>
                            </span>
                            <div className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                isCompleted ? "bg-green-100 text-green-700" :
                                    isPast ? "bg-red-100 text-red-700" :
                                        "bg-blue-100 text-blue-700"
                            )}>
                                {progress}%
                            </div>
                        </div>

                        <div className="relative">
                            <Progress
                                value={progress}
                                className="h-3 bg-gray-200"
                                indicatorColor={
                                    isCompleted ? 'bg-gradient-to-r from-green-400 to-green-500' :
                                        (isPast ? 'bg-gradient-to-r from-red-400 to-red-500' : 'bg-gradient-to-r from-blue-400 to-blue-500')
                                }
                            />
                            {/* Animation de progression */}
                            <div className={cn(
                                "absolute inset-0 bg-gradient-to-r opacity-20 rounded-full animate-pulse",
                                isCompleted ? "from-green-200 to-green-300" :
                                    isPast ? "from-red-200 to-red-300" :
                                        "from-blue-200 to-blue-300"
                            )} style={{width: `${progress}%`}}/>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="pt-0 pb-4">
                    <div className="flex justify-between items-center w-full">
                        <div className="text-xs text-gray-500">
                            Créé le {format(new Date(challenge.createdAt), 'dd/MM/yyyy')}
                        </div>
                    </div>
                </CardFooter>
            </Card>

            <DeleteChallengeDialog
                showDialog={showDialog && !isPast}
                setShowDialog={setShowDialog}
                challengeId={challenge.id}
            />
        </>
    );
});

ChallengeCard.displayName = 'ChallengeCard';

export default ChallengeCard;