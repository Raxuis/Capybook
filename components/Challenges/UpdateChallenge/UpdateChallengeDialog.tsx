import React, {memo} from 'react';
import {useChallengeCrudModalStore} from "@/store/challengeCrudModalStore";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import UpdateChallengeForm from './UpdateChallengeForm';
import {useToast} from "@/hooks/use-toast";
import z from "zod";
import {UpdateChallengeSchema} from "@/utils/zod";
import {useChallenges} from "@/hooks/useChallenges";
import {useBadgeQueue} from "@/Context/BadgeQueueContext";

const UpdateChallengeDialog = memo(() => {
    const {updateChallenge} = useChallenges();
    const {
        isDialogOpen,
        modalType,
        closeDialog,
        setDialogOpen,
        modalData
    } = useChallengeCrudModalStore();

    const {addBadges} = useBadgeQueue();

    const {toast} = useToast();

    const handleSubmit = async (formData: z.infer<typeof UpdateChallengeSchema>) => {
        if (!modalData) {
            toast({
                title: 'Erreur',
                description: 'Aucune donnée de challenge fournie.',
                variant: 'destructive',
            });
            return;
        }

        try {
            const response = await updateChallenge(modalData.id, formData);

            if (response) {
                if (response.status !== 200) {
                    toast({
                        title: 'Erreur',
                        description: 'Impossible de mettre à jour le challenge.',
                        variant: 'destructive',
                    });
                    throw new Error('Erreur lors de la mise à jour du challenge');
                }
                if (response.data.badges && response.data.badges.newBadgesCount > 0) {
                    addBadges(response.data.badges.newBadges);
                }
                closeDialog();
                toast({
                    title: 'Succès',
                    description: 'Challenge mis à jour avec succès.',
                    variant: 'default',
                });
            }
        } catch (error) {
            console.error('Error updating challenge:', error);
            toast({
                title: 'Erreur',
                description: 'Une erreur est survenue lors de la mise à jour du challenge.',
                variant: 'destructive',
            });
            throw error;
        }
    };

    return (
        <Dialog
            open={isDialogOpen && modalType === 'update' && modalData !== null}
            onOpenChange={setDialogOpen}
        >
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        Mettre à jour le challenge de lecture
                    </DialogTitle>
                    <DialogDescription>
                        Modifiez les détails de votre challenge et suivez votre progression.
                    </DialogDescription>
                </DialogHeader>

                {modalData && (
                    <UpdateChallengeForm
                        initialData={modalData}
                        onSubmit={handleSubmit}
                        onCancel={closeDialog}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
});

UpdateChallengeDialog.displayName = 'UpdateChallengeDialog';

export default UpdateChallengeDialog;
