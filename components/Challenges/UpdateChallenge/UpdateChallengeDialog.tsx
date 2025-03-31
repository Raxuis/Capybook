import React from 'react';
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

const UpdateChallengeDialog = () => {
    const {
        isDialogOpen,
        modalType,
        openUpdateDialog,
        closeDialog,
        setDialogOpen,
        modalData
    } = useChallengeCrudModalStore();

    const {toast} = useToast();

    const handleSubmit = async (formData: any) => {
        try {
            // Convertir en format ISO pour la base de données
            const dataToSubmit = {
                ...formData,
                deadline: formData.deadline.toISOString(),
                id: modalData?.id,
                userId: modalData?.userId
            };

            // Appel API pour mettre à jour le challenge
            const response = await fetch(`/api/reading-goals/${modalData?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSubmit),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour du challenge');
            }

            closeDialog();
            return await response.json();
        } catch (error) {
            console.error('Error updating challenge:', error);
            throw error;
        }
    };

    return (
        <Dialog
            open={isDialogOpen && modalType === 'update' && modalData !== null}
            onOpenChange={setDialogOpen}
        >
            <DialogTrigger asChild>
                <Button
                    onClick={() => modalData && openUpdateDialog(modalData)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 max-sm:w-full max-sm:mt-2">
                    Mettre à jour le challenge
                </Button>
            </DialogTrigger>
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
};

export default UpdateChallengeDialog;
