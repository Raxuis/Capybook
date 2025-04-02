import React, {memo} from 'react';
import {useChallengeCrudModalStore} from "@/store/challengeCrudModalStore";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import {Button} from "@/components/ui/button";
import UpdateChallengeForm from './UpdateChallengeForm';
import {useToast} from "@/hooks/use-toast";
import z from "zod";
import {UpdateChallengeSchema} from "@/utils/zod";
import {useChallenges} from "@/hooks/useChallenges";

const UpdateChallengeDialog = memo(() => {
    const {updateChallenge} = useChallenges();
    const {
        isDialogOpen,
        modalType,
        openUpdateDialog,
        closeDialog,
        setDialogOpen,
        modalData
    } = useChallengeCrudModalStore();

    console.log(modalData)

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
        console.log('Form data:', formData);
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
                console.log('Challenge updated successfully:', response);
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

export default UpdateChallengeDialog;
