import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {Trash2} from "lucide-react";
import {useChallenges} from "@/hooks/useChallenges";
import {memo} from "react";

const DeleteChallengeDialog = memo(({
                                        showDialog,
                                        setShowDialog,
                                        challengeId,
                                    }: {
    showDialog: boolean;
    setShowDialog: (value: boolean) => void;
    challengeId: string;
}) => {
    const {deleteChallenge} = useChallenges();
    const handleDeleteChallenge = async () => {
        try {
            await deleteChallenge(challengeId);
            setShowDialog(false);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    return (
        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg flex items-center gap-2">
                        <Trash2 className="text-destructive"/>
                        Supprimer le challenge
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer ce challenge ?
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteChallenge}>
                        Supprimer
                    </AlertDialogAction>
                    <AlertDialogCancel className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                                       onClick={() => setShowDialog(false)}>
                        Annuler
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
});

DeleteChallengeDialog.displayName = 'DeleteChallengeDialog';

export default DeleteChallengeDialog;